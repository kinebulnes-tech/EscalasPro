import { useState, useMemo } from 'react';
import { categories, scales } from './data/scalesData';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ScaleCard from './components/ScaleCard';
import ScaleForm from './components/ScaleForm';
import { 
  Accessibility, 
  Stethoscope, 
  Siren, 
  MessageSquare, 
  Brain, 
  HandHelping,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

// Función para obtener el icono de la categoría
const getCategoryIcon = (id: string) => {
  const props = { className: "w-10 h-10 mb-4 transition-transform group-hover:scale-110 duration-300" };
  switch (id) {
    case 'kinesiologia': return <Accessibility {...props} className={props.className + " text-blue-600"} />;
    case 'enfermeria': return <Stethoscope {...props} className={props.className + " text-rose-600"} />;
    case 'emergencias': return <Siren {...props} className={props.className + " text-red-600"} />;
    case 'fonoaudiologia': return <MessageSquare {...props} className={props.className + " text-orange-600"} />;
    case 'cognitivas': return <Brain {...props} className={props.className + " text-purple-600"} />;
    case 'terapia-ocupacional': return <HandHelping {...props} className={props.className + " text-emerald-600"} />;
    default: return <Accessibility {...props} />;
  }
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState(''); // Aquí definimos 'query' y 'setQuery'
  const [activeScale, setActiveScale] = useState<string | null>(null);

  // Filtrado de escalas
  const filteredScales = useMemo(() => {
    return scales.filter(scale => {
      const matchesCategory = !selectedCategory || scale.categoria === selectedCategory;
      const matchesSearch = scale.nombre.toLowerCase().includes(query.toLowerCase()) ||
                           scale.descripcion.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, query]);

  const selectedScale = scales.find(s => s.id === activeScale);
  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeScale && selectedScale ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setActiveScale(null)}
              className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Volver al listado
            </button>
            <ScaleForm scale={selectedScale} onBack={() => setActiveScale(null)} />
          </div>
        ) : !selectedCategory ? (
          // PÁGINA PRINCIPAL: GRILLA DE CATEGORÍAS
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="mb-10 text-center sm:text-left">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Panel Principal</h3>
              <p className="text-gray-500 font-medium">Selecciona una especialidad para ver las escalas disponibles.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-100 transition-all duration-300 text-left flex flex-col items-start relative overflow-hidden"
                >
                  {getCategoryIcon(category.id)}
                  <h4 className="text-xl font-black text-gray-900 mb-1">{category.nombre}</h4>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                    {scales.filter(s => s.categoria === category.id).length} Escalas
                  </p>
                  <div className="absolute right-6 bottom-6 bg-gray-50 p-2 rounded-full group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // LISTADO DE ESCALAS POR CATEGORÍA
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <button 
                  onClick={() => {setSelectedCategory(null); setQuery('');}}
                  className="flex items-center gap-2 text-teal-600 font-bold mb-2 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver al Panel
                </button>
                <h3 className="text-3xl font-black text-gray-900">
                  {currentCategory?.nombre}
                </h3>
              </div>
              <div className="w-full md:w-96">
                {/* Aseguramos que SearchBar reciba query y setQuery */}
                <SearchBar query={query} setQuery={setQuery} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScales.map(scale => (
                <ScaleCard 
                  key={scale.id} 
                  scale={scale} 
                  onClick={() => setActiveScale(scale.id)} 
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}