// src/components/ReportSummary.tsx
import { 
  Trash2, FileText, ArrowLeft,
  User, Activity, Scale, Calendar, ListChecks
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

const TEAL  = [13,  148, 136] as const;
const DARK  = [15,   23,  42] as const;
const LIGHT = [248, 250, 252] as const;
const MUTED = [100, 116, 139] as const;
const WHITE = [255, 255, 255] as const;
const GRAY  = [220, 220, 220] as const;

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
    const actual  = items[0].puntaje;
    const nombre  = items[0].nombreEscala.toLowerCase();
    const esInversa = nombre.includes('tug') || nombre.includes('eva') || nombre.includes('tiempo');
    let porcentaje  = ((actual - inicial) / (inicial || 1)) * 100;
    if (esInversa) porcentaje *= -1;
    const abs = Math.abs(porcentaje);
    let impacto = "Estable";
    let color   = "text-slate-400";
    if (abs > 0  && abs <= 10) { impacto = "Cambio Leve";          color = "text-blue-500";    }
    if (abs > 10 && abs <= 30) { impacto = "Mejoría Significativa"; color = "text-teal-600";    }
    if (abs > 30)              { impacto = "Evolución Excepcional"; color = "text-emerald-600"; }
    if (porcentaje < 0)        { impacto = "Retroceso Clínico";     color = "text-red-600";     }
    return { valor: parseFloat(porcentaje.toFixed(1)), impacto, color, esMejoria: porcentaje > 0, inicial, actual };
  };

  const checkBreak = (doc: jsPDF, y: number, espacio = 15): number => {
    if (y + espacio > doc.internal.pageSize.height - 42) {
      doc.addPage();
      doc.setTextColor(DARK[0], DARK[1], DARK[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      return 20;
    }
    return y;
  };

  const aplicarPieEnTodasLasPaginas = (doc: jsPDF, total: number) => {
    const pw    = doc.internal.pageSize.width;
    const ph    = doc.internal.pageSize.height;
    const fecha = new Date().toLocaleDateString('es-CL');
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      if (p > 1) {
        doc.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
        doc.rect(0, 0, pw, 11, 'F');
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
        doc.text(`EscalaPro — ${paciente.nombre.toUpperCase()} — continuación`, 15, 7.5);
        doc.text(`Pág. ${p} / ${total}`, pw - 15, 7.5, { align: 'right' });
      }
      doc.setDrawColor(GRAY[0], GRAY[1], GRAY[2]);
      doc.setLineWidth(0.3);
      doc.line(15, ph - 33, pw - 15, ph - 33);
      doc.setDrawColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.line(15, ph - 19, 85, ph - 19);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text("FIRMA Y TIMBRE DEL PROFESIONAL", 15, ph - 14);
      doc.text(`Página ${p} de ${total}`, pw - 15, ph - 23, { align: 'right' });
      doc.text(`Emitido: ${fecha}`, pw - 15, ph - 18, { align: 'right' });
      doc.setFontSize(6);
      doc.setTextColor(180, 180, 180);
      const disc = "Documento de apoyo clínico. Los resultados deben ser validados por el profesional responsable. EscalaPro © 2026";
      doc.text(doc.splitTextToSize(disc, pw - 30), 15, ph - 8);
    }
  };

  const dibujarTablaProgreso = (
    doc: jsPDF,
    items: any[],
    analisis: ReturnType<typeof analizarProgreso>,
    startY: number
  ): number => {
    if (!analisis) return startY;
    let y = startY;
    const pw = doc.internal.pageSize.width;

    doc.setFillColor(LIGHT[0], LIGHT[1], LIGHT[2]);
    doc.setDrawColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.rect(15, y, pw - 30, 8, 'FD');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
    doc.text("SESIÓN",         20,  y + 5.5);
    doc.text("FECHA",          55,  y + 5.5);
    doc.text("PUNTAJE",        95,  y + 5.5);
    doc.text("INTERPRETACIÓN", 118, y + 5.5);
    y += 8;

    const ordenado = [...items].reverse();
    ordenado.forEach((it, i) => {
      y = checkBreak(doc, y, 8);
      const esActual  = i === ordenado.length - 1;
      const esInicial = i === 0;

      if (esActual)       { doc.setFillColor(240, 253, 250); }
      else if (esInicial) { doc.setFillColor(LIGHT[0], LIGHT[1], LIGHT[2]); }
      else                { doc.setFillColor(255, 255, 255); }

      doc.rect(15, y, pw - 30, 7.5, 'F');
      doc.setDrawColor(GRAY[0], GRAY[1], GRAY[2]);
      doc.rect(15, y, pw - 30, 7.5, 'S');

      const etiqueta = esInicial ? "Inicial" : esActual ? "Actual ●" : `Sesión ${i + 1}`;
      const fecha    = new Date(it.fecha).toLocaleDateString('es-CL');
      const interp   = it.interpretacion.length > 28 ? it.interpretacion.slice(0, 26) + "…" : it.interpretacion;

      doc.setFont("helvetica", esActual ? "bold" : "normal");
      doc.setFontSize(8);

      const colorFila = esActual ? TEAL : DARK;
      doc.setTextColor(colorFila[0], colorFila[1], colorFila[2]);
      doc.text(etiqueta,            20,  y + 5.2);
      doc.text(fecha,               55,  y + 5.2);
      doc.text(`${it.puntaje} pts`, 95,  y + 5.2);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(interp,              118, y + 5.2);
      y += 7.5;
    });

    y = checkBreak(doc, y, 11);
    doc.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
    doc.rect(15, y, pw - 30, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
    const flecha = analisis.esMejoria ? "▲" : analisis.valor === 0 ? "■" : "▼";
    const signo  = analisis.valor > 0 ? "+" : "";
    doc.text(`${flecha}  Variación total: ${signo}${analisis.valor}%`, 20, y + 6.8);
    doc.text(analisis.impacto.toUpperCase(), pw - 18, y + 6.8, { align: 'right' });
    y += 10;
    return y + 5;
  };

  const generateMasterPDF = async () => {
    try {
      const doc   = new jsPDF();
      const pw    = doc.internal.pageSize.width;
      const fecha = new Date().toLocaleDateString('es-CL');
      const hora  = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

      // PORTADA
      doc.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.rect(0, 0, pw, 52, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
      doc.text("INFORME DE EVOLUCIÓN CLÍNICA", pw / 2, 20, { align: 'center' });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(180, 230, 220);
      doc.text("SOPORTE DE DECISIÓN CLÍNICA  —  ESCALAPRO", pw / 2, 29, { align: 'center' });
      doc.setFontSize(8);
      doc.text(`Generado: ${fecha} a las ${hora}`, pw / 2, 38, { align: 'center' });
      doc.text(`Escalas evaluadas en esta sesión: ${resultados.length}`, pw / 2, 45, { align: 'center' });

      // Tarjeta paciente
      let y = 62;
      const alturaCard = paciente.peso ? 40 : 30;
      doc.setFillColor(LIGHT[0], LIGHT[1], LIGHT[2]);
      doc.setDrawColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.setLineWidth(0.6);
      doc.roundedRect(15, y, pw - 30, alturaCard, 3, 3, 'FD');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.text("DATOS DEL PACIENTE", 21, y + 8);
      doc.setLineWidth(0.3);
      doc.line(21, y + 10, pw - 21, y + 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(DARK[0], DARK[1], DARK[2]);
      doc.text(paciente.nombre.toUpperCase(), 21, y + 19);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(`${docLabel}: ${paciente.id}   |   Edad: ${paciente.edad}`, 21, y + 26);
      const diagSplit = doc.splitTextToSize(`Diagnóstico: ${paciente.diagnostico}`, pw - 50);
      doc.text(diagSplit, 21, y + 32);
      if (paciente.peso && paciente.talla) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
        doc.text(`Peso: ${paciente.peso} kg   Talla: ${paciente.talla} cm   IMC: ${paciente.imc || 'N/A'}`, 21, y + alturaCard - 4);
      }

      // Resumen ejecutivo
      y += alturaCard + 12;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.text("RESUMEN DE LA SESIÓN ACTUAL", 15, y);
      y += 2;
      doc.setDrawColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.setLineWidth(0.5);
      doc.line(15, y, pw - 15, y);
      y += 8;
      resultados.forEach((res, idx) => {
        y = checkBreak(doc, y, 10);
        if (idx % 2 === 0) {
          doc.setFillColor(LIGHT[0], LIGHT[1], LIGHT[2]);
          doc.rect(15, y - 4, pw - 30, 9, 'F');
        }
        doc.setFont("helvetica", "bold"); doc.setFontSize(9);
        doc.setTextColor(DARK[0], DARK[1], DARK[2]);
        doc.text(res.nombreEscala, 20, y + 1);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
        doc.text(`${res.puntaje} pts`, pw - 55, y + 1, { align: 'right' });
        doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
        doc.text(res.interpretacion, pw - 18, y + 1, { align: 'right' });
        y += 9;
      });

      // Análisis de evolución
      if (escalasConHistorial.length > 0) {
        y += 8;
        y = checkBreak(doc, y, 25);
        doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
        doc.text("ANÁLISIS COMPARATIVO DE EVOLUCIÓN", 15, y);
        y += 2;
        doc.setDrawColor(TEAL[0], TEAL[1], TEAL[2]);
        doc.setLineWidth(0.5);
        doc.line(15, y, pw - 15, y);
        y += 10;

        for (const [nombre, items] of escalasConHistorial) {
          const analisis = analizarProgreso(items);
          y = checkBreak(doc, y, 35);
          doc.setFont("helvetica", "bold"); doc.setFontSize(10);
          doc.setTextColor(DARK[0], DARK[1], DARK[2]);
          doc.text(nombre.toUpperCase(), 15, y);
          y += 7;
          y = dibujarTablaProgreso(doc, items, analisis, y);
          const cleanId = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
          const chartEl = document.getElementById(`pdf-chart-${cleanId}`);
          if (chartEl) {
            try {
              await new Promise(r => setTimeout(r, 120));
              const dataUrl = await toPng(chartEl, { backgroundColor: '#ffffff', pixelRatio: 3 });
              y = checkBreak(doc, y, 65);
              doc.addImage(dataUrl, 'PNG', 20, y, pw - 40, 58);
              y += 62;
            } catch (err) {
              console.error('Error capturando gráfico:', err);
            }
          }
          y += 8;
        }
      }

      const totalPaginas = doc.getNumberOfPages();
      aplicarPieEnTodasLasPaginas(doc, totalPaginas);
      doc.save(`Informe_EscalaPro_${paciente.nombre.replace(/\s+/g, '_')}_${fecha.replace(/\//g, '-')}.pdf`);

    } catch (err) {
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
          <div className="space-y-4 mb-12">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Resultados de la Sesión</h4>
            {resultados.map((res, index) => (
              <div key={index} className="flex items-center gap-6 p-6 bg-white border border-slate-50 rounded-[2rem] shadow-sm">
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{res.nombreEscala}</h4>
                  <p className="text-xs font-bold text-teal-600 italic">{res.puntaje} pts • {res.interpretacion}</p>
                </div>
                <button onClick={() => onRemoveScale(index)} className="no-print p-3 text-slate-200 hover:text-red-500 transition-all">
                  <Trash2 size={20}/>
                </button>
              </div>
            ))}
          </div>

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

                    {data && (
                      <div className="mb-6 rounded-[1.5rem] overflow-hidden border border-slate-100">
                        <div className="grid grid-cols-4 bg-slate-50 px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Sesión</span><span>Fecha</span><span>Puntaje</span><span>Resultado</span>
                        </div>
                        {[...items].reverse().map((it, i, arr) => {
                          const esActual  = i === arr.length - 1;
                          const esInicial = i === 0;
                          return (
                            <div key={i} className={`grid grid-cols-4 px-5 py-3 text-xs border-t border-slate-50 ${esActual ? 'bg-teal-50' : 'bg-white'}`}>
                              <span className={`font-black ${esActual ? 'text-teal-700' : 'text-slate-400'}`}>
                                {esInicial ? 'Inicial' : esActual ? 'Actual' : `Sesión ${i + 1}`}
                              </span>
                              <span className="text-slate-500 flex items-center gap-1">
                                <Calendar size={10} className="text-teal-400 shrink-0" />
                                {new Date(it.fecha).toLocaleDateString('es-CL')}
                              </span>
                              <span className={`font-black ${esActual ? 'text-teal-700' : 'text-slate-700'}`}>{it.puntaje} pts</span>
                              <span className="text-slate-500 italic text-[10px] leading-tight">{it.interpretacion}</span>
                            </div>
                          );
                        })}
                        <div className="grid grid-cols-2 bg-teal-600 px-5 py-3 text-white text-[10px] font-black uppercase tracking-wide">
                          <span>{data.esMejoria ? '▲' : data.valor === 0 ? '■' : '▼'}&nbsp;Variación: {data.valor > 0 ? '+' : ''}{data.valor}%</span>
                          <span className="text-right">{data.impacto}</span>
                        </div>
                      </div>
                    )}

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
                              <span className="text-xs font-bold text-slate-600">{new Date(it.fecha).toLocaleDateString('es-CL')}</span>
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

          <button
            onClick={generateMasterPDF}
            className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 hover:bg-teal-600 transition-all active:scale-95"
          >
            <FileText size={28} /> DESCARGAR INFORME PROFESIONAL
          </button>
        </div>
      </div>
    </div>
  );
}