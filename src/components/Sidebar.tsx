import React from 'react';
import { categories, categoryIcons } from '../data/scalesData';
import { LayoutGrid, X, Activity } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
  escalas: any[];
}

/**
 * Función optimizada para obtener el icono.
 * Busca en el objeto categoryIcons importado de scalesData.
 */
const getIcon = (id: string | null, active: boolean) => {
  const props = { size: 20, className: active ? "text-white" : "text-teal-600" };
  
  // Si no hay ID o es la categoría "Todas", usamos LayoutGrid
  if (!id) return <LayoutGrid {...props} />;
  
  // Buscamos el componente en el mapeo dinámico
  const IconComponent = categoryIcons[id] || LayoutGrid;
  
  return <IconComponent {...props} />;
};

export default function Sidebar({ selectedCategory, onSelectCategory, isOpen, onClose, escalas }: SidebarProps) {
  const getCount = (id: string | null) => 
    !id ? escalas.length : escalas.filter(s => s.categoria === id).length;

  const handleCategoryClick = (id: string | null) => {
    onSelectCategory(id);
    // Cierra automáticamente en móvil tras elegir una categoría
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Overlay para móvil con desenfoque */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] lg:hidden" 
          onClick={onClose} 
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-80 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-out h-full
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        
        {/* Header del Sidebar */}
        <div className="p-8 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">EscalaPro</h1>
              <span className="text-[10px] font-bold text-teal-600 tracking-[0.2em] uppercase">Clinical Support</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Listado de Categorías */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <div className="space-y-8 pb-32"> 
            
            {/* Botón "Todas las Escalas" */}
            <div>
              <label className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Explorar</label>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  selectedCategory === null ? 'bg-slate-50 shadow-inner' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${selectedCategory === null ? 'bg-teal-600 text-white' : 'bg-teal-50'}`}>
                    {getIcon(null, selectedCategory === null)}
                  </div>
                  <span className={`text-sm font-bold ${selectedCategory === null ? 'text-slate-900' : 'text-slate-500'}`}>Todas las Escalas</span>
                </div>
                <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-400">{getCount(null)}</span>
              </button>
            </div>

            {/* Especialidades Dinámicas */}
            <div>
              <label className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Especialidades</label>
              <div className="space-y-1.5">
                {categories.map(cat => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                        isActive ? 'bg-slate-50 shadow-inner' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100'}`}>
                          {getIcon(cat.id, isActive)}
                        </div>
                        <span className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{cat.nombre}</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isActive ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-300'}`}>
                        {getCount(cat.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 flex-shrink-0 bg-white">
          <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest text-center italic">EscalaPro — Bulnes 2026</p>
        </div>
      </aside>
    </>
  );
}