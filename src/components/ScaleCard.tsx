import { Scale } from '../data/scalesData';
import { ChevronRight, ClipboardList, Star } from 'lucide-react';

interface ScaleCardProps {
  scale: Scale;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ScaleCard({ scale, onClick, isFavorite, onToggleFavorite }: ScaleCardProps) {
  return (
    <div className="relative h-full animate-in fade-in duration-300">
      {/* Botón de Favorito - Posicionado absolutamente sobre la tarjeta */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita que se active el onClick de la tarjeta
          onToggleFavorite();
        }}
        className="absolute top-6 right-6 z-10 p-2.5 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-200 group/fav"
      >
        <Star 
          className={`w-5 h-5 transition-all duration-300 ${
            isFavorite 
              ? 'text-amber-500 fill-amber-500 scale-110' 
              : 'text-gray-300 group-hover/fav:text-amber-400 group-hover/fav:scale-110'
          }`} 
        />
      </button>

      <button
        onClick={onClick}
        className="group bg-white p-6 pt-10 rounded-[2.5rem] border-2 border-gray-50 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-300 text-left flex flex-col h-full relative overflow-hidden w-full"
      >
        {/* Icono decorativo */}
        <div className="bg-teal-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-teal-500 transition-colors duration-300">
          <ClipboardList className="w-6 h-6 text-teal-600 group-hover:text-white" />
        </div>
        
        {/* Información de la Escala */}
        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight pr-8 group-hover:text-teal-700 transition-colors">
          {scale.nombre}
        </h3>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
          {scale.descripcion}
        </p>

        {/* Indicador de acción inferior */}
        <div className="mt-auto flex items-center text-teal-600 font-bold text-sm tracking-wide uppercase">
          Iniciar evaluación
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
        </div>

        {/* Detalle estético de fondo */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50/50 rounded-full group-hover:bg-teal-50/50 transition-colors -z-10"></div>
      </button>
    </div>
  );
}