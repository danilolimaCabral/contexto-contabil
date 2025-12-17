import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { 
  Calendar, 
  MessageCircle, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Filter,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MemberDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: appointments, isLoading: loadingAppointments, refetch: refetchAppointments } = trpc.appointments.list.useQuery();
  const { data: leads, isLoading: loadingLeads } = trpc.leads.list.useQuery();
  const { data: chatHistory, isLoading: loadingChat } = trpc.chat.history.useQuery({ sessionId: user?.openId || "" }, {
    enabled: !!user?.openId
  });

  const updateAppointmentStatus = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => refetchAppointments()
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">Acesso Restrito</CardTitle>
            <CardDescription>
              Faça login para acessar seu painel de atendimentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a href={getLoginUrl()} className="block">
              <Button className="w-full btn-gold">
                Entrar no Sistema
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter appointments
  const filteredAppointments = appointments?.filter(apt => {
    if (statusFilter !== "all" && apt.status !== statusFilter) return false;
    if (dateFilter === "today") {
      const today = new Date();
      const aptDate = new Date(apt.scheduledDate);
      return aptDate.toDateString() === today.toDateString();
    }
    if (dateFilter === "week") {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const aptDate = new Date(apt.scheduledDate);
      return aptDate >= weekAgo;
    }
    if (dateFilter === "month") {
      const today = new Date();
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const aptDate = new Date(apt.scheduledDate);
      return aptDate >= monthAgo;
    }
    return true;
  }) || [];

  const stats = {
    total: appointments?.length || 0,
    pending: appointments?.filter(a => a.status === "pending").length || 0,
    confirmed: appointments?.filter(a => a.status === "confirmed").length || 0,
    completed: appointments?.filter(a => a.status === "completed").length || 0,
    cancelled: appointments?.filter(a => a.status === "cancelled").length || 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Pendente</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Confirmado</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-xl font-bold">Meu Painel</h1>
                <p className="text-sm text-muted-foreground">Bem-vindo(a), {user?.name || "Usuário"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchAppointments()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                  <p className="text-xs text-muted-foreground">Confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.cancelled}</p>
                  <p className="text-xs text-muted-foreground">Cancelados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2">
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Conversas
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filtros:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo período</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Appointments List */}
            {loadingAppointments ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <Card key={apt.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{apt.name}</h3>
                            {getStatusBadge(apt.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{apt.email} • {apt.phone}</p>
                          <p className="text-sm">
                            <span className="text-primary font-medium">
                              {format(new Date(apt.scheduledDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </span>
                            {apt.subject && <span className="text-muted-foreground"> - {apt.subject}</span>}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {apt.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                                onClick={() => updateAppointmentStatus.mutate({ id: apt.id, status: "confirmed" })}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Confirmar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                                onClick={() => updateAppointmentStatus.mutate({ id: apt.id, status: "cancelled" })}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}
                          {apt.status === "confirmed" && (
                            <Button 
                              size="sm" 
                              className="btn-gold"
                              onClick={() => updateAppointmentStatus.mutate({ id: apt.id, status: "completed" })}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Concluir
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            {loadingLeads ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : !leads || leads.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum lead encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <Card key={lead.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{lead.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {lead.source === "chatbot" ? "Chatbot" : lead.source === "contact_form" ? "Formulário" : "WhatsApp"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{lead.email} • {lead.phone}</p>
                          {lead.company && <p className="text-sm text-primary">{lead.company}</p>}
                          {lead.message && <p className="text-sm text-muted-foreground line-clamp-2">{lead.message}</p>}
                        </div>
                        <div>
                          <Badge 
                            variant="outline" 
                            className={
                              lead.status === "new" ? "bg-blue-500/10 text-blue-500 border-blue-500/30" :
                              lead.status === "contacted" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                              lead.status === "qualified" ? "bg-purple-500/10 text-purple-500 border-purple-500/30" :
                              lead.status === "converted" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                              "bg-red-500/10 text-red-500 border-red-500/30"
                            }
                          >
                            {lead.status === "new" ? "Novo" :
                             lead.status === "contacted" ? "Contatado" :
                             lead.status === "qualified" ? "Qualificado" :
                             lead.status === "converted" ? "Convertido" : "Perdido"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Chat History Tab */}
          <TabsContent value="chat" className="space-y-4">
            {loadingChat ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : !chatHistory || chatHistory.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Conversas</CardTitle>
                  <CardDescription>Suas conversas com clientes via chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {chatHistory.map((msg: { role: string; content: string; createdAt: Date }, index: number) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === "user" 
                              ? "bg-muted text-foreground" 
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {format(new Date(msg.createdAt), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
