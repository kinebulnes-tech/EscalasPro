// src/components/TrendChart.tsx
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface TrendChartProps {
  data: any[];
  titulo: string;
  forPDF?: boolean; // Nueva opción para saber si se dibuja para el informe
}

export default function TrendChart({ data, titulo, forPDF = false }: TrendChartProps) {
  const chartData = data
    .map(item => ({
      fecha: new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
      puntaje: item.puntaje,
    }))
    .reverse();

  if (chartData.length < 2) return null;

  const cleanId = titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const chartId = forPDF ? `pdf-chart-${cleanId}` : `chart-${cleanId}`;

  return (
    <div className={`${forPDF ? 'bg-white p-2' : 'bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl'} space-y-4`}>
      {!forPDF && (
        <div className="flex items-center justify-between px-2">
          <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm">Evolución: {titulo}</h4>
          <span className="bg-teal-100 text-teal-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">{chartData.length} Registros</span>
        </div>
      )}

      <div id={chartId} className="w-full bg-white" style={{ height: forPDF ? '200px' : '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
            <YAxis hide domain={['auto', 'auto']} />
            <Line type="monotone" dataKey="puntaje" stroke="#0d9488" strokeWidth={4} dot={{ r: 6, fill: '#0d9488', stroke: '#fff' }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}