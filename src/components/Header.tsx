import { Heart, Activity, FileText, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 pt-10 pb-8 px-4 mb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Logo Principal */}
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2.5 rounded-2xl shadow-lg shadow-teal-100">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Escala<span className="text-teal-600">Pro</span>
            </h1>
          </div>

          {/* Slogan y Pitch */}
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
              Plataforma de soporte clínico con <span className="text-teal-600">interpretación automática</span> basada en evidencia.
            </h2>
          </div>

          {/* Badges de Funcionalidad */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
              <Activity className="w-4 h-4 text-teal-600" />
              <span className="text-gray-700 text-xs sm:text-sm font-bold">+50 Escalas Validadas</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700 text-xs sm:text-sm font-bold">Reportes PDF Profesionales</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-gray-700 text-xs sm:text-sm font-bold">Guía de Acción Clínica</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}