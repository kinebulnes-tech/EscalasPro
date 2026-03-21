import { useState } from 'react';
import { UserPlus, X, AlertCircle } from 'lucide-react';
// ✅ Importamos los nuevos validadores
import { validateRUT, formatRUT } from '../utils/validators';

interface PatientModalProps {
  onConfirm: (paciente: { nombre: string; rut: string; edad: string; diagnostico: string }) => void;
  onClose: () => void;
}

export default function PatientModal({ onConfirm, onClose }: PatientModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    edad: '',
    diagnostico: ''
  });

  // ✅ Estado para el error visual del RUT
  const [errorRUT, setErrorRUT] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validamos el RUT con el algoritmo de Módulo 11
    if (!validateRUT(formData.rut)) {
      setErrorRUT(true);
      return; // Bloqueamos el envío
    }

    // 2. Si es válido, enviamos los datos con el RUT formateado (Ej: 12345678-K)
    setErrorRUT(false);
    onConfirm({
      ...formData,
      rut: formatRUT(formData.rut)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        
        <div className="bg-teal-600 p-6 text-white flex justify-between items-center relative overflow-hidden">
          {/* Decoración sutil */}
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

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest leading-none">Nombre Completo del Paciente</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all placeholder:opacity-30"
              placeholder="Ej: Maximiliano Villarroel"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-[10px] font-black uppercase mb-2 ml-1 tracking-widest leading-none ${errorRUT ? 'text-red-500' : 'text-gray-400'}`}>
                RUT
              </label>
              <input 
                required
                type="text" 
                className={`w-full bg-gray-50 border-2 p-4 rounded-2xl outline-none font-bold transition-all ${errorRUT ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-600' : 'border-gray-100 focus:border-teal-500'}`}
                placeholder="12345678-9"
                value={formData.rut}
                onChange={(e) => {
                  setFormData({...formData, rut: e.target.value});
                  if(errorRUT) setErrorRUT(false); // Limpia el error al escribir
                }}
              />
              {errorRUT && (
                <div className="flex items-center gap-1 mt-2 ml-1 text-red-500 animate-pulse">
                  <AlertCircle size={10} />
                  <p className="text-[9px] font-black uppercase tracking-tighter">RUT No Válido</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest leading-none">Edad</label>
              <input 
                required
                type="number" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all placeholder:opacity-30"
                placeholder="39"
                value={formData.edad}
                onChange={(e) => setFormData({...formData, edad: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest leading-none">Diagnóstico / Motivo de Consulta</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all resize-none placeholder:opacity-30 text-sm"
              placeholder="Describa el diagnóstico principal..."
              value={formData.diagnostico}
              onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className={`w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 mt-4 shadow-lg ${errorRUT ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100'}`}
          >
            {errorRUT ? 'Corrija el RUT' : 'Comenzar Evaluación'}
          </button>
        </form>
      </div>
    </div>
  );
}