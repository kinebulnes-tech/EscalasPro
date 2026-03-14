import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div className="sticky top-[80px] z-40 py-2 bg-gray-50/80 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full">
        <div className="relative group">
          {/* Icono de Lupa que se ilumina al escribir */}
          <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
            query ? 'text-teal-600' : 'text-gray-400'
          }`} />
          
          <input
            type="text"
            placeholder="Buscar escala clínica (ej: Barthel, Glasgow...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white outline-none text-gray-800 font-medium placeholder:text-gray-400 transition-all duration-200"
          />
          
          {/* Botón para borrar la búsqueda */}
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}