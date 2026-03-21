import { useState } from 'react';
import { UserPlus, X, AlertCircle, Activity } from 'lucide-react';
// ✅ Importamos validadores y el motor de biometría
import { validateRUT, formatRUT } from '../utils/validators';
import { calcularIMC, clasificarIMC } from '../utils/biometrics.ts';

interface PatientModalProps {
  onConfirm: (paciente: { 
    nombre: string; 
    rut: string; 
    edad: string; 
    diagnostico: string;
    peso: string;
    talla: string;
    imc: string;
  }) => void;
  onClose: () => void;
}

export default function PatientModal({ onConfirm, onClose }: PatientModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    edad: '',
    diagnostico: '',
    peso: '',
    talla: ''
  });

  const [errorRUT, setErrorRUT] = useState(false);

  // ✅ Cálculo de IMC reactivo basado en los inputs de peso y talla
  const imcValue = calcularIMC(Number(formData.peso), Number(formData.talla));
  const infoIMC = imcValue ? clasificarIMC(imcValue) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validamos el RUT con el algoritmo de Módulo 11
    if (!validateRUT(formData.rut)) {
      setErrorRUT(true);
      return; 
    }

    // 2. Enviamos datos, incluyendo el IMC calculado para la base de datos
    setErrorRUT(false);
    onConfirm({
      ...formData,
      rut: formatRUT(formData.rut),
      imc: imcValue ? imcValue.toString() : 'N/A'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        
        <div className="bg-teal-600 p-6 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <UserPlus size={100} />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <UserPlus className="w-6 h-6" />
            <h3 className="text-xl font-black italic tracking-tighter">Identificación Clínica</h3>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Nombre y Edad */}
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest leading-none">Nombre Completo</label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-sm transition-all"
                placeholder="Ej: Maximiliano Villarroel"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-[9px] font-black uppercase mb-1 ml-1 tracking-widest ${errorRUT ? 'text-red-500' : 'text-gray-400'}`}>RUT</label>
                <input 
                  required
                  type="text" 
                  className={`w-full bg-gray-50 border-2 p-3 rounded-xl outline-none font-bold text-sm transition-all ${errorRUT ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-100 focus:border-teal-500'}`}
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onChange={(e) => {
                    setFormData({...formData, rut: e.target.value});
                    if(errorRUT) setErrorRUT(false);
                  }}
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Edad</label>
                <input 
                  required
                  type="number" 
                  className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-sm transition-all"
                  placeholder="39"
                  value={formData.edad}
                  onChange={(e) => setFormData({...formData, edad: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* ✅ SECCIÓN DE ANTROPOMETRÍA (Calculadora IMC) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <p className="text-[9px] font-black uppercase text-teal-600 tracking-widest flex items-center gap-2 leading-none mb-2">
              <Activity size={12} /> Biometría Automática
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Peso (kg)"
                  className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-xs shadow-sm"
                  value={formData.peso}
                  onChange={(e) => setFormData({...formData, peso: e.target.value})}
                />
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Talla (cm)"
                  className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-xs shadow-sm"
                  value={formData.talla}
                  onChange={(e) => setFormData({...formData, talla: e.target.value})}
                />
              </div>
            </div>

            {/* Visualización del Resultado IMC */}
            {imcValue && (
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-teal-100 animate-in fade-in slide-in-from-top-1 shadow-inner">
                <span className="text-[10px] font-black text-slate-400 uppercase">IMC: <span className="text-slate-900">{imcValue}</span></span>
                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${infoIMC?.color} bg-white shadow-sm`}>
                  {infoIMC?.etiqueta}
                </span>
              </div>
            )}
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Diagnóstico Médico</label>
            <textarea 
              required
              rows={2}
              className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-xs transition-all resize-none"
              placeholder="Ej: Secuela ACV..."
              value={formData.diagnostico}
              onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={errorRUT}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${errorRUT ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100'}`}
          >
            {errorRUT ? 'RUT Inválido' : 'Comenzar Protocolo'}
          </button>
        </form>
      </div>
    </div>
  );
}