import React from 'react';
import { categories, scales } from '../data/scalesData';
import { 
  Accessibility, 
  Stethoscope, 
  Siren, 
  MessageSquare, 
  Brain, 
  HandHelping, 
  LayoutGrid,
  ShieldCheck,
  X,
  ChevronRight,
  Apple, // Nutrición
  Smile, // Psicología
  Zap    // Neurología
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onShowAbout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const getIcon = (id: string | null) => {
  const size = "w-5 h-5";
  switch (id) {
    case 'kinesiologia': return <Accessibility className={size} />;
    case 'enfermeria': return <Stethoscope className={size} />;
    case 'emergencias': return <Siren className={size} />;
    case 'fonoaudiologia': return <MessageSquare className={size} />;
    case 'cognitivas': return <Brain className={size} />;
    case 'terapia_ocupacional': return <HandHelping className={size} />;
    case 'psicologia': return <Smile className={size} />;
    case 'nutricion': return <Apple className={size} />;
    case 'neurologia': return <Zap className={size} />;
    default: return <LayoutGrid className={size} />;
  }
};

export default function Sidebar({ 
  selectedCategory, 
  onSelectCategory, 
  onShowAbout, 
  isOpen, 
  onClose 
}: SidebarProps) {
  
  const getCount = (categoryId: string | null) => {
    if (!categoryId) return scales.length;
    return scales.filter(s => s.categoria === categoryId).length;
  };

  const handleSelect = (id: string | null) => {
    onSelectCategory(id);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Contenedor Lateral */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-[calc(100vh-80px)]
      `}>
        
        <div className="p-6 flex items-center justify-between lg:hidden border-b border-gray-50">
          <span className="font-black text-teal-600 italic">EscalaPro</span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-8">
          <div>
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Navegación
            </p>
            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                selectedCategory === null
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-100'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {getIcon(null)}
                <span>Dashboard</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-lg ${
                selectedCategory === null ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {getCount(null)}
              </span>
            </button>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Especialidades
            </p>
            <div className="space-y-1">
              {categories.map(category => {
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleSelect(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-100'
                        : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isSelected ? 'text-white' : 'text-teal-500'}>
                        {getIcon(category.id)}
                      </span>
                      <span>{category.nombre}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg ${
                      isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {getCount(category.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
          <button
            onClick={() => { onShowAbout(); if(window.innerWidth < 1024) onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all group"
          >
            <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            <span>Términos y Legal</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>
    </>
  );
}