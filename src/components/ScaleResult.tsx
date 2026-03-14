import { Scale, InterpretacionAvanzada } from '../data/scalesData';
import { ClipboardCheck, ArrowLeft, Copy, AlertCircle, FileText, User } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

interface ScaleResultProps {
  scale: Scale;
  totalScore: number;
  onBack: () => void;
}

export default function ScaleResult({ scale, totalScore, onBack }: ScaleResultProps) {
  const [copied, setCopied] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientID, setPatientID] = useState('');

  // Obtenemos el resultado
  const result = scale.interpretar(totalScore);
  
  // Verificamos si es avanzado (objeto) o simple (string)
  const isAdvanced = typeof result === 'object' && result !== null;
  
  // Extraemos los datos usando el nombre exacto de la interfaz (texto y recomendaciones)
  const interpretationText = isAdvanced ? (result as InterpretacionAvanzada).texto : result;
  const recommendationsList = isAdvanced ? (result as InterpretacionAvanzada).recomendaciones : [];

  const generateReport = () => {
    const date = new Date().toLocaleDateString();
    let report = `EVALUACIÓN CLÍNICA - EscalaPro\n------------------------------\n`;
    
    if (patientName) report += `Paciente: ${patientName}\n`;
    if (patientID) report += `RUT/ID: ${patientID}\n`;
    
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
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${date}`, 20, 35);
    
    if (patientName || patientID) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      if (patientName) doc.text(`Paciente: ${patientName}`, 20, 42);
      if (patientID) doc.text(`RUT/ID: ${patientID}`, 20, 49);
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Evaluación: ${scale.nombre}`, 20, 60);

    doc.setFillColor(240, 250, 250);
    doc.rect(20, 65, 170, 15, 'F');
    doc.text(`Puntaje Total: ${totalScore} puntos`, 25, 75);

    doc.setFont("helvetica", "bold");
    doc.text("Interpretación Clínica:", 20, 95);
    doc.setFont("helvetica", "normal");
    doc.text(interpretationText as string, 20, 105, { maxWidth: 170 });

    if (recommendationsList.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Recomendaciones Clínicas:", 20, 125);
      doc.setFont("helvetica", "normal");
      
      let yPos = 135;
      recommendationsList.forEach((rec: string) => {
        const lines = doc.splitTextToSize(`• ${rec}`, 160);
        doc.text(lines, 25, yPos);
        yPos += (lines.length * 7);
      });
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("__________________________________", 20, 260);
    doc.text("Firma y Timbre del Profesional", 20, 265);
    doc.text("Documento generado por EscalaPro", 20, 280);

    const fileName = patientName 
      ? `Reporte_${patientName.replace(/\s+/g, '_')}_${scale.id}.pdf`
      : `Reporte_${scale.id}_${date.replace(/\//g, '-')}.pdf`;

    doc.save(fileName);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto border border-gray-100">
      <div className="text-center mb-6">
        <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Resultado Final</h2>
        <p className="text-gray-500 font-medium">{scale.nombre}</p>
      </div>

      <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-3xl p-8 text-white text-center shadow-lg mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-teal-100 font-bold uppercase tracking-widest text-xs mb-1">Puntaje Obtenido</p>
          <div className="text-6xl font-black mb-3">{totalScore}</div>
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold text-lg">
            {interpretationText}
          </div>
        </div>
      </div>

      {recommendationsList.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-md font-bold text-amber-900">Recomendaciones</h3>
          </div>
          <ul className="space-y-1.5">
            {recommendationsList.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-amber-800 text-sm font-medium">
                <span>•</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

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
            Descargar PDF
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