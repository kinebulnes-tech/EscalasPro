import { useState } from 'react';
import { UserPlus, X, Activity, Globe } from 'lucide-react';
// ✅ Importamos la nueva lógica internacional
import { validateIdentificationWithMessage, formatIdentification } from '../utils/validators';
import { identityConfigs, DEFAULT_COUNTRY } from '../utils/patientIdentity';
// ✅ Importamos el cálculo cronológico de biometrics
import { calcularIMC, clasificarIMC, calcularEdadExacta } from '../utils/biometrics.ts';

interface PatientModalProps {
  onConfirm: (paciente: { 
    nombre: string; 
    id: string; 
    country: string;
    fechaNacimiento: string; // ✅ Nueva propiedad para persistencia
    edad: string; 
    diagnostico: string;
    peso: string;
    talla: string;
    imc: string;
  }) => void;
  onClose: () => void;
}

export default function PatientModal({ onConfirm, onClose }: PatientModalProps) {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [formData, setFormData] = useState({
    nombre: '',
    id: '', 
    fechaNacimiento: '', // ✅ Cambiado de 'edad' a 'fechaNacimiento'
    diagnostico: '',
    peso: '',
    talla: ''
  });

  const [errorID, setErrorID] = useState(false);
  const [errorIDMensaje, setErrorIDMensaje] = useState('');

  // Configuración del país seleccionado
  const config = identityConfigs[country];

  const imcValue = calcularIMC(Number(formData.peso), Number(formData.talla));
  const infoIMC = imcValue ? clasificarIMC(imcValue) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validamos ID según el país seleccionado
    const validacion = validateIdentificationWithMessage(formData.id, country);
    if (!validacion.isValid) {
      setErrorID(true);
      setErrorIDMensaje(validacion.mensaje);
      return;
    }

    // 2. Cálculo de edad legible para el reporte
    const calculo = calcularEdadExacta(formData.fechaNacimiento);
    let edadTexto = "";
    
    if (calculo.años > 0) {
      edadTexto = `${calculo.años} años ${calculo.meses > 0 ? `y ${calculo.meses} m` : ''}`;
    } else {
      edadTexto = `${calculo.meses} meses y ${calculo.dias} días`;
    }

    setErrorID(false);
    onConfirm({
      ...formData,
      id: formatIdentification(formData.id, country),
      country: country,
      fechaNacimiento: formData.fechaNacimiento,
      edad: edadTexto, // ✅ Ahora se pasa una edad calculada con precisión
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
          
          {/* Selector de País */}
          <div>
            <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest leading-none">País de Origen</label>
            <div className="relative">
              <select 
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setErrorID(false);
                }}
                className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-sm appearance-none transition-all"
              >
                {Object.entries(identityConfigs).map(([code, cfg]) => (
                  <option key={code} value={code}>{cfg.country}</option>
                ))}
              </select>
              <Globe className="absolute right-4 top-3.5 text-gray-300 w-4 h-4 pointer-events-none" />
            </div>
          </div>

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
                <label className={`block text-[9px] font-black uppercase mb-1 ml-1 tracking-widest ${errorID ? 'text-red-500' : 'text-gray-400'}`}>
                  {config.documentName}
                </label>
                <input
                  required
                  aria-required="true"
                  aria-invalid={errorID}
                  aria-describedby={errorID ? "error-id-msg" : undefined}
                  type="text"
                  className={`w-full bg-gray-50 border-2 p-3 rounded-xl outline-none font-bold text-sm transition-all ${errorID ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-100 focus:border-teal-500'}`}
                  placeholder={config.placeholder}
                  value={formData.id}
                  onChange={(e) => {
                    setFormData({...formData, id: e.target.value});
                    if(errorID) { setErrorID(false); setErrorIDMensaje(''); }
                  }}
                />
                {errorID && errorIDMensaje && (
                  <p id="error-id-msg" className="mt-1 ml-1 text-[10px] text-red-500 font-bold leading-tight">{errorIDMensaje}</p>
                )}
              </div>
              <div>
                {/* ✅ MEJORA: Fecha de Nacimiento sustituye a Edad manual */}
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Fecha Nacimiento</label>
                <div className="relative">
                  <input 
                    required
                    type="date" 
                    max={new Date().toISOString().split("T")[0]} // No permite fechas futuras
                    className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-xs transition-all"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN DE ANTROPOMETRÍA */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <p className="text-[9px] font-black uppercase text-teal-600 tracking-widest flex items-center gap-2 leading-none mb-2">
              <Activity size={12} /> Biometría Automática
            </p>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="number" step="0.1" placeholder="Peso (kg)"
                className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-xs shadow-sm"
                value={formData.peso}
                onChange={(e) => setFormData({...formData, peso: e.target.value})}
              />
              <input 
                type="number" placeholder="Talla (cm)"
                className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-xs shadow-sm"
                value={formData.talla}
                onChange={(e) => setFormData({...formData, talla: e.target.value})}
              />
            </div>

            {imcValue && (
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-teal-100 animate-in fade-in slide-in-from-top-1 shadow-inner">
                <span className="text-[10px] font-black text-slate-400 uppercase">IMC: <span className="text-slate-900">{imcValue}</span></span>
                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${infoIMC?.color} bg-white shadow-sm`}>
                  {infoIMC?.etiqueta}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-widest">Diagnóstico Médico</label>
            <textarea 
              required rows={2}
              className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-xl focus:border-teal-500 outline-none font-bold text-xs transition-all resize-none"
              placeholder="Ej: Secuela ACV..."
              value={formData.diagnostico}
              onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={errorID}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${errorID ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100'}`}
          >
            {errorID ? `${config.documentName} Inválido` : 'Comenzar Protocolo'}
          </button>
        </form>
      </div>
    </div>
  );
}