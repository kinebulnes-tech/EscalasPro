// src/components/ReportSummary.tsx
import { 
  Trash2, FileText, ArrowLeft, TrendingUp, TrendingDown, 
  Minus, Award, AlertCircle, User, Activity 
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

  // ✅ MOTOR DE INTELIGENCIA CLÍNICA: Análisis de Avance
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

    return {
      valor: parseFloat(porcentaje.toFixed(1)),
      impacto,
      color,
      esMejoria: porcentaje > 0
    };
  };

  const generateMasterPDF = async () => {
    const doc = new jsPDF();
    let y = 20;

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18); doc.setTextColor(0, 128, 128);
    doc.text("INFORME DE EVOLUCIÓN CLÍNICA", 20, y);
    y += 10; doc.setDrawColor(0, 128, 128); doc.setLineWidth(0.8); doc.line(20, y, 190, y); 
    
    // Info Paciente
    y += 15; doc.setFontSize(10); doc.setTextColor(0, 0, 0);
    doc.text(`PACIENTE: ${paciente.nombre.toUpperCase()}`, 20, y);
    doc.text(`${docLabel}: ${paciente.id}`, 130, y);
    y += 7; doc.setFont("helvetica", "normal");
    doc.text(`Diagnóstico: ${paciente.diagnostico} | Edad: ${paciente.edad} años`, 20, y);

    // ✅ SECCIÓN CONCLUSIONES AUTOMÁTICAS
    if (escalasConHistorial.length > 0) {
      y += 15;
      doc.setFillColor(240, 250, 250);
      doc.rect(18, y, 175, 25, 'F');
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0, 100, 100);
      doc.text("SÍNTESIS DE RESPUESTA AL TRATAMIENTO:", 22, y + 8);
      
      doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(50, 50, 50);
      const escalaPrincipal = escalasConHistorial[0];
      const analisis = analizarProgreso(escalaPrincipal[1]);
      
      const textoIA = `Basado en los datos analizados, el paciente presenta una ${analisis?.impacto.toLowerCase()} en la escala ${escalaPrincipal[0]}, con una variación del ${analisis?.valor}%. Se sugiere continuar con el plan de objetivos actuales para consolidar logros funcionales.`;
      const splitTexto = doc.splitTextToSize(textoIA, 165);
      doc.text(splitTexto, 22, y + 15);
      y += 35;
    }

    // Análisis de Avance %
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 128, 128);
    doc.text("COMPARATIVA PORCENTUAL DE LOGROS", 20, y);
    y += 8;
    escalasConHistorial.forEach(([nombre, items]) => {
      const data = analizarProgreso(items);
      if (data) {
        doc.setFontSize(9); doc.setTextColor(0, 0, 0);
        doc.text(`• ${nombre}:`, 25, y);
        doc.setFont("helvetica", "bold");
        doc.text(`${data.valor > 0 ? '+' : ''}${data.valor}% (${data.impacto})`, 80, y);
        y += 6;
      }
    });

    // ✅ RENDERIZADO DE GRÁFICOS EN PDF
    if (escalasConHistorial.length > 0) {
      y += 10;
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

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(7); doc.setTextColor(150, 150, 150);
    doc.text("Generado por EscalaPro Intelligence v1.0 - Medicion Basada en Evidencia", 20, pageHeight - 10);
    doc.save(`Informe_Consolidado_${paciente.nombre.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="no-print flex items-center gap-2 text-teal-600 font-black mb-8 uppercase text-[10px] tracking-widest hover:translate-x-[-4px] transition-transform">
        <ArrowLeft size={18} /> Volver al catálogo
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
          <h2 className="text-4xl font-black italic tracking-tighter">{paciente.nombre}</h2>
          <div className="flex flex-wrap gap-4 mt-2 opacity-60 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><User size={12}/> {docLabel}: {paciente.id}</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Activity size={12}/> {paciente.diagnostico}</span>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          {escalasConHistorial.length > 0 && (
            <div className="mb-10 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Métricas de Rendimiento</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {escalasConHistorial.map(([nombre, items], idx) => {
                  const data = analizarProgreso(items);
                  if (!data) return null;
                  return (
                    <div key={idx} className="relative group bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-teal-500/20 transition-all duration-500">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-teal-50 transition-colors">
                          {data.esMejoria ? <Award className="text-teal-600" size={24}/> : <AlertCircle className="text-red-500" size={24}/>}
                        </div>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full bg-slate-50 ${data.color}`}>
                          {data.impacto}
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{nombre}</p>
                      <h5 className="text-3xl font-black text-slate-900 tracking-tighter">
                        {data.valor > 0 ? '+' : ''}{data.valor}%
                      </h5>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {escalasConHistorial.length > 0 && (
            <div className="mb-12 space-y-4 bg-slate-50/50 p-6 lg:p-10 rounded-[3rem] border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Análisis Visual de Progresión</h4>
              <div className="grid grid-cols-1 gap-8">
                {escalasConHistorial.map(([nombre, items], idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-inner">
                     <TrendChart data={items} titulo={nombre} forPDF={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 mb-12">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Resultados de la Sesión</h4>
            {resultados.map((res, index) => (
              <div key={index} className="flex items-center gap-6 p-6 bg-white border border-slate-50 rounded-[2rem] shadow-sm">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 font-black">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{res.nombreEscala}</h4>
                  <p className="text-xs font-bold text-teal-600 italic">{res.puntaje} pts • {res.interpretacion}</p>
                </div>
                <button onClick={() => onRemoveScale(index)} className="no-print p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20}/></button>
              </div>
            ))}
          </div>

          <button onClick={generateMasterPDF} className="group w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all overflow-hidden relative">
            <div className="absolute inset-0 bg-teal-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
            <FileText size={28} className="relative z-10" /> 
            <span className="relative z-10">GENERAR INFORME ELITE</span>
          </button>
        </div>
      </div>
    </div>
  );
}