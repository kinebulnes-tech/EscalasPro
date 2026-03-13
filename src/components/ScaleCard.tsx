import { Scale } from '../data/scalesData';
import { FileText, Star } from 'lucide-react';

interface ScaleCardProps {
  scale: Scale;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export default function ScaleCard({ scale, onClick, isFavorite, onToggleFavorite }: ScaleCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-teal-400 transition-all duration-300 cursor-pointer group relative"
    >
      {/* Botón de Favorito (Estrella) */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
      >
        <Star 
          className={`w-5 h-5 transition-all ${
            isFavorite 
              ? 'fill-yellow-400 text-yellow-400 scale-110' 
              : 'text-gray-300 hover:text-gray-400'
          }`} 
        />
      </button>

      <div className="flex items-start gap-4">
        <div className="bg-teal-50 p-3 rounded-xl group-hover:bg-teal-100 transition-colors duration-300">
          <FileText className="w-6 h-6 text-teal-600" />
        </div>
        
        <div className="flex-1 pr-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors duration-300">
            {scale.nombre}
          </h3>
          
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {scale.descripcion}
          </p>
          
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-600 font-medium text-xs rounded-full border border-gray-200">
              {scale.preguntas.length} ítems
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}