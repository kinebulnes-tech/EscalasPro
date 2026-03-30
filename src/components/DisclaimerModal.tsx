import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Scale, ShieldCheck, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { feedback } from '../utils/feedback';

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrivacidad, setShowPrivacidad] = useState(false);
  const [aceptado, setAceptado] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('escalapro_disclaimer_accepted_v2');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = async () => {
    if (!aceptado) return;
    try {
      await feedback.resumeAudio();
      feedback.playClick();
    } catch (e) {
      console.log("Audio bloqueado");
    }
    // ✅ Guardamos versión v2 (política actualizada)
    localStorage.setItem('escalapro_disclaimer_accepted_v2', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
        
        {/* Cabecera */}
        <div className="bg-red-600 p-8 text-white text-center relative overflow-hidden shrink-0">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-90 animate-pulse" />
          <h2 className="text-3xl font-black uppercase tracking-tighter">Aviso Profesional</h2>
          <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-2">Uso Exclusivo Salud</p>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Cuerpo con scroll */}
        <div className="p-8 sm:p-10 space-y-6 overflow-y-auto">

          <div className="flex items-start gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm shrink-0">
               <Scale className="text-teal-600 w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-black text-sm uppercase">Importante</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Esta aplicación es una herramienta de apoyo.{' '}
                <span className="text-red-600 font-bold italic">No sustituye su criterio clínico.</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 px-2">
            {[
              { text: "Usted es responsable de las decisiones clínicas tomadas." },
              { text: "Los datos se procesan y almacenan localmente en este dispositivo." },
              { text: "Ningún dato de pacientes se envía a servidores externos." },
              { text: "La información se basa en evidencia científica verificada (PubMed)." }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-tight">
                <ShieldCheck size={16} className="text-teal-500 shrink-0" />
                {item.text}
              </div>
            ))}
          </div>

          {/* ✅ NUEVO: Sección de Política de Privacidad expandible */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowPrivacidad(!showPrivacidad)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-teal-600" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                  Política de Privacidad y Términos
                </span>
              </div>
              {showPrivacidad
                ? <ChevronUp size={16} className="text-slate-400" />
                : <ChevronDown size={16} className="text-slate-400" />
              }
            </button>

            {showPrivacidad && (
              <div className="p-5 space-y-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200">
                
                <div>
                  <p className="font-black text-slate-800 uppercase mb-1">1. Responsable del Tratamiento</p>
                  <p>EscalaPro es una herramienta de soporte clínico. El profesional de salud que la utiliza es el único responsable del tratamiento de los datos de sus pacientes en este dispositivo.</p>
                </div>

                <div>
                  <p className="font-black text-slate-800 uppercase mb-1">2. Datos que se Procesan</p>
                  <p>Nombre del paciente, identificación (RUT u otro), fecha de nacimiento, diagnóstico, datos biométricos (peso, talla) y resultados de evaluaciones clínicas. Estos datos son considerados <span className="font-bold text-slate-800">datos sensibles de salud</span> según la Ley N° 19.628 de Chile.</p>
                </div>

                <div>
                  <p className="font-black text-slate-800 uppercase mb-1">3. Almacenamiento y Privacidad</p>
                  <p>Todos los datos se almacenan <span className="font-bold text-slate-800">exclusivamente en este dispositivo</span> usando IndexedDB del navegador con cifrado AES. Ningún dato se transmite a servidores externos. EscalaPro no tiene acceso a los datos de sus pacientes.</p>
                </div>

                <div>
                  <p className="font-black text-slate-800 uppercase mb-1">4. Finalidad del Tratamiento</p>
                  <p>Los datos se usan únicamente para calcular escalas clínicas, generar informes PDF locales y visualizar tendencias de evolución del paciente.</p>
                </div>

                <div>
                  <p className="font-black text-slate-800 uppercase mb-1">5. Retención de Datos</p>
                  <p>Los datos de sesión activa se eliminan automáticamente al cerrar el navegador. El historial permanece en el dispositivo hasta que el profesional lo elimine manualmente.</p>
                </div>

                <div>
                  <p className="font-black text-slate-800 uppercase mb-1">6. Derechos del Paciente (ARCO)</p>
                  <p>El profesional es responsable de garantizar los derechos de acceso, rectificación, cancelación y oposición de sus pacientes sobre sus datos, conforme a la Ley N° 19.628.</p>
                </div>

                <div>
                  <p className="font-black text-slate-800 uppercase mb-1">7. Limitación de Responsabilidad</p>
                  <p>EscalaPro es un instrumento de apoyo a la decisión clínica. Los resultados deben ser validados por el profesional responsable. El desarrollador no se hace responsable de decisiones clínicas basadas exclusivamente en los resultados de esta aplicación.</p>
                </div>

              </div>
            )}
          </div>

          {/* ✅ NUEVO: Checkbox de aceptación explícita */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={aceptado}
                onChange={(e) => setAceptado(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                aceptado
                  ? 'bg-teal-600 border-teal-600'
                  : 'border-slate-300 group-hover:border-teal-400'
              }`}>
                {aceptado && <CheckCircle size={12} className="text-white" />}
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              He leído y acepto los Términos de Uso y la Política de Privacidad. Entiendo que soy el responsable del tratamiento de los datos de mis pacientes en este dispositivo.
            </p>
          </label>

          <div className="pt-2">
            <button
              onClick={handleAccept}
              disabled={!aceptado}
              className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group ${
                aceptado
                  ? 'bg-slate-900 hover:bg-teal-600 text-white shadow-slate-300 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              ACEPTAR Y ENTRAR
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-4 font-medium italic">
              EscalaPro — Cumplimiento Ley N° 19.628 Chile
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;