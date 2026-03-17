import { useState, useMemo } from 'react';
import { Scale } from '../data/scalesData';
// ✅ Importamos la nueva función del Paso 1
import { calcularEscala, validarRespuestas, obtenerPreguntasFaltantes } from '../utils/scaleEngine';
import { feedback } from '../utils/feedback';
import ScaleResult from './ScaleResult';
import TimerPlugin from './plugins/TimerPlugin';
import { BookOpen, ExternalLink, ShieldCheck, Info, AlertCircle } from 'lucide-react';

interface ScaleFormProps {
  scale: Scale;
  onBack: () => void;
  onSave?: (resultado: any) => void;
  pacienteNombre?: string;
}

export default function ScaleForm({ scale, onBack, onSave, pacienteNombre }: ScaleFormProps) {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [faltantes, setFaltantes] = useState<string[]>([]); // ✅ Rastreo de campos vacíos
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
    // Usamos el motor para el cálculo en vivo (aunque sea parcial)
    return scale.calcularPuntaje(respuestas);
  }, [respuestas, scale]);

  const handleChange = (questionId: string, value: number) => {
    feedback.playClick();
    feedback.vibrate(10); 
    
    // ✅ Limpiamos el error visual si el usuario ya respondió esta pregunta
    if (faltantes.includes(questionId)) {
      setFaltantes(prev => prev.filter(id => id !== questionId));
    }

    setRespuestas(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ PASO 2: Verificamos qué preguntas faltan exactamente
    const camposVacios = obtenerPreguntasFaltantes(scale, respuestas);
    
    if (camposVacios.length > 0) {
      setFaltantes(camposVacios); // Marcamos visualmente
      feedback.warning();
      // No usamos alert, el feedback visual en las tarjetas es suficiente y más profesional
      return;
    }

    feedback.success();
    
    const result = calcularEscala(scale, respuestas);
    
    // Si el motor devuelve puntaje null por seguridad, no avanzamos
    if (result.puntaje !== null) {
      setResultado({
        puntaje: result.puntaje,
        interpretacion: result.interpretacion
      });
    }
  };

  const handleReset = () => {
    feedback.vibrate(30);
    setRespuestas({});
    setFaltantes([]);
    setResultado(null);
  };

  if (resultado) {
    return (
      <ScaleResult
        scale={scale}
        totalScore={resultado.puntaje}
        respuestas={respuestas}
        onBack={onBack}
        onSave={onSave}
        pacienteNombre={pacienteNombre}
      />
    );
  }

  return (
    <>
      {/* 1. BARRA DE PROGRESO */}
      <div className="fixed top-16 left-0 w-full h-1.5 bg-gray-100 z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 2. PÍLDORA DE PUNTAJE EN VIVO */}
      <div className="fixed top-28 right-4 z-[100] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xl border-2 border-teal-500 rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-3 pointer-events-auto">
          <div className="flex flex-col items-end border-r border-teal-100 pr-3">
            <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest leading-none mb-1">Total</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">Puntos</span>
          </div>
          <span className="text-2xl font-black text-gray-900 tabular-nums">{currentScore}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pb-10 px-4 pt-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-4">
          
          <button
            onClick={onBack}
            className="mb-6 text-teal-600 hover:text-teal-800 font-bold flex items-center gap-2 transition-all hover:-translate-x-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>

          <div className="mb-8 border-b border-gray-100 pb-6">
            {pacienteNombre && (
              <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl inline-flex items-center gap-2 mb-4">
                 <ShieldCheck size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Paciente: {pacienteNombre}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{scale.nombre}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{scale.descripcion}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {scale.preguntas.map((pregunta, index) => {
              const esFaltante = faltantes.includes(pregunta.id);
              return (
                <div 
                  key={pregunta.id} 
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                    esFaltante 
                    ? 'bg-red-50 border-red-200 shadow-md ring-4 ring-red-50' // ✅ Estilo de error
                    : respuestas[pregunta.id] !== undefined 
                    ? 'bg-white border-teal-100 shadow-sm' 
                    : 'bg-gray-50/50 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <label className={`text-lg font-semibold leading-snug ${esFaltante ? 'text-red-700' : 'text-gray-800'}`}>
                      <span className={`${esFaltante ? 'text-red-600' : 'text-teal-600'} mr-2 font-black`}>{index + 1}.</span> 
                      {pregunta.text}
                    </label>
                    {esFaltante && (
                      <div className="bg-red-600 text-white p-1 rounded-full animate-pulse">
                        <AlertCircle size={18} />
                      </div>
                    )}
                  </div>

                  {esFaltante && (
                    <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-1">
                       Campo obligatorio para el cálculo
                    </p>
                  )}

                  {pregunta.type === 'plugin' && pregunta.componente === 'CRONOMETRO' ? (
                    <TimerPlugin 
                      label="Asistente de tiempo"
                      onValueChange={(val) => handleChange(pregunta.id, val)} 
                    />
                  ) : (
                    <div className="w-full">
                      {(pregunta.type === 'select' || pregunta.type === 'radio') && pregunta.options && (
                        <div className="flex flex-col gap-2.5">
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
                                    : esFaltante
                                    ? 'border-red-100 bg-white/50 text-red-400'
                                    : 'border-gray-100 bg-white text-gray-600 hover:border-teal-200'
                                }`}
                              >
                                <span className={isSelected ? 'font-bold' : ''}>{option.label}</span>
                                <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-teal-500 bg-teal-500' : esFaltante ? 'border-red-200' : 'border-gray-300'
                                }`}>
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
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
                          placeholder="Ingrese valor numérico..."
                          className={`w-full text-xl font-bold text-center p-4 border-2 rounded-xl focus:border-teal-500 outline-none ${
                            esFaltante ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-8 border-t border-gray-100">
              <button
                type="submit"
                className={`flex-1 py-5 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95 flex flex-col items-center justify-center leading-none ${
                  faltantes.length > 0 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <span>{faltantes.length > 0 ? 'Verificar Formulario' : 'Calcular Resultado'}</span>
                {faltantes.length > 0 && (
                  <span className="text-[10px] uppercase tracking-widest mt-2 opacity-80">Faltan {faltantes.length} campos</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-5 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}