import React, { useState, useEffect } from 'react';
import { scales, Scale } from '../data/scalesData';
import SearchBar from '../components/SearchBar';
import ScaleCard from '../components/ScaleCard';
import ScaleForm from '../components/ScaleForm';
import ScaleSkeleton from '../components/ScaleSkeleton';
import { Star, Search } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar favoritos
  useEffect(() => {
    const saved = localStorage.getItem('escalapro_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Simular carga al buscar
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleFavorite = (e: React.MouseEvent, scaleId: string) => {
    e.stopPropagation();
    const newFavs = favorites.includes(scaleId)
      ? favorites.filter(id => id !== scaleId)
      : [...favorites, scaleId];
    setFavorites(newFavs);
    localStorage.setItem('escalapro_favorites', JSON.stringify(newFavs));
  };

  const filteredScales = scales.filter(s =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteScales = filteredScales.filter(s => favorites.includes(s.id));
  const otherScales = filteredScales.filter(s => !favorites.includes(s.id));

  // Si hay una escala seleccionada, mostramos el formulario
  if (selectedScale) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <ScaleForm scale={selectedScale} onBack={() => setSelectedScale(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Buscador */}
      <div className="max-w-2xl">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Listado de Escalas */}
      <div className="w-full">
        {isLoading ? (
          <div className="space-y-10">
            <div className="h-8 bg-gray-200 rounded-full w-48 mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <ScaleSkeleton key={i} />)}
            </div>
          </div>
        ) : filteredScales.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No se encontraron escalas</p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-teal-600 font-bold hover:underline">
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* SECCIÓN FAVORITOS */}
            {favoriteScales.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <h2 className="text-2xl font-black text-gray-900">Escalas Frecuentes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favoriteScales.map((scale) => (
                    <ScaleCard
                      key={scale.id}
                      scale={scale}
                      isFavorite={true}
                      onToggleFavorite={(e: React.MouseEvent) => toggleFavorite(e, scale.id)}
                      onClick={() => setSelectedScale(scale)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TODAS LAS ESCALAS */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900">Todas las escalas</h2>
                <p className="text-gray-500 font-medium">Explora el catálogo completo</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherScales.map((scale) => (
                  <ScaleCard
                    key={scale.id}
                    scale={scale}
                    isFavorite={false}
                    onToggleFavorite={(e: React.MouseEvent) => toggleFavorite(e, scale.id)}
                    onClick={() => setSelectedScale(scale)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}