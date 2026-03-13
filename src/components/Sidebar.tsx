import { categories, scales } from '../data/scalesData';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  
  // Función para contar cuántas escalas hay por categoría
  const getCount = (categoryId: string | null) => {
    if (!categoryId) return scales.length;
    return scales.filter(s => s.categoria === categoryId).length;
  };

  return (
    <div className="sticky top-[130px] z-30 bg-gray-50/80 backdrop-blur-md py-2 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Contenedor con scroll horizontal oculto visualmente */}
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide no-scrollbar">
          
          {/* Opción: Todas */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm border ${
              selectedCategory === null
                ? 'bg-teal-600 text-white border-teal-600 shadow-teal-200'
                : 'bg-white text-gray-500 border-gray-100 hover:border-teal-200 hover:text-teal-600'
            }`}
          >
            Todas <span className={`ml-1 opacity-60 ${selectedCategory === null ? 'text-white' : 'text-gray-400'}`}>
              ({getCount(null)})
            </span>
          </button>

          {/* Mapeo de Categorías dinámicas */}
          {categories.map(category => {
            const isSelected = selectedCategory === category.id;
            const count = getCount(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-teal-200'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-teal-200 hover:text-teal-600'
                }`}
              >
                {category.nombre} 
                <span className={`ml-1 opacity-60 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}