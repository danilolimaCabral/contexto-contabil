import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Target,
  Download,
  RefreshCw
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = ['#C9A962', '#A68B4B', '#8B7355', '#6B5B45', '#4B4535'];
const STATUS_COLORS = {
  pending: '#EAB308',
  confirmed: '#3B82F6',
  completed: '#22C55E',
  cancelled: '#EF4444',
};

export default function Reports() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<string>("30");
  
  const { data: appointments, isLoading: loadingAppointments, refetch: refetchAppointments } = trpc.appointments.list.useQuery();
  const { data: leads, isLoading: loadingLeads, refetch: refetchLeads } = trpc.leads.list.useQuery();
  const { data: staff } = trpc.staff.list.useQuery();

  // Calculate date range
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = subDays(end, parseInt(period));
    return { start, end };
  }, [period]);

  // Filter data by period
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter(apt => {
      const date = new Date(apt.createdAt);
      return date >= dateRange.start && date <= dateRange.end;
    });
  }, [appointments, dateRange]);

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter(lead => {
      const date = new Date(lead.createdAt);
      return date >= dateRange.start && date <= dateRange.end;
    });
  }, [leads, dateRange]);

  // Appointments by status
  const appointmentsByStatus = useMemo(() => {
    const statusCount = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    filteredAppointments.forEach(apt => {
      if (apt.status in statusCount) {
        statusCount[apt.status as keyof typeof statusCount]++;
      }
    });
    return [
      { name: 'Pendentes', value: statusCount.pending, color: STATUS_COLORS.pending },
      { name: 'Confirmados', value: statusCount.confirmed, color: STATUS_COLORS.confirmed },
      { name: 'Concluídos', value: statusCount.completed, color: STATUS_COLORS.completed },
      { name: 'Cancelados', value: statusCount.cancelled, color: STATUS_COLORS.cancelled },
    ];
  }, [filteredAppointments]);

  // Leads by status
  const leadsByStatus = useMemo(() => {
    const statusCount: Record<string, number> = {};
    filteredLeads.forEach(lead => {
      statusCount[lead.status] = (statusCount[lead.status] || 0) + 1;
    });
    const statusLabels: Record<string, string> = {
      new: 'Novos',
      contacted: 'Contatados',
      qualified: 'Qualificados',
      converted: 'Convertidos',
      lost: 'Perdidos',
    };
    return Object.entries(statusCount).map(([status, count], index) => ({
      name: statusLabels[status] || status,
      value: count,
      color: COLORS[index % COLORS.length],
    }));
  }, [filteredLeads]);

  // Appointments per day (last 7 days)
  const appointmentsPerDay = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });
    
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const count = filteredAppointments.filter(apt => {
        const aptDate = format(new Date(apt.createdAt), 'yyyy-MM-dd');
        return aptDate === dayStr;
      }).length;
      
      return {
        name: format(day, 'EEE', { locale: ptBR }),
        date: format(day, 'dd/MM'),
        agendamentos: count,
      };
    });
  }, [filteredAppointments]);

  // Performance by team member
  const performanceByMember = useMemo(() => {
    if (!staff) return [];
    
    return staff.map(member => {
      const memberAppointments = filteredAppointments.filter(apt => apt.staffMemberId === member.id);
      const completed = memberAppointments.filter(apt => apt.status === 'completed').length;
      const total = memberAppointments.length;
      
      return {
        name: member.name,
        department: member.department,
        total,
        completed,
        taxa: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    }).filter(m => m.total > 0);
  }, [staff, filteredAppointments]);

  // Stats
  const stats = useMemo(() => {
    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(a => a.status === 'completed').length;
    const conversionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
    
    const totalLeads = filteredLeads.length;
    const convertedLeads = filteredLeads.filter(l => l.status === 'converted').length;
    const leadConversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return {
      totalAppointments,
      completedAppointments,
      conversionRate,
      totalLeads,
      convertedLeads,
      leadConversionRate,
    };
  }, [filteredAppointments, filteredLeads]);

  const handleRefresh = () => {
    refetchAppointments();
    refetchLeads();
  };

  const isLoading = loadingAppointments || loadingLeads;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">
              Análise de desempenho e métricas do escritório
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRefresh} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedAppointments} concluídos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Agendamentos concluídos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                {stats.convertedLeads} convertidos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversão de Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadConversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Leads convertidos em clientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments per Day */}
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos por Dia</CardTitle>
              <CardDescription>Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Carregando...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="agendamentos" fill="#C9A962" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Appointments by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos por Status</CardTitle>
              <CardDescription>Distribuição atual</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Carregando...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {appointmentsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Leads por Status</CardTitle>
              <CardDescription>Funil de conversão</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || leadsByStatus.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {isLoading ? 'Carregando...' : 'Nenhum lead no período'}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leadsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Performance by Team Member */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Membro</CardTitle>
              <CardDescription>Agendamentos atribuídos e concluídos</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || performanceByMember.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {isLoading ? 'Carregando...' : 'Nenhum dado disponível'}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceByMember} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#888" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="total" name="Total" fill="#C9A962" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="completed" name="Concluídos" fill="#22C55E" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Table */}
        {performanceByMember.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tabela de Desempenho</CardTitle>
              <CardDescription>Detalhamento por membro da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Membro</th>
                      <th className="text-left py-3 px-4 font-medium">Departamento</th>
                      <th className="text-center py-3 px-4 font-medium">Total</th>
                      <th className="text-center py-3 px-4 font-medium">Concluídos</th>
                      <th className="text-center py-3 px-4 font-medium">Taxa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceByMember.map((member, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">{member.name}</td>
                        <td className="py-3 px-4 text-muted-foreground capitalize">{member.department}</td>
                        <td className="py-3 px-4 text-center">{member.total}</td>
                        <td className="py-3 px-4 text-center text-green-500">{member.completed}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.taxa >= 80 ? 'bg-green-500/20 text-green-500' :
                            member.taxa >= 50 ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {member.taxa}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
