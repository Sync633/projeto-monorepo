import { useAuth } from "../hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Dashboard() {
  const { user } = useAuth();
  const iniciais = user?.nome ? user.nome.slice(0, 2).toUpperCase() : "US";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Painel Principal</h1>
        <p className="text-sm text-slate-500">
          Visão geral dos recursos e dados da sessão ativa.
        </p>
      </div>

      <Card className="max-w-xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-600 text-white font-bold">
              {iniciais}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user?.nome}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-3 pt-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Identificador da Conta:</span>
            <span className="font-mono font-medium">#{user?.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Nível de Permissão:</span>
            <Badge variant="secondary">{user?.perfil || "usuario"}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status da Sessão:</span>
            <Badge
              variant="outline"
              className="border-emerald-500 text-emerald-600"
            >
              Sessão Ativa
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
