import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calculator,
  FileText,
  Users,
  Building2,
  ClipboardCheck,
  Briefcase,
  ArrowRight,
  Star,
  Phone,
  CheckCircle2,
  X,
  MessageCircle,
  Send,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const services = [
  {
    icon: Calculator,
    title: "Contabilidade Empresarial",
    description: "Escrituração contábil completa, balanços e demonstrativos financeiros para sua empresa.",
    details: {
      intro: "Nossa equipe de contabilidade oferece um serviço completo e personalizado para sua empresa.",
      items: [
        "Escrituração contábil mensal",
        "Elaboração de balanços patrimoniais",
        "Demonstração de Resultados (DRE)",
        "Balancetes mensais e trimestrais",
        "Livros contábeis obrigatórios",
        "Análise de indicadores financeiros",
        "Relatórios gerenciais personalizados",
        "Conciliação bancária"
      ],
      cta: "Ideal para empresas que buscam organização financeira e conformidade legal."
    }
  },
  {
    icon: FileText,
    title: "Consultoria Tributária",
    description: "Planejamento tributário estratégico para otimizar a carga fiscal do seu negócio.",
    details: {
      intro: "Maximize seus resultados com um planejamento tributário inteligente e legal.",
      items: [
        "Análise do melhor regime tributário",
        "Planejamento fiscal estratégico",
        "Revisão de tributos pagos",
        "Recuperação de créditos tributários",
        "Consultoria em ICMS, ISS, PIS, COFINS",
        "Orientação sobre incentivos fiscais",
        "Auditoria tributária preventiva",
        "Defesa em processos fiscais"
      ],
      cta: "Reduza legalmente sua carga tributária e aumente sua competitividade."
    }
  },
  {
    icon: Users,
    title: "Departamento Pessoal",
    description: "Gestão completa de folha de pagamento, admissões, rescisões e obrigações trabalhistas.",
    details: {
      intro: "Cuide do seu maior patrimônio: seus colaboradores. Deixe a burocracia conosco.",
      items: [
        "Folha de pagamento mensal",
        "Admissões e rescisões",
        "Férias e 13º salário",
        "eSocial e obrigações acessórias",
        "FGTS e INSS",
        "Controle de ponto e horas extras",
        "Orientação trabalhista",
        "Homologações e acordos"
      ],
      cta: "Evite passivos trabalhistas e mantenha sua empresa em conformidade."
    }
  },
  {
    icon: ClipboardCheck,
    title: "Assessoria Fiscal",
    description: "Apuração de impostos e cumprimento de todas as obrigações acessórias.",
    details: {
      intro: "Mantenha sua empresa em dia com o fisco sem preocupações.",
      items: [
        "Apuração de impostos federais, estaduais e municipais",
        "SPED Fiscal e Contribuições",
        "Emissão de guias de recolhimento",
        "Declarações acessórias (DCTF, DIRF, etc.)",
        "Escrituração de notas fiscais",
        "Controle de certidões negativas",
        "Parcelamentos de débitos",
        "Regularização fiscal"
      ],
      cta: "Fique tranquilo com todas as obrigações fiscais em dia."
    }
  },
  {
    icon: Building2,
    title: "Abertura de Empresas",
    description: "Constituição, alteração e baixa de empresas com agilidade e segurança.",
    details: {
      intro: "Realize seu sonho de empreender com toda a documentação em ordem.",
      items: [
        "Abertura de MEI, ME, EPP e LTDA",
        "Registro na Junta Comercial",
        "Obtenção de CNPJ",
        "Inscrição estadual e municipal",
        "Alvarás e licenças",
        "Alterações contratuais",
        "Transformação de tipo societário",
        "Baixa e encerramento de empresas"
      ],
      cta: "Comece seu negócio com o pé direito e toda a documentação correta."
    }
  },
  {
    icon: Briefcase,
    title: "Serviços Administrativos",
    description: "Apoio administrativo completo para otimizar a gestão do seu negócio.",
    details: {
      intro: "Terceirize tarefas administrativas e foque no que realmente importa: seu negócio.",
      items: [
        "Organização de documentos",
        "Controle de contas a pagar e receber",
        "Emissão de notas fiscais",
        "Gestão de contratos",
        "Relatórios financeiros",
        "Conciliação de extratos",
        "Arquivamento digital",
        "Suporte administrativo geral"
      ],
      cta: "Ganhe tempo e eficiência com nosso suporte administrativo."
    }
  },
];

const team = [
  { 
    id: "gabriel",
    name: "Gabriel", 
    department: "Departamento Fiscal", 
    departmentKey: "fiscal",
    avatar: "/avatars/gabriel.png",
    description: "Especialista em questões fiscais e tributárias"
  },
  { 
    id: "samarah",
    name: "Samarah", 
    department: "Departamento Fiscal", 
    departmentKey: "fiscal",
    avatar: "/avatars/samarah.png",
    description: "Especialista em ICMS e obrigações acessórias"
  },
  { 
    id: "laura",
    name: "Laura", 
    department: "Departamento Contábil", 
    departmentKey: "contabil",
    avatar: "/avatars/laura.png",
    description: "Especialista em contabilidade e balanços"
  },
  { 
    id: "janderley",
    name: "Janderley", 
    department: "Departamento Pessoal", 
    departmentKey: "pessoal",
    avatar: "/avatars/janderley.png",
    description: "Especialista em folha de pagamento"
  },
  { 
    id: "emily",
    name: "Emily", 
    department: "Departamento Pessoal", 
    departmentKey: "pessoal",
    avatar: "/avatars/emily.png",
    description: "Especialista em admissões e rescisões"
  },
  { 
    id: "junior",
    name: "Júnior", 
    department: "Departamento Pessoal", 
    departmentKey: "pessoal",
    avatar: "/avatars/junior.png",
    description: "Especialista em eSocial e obrigações trabalhistas"
  },
  { 
    id: "jose",
    name: "José", 
    department: "Departamento Paralegal", 
    departmentKey: "paralegal",
    avatar: "/avatars/jose.png",
    description: "Especialista em abertura e regularização de empresas"
  },
  { 
    id: "bruna",
    name: "Bruna", 
    department: "Departamento Paralegal", 
    departmentKey: "paralegal",
    avatar: "/avatars/bruna.png",
    description: "Especialista em documentação e alvarás"
  },
];

const testimonials = [
  {
    name: "Carlos Silva",
    company: "Tech Solutions LTDA",
    content: "A Contexto transformou a gestão contábil da minha empresa. Profissionais extremamente competentes e atenciosos.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    company: "Boutique Elegance",
    content: "Desde que contratamos a Contexto, nunca mais tivemos problemas com o fisco. Recomendo de olhos fechados!",
    rating: 5,
  },
  {
    name: "João Oliveira",
    company: "Construtora JO",
    content: "Excelente atendimento e suporte. A equipe está sempre disponível para tirar dúvidas e orientar nas melhores decisões.",
    rating: 5,
  },
];

const benefits = [
  "Mais de 5 anos de experiência no mercado",
  "Equipe especializada e atualizada",
  "Atendimento personalizado",
  "Tecnologia de ponta",
  "Compromisso com prazos",
  "Sigilo e segurança dos dados",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedMember, setSelectedMember] = useState<typeof team[0] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatMutation = trpc.chat.send.useMutation();

  const handleMemberClick = (member: typeof team[0]) => {
    setSelectedMember(member);
    setChatMessages([{
      role: "assistant",
      content: `Olá! Sou ${member.name} do ${member.department}. ${member.description}. Como posso ajudá-lo hoje?`
    }]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading || !selectedMember) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        sessionId: `staff-${selectedMember.id}-${Date.now()}`,
        message: `[Conversa com ${selectedMember.name} - ${selectedMember.department}] ${userMessage}`,
      });
      
      setChatMessages(prev => [...prev, { role: "assistant", content: response.response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato pelo WhatsApp." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A1A1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C9A962]/10 via-transparent to-transparent" />
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-primary">Escritório de Contabilidade em Goiânia</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Simplificamos sua{" "}
                <span className="text-gold-gradient">gestão contábil</span>{" "}
                para você crescer
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                A Contexto Assessoria Contábil oferece soluções personalizadas em contabilidade, 
                consultoria tributária e departamento pessoal para empresas de todos os portes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="btn-gold gap-2 text-base w-full sm:w-auto">
                    <Phone className="h-5 w-5" />
                    Fale com um Especialista
                  </Button>
                </a>
                <Link href="/servicos">
                  <Button size="lg" variant="outline" className="gap-2 text-base w-full sm:w-auto border-primary/30 hover:bg-primary/10">
                    Conheça Nossos Serviços
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div>
                  <p className="text-3xl font-bold text-primary">5+</p>
                  <p className="text-sm text-muted-foreground">Anos de Experiência</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">100+</p>
                  <p className="text-sm text-muted-foreground">Clientes Atendidos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">8</p>
                  <p className="text-sm text-muted-foreground">Especialistas</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative -mt-32">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/40 to-primary/20 rounded-full blur-2xl animate-pulse" />
                <img 
                  src="/logo-transparent-hero.png" 
                  alt="Contexto Assessoria Contábil" 
                  className="relative w-96 h-96 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Nossos <span className="text-gold-gradient">Serviços</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Soluções completas em contabilidade para impulsionar o crescimento da sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => setSelectedService(service)}
                className="group p-6 bg-background border border-border rounded-2xl card-hover cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-4">
              {selectedService && (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <selectedService.icon className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <DialogTitle className="font-serif text-2xl">{selectedService?.title}</DialogTitle>
                <DialogDescription>{selectedService?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            <p className="text-muted-foreground">{selectedService?.details.intro}</p>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {selectedService?.details.items.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-sm text-primary">{selectedService?.details.cta}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="btn-gold w-full gap-2">
                <Phone className="h-4 w-4" />
                Solicitar Orçamento
              </Button>
            </a>
            <Button variant="outline" onClick={() => setSelectedService(null)} className="border-primary/30">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Por que escolher a{" "}
                <span className="text-gold-gradient">Contexto?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Somos um escritório de contabilidade comprometido com a excelência e o sucesso dos nossos clientes. 
                Nossa equipe está sempre atualizada com as últimas mudanças na legislação para oferecer o melhor suporte.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-card border border-border rounded-2xl p-8">
                <h3 className="font-serif text-2xl font-semibold mb-6 text-center">
                  Agende uma Consulta Gratuita
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Converse com um de nossos especialistas e descubra como podemos ajudar sua empresa.
                </p>
                <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" className="btn-gold w-full gap-2">
                    <Phone className="h-5 w-5" />
                    Agendar Agora
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Clickable Avatars */}
      <section id="equipe" className="py-24 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Nossa <span className="text-gold-gradient">Equipe</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Clique em um membro da equipe para iniciar uma conversa direta.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                onClick={() => handleMemberClick(member)}
                className="group text-center p-6 bg-background border border-border rounded-2xl card-hover cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse group-hover:from-primary/40 group-hover:to-primary/20 transition-all" />
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="relative w-full h-full object-cover rounded-full border-2 border-primary/30 group-hover:border-primary transition-all group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Status Online Indicator */}
                  <div className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-background ${index % 3 === 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} 
                       title={index % 3 === 0 ? 'Online' : 'Offline'}
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.department}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className={`w-2 h-2 rounded-full ${index % 3 === 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <p className={`text-xs ${index % 3 === 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {index % 3 === 0 ? 'Online' : 'Offline'}
                  </p>
                </div>
                <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Clique para conversar
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Chat Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-lg bg-card border-border p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 border-b border-border">
            <div className="flex items-center gap-4">
              {selectedMember && (
                <>
                  <img 
                    src={selectedMember.avatar} 
                    alt={selectedMember.name}
                    className="w-14 h-14 rounded-full border-2 border-primary/50 object-cover"
                  />
                  <div>
                    <DialogTitle className="font-serif text-xl">{selectedMember.name}</DialogTitle>
                    <DialogDescription className="text-primary">{selectedMember.department}</DialogDescription>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-background border-border"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="btn-gold" disabled={isLoading || !chatInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Todas as conversas são gravadas para melhor atendimento
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              O que nossos <span className="text-gold-gradient">clientes</span> dizem
            </h2>
            <p className="text-muted-foreground text-lg">
              A satisfação dos nossos clientes é nossa maior conquista.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-card border border-border rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Pronto para simplificar sua{" "}
              <span className="text-gold-gradient">contabilidade?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer 
              com uma gestão contábil eficiente e personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="btn-gold gap-2 text-base">
                  <Phone className="h-5 w-5" />
                  Fale Conosco Agora
                </Button>
              </a>
              <Link href="/contato">
                <Button size="lg" variant="outline" className="gap-2 text-base border-primary/30 hover:bg-primary/10">
                  Ver Localização
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
