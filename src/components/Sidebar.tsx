import React from 'react';
import { categories, scales } from '../data/scalesData';
import { 
  Accessibility, Stethoscope, Siren, MessageSquare, Brain, 
  HandHelping, LayoutGrid, X, Apple, Smile, Zap, Activity
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

const getIcon = (id: string | null, active: boolean) => {
  const props = { size: 20, className: active ? "text-white" : "text-teal-600" };
  switch (id) {
    case 'kinesiologia': return <Accessibility {...props} />;
    case 'enfermeria': return <Stethoscope {...props} />;
    case 'emergencias': return <Siren {...props} />;
    case 'fonoaudiologia': return <MessageSquare {...props} />;
    case 'cognitivas': return <Brain {...props} />;
    case 'terapia_ocupacional': return <HandHelping {...props} />;
    case 'psicologia': return <Smile {...props} />;
    case 'nutricion': return <Apple {...props} />;
    case 'neurologia': return <Zap {...props} />;
    default: return <LayoutGrid {...props} />;
  }
};

export default function Sidebar({ selectedCategory, onSelectCategory, isOpen, onClose }: SidebarProps) {
  const getCount = (id: string | null) => !id ? scales.length : scales.filter(s => s.categoria === id).length;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500" 
          onClick={onClose} 
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-out h-screen
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        
        {/* CABECERA: Siempre visible */}
        <div className="p-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200 rotate-3">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">EscalaPro</h1>
              <span className="text-[10px] font-bold text-teal-600 tracking-[0.2em] uppercase">Clinical Support</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVEGACIÓN: Con scroll independiente (overflow-y-auto) */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar pb-6">
          <div>
            <label className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
              Explorar
            </label>
            <button
              onClick={() => { onSelectCategory(null); if(window.innerWidth < 1024) onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                selectedCategory === null ? 'bg-slate-50 shadow-inner' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-all ${selectedCategory === null ? 'bg-teal-600 text-white shadow-md' : 'bg-teal-50'}`}>
                  {getIcon(null, selectedCategory === null)}
                </div>
                <span className={`text-sm font-bold ${selectedCategory === null ? 'text-slate-900' : 'text-slate-500'}`}>
                  Todas las Escalas
                </span>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-400 group-hover:text-teal-600">
                {getCount(null)}
              </span>
            </button>
          </div>

          <div>
            <label className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
              Especialidades
            </label>
            <div className="space-y-1.5">
              {categories.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { onSelectCategory(cat.id); if(window.innerWidth < 1024) onClose(); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                      isActive ? 'bg-slate-50 shadow-inner' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all ${isActive ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'}`}>
                        {getIcon(cat.id, isActive)}
                      </div>
                      <span className={`text-sm font-bold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                        {cat.nombre}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg transition-colors ${
                      isActive ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-300'
                    }`}>
                      {getCount(cat.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* PIE DE PÁGINA: Sutil y siempre fijo abajo */}
        <div className="p-8 border-t border-slate-50 opacity-20 flex-shrink-0 pointer-events-none">
          <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest text-center">
            EscalaPro v1.0 — 2026
          </p>
        </div>
      </aside>
    </>
  );
}