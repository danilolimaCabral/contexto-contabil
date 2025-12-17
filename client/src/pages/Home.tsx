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
} from "lucide-react";

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
      cta: "Nunca mais perca prazos ou pague multas desnecessárias."
    }
  },
  {
    icon: Building2,
    title: "Abertura de Empresas",
    description: "Constituição e regularização de empresas de todos os portes e segmentos.",
    details: {
      intro: "Abra sua empresa de forma rápida, segura e com toda orientação necessária.",
      items: [
        "Abertura de MEI, ME, EPP e LTDA",
        "Registro na Junta Comercial",
        "Inscrição Municipal e Estadual",
        "Alvará de funcionamento",
        "Alterações contratuais",
        "Transformação de tipo societário",
        "Baixa de empresas",
        "Regularização de pendências"
      ],
      cta: "Comece seu negócio com o pé direito e toda documentação em ordem."
    }
  },
  {
    icon: Briefcase,
    title: "Apoio Administrativo",
    description: "Serviços de escritório e preparação de documentos especializados.",
    details: {
      intro: "Suporte completo para as demandas administrativas do seu negócio.",
      items: [
        "Emissão de certidões",
        "Preparação de documentos",
        "Protocolo em órgãos públicos",
        "Organização de arquivos",
        "Digitalização de documentos",
        "Atendimento a fiscalizações",
        "Suporte em licitações",
        "Assessoria documental"
      ],
      cta: "Foque no seu negócio enquanto cuidamos da burocracia."
    }
  },
];

const team = [
  { name: "Gabriel", department: "Departamento Fiscal", color: "from-amber-500 to-amber-700" },
  { name: "Samarah", department: "Departamento Fiscal", color: "from-amber-500 to-amber-700" },
  { name: "Laura", department: "Departamento Contábil", color: "from-emerald-500 to-emerald-700" },
  { name: "Janderley", department: "Departamento Pessoal", color: "from-blue-500 to-blue-700" },
  { name: "Emily", department: "Departamento Pessoal", color: "from-blue-500 to-blue-700" },
  { name: "Júnior", department: "Departamento Pessoal", color: "from-blue-500 to-blue-700" },
  { name: "José", department: "Departamento Paralegal", color: "from-purple-500 to-purple-700" },
  { name: "Bruna", department: "Departamento Paralegal", color: "from-purple-500 to-purple-700" },
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

export default function Home() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

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
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-3xl animate-pulse" />
                <img
                  src="/logo-final.png"
                  alt="Contexto Assessoria Contábil"
                  className="relative w-[500px] h-auto drop-shadow-[0_0_30px_rgba(201,169,98,0.4)] hover:drop-shadow-[0_0_50px_rgba(201,169,98,0.6)] transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Clickable Cards */}
      <section id="servicos" className="py-24 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Nossos <span className="text-gold-gradient">Serviços</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Clique em qualquer serviço para saber mais detalhes sobre como podemos ajudar sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => setSelectedService(service)}
                className="group p-6 bg-background border border-border rounded-2xl card-hover cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/servicos">
              <Button size="lg" className="btn-gold gap-2">
                Ver Todos os Serviços
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              {selectedService && (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <selectedService.icon className="h-6 w-6 text-primary" />
                </div>
              )}
              <DialogTitle className="font-serif text-2xl">{selectedService?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              {selectedService?.details.intro}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <h4 className="font-semibold text-foreground">O que oferecemos:</h4>
            <ul className="space-y-2">
              {selectedService?.details.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            
            <p className="text-sm text-primary font-medium pt-2 border-t border-border">
              {selectedService?.details.cta}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
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

      {/* Team Section */}
      <section id="equipe" className="py-24 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Nossa <span className="text-gold-gradient">Equipe</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Profissionais qualificados e dedicados ao sucesso do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center p-6 bg-background border border-border rounded-2xl card-hover"
              >
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mb-4`}>
                  <span className="text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.department}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <section className="py-24 bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Pronto para <span className="text-gold-gradient">simplificar</span> sua contabilidade?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer com segurança e tranquilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-gold gap-2">
                <Phone className="h-5 w-5" />
                Falar pelo WhatsApp
              </Button>
            </a>
            <Link href="/contato">
              <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                Enviar Mensagem
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
