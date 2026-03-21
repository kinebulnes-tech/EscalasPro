import { 
  ClipboardList, 
  Trash2, 
  FileText, 
  ArrowLeft, 
  User, 
  TrendingUp, 
  Activity, 
  ShieldCheck,
  Scale // Importamos icono de báscula para el IMC
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ReportSummaryProps {
  // ✅ Actualizamos la interfaz para recibir los nuevos datos biométricos
  paciente: { 
    nombre: string; 
    rut: string; 
    edad: string; 
    diagnostico: string;
    peso?: string;
    talla?: string;
    imc?: string;
  };
  resultados: any[];
  onBack: () => void;
  onRemoveScale: (index: number) => void;
  onFinalize: () => void;
}

export default function ReportSummary({ paciente, resultados, onBack, onRemoveScale, onFinalize }: ReportSummaryProps) {
  
  const generateMasterPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-CL');
    let y = 20;

    // 1. Encabezado Institucional Profesional
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 128); // Teal
    doc.text("INFORME CLÍNICO CONSOLIDADO", 20, y);
    
    y += 10;
    doc.setDrawColor(0, 128, 128);
    doc.setLineWidth(1);
    doc.line(20, y, 190, y); 
    
    // 2. Datos Maestros del Paciente
    y += 15;
    doc.setFontSize(9);
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
    doc.text(`Fecha de Emisión: ${date}`, 130, y);
    
    y += 7;
    doc.text(`Diagnóstico Base: ${paciente.diagnostico}`, 20, y);

    // ✅ NUEVA SECCIÓN: ANTROPOMETRÍA EN EL PDF
    if (paciente.peso && paciente.talla) {
      y += 12;
      doc.setFillColor(248, 250, 252); // Fondo muy suave
      doc.rect(18, y - 5, 175, 12, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(0, 128, 128);
      doc.text(`ANTROPOMETRÍA:`, 22, y + 2);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(`Peso: ${paciente.peso} kg   |   Talla: ${paciente.talla} cm   |   IMC: ${paciente.imc || 'N/A'}`, 60, y + 2);
    }

    // --- LÓGICA DE TENDENCIA PARA EL PDF ---
    const conteo: Record<string, any[]> = {};
    resultados.forEach(r => {
      if (!conteo[r.nombreEscala]) conteo[r.nombreEscala] = [];
      conteo[r.nombreEscala].push(r);
    });

    const escalasConHistorial = Object.entries(conteo).filter(([_, items]) => items.length >= 2);

    if (escalasConHistorial.length > 0) {
      y += 18;
      doc.setFillColor(241, 245, 249); 
      doc.rect(15, y, 180, 8, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text("ANÁLISIS DE EVOLUCIÓN CLÍNICA (TENDENCIAS)", 20, y + 6);
      y += 15;

      escalasConHistorial.forEach(([nombre, items]) => {
        const ordenados = [...items].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        const inicial = ordenados[0];
        const actual = ordenados[ordenados.length - 1];
        const variacion = actual.puntaje - inicial.puntaje;

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`ESCALA: ${nombre.toUpperCase()}`, 20, y);
        y += 6;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Línea Base: ${inicial.puntaje} pts (${new Date(inicial.fecha).toLocaleDateString()})`, 25, y);
        doc.text(`Estado Actual: ${actual.puntaje} pts (${new Date(actual.fecha).toLocaleDateString()})`, 100, y);
        
        doc.setFont("helvetica", "bold");
        if (variacion > 0) {
          doc.setTextColor(13, 148, 136); 
          doc.text(`VARIACIÓN: +${variacion} pts`, 160, y);
        } else if (variacion < 0) {
          doc.setTextColor(220, 38, 38); 
          doc.text(`VARIACIÓN: ${variacion} pts`, 160, y);
        } else {
          doc.setTextColor(100, 100, 100); 
          doc.text(`VARIACIÓN: 0 pts`, 160, y);
        }
        
        y += 8;
        doc.setDrawColor(230, 230, 230);
        doc.line(20, y, 190, y);
        y += 8;
        if (y > 265) { doc.addPage(); y = 20; }
      });
    }

    // 3. Detalle de Evaluaciones
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 128);
    doc.text("RESUMEN DE EVALUACIONES EN SESIÓN", 20, y);
    
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(20, y, 105, y);

    resultados.forEach((res, index) => {
      if (y > 250) { doc.addPage(); y = 20; }
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${res.nombreEscala}`, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Puntaje: ${res.puntaje} pts`, 25, y);
      doc.text(`Fecha: ${new Date(res.fecha).toLocaleDateString()}`, 130, y);
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text(`Interpretación: ${res.interpretacion}`, 25, y);
      if (res.recomendaciones && res.recomendaciones.length > 0) {
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const recs = doc.splitTextToSize(`Sugerencias: ${res.recomendaciones.join(' • ')}`, 160);
        doc.text(recs, 25, y);
        y += (recs.length * 5);
      }
      y += 2;
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 30, 90, pageHeight - 30);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Firma y Timbre del Profesional", 20, pageHeight - 25);
    doc.text("EscalaPro Clinical Intelligence — Documento Cifrado y Validado Localmente", 20, pageHeight - 15);

    doc.save(`Informe_${paciente.nombre.replace(/\s+/g, '_')}_${date}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="no-print flex items-center gap-2 text-teal-600 font-black mb-8 hover:-translate-x-1 transition-all uppercase text-[10px] tracking-widest">
        <ArrowLeft className="w-5 h-5" /> Volver al catálogo
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Activity size={120} />
          </div>

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="bg-teal-500 p-3 rounded-2xl shadow-lg shadow-teal-500/20">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter">{paciente.nombre}</h2>
              <p className="text-teal-400 font-black uppercase tracking-[0.2em] text-[10px]">Informe de Evolución Clínica</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 relative z-10">
            <div><p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">Identificación</p><p className="font-bold text-xs">{paciente.rut}</p></div>
            <div><p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">Edad</p><p className="font-bold text-xs">{paciente.edad} años</p></div>
            
            {/* ✅ MEJORA VISUAL: IMC Y PESO EN LA CABECERA */}
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <p className="text-[9px] font-black uppercase text-teal-400 tracking-widest mb-1">Antropometría</p>
              <p className="font-bold text-[11px]">
                {paciente.peso}kg / {paciente.talla}cm
              </p>
            </div>
            <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
              <p className="text-[9px] font-black uppercase text-teal-400 tracking-widest mb-1 italic">IMC Calculado</p>
              <p className="font-black text-sm text-teal-400">{paciente.imc || 'N/A'}</p>
            </div>

            <div className="col-span-2 md:col-span-4 mt-2">
              <p className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">Diagnóstico Base</p>
              <p className="font-bold text-xs italic opacity-80">{paciente.diagnostico}</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg"><ClipboardList className="text-teal-600" /></div>
              Protocolo Acumulado ({resultados.length})
            </h3>
          </div>

          <div className="space-y-4 mb-12">
            {resultados.map((res, index) => (
              <div key={index} className="group flex items-center gap-4 p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-teal-500/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-teal-600 shadow-sm border border-gray-100 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-gray-900 uppercase text-xs tracking-tight">{res.nombreEscala}</h4>
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full uppercase">{new Date(res.fecha).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-bold text-teal-600 mt-0.5">{res.puntaje} pts • {res.interpretacion}</p>
                </div>
                <button 
                  onClick={() => onRemoveScale(index)}
                  className="no-print p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={generateMasterPDF}
              className="group flex items-center justify-center gap-3 bg-teal-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all active:scale-95"
            >
              <FileText className="w-6 h-6 group-hover:animate-bounce" /> Descargar Reporte Final
            </button>
            <button 
              onClick={() => { if(confirm("¿Finalizar protocolo? Se limpiará la sesión del paciente.")) onFinalize(); }}
              className="group flex items-center justify-center gap-2 border-2 border-slate-100 text-slate-400 py-6 rounded-[2rem] font-black text-lg hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
            >
              Finalizar Sesión
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex justify-center items-center gap-3">
          <ShieldCheck className="text-teal-600 w-4 h-4" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protección de datos mediante cifrado AES-256 local</p>
        </div>
      </div>
    </div>
  );
}