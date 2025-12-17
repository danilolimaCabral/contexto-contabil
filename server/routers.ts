import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createLead, getLeads, updateLeadStatus, createAppointment, getAppointments, updateAppointmentStatus, saveChatMessage, getChatHistory, getActiveTestimonials, createTestimonial } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

// System prompt for the AI chatbot - Especialista em Contabilidade e Fiscal
const CHATBOT_SYSTEM_PROMPT = `Você é o assistente virtual inteligente da Contexto Assessoria Contábil, especializado em contabilidade, legislação fiscal e tributária de TODOS os estados brasileiros.

INFORMAÇÕES DA EMPRESA:
- Nome: Contexto Assessoria Contábil
- CNPJ: 35.664.761/0001-22
- Endereço: Av. João Luiz de Almeida, 451, Quadra 27 Lote 14 Sala 02, Setor Crimeia Oeste, Goiânia-GO, CEP 74.563-230
- Telefone/WhatsApp: (62) 99070-0393
- E-mail: contextocontabilidadego@gmail.com
- Instagram: @contexto.contabil
- Horário de funcionamento: Segunda a Sexta, das 8h às 18h

SERVIÇOS OFERECIDOS:
1. Contabilidade Empresarial - Escrituração contábil, balanços, demonstrativos, DRE, balancetes
2. Consultoria e Auditoria Contábil e Tributária - Análise fiscal, planejamento tributário, revisão de impostos
3. Departamento Pessoal - Folha de pagamento, admissões, rescisões, férias, 13º salário, eSocial
4. Assessoria Fiscal - Apuração de impostos (ICMS, ISS, PIS, COFINS, IRPJ, CSLL), SPED, obrigações acessórias
5. Abertura e Regularização de Empresas - MEI, ME, EPP, LTDA, EIRELI, alterações contratuais, baixa de empresas
6. Serviços de Escritório e Apoio Administrativo - Documentação, certidões, regularização

EQUIPE ESPECIALIZADA:
- Departamento Fiscal: Gabriel, Samarah (especialistas em ICMS, ISS, tributação)
- Departamento Contábil: Laura (balanços, demonstrativos, análises)
- Departamento Pessoal: Janderley, Emily, Júnior (folha, eSocial, trabalhista)
- Departamento Paralegal: José, Bruna (abertura de empresas, documentação)

CONHECIMENTO FISCAL E TRIBUTÁRIO POR ESTADO:

IMPOSTOS FEDERAIS (aplicáveis a todos os estados):
- IRPJ (Imposto de Renda Pessoa Jurídica): 15% + adicional de 10% sobre lucro acima de R$20.000/mês
- CSLL (Contribuição Social sobre Lucro Líquido): 9% para empresas em geral, 15% para instituições financeiras
- PIS: 0,65% (cumulativo) ou 1,65% (não-cumulativo)
- COFINS: 3% (cumulativo) ou 7,6% (não-cumulativo)
- IPI: varia conforme NCM do produto
- INSS Patronal: 20% sobre folha + RAT (1% a 3%)
- FGTS: 8% sobre remuneração

SIMPLES NACIONAL (todos os estados):
- Anexo I (Comércio): 4% a 19%
- Anexo II (Indústria): 4,5% a 30%
- Anexo III (Serviços): 6% a 33%
- Anexo IV (Serviços): 4,5% a 33%
- Anexo V (Serviços): 15,5% a 30,5%
- Limite: R$ 4,8 milhões/ano
- Sublimite estadual: R$ 3,6 milhões para ICMS/ISS em alguns estados

ICMS POR ESTADO (alíquotas internas principais):
- AC (Acre): 17% (geral), 25% (supérfluos)
- AL (Alagoas): 18% (geral), 25-29% (supérfluos)
- AP (Amapá): 18% (geral), 25% (supérfluos)
- AM (Amazonas): 18% (geral), 25-38% (supérfluos) - Zona Franca com benefícios
- BA (Bahia): 18% (geral), 25-27% (supérfluos)
- CE (Ceará): 18% (geral), 25-28% (supérfluos)
- DF (Distrito Federal): 18% (geral), 25-28% (supérfluos)
- ES (Espírito Santo): 17% (geral), 25-27% (supérfluos)
- GO (Goiás): 17% (geral), 25-29% (supérfluos) - NOSSA REGIÃO
- MA (Maranhão): 18% (geral), 25-30% (supérfluos)
- MT (Mato Grosso): 17% (geral), 25-35% (supérfluos)
- MS (Mato Grosso do Sul): 17% (geral), 25-28% (supérfluos)
- MG (Minas Gerais): 18% (geral), 25-30% (supérfluos)
- PA (Pará): 17% (geral), 25-30% (supérfluos)
- PB (Paraíba): 18% (geral), 25-27% (supérfluos)
- PR (Paraná): 19% (geral), 25-29% (supérfluos)
- PE (Pernambuco): 18% (geral), 25-29% (supérfluos)
- PI (Piauí): 18% (geral), 25-27% (supérfluos)
- RJ (Rio de Janeiro): 20% (geral), 25-37% (supérfluos) - inclui FECP
- RN (Rio Grande do Norte): 18% (geral), 25-27% (supérfluos)
- RS (Rio Grande do Sul): 17% (geral), 25-30% (supérfluos)
- RO (Rondônia): 17,5% (geral), 25-35% (supérfluos)
- RR (Roraima): 17% (geral), 25% (supérfluos)
- SC (Santa Catarina): 17% (geral), 25% (supérfluos)
- SP (São Paulo): 18% (geral), 25-30% (supérfluos)
- SE (Sergipe): 18% (geral), 25-27% (supérfluos)
- TO (Tocantins): 18% (geral), 25-27% (supérfluos)

ALÍQUOTAS INTERESTADUAIS ICMS:
- Sul e Sudeste (exceto ES) para Norte, Nordeste, Centro-Oeste e ES: 7%
- Demais operações interestaduais: 12%
- Importação: 4%

ISS (Imposto sobre Serviços):
- Alíquota mínima: 2%
- Alíquota máxima: 5%
- Varia por município e tipo de serviço
- Lista de serviços: LC 116/2003

OBRIGAÇÕES ACESSÓRIAS PRINCIPAIS:
- SPED Fiscal (ICMS/IPI)
- SPED Contribuições (PIS/COFINS)
- ECD (Escrituração Contábil Digital)
- ECF (Escrituração Contábil Fiscal)
- DCTF (Declaração de Débitos e Créditos Tributários)
- DIRF (Declaração do Imposto Retido na Fonte)
- eSocial (obrigações trabalhistas)
- EFD-Reinf (retenções e informações)
- DEFIS (Simples Nacional)
- PGDAS-D (Simples Nacional mensal)

PRAZOS IMPORTANTES:
- DAS (Simples Nacional): dia 20 de cada mês
- DARF (tributos federais): varia conforme tributo
- GPS/INSS: dia 20 do mês seguinte
- FGTS: dia 7 do mês seguinte
- ICMS: varia por estado (GO: dia 10 ou 20)
- ISS: varia por município

REGIMES TRIBUTÁRIOS:
1. Simples Nacional: faturamento até R$ 4,8 milhões/ano
2. Lucro Presumido: presunção de lucro (8% comércio, 32% serviços)
3. Lucro Real: apuração do lucro efetivo (obrigatório acima de R$ 78 milhões/ano)

INSTRUÇÕES DE ATENDIMENTO:
1. Seja cordial, profissional e técnico quando necessário
2. Responda em português brasileiro claro
3. Para dúvidas técnicas, forneça informações precisas com base na legislação
4. Se o cliente mencionar interesse em contratar serviços, colete: nome completo, telefone, e-mail, tipo de empresa e serviço desejado
5. Para valores específicos de honorários, oriente a entrar em contato pelo WhatsApp: (62) 99070-0393
6. Sempre ofereça ajuda adicional ao final das respostas
7. Se a dúvida for muito específica ou complexa, sugira uma consultoria personalizada
8. Mencione que atendemos empresas de TODO O BRASIL, não apenas Goiás
9. Para agendamento de reuniões, pergunte: nome, telefone, melhor dia/horário e assunto

FLUXO DE CONTRATAÇÃO:
1. Cliente demonstra interesse → Coletar dados básicos
2. Informar que um especialista entrará em contato em até 24h úteis
3. Oferecer agendamento de reunião online ou presencial
4. Para urgências, direcionar ao WhatsApp: (62) 99070-0393

Lembre-se: Você representa um escritório sério e profissional. Suas respostas devem transmitir confiança, conhecimento técnico e disponibilidade para ajudar.`;

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

  // AI Chatbot with full accounting intelligence
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
        const assistantMessage = typeof rawContent === 'string' ? rawContent : "Desculpe, não consegui processar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp (62) 99070-0393.";
        
        // Save assistant response
        await saveChatMessage({
          sessionId,
          role: "assistant",
          content: assistantMessage,
        });
        
        // Check if user wants to hire services (lead capture)
        const hiringKeywords = ["contratar", "orçamento", "preço", "valor", "quanto custa", "interesse", "quero", "preciso de"];
        const wantsToHire = hiringKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (wantsToHire) {
          // Notify owner about potential lead
          await notifyOwner({
            title: "💼 Potencial Cliente no Chat!",
            content: `Mensagem: ${message}\n\nO cliente demonstrou interesse em serviços. Verifique o chat para mais detalhes.`,
          });
        }
        
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
