// src/components/ReportSummary.tsx
import { Trash2, FileText, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image'; 
import { identityConfigs } from '../utils/patientIdentity';
import TrendChart from './TrendChart';

interface ReportSummaryProps {
  paciente: { 
    nombre: string; id: string; country: string; edad: string; 
    diagnostico: string; peso?: string; talla?: string; imc?: string; 
  };
  resultados: any[];
  onBack: () => void;
  onRemoveScale: (index: number) => void;
  onFinalize: () => void;
}

export default function ReportSummary({ paciente, resultados, onBack, onRemoveScale, onFinalize }: ReportSummaryProps) {
  const docLabel = identityConfigs[paciente.country]?.documentName || "Identificación";

  // Organizar datos para análisis
  const conteo: Record<string, any[]> = {};
  resultados.forEach(r => {
    if (!conteo[r.nombreEscala]) conteo[r.nombreEscala] = [];
    conteo[r.nombreEscala].push(r);
  });
  
  const escalasConHistorial = Object.entries(conteo).filter(([_, items]) => items.length >= 2);

  // ✅ FUNCIÓN DE CÁLCULO DE AVANCE PORCENTUAL
  const calcularAvance = (items: any[]) => {
    if (items.length < 2) return null;
    const inicial = items[items.length - 1].puntaje; // La más antigua
    const actual = items[0].puntaje; // La más reciente
    const nombre = items[0].nombreEscala.toLowerCase();

    if (inicial === 0 && actual === 0) return 0;
    
    // Lógica Inversa: En escalas de tiempo (TUG) o Dolor (EVA), bajar es mejorar.
    const esInversa = nombre.includes('tug') || nombre.includes('eva') || nombre.includes('tiempo') || nombre.includes('pain');
    
    let diff = actual - inicial;
    let porcentaje = (diff / (inicial || 1)) * 100;

    // Si es inversa, invertimos el signo para que "bajar tiempo" sea "mejorar %"
    if (esInversa) porcentaje = porcentaje * -1;

    return parseFloat(porcentaje.toFixed(1));
  };

  const generateMasterPDF = async () => {
    const doc = new jsPDF();
    let y = 20;

    // 1. Encabezado Profesional
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18); doc.setTextColor(0, 128, 128);
    doc.text("INFORME CLÍNICO CONSOLIDADO", 20, y);
    y += 10; doc.setDrawColor(0, 128, 128); doc.setLineWidth(0.5); doc.line(20, y, 190, y); 
    
    // 2. Información del Paciente
    y += 15; doc.setFontSize(10); doc.setTextColor(0, 0, 0);
    doc.text(`PACIENTE: ${paciente.nombre.toUpperCase()}`, 20, y);
    doc.text(`${docLabel}: ${paciente.id}`, 130, y);
    y += 7; doc.setFont("helvetica", "normal");
    doc.text(`Edad: ${paciente.edad} años | Diagnóstico: ${paciente.diagnostico}`, 20, y);

    // 3. Antropometría
    if (paciente.peso && paciente.talla) {
      y += 10; doc.setFillColor(248, 250, 252); doc.rect(18, y - 5, 175, 12, 'F');
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(0, 128, 128);
      doc.text(`ANTROPOMETRÍA:`, 22, y + 2);
      doc.setFont("helvetica", "normal"); doc.setTextColor(50, 50, 50);
      doc.text(`Peso: ${paciente.peso} kg | Talla: ${paciente.talla} cm | IMC: ${paciente.imc || 'N/A'}`, 60, y + 2);
      y += 15;
    } else { y += 15; }

    // ✅ 4. NUEVA SECCIÓN: ANÁLISIS COMPARATIVO DE LOGROS (%)
    if (escalasConHistorial.length > 0) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 128, 128);
      doc.text("RESUMEN DE AVANCE TERAPÉUTICO (%)", 20, y);
      y += 8;

      escalasConHistorial.forEach(([nombre, items]) => {
        const avance = calcularAvance(items);
        if (avance !== null) {
          doc.setFontSize(9); doc.setTextColor(50, 50, 50);
          const status = avance > 0 ? "MEJORÍA" : avance < 0 ? "RETROCESO" : "ESTABLE";
          doc.text(`• ${nombre}: ${Math.abs(avance)}% de ${status} respecto a evaluación inicial.`, 25, y);
          y += 6;
        }
      });
      y += 5;
    }

    // 5. Gráficos de Evolución
    if (escalasConHistorial.length > 0) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 128, 128);
      doc.text("ANÁLISIS VISUAL DE TENDENCIAS", 20, y);
      y += 8;

      for (const [nombre, items] of escalasConHistorial) {
        if (y > 210) { doc.addPage(); y = 20; }
        doc.setFontSize(9); doc.setTextColor(80, 80, 80);
        doc.text(`Tendencia: ${nombre.toUpperCase()}`, 20, y);
        y += 5;
        const cleanId = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
        const chartElement = document.getElementById(`pdf-chart-${cleanId}`);
        if (chartElement) {
          try {
            const dataUrl = await toPng(chartElement, { backgroundColor: '#ffffff', pixelRatio: 2 });
            doc.addImage(dataUrl, 'PNG', 40, y, 130, 45);
            y += 55;
          } catch (err) { console.error(err); }
        }
      }
    }

    // 6. Detalle de Resultados
    if (y > 230) { doc.addPage(); y = 20; } else { y += 10; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 128, 128);
    doc.text("DETALLE DE EVALUACIONES DE ESTA SESIÓN", 20, y);
    resultados.forEach((res, index) => {
      if (y > 265) { doc.addPage(); y = 20; }
      y += 10; doc.setFontSize(9); doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${res.nombreEscala} — Puntaje: ${res.puntaje}`, 25, y);
      y += 4; doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.text(`Interpretación: ${res.interpretacion}`, 30, y);
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.line(20, pageHeight - 35, 90, pageHeight - 35);
    doc.setFontSize(8); doc.text("FIRMA Y TIMBRE DEL PROFESIONAL", 20, pageHeight - 30);
    doc.save(`Informe_${paciente.nombre.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="no-print flex items-center gap-2 text-teal-600 font-black mb-8 uppercase text-[10px] tracking-widest">
        <ArrowLeft size={18} /> Volver al catálogo
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-10 text-white relative">
          <h2 className="text-3xl font-black italic tracking-tighter">{paciente.nombre}</h2>
          <div className="flex gap-4 mt-2 opacity-60 text-[10px] font-bold uppercase tracking-widest">
            <span>{docLabel}: {paciente.id}</span>
            <span>|</span>
            <span>{paciente.edad} años</span>
          </div>
        </div>

        <div className="p-10">
          {/* ✅ WIDGET VISUAL DE AVANCE % EN LA APP */}
          {escalasConHistorial.length > 0 && (
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {escalasConHistorial.map(([nombre, items], idx) => {
                const avance = calcularAvance(items);
                if (avance === null) return null;
                return (
                  <div key={idx} className="bg-teal-50 border border-teal-100 p-6 rounded-[2rem] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">{nombre}</p>
                      <h5 className="text-xl font-black text-slate-800 tracking-tighter">
                        {avance > 0 ? '+' : ''}{avance}%
                      </h5>
                    </div>
                    <div className={`p-3 rounded-2xl ${avance >= 0 ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'}`}>
                      {avance > 0 ? <TrendingUp size={24} /> : avance < 0 ? <TrendingDown size={24} /> : <Minus size={24} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Gráficos */}
          {escalasConHistorial.length > 0 && (
            <div className="mb-12 space-y-4 bg-slate-50 p-6 rounded-[2rem]">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tendencia Histórica</h4>
              <div className="grid grid-cols-1 gap-4">
                {escalasConHistorial.map(([nombre, items], idx) => (
                  <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100">
                     <TrendChart data={items} titulo={nombre} forPDF={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 mb-12">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Evaluaciones de esta sesión</h4>
            {resultados.map((res, index) => (
              <div key={index} className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem]">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">{res.nombreEscala}</h4>
                  <p className="text-xs font-bold text-teal-600">{res.puntaje} pts • {res.interpretacion}</p>
                </div>
                <button onClick={() => onRemoveScale(index)} className="no-print p-2 text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>

          <button onClick={generateMasterPDF} className="w-full bg-teal-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <FileText size={24} /> Descargar Reporte Profesional
          </button>
        </div>
      </div>
    </div>
  );
}