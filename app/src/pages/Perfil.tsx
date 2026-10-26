import { useState } from "react";
import { toast } from "sonner";
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

export function Perfil() {
  const { user } = useAuth();
  const [nome, setNome] = useState(user?.nome || "");

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (user) {
      const usuarioAtualizado = { ...user, nome };
      localStorage.setItem("@app:user", JSON.stringify(usuarioAtualizado));
    }

    toast.success("Perfil atualizado com sucesso!");
  }

  return (
    <Card className="max-w-xl shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSalvar} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNome(e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail de Cadastro</Label>
            <Input id="email" value={user?.email || ""} disabled />
          </div>

          <Button type="submit" className="mt-2">
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
