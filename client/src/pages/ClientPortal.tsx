import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Hourglass,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-500", icon: Hourglass },
  in_progress: { label: "Em Andamento", color: "bg-blue-500/10 text-blue-500", icon: RefreshCw },
  awaiting_docs: { label: "Aguardando Documentos", color: "bg-orange-500/10 text-orange-500", icon: FileText },
  review: { label: "Em Revisão", color: "bg-purple-500/10 text-purple-500", icon: FileCheck },
  completed: { label: "Concluído", color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "bg-red-500/10 text-red-500", icon: AlertCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Baixa", color: "bg-gray-500/10 text-gray-500" },
  medium: { label: "Média", color: "bg-blue-500/10 text-blue-500" },
  high: { label: "Alta", color: "bg-orange-500/10 text-orange-500" },
  urgent: { label: "Urgente", color: "bg-red-500/10 text-red-500" },
};

export default function ClientPortal() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"services" | "history">("services");

  // Fetch client data
  const { data: clientData, isLoading: clientLoading } = trpc.clients.getMyProfile.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch client services
  const { data: services, isLoading: servicesLoading } = trpc.clients.getMyServices.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Banner de Atração */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Portal do Cliente
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                O que você <span className="text-gold-gradient">precisar</span>,<br />
                estamos à <span className="text-gold-gradient">disposição</span>
              </h1>
              
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                Acompanhe seus serviços, documentos e solicitações em tempo real. 
                Tudo o que você precisa para gerenciar sua contabilidade em um só lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={getLoginUrl()}>
                  <Button className="btn-gold gap-2 text-lg px-8 py-6">
                    <User className="h-5 w-5" />
                    Acessar Minha Conta
                  </Button>
                </a>
                <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 text-lg px-8 py-6">
                    <Phone className="h-5 w-5" />
                    Falar com Especialista
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios do Portal */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Acompanhe Serviços</h3>
                <p className="text-muted-foreground">
                  Veja o status de todos os seus serviços contratados em tempo real
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Histórico Completo</h3>
                <p className="text-muted-foreground">
                  Acesse todo o histórico de atendimentos e documentos processados
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Suporte Direto</h3>
                <p className="text-muted-foreground">
                  Chat ao vivo com nossa equipe para tirar dúvidas e fazer solicitações
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header do Portal */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">
                Olá, <span className="text-gold-gradient">{user?.name || "Cliente"}</span>
              </h1>
              <p className="text-muted-foreground">
                Bem-vindo ao seu portal. Acompanhe seus serviços e solicitações.
              </p>
            </div>
            <Button className="btn-gold gap-2">
              <Phone className="h-5 w-5" />
              Solicitar Novo Serviço
            </Button>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-8">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Perfil */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <div className="space-y-3">
                  {clientData?.company && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{clientData.company}</span>
                    </div>
                  )}
                  {clientData?.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{clientData.phone}</span>
                    </div>
                  )}
                  {clientData?.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{clientData.email}</span>
                    </div>
                  )}
                </div>

                <div className="section-divider my-6" />

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === "services"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    Meus Serviços
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === "history"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Clock className="h-5 w-5" />
                    Histórico
                  </button>
                </nav>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-3">
              {/* Cards de Resumo */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {services?.filter(s => s.status === "in_progress").length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Em Andamento</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <Hourglass className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {services?.filter(s => s.status === "pending" || s.status === "awaiting_docs").length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {services?.filter(s => s.status === "completed").length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Concluídos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Serviços */}
              <div className="bg-card border border-border rounded-2xl">
                <div className="p-6 border-b border-border">
                  <h2 className="font-serif text-xl font-bold">
                    {activeTab === "services" ? "Meus Serviços" : "Histórico de Serviços"}
                  </h2>
                </div>

                {servicesLoading ? (
                  <div className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando serviços...</p>
                  </div>
                ) : services && services.length > 0 ? (
                  <div className="divide-y divide-border">
                    {services
                      .filter(s => activeTab === "services" ? s.status !== "completed" : s.status === "completed")
                      .map((service) => {
                        const status = statusConfig[service.status] || statusConfig.pending;
                        const priority = priorityConfig[service.priority] || priorityConfig.medium;
                        const StatusIcon = status.icon;

                        return (
                          <div key={service.id} className="p-6 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${status.color} flex items-center justify-center flex-shrink-0`}>
                                  <StatusIcon className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-1">{service.serviceName}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {service.description || "Sem descrição"}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                      {status.label}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                                      Prioridade: {priority.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {service.dueDate && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Prazo: {new Date(service.dueDate).toLocaleDateString("pt-BR")}</span>
                                  </div>
                                )}
                                <Button variant="ghost" size="sm" className="gap-1">
                                  Ver Detalhes
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Nenhum serviço encontrado</h3>
                    <p className="text-muted-foreground mb-6">
                      Você ainda não possui serviços contratados ou em andamento.
                    </p>
                    <a href="https://wa.me/5562990700393" target="_blank" rel="noopener noreferrer">
                      <Button className="btn-gold gap-2">
                        <Phone className="h-5 w-5" />
                        Solicitar Serviço
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
