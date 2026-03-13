import { CheckCircle } from 'lucide-react';
import { formatearPuntaje } from '../utils/scaleEngine';

interface ScaleResultProps {
  nombre: string;
  puntaje: number;
  interpretacion: string;
  onBack: () => void;
  onReset: () => void;
}

export default function ScaleResult({
  nombre,
  puntaje,
  interpretacion,
  onBack,
  onReset
}: ScaleResultProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Volver
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resultado Calculado</h2>
          <p className="text-gray-600">{nombre}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Puntaje Total</p>
            <p className="text-5xl font-bold text-blue-600 mb-4">
              {formatearPuntaje(puntaje)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Interpretación Clínica
          </h3>
          <p className="text-gray-700 leading-relaxed">{interpretacion}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Nueva Evaluación
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cambiar Escala
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Esta herramienta es de apoyo clínico. Los resultados deben ser
            interpretados por un profesional de la salud calificado en el contexto clínico del
            paciente.
          </p>
        </div>
      </div>
    </div>
  );
}
