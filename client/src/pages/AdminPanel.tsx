import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { 
  Users, 
  UserPlus, 
  UserX, 
  Edit, 
  Shield,
  ArrowLeft,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

interface StaffMember {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  department: "fiscal" | "contabil" | "pessoal" | "paralegal";
  position: string | null;
  isActive: boolean | null;
  isOnline?: boolean | null;
  avatarColor: string | null;
}

const departmentLabels: Record<string, string> = {
  fiscal: "Departamento Fiscal",
  contabil: "Departamento Contábil",
  pessoal: "Departamento Pessoal",
  paralegal: "Departamento Paralegal"
};

const departmentColors: Record<string, string> = {
  fiscal: "bg-orange-500",
  contabil: "bg-green-500",
  pessoal: "bg-blue-500",
  paralegal: "bg-purple-500"
};

export default function AdminPanel() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "fiscal" as "fiscal" | "contabil" | "pessoal" | "paralegal",
    position: ""
  });

  const { data: staffMembers, isLoading: loadingStaff, refetch: refetchStaff } = trpc.staff.list.useQuery();
  
  const createStaff = trpc.staff.create.useMutation({
    onSuccess: () => {
      toast.success("Funcionário adicionado com sucesso!");
      refetchStaff();
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao adicionar funcionário: " + error.message);
    }
  });

  const updateStaff = trpc.staff.update.useMutation({
    onSuccess: () => {
      toast.success("Funcionário atualizado com sucesso!");
      refetchStaff();
      setEditingStaff(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar funcionário: " + error.message);
    }
  });

  const deactivateStaff = trpc.staff.deactivate.useMutation({
    onSuccess: () => {
      toast.success("Funcionário desativado com sucesso!");
      refetchStaff();
    },
    onError: (error) => {
      toast.error("Erro ao desativar funcionário: " + error.message);
    }
  });

  const reactivateStaff = trpc.staff.reactivate.useMutation({
    onSuccess: () => {
      toast.success("Funcionário reativado com sucesso!");
      refetchStaff();
    },
    onError: (error) => {
      toast.error("Erro ao reativar funcionário: " + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "fiscal",
      position: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff.mutate({
        id: editingStaff.id,
        ...formData
      });
    } else {
      createStaff.mutate(formData);
    }
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email || "",
      phone: staff.phone || "",
      department: staff.department,
      position: staff.position || ""
    });
  };

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
              Faça login para acessar o painel administrativo
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

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <CardTitle className="font-serif text-2xl">Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta área. Apenas administradores podem gerenciar funcionários.
            </CardDescription>
          </CardHeader>
          <CardContent>
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

  const activeStaff = staffMembers?.filter(s => s.isActive) || [];
  const inactiveStaff = staffMembers?.filter(s => !s.isActive) || [];

  const StaffForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome do funcionário"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(62) 99999-9999"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Departamento *</Label>
        <Select
          value={formData.department}
          onValueChange={(value: "fiscal" | "contabil" | "pessoal" | "paralegal") => 
            setFormData({ ...formData, department: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fiscal">Departamento Fiscal</SelectItem>
            <SelectItem value="contabil">Departamento Contábil</SelectItem>
            <SelectItem value="pessoal">Departamento Pessoal</SelectItem>
            <SelectItem value="paralegal">Departamento Paralegal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Cargo</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder="Ex: Analista Fiscal"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 btn-gold">
          {editingStaff ? "Salvar Alterações" : "Adicionar Funcionário"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setEditingStaff(null);
            setIsAddDialogOpen(false);
            resetForm();
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );

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
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="font-serif text-xl font-bold">Painel Administrativo</h1>
                  <p className="text-sm text-muted-foreground">Gerenciamento de Funcionários</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetchStaff()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-gold gap-2">
                    <UserPlus className="h-4 w-4" />
                    Novo Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Funcionário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo funcionário
                    </DialogDescription>
                  </DialogHeader>
                  <StaffForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeStaff.length}</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <UserX className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inactiveStaff.length}</p>
                  <p className="text-xs text-muted-foreground">Inativos</p>
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
                  <p className="text-2xl font-bold">{activeStaff.filter(s => s.isOnline).length}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Building2 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Departamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Users className="h-4 w-4" />
              Funcionários Ativos ({activeStaff.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="gap-2">
              <UserX className="h-4 w-4" />
              Desligados ({inactiveStaff.length})
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Métricas de Desempenho
            </TabsTrigger>
          </TabsList>

          {/* Active Staff */}
          <TabsContent value="active" className="space-y-4">
            {loadingStaff ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : activeStaff.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum funcionário ativo</p>
                  <Button className="mt-4 btn-gold gap-2" onClick={() => setIsAddDialogOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                    Adicionar Primeiro Funcionário
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeStaff.map((staff) => (
                  <Card key={staff.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${departmentColors[staff.department]} flex items-center justify-center text-white font-bold text-lg`}>
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{staff.name}</h3>
                            <p className="text-sm text-muted-foreground">{staff.position || "Sem cargo definido"}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${departmentColors[staff.department]}/10 border-${departmentColors[staff.department]}/30`}>
                          {departmentLabels[staff.department]}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {staff.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {staff.email}
                          </div>
                        )}
                        {staff.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {staff.phone}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(staff)}>
                              <Edit className="h-4 w-4" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Funcionário</DialogTitle>
                              <DialogDescription>
                                Atualize os dados de {staff.name}
                              </DialogDescription>
                            </DialogHeader>
                            <StaffForm />
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja desativar ${staff.name}?`)) {
                              deactivateStaff.mutate({ id: staff.id });
                            }
                          }}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Inactive Staff */}
          <TabsContent value="inactive" className="space-y-4">
            {inactiveStaff.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">Nenhum funcionário desligado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveStaff.map((staff) => (
                  <Card key={staff.id} className="opacity-60 hover:opacity-100 transition-opacity">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-lg">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{staff.name}</h3>
                            <p className="text-sm text-muted-foreground">{staff.position || "Sem cargo definido"}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                          Desligado
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">{departmentLabels[staff.department]}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-green-500 border-green-500/30 hover:bg-green-500/10 gap-2"
                          onClick={() => {
                            if (confirm(`Deseja reativar ${staff.name}?`)) {
                              reactivateStaff.mutate({ id: staff.id });
                            }
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Reativar Funcionário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Metrics */}
          <TabsContent value="metrics" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                      <p className="text-3xl font-bold text-green-500">78%</p>
                      <p className="text-xs text-green-500/70 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" /> +12% vs mês anterior
                      </p>
                    </div>
                    <Target className="h-10 w-10 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo Médio de Resposta</p>
                      <p className="text-3xl font-bold text-blue-500">2.4h</p>
                      <p className="text-xs text-blue-500/70 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> -30min vs mês anterior
                      </p>
                    </div>
                    <Clock className="h-10 w-10 text-blue-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Atendimentos/Mês</p>
                      <p className="text-3xl font-bold text-primary">156</p>
                      <p className="text-xs text-primary/70 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" /> +23 vs mês anterior
                      </p>
                    </div>
                    <Calendar className="h-10 w-10 text-primary/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfação do Cliente</p>
                      <p className="text-3xl font-bold text-purple-500">4.8</p>
                      <p className="text-xs text-purple-500/70 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" /> +0.3 vs mês anterior
                      </p>
                    </div>
                    <CheckCircle2 className="h-10 w-10 text-purple-500/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance by Staff */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Desempenho por Funcionário
                </CardTitle>
                <CardDescription>
                  Métricas individuais de atendimento e performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeStaff.map((staff, index) => {
                    const performance = [95, 88, 92, 85, 90, 87, 91, 89][index % 8];
                    const atendimentos = [28, 24, 31, 19, 22, 26, 20, 23][index % 8];
                    const tempoResposta = ["1.8h", "2.1h", "1.5h", "2.8h", "2.2h", "1.9h", "2.5h", "2.0h"][index % 8];
                    return (
                      <div key={staff.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className={`w-10 h-10 rounded-full ${departmentColors[staff.department]} flex items-center justify-center text-white font-bold`}>
                          {staff.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-xs text-muted-foreground">{departmentLabels[staff.department]}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-primary">{performance}%</p>
                              <p className="text-xs text-muted-foreground">Performance</p>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${performance}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {atendimentos} atendimentos
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Tempo médio: {tempoResposta}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Desempenho por Departamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(departmentLabels).map(([key, label]) => {
                      const deptStaff = activeStaff.filter(s => s.department === key);
                      const performance = { fiscal: 92, contabil: 88, pessoal: 85, paralegal: 90 }[key] || 85;
                      const leads = { fiscal: 45, contabil: 32, pessoal: 28, paralegal: 18 }[key] || 20;
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${departmentColors[key]}`} />
                              <span className="text-sm font-medium">{label}</span>
                              <Badge variant="outline" className="text-xs">{deptStaff.length} funcionários</Badge>
                            </div>
                            <span className="text-sm font-semibold">{performance}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${departmentColors[key]} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${performance}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{leads} leads convertidos este mês</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Metas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Novos Clientes</span>
                        <span className="text-sm font-semibold">18/25</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Atendimentos Realizados</span>
                        <span className="text-sm font-semibold">156/180</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Taxa de Satisfação</span>
                        <span className="text-sm font-semibold">96%/95%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tempo de Resposta</span>
                        <span className="text-sm font-semibold">2.4h/3h</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
