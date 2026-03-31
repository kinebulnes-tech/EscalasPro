import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastMessage } from '../hooks/useToast';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

const CONFIG = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-200', icon_color: 'text-emerald-600', text: 'text-emerald-900', bar: 'bg-emerald-500' },
  error:   { icon: XCircle,      bg: 'bg-red-50 border-red-200',         icon_color: 'text-red-600',     text: 'text-red-900',     bar: 'bg-red-500'    },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200',    icon_color: 'text-amber-600',   text: 'text-amber-900',   bar: 'bg-amber-500'  },
  info:    { icon: Info,          bg: 'bg-blue-50 border-blue-200',       icon_color: 'text-blue-600',    text: 'text-blue-900',    bar: 'bg-blue-500'   },
};

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: number) => void }) {
  const [visible, setVisible] = useState(false);
  const cfg  = CONFIG[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div className={`relative flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-xl transition-all duration-300 overflow-hidden min-w-[280px] max-w-[380px] ${cfg.bg} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className={`absolute bottom-0 left-0 h-[3px] ${cfg.bar}`} style={{ animation: 'shrink 3.5s linear forwards' }} />
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.icon_color}`} />
      <p className={`text-sm font-bold leading-snug flex-1 ${cfg.text}`}>{toast.message}</p>
      <button onClick={handleClose} className={`shrink-0 p-0.5 rounded-lg hover:bg-black/5 transition-colors ${cfg.icon_color}`}>
        <X size={14} />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}