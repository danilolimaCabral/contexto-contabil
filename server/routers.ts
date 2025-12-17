import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createLead, getLeads, updateLeadStatus, createAppointment, getAppointments, updateAppointmentStatus, saveChatMessage, getChatHistory, getActiveTestimonials, createTestimonial } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

// System prompt for the AI chatbot
const CHATBOT_SYSTEM_PROMPT = `Você é o assistente virtual da Contexto Assessoria Contábil, um escritório de contabilidade localizado em Goiânia-GO.

INFORMAÇÕES DA EMPRESA:
- Nome: Contexto Assessoria Contábil
- CNPJ: 35.664.761/0001-22
- Endereço: Av. João Luiz de Almeida, 451, Quadra 27 Lote 14 Sala 02, Setor Crimeia Oeste, Goiânia-GO, CEP 74.563-230
- Telefone: (62) 9907-0393
- E-mail: contextocontabilidadego@gmail.com
- Instagram: @contexto.contabil
- Horário de funcionamento: Segunda a Sexta, das 8h às 18h

SERVIÇOS OFERECIDOS:
1. Contabilidade Empresarial - Escrituração contábil, balanços, demonstrativos
2. Consultoria e Auditoria Contábil e Tributária - Análise fiscal, planejamento tributário
3. Departamento Pessoal - Folha de pagamento, admissões, rescisões, férias
4. Assessoria Fiscal - Apuração de impostos, obrigações acessórias
5. Abertura e Regularização de Empresas - MEI, ME, LTDA, alterações contratuais
6. Serviços de Escritório e Apoio Administrativo - Documentação, certidões

EQUIPE:
- Departamento Fiscal: Gabriel, Samarah
- Departamento Contábil: Laura
- Departamento Pessoal: Janderley, Emily, Júnior
- Departamento Paralegal: José, Bruna

INSTRUÇÕES:
- Seja cordial, profissional e objetivo
- Responda em português brasileiro
- Se o cliente quiser agendar uma reunião, colete: nome, telefone, e-mail e melhor horário
- Se o cliente tiver dúvidas específicas sobre valores, oriente a entrar em contato pelo WhatsApp
- Sempre ofereça ajuda adicional ao final das respostas
- Se não souber responder algo específico, oriente o cliente a entrar em contato direto`;

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
        
        // Notify owner about new lead
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
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
      }))
      .mutation(async ({ input }) => {
        await updateLeadStatus(input.id, input.status);
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
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const appointment = await createAppointment(input);
        
        // Notify owner about new appointment
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
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateAppointmentStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // AI Chatbot
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
        const assistantMessage = typeof rawContent === 'string' ? rawContent : "Desculpe, não consegui processar sua mensagem. Por favor, tente novamente.";
        
        // Save assistant response
        await saveChatMessage({
          sessionId,
          role: "assistant",
          content: assistantMessage,
        });
        
        return { response: assistantMessage };
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
