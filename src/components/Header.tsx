import { useState, useEffect } from 'react';
import { Heart, Activity, FileText, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export default function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    /* Reducimos padding y margen en móvil (pt-3 pb-2 mb-2) */
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 pt-3 pb-2 lg:pt-6 lg:pb-4 px-4 lg:px-6 mb-2 lg:mb-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-6">
          
          {/* Lado Izquierdo: Marca y Slogan */}
          <div className="space-y-1 lg:space-y-3">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-1.5 lg:p-2 rounded-lg lg:rounded-xl shadow-md shadow-teal-100 transition-all">
                <Heart className="w-5 h-5 lg:w-7 lg:h-7 text-white fill-white/20" />
              </div>
              <h1 className="text-xl lg:text-3xl font-black text-gray-900 tracking-tight">
                Escala<span className="text-teal-600">Pro</span>
              </h1>
            </div>
            {/* Ocultamos slogan en móvil para maximizar espacio de trabajo */}
            <p className="hidden md:block text-gray-500 font-semibold text-xs lg:text-base max-w-xl leading-snug">
              Soporte clínico con <span className="text-teal-600 underline decoration-teal-200 decoration-2 underline-offset-4">interpretación automática</span>.
            </p>
          </div>

          {/* Lado Derecho: Badges Estilizados (Más compactos en móvil) */}
          <div className="flex flex-wrap gap-1.5 lg:gap-2 pb-1">
            <div className="flex items-center gap-1.5 bg-teal-50/50 border border-teal-100 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl transition-all">
              <Activity className="w-3 h-3 lg:w-4 lg:h-4 text-teal-600" />
              <span className="text-teal-900 text-[9px] lg:text-xs font-bold tracking-wide">+100</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-blue-50/50 border border-blue-100 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl transition-all">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
              <span className="text-blue-900 text-[9px] lg:text-xs font-bold tracking-wide">PDF</span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-100 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl transition-all">
              <ShieldCheck className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-600" />
              <span className="text-emerald-900 text-[9px] lg:text-xs font-bold tracking-wide">GUÍA</span>
            </div>

            {/* Indicador de Conexión (Prioritario) */}
            <div className={`flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl border transition-all duration-500 ${
              isOnline 
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' 
              : 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3 lg:w-4 lg:h-4" /> : <WifiOff className="w-3 h-3 lg:w-4 lg:h-4" />}
              <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-wider">
                {isOnline ? 'On' : 'Off'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}