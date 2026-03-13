import { useState, useEffect } from 'react';
import { scales } from '../data/scalesData';
import SearchBar from '../components/SearchBar';
import ScaleCard from '../components/ScaleCard';
import Sidebar from '../components/Sidebar';
import ScaleForm from '../components/ScaleForm';
import { Scale } from '../data/scalesData';
import { Star } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('escalapro_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Guardar favoritos cuando cambien
  const toggleFavorite = (e: React.MouseEvent, scaleId: string) => {
    e.stopPropagation(); // Evita que se abra la escala al marcar la estrella
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

  // Dividir en favoritos y resto
  const favoriteScales = filteredScales.filter(s => favorites.includes(s.id));
  const otherScales = filteredScales.filter(s => !favorites.includes(s.id));

  if (selectedScale) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {filteredScales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No se encontraron escalas que coincidan con tu búsqueda
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* SECCIÓN DE FAVORITOS */}
              {favoriteScales.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <h2 className="text-xl font-bold text-gray-900">Escalas Frecuentes</h2>
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
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCategory ? 'Resultados de categoría' : 'Todas las escalas'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
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