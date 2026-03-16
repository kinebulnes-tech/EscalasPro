import { useState, useMemo, useEffect } from 'react';
import { categories, scales } from './data/scalesData';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ScaleCard from './components/ScaleCard';
import ScaleForm from './components/ScaleForm';
import About from './pages/About';
import Sidebar from './components/Sidebar'; 
import PatientModal from './components/PatientModal';
import ReportSummary from './components/ReportSummary';
import { ArrowLeft, ClipboardList, UserMinus, Heart, Menu, ChevronRight, Activity } from 'lucide-react';

// --- ESTRUCTURAS ---
interface Paciente {
  nombre: string;
  rut: string;
  edad: string;
  diagnostico: string;
}

interface ResultadoSesion {
  idEscala: string;
  nombreEscala: string;
  puntaje: number;
  interpretacion: string;
  color: string;
  recomendaciones: string[];
  fecha: string;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeScale, setActiveScale] = useState<string | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [viewingReport, setViewingReport] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- PERSISTENCIA ---
  const [pacienteActivo, setPacienteActivo] = useState<Paciente | null>(() => {
    const saved = localStorage.getItem('escalapro_paciente');
    return saved ? JSON.parse(saved) : null;
  });

  const [listaResultados, setListaResultados] = useState<ResultadoSesion[]>(() => {
    const saved = localStorage.getItem('escalapro_resultados');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('escalapro_paciente', JSON.stringify(pacienteActivo));
    localStorage.setItem('escalapro_resultados', JSON.stringify(listaResultados));
  }, [pacienteActivo, listaResultados]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('escalapro_favs');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const finalizaSesionTotal = () => {
    setPacienteActivo(null);
    setListaResultados([]);
    setViewingReport(false);
    localStorage.removeItem('escalapro_paciente');
    localStorage.removeItem('escalapro_resultados');
  };

  // --- FILTRADO ---
  const filteredScales = useMemo(() => {
    return scales.filter(scale => {
      const matchesCategory = !selectedCategory || scale.categoria === selectedCategory;
      const matchesSearch = scale.nombre.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, query]);

  const selectedScale = scales.find(s => s.id === activeScale);
  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-900">
      {/* HEADER PREMIUM */}
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR PREMIUM (Asegúrate de haber copiado el Sidebar Pro que te di antes) */}
        <Sidebar 
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            setShowAbout(false);
            setViewingReport(false);
            setActiveScale(null);
            setQuery('');
          }}
          onShowAbout={() => {
            setShowAbout(true);
            setViewingReport(false);
            setActiveScale(null);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* ÁREA DE CONTENIDO CON GLASSMORPHISM */}
        <main className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-sm relative z-0 custom-scrollbar">
          
          {/* Botón flotante móvil pro */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed bottom-8 right-8 z-40 bg-slate-900 text-white p-5 rounded-3xl shadow-2xl active:scale-95 transition-all border border-white/20"
          >
            <Menu size={24} />
          </button>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 min-h-full flex flex-col">
            
            {/* VISTA 1: ACERCA DE (MODERNO) */}
            {showAbout ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <button 
                  onClick={() => setShowAbout(false)} 
                  className="group flex items-center gap-3 text-slate-400 font-bold mb-12 hover:text-teal-600 transition-all"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
                    <ArrowLeft size={18} />
                  </div>
                  <span>Volver al Panel</span>
                </button>
                <About />
              </div>
            ) : 

            /* VISTA 2: INFORME (LIMPIO) */
            viewingReport && pacienteActivo ? (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <ReportSummary 
                  paciente={pacienteActivo} 
                  resultados={listaResultados} 
                  onBack={() => setViewingReport(false)}
                  onRemoveScale={(index) => setListaResultados(prev => prev.filter((_, i) => i !== index))}
                  onFinalize={finalizaSesionTotal}
                />
              </div>
            ) : 

            /* VISTA 3: FORMULARIO (ENFOCADO) */
            activeScale && selectedScale ? (
              <div className="animate-in slide-in-from-right-8 duration-500">
                <button onClick={() => setActiveScale(null)} className="group flex items-center gap-3 text-slate-400 font-bold mb-8 hover:text-teal-600 transition-all">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
                    <ArrowLeft size={18} />
                  </div>
                  <span>Regresar al listado</span>
                </button>
                <ScaleForm 
                  scale={selectedScale} 
                  onBack={() => setActiveScale(null)} 
                  onSave={(nuevo) => { setListaResultados(p => [...p, nuevo]); setActiveScale(null); }}
                  pacienteNombre={pacienteActivo?.nombre}
                />
              </div>
            ) : (

              /* VISTA 4: DASHBOARD PRO */
              <div className="animate-in fade-in duration-700 flex-grow">
                
                {/* Banner Paciente Estilo SaaS */}
                {pacienteActivo && (
                  <div className="relative overflow-hidden bg-slate-900 text-white p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-slate-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
                        <ClipboardList size={30} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] mb-1">Evaluación Activa</p>
                        <h2 className="text-3xl font-black italic tracking-tighter">{pacienteActivo.nombre}</h2>
                      </div>
                    </div>
                    <button 
                      onClick={() => { if(confirm("¿Deseas cerrar la sesión y borrar datos temporales?")) finalizaSesionTotal(); }}
                      className="relative mt-6 md:mt-0 bg-white/10 hover:bg-red-500 text-white px-8 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5"
                    >
                      <UserMinus size={16} className="inline mr-2" /> Finalizar
                    </button>
                  </div>
                )}

                {/* Cabecera Dashboard */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-20">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter italic">
                      {selectedCategory ? currentCategory?.nombre : 'Dashboard'}
                    </h3>
                    <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">
                      {filteredScales.length} Herramientas Clínicas Disponibles
                    </p>
                  </div>
                  <div className="w-full md:w-[450px] relative z-30">
                    <SearchBar value={query} onChange={setQuery} />
                  </div>
                </div>

                {/* Grid de Tarjetas Premium */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-32">
                  {filteredScales.map(s => (
                    <ScaleCard 
                      key={s.id} 
                      scale={s} 
                      isFavorite={favorites.includes(s.id)} 
                      onToggleFavorite={() => toggleFavorite(s.id)} 
                      onClick={() => setActiveScale(s.id)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Footer Estilizado */}
            <footer className="py-12 border-t border-slate-200/50 mt-auto flex flex-col items-center gap-4 opacity-40 grayscale hover:opacity-100 transition-opacity duration-700">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center rotate-12">
                    <Activity className="text-teal-400" size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-900">EscalaPro</span>
               </div>
               <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                 Bulnes, Chile — © 2026 KLGO. MAXIMILIANO VILLARROEL
               </p>
            </footer>
          </div>
        </main>
      </div>

      {/* BOTÓN INFORME FLOTANTE (ESTILO PREMIUM) */}
      {pacienteActivo && listaResultados.length > 0 && !activeScale && !viewingReport && !showAbout && (
        <div className="fixed bottom-12 left-1/2 lg:left-[calc(50%+160px)] -translate-x-1/2 z-50 w-full max-w-sm px-6">
          <button 
            onClick={() => setViewingReport(true)} 
            className="w-full bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between border border-teal-500/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50 group-hover:rotate-12 transition-transform">
                <ClipboardList className="text-white" size={24} />
              </div>
              <div className="text-left leading-tight">
                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Informe Médico</p>
                <p className="text-sm font-bold text-white">Ver {listaResultados.length} escalas guardadas</p>
              </div>
            </div>
            <ChevronRight className="text-teal-400 group-hover:translate-x-2 transition-transform" size={20} />
          </button>
        </div>
      )}

      {showPatientModal && (
        <PatientModal onConfirm={(data) => { setPacienteActivo(data); setShowPatientModal(false); }} onClose={() => setShowPatientModal(false)} />
      )}
    </div>
  );
}