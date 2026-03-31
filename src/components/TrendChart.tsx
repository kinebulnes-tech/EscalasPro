// src/components/TrendChart.tsx
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, LabelList, Label
} from 'recharts';

interface TrendChartProps {
  data: any[];
  titulo: string;
  forPDF?: boolean; 
}

export default function TrendChart({ data, titulo, forPDF = false }: TrendChartProps) {
  const chartData = [...data]
    .reverse()
    .map(item => ({
      fecha: new Date(item.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
      puntaje: item.puntaje,
    }));

  if (chartData.length < 2) return null;

  const puntajes   = chartData.map(d => d.puntaje);
  const minPuntaje = Math.min(...puntajes);
  const maxPuntaje = Math.max(...puntajes);
  const rango      = maxPuntaje - minPuntaje;
  const padding    = rango === 0 ? Math.max(maxPuntaje * 0.1, 5) : rango * 0.3;
  const yMin       = Math.max(0, Math.floor(minPuntaje - padding));
  const yMax       = Math.ceil(maxPuntaje + padding);

  const cleanId = titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const chartId = forPDF ? `pdf-chart-${cleanId}` : `chart-${cleanId}`;

  return (
    <div className={`${forPDF ? 'bg-white p-0' : 'bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl'} space-y-4`}>
      {!forPDF && (
        <div className="flex items-center justify-between px-2">
          <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm italic">Evolución: {titulo}</h4>
          <span className="bg-teal-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-teal-200">
            {chartData.length} Sesiones
          </span>
        </div>
      )}

      <div id={chartId} className="w-full bg-white" style={{ height: forPDF ? '180px' : '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 25, right: 40, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="fecha" 
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 2 }} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }}
            >
              <Label value="FECHA DE EVALUACIÓN" offset={-15} position="insideBottom" style={{ fill: '#94a3b8', fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px' }} />
            </XAxis>
            
            <YAxis 
              domain={[yMin, yMax]}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 2 }} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }}
              width={35}
            >
              <Label value="PTS" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '9px', fontWeight: 'bold', textAnchor: 'middle' }} />
            </YAxis>

            <Line 
              type="monotone" 
              dataKey="puntaje" 
              stroke="#0d9488" 
              strokeWidth={5} 
              dot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 3 }} 
              activeDot={{ r: 8, strokeWidth: 0 }}
              isAnimationActive={false} 
            >
              <LabelList 
                dataKey="puntaje" 
                position="top" 
                offset={12} 
                style={{ fill: '#0f172a', fontSize: '11px', fontWeight: '900' }} 
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}