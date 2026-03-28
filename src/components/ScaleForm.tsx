import { useState, useMemo } from 'react';
import { Scale } from '../data/scalesData';
import { calcularEscala, obtenerPreguntasFaltantes } from '../core/scaleEngine';
import { feedback } from '../utils/feedback';
import ScaleResult from './ScaleResult';
import TimerPlugin from './plugins/TimerPlugin';
import { 
  ShieldCheck, AlertCircle, ArrowLeft, ChevronDown, ChevronUp, Layers, CheckCircle2 
} from 'lucide-react';

interface ScaleFormProps {
  scale: Scale;
  onBack: () => void;
  onSave?: (resultado: any) => void;
  pacienteNombre?: string;
  pacienteContexto?: any;
}

export default function ScaleForm({ scale, onBack, onSave, pacienteNombre, pacienteContexto }: ScaleFormProps) {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [faltantes, setFaltantes] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // ✅ LÓGICA CEO: Agrupación Automática de Preguntas
  const groupedQuestions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    scale.preguntas.forEach(q => {
      let sectionName = "Evaluación General";
      // Clasificación por prefijos (TEPSI: c, l, m | EEDP: e)
      if (q.id.startsWith('c')) sectionName = "Área Coordinación";
      else if (q.id.startsWith('l')) sectionName = "Área Lenguaje";
      else if (q.id.startsWith('m')) sectionName = "Área Motricidad";
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
    feedback.playClick();
    feedback.vibrate(10); 
    const nuevasRespuestas = { ...respuestas, [questionId]: value };
    setRespuestas(nuevasRespuestas);
    setFaltantes(obtenerPreguntasFaltantes(scale, nuevasRespuestas));
  };

  const [resultado, setResultado] = useState<{puntaje: number; interpretacion: string;} | null>(null);

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
      pacienteDias: pacienteContexto?.totalDias || 0,
      pacienteAnios: pacienteContexto?.años || 0
    };

    feedback.success();
    const result = calcularEscala(scale, respuestasConContexto);
    if (result.puntaje !== null) {
      setResultado({ puntaje: result.puntaje, interpretacion: result.interpretacion });
    }
  };

  if (resultado) return <ScaleResult scale={scale} totalScore={resultado.puntaje} respuestas={{...respuestas, ...pacienteContexto}} onBack={onBack} onSave={onSave} pacienteNombre={pacienteNombre} />;

  return (
    <>
      {/* BARRA DE PROGRESO */}
      <div className="fixed top-16 left-0 w-full h-1.5 bg-gray-100 z-[60]">
        <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* PUNTUACIÓN FLOTANTE */}
      <div className="fixed top-28 right-4 z-[100] pointer-events-none">
        <div className="bg-slate-900 border-2 border-teal-500 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 pointer-events-auto">
          <div className="text-right">
            <p className="text-[8px] font-black text-teal-400 uppercase tracking-widest">Puntos</p>
            <p className="text-2xl font-black text-white leading-none">{currentScore}</p>
          </div>
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white">
             <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pb-10 px-4 pt-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 sm:p-10 mt-4 border border-slate-100">
          
          <button onClick={onBack} className="mb-8 text-slate-400 hover:text-teal-600 font-bold flex items-center gap-2 group transition-all">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Volver al Catálogo</span>
          </button>

          <div className="mb-10 border-b border-slate-50 pb-8">
            {pacienteNombre && (
              <div className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl inline-flex items-center gap-3 mb-6">
                 <ShieldCheck size={14} className="text-teal-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest">
                   Protocolo: {pacienteNombre} {pacienteContexto?.años ? `(${pacienteContexto.años} años)` : ''}
                 </span>
              </div>
            )}
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-3">{scale.nombre}</h2>
            <p className="text-slate-500 font-medium">{scale.descripcion}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(groupedQuestions).map(([sectionName, questions]) => {
              const isOpen = openSections[sectionName] !== false; // Abiertas por defecto
              const respondidas = questions.filter(q => respuestas[q.id] !== undefined).length;
              const esCompleta = respondidas === questions.length;

              return (
                <div key={sectionName} className={`border-2 rounded-[2rem] transition-all overflow-hidden ${isOpen ? 'border-slate-100 bg-slate-50/30' : 'border-transparent bg-white shadow-sm'}`}>
                  {/* HEADER DEL DESPLEGABLE */}
                  <button 
                    type="button"
                    onClick={() => toggleSection(sectionName)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50/80 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${esCompleta ? 'bg-emerald-100 text-emerald-600' : 'bg-teal-50 text-teal-600'}`}>
                        {esCompleta ? <CheckCircle2 size={24} /> : <Layers size={24} />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">{sectionName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500 transition-all" style={{ width: `${(respondidas/questions.length)*100}%` }} />
                           </div>
                           <span className="text-[9px] font-black text-slate-400 uppercase">{respondidas} / {questions.length}</span>
                        </div>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="text-slate-300" /> : <ChevronDown className="text-slate-300" />}
                  </button>

                  {/* CONTENIDO DESPLEGABLE */}
                  {isOpen && (
                    <div className="p-6 space-y-5 animate-in slide-in-from-top-4 duration-300">
                      {questions.map((pregunta, idx) => {
                        const esInvalido = faltantes.includes(pregunta.id);
                        const tieneValor = respuestas[pregunta.id] !== undefined;

                        return (
                          <div key={pregunta.id} className={`p-6 rounded-[1.5rem] border-2 transition-all ${esInvalido ? 'bg-red-50 border-red-200 shadow-inner' : tieneValor ? 'bg-white border-teal-500/10 shadow-sm' : 'bg-white/50 border-slate-50'}`}>
                             <div className="flex justify-between items-start mb-4">
                                <label className="text-sm font-bold text-slate-700 leading-tight">
                                  <span className="text-teal-600 mr-2 font-black italic">{idx + 1}.</span> {pregunta.text}
                                </label>
                                {esInvalido && <AlertCircle size={18} className="text-red-500 animate-pulse" />}
                             </div>
                             
                             <div className="flex gap-2">
                               {pregunta.options?.map((opt: any) => (
                                 <button
                                   key={opt.value}
                                   type="button"
                                   onClick={() => handleChange(pregunta.id, opt.value)}
                                   className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all active:scale-95 ${
                                     respuestas[pregunta.id] === opt.value
                                     ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                                     : 'bg-white border-slate-100 text-slate-400 hover:border-teal-200'
                                   }`}
                                 >
                                   {opt.label}
                                 </button>
                               ))}
                             </div>
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
                className={`w-full py-7 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex flex-col items-center justify-center gap-1 ${
                  progress < 100 ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
                }`}
              >
                <span>{progress < 100 ? 'Evaluación Incompleta' : 'Finalizar y Generar Diagnóstico'}</span>
                {progress < 100 && (
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                    Faltan {scale.preguntas.length - Object.keys(respuestas).length} ítems
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}