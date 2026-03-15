import { Scale, InterpretacionAvanzada } from '../data/scalesData';
import { ClipboardCheck, ArrowLeft, Copy, AlertCircle, FileText, User, Save } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

interface ScaleResultProps {
  scale: Scale;
  totalScore: number;
  onBack: () => void;
  onSave?: (resultado: any) => void;
  pacienteNombre?: string;
}

export default function ScaleResult({ scale, totalScore, onBack, onSave, pacienteNombre }: ScaleResultProps) {
  const [copied, setCopied] = useState(false);

  const result = scale.interpretar(totalScore);
  const isAdvanced = typeof result === 'object' && result !== null;
  const interpretationText = isAdvanced ? (result as InterpretacionAvanzada).texto : result;
  const recommendationsList = isAdvanced ? (result as InterpretacionAvanzada).recomendaciones : [];
  const alertColor = isAdvanced ? (result as InterpretacionAvanzada).color : 'blue';

  const getAlertStyles = (color?: string) => {
    switch (color) {
      case 'green': return { bg: 'from-green-600 to-emerald-700', light: 'bg-green-50 border-green-200 text-green-900', icon: 'text-green-600' };
      case 'yellow': return { bg: 'from-yellow-500 to-amber-600', light: 'bg-yellow-50 border-yellow-200 text-yellow-900', icon: 'text-yellow-600' };
      case 'orange': return { bg: 'from-orange-500 to-red-600', light: 'bg-orange-50 border-orange-200 text-orange-900', icon: 'text-orange-600' };
      case 'red': return { bg: 'from-red-600 to-rose-800 animate-pulse', light: 'bg-red-50 border-red-200 text-red-900', icon: 'text-red-600' };
      default: return { bg: 'from-teal-600 to-blue-600', light: 'bg-blue-50 border-blue-200 text-blue-900', icon: 'text-blue-600' };
    }
  };

  const styles = getAlertStyles(alertColor);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto border border-gray-100 mb-10">
      
      {/* --- BOTÓN DE PRUEBA: SIEMPRE VISIBLE SI HAY PACIENTE --- */}
      {pacienteNombre ? (
        <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl animate-in zoom-in duration-500">
           <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 text-center">Panel de Guardado Directo</p>
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
                  fecha: new Date().toLocaleDateString()
                });
              } else {
                alert("Error: La sesión está activa pero el sistema de guardado no responde. Revisa la consola.");
              }
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Save className="w-6 h-6" />
            Guardar en el informe de {pacienteNombre}
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl text-center">
          <p className="text-sm font-bold text-amber-700">⚠️ No hay paciente activo. Inicia uno en el Dashboard para guardar.</p>
        </div>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900">{scale.nombre}</h2>
        <p className="text-gray-500 font-medium">Resultado de la evaluación</p>
      </div>

      <div className={`bg-gradient-to-br ${styles.bg} rounded-3xl p-8 text-white text-center shadow-lg mb-6`}>
        <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-1">Puntaje</p>
        <div className="text-6xl font-black mb-3">{totalScore}</div>
        <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold">
          {interpretationText}
        </div>
      </div>

      {/* Botones de acción secundaria */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={onBack} className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all">
          <ArrowLeft size={18} /> Volver
        </button>
        <button onClick={() => window.print()} className="flex items-center justify-center gap-2 py-4 bg-teal-50 text-teal-700 font-bold rounded-2xl border border-teal-100">
          <FileText size={18} /> Imprimir
        </button>
      </div>
    </div>
  );
}