import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
} from "lucide-react";

const services = [
  {
    icon: Calculator,
    title: "Contabilidade Empresarial",
    description: "Escrituração contábil completa, balanços e demonstrativos financeiros para sua empresa.",
  },
  {
    icon: FileText,
    title: "Consultoria Tributária",
    description: "Planejamento tributário estratégico para otimizar a carga fiscal do seu negócio.",
  },
  {
    icon: Users,
    title: "Departamento Pessoal",
    description: "Gestão completa de folha de pagamento, admissões, rescisões e obrigações trabalhistas.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessoria Fiscal",
    description: "Apuração de impostos e cumprimento de todas as obrigações acessórias.",
  },
  {
    icon: Building2,
    title: "Abertura de Empresas",
    description: "Constituição e regularização de empresas de todos os portes e segmentos.",
  },
  {
    icon: Briefcase,
    title: "Apoio Administrativo",
    description: "Serviços de escritório e preparação de documentos especializados.",
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
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
                <img
                  src="/logo-modern.png"
                  alt="Contexto Assessoria Contábil"
                  className="relative w-96 h-auto gold-glow rounded-2xl"
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
              Oferecemos soluções completas em contabilidade para impulsionar o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 bg-background border border-border rounded-2xl card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
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
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.department}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-24 bg-background">
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
                className="p-6 bg-card border border-border rounded-2xl card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
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
      <section className="py-24 bg-gradient-to-r from-[#C9A962] to-[#A68B4B]">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-black">
            Pronto para simplificar sua contabilidade?
          </h2>
          <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer com segurança e tranquilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-black text-white hover:bg-black/90 gap-2">
                <Phone className="h-5 w-5" />
                Falar pelo WhatsApp
              </Button>
            </a>
            <Link href="/contato">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black/10 gap-2">
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
