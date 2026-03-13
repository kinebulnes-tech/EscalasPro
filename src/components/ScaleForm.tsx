import { useState } from 'react';
import { Scale, Question } from '../data/scalesData';
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
      alert('Por favor complete todas las preguntas');
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

  if (resultado) {
    return (
      <ScaleResult
        nombre={scale.nombre}
        puntaje={resultado.puntaje}
        interpretacion={resultado.interpretacion}
        onBack={onBack}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Volver
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{scale.nombre}</h2>
          <p className="text-gray-600">{scale.descripcion}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {scale.preguntas.map((pregunta, index) => (
            <div key={pregunta.id} className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                {index + 1}. {pregunta.text}
              </label>

              {pregunta.type === 'select' && pregunta.options && (
                <select
                  value={respuestas[pregunta.id] ?? ''}
                  onChange={(e) => handleChange(pregunta.id, Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {pregunta.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {pregunta.type === 'number' && (
                <input
                  type="number"
                  min={pregunta.min}
                  max={pregunta.max}
                  value={respuestas[pregunta.id] ?? ''}
                  onChange={(e) => handleChange(pregunta.id, Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              )}

              {pregunta.type === 'radio' && pregunta.options && (
                <div className="space-y-2">
                  {pregunta.options.map((option, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={pregunta.id}
                        value={option.value}
                        checked={respuestas[pregunta.id] === option.value}
                        onChange={(e) => handleChange(pregunta.id, Number(e.target.value))}
                        className="w-4 h-4 text-blue-600"
                        required
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Calcular Resultado
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
