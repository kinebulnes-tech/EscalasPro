import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre && formData.rut) {
      onConfirm(formData);
    } else {
      alert("Por favor, ingresa al menos Nombre y RUT.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-teal-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            <h3 className="text-xl font-black">Nueva Evaluación</h3>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Nombre Completo</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all"
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">RUT</label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all"
                placeholder="12.345.678-9"
                value={formData.rut}
                onChange={(e) => setFormData({...formData, rut: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Edad</label>
              <input 
                required
                type="number" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all"
                placeholder="39"
                value={formData.edad}
                onChange={(e) => setFormData({...formData, edad: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Diagnóstico Médico</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all resize-none"
              placeholder="Ej: ACV Isquémico / Fractura de cadera"
              value={formData.diagnostico}
              onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 rounded-3xl font-black text-lg shadow-lg shadow-teal-100 transition-all active:scale-95 mt-4"
          >
            Comenzar Evaluación
          </button>
        </form>
      </div>
    </div>
  );
}