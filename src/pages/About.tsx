
import { 
  Info, ShieldAlert, Heart, Copyright, 
  Database, UserCheck, Scale, Globe 
} from 'lucide-react';

const About = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 bg-slate-50 min-h-screen animate-in fade-in duration-500 pb-20">
      
      {/* 1. HEADER - Identidad Visual */}
      <div className="text-center space-y-4 pt-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-600 rounded-[2rem] shadow-xl shadow-teal-200 rotate-3 mb-2">
           <Scale className="text-white w-10 h-10 -rotate-3" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
            Escala<span className="text-teal-600">Pro</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Versión 1.0.0 — Clinical Intelligence</p>
        </div>
        <p className="text-lg text-slate-700 font-semibold">
          Desarrollado por <span className="text-slate-900 border-b-2 border-teal-200">Maximiliano Andrés Villarroel Ávila</span>
        </p>
      </div>

      {/* 2. PROPÓSITO & RIGOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-teal-600" size={24} />
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Propósito</h2>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            EscalaPro centraliza el conocimiento clínico basado en evidencia para optimizar la toma de decisiones 
            en kinesiología, rehabilitación y emergencias. No es solo una calculadora; es un asistente de precisión.
          </p>
        </section>

        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-blue-600" size={24} />
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Privacidad Local</h2>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            Toda la información del paciente se procesa y almacena <span className="text-slate-900 font-bold">exclusivamente en su dispositivo</span>. 
            EscalaPro no utiliza servidores externos ni transmite datos privados por la red.
          </p>
        </section>
      </div>

      {/* 3. DESCARGO DE RESPONSABILIDAD (EL ESCUDO LEGAL) */}
      <section className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border-2 border-red-100 overflow-hidden">
        <div className="bg-red-50 p-8 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-red-600" size={32} />
            <h2 className="text-2xl font-black text-red-900 uppercase tracking-tighter">
              Legal Disclaimer
            </h2>
          </div>
          <span className="hidden sm:block text-[10px] text-red-400 font-black uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-red-100">
            Efectivo: 16 de Marzo, 2026
          </span>
        </div>
        
        <div className="p-8 sm:p-12 space-y-10">
          
          {/* Bloque 1: El Juicio Profesional */}
          <div className="relative">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <UserCheck className="text-teal-600" size={20} />
              Responsabilidad del Profesional
            </h3>
            <div className="text-slate-700 leading-relaxed italic bg-slate-50 p-6 rounded-3xl border-l-8 border-teal-500 shadow-inner">
              "Esta herramienta está diseñada para <span className="font-bold">profesionales de la salud capacitados</span>. 
              Los algoritmos y puntajes nunca deben sustituir el diagnóstico presencial, la observación directa 
              ni el <span className="text-slate-900 font-bold underline">juicio clínico soberano</span>. 
              Usted asume la total responsabilidad por las intervenciones derivadas del uso de esta app."
            </div>
          </div>

          {/* Bloque 2: Puntos Legales Críticos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                <Globe size={16} className="text-slate-400" /> Jurisdicción
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Cualquier controversia derivada del uso de EscalaPro se resolverá bajo las leyes de la 
                República de Chile, en los tribunales de la ciudad de Chillán o Bulnes.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={16} className="text-slate-400" /> Sin Garantías
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                El desarrollador no garantiza la infalibilidad de los cálculos. El usuario renuncia a 
                cualquier reclamo legal o financiero por errores u omisiones en el contenido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER IDENTITARIO */}
      <footer className="text-center py-12 space-y-6 border-t border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            <span>Orgullosamente desarrollado en Bulnes, Chile</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium max-w-xs mx-auto italic">
            Kinesiología & Ingeniería Aplicada al Soporte Vital.
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-1 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          <Copyright size={10} />
          <span>{currentYear} EscalaPro — Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
};

export default About;