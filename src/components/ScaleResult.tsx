import { Scale, InterpretacionAvanzada } from '../data/scalesData';
import { ClipboardCheck, ArrowLeft, Copy, AlertCircle, FileText, User, Save } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

interface ScaleResultProps {
  scale: Scale;
  totalScore: number;
  onBack: () => void;
  // --- NUEVAS PROPS PARA EL INFORME CONSOLIDADO ---
  onSave?: (resultado: any) => void;
  pacienteNombre?: string;
}

export default function ScaleResult({ scale, totalScore, onBack, onSave, pacienteNombre }: ScaleResultProps) {
  const [copied, setCopied] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientID, setPatientID] = useState('');

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

  const generateReport = () => {
    const date = new Date().toLocaleDateString();
    let report = `EVALUACIÓN CLÍNICA - EscalaPro\n------------------------------\n`;
    const finalName = pacienteNombre || patientName;
    if (finalName) report += `Paciente: ${finalName}\n`;
    
    report += `Fecha: ${date}\nEscala: ${scale.nombre}\nPuntaje Total: ${totalScore} puntos\nInterpretación: ${interpretationText}`;
    if (recommendationsList.length > 0) {
      report += `\n\nRecomendaciones:\n${recommendationsList.map((r: string) => `- ${r}`).join('\n')}`;
    }
    report += `\n------------------------------\nGenerado por EscalaPro`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 128); 
    doc.text("ESCALAPRO - INFORME CLÍNICO", 20, 20);
    doc.line(20, 25, 190, 25);
    doc.setFontSize(11);
    doc.text(`Fecha: ${date}`, 20, 35);
    
    const finalName = pacienteNombre || patientName;
    if (finalName) doc.text(`Paciente: ${finalName}`, 20, 42);

    doc.setFontSize(14);
    doc.text(`Evaluación: ${scale.nombre}`, 20, 60);
    doc.text(`Puntaje Total: ${totalScore} puntos`, 20, 70);
    doc.text("Interpretación:", 20, 85);
    doc.setFont("helvetica", "normal");
    doc.text(interpretationText as string, 20, 95, { maxWidth: 170 });

    doc.save(`Reporte_${scale.id}.pdf`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto border border-gray-100">
      <div className="text-center mb-6">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className={`w-8 h-8 ${styles.icon}`} />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Resultado Final</h2>
        <p className="text-gray-500 font-medium">{scale.nombre}</p>
      </div>

      <div className={`bg-gradient-to-br ${styles.bg} rounded-3xl p-8 text-white text-center shadow-lg mb-6 relative overflow-hidden transition-all duration-500`}>
        <div className="relative z-10">
          <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-1">Puntaje Obtenido</p>
          <div className="text-6xl font-black mb-3">{totalScore}</div>
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold text-lg">
            {interpretationText}
          </div>
        </div>
      </div>

      {/* --- BOTÓN DE GUARDADO EN INFORME GLOBAL --- */}
      {onSave && pacienteNombre && (
        <button
          onClick={() => onSave({
            idEscala: scale.id,
            nombreEscala: scale.nombre,
            puntaje: totalScore,
            interpretacion: interpretationText,
            color: alertColor,
            recomendaciones: recommendationsList,
            fecha: new Date().toLocaleDateString()
          })}
          className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Save className="w-6 h-6" />
          Añadir al Informe de {pacienteNombre}
        </button>
      )}

      {recommendationsList.length > 0 && (
        <div className={`${styles.light} border rounded-2xl p-5 mb-6 text-left transition-colors duration-500`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className={`w-5 h-5 opacity-70`} />
            <h3 className="text-md font-bold uppercase tracking-tight">Recomendaciones</h3>
          </div>
          <ul className="space-y-1.5">
            {recommendationsList.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm font-medium opacity-90">
                <span>•</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Solo mostramos identificación si NO hay paciente activo */}
      {!pacienteNombre && (
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <User className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase">Identificación del Paciente</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Nombre Completo"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal-500 focus:outline-none transition-colors text-sm text-gray-800"
            />
            <input 
              type="text" 
              value={patientID}
              onChange={(e) => setPatientID(e.target.value)}
              placeholder="RUT o ID"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal-500 focus:outline-none transition-colors text-sm text-gray-800"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={generateReport}
            className={`flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-2xl transition-all active:scale-95 ${
              copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Copy className="w-5 h-5" />
            {copied ? '¡Copiado!' : 'Copiar Texto'}
          </button>

          <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all active:scale-95 shadow-lg shadow-teal-100"
          >
            <FileText className="w-5 h-5" />
            PDF Individual
          </button>
        </div>

        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          Nueva Evaluación
        </button>
      </div>
    </div>
  );
}