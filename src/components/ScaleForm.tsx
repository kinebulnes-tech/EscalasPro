import { useState, useMemo, useEffect } from 'react';
import { Scale } from '../data/scalesData';
import { calcularEscala, obtenerPreguntasFaltantes } from '../core/scaleEngine';
import { feedback } from '../utils/feedback';
import ScaleResult from './ScaleResult';
import { 
  ShieldCheck, AlertCircle, ArrowLeft, ChevronDown, ChevronUp, 
  Layers, CheckCircle2, Play, Square, RotateCcw, Timer as TimerIcon 
} from 'lucide-react';

interface ScaleFormProps {
  scale: Scale;
  onBack: () => void;
  onSave?: (resultado: any) => void;
  onToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  pacienteNombre?: string;
  pacienteContexto?: any;
}

const Stopwatch = ({ duration, onFinish }: { duration?: number, onFinish?: (seconds: number) => void }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggle = () => { feedback.playClick(); setIsActive(!isActive); };
  const reset  = () => { feedback.playClick(); setIsActive(false); setSeconds(0); };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 p-6 rounded-3xl border-2 border-teal-500/30 my-4 shadow-xl">
      <div className="text-5xl font-black text-white tabular-nums mb-6 tracking-tighter">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={toggle} className={`p-4 rounded-2xl transition-all active:scale-90 ${isActive ? 'bg-red-500 text-white' : 'bg-teal-500 text-white'}`}>
          {isActive ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        <button type="button" onClick={reset} className="p-4 bg-slate-700 text-slate-300 rounded-2xl hover:text-white transition-all active:scale-90">
          <RotateCcw size={24} />
        </button>
      </div>
      {duration && (
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-teal-400">
          Objetivo: {duration} segundos
        </p>
      )}
    </div>
  );
};

export default function ScaleForm({ scale, onBack, onSave, onToast, pacienteNombre, pacienteContexto }: ScaleFormProps) {
  const [respuestas, setRespuestas]     = useState<Record<string, number>>({});
  const [faltantes, setFaltantes]       = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [resultado, setResultado] = useState<{puntaje: number; interpretacion: string; alerta: any;} | null>(null);

  // ✅ GUARD: estado para el modal de confirmación al volver
  const [showConfirmVolver, setShowConfirmVolver] = useState(false);

  const groupedQuestions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    scale.preguntas.forEach(q => {
      let sectionName = "Evaluación General";
      if (q.id.startsWith('c')) sectionName = "Área Coordinación";
      else if (q.id.startsWith('l')) sectionName = "Área Lenguaje";
      else if (q.id.startsWith('m')) sectionName = "Área Motricidad";
      else if (q.id.startsWith('t_')) sectionName = "Parámetros Funcionales";
      else if (q.id.startsWith('deg_') || q.id.startsWith('force_')) sectionName = "Mediciones Objetivas";
      else if (q.id.startsWith('h_')) sectionName = "Área Clínica";
      else if (q.id.startsWith('e')) {
        const mes = q.id.split('_')[0].replace('e', '');
        sectionName = `Evaluación: Mes ${mes}`;
      }
      if (!groups[sectionName]) groups[sectionName] = [];
      groups[sectionName].push(q);
    });
    return groups;
  }, [scale.preguntas]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const preguntasRequeridas = useMemo(() => {
    return scale.preguntas.filter(q => q.type !== 'text');
  }, [scale.preguntas]);

  const progress = useMemo(() => {
    const totalPreguntas = preguntasRequeridas.length;
    if (totalPreguntas === 0) return 100;
    const respondidas = preguntasRequeridas.filter(q => respuestas[q.id] !== undefined && respuestas[q.id] !== null).length;
    return (respondidas / totalPreguntas) * 100;
  }, [respuestas, preguntasRequeridas]);

  const currentScore = useMemo(() => {
    if (Object.keys(respuestas).length === 0) return 0;
    return scale.calcularPuntaje(respuestas);
  }, [respuestas, scale]);

  const handleChange = (questionId: string, value: number) => {
    feedback.playClick();
    feedback.vibrate(10);
    const nuevasRespuestas = { ...respuestas, [questionId]: value };
    setRespuestas(nuevasRespuestas);
    setFaltantes(obtenerPreguntasFaltantes(scale, nuevasRespuestas));
  };

  // ✅ GUARD: si hay respuestas, muestra modal; si no, vuelve directo
  const handleBack = () => {
    const hayRespuestas = Object.keys(respuestas).length > 0;
    if (hayRespuestas) {
      setShowConfirmVolver(true);
    } else {
      onBack();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposInvalidos = obtenerPreguntasFaltantes(scale, respuestas);
    if (camposInvalidos.length > 0) {
      setFaltantes(camposInvalidos);
      feedback.warning();
      return;
    }
    const respuestasConContexto = {
      ...respuestas,
      pacienteMeses: pacienteContexto?.totalMeses || 0,
      pacienteDias:  pacienteContexto?.totalDias  || 0,
      pacienteAnios: pacienteContexto?.años        || 0
    };
    feedback.success();
    const result = calcularEscala(scale, respuestasConContexto);
if (result.puntaje !== null) {
  setResultado({ puntaje: result.puntaje, interpretacion: result.interpretacion, alerta: result.alerta });
}
  };

 if (resultado) return (
  <ScaleResult
    scale={scale}
    totalScore={resultado.puntaje}
    respuestas={{...respuestas, ...pacienteContexto}}
    onBack={onBack}
    onSave={onSave}
    onToast={onToast}
    pacienteNombre={pacienteNombre}
    alerta={resultado.alerta}
  />
);

  return (
    <>
      <div className="fixed top-16 left-0 w-full h-1.5 bg-gray-100 z-[60]">
        <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="fixed top-28 right-4 z-[100] pointer-events-none">
        <div className="bg-slate-900 border-2 border-teal-500 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 pointer-events-auto">
          <div className="text-right">
            <p className="text-[8px] font-black text-teal-400 uppercase tracking-widest leading-none mb-1">Puntos</p>
            <p className="text-2xl font-black text-white leading-none tabular-nums">{currentScore}</p>
          </div>
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pb-10 px-4 pt-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 sm:p-10 mt-4 border border-slate-100">

          {/* ✅ GUARD: usa handleBack en lugar de onBack directo */}
          <button onClick={handleBack} className="mb-8 text-slate-400 hover:text-teal-600 font-bold flex items-center gap-2 group transition-all">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Volver al Catálogo</span>
          </button>

          <div className="mb-10 border-b border-slate-50 pb-8">
            {pacienteNombre && (
              <div className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl inline-flex items-center gap-3 mb-6 shadow-sm">
                <ShieldCheck size={14} className="text-teal-600" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  Evaluando: {pacienteNombre} {pacienteContexto?.años ? `(${pacienteContexto.años} años)` : ''}
                </span>
              </div>
            )}
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-3 leading-tight">{scale.nombre}</h2>
            <p className="text-slate-500 font-medium leading-relaxed">{scale.descripcion}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(groupedQuestions).map(([sectionName, questions]) => {
              const isOpen         = openSections[sectionName] !== false;
              const preguntasSección = questions.filter(q => q.type !== 'text');
              const respondidas    = preguntasSección.filter(q => respuestas[q.id] !== undefined && respuestas[q.id] !== null).length;
              const esCompleta     = preguntasSección.length === 0 || respondidas === preguntasSección.length;

              return (
                <div key={sectionName} className={`border-2 rounded-[2rem] transition-all overflow-hidden ${isOpen ? 'border-slate-100 bg-slate-50/30' : 'border-transparent bg-white shadow-sm'}`}>
                  <button type="button" onClick={() => toggleSection(sectionName)} className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50/80 transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${esCompleta ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'bg-teal-50 text-teal-600'}`}>
                        {esCompleta ? <CheckCircle2 size={24} /> : <Layers size={24} />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">{sectionName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 transition-all duration-700" style={{ width: `${preguntasSección.length > 0 ? (respondidas/preguntasSección.length)*100 : 100}%` }} />
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{respondidas} / {preguntasSección.length}</span>
                        </div>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="text-slate-300" /> : <ChevronDown className="text-slate-300" />}
                  </button>

                  {isOpen && (
                    <div className="p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                      {questions.map((pregunta, idx) => {
                        const esInvalido = faltantes.includes(pregunta.id);
                        const tieneValor = respuestas[pregunta.id] !== undefined && respuestas[pregunta.id] !== null;

                        return (
                          <div key={pregunta.id} className={`p-6 rounded-[1.5rem] border-2 transition-all ${pregunta.type === 'text' ? 'bg-white border-slate-50' : esInvalido ? 'bg-red-50 border-red-200 shadow-inner' : tieneValor ? 'bg-white border-teal-500/10 shadow-sm' : 'bg-white/50 border-slate-50'}`}>
                            <div className="flex justify-between items-start mb-5">
                              <label className="text-sm font-bold text-slate-700 leading-tight">
                                {pregunta.type !== 'text' && <span className="text-teal-600 mr-2 font-black italic">{idx + 1}.</span>} {pregunta.text}
                              </label>
                              {esInvalido && pregunta.type !== 'text' && <AlertCircle size={18} className="text-red-500 animate-pulse" />}
                            </div>

                            {pregunta.type === 'text' ? (
                              <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                                <div className="text-sm font-semibold text-teal-800 leading-relaxed">
                                  {pregunta.placeholder || 'Lea las instrucciones antes de continuar.'}
                                </div>
                              </div>
                            ) : pregunta.type === 'timer' ? (
                              <div className="flex flex-col items-center">
                                <Stopwatch duration={(pregunta as any).duration} />
                                <div className="w-full mt-4 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                                  <p className="text-[10px] font-black text-teal-700 uppercase mb-2 tracking-widest">Registrar Resultado Manual:</p>
                                  <input
                                    type="number"
                                    value={respuestas[pregunta.id] ?? ''}
                                    onChange={(e) => handleChange(pregunta.id, e.target.value === '' ? null as any : Number(e.target.value))}
                                    className="w-full bg-white border-2 border-teal-200 rounded-xl py-3 px-4 text-xl font-black text-slate-900 outline-none"
                                    placeholder="Ingrese repeticiones o segundos"
                                  />
                                </div>
                              </div>
                            ) : pregunta.type === 'number' ? (
                              <div className="relative max-w-[220px]">
                                <input
                                  type="number"
                                  value={respuestas[pregunta.id] ?? ''}
                                  onChange={(e) => handleChange(pregunta.id, e.target.value === '' ? null as any : Number(e.target.value))}
                                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-2xl font-black text-slate-900 focus:border-teal-500 focus:bg-white outline-none transition-all placeholder:text-slate-200"
                                  placeholder="0"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                                    {pregunta.id.includes('deg') ? 'Grados' : pregunta.id.includes('peso') ? 'Kg' : pregunta.id.includes('altura') || pregunta.id.includes('talla') ? 'cm' : 'Valor'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className={`grid gap-3 ${pregunta.options && pregunta.options.length <= 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-5'}`}>
                                {pregunta.options?.map((opt: any) => {
                                  const isSelected = respuestas[pregunta.id] === opt.value;
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => handleChange(pregunta.id, opt.value)}
                                      className={`relative py-4 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all active:scale-95 flex items-center justify-center text-center ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-xl z-10' : 'bg-white border-slate-100 text-slate-400 hover:border-teal-200'}`}
                                    >
                                      {isSelected && (
                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-20">
                                          <CheckCircle2 size={10} className="text-white" />
                                        </div>
                                      )}
                                      <span className="leading-tight">{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-10">
              <button
                type="submit"
                disabled={progress < 100}
                className={`w-full py-7 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex flex-col items-center justify-center gap-1 ${progress < 100 ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-teal-200'}`}
              >
                <span>{progress < 100 ? 'Evaluación en curso' : 'Finalizar Evaluación'}</span>
                {progress < 100 && (
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                    Faltan {preguntasRequeridas.length - preguntasRequeridas.filter(q => respuestas[q.id] !== undefined && respuestas[q.id] !== null).length} ítems
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ GUARD: Modal de confirmación al intentar volver con respuestas a medias */}
      {showConfirmVolver && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-slate-900 mb-2">¿Abandonar evaluación?</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Tienes {Object.keys(respuestas).length} {Object.keys(respuestas).length === 1 ? 'respuesta respondida' : 'respuestas respondidas'}. Si vuelves ahora perderás el progreso.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmVolver(false)}
                className="py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all text-sm active:scale-95"
              >
                Seguir evaluando
              </button>
              <button
                onClick={() => { setShowConfirmVolver(false); onBack(); }}
                className="py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all text-sm active:scale-95"
              >
                Sí, abandonar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}