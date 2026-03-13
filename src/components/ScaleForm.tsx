import { useState } from 'react';
import { Scale } from '../data/scalesData';
import { calcularEscala, validarRespuestas } from '../utils/scaleEngine';
import ScaleResult from './ScaleResult';

interface ScaleFormProps {
  scale: Scale;
  onBack: () => void;
}

export default function ScaleForm({ scale, onBack }: ScaleFormProps) {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<{
    puntaje: number;
    interpretacion: string;
  } | null>(null);

  const handleChange = (questionId: string, value: number) => {
    setRespuestas(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarRespuestas(scale, respuestas)) {
      alert('Por favor complete todas las preguntas antes de calcular.');
      return;
    }

    const result = calcularEscala(scale, respuestas);
    setResultado({
      puntaje: result.puntaje,
      interpretacion: result.interpretacion
    });
  };

  const handleReset = () => {
    setRespuestas({});
    setResultado(null);
  };

  // --- CORRECCIÓN AQUÍ: Ajuste para el nuevo ScaleResult ---
  if (resultado) {
    return (
      <ScaleResult
        scale={scale}
        totalScore={resultado.puntaje}
        onBack={onBack}
      />
    );
  }
  // --------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="mb-6 text-teal-600 hover:text-teal-800 font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a escalas
        </button>

        <div className="mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{scale.nombre}</h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{scale.descripcion}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {scale.preguntas.map((pregunta, index) => (
            <div key={pregunta.id} className="bg-gray-50/50 p-5 sm:p-6 rounded-2xl border border-gray-100">
              <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-4 leading-snug">
                <span className="text-teal-600 mr-2">{index + 1}.</span> 
                {pregunta.text}
              </label>

              {/* Botones Táctiles Grandes */}
              {(pregunta.type === 'select' || pregunta.type === 'radio') && pregunta.options && (
                <div className="flex flex-col gap-3">
                  {pregunta.options.map((option, idx) => {
                    const isSelected = respuestas[pregunta.id] === option.value;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChange(pregunta.id, option.value)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-teal-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`${isSelected ? 'font-semibold' : 'font-medium'} pr-4`}>
                          {option.label}
                        </span>
                        
                        <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300 bg-transparent'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Inputs numéricos */}
              {pregunta.type === 'number' && (
                <div className="relative">
                  <input
                    type="number"
                    min={pregunta.min}
                    max={pregunta.max}
                    value={respuestas[pregunta.id] ?? ''}
                    onChange={(e) => handleChange(pregunta.id, Number(e.target.value))}
                    placeholder="Escriba el valor aquí..."
                    className="w-full text-xl sm:text-2xl font-semibold text-center text-teal-900 px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-teal-500 focus:bg-teal-50/30 outline-none transition-all"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-8 border-t border-gray-100">
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-teal-600/30 transition-all hover:-translate-y-1"
            >
              Calcular Resultado
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors sm:w-auto"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}