import { Scale } from '../data/scalesData';
import { ClipboardCheck, ArrowLeft, Copy, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

interface ScaleResultProps {
  scale: Scale;
  totalScore: number;
  onBack: () => void;
}

export default function ScaleResult({ scale, totalScore, onBack }: ScaleResultProps) {
  const [copied, setCopied] = useState(false);

  // Ejecutamos la función interpretar
  const result = scale.interpretar(totalScore);
  
  // Detectamos formato (texto o avanzado)
  const isAdvanced = typeof result === 'object' && result !== null;
  const interpretationText = isAdvanced ? result.texto : result;
  const recommendations = isAdvanced && result.recomendaciones ? result.recomendaciones : [];

  const generateReport = () => {
    const date = new Date().toLocaleDateString();
    let report = `EVALUACIÓN CLÍNICA - EscalaPro\n------------------------------\nFecha: ${date}\nEscala: ${scale.nombre}\nPuntaje Total: ${totalScore} puntos\nInterpretación: ${interpretationText}`;
    if (recommendations.length > 0) {
      report += `\n\nRecomendaciones:\n${recommendations.map((r: string) => `- ${r}`).join('\n')}`;
    }
    report += `\n------------------------------\nGenerado por EscalaPro`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // FUNCIÓN PARA GENERAR EL PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // Configuración de Estilo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 128); // Color Teal
    doc.text("ESCALAPRO - INFORME CLÍNICO", 20, 20);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 25, 190, 25);

    // Datos Generales
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de evaluación: ${date}`, 20, 35);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Evaluación: ${scale.nombre}`, 20, 45);

    // Cuadro de Puntaje
    doc.setFillColor(240, 250, 250);
    doc.rect(20, 55, 170, 20, 'F');
    doc.setFont("helvetica", "bold");
    doc.text(`Puntaje Total: ${totalScore} puntos`, 25, 68);

    // Interpretación
    doc.setFont("helvetica", "bold");
    doc.text("Interpretación Clínica:", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(interpretationText, 20, 100, { maxWidth: 170 });

    // Recomendaciones
    if (recommendations.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Recomendaciones y Plan de Acción:", 20, 120);
      doc.setFont("helvetica", "normal");
      
      let yPos = 130;
      recommendations.forEach((rec) => {
        const lines = doc.splitTextToSize(`• ${rec}`, 160);
        doc.text(lines, 25, yPos);
        yPos += (lines.length * 7);
      });
    }

    // Pie de página para firma
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("__________________________________", 20, 260);
    doc.text("Firma y Timbre del Profesional", 20, 265);
    doc.text("Documento generado automáticamente por EscalaPro", 20, 280);

    // Descarga
    doc.save(`Reporte_${scale.id}_${date.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Resultado Final</h2>
        <p className="text-gray-500 font-medium">{scale.nombre}</p>
      </div>

      <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-3xl p-10 text-white text-center shadow-lg mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-teal-100 font-bold uppercase tracking-widest text-sm mb-2">Puntaje Obtenido</p>
          <div className="text-7xl font-black mb-4">{totalScore}</div>
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold text-xl">
            {interpretationText}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {recommendations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-900">Recomendaciones Clínicas</h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-amber-800 font-medium">
                <span className="text-amber-500 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={generateReport}
            className={`flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-2xl transition-all active:scale-95 shadow-md ${
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
            Descargar PDF
          </button>
        </div>

        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          Nueva Evaluación
        </button>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8 italic">
        "Uso exclusivo para profesionales de la salud. Valide siempre con su criterio clínico."
      </p>
    </div>
  );
}