import React from 'react';
import { categories, scales } from '../data/scalesData';
import { 
  Accessibility, Stethoscope, Siren, MessageSquare, Brain, 
  HandHelping, LayoutGrid, ShieldCheck, X, ChevronRight, 
  Apple, Smile, Zap, Activity
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onShowAbout: () => void;
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

export default function Sidebar({ selectedCategory, onSelectCategory, onShowAbout, isOpen, onClose }: SidebarProps) {
  const getCount = (id: string | null) => !id ? scales.length : scales.filter(s => s.categoria === id).length;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden" onClick={onClose} />}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-slate-50/80 backdrop-blur-xl border-r border-white/20 flex flex-col transition-all duration-500 ease-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        {/* Branding */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200 rotate-3">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">EscalaPro</h1>
              <span className="text-[10px] font-bold text-teal-600 tracking-[0.2em] uppercase">Clinical Support</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:bg-white rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-grow overflow-y-auto px-4 space-y-8 custom-scrollbar">
          <div>
            <label className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Explorar</label>
            <button
              onClick={() => { onSelectCategory(null); if(window.innerWidth < 1024) onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                selectedCategory === null ? 'bg-white shadow-xl shadow-slate-200/50 scale-[1.02]' : 'hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-all ${selectedCategory === null ? 'bg-teal-600 shadow-md shadow-teal-200' : 'bg-teal-50'}`}>
                  {getIcon(null, selectedCategory === null)}
                </div>
                <span className={`text-sm font-bold ${selectedCategory === null ? 'text-slate-900' : 'text-slate-500'}`}>Dashboard General</span>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                {getCount(null)}
              </span>
            </button>
          </div>

          <div>
            <label className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Especialidades</label>
            <div className="space-y-2">
              {categories.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { onSelectCategory(cat.id); if(window.innerWidth < 1024) onClose(); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive ? 'bg-white shadow-xl shadow-slate-200/50 scale-[1.02]' : 'hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-teal-600 shadow-md shadow-teal-200' : 'bg-teal-50 group-hover:bg-white'}`}>
                        {getIcon(cat.id, isActive)}
                      </div>
                      <span className={`text-sm font-bold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                        {cat.nombre}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg transition-colors ${
                      isActive ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {getCount(cat.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Sidebar: Botón Legal Estilo Card */}
        <div className="p-6">
          <button
            onClick={() => { onShowAbout(); if(window.innerWidth < 1024) onClose(); }}
            className="w-full bg-slate-900 p-4 rounded-[2rem] flex items-center gap-3 group hover:bg-black transition-all duration-300 shadow-lg shadow-slate-200"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <ShieldCheck className="text-teal-400" size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white leading-none">Términos Legales</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Descargo & Privacidad</p>
            </div>
            <ChevronRight className="text-slate-600 ml-auto group-hover:translate-x-1 transition-transform" size={16} />
          </button>
          <div className="mt-6 px-4 flex justify-between items-center opacity-30 grayscale pointer-events-none text-[9px] font-black uppercase text-slate-500 tracking-widest">
            <span>EscalaPro v1.0</span>
            <span>2026</span>
          </div>
        </div>
      </aside>
    </>
  );
}