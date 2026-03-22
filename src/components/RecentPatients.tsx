// src/components/RecentPatients.tsx
import { User, ChevronRight, Clock } from 'lucide-react';
import { identityConfigs } from '../utils/patientIdentity';

interface RecentPatientsProps {
  patients: any[];
  onSelect: (patient: any) => void;
}

export default function RecentPatients({ patients, onSelect }: RecentPatientsProps) {
  if (patients.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-2 px-2">
        <Clock size={16} className="text-teal-600" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Evaluaciones Recientes
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {patients.map((p, idx) => (
          <button
            key={p.id || idx}
            onClick={() => onSelect(p)}
            className="group flex items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all text-left active:scale-95"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-teal-50 transition-colors">
              <User size={18} className="text-slate-400 group-hover:text-teal-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 text-xs truncate uppercase tracking-tighter">
                {p.nombre}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                {identityConfigs[p.country]?.documentName || 'ID'}: {p.id}
              </p>
            </div>

            <ChevronRight size={16} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}