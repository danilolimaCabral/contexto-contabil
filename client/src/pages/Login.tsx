import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err) => {
      setError(err.message || "Erro ao fazer login");
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err) => {
      setError(err.message || "Erro ao criar conta");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      loginMutation.mutate({ email, password });
    } else {
      if (!name.trim()) {
        setError("Nome é obrigatório");
        return;
      }
      registerMutation.mutate({ email, password, name });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="/logo-transparente.png" 
                alt="Contexto Contábil" 
                className="h-16 w-auto mx-auto"
              />
            </div>
            <CardTitle className="text-2xl text-white">
              {isLogin ? "Entrar" : "Criar Conta"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {isLogin 
                ? "Acesse sua conta para gerenciar seus serviços" 
                : "Crie sua conta para acessar o portal do cliente"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500"
                    required
                    minLength={isLogin ? 1 : 6}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </>
                ) : (
                  isLogin ? "Entrar" : "Criar Conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
              >
                {isLogin 
                  ? "Não tem conta? Criar agora" 
                  : "Já tem conta? Fazer login"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Contexto Assessoria Contábil © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
