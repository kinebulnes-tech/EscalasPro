import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

interface TimerPluginProps {
  onValueChange: (seconds: number) => void;
  label: string;
}

export default function TimerPlugin({ onValueChange, label }: TimerPluginProps) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Lógica del cronómetro
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
    onValueChange(0);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Notificar al formulario cada vez que el tiempo cambia
  useEffect(() => {
    onValueChange(seconds);
  }, [seconds]);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-700 my-4 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center gap-2 mb-4">
        <TimerIcon className="w-5 h-5 text-teal-400" />
        <span className="text-xs font-black uppercase tracking-widest text-teal-400">
          {label}
        </span>
      </div>
      
      <div className="text-6xl font-black font-mono text-center mb-8 tabular-nums text-teal-50">
        {formatTime(seconds)}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`col-span-3 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 ${
            isActive 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          <span className="text-lg">{isActive ? 'Detener' : 'Iniciar'}</span>
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="col-span-1 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center transition-colors active:scale-95 border border-slate-600"
        >
          <RotateCcw className="w-6 h-6 text-slate-400" />
        </button>
      </div>
    </div>
  );
}