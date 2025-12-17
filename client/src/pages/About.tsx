import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Phone, Target, Eye, Heart, Award, Users, Clock, Shield } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Confiança",
    description: "Construímos relacionamentos sólidos baseados na transparência e honestidade com nossos clientes.",
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Buscamos constantemente a melhoria contínua em todos os nossos processos e serviços.",
  },
  {
    icon: Users,
    title: "Parceria",
    description: "Trabalhamos lado a lado com nossos clientes, entendendo suas necessidades e objetivos.",
  },
  {
    icon: Clock,
    title: "Compromisso",
    description: "Cumprimos prazos e mantemos nossos clientes sempre informados sobre suas obrigações.",
  },
];

const team = [
  {
    name: "Gabriel",
    department: "Departamento Fiscal",
    description: "Especialista em apuração de impostos e obrigações fiscais.",
    color: "from-amber-500 to-amber-700",
  },
  {
    name: "Samarah",
    department: "Departamento Fiscal",
    description: "Responsável por declarações e planejamento tributário.",
    color: "from-amber-500 to-amber-700",
  },
  {
    name: "Laura",
    department: "Departamento Contábil",
    description: "Coordena a escrituração contábil e elaboração de balanços.",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Janderley",
    department: "Departamento Pessoal",
    description: "Especialista em folha de pagamento e rotinas trabalhistas.",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Emily",
    department: "Departamento Pessoal",
    description: "Responsável por admissões, rescisões e benefícios.",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Júnior",
    department: "Departamento Pessoal",
    description: "Atua com E-Social e obrigações trabalhistas acessórias.",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "José",
    department: "Departamento Paralegal",
    description: "Especialista em abertura e regularização de empresas.",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Bruna",
    department: "Departamento Paralegal",
    description: "Responsável por documentação e processos legais.",
    color: "from-purple-500 to-purple-700",
  },
];

const departments = [
  { name: "Departamento Fiscal", color: "bg-amber-500", members: ["Gabriel", "Samarah"] },
  { name: "Departamento Contábil", color: "bg-emerald-500", members: ["Laura"] },
  { name: "Departamento Pessoal", color: "bg-blue-500", members: ["Janderley", "Emily", "Júnior"] },
  { name: "Departamento Paralegal", color: "bg-purple-500", members: ["José", "Bruna"] },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Sobre a <span className="text-gold-gradient">Contexto</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Conheça nossa história, missão e a equipe de profissionais dedicados 
              ao sucesso do seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">
                Nossa <span className="text-gold-gradient">História</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Fundada em 2019, a <strong className="text-foreground">Contexto Assessoria Contábil</strong> nasceu 
                  com o propósito de oferecer serviços contábeis de excelência para empresas de todos os portes 
                  em Goiânia e região.
                </p>
                <p>
                  Ao longo dos anos, construímos uma reputação sólida baseada na confiança, transparência e 
                  compromisso com os resultados dos nossos clientes. Nossa equipe de especialistas está sempre 
                  atualizada com as últimas mudanças na legislação para garantir o melhor suporte.
                </p>
                <p>
                  Hoje, atendemos mais de 100 empresas de diversos segmentos, oferecendo soluções personalizadas 
                  que vão desde a contabilidade básica até consultoria tributária estratégica.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
              <img
                src="/logo-modern.png"
                alt="Contexto Assessoria Contábil"
                className="relative w-full max-w-md mx-auto gold-glow rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-background border border-border rounded-2xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-4">Missão</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Simplificar a gestão contábil e fiscal das empresas, oferecendo soluções 
                personalizadas e suporte completo para que nossos clientes possam focar 
                no crescimento dos seus negócios.
              </p>
            </div>

            <div className="text-center p-8 bg-background border border-border rounded-2xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-4">Visão</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ser reconhecida como referência em assessoria contábil em Goiás, 
                destacando-se pela excelência no atendimento, inovação tecnológica 
                e compromisso com o sucesso dos clientes.
              </p>
            </div>

            <div className="text-center p-8 bg-background border border-border rounded-2xl">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-4">Valores</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ética, transparência, compromisso, excelência e parceria são os 
                pilares que guiam todas as nossas ações e relacionamentos com 
                clientes e colaboradores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Nossos <span className="text-gold-gradient">Valores</span>
            </h2>
            <p className="text-muted-foreground">
              Princípios que orientam nossa atuação e relacionamento com clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="p-6 bg-card border border-border rounded-2xl card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Nossa <span className="text-gold-gradient">Equipe</span>
            </h2>
            <p className="text-muted-foreground">
              Profissionais qualificados e dedicados ao sucesso do seu negócio.
            </p>
          </div>

          {/* Department Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {departments.map((dept, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                <span className="text-sm text-muted-foreground">{dept.name}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center p-6 bg-background border border-border rounded-2xl card-hover"
              >
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-3xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.department}</p>
                <p className="text-xs text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#C9A962] to-[#A68B4B]">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-black">
            Faça parte da nossa história
          </h2>
          <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato e descubra como podemos ajudar sua empresa a crescer com segurança.
          </p>
          <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-black text-white hover:bg-black/90 gap-2">
              <Phone className="h-5 w-5" />
              Falar com a Equipe
            </Button>
          </a>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
