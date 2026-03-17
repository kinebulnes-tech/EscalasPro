import { ClipboardList, Trash2, FileText, ArrowLeft, User } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatearPuntaje } from '../utils/scaleEngine';

interface ReportSummaryProps {
  paciente: { nombre: string; rut: string; edad: string; diagnostico: string };
  resultados: any[];
  onBack: () => void;
  onRemoveScale: (index: number) => void;
  onFinalize: () => void;
}

export default function ReportSummary({ paciente, resultados, onBack, onRemoveScale, onFinalize }: ReportSummaryProps) {
  
  const generateMasterPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-CL');
    const hour = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    let yPos = 20;

    // --- ENCABEZADO TEAL ---
    doc.setFillColor(0, 128, 128); 
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("INFORME CLÍNICO CONSOLIDADO", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("SOPORTE DE DECISIÓN CLÍNICA - ESCALAPRO", 20, 32);

    // --- BLOQUE DATOS PACIENTE ---
    yPos = 55;
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, yPos - 5, 180, 35, 3, 3, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text("DATOS DEL PACIENTE", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`NOMBRE: ${paciente.nombre.toUpperCase()}`, 20, yPos);
    doc.text(`RUT: ${paciente.rut}`, 130, yPos);
    
    yPos += 7;
    doc.text(`DIAGNÓSTICO: ${paciente.diagnostico}`, 20, yPos);
    doc.text(`FECHA: ${date} - ${hour}`, 130, yPos);

    // --- LISTADO DE ESCALAS ---
    yPos += 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 128, 128);
    doc.text("DETALLE DE EVALUACIONES", 20, yPos);
    doc.line(20, yPos + 2, 80, yPos + 2);

    yPos += 10;

    resultados.forEach((res, index) => {
      if (yPos > 250) { doc.addPage(); yPos = 20; }

      doc.setDrawColor(0, 128, 128);
      doc.setLineWidth(0.5);
      doc.line(20, yPos + 2, 20, yPos + 18); 
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(`${index + 1}. ${res.nombreEscala.toUpperCase()}`, 25, yPos + 7);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 128, 128);
      doc.text(`PUNTAJE: ${formatearPuntaje(res.puntaje)} pts`, 25, yPos + 14);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`INTERPRETACIÓN: ${res.interpretacion}`, 85, yPos + 14);
      
      yPos += 25;
    });

    // --- FIRMA Y LEGAL ---
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text("Este documento es un resumen de apoyo clínico generado por EscalaPro.", 20, pageHeight - 35);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 25, 90, pageHeight - 25);
    doc.setFont("helvetica", "bold");
    doc.text("FIRMA / TIMBRE DEL PROFESIONAL", 20, pageHeight - 20);

    doc.save(`Informe_EscalaPro_${paciente.nombre.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="flex items-center gap-2 text-teal-600 font-bold mb-8 hover:-translate-x-1 transition-all">
        <ArrowLeft className="w-5 h-5" /> Volver a evaluar
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-10 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-teal-500 p-3 rounded-2xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black">{paciente.nombre}</h2>
              <p className="opacity-60 font-bold uppercase tracking-widest text-xs">Resumen de Sesión</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div><p className="text-[10px] font-black uppercase opacity-40 mb-1">RUT</p><p className="font-bold">{paciente.rut}</p></div>
            <div><p className="text-[10px] font-black uppercase opacity-40 mb-1">Edad</p><p className="font-bold">{paciente.edad} años</p></div>
            <div><p className="text-[10px] font-black uppercase opacity-40 mb-1">Diagnóstico</p><p className="font-bold">{paciente.diagnostico}</p></div>
          </div>
        </div>

        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ClipboardList className="text-teal-500" />
              Evaluaciones ({resultados.length})
            </h3>
          </div>

          <div className="space-y-4 mb-10">
            {resultados.map((res, index) => (
              <div key={index} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border-2 border-transparent hover:border-teal-100 transition-all">
                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-teal-600 shadow-sm border border-slate-100">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 leading-none mb-1">{res.nombreEscala}</h4>
                  <p className="text-sm font-bold text-teal-600 uppercase">
                    {formatearPuntaje(res.puntaje)} PTS — {res.interpretacion}
                  </p>
                </div>
                <button onClick={() => onRemoveScale(index)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={generateMasterPDF} className="flex items-center justify-center gap-3 bg-teal-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all">
              <FileText className="w-6 h-6" /> Descargar PDF
            </button>
            <button onClick={() => { if(confirm("¿Cerrar sesión?")) onFinalize(); }} className="border-2 border-gray-100 text-gray-400 py-6 rounded-3xl font-black text-xl hover:bg-red-50 hover:text-red-500 transition-all">
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}