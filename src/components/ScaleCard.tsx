import { Scale } from '../data/scalesData';
import { FileText, Star, ChevronRight } from 'lucide-react';

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
      className="group relative bg-white rounded-2xl p-6 
                 border-2 border-transparent hover:border-teal-500/30 
                 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 
                 transition-all duration-300 ease-out cursor-pointer 
                 hover:-translate-y-2 active:scale-[0.98]"
    >
      {/* Botón de Favorito con animación de pulso al pasar el mouse */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 p-2 rounded-full 
                   bg-gray-50 group-hover:bg-yellow-50 
                   transition-colors duration-300 z-10"
      >
        <Star 
          className={`w-5 h-5 transition-all duration-300 ${
            isFavorite 
              ? 'fill-yellow-400 text-yellow-400 scale-110 rotate-[72deg]' 
              : 'text-gray-300 group-hover:text-yellow-400'
          }`} 
        />
      </button>

      <div className="flex items-start gap-4">
        {/* Ícono con animación: sube y baja un poco en hover */}
        <div className="bg-teal-50 p-4 rounded-2xl 
                        group-hover:bg-teal-600 group-hover:scale-110 
                        transition-all duration-500 ease-in-out shadow-inner">
          <FileText className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors duration-300" />
        </div>
        
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-extrabold text-gray-800 mb-2 
                         group-hover:text-teal-600 transition-colors duration-300">
            {scale.nombre}
          </h3>
          
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed group-hover:text-gray-600">
            {scale.descripcion}
          </p>
          
          <div className="mt-5 flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 
                             text-gray-600 font-bold text-[10px] uppercase tracking-wider 
                             rounded-lg group-hover:bg-teal-50 group-hover:text-teal-700 
                             transition-colors duration-300">
              {scale.preguntas.length} ÍTEMS
            </span>
            
            {/* Indicador de flecha que aparece solo en hover */}
            <div className="flex items-center gap-1 text-teal-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <span className="text-xs font-bold">Evaluar</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Brillo sutil de fondo que aparece en hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}