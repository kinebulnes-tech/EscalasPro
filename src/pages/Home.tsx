import { useState, useEffect } from 'react';
import { scales } from '../data/scalesData';
import SearchBar from '../components/SearchBar';
import ScaleCard from '../components/ScaleCard';
import Sidebar from '../components/Sidebar';
import ScaleForm from '../components/ScaleForm';
import ScaleSkeleton from '../components/ScaleSkeleton'; // <--- Importamos el esqueleto
import { Scale } from '../data/scalesData';
import { Star, Search } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // <--- Estado de carga

  // Cargar favoritos al iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('escalapro_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Efecto para simular carga cuando cambia la categoría o búsqueda
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); // 400ms es el tiempo ideal para que el ojo note el esqueleto sin desesperar
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (e: React.MouseEvent, scaleId: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(scaleId)
      ? favorites.filter(id => id !== scaleId)
      : [...favorites, scaleId];
    
    setFavorites(newFavorites);
    localStorage.setItem('escalapro_favorites', JSON.stringify(newFavorites));
  };

  const filteredScales = scales.filter(scale => {
    const matchesSearch = scale.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scale.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || scale.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteScales = filteredScales.filter(s => favorites.includes(s.id));
  const otherScales = filteredScales.filter(s => !favorites.includes(s.id));

  if (selectedScale) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <ScaleForm
          scale={selectedScale}
          onBack={() => setSelectedScale(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            /* Renderizado de Esqueletos mientras carga */
            <div className="space-y-10">
              <div>
                <div className="h-8 bg-gray-200 rounded-full w-48 mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => <ScaleSkeleton key={i} />)}
                </div>
              </div>
            </div>
          ) : filteredScales.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No se encontraron escalas que coincidan
              </p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
                className="mt-4 text-teal-600 font-bold hover:underline"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in duration-500">
              
              {/* SECCIÓN DE FAVORITOS */}
              {favoriteScales.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <h2 className="text-xl font-extrabold text-gray-900">Escalas Frecuentes</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteScales.map(scale => (
                      <ScaleCard
                        key={scale.id}
                        scale={scale}
                        isFavorite={true}
                        onToggleFavorite={(e) => toggleFavorite(e, scale.id)}
                        onClick={() => setSelectedScale(scale)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN DE TODAS LAS ESCALAS */}
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {selectedCategory ? 'Resultados de categoría' : 'Todas las escalas'}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wider">
                    {otherScales.length} escalas disponibles
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherScales.map(scale => (
                    <ScaleCard
                      key={scale.id}
                      scale={scale}
                      isFavorite={false}
                      onToggleFavorite={(e) => toggleFavorite(e, scale.id)}
                      onClick={() => setSelectedScale(scale)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}