import { Scale } from '../data/scalesData';
import { FileText } from 'lucide-react';

interface ScaleCardProps {
  scale: Scale;
  onClick: () => void;
}

export default function ScaleCard({ scale, onClick }: ScaleCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-400"
    >
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{scale.nombre}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{scale.descripcion}</p>
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {scale.preguntas.length} ítems
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
