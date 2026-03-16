import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Scale, ShieldCheck } from 'lucide-react';
import { feedback } from '../utils/feedback'; // ✅ Importamos feedback para desbloquear audio

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificamos si ya aceptó los términos antes
    const hasAccepted = localStorage.getItem('escalapro_disclaimer_accepted_v1');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = async () => {
    // ✅ PASO CLAVE: Desbloquea el audio en celulares (iOS/Android)
    try {
      await feedback.resumeAudio();
      feedback.playClick();
    } catch (e) {
      console.log("Audio bloqueado");
    }

    localStorage.setItem('escalapro_disclaimer_accepted_v1', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
        
        {/* Cabecera de Alerta Médica */}
        <div className="bg-red-600 p-8 text-white text-center relative overflow-hidden">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-90 animate-pulse" />
          <h2 className="text-3xl font-black uppercase tracking-tighter">Aviso Profesional</h2>
          <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-2">Uso Exclusivo Salud</p>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Cuerpo del Mensaje */}
        <div className="p-8 sm:p-10 space-y-6">
          <div className="flex items-start gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm shrink-0">
               <Scale className="text-teal-600 w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-black text-sm uppercase">Importante</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Esta aplicación es una herramienta de apoyo. <span className="text-red-600 font-bold italic">No sustituye su criterio clínico.</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 px-2">
            {[
              { icon: <ShieldCheck size={16}/>, text: "Usted es responsable de las decisiones tomadas." },
              { icon: <ShieldCheck size={16}/>, text: "Los datos se procesan localmente (Privacidad Total)." },
              { icon: <ShieldCheck size={16}/>, text: "La información se basa en evidencia (PubMed/PMID)." }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-tight">
                <span className="text-teal-500">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={handleAccept}
              className="w-full bg-slate-900 hover:bg-teal-600 text-white py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-slate-300 active:scale-95 flex items-center justify-center gap-3 group"
            >
              <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              ACEPTAR Y ENTRAR
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-6 font-medium italic">
              Al entrar, usted acepta los Términos y Condiciones de EscalaPro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;