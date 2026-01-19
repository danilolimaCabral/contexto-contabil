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
  getAllStaffMembers, createStaffMember, updateStaffMember, deactivateStaffMember, reactivateStaffMember,
  getClientByUserId, createClient, updateClient, getClientServices, getAllClientServices, createClientService, updateClientServiceStatus, getServiceUpdates, getAllClients,
  createClientDocument, getClientDocuments, getDocumentById, deleteClientDocument, markDocumentAsProcessed, getAllClientDocuments,
  createServiceRequest, getClientServiceRequests, getAllServiceRequests, updateServiceRequestStatus, convertServiceRequestToService,
  getActiveNews, getFeaturedNews, getNewsByCategory, getNewsById, incrementNewsViewCount, createNews, updateNews, deleteNews, getAllNews, seedInitialNews, searchNews
} from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

// Seed staff members and news on startup
seedStaffMembers().catch(console.error);
seedInitialNews().catch(console.error);

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
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2),
      }))
      .mutation(async ({ input, ctx }) => {
        const { sdk } = await import("./_core/sdk");
        const user = await sdk.registerUser(input.email, input.password, input.name);
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: 365 * 24 * 60 * 60 * 1000,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: 365 * 24 * 60 * 60 * 1000 });
        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { sdk } = await import("./_core/sdk");
        const user = await sdk.loginUser(input.email, input.password);
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: 365 * 24 * 60 * 60 * 1000,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: 365 * 24 * 60 * 60 * 1000 });
        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
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

  // Client Portal
  clients: router({
    getMyProfile: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      return getClientByUserId(ctx.user.id);
    }),

    getMyServices: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const client = await getClientByUserId(ctx.user.id);
      if (!client) return [];
      return getClientServices(client.id);
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        cnpj: z.string().optional(),
        cpf: z.string().optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { success: false };
        let client = await getClientByUserId(ctx.user.id);
        
        if (!client) {
          // Create client profile if doesn't exist
          const newClient = await createClient({
            userId: ctx.user.id,
            name: input.name || ctx.user.name || "Cliente",
            email: ctx.user.email,
            phone: input.phone,
            company: input.company,
            cnpj: input.cnpj,
            cpf: input.cpf,
            address: input.address,
          });
        } else {
          await updateClient(client.id, input);
        }
        
        return { success: true };
      }),

    // Admin routes for managing clients
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") return [];
      return getAllClients();
    }),

    getAllServices: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") return [];
      return getAllClientServices();
    }),

    createService: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        serviceType: z.enum(["contabilidade", "tributaria", "pessoal", "fiscal", "abertura", "administrativo"]),
        serviceName: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        assignedToId: z.number().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") {
          return { success: false, error: "Unauthorized" };
        }
        
        const service = await createClientService({
          ...input,
          description: input.description ?? null,
          assignedToId: input.assignedToId ?? null,
          dueDate: input.dueDate ?? null,
        });
        
        return { success: true, service };
      }),

    updateServiceStatus: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        status: z.enum(["pending", "in_progress", "awaiting_docs", "review", "completed", "cancelled"]),
        message: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") {
          return { success: false, error: "Unauthorized" };
        }
        
        await updateClientServiceStatus(
          input.serviceId,
          input.status,
          input.message,
          ctx.user?.id
        );
        
        return { success: true };
      }),

    getServiceHistory: protectedProcedure
      .input(z.object({ serviceId: z.number() }))
      .query(async ({ input }) => {
        return getServiceUpdates(input.serviceId);
      }),

    // Document routes
    getMyDocuments: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const client = await getClientByUserId(ctx.user.id);
      if (!client) return [];
      return getClientDocuments(client.id);
    }),

    uploadDocument: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.enum(["fiscal", "contabil", "pessoal", "societario", "outros"]).default("outros"),
        fileName: z.string(),
        fileData: z.string(), // Base64 encoded file
        mimeType: z.string().optional(),
        serviceId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { success: false, error: "Unauthorized" };
        
        let client = await getClientByUserId(ctx.user.id);
        if (!client) {
          // Create client profile if doesn't exist
          const newClient = await createClient({
            userId: ctx.user.id,
            name: ctx.user.name || "Cliente",
            email: ctx.user.email,
          });
          if (!newClient) return { success: false, error: "Failed to create client" };
          client = newClient;
        }

        // Import storage helper
        const { storagePut } = await import("./storage");
        
        // Decode base64 and upload to S3
        const base64Data = input.fileData.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const fileKey = `clients/${client.id}/documents/${Date.now()}-${randomSuffix}-${input.fileName}`;
        
        const { url } = await storagePut(fileKey, buffer, input.mimeType || "application/octet-stream");
        
        const doc = await createClientDocument({
          clientId: client.id,
          serviceId: input.serviceId ?? null,
          title: input.title,
          description: input.description ?? null,
          category: input.category,
          fileName: input.fileName,
          fileKey,
          fileUrl: url,
          mimeType: input.mimeType ?? null,
          fileSize: buffer.length,
          uploadedById: ctx.user.id,
        });

        // Notify owner about new document
        await notifyOwner({
          title: "Novo documento enviado",
          content: `Cliente ${client.name} enviou um novo documento: ${input.title} (${input.category})`,
        });

        return { success: true, document: doc };
      }),

    deleteDocument: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { success: false, error: "Unauthorized" };
        
        const client = await getClientByUserId(ctx.user.id);
        if (!client) return { success: false, error: "Client not found" };

        const doc = await getDocumentById(input.id);
        if (!doc || doc.clientId !== client.id) {
          return { success: false, error: "Document not found or unauthorized" };
        }

        await deleteClientDocument(input.id);
        return { success: true };
      }),

    // Service request routes
    getMyServiceRequests: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const client = await getClientByUserId(ctx.user.id);
      if (!client) return [];
      return getClientServiceRequests(client.id);
    }),

    requestService: protectedProcedure
      .input(z.object({
        serviceType: z.enum(["contabilidade", "fiscal", "pessoal", "abertura_empresa", "alteracao_contratual", "certidoes", "consultoria", "outros"]),
        description: z.string().optional(),
        priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { success: false, error: "Unauthorized" };
        
        let client = await getClientByUserId(ctx.user.id);
        if (!client) {
          // Create client profile if doesn't exist
          const newClient = await createClient({
            userId: ctx.user.id,
            name: ctx.user.name || "Cliente",
            email: ctx.user.email,
          });
          if (!newClient) return { success: false, error: "Failed to create client" };
          client = newClient;
        }

        const request = await createServiceRequest({
          clientId: client.id,
          serviceType: input.serviceType,
          description: input.description ?? null,
          priority: input.priority,
        });

        // Notify owner about new service request
        await notifyOwner({
          title: "Nova solicitação de serviço",
          content: `Cliente ${client.name} solicitou: ${input.serviceType} (Prioridade: ${input.priority})\n${input.description || "Sem descrição adicional"}`,
        });

        return { success: true, request };
      }),

    // Admin routes for documents and requests
    getAllDocuments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") return [];
      return getAllClientDocuments();
    }),

    processDocument: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") {
          return { success: false, error: "Unauthorized" };
        }
        await markDocumentAsProcessed(input.id, ctx.user.id);
        return { success: true };
      }),

    getAllServiceRequests: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") return [];
      return getAllServiceRequests();
    }),

    updateServiceRequest: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "in_review", "approved", "converted", "rejected"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") {
          return { success: false, error: "Unauthorized" };
        }
        await updateServiceRequestStatus(input.id, input.status, ctx.user.id, input.notes);
        return { success: true };
      }),

    // Get client conversations (chat history)
    getMyConversations: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      // For now, return empty array - can be expanded to track chat sessions
      return [];
    }),
  }),

  // News
  news: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).default(20),
      }).optional())
      .query(async ({ input }) => {
        return getActiveNews(input?.limit || 20);
      }),

    featured: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(10).default(5),
      }).optional())
      .query(async ({ input }) => {
        return getFeaturedNews(input?.limit || 5);
      }),

    byCategory: publicProcedure
      .input(z.object({
        category: z.enum(["fiscal", "contabil", "tributario", "trabalhista", "previdenciario", "economia", "reforma_tributaria"]),
        limit: z.number().min(1).max(20).default(10),
      }))
      .query(async ({ input }) => {
        return getNewsByCategory(input.category, input.limit);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const newsItem = await getNewsById(input.id);
        if (newsItem) {
          await incrementNewsViewCount(input.id);
        }
        return newsItem;
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string().min(1).max(100),
        limit: z.number().min(1).max(50).default(20),
      }))
      .query(async ({ input }) => {
        return searchNews(input.query, input.limit);
      }),

    // Admin routes
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") return [];
      return getAllNews();
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        summary: z.string().optional(),
        content: z.string().optional(),
        category: z.enum(["fiscal", "contabil", "tributario", "trabalhista", "previdenciario", "economia", "reforma_tributaria"]),
        source: z.string().min(1),
        sourceUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        author: z.string().optional(),
        isFeatured: z.boolean().default(false),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") {
          return { success: false, error: "Unauthorized" };
        }
        const news = await createNews({
          ...input,
          summary: input.summary ?? null,
          content: input.content ?? null,
          sourceUrl: input.sourceUrl ?? null,
          imageUrl: input.imageUrl ?? null,
          author: input.author ?? null,
          publishedAt: input.publishedAt || new Date(),
        });
        return { success: true, news };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        summary: z.string().optional(),
        content: z.string().optional(),
        category: z.enum(["fiscal", "contabil", "tributario", "trabalhista", "previdenciario", "economia", "reforma_tributaria"]).optional(),
        source: z.string().optional(),
        sourceUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        isFeatured: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") {
          return { success: false, error: "Unauthorized" };
        }
        const { id, ...data } = input;
        await updateNews(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.role !== "staff") {
          return { success: false, error: "Unauthorized" };
        }
        await deleteNews(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
