// src/components/ClinicalFlowPanel.tsx
import { useState } from 'react';
import { clinicalFlows, flowAreas, ClinicalFlow } from '../data/clinicalFlows';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Workflow } from 'lucide-react';

interface ClinicalFlowPanelProps {
  onSelectScale: (escalaId: string) => void;
  onClose: () => void;
  activeFlow: ClinicalFlow | null;
  onSelectFlow: (flow: ClinicalFlow) => void;
}

export default function ClinicalFlowPanel({ onSelectScale, onClose, activeFlow, onSelectFlow }: ClinicalFlowPanelProps) {
  const [areaAbierta, setAreaAbierta] = useState<string | null>('Neurología');
  const [completados, setCompletados] = useState<Set<string>>(new Set());

  const toggleCompletado = (escalaId: string) => {
    setCompletados(prev => {
      const next = new Set(prev);
      next.has(escalaId) ? next.delete(escalaId) : next.add(escalaId);
      return next;
    });
  };

  const progreso = activeFlow
    ? Math.round((completados.size / activeFlow.pasos.length) * 100)
    : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Workflow size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              Protocolos Clínicos
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Flujos de evaluación guiados
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-teal-600 font-black text-[10px] uppercase tracking-widest transition-colors"
        >
          ✕ Cerrar
        </button>
      </div>

      {/* Si hay un flujo activo, mostrar el protocolo */}
      {activeFlow ? (
        <div className="space-y-6">

          {/* Barra de progreso */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
                  {activeFlow.nombre}
                </h3>
                <p className="text-xs font-bold text-slate-400">{activeFlow.descripcion}</p>
              </div>
              <button
                onClick={() => { onSelectFlow(null as any); setCompletados(new Set()); }}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
              >
                Cambiar
              </button>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-700 rounded-full"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-2">
              {completados.size} de {activeFlow.pasos.length} escalas completadas
            </p>
          </div>

          {/* Pasos del protocolo */}
          <div className="space-y-3">
            {activeFlow.pasos.map((paso, idx) => {
              const hecho = completados.has(paso.escalaId);
              return (
                <div
                  key={paso.escalaId}
                  className={`flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all ${
                    hecho
                      ? 'bg-teal-50 border-teal-200'
                      : 'bg-white border-slate-100 hover:border-teal-200 hover:shadow-md'
                  }`}
                >
                  {/* Número / Check */}
                  <button
                    onClick={() => toggleCompletado(paso.escalaId)}
                    className="shrink-0"
                  >
                    {hecho ? (
                      <CheckCircle2 size={28} className="text-teal-500" />
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center">
                        <span className="text-[10px] font-black text-slate-400">{idx + 1}</span>
                      </div>
                    )}
                  </button>

                  {/* Info */}
                  <div className="flex-1">
                    <p className={`font-black text-sm uppercase tracking-tight ${hecho ? 'text-teal-700 line-through opacity-60' : 'text-slate-900'}`}>
                      {paso.nombreEscala}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{paso.motivo}</p>
                  </div>

                  {/* Botón evaluar */}
                  {!hecho && (
                    <button
                      onClick={() => {
                        onSelectScale(paso.escalaId);
                        toggleCompletado(paso.escalaId);
                      }}
                      className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shrink-0"
                    >
                      Evaluar <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completado total */}
          {progreso === 100 && (
            <div className="bg-teal-600 text-white p-8 rounded-[2rem] text-center animate-in zoom-in duration-500">
              <CheckCircle2 size={48} className="mx-auto mb-4" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                Protocolo Completado
              </h3>
              <p className="text-teal-100 text-sm font-bold">
                Todas las escalas del protocolo {activeFlow.nombre} fueron evaluadas.
              </p>
            </div>
          )}
        </div>

      ) : (
        /* Lista de protocolos agrupados por área */
        <div className="space-y-4">
          {flowAreas.map(area => {
            const flows = clinicalFlows.filter(f => f.area === area);
            const abierta = areaAbierta === area;

            return (
              <div key={area} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setAreaAbierta(abierta ? null : area)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-teal-500 rounded-full" />
                    <span className="font-black text-slate-900 uppercase tracking-tight">{area}</span>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-lg">
                      {flows.length} protocolos
                    </span>
                  </div>
                  {abierta ? <ChevronUp size={18} className="text-slate-300" /> : <ChevronDown size={18} className="text-slate-300" />}
                </button>

                {abierta && (
                  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                    {flows.map(flow => (
                      <button
                        key={flow.id}
                        onClick={() => onSelectFlow(flow)}
                        className="group text-left p-5 bg-slate-50 hover:bg-teal-50 border-2 border-transparent hover:border-teal-200 rounded-[1.5rem] transition-all active:scale-95"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-teal-700 transition-colors">
                              {flow.nombre}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 leading-snug">
                              {flow.descripcion}
                            </p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-teal-500 transition-colors shrink-0 mt-1" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {flow.pasos.slice(0, 3).map(p => (
                            <span key={p.escalaId} className="text-[9px] font-black uppercase bg-white border border-slate-100 text-slate-400 px-2 py-0.5 rounded-md">
                              {p.nombreEscala}
                            </span>
                          ))}
                          {flow.pasos.length > 3 && (
                            <span className="text-[9px] font-black uppercase bg-white border border-slate-100 text-teal-400 px-2 py-0.5 rounded-md">
                              +{flow.pasos.length - 3} más
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}