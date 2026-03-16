import { Scale, InterpretacionAvanzada } from '../data/scalesData';
import { 
  ClipboardCheck, ArrowLeft, Save, ShieldCheck, 
  BookOpen, ExternalLink, Activity, FileText 
} from 'lucide-react';
import { useState } from 'react';

interface ScaleResultProps {
  scale: Scale;
  totalScore: number;
  respuestas: Record<string, number>;
  onBack: () => void;
  onSave?: (resultado: any) => void;
  pacienteNombre?: string;
}

export default function ScaleResult({ 
  scale, 
  totalScore, 
  respuestas, 
  onBack, 
  onSave, 
  pacienteNombre 
}: ScaleResultProps) {
  
  // 1. Obtenemos la interpretación (Enviando respuestas para cálculos complejos tipo Strassmann)
  const result = scale.interpretar(totalScore, respuestas); 
  
  const isAdvanced = typeof result === 'object' && result !== null;
  const interpretationText = isAdvanced ? (result as InterpretacionAvanzada).texto : result;
  const recommendationsList = isAdvanced ? (result as InterpretacionAvanzada).recomendaciones : [];
  const alertColor = isAdvanced ? (result as InterpretacionAvanzada).color : 'slate';
  const evidenciaEspecifica = isAdvanced ? (result as any).evidencia : null;

  // 2. Sistema de Normalización de Colores Clínicos (Mejora 1)
  const getAlertStyles = (color?: string) => {
    const c = color?.toLowerCase() || '';
    
    // Verde / Éxito
    if (c.includes('emerald') || c.includes('green') || c.includes('success')) 
      return { 
        bg: 'from-emerald-600 to-teal-700', 
        light: 'bg-emerald-50 border-emerald-200 text-emerald-900', 
        icon: 'text-emerald-600' 
      };
    
    // Azul / Información
    if (c.includes('blue') || c.includes('info')) 
      return { 
        bg: 'from-blue-600 to-indigo-700', 
        light: 'bg-blue-50 border-blue-200 text-blue-900', 
        icon: 'text-blue-600' 
      };
    
    // Amarillo - Naranja / Advertencia
    if (c.includes('amber') || c.includes('yellow') || c.includes('orange') || c.includes('warning')) 
      return { 
        bg: 'from-amber-500 to-orange-600', 
        light: 'bg-amber-50 border-amber-200 text-amber-900', 
        icon: 'text-amber-600' 
      };
    
    // Rojo / Peligro Crítico
    if (c.includes('red') || c.includes('rose') || c.includes('danger')) 
      return { 
        bg: 'from-red-600 to-rose-800 animate-pulse', 
        light: 'bg-red-50 border-red-200 text-red-900', 
        icon: 'text-red-600' 
      };
      
    // Default / Neutro
    return { 
      bg: 'from-slate-700 to-slate-900', 
      light: 'bg-slate-50 border-slate-200 text-slate-900', 
      icon: 'text-slate-600' 
    };
  };

  const styles = getAlertStyles(alertColor);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto border border-gray-100 mb-10 animate-in fade-in zoom-in duration-500">
      
      {/* PANEL DE VINCULACIÓN */}
      {pacienteNombre ? (
        <div className="mb-8 p-5 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] animate-in slide-in-from-top-4">
           <p className="text-[10px] font-black text-emerald-600 uppercase mb-3 text-center tracking-widest">Paciente: {pacienteNombre}</p>
           <button
            onClick={() => {
              if (onSave) {
                onSave({
                  idEscala: scale.id,
                  nombreEscala: scale.nombre,
                  puntaje: totalScore,
                  interpretacion: interpretationText,
                  color: alertColor,
                  recomendaciones: recommendationsList,
                  evidencia: evidenciaEspecifica,
                  fecha: new Date().toLocaleDateString('es-CL')
                });
                alert("✓ Resultado guardado con éxito.");
              }
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Save className="w-6 h-6" />
            Vincular al Informe
          </button>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <p className="text-xs font-bold text-slate-500 italic">Modo Consulta Rápida</p>
        </div>
      )}

      {/* TÍTULO */}
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-gray-50 rounded-2xl mb-4">
          <ClipboardCheck className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 leading-tight">{scale.nombre}</h2>
      </div>

      {/* SCORE CARD PROFESIONAL */}
      <div className={`bg-gradient-to-br ${styles.bg} rounded-[2rem] p-8 text-white text-center shadow-xl mb-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Activity size={120} />
        </div>
        <p className="text-white/70 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Puntaje Obtenido</p>
        <div className="text-7xl font-black mb-4 tracking-tighter tabular-nums">{totalScore}</div>
        <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-2xl font-black text-sm uppercase tracking-wide">
          {interpretationText}
        </div>
      </div>

      {/* BLOQUE DE RESPALDO (UPTODATE STYLE) */}
      {evidenciaEspecifica && (
        <div className={`mb-8 p-6 rounded-[2rem] border-2 ${styles.light} animate-in slide-in-from-bottom-4 duration-700`}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className={styles.icon + " w-5 h-5"} />
            <h4 className="font-black uppercase text-xs tracking-widest">Evidencia del Resultado</h4>
          </div>
          <p className="text-sm font-bold leading-relaxed italic">
            "{evidenciaEspecifica}"
          </p>
        </div>
      )}

      {/* RECOMENDACIONES CLÍNICAS */}
      {recommendationsList.length > 0 && (
        <div className="mb-8">
          <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest mb-4 px-2">Sugerencias de Intervención</h4>
          <div className="space-y-3">
            {recommendationsList.map((rec, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-teal-600 shrink-0 shadow-sm border border-teal-50">{i+1}</div>
                <p className="text-sm font-semibold text-gray-700 leading-snug">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACCIONES FINALIZACIÓN */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={onBack} className="flex items-center justify-center gap-2 py-5 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase text-xs tracking-widest active:scale-95">
          <ArrowLeft size={18} /> Nueva Evaluación
        </button>
        <button onClick={() => window.print()} className="flex items-center justify-center gap-2 py-5 bg-teal-50 text-teal-700 font-black rounded-2xl border-2 border-teal-100 hover:bg-teal-100 transition-all uppercase text-xs tracking-widest active:scale-95">
          <FileText size={18} /> Imprimir PDF
        </button>
      </div>

      {/* BIBLIOGRAFÍA */}
      {scale.bibliografia && (
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-gray-400">
            <BookOpen size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Referencia Científica</span>
          </div>
          <p className="text-[10px] text-gray-500 italic leading-relaxed mb-3">
            {scale.bibliografia}
          </p>
          {scale.referenciaUrl && (
            <a 
              href={scale.referenciaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-black text-teal-600 hover:text-teal-800 transition-colors"
            >
              <ExternalLink size={12} /> VER ESTUDIO ORIGINAL (PUBMED)
            </a>
          )}
        </div>
      )}
    </div>
  );
}