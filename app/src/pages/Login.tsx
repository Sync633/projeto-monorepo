// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [submetendo, setSubmetendo] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera a rota tentada anteriormente ou usa /dashboard como padrao
  const rotaDestino =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro(null);

    if (!email || !password) {
      setErro("Informe o e-mail e a senha.");
      return;
    }

    try {
      setSubmetendo(true);
      await login({ email, password });
      navigate(rotaDestino, { replace: true });
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Credenciais inválidas ou falha ao autenticar.",
      );
    } finally {
      setSubmetendo(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Entrar no Sistema
          </CardTitle>
          <CardDescription>
            Acesse o painel utilizando suas credenciais de acesso
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                {erro}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@fatec.sp.gov.br"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                disabled={submetendo}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                disabled={submetendo}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={submetendo}>
              {submetendo ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
