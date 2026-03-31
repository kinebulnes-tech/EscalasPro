// src/components/ReportSummary.tsx
import { 
  Trash2, FileText, ArrowLeft, TrendingUp, TrendingDown, 
  Minus, Award, AlertCircle, User, Activity, Scale, Calendar, ListChecks
} from 'lucide-react';
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

  const conteo: Record<string, any[]> = {};
  resultados.forEach(r => {
    if (!conteo[r.nombreEscala]) conteo[r.nombreEscala] = [];
    conteo[r.nombreEscala].push(r);
  });
  
  const escalasConHistorial = Object.entries(conteo).filter(([_, items]) => items.length >= 2);

  const analizarProgreso = (items: any[]) => {
    if (items.length < 2) return null;
    const inicial = items[items.length - 1].puntaje;
    const actual = items[0].puntaje;
    const nombre = items[0].nombreEscala.toLowerCase();

    const esInversa = nombre.includes('tug') || nombre.includes('eva') || nombre.includes('tiempo');
    let diff = actual - inicial;
    let porcentaje = (diff / (inicial || 1)) * 100;
    if (esInversa) porcentaje = porcentaje * -1;

    const valorAbs = Math.abs(porcentaje);
    let impacto = "Estable";
    let color = "text-slate-400";
    if (valorAbs > 0 && valorAbs <= 10) { impacto = "Cambio Leve"; color = "text-blue-500"; }
    else if (valorAbs > 10 && valorAbs <= 30) { impacto = "Mejoría Significativa"; color = "text-teal-600"; }
    else if (valorAbs > 30) { impacto = "Evolución Excepcional"; color = "text-emerald-600"; }
    if (porcentaje < 0) { impacto = "Retroceso Clínico"; color = "text-red-600"; }

    return { valor: parseFloat(porcentaje.toFixed(1)), impacto, color, esMejoria: porcentaje > 0 };
  };

  // ✅ FIX: try/catch global + doc.save() garantizado al final
  const generateMasterPDF = async () => {
    try {
      const doc = new jsPDF();
      let y = 20;

      // 1. Encabezado
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18); doc.setTextColor(0, 128, 128);
      doc.text("INFORME DE EVOLUCIÓN CLÍNICA", 20, y);
      y += 10; doc.setDrawColor(0, 128, 128); doc.setLineWidth(0.8); doc.line(20, y, 190, y); 
      
      // 2. Info Paciente
      y += 15; doc.setFontSize(10); doc.setTextColor(0, 0, 0);
      doc.text(`PACIENTE: ${paciente.nombre.toUpperCase()}`, 20, y);
      doc.text(`${docLabel}: ${paciente.id}`, 130, y);
      y += 7; doc.setFont("helvetica", "normal");
      doc.text(`Diagnóstico: ${paciente.diagnostico} | Edad: ${paciente.edad} años`, 20, y);

      // 3. Antropometría
      if (paciente.peso && paciente.talla) {
        y += 10; doc.setFillColor(248, 250, 252); doc.rect(18, y - 5, 175, 12, 'F');
        doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(0, 128, 128);
        doc.text(`ANTROPOMETRÍA:`, 22, y + 2);
        doc.setFont("helvetica", "normal"); doc.setTextColor(50, 50, 50);
        doc.text(`Peso: ${paciente.peso} kg | Talla: ${paciente.talla} cm | IMC: ${paciente.imc || 'N/A'}`, 60, y + 2);
        y += 15;
      }

      // 4. Resultados de la sesión actual
      y += 5;
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 128, 128);
      doc.text("RESULTADOS DE LA EVALUACIÓN ACTUAL", 20, y);
      y += 8;

      resultados.forEach((res) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(0, 0, 0);
        doc.text(`• ${res.nombreEscala}:`, 25, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${res.puntaje} pts - ${res.interpretacion}`, 85, y);
        y += 6;
      });
      y += 10;

      // 5. Análisis de Tendencias (solo si hay historial >= 2)
      if (escalasConHistorial.length > 0) {
        for (let i = 0; i < escalasConHistorial.length; i++) {
          const [nombre, items] = escalasConHistorial[i] as [string, any[]];
          const analisis = analizarProgreso(items);

          if (y > 180) { doc.addPage(); y = 20; }
          
          doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 128, 128);
          doc.text(`ANÁLISIS DE EVOLUCIÓN: ${nombre.toUpperCase()}`, 20, y);
          y += 8;

          doc.setFontSize(9); doc.setFont("helvetica", "italic"); doc.setTextColor(60, 60, 60);
          const textoIA = `Variación del ${analisis?.valor}% indicando una ${analisis?.impacto.toLowerCase()}.`;
          doc.text(textoIA, 25, y);
          y += 7;

          const cleanId = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
          const chartElement = document.getElementById(`pdf-chart-${cleanId}`);
          if (chartElement) {
            try {
              const dataUrl = await toPng(chartElement, { backgroundColor: '#ffffff', pixelRatio: 2 });
              doc.addImage(dataUrl, 'PNG', 30, y, 150, 60);
              y += 65;
            } catch (err) {
              // ✅ FIX: Si falla el gráfico, continúa sin él en vez de bloquearse
              console.error('Error capturando gráfico:', err);
              y += 5;
            }
          }

          doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 100, 100);
          doc.text("Historial cronológico:", 25, y);
          y += 5;
          items.forEach((it) => {
            // ✅ FIX: Verificar desborde de página dentro del historial
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFont("helvetica", "normal");
            const f = new Date(it.fecha).toLocaleDateString();
            doc.text(`• ${f}: ${it.puntaje} pts - ${it.interpretacion}`, 30, y);
            y += 4;
          });
          y += 12;
        }
      }

      // 6. Pie de página
      const pageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, pageHeight - 35, 90, pageHeight - 35);
      doc.setFontSize(8); doc.setTextColor(100, 100, 100);
      doc.text("FIRMA Y TIMBRE DEL PROFESIONAL", 20, pageHeight - 30);

      // ✅ FIX: doc.save() siempre se ejecuta, sin importar si hay historial o no
      doc.save(`Informe_Profesional_${paciente.nombre.replace(/\s+/g, '_')}.pdf`);

    } catch (err) {
      // ✅ FIX: Error visible para el usuario en vez de silencio
      console.error('Error generando PDF:', err);
      alert('Hubo un error al generar el PDF. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="no-print flex items-center gap-2 text-teal-600 font-black mb-8 uppercase text-[10px] tracking-widest">
        <ArrowLeft size={18} /> Volver al catálogo
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-10 text-white relative">
          <h2 className="text-4xl font-black italic tracking-tighter">{paciente.nombre}</h2>
          <div className="flex flex-wrap gap-4 mt-2 opacity-60 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><User size={12}/> {docLabel}: {paciente.id}</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Activity size={12}/> {paciente.diagnostico}</span>
          </div>
          
          {paciente.peso && (
            <div className="mt-5 flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-teal-400">
                 <Scale size={18} />
                 <span className="text-xs font-black italic">IMC: {paciente.imc}</span>
              </div>
              <div className="text-white/50 text-[11px] font-medium">{paciente.peso} kg / {paciente.talla} cm</div>
            </div>
          )}
        </div>

        <div className="p-8 lg:p-12">
          {/* SECCIÓN 1: SESIÓN ACTUAL */}
          <div className="space-y-4 mb-12">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Resultados de la Sesión</h4>
            {resultados.map((res, index) => (
              <div key={index} className="flex items-center gap-6 p-6 bg-white border border-slate-50 rounded-[2rem] shadow-sm">
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{res.nombreEscala}</h4>
                  <p className="text-xs font-bold text-teal-600 italic">{res.puntaje} pts • {res.interpretacion}</p>
                </div>
                <button onClick={() => onRemoveScale(index)} className="no-print p-3 text-slate-200 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
              </div>
            ))}
          </div>

          {/* SECCIÓN 2: TENDENCIAS (Solo si hay historial > 1) */}
          {escalasConHistorial.length > 0 && (
            <div className="mt-12 pt-12 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Análisis Comparativo de Evolución</h4>
              {escalasConHistorial.map(([nombre, items], idx) => {
                const data = analizarProgreso(items);
                return (
                  <div key={idx} className="mb-12 border-b border-slate-50 pb-12 last:border-0">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">{nombre}</h3>
                      {data && (
                        <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-full bg-slate-50 ${data.color} border border-current/10`}>
                          {data.impacto} ({data.valor > 0 ? '+' : ''}{data.valor}%)
                        </span>
                      )}
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-inner mb-6">
                      <TrendChart data={items} titulo={nombre} forPDF={true} />
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2rem]">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        <ListChecks size={14} /> Historial Detallado
                      </h4>
                      <div className="space-y-3">
                        {items.map((it, i) => (
                          <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-teal-500" />
                              <span className="text-xs font-bold text-slate-600">{new Date(it.fecha).toLocaleDateString()}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-slate-900">{it.puntaje} pts</span>
                              <p className="text-[10px] text-teal-600 font-bold italic">{it.interpretacion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={generateMasterPDF} className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 hover:bg-teal-600 transition-all active:scale-95">
            <FileText size={28} /> DESCARGAR INFORME PROFESIONAL
          </button>
        </div>
      </div>
    </div>
  );
}