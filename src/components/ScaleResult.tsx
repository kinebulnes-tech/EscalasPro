import { Scale } from '../data/scalesData';
import { ClipboardCheck, ArrowLeft, Copy } from 'lucide-react';
import { useState } from 'react';

interface ScaleResultProps {
  scale: Scale;
  totalScore: number;
  onBack: () => void;
}

export default function ScaleResult({ scale, totalScore, onBack }: ScaleResultProps) {
  const [copied, setCopied] = useState(false);

  // Usamos la función interpretar que ya viene en la definición de la escala
  const interpretation = scale.interpretar(totalScore);

  const generateReport = () => {
    const date = new Date().toLocaleDateString();
    
    const report = `EVALUACIÓN CLÍNICA - EscalaPro
------------------------------
Fecha: ${date}
Escala: ${scale.nombre}
Puntaje Total: ${totalScore} puntos
Interpretación: ${interpretation}
------------------------------
Generado por EscalaPro`.trim();

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Resultado Final</h2>
        <p className="text-gray-500 font-medium">{scale.nombre}</p>
      </div>

      <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-3xl p-10 text-white text-center shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-teal-100 font-bold uppercase tracking-widest text-sm mb-2">Puntaje Obtenido</p>
          <div className="text-7xl font-black mb-4">{totalScore}</div>
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-bold text-xl">
            {interpretation}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          Nueva Evaluación
        </button>

        <button
          onClick={generateReport}
          className={`flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-2xl transition-all active:scale-95 shadow-lg ${
            copied 
            ? 'bg-green-500 text-white scale-105' 
            : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200'
          }`}
        >
          {copied ? (
            <>
              <ClipboardCheck className="w-5 h-5" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copiar Reporte
            </>
          )}
        </button>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8 italic">
        "Uso exclusivo para profesionales de la salud. Valide siempre con su criterio clínico."
      </p>
    </div>
  );
}