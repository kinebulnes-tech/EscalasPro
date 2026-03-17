import { ClipboardList, Trash2, FileText, ArrowLeft, User } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ReportSummaryProps {
  paciente: { nombre: string; rut: string; edad: string; diagnostico: string };
  resultados: any[];
  onBack: () => void;
  onRemoveScale: (index: number) => void;
  onFinalize: () => void;
}

export default function ReportSummary({ paciente, resultados, onBack, onRemoveScale, onFinalize }: ReportSummaryProps) {
  
  const generateMasterPDF = () => {
    // Creamos el documento con coordenadas fijas para que no dependa de cómo se ve la web
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-CL');
    let y = 20;

    // 1. Encabezado Institucional
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 128); // Color Teal de EscalaPro
    doc.text("INFORME CLÍNICO CONSOLIDADO", 20, y);
    
    y += 10;
    doc.setDrawColor(0, 128, 128);
    doc.setLineWidth(1);
    doc.line(20, y, 190, y); // Línea divisoria superior
    
    // 2. Cuadrante de Datos del Paciente
    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("DATOS DEL PACIENTE", 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Nombre: ${paciente.nombre.toUpperCase()}`, 20, y);
    doc.text(`RUT: ${paciente.rut}`, 130, y);
    
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Edad: ${paciente.edad} años`, 20, y);
    doc.text(`Fecha: ${date}`, 130, y);
    
    y += 7;
    doc.text(`Diagnóstico: ${paciente.diagnostico}`, 20, y);

    // 3. Sección de Evaluaciones
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 128);
    doc.text("RESUMEN DE RESULTADOS", 20, y);
    
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(20, y, 80, y);

    // 4. Mapeo de Escalas (Con control de espacio)
    resultados.forEach((res, index) => {
      // Si nos acercamos al final de la página, creamos una nueva
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${res.nombreEscala}`, 20, y);
      
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Puntaje obtenido: ${res.puntaje} pts`, 25, y);
      
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text(`Interpretación: ${res.interpretacion}`, 25, y);
      
      // Recomendaciones (si existen)
      if (res.recomendaciones && res.recomendaciones.length > 0) {
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const recs = doc.splitTextToSize(`Sugerencias: ${res.recomendaciones.join(', ')}`, 160);
        doc.text(recs, 25, y);
        y += (recs.length * 5);
      }
      y += 5; // Espacio entre escalas
    });

    // 5. Pie de página y Firma
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 30, 90, pageHeight - 30);
    
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Firma y Timbre del Profesional", 20, pageHeight - 25);
    doc.text("Documento generado por EscalaPro - Soporte Clínico", 20, pageHeight - 15);

    // Descarga el archivo con un nombre limpio
    doc.save(`Informe_${paciente.nombre.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* El botón de volver lo marcamos como no-print para que no salga si alguien imprime desde el navegador */}
      <button onClick={onBack} className="no-print flex items-center gap-2 text-teal-600 font-bold mb-8 hover:-translate-x-1 transition-all">
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
              <p className="opacity-60 font-bold uppercase tracking-widest text-xs">Informe de Sesión</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div><p className="text-xs font-black uppercase opacity-40">RUT</p><p className="font-bold">{paciente.rut}</p></div>
            <div><p className="text-xs font-black uppercase opacity-40">Edad</p><p className="font-bold">{paciente.edad} años</p></div>
            <div><p className="text-xs font-black uppercase opacity-40">Diagnóstico</p><p className="font-bold">{paciente.diagnostico}</p></div>
          </div>
        </div>

        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <ClipboardList className="text-teal-500" />
              Evaluaciones Acumuladas ({resultados.length})
            </h3>
          </div>

          <div className="space-y-4 mb-10">
            {resultados.map((res, index) => (
              <div key={index} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border-2 border-transparent hover:border-teal-100 transition-all">
                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-teal-600 shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900">{res.nombreEscala}</h4>
                  <p className="text-sm font-bold text-teal-600">{res.puntaje} pts - {res.interpretacion}</p>
                </div>
                <button 
                  onClick={() => onRemoveScale(index)}
                  className="no-print p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={generateMasterPDF}
              className="flex items-center justify-center gap-3 bg-teal-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all active:scale-95"
            >
              <FileText className="w-6 h-6" /> Descargar Informe PDF
            </button>
            <button 
              onClick={() => { if(confirm("¿Cerrar sesión?")) onFinalize(); }}
              className="border-2 border-gray-100 text-gray-400 py-6 rounded-3xl font-black text-xl hover:bg-gray-50 transition-all"
            >
              Finalizar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}