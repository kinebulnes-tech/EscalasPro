import { categories, scales } from '../data/scalesData';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  
  const getCount = (categoryId: string | null) => {
    if (!categoryId) return scales.length;
    return scales.filter(s => s.categoria === categoryId).length;
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 py-4 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filtrar por especialidad</p>
        <div className="flex flex-wrap gap-2">
          {/* Botón Todas */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === null
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas las escalas ({getCount(null)})
          </button>

          {/* Categorías */}
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === category.id
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.nombre} ({getCount(category.id)})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}