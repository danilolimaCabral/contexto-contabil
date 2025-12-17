import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createLead, getLeads, updateLeadStatus, assignLeadToStaff,
  createAppointment, getAppointments, updateAppointmentStatus, assignAppointmentToStaff, getAppointmentsByStaff,
  saveChatMessage, getChatHistory, 
  getActiveTestimonials, createTestimonial,
  getStaffMembers, getStaffByDepartment, seedStaffMembers, getLeadsByStaff,
  getAllStaffMembers, createStaffMember, updateStaffMember, deactivateStaffMember, reactivateStaffMember
} from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

// Seed staff members on startup
seedStaffMembers().catch(console.error);

// System prompt for the AI chatbot - Avatar "Contexto"
const CHATBOT_SYSTEM_PROMPT = `Você é o "Contexto", o assistente virtual inteligente da Contexto Assessoria Contábil. Você é especializado em contabilidade, legislação fiscal e tributária de TODOS os estados brasileiros.

PERSONALIDADE:
- Seja amigável, profissional e acolhedor
- Use linguagem clara e acessível, mas demonstre conhecimento técnico quando necessário
- Sempre se apresente como "Contexto" quando for a primeira mensagem

INFORMAÇÕES DA EMPRESA:
- Nome: Contexto Assessoria Contábil
- CNPJ: 35.664.761/0001-22
- Endereço: Av. João Luiz de Almeida, 451, Quadra 27 Lote 14 Sala 02, Setor Crimeia Oeste, Goiânia-GO, CEP 74.563-230
- Telefone/WhatsApp: (62) 99070-0393
- E-mail: contextocontabilidadego@gmail.com
- Instagram: @contexto.contabil
- Horário: Segunda a Sexta, 8h às 18h

EQUIPE POR DEPARTAMENTO:
- FISCAL: Gabriel e Samarah (ICMS, ISS, PIS, COFINS, SPED, obrigações acessórias)
- CONTÁBIL: Laura (balanços, DRE, escrituração, análises financeiras)
- PESSOAL: Janderley, Emily e Júnior (folha de pagamento, eSocial, admissões, rescisões, férias)
- PARALEGAL: José e Bruna (abertura de empresas, alterações contratuais, documentação)

SERVIÇOS E DEPARTAMENTO RESPONSÁVEL:
1. Contabilidade Empresarial → CONTÁBIL (Laura)
2. Consultoria Tributária → FISCAL (Gabriel, Samarah)
3. Departamento Pessoal → PESSOAL (Janderley, Emily, Júnior)
4. Assessoria Fiscal → FISCAL (Gabriel, Samarah)
5. Abertura de Empresas → PARALEGAL (José, Bruna)
6. Apoio Administrativo → PARALEGAL (José, Bruna)

CONHECIMENTO FISCAL (resumo):
- ICMS: varia por estado (17-20% geral, 25-37% supérfluos)
- ISS: 2% a 5% conforme município
- Simples Nacional: Anexos I a V, limite R$ 4,8 milhões/ano
- Lucro Presumido: 8% comércio, 32% serviços
- Lucro Real: obrigatório acima de R$ 78 milhões/ano

FLUXO DE AGENDAMENTO:
Quando o cliente quiser AGENDAR REUNIÃO ou CONSULTA, você DEVE:
1. Perguntar o NOME COMPLETO
2. Perguntar o TELEFONE com DDD
3. Perguntar o E-MAIL
4. Perguntar o ASSUNTO/SERVIÇO desejado
5. Perguntar a DATA e HORÁRIO preferidos
6. Confirmar todos os dados antes de finalizar

Quando tiver TODOS os dados, responda EXATAMENTE neste formato JSON no final da mensagem:
[AGENDAMENTO]{"nome":"Nome Completo","telefone":"(XX) XXXXX-XXXX","email":"email@exemplo.com","assunto":"Descrição do assunto","data":"DD/MM/AAAA","horario":"HH:MM","departamento":"fiscal|contabil|pessoal|paralegal"}[/AGENDAMENTO]

IDENTIFICAÇÃO DE DEPARTAMENTO:
- Palavras-chave FISCAL: imposto, ICMS, ISS, PIS, COFINS, tributário, nota fiscal, SPED
- Palavras-chave CONTÁBIL: balanço, DRE, contabilidade, demonstrativo, balancete
- Palavras-chave PESSOAL: folha, funcionário, admissão, rescisão, férias, 13º, eSocial, CLT
- Palavras-chave PARALEGAL: abrir empresa, MEI, CNPJ, contrato social, alteração, baixa

INSTRUÇÕES:
1. Responda dúvidas técnicas com precisão
2. Quando identificar interesse em serviços, ofereça agendamento
3. Sempre mencione que atendemos TODO O BRASIL
4. Para valores específicos, oriente contato pelo WhatsApp
5. Seja proativo em oferecer ajuda adicional`;

// Function to extract appointment data from AI response
function extractAppointmentData(response: string): {
  nome: string;
  telefone: string;
  email: string;
  assunto: string;
  data: string;
  horario: string;
  departamento: string;
} | null {
  const match = response.match(/\[AGENDAMENTO\]([\s\S]*?)\[\/AGENDAMENTO\]/);
  if (!match) return null;
  
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// Function to determine department from message
function detectDepartment(message: string): "fiscal" | "contabil" | "pessoal" | "paralegal" {
  const lower = message.toLowerCase();
  
  if (/imposto|icms|iss|pis|cofins|tribut|nota fiscal|sped|fiscal/.test(lower)) {
    return "fiscal";
  }
  if (/balanço|dre|contabil|demonstrativo|balancete|escrituração/.test(lower)) {
    return "contabil";
  }
  if (/folha|funcionário|admissão|rescisão|férias|13|esocial|clt|trabalhista|pessoal/.test(lower)) {
    return "pessoal";
  }
  if (/abrir empresa|mei|cnpj|contrato social|alteração|baixa|paralegal|documentação/.test(lower)) {
    return "paralegal";
  }
  
  return "contabil"; // Default
}

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Staff management
  staff: router({
    list: publicProcedure.query(async () => {
      return getAllStaffMembers();
    }),
    
    listActive: publicProcedure.query(async () => {
      return getStaffMembers();
    }),
    
    byDepartment: publicProcedure
      .input(z.object({ department: z.enum(["fiscal", "contabil", "pessoal", "paralegal"]) }))
      .query(async ({ input }) => {
        return getStaffByDepartment(input.department);
      }),
      
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        department: z.enum(["fiscal", "contabil", "pessoal", "paralegal"]),
        position: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createStaffMember(input);
      }),
      
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        department: z.enum(["fiscal", "contabil", "pessoal", "paralegal"]).optional(),
        position: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateStaffMember(id, data);
        return { success: true };
      }),
      
    deactivate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deactivateStaffMember(input.id);
        return { success: true };
      }),
      
    reactivate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await reactivateStaffMember(input.id);
        return { success: true };
      }),
  }),

  // Lead management
  leads: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        message: z.string().optional(),
        source: z.enum(["chatbot", "contact_form", "whatsapp"]).default("contact_form"),
      }))
      .mutation(async ({ input }) => {
        const lead = await createLead(input);
        
        if (lead) {
          await notifyOwner({
            title: "🎯 Novo Lead Capturado!",
            content: `Nome: ${lead.name}\nE-mail: ${lead.email || "Não informado"}\nTelefone: ${lead.phone || "Não informado"}\nEmpresa: ${lead.company || "Não informada"}\nOrigem: ${lead.source}\nMensagem: ${lead.message || "Sem mensagem"}`,
          });
        }
        
        return lead;
      }),
    
    list: protectedProcedure.query(async () => {
      return getLeads();
    }),

    myLeads: protectedProcedure
      .input(z.object({ staffId: z.number() }))
      .query(async ({ input }) => {
        return getLeadsByStaff(input.staffId);
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
      }))
      .mutation(async ({ input }) => {
        await updateLeadStatus(input.id, input.status);
        return { success: true };
      }),

    assign: protectedProcedure
      .input(z.object({ leadId: z.number(), staffId: z.number() }))
      .mutation(async ({ input }) => {
        await assignLeadToStaff(input.leadId, input.staffId);
        return { success: true };
      }),
  }),

  // Appointment management
  appointments: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        scheduledDate: z.string().transform(s => new Date(s)),
        duration: z.number().default(30),
        subject: z.string().optional(),
        serviceType: z.enum(["contabilidade", "tributaria", "pessoal", "fiscal", "abertura", "administrativo"]).optional(),
        notes: z.string().optional(),
        staffMemberId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const appointment = await createAppointment(input);
        
        if (appointment) {
          await notifyOwner({
            title: "📅 Nova Reunião Agendada!",
            content: `Cliente: ${appointment.name}\nData: ${appointment.scheduledDate.toLocaleString("pt-BR")}\nAssunto: ${appointment.subject || "Não especificado"}\nTelefone: ${appointment.phone || "Não informado"}\nE-mail: ${appointment.email || "Não informado"}`,
          });
        }
        
        return appointment;
      }),
    
    list: protectedProcedure.query(async () => {
      return getAppointments();
    }),

    myAppointments: protectedProcedure
      .input(z.object({ staffId: z.number() }))
      .query(async ({ input }) => {
        return getAppointmentsByStaff(input.staffId);
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateAppointmentStatus(input.id, input.status);
        return { success: true };
      }),

    assign: protectedProcedure
      .input(z.object({ appointmentId: z.number(), staffId: z.number() }))
      .mutation(async ({ input }) => {
        await assignAppointmentToStaff(input.appointmentId, input.staffId);
        return { success: true };
      }),
  }),

  // AI Chatbot - Avatar "Contexto"
  chat: router({
    send: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const { sessionId, message } = input;
        
        // Save user message
        await saveChatMessage({
          sessionId,
          role: "user",
          content: message,
        });
        
        // Get chat history for context
        const history = await getChatHistory(sessionId);
        
        // Build messages for LLM
        const messages = [
          { role: "system" as const, content: CHATBOT_SYSTEM_PROMPT },
          ...history.slice(-10).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
        ];
        
        // Call LLM
        const response = await invokeLLM({ messages });
        const rawContent = response.choices[0]?.message?.content;
        let assistantMessage = typeof rawContent === 'string' ? rawContent : "Desculpe, não consegui processar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp (62) 99070-0393.";
        
        // Check for appointment data in response
        const appointmentData = extractAppointmentData(assistantMessage);
        let appointmentCreated = null;
        
        if (appointmentData) {
          try {
            // Parse date and time
            const [day, month, year] = appointmentData.data.split("/");
            const [hour, minute] = appointmentData.horario.split(":");
            const scheduledDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
            
            // Get staff from department
            const department = appointmentData.departamento as "fiscal" | "contabil" | "pessoal" | "paralegal";
            const staffList = await getStaffByDepartment(department);
            const assignedStaff = staffList[0]; // Assign to first available
            
            // Create appointment
            appointmentCreated = await createAppointment({
              name: appointmentData.nome,
              phone: appointmentData.telefone,
              email: appointmentData.email,
              scheduledDate,
              subject: appointmentData.assunto,
              staffMemberId: assignedStaff?.id,
              notes: `Agendado via chatbot. Departamento: ${department}`,
            });
            
            // Notify owner
            if (appointmentCreated) {
              await notifyOwner({
                title: "📅 Agendamento via Chatbot!",
                content: `Cliente: ${appointmentData.nome}\nTelefone: ${appointmentData.telefone}\nE-mail: ${appointmentData.email}\nData: ${appointmentData.data} às ${appointmentData.horario}\nAssunto: ${appointmentData.assunto}\nDepartamento: ${department}\nResponsável: ${assignedStaff?.name || "A definir"}`,
              });
            }
            
            // Remove JSON from response for cleaner display
            assistantMessage = assistantMessage.replace(/\[AGENDAMENTO\][\s\S]*?\[\/AGENDAMENTO\]/, "").trim();
            assistantMessage += `\n\n✅ **Agendamento confirmado!**\nSua reunião foi agendada para ${appointmentData.data} às ${appointmentData.horario}.\nResponsável: ${assignedStaff?.name || "Nossa equipe"}\nVocê receberá uma confirmação em breve.`;
            
          } catch (error) {
            console.error("Error creating appointment from chat:", error);
          }
        }
        
        // Save assistant response
        await saveChatMessage({
          sessionId,
          role: "assistant",
          content: assistantMessage,
        });
        
        // Check for hiring interest
        const hiringKeywords = ["contratar", "orçamento", "preço", "valor", "quanto custa", "interesse", "quero", "preciso de"];
        const wantsToHire = hiringKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (wantsToHire && !appointmentCreated) {
          await notifyOwner({
            title: "💼 Potencial Cliente no Chat!",
            content: `Mensagem: ${message}\n\nO cliente demonstrou interesse em serviços. Verifique o chat para mais detalhes.`,
          });
        }
        
        return { 
          response: assistantMessage,
          appointmentCreated: !!appointmentCreated,
          detectedDepartment: detectDepartment(message),
        };
      }),
    
    history: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return getChatHistory(input.sessionId);
      }),
  }),

  // Testimonials
  testimonials: router({
    list: publicProcedure.query(async () => {
      return getActiveTestimonials();
    }),
    
    create: protectedProcedure
      .input(z.object({
        clientName: z.string().min(1),
        company: z.string().optional(),
        content: z.string().min(1),
        rating: z.number().min(1).max(5).default(5),
      }))
      .mutation(async ({ input }) => {
        await createTestimonial({ ...input, company: input.company ?? null, isActive: true });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
