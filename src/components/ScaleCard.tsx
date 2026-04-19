import React from 'react';
import { Scale } from '../data/scalesData';
import { ChevronRight, ClipboardList, Star } from 'lucide-react';

interface ScaleCardProps {
  scale: Scale;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void; 
}

export default function ScaleCard({ scale, onClick, isFavorite, onToggleFavorite }: ScaleCardProps) {
  return (
    <div className="relative h-full animate-in fade-in duration-300">
      {/* Botón de Favorito: Posición ajustada para móvil */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(e);
        }}
        aria-label={isFavorite ? `Quitar ${scale.nombre} de favoritos` : `Agregar ${scale.nombre} a favoritos`}
        aria-pressed={isFavorite}
        className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10 p-2 lg:p-2.5 rounded-xl lg:rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-200 group/fav"
      >
        <Star 
          className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 ${
            isFavorite 
              ? 'text-amber-500 fill-amber-500 scale-110' 
              : 'text-gray-300 group-hover/fav:text-amber-400 group-hover/fav:scale-110'
          }`} 
        />
      </button>

      <button
        onClick={onClick}
        aria-label={`Evaluar escala ${scale.nombre}`}
        className="group bg-white p-4 pt-8 lg:p-6 lg:pt-10 rounded-[2rem] lg:rounded-[2.5rem] border-2 border-gray-50 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-300 text-left flex flex-col h-full relative overflow-hidden w-full"
      >
        {/* Icono decorativo: Más compacto en móvil */}
        <div className="bg-teal-50 w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-5 group-hover:bg-teal-600 transition-colors duration-300">
          <ClipboardList className="w-5 h-5 lg:w-6 lg:h-6 text-teal-600 group-hover:text-white" />
        </div>
        
        {/* Información de la Escala: Tipografía escalable */}
        <h3 className="text-lg lg:text-xl font-black text-gray-900 mb-1 lg:mb-2 leading-tight pr-8 group-hover:text-teal-700 transition-colors">
          {scale.nombre}
        </h3>
        
        <p className="text-gray-500 text-[12px] lg:text-sm line-clamp-2 mb-4 lg:mb-6 font-medium leading-relaxed opacity-80">
          {scale.descripcion}
        </p>

        {/* Indicador de acción inferior: Más sutil en móvil */}
        <div className="mt-auto flex items-center text-teal-600 font-bold text-[10px] lg:text-sm tracking-widest lg:tracking-wide uppercase">
          <span className="hidden sm:inline">Iniciar evaluación</span>
          <span className="sm:hidden">Evaluar</span>
          <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
        </div>

        {/* Decoración de fondo: Oculta en móvil para limpiar la vista */}
        <div className="hidden lg:block absolute -right-4 -top-4 w-24 h-24 bg-gray-50/50 rounded-full group-hover:bg-teal-50/50 transition-colors -z-10"></div>
      </button>
    </div>
  );
}