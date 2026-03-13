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
    <div className="w-full bg-white/50 backdrop-blur-sm border-b border-gray-100 py-6 mb-8 transition-all">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">
              Especialidades Clínicas
            </p>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
              {categories.length} CATEGORÍAS
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Botón: Todas las escalas */}
            <button
              onClick={() => onSelectCategory(null)}
              className={`group relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 ${
                selectedCategory === null
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                  : 'bg-white text-gray-600 border-2 border-gray-50 hover:border-teal-200 hover:text-teal-600 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Todas</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                  selectedCategory === null ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                }`}>
                  {getCount(null)}
                </span>
              </div>
            </button>

            {/* Listado de Categorías */}
            {categories.map(category => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`group relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                      : 'bg-white text-gray-600 border-2 border-gray-50 hover:border-teal-200 hover:text-teal-600 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{category.nombre}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                      isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                    }`}>
                      {getCount(category.id)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}