import React from 'react';
import { Info, ShieldAlert, Heart, Copyright } from 'lucide-react';

const About = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">EscalaPro</h1>
        <p className="text-slate-500 font-medium">Versión 1.0.0</p>
        <p className="text-lg text-slate-700">Desarrollado por Maximiliano Andrés Villarroel Ávila</p>
      </div>

      {/* Propósito */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-teal-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Propósito</h2>
        </div>
        <p className="text-slate-600 leading-relaxed font-medium">
          EscalaPro es una herramienta de apoyo clínico diseñada para centralizar las escalas 
          más relevantes con rigor científico. El objetivo es facilitar la toma de decisiones 
          precisas en entornos hospitalarios, de rehabilitación y emergencias.
        </p>
      </section>

      {/* Disclaimer Section */}
      <section className="bg-white rounded-[2.5rem] shadow-xl shadow-red-900/5 border-2 border-red-50 overflow-hidden">
        <div className="bg-red-50/50 p-6 border-b border-red-50 flex items-center gap-2">
          <ShieldAlert className="text-red-600" size={26} />
          <h2 className="text-xl font-black text-red-900 uppercase tracking-tight">
            Descargo de Responsabilidad
          </h2>
        </div>
        
        <div className="p-8 space-y-8">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
            Efectivo: 15 de Marzo, 2026
          </p>

          <div>
            <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded">1</span>
              En Lenguaje Claro
            </h3>
            <div className="text-slate-700 leading-relaxed italic bg-slate-50 p-5 rounded-2xl border-l-4 border-slate-300 shadow-inner">
              Las herramientas de <span className="font-bold text-slate-900">EscalaPro</span> son para uso exclusivo de 
              profesionales de la salud capacitados. <span className="font-bold text-teal-600 uppercase">No reemplazan tu juicio clínico.</span> 
              Como profesional, debes verificar siempre tu trabajo. Si crees que un paciente necesita una intervención, 
              hazlo por encima de cualquier puntaje. El desarrollador no se hace responsable legal, financiera ni 
              médicamente por las decisiones tomadas usando esta aplicación.
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded">2</span>
              Aviso Legal Oficial
            </h3>
            <div className="text-sm text-slate-500 space-y-4 font-medium">
              <p>
                <span className="text-slate-900 font-bold underline decoration-teal-500/30">Uso Profesional:</span> Los Servicios proporcionados por EscalaPro son guías para informar el juicio clínico. No están certificados como dispositivos médicos ni destinados a laypersons (pacientes).
              </p>
              <p>
                <span className="text-slate-900 font-bold underline decoration-teal-500/30">Sin Garantías:</span> Aunque la información proviene de fuentes confiables, no se garantiza que los resultados sean infalibles. Usted renuncia a cualquier reclamo contra el desarrollador por la confianza depositada en este contenido.
              </p>
              <p>
                <span className="text-slate-900 font-bold underline decoration-teal-500/30">Limitación de Daños:</span> El desarrollador no asume responsabilidad por lesiones o daños (incluyendo muerte) derivados del uso de cualquier idea o contenido recibido a través de la aplicación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 space-y-4 border-t border-slate-100">
        <div className="flex justify-center items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-tighter">
          <Heart size={14} className="text-red-400 fill-red-400" />
          <span>Hecho en Bulnes, Chile</span>
        </div>
        <div className="flex justify-center items-center gap-1 text-[10px] text-slate-300 font-medium">
          <Copyright size={10} />
          <span>{currentYear} EscalaPro - Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
};

export default About;