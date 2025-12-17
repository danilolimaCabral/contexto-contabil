import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Phone,
  Mail,
  Building2,
  Filter,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  completed: "bg-green-500/20 text-green-500 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
};

const statusLabels = {
  pending: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const leadStatusColors = {
  new: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  qualified: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  converted: "bg-green-500/20 text-green-500 border-green-500/30",
  lost: "bg-red-500/20 text-red-500 border-red-500/30",
};

const leadStatusLabels = {
  new: "Novo",
  contacted: "Contatado",
  qualified: "Qualificado",
  converted: "Convertido",
  lost: "Perdido",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: appointments, isLoading: loadingAppointments, refetch: refetchAppointments } = trpc.appointments.list.useQuery();
  const { data: leads, isLoading: loadingLeads, refetch: refetchLeads } = trpc.leads.list.useQuery();
  const { data: staff } = trpc.staff.list.useQuery();
  
  const updateAppointmentStatus = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => refetchAppointments(),
  });
  
  const updateLeadStatus = trpc.leads.updateStatus.useMutation({
    onSuccess: () => refetchLeads(),
  });

  // Filter appointments by status
  const filteredAppointments = appointments?.filter(apt => 
    statusFilter === "all" || apt.status === statusFilter
  ) || [];

  // Stats
  const pendingCount = appointments?.filter(a => a.status === "pending").length || 0;
  const confirmedCount = appointments?.filter(a => a.status === "confirmed").length || 0;
  const completedCount = appointments?.filter(a => a.status === "completed").length || 0;
  const newLeadsCount = leads?.filter(l => l.status === "new").length || 0;

  const handleRefresh = () => {
    refetchAppointments();
    refetchLeads();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.name || "Administrador"}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedCount}</div>
              <p className="text-xs text-muted-foreground">Reuniões agendadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newLeadsCount}</div>
              <p className="text-xs text-muted-foreground">Aguardando contato</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2">
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Building2 className="h-4 w-4" />
              Equipe
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="completed">Concluídos</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loadingAppointments ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum agendamento encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{appointment.name}</h3>
                              <p className="text-sm text-muted-foreground">{appointment.subject || "Sem assunto"}</p>
                            </div>
                            <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                              {statusLabels[appointment.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(appointment.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </div>
                            {appointment.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {appointment.phone}
                              </div>
                            )}
                            {appointment.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {appointment.email}
                              </div>
                            )}
                          </div>
                          
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex md:flex-col gap-2 p-4 bg-muted/30 border-t md:border-t-0 md:border-l border-border">
                          {appointment.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => updateAppointmentStatus.mutate({ id: appointment.id, status: "confirmed" })}
                                className="gap-1"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Confirmar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateAppointmentStatus.mutate({ id: appointment.id, status: "cancelled" })}
                                className="gap-1"
                              >
                                <XCircle className="h-4 w-4" />
                                Cancelar
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateAppointmentStatus.mutate({ id: appointment.id, status: "completed" })}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Concluir
                            </Button>
                          )}
                          {(appointment.status === "completed" || appointment.status === "cancelled") && (
                            <span className="text-xs text-muted-foreground text-center">
                              {appointment.status === "completed" ? "Reunião concluída" : "Reunião cancelada"}
                            </span>
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
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : !leads || leads.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum lead encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{lead.name}</h3>
                            <Badge className={leadStatusColors[lead.status as keyof typeof leadStatusColors]}>
                              {leadStatusLabels[lead.status as keyof typeof leadStatusLabels]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {lead.source === "chatbot" ? "Chatbot" : lead.source === "contact_form" ? "Formulário" : "WhatsApp"}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {lead.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {lead.email}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {lead.phone}
                              </div>
                            )}
                            {lead.company && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {lead.company}
                              </div>
                            )}
                          </div>
                          
                          {lead.message && (
                            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                              {lead.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Select 
                            value={lead.status} 
                            onValueChange={(value) => updateLeadStatus.mutate({ id: lead.id, status: value as any })}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Novo</SelectItem>
                              <SelectItem value="contacted">Contatado</SelectItem>
                              <SelectItem value="qualified">Qualificado</SelectItem>
                              <SelectItem value="converted">Convertido</SelectItem>
                              <SelectItem value="lost">Perdido</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {lead.phone && (
                            <a href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                              <Button size="icon" variant="outline" className="text-green-500 hover:text-green-600">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {staff?.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${member.avatarColor || "from-primary to-primary/70"} flex items-center justify-center mb-3`}>
                      <span className="text-2xl font-bold text-white">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {member.department}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
