// src/components/ReportSummary.tsx
import { Trash2, FileText, ArrowLeft, User, Activity, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image'; 
import { identityConfigs } from '../utils/patientIdentity';
import TrendChart from './TrendChart'; // ✅ Importamos el gráfico

interface ReportSummaryProps {
  paciente: { nombre: string; id: string; country: string; edad: string; diagnostico: string; peso?: string; talla?: string; imc?: string; };
  resultados: any[];
  onBack: () => void;
  onRemoveScale: (index: number) => void;
  onFinalize: () => void;
}

export default function ReportSummary({ paciente, resultados, onBack, onRemoveScale, onFinalize }: ReportSummaryProps) {
  const docLabel = identityConfigs[paciente.country]?.documentName || "Identificación";

  // Lógica para agrupar datos de las gráficas
  const conteo: Record<string, any[]> = {};
  resultados.forEach(r => {
    if (!conteo[r.nombreEscala]) conteo[r.nombreEscala] = [];
    conteo[r.nombreEscala].push(r);
  });
  const escalasConHistorial = Object.entries(conteo).filter(([_, items]) => items.length >= 2);

  const generateMasterPDF = async () => {
    const doc = new jsPDF();
    let y = 20;

    // 1. Encabezado e info paciente (Igual que antes)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20); doc.setTextColor(0, 128, 128);
    doc.text("INFORME CLÍNICO CONSOLIDADO", 20, y);
    y += 10; doc.setDrawColor(0, 128, 128); doc.setLineWidth(1); doc.line(20, y, 190, y); 
    
    y += 15; doc.setFontSize(11); doc.setTextColor(0, 0, 0);
    doc.text(`Nombre: ${paciente.nombre.toUpperCase()}`, 20, y);
    doc.text(`${docLabel}: ${paciente.id}`, 130, y);
    y += 7; doc.setFont("helvetica", "normal");
    doc.text(`Edad: ${paciente.edad} años`, 20, y);
    doc.text(`Diagnóstico Base: ${paciente.diagnostico}`, 20, y + 7);
    y += 20;

    // 2. Gráficos de Evolución
    if (escalasConHistorial.length > 0) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(0, 128, 128);
      doc.text("ANÁLISIS DE EVOLUCIÓN Y TENDENCIAS", 20, y);
      y += 10;

      for (const [nombre, items] of escalasConHistorial) {
        if (y > 200) { doc.addPage(); y = 20; }
        
        doc.setFontSize(9); doc.setTextColor(50, 50, 50);
        doc.text(`ESCALA: ${nombre.toUpperCase()}`, 20, y);
        y += 5;

        // Captura el gráfico que ahora SÍ está en el reporte
        const cleanId = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
        const chartElement = document.getElementById(`pdf-chart-${cleanId}`);
        
        if (chartElement) {
          try {
            const dataUrl = await toPng(chartElement, { backgroundColor: '#ffffff', pixelRatio: 2 });
            doc.addImage(dataUrl, 'PNG', 20, y, 170, 60);
            y += 65;
          } catch (err) { console.error(err); }
        }
        y += 10;
      }
    }

    // 3. Resultados individuales
    doc.addPage(); y = 20;
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("DETALLE DE EVALUACIONES", 20, y);
    resultados.forEach((res, index) => {
      y += 15; doc.setFontSize(10);
      doc.text(`${index + 1}. ${res.nombreEscala}`, 20, y);
      y += 5; doc.setFont("helvetica", "normal");
      doc.text(`Puntaje: ${res.puntaje} | Interpretación: ${res.interpretacion}`, 25, y);
    });

    doc.save(`Informe_${paciente.nombre}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="no-print flex items-center gap-2 text-teal-600 font-black mb-8 uppercase text-[10px] tracking-widest">
        <ArrowLeft size={18} /> Volver al catálogo
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-10 text-white relative">
          <h2 className="text-3xl font-black italic tracking-tighter">{paciente.nombre}</h2>
          <p className="opacity-50 text-xs">{docLabel}: {paciente.id} | {paciente.edad} años</p>
        </div>

        <div className="p-10">
          {/* ✅ AQUÍ ESTÁ EL TRUCO: Dibujamos los gráficos de forma invisible para el ojo pero visibles para el sistema */}
          {escalasConHistorial.length > 0 && (
            <div className="mb-12 space-y-8 bg-slate-50 p-6 rounded-[2rem]">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Previsualización de Gráficos para el Informe</h4>
              <div className="grid grid-cols-1 gap-10">
                {escalasConHistorial.map(([nombre, items], idx) => (
                  <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                     <p className="text-[10px] font-black text-teal-600 mb-2 uppercase">{nombre}</p>
                     <TrendChart data={items} titulo={nombre} forPDF={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 mb-12">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Lista de Evaluaciones</h4>
            {resultados.map((res, index) => (
              <div key={index} className="flex items-center gap-4 p-6 bg-gray-50 rounded-[2rem]">
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 uppercase text-xs">{res.nombreEscala}</h4>
                  <p className="text-sm font-bold text-teal-600">{res.puntaje} pts • {res.interpretacion}</p>
                </div>
                <button onClick={() => onRemoveScale(index)} className="no-print p-2 text-gray-300 hover:text-red-500"><Trash2 size={20}/></button>
              </div>
            ))}
          </div>

          <button onClick={generateMasterPDF} className="w-full bg-teal-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <FileText size={24} /> Generar Reporte con Gráficos
          </button>
        </div>
      </div>
    </div>
  );
}