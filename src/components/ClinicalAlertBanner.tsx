// src/components/ClinicalAlertBanner.tsx

import { AlertTriangle, Siren, Info, X } from 'lucide-react';
import { useState } from 'react';
import { ClinicalAlert } from '../utils/clinicalAlerts';

interface ClinicalAlertBannerProps {
  alerta: ClinicalAlert;
}

const CONFIG = {
  critica: {
    bg: 'bg-red-50 border-red-300',
    header: 'bg-red-600',
    icon: Siren,
    iconColor: 'text-white',
    titleColor: 'text-white',
    bodyTitle: 'text-red-900',
    bodyText: 'text-red-800',
    accionBg: 'bg-red-100 border-red-200',
    pulse: true,
    label: 'ALERTA CRÍTICA',
  },
  advertencia: {
    bg: 'bg-amber-50 border-amber-300',
    header: 'bg-amber-500',
    icon: AlertTriangle,
    iconColor: 'text-white',
    titleColor: 'text-white',
    bodyTitle: 'text-amber-900',
    bodyText: 'text-amber-800',
    accionBg: 'bg-amber-100 border-amber-200',
    pulse: false,
    label: 'ADVERTENCIA CLÍNICA',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    header: 'bg-blue-500',
    icon: Info,
    iconColor: 'text-white',
    titleColor: 'text-white',
    bodyTitle: 'text-blue-900',
    bodyText: 'text-blue-700',
    accionBg: 'bg-blue-100 border-blue-200',
    pulse: false,
    label: 'INFORMACIÓN CLÍNICA',
  },
} as const;

export default function ClinicalAlertBanner({ alerta }: ClinicalAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cfg = CONFIG[alerta.nivel];
  const Icon = cfg.icon;

  return (
    <div
      className={`rounded-[1.5rem] border-2 overflow-hidden shadow-lg mb-8 animate-in slide-in-from-top-4 duration-500 ${cfg.bg} ${cfg.pulse ? 'ring-2 ring-red-400 ring-offset-2' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${cfg.header} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${cfg.iconColor} ${cfg.pulse ? 'animate-bounce' : ''}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${cfg.titleColor}`}>
            {cfg.label}
          </span>
        </div>
        {alerta.nivel !== 'critica' && (
          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar alerta"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        <h4 className={`font-black text-sm leading-snug ${cfg.bodyTitle}`}>
          {alerta.titulo}
        </h4>
        <p className={`text-xs font-semibold leading-relaxed ${cfg.bodyText}`}>
          {alerta.mensaje}
        </p>

        <div className={`flex items-start gap-2 p-3 rounded-xl border ${cfg.accionBg}`}>
          <span className={`text-[9px] font-black uppercase tracking-widest shrink-0 mt-0.5 ${cfg.bodyTitle}`}>
            Acción:
          </span>
          <p className={`text-xs font-bold leading-snug ${cfg.bodyText}`}>
            {alerta.accion}
          </p>
        </div>

        {alerta.nivel === 'critica' && (
          <p className="text-[9px] text-red-400 font-bold italic text-center pt-1">
            Esta alerta requiere evaluación clínica inmediata. No omitir.
          </p>
        )}
      </div>
    </div>
  );
}