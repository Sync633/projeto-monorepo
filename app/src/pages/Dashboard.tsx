// src/pages/Dashboard.tsx
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Painel Principal</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-700">
          Sessão ativa com o usuário: <strong>{user?.nome}</strong> ({user?.email})
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Nível de acesso: <span className="font-semibold uppercase">{user?.perfil || 'usuario'}</span>
        </p>
      </div>
    </div>
  );
}