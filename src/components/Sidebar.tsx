import { categories } from '../data/scalesData';

interface SidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h3>
      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Todas las escalas
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="font-medium">{category.nombre}</div>
            <div className={`text-sm mt-1 ${
              selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {category.descripcion}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
