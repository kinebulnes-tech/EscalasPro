import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8" />
          <h1 className="text-3xl font-bold">ESCALAS CLÍNICAS PRO</h1>
        </div>
        <p className="mt-2 text-blue-100">
          Plataforma profesional de calculadoras clínicas para profesionales de la salud
        </p>
      </div>
    </header>
  );
}
