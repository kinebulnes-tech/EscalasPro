export default function ScaleSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-50 shadow-sm animate-pulse">
      <div className="flex items-start gap-4">
        {/* Círculo del ícono */}
        <div className="bg-gray-200 h-14 w-14 rounded-2xl"></div>
        
        <div className="flex-1">
          {/* Línea del título */}
          <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-3"></div>
          {/* Línea de descripción */}
          <div className="h-3 bg-gray-100 rounded-full w-full mb-2"></div>
          <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
          
          <div className="mt-6 flex justify-between items-center">
            {/* Etiqueta de ítems */}
            <div className="h-6 bg-gray-100 rounded-lg w-16"></div>
            {/* Flecha */}
            <div className="h-4 bg-gray-50 rounded-full w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}