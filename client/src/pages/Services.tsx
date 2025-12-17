import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  FileText,
  Users,
  Building2,
  ClipboardCheck,
  Briefcase,
  Phone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Calculator,
    title: "Contabilidade Empresarial",
    description: "Oferecemos serviços completos de escrituração contábil, elaboração de balanços patrimoniais, demonstrações de resultados e relatórios gerenciais. Nossa equipe garante que sua empresa esteja sempre em conformidade com as normas contábeis vigentes.",
    features: [
      "Escrituração contábil completa",
      "Balanço patrimonial",
      "Demonstração de resultados (DRE)",
      "Relatórios gerenciais personalizados",
      "Análise de indicadores financeiros",
      "Conciliação bancária",
    ],
  },
  {
    icon: FileText,
    title: "Consultoria e Auditoria Tributária",
    description: "Nossos especialistas analisam a situação fiscal da sua empresa para identificar oportunidades de economia tributária e garantir o cumprimento de todas as obrigações fiscais de forma otimizada.",
    features: [
      "Planejamento tributário estratégico",
      "Análise de regime tributário ideal",
      "Recuperação de créditos tributários",
      "Auditoria fiscal preventiva",
      "Consultoria em legislação tributária",
      "Defesa em processos administrativos",
    ],
  },
  {
    icon: Users,
    title: "Departamento Pessoal",
    description: "Gestão completa da folha de pagamento e todas as rotinas trabalhistas da sua empresa. Cuidamos de admissões, rescisões, férias, 13º salário e todas as obrigações acessórias.",
    features: [
      "Elaboração de folha de pagamento",
      "Admissões e rescisões",
      "Cálculo de férias e 13º salário",
      "E-Social e obrigações acessórias",
      "Gestão de benefícios",
      "Consultoria trabalhista",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Assessoria Fiscal",
    description: "Apuração precisa de todos os impostos e cumprimento rigoroso das obrigações acessórias. Mantemos sua empresa em dia com o fisco, evitando multas e penalidades.",
    features: [
      "Apuração de impostos federais, estaduais e municipais",
      "Emissão de guias de recolhimento",
      "Entrega de declarações fiscais",
      "SPED Fiscal e Contribuições",
      "Nota Fiscal Eletrônica",
      "Certidões negativas",
    ],
  },
  {
    icon: Building2,
    title: "Abertura e Regularização de Empresas",
    description: "Assessoria completa para constituição de novos negócios ou regularização de empresas existentes. Cuidamos de toda a burocracia para você focar no que realmente importa.",
    features: [
      "Abertura de MEI, ME, EPP e LTDA",
      "Alterações contratuais",
      "Encerramento de empresas",
      "Registro em órgãos competentes",
      "Alvarás e licenças",
      "Regularização cadastral",
    ],
  },
  {
    icon: Briefcase,
    title: "Serviços de Apoio Administrativo",
    description: "Serviços complementares de escritório e preparação de documentos especializados para atender todas as necessidades administrativas da sua empresa.",
    features: [
      "Preparação de documentos",
      "Organização de arquivos",
      "Protocolos em órgãos públicos",
      "Certidões e documentos legais",
      "Assessoria em licitações",
      "Suporte administrativo geral",
    ],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Nossos <span className="text-gold-gradient">Serviços</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Oferecemos soluções completas em contabilidade, consultoria tributária e 
              departamento pessoal para empresas de todos os portes e segmentos.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="container">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
                    <Button className="btn-gold gap-2">
                      <Phone className="h-5 w-5" />
                      Solicitar Orçamento
                    </Button>
                  </a>
                </div>

                <div className={`bg-card border border-border rounded-2xl p-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h3 className="font-semibold text-lg mb-6 text-primary">
                    O que está incluído:
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
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
            Não encontrou o que procura?
          </h2>
          <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e conte-nos sobre suas necessidades. 
            Teremos prazer em criar uma solução personalizada para sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-black text-white hover:bg-black/90 gap-2">
                <Phone className="h-5 w-5" />
                Falar pelo WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
