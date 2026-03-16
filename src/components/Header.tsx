import { useState, useEffect } from 'react';
import { Heart, Activity, FileText, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export default function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Escuchamos los cambios de red en tiempo real
  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 pb-4 pt-6 px-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          
          {/* Lado Izquierdo: Marca y Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-xl shadow-md shadow-teal-100">
                <Heart className="w-7 h-7 text-white fill-white/20" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Escala<span className="text-teal-600">Pro</span>
              </h1>
            </div>
            <p className="text-gray-500 font-semibold text-base sm:text-lg max-w-xl leading-snug">
              Soporte clínico con <span className="text-teal-600 underline decoration-teal-200 decoration-2 underline-offset-4">interpretación automática</span> basada en evidencia.
            </p>
          </div>

          {/* Lado Derecho: Badges Estilizados */}
          <div className="flex flex-wrap gap-2 pb-1">
            <div className="group flex items-center gap-2 bg-teal-50/50 border border-teal-100 px-3 py-1.5 rounded-xl transition-all hover:bg-teal-50">
              <Activity className="w-4 h-4 text-teal-600" />
              <span className="text-teal-900 text-xs font-bold tracking-wide">+100 ESCALAS</span>
            </div>
            
            <div className="group flex items-center gap-2 bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-xl transition-all hover:bg-blue-50">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900 text-xs font-bold tracking-wide">REPORTES PDF</span>
            </div>

            <div className="group flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 px-3 py-1.5 rounded-xl transition-all hover:bg-emerald-50">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-900 text-xs font-bold tracking-wide">GUÍA CLÍNICA</span>
            </div>

            {/* NUEVO: Indicador de Estado de Conexión */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-500 ${
              isOnline 
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-100' 
              : 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase tracking-wider">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}