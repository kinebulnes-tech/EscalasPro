import { useState } from 'react';
import { scales } from '../data/scalesData';
import SearchBar from '../components/SearchBar';
import ScaleCard from '../components/ScaleCard';
import Sidebar from '../components/Sidebar';
import ScaleForm from '../components/ScaleForm';
import { Scale } from '../data/scalesData';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);

  const filteredScales = scales.filter(scale => {
    const matchesSearch = scale.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scale.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || scale.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? (
                    scales.find(s => s.categoria === selectedCategory)?.categoria
                  ) : (
                    'Todas las escalas'
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredScales.length} escala{filteredScales.length !== 1 ? 's' : ''} disponible{filteredScales.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredScales.map(scale => (
                  <ScaleCard
                    key={scale.id}
                    scale={scale}
                    onClick={() => setSelectedScale(scale)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
