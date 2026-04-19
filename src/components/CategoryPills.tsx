
import { categories, categoryIcons } from '../data/scalesData';
import { LayoutGrid } from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <div className="flex lg:hidden overflow-x-auto py-4 px-2 gap-3 no-scrollbar active:cursor-grabbing select-none">
      {/* Opción: Todas las Escalas */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex flex-col items-center min-w-[85px] transition-all ${
          selectedCategory === null ? 'scale-110' : 'opacity-60'
        }`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-2 ${
          selectedCategory === null ? 'bg-teal-600 text-white shadow-teal-200' : 'bg-white text-slate-400'
        }`}>
          <LayoutGrid size={24} />
        </div>
        <span className={`text-[10px] font-bold text-center leading-tight ${
          selectedCategory === null ? 'text-teal-700' : 'text-slate-500'
        }`}>Todas</span>
      </button>

      {/* Mapeo de Especialidades Dinámicas */}
      {categories.map((cat) => {
        const Icon = categoryIcons[cat.id] || LayoutGrid;
        const isActive = selectedCategory === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex flex-col items-center min-w-[85px] transition-all ${
              isActive ? 'scale-110' : 'opacity-60'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-2 ${
              isActive ? 'bg-teal-600 text-white shadow-teal-200' : 'bg-white text-teal-600'
            }`}>
              <Icon size={24} />
            </div>
            <span className={`text-[10px] font-bold text-center leading-tight ${
              isActive ? 'text-teal-700' : 'text-slate-500'
            }`}>
              {cat.nombre.split(' ')[0]} {/* Muestra solo la primera palabra para no saturar */}
            </span>
          </button>
        );
      })}
    </div>
  );
}