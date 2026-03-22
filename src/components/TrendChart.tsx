// src/components/TrendChart.tsx
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface TrendChartProps {
  data: any[];
  titulo: string;
}

export default function TrendChart({ data, titulo }: TrendChartProps) {
  const chartData = data
    .map(item => ({
      fecha: new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
      puntaje: item.puntaje,
      fullDate: new Date(item.fecha).toLocaleString()
    }))
    .reverse();

  if (chartData.length < 2) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          Se requieren al menos 2 evaluaciones de "{titulo}" para generar tendencia.
        </p>
      </div>
    );
  }

  // Limpiamos el ID eliminando tildes y caracteres raros para que el PDF lo encuentre siempre
  const cleanId = titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase();
  const chartId = `chart-${cleanId}`;

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
      <div className="flex items-center justify-between px-2">
        <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm">
          Evolución: {titulo}
        </h4>
        <span className="bg-teal-100 text-teal-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
          {chartData.length} Registros
        </span>
      </div>

      <div id={chartId} className="h-[250px] w-full pt-4 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="fecha" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
              dy={10}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 'bold', color: '#0d9488' }}
            />
            <Line 
              type="monotone" 
              dataKey="puntaje" 
              stroke="#0d9488" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}