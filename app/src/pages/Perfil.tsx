// src/pages/Perfil.tsx
import { useAuth } from '../hooks/useAuth';

export function Perfil() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Meu Perfil</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <p className="text-sm text-slate-600"><strong>ID:</strong> {user?.id}</p>
        <p className="text-sm text-slate-600"><strong>Nome:</strong> {user?.nome}</p>
        <p className="text-sm text-slate-600"><strong>E-mail:</strong> {user?.email}</p>
      </div>
    </div>
  );
}