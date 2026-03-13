import { CheckCircle, AlertTriangle, Info, RotateCcw, ArrowLeft } from 'lucide-react';
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
  
  // Lógica simple para determinar el color basado en palabras clave de la interpretación
  const getStatusColor = () => {
    const text = interpretacion.toLowerCase();
    if (text.includes('grave') || text.includes('alto riesgo') || text.includes('severa') || text.includes('total') || text.includes('rojo') || text.includes('crítico')) {
      return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', circle: 'bg-red-100', icon: <AlertTriangle className="w-8 h-8 text-red-600" /> };
    }
    if (text.includes('moderada') || text.includes('leve') || text.includes('medio') || text.includes('amarillo')) {
      return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', circle: 'bg-orange-100', icon: <Info className="w-8 h-8 text-orange-600" /> };
    }
    return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', circle: 'bg-emerald-100', icon: <CheckCircle className="w-8 h-8 text-emerald-600" /> };
  };

  const status = getStatusColor();

  return (
    <div className="max-w-2xl mx-auto pb-10 animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Encabezado con el nombre de la escala */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-teal-600 font-bold text-xs uppercase tracking-widest mb-1">Resultado de Evaluación</p>
            <h2 className="text-xl font-extrabold text-gray-800">{nombre}</h2>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          {/* Círculo de Puntaje Principal */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className={`w-32 h-32 ${status.circle} rounded-full flex flex-col items-center justify-center border-4 border-white shadow-inner mb-4`}>
              <span className={`text-4xl font-black ${status.text}`}>
                {formatearPuntaje(puntaje)}
              </span>
              <span className={`text-[10px] font-bold uppercase opacity-60 ${status.text}`}>Puntos</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full ${status.bg} ${status.text} border ${status.border} text-sm font-bold`}>
              {status.icon}
              Evaluación Completada
            </div>
          </div>

          {/* Caja de Interpretación Clínica */}
          <div className={`${status.bg} border ${status.border} rounded-2xl p-6 mb-8`}>
            <h3 className={`text-sm font-black uppercase tracking-wider mb-2 ${status.text}`}>
              Interpretación Clínica:
            </h3>
            <p className={`text-lg font-bold leading-tight ${status.text}`}>
              {interpretacion}
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-teal-600/20 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              Nueva Evaluación
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Menú
            </button>
          </div>

          {/* Nota Legal/Clínica */}
          <div className="mt-8 flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <Info className="w-5 h-5 text-gray-400 shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Importante:</strong> Esta puntuación es una herramienta de apoyo. El diagnóstico final debe ser realizado por el profesional tratante considerando el cuadro clínico integral del paciente en el Hospital de Bulnes o entorno correspondiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}