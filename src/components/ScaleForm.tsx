import { useState, useMemo } from 'react';
import { Scale } from '../data/scalesData';
import { calcularEscala, validarRespuestas } from '../utils/scaleEngine';
import ScaleResult from './ScaleResult';
import TimerPlugin from './plugins/TimerPlugin';

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

  const progress = useMemo(() => {
    const totalPreguntas = scale.preguntas.length;
    const respondidas = Object.keys(respuestas).length;
    return (respondidas / totalPreguntas) * 100;
  }, [respuestas, scale.preguntas.length]);

  const currentScore = useMemo(() => {
    if (Object.keys(respuestas).length === 0) return 0;
    return scale.calcularPuntaje(respuestas);
  }, [respuestas, scale]);

  const handleChange = (questionId: string, value: number) => {
    setRespuestas(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarRespuestas(scale, respuestas)) {
      alert('Por favor complete todos los campos antes de calcular.');
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
        scale={scale}
        totalScore={resultado.puntaje}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
      {/* BARRA DE PROGRESO FIJA */}
      <div className="fixed top-16 left-0 w-full h-1.5 bg-gray-100 z-40">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="w-full h-full relative">
            <div className="absolute right-0 top-0 h-full w-4 bg-white/30 blur-sm"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-4">
        <button
          onClick={onBack}
          className="mb-6 text-teal-600 hover:text-teal-800 font-bold flex items-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a escalas
        </button>

        <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{scale.nombre}</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">{scale.descripcion}</p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-3xl font-black text-teal-600">{Math.round(progress)}%</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {scale.preguntas.map((pregunta, index) => (
            <div 
              key={pregunta.id} 
              className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                respuestas[pregunta.id] !== undefined 
                ? 'bg-white border-teal-100' 
                : 'bg-gray-50/50 border-transparent'
              }`}
            >
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <span className="text-teal-600 mr-2">{index + 1}.</span> 
                {pregunta.text}
              </label>

              {/* LÓGICA DE RENDERIZADO CORREGIDA */}
              {pregunta.type === 'plugin' && pregunta.componente === 'CRONOMETRO' ? (
                <TimerPlugin 
                  label="Control de tiempo"
                  onValueChange={(val) => handleChange(pregunta.id, val)} 
                />
              ) : (
                <div className="w-full">
                  {(pregunta.type === 'select' || pregunta.type === 'radio') && pregunta.options && (
                    <div className="flex flex-col gap-3">
                      {pregunta.options.map((option, idx) => {
                        const isSelected = respuestas[pregunta.id] === option.value;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleChange(pregunta.id, option.value)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm'
                                : 'border-gray-100 bg-white text-gray-600 hover:border-teal-200'
                            }`}
                          >
                            <span className={isSelected ? 'font-bold' : ''}>{option.label}</span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
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

                  {pregunta.type === 'number' && (
                    <input
                      type="number"
                      value={respuestas[pregunta.id] ?? ''}
                      onChange={(e) => handleChange(pregunta.id, Number(e.target.value))}
                      placeholder="Ingrese valor..."
                      className="w-full text-xl font-bold text-center p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 outline-none"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-5 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95"
            >
              Calcular Resultado
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-5 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* CONTADOR FLOTANTE */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/90 backdrop-blur-md border-2 border-teal-500 rounded-3xl p-4 shadow-2xl flex flex-col items-center min-w-[140px]">
          <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Puntaje Actual</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-gray-900">{currentScore}</span>
            <span className="text-gray-400 font-bold">pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}