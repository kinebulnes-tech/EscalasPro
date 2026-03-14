import { useState, useMemo, useEffect } from 'react';
import { categories, scales } from './data/scalesData';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ScaleCard from './components/ScaleCard';
import ScaleForm from './components/ScaleForm';
import { 
  Accessibility, Stethoscope, Siren, MessageSquare, 
  Brain, HandHelping, ArrowLeft, ChevronRight, Star,
  Apple, Zap, Smile // <--- Nuevos iconos importados
} from 'lucide-react';

const getCategoryIcon = (id: string) => {
  const props = { className: "w-10 h-10 mb-4 transition-transform group-hover:scale-110 duration-300" };
  
  switch (id) {
    case 'kinesiologia': 
      return <Accessibility {...props} className={props.className + " text-blue-600"} />;
    case 'enfermeria': 
      return <Stethoscope {...props} className={props.className + " text-rose-600"} />;
    case 'emergencias': 
      return <Siren {...props} className={props.className + " text-red-600"} />;
    case 'fonoaudiologia': 
      return <MessageSquare {...props} className={props.className + " text-orange-600"} />;
    case 'cognitivas': 
      return <Brain {...props} className={props.className + " text-purple-600"} />;
    case 'terapia_ocupacional': 
      return <HandHelping {...props} className={props.className + " text-emerald-600"} />;
    
    // NUEVAS CATEGORÍAS CON SUS ICONOS Y COLORES
    case 'psicologia': 
      return <Smile {...props} className={props.className + " text-pink-500"} />;
    case 'nutricion': 
      return <Apple {...props} className={props.className + " text-orange-500"} />;
    case 'neurologia': 
      return <Zap {...props} className={props.className + " text-indigo-600"} />;

    default: 
      return <Accessibility {...props} className={props.className + " text-gray-400"} />;
  }
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeScale, setActiveScale] = useState<string | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('escalapro_favs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('escalapro_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredScales = useMemo(() => {
    return scales.filter(scale => {
      const matchesCategory = !selectedCategory || scale.categoria === selectedCategory;
      const matchesSearch = scale.nombre.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, query]);

  const favoriteScales = useMemo(() => {
    return scales.filter(s => favorites.includes(s.id));
  }, [favorites]);

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
          <div className="animate-in fade-in zoom-in duration-500">
            
            {/* SECCIÓN DE FAVORITOS */}
            {favoriteScales.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <h3 className="text-2xl font-black text-gray-900">Tus Favoritos</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteScales.map(scale => (
                    <ScaleCard 
                      key={scale.id} 
                      scale={scale} 
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(scale.id)}
                      onClick={() => setActiveScale(scale.id)} 
                    />
                  ))}
                </div>
                <hr className="mt-12 border-gray-100" />
              </div>
            )}

            <div className="mb-10 pt-4">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Especialidades</h3>
              <p className="text-gray-500 font-medium text-lg">Selecciona una categoría para explorar.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group bg-white p-10 rounded-[3rem] border-2 border-transparent hover:border-teal-500 hover:shadow-2xl transition-all duration-300 text-left flex flex-col items-start relative overflow-hidden"
                >
                  {getCategoryIcon(category.id)}
                  <h4 className="text-2xl font-black text-gray-900 mb-1">{category.nombre}</h4>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    {scales.filter(s => s.categoria === category.id).length} Escalas
                  </p>
                  <div className="absolute right-8 bottom-8 bg-gray-50 p-3 rounded-full group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <button 
                  onClick={() => {setSelectedCategory(null); setQuery('');}}
                  className="flex items-center gap-2 text-teal-600 font-bold mb-3 hover:bg-teal-50 px-3 py-1 rounded-lg w-fit transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver al Panel
                </button>
                <h3 className="text-4xl font-black text-gray-900">{currentCategory?.nombre}</h3>
              </div>
              <div className="w-full md:w-96">
                <SearchBar query={query} setQuery={setQuery} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredScales.map(scale => (
                <ScaleCard 
                  key={scale.id} 
                  scale={scale} 
                  isFavorite={favorites.includes(scale.id)}
                  onToggleFavorite={() => toggleFavorite(scale.id)}
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