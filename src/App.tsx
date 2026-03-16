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
import { 
  ArrowLeft, ClipboardList, UserMinus, Heart, 
  Menu, ChevronRight, Activity, ShieldCheck,
  UserPlus // Importamos UserPlus para el nuevo botón
} from 'lucide-react';

// --- INTERFACES ---
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
  // --- ESTADOS ---
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

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('escalapro_favs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('escalapro_paciente', JSON.stringify(pacienteActivo));
    localStorage.setItem('escalapro_resultados', JSON.stringify(listaResultados));
    localStorage.setItem('escalapro_favs', JSON.stringify(favorites));
  }, [pacienteActivo, listaResultados, favorites]);

  // --- LÓGICA ---
  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const finalizaSesionTotal = () => {
    if(confirm("¿Finalizar evaluación? Se borrarán los datos temporales.")) {
      setPacienteActivo(null);
      setListaResultados([]);
      setViewingReport(false);
      setActiveScale(null);
      localStorage.clear();
    }
  };

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
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => { 
            setSelectedCategory(id); 
            setShowAbout(false); 
            setViewingReport(false); 
            setActiveScale(null); 
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-sm relative custom-scrollbar">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 min-h-full flex flex-col">
            
            {/* VISTA: TÉRMINOS Y CONDICIONES */}
            {showAbout ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <button 
                  onClick={() => setShowAbout(false)} 
                  className="group flex items-center gap-3 text-slate-400 font-bold mb-12 hover:text-teal-600 transition-all"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={18} /></div>
                  <span>Volver a Todas las Escalas</span>
                </button>
                <About />
              </div>
            ) : 

            /* VISTA: REPORTE RESUMEN */
            viewingReport && pacienteActivo ? (
              <ReportSummary 
                paciente={pacienteActivo} 
                resultados={listaResultados} 
                onBack={() => setViewingReport(false)}
                onRemoveScale={(index) => setListaResultados(prev => prev.filter((_, i) => i !== index))}
                onFinalize={finalizaSesionTotal}
              />
            ) : 

            /* VISTA: FORMULARIO DE ESCALA */
            activeScale && selectedScale ? (
              <div className="animate-in slide-in-from-right-8 duration-500">
                <button 
                  onClick={() => setActiveScale(null)} 
                  className="group flex items-center gap-3 text-slate-400 font-bold mb-8 hover:text-teal-600 transition-all"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={18} /></div>
                  <span>Regresar</span>
                </button>
                <ScaleForm 
                  scale={selectedScale} 
                  onBack={() => setActiveScale(null)}
                  onSave={(n) => { 
                    setListaResultados(p => [...p, n]); 
                    setActiveScale(null); 
                  }} 
                  pacienteNombre={pacienteActivo?.nombre} 
                />
              </div>
            ) : (

              /* VISTA: DASHBOARD PRINCIPAL */
              <div className="animate-in fade-in duration-700 flex-grow">
                
                {/* Banner Paciente Activo */}
                {pacienteActivo ? (
                  <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row justify-between items-center shadow-2xl">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
                        <ClipboardList size={30} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] mb-1 leading-none">Evaluación Activa</p>
                        <h2 className="text-3xl font-black italic tracking-tighter">{pacienteActivo.nombre}</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic opacity-70">
                          {listaResultados.length} escalas listas para reporte
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={finalizaSesionTotal} 
                      className="mt-6 md:mt-0 bg-white/10 hover:bg-red-500 text-white px-8 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/10"
                    >
                      Finalizar Informe
                    </button>
                  </div>
                ) : (
                  /* NUEVO: Llamado a la acción para iniciar sesión de paciente (Modo Libre por defecto) */
                  <div className="mb-12">
                    <button 
                      onClick={() => setShowPatientModal(true)}
                      className="group flex items-center gap-6 bg-white border-2 border-dashed border-slate-200 p-6 rounded-[2.5rem] w-full hover:border-teal-500 hover:bg-teal-50/30 transition-all text-left"
                    >
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                        <UserPlus size={24} className="text-slate-400 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 text-lg">¿Deseas generar un informe?</h4>
                        <p className="text-slate-500 text-sm font-medium leading-tight">Inicia una sesión de paciente para vincular múltiples escalas en un solo PDF.</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-widest">
                        Registrar paciente <ChevronRight size={16} />
                      </div>
                    </button>
                  </div>
                )}

                {/* Títulos y Buscador */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-tight">
                      {selectedCategory ? currentCategory?.nombre : 'Todas las Escalas'}
                    </h3>
                    <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">
                      {filteredScales.length} Herramientas Disponibles
                    </p>
                  </div>
                  <div className="w-full md:w-[450px]">
                    <SearchBar value={query} onChange={setQuery} />
                  </div>
                </div>

                {/* Grid de Escalas (CORREGIDO: onClick entra directo) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-20">
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

            {/* Pie de Página */}
            <footer className="py-12 border-t border-slate-200/50 mt-auto flex flex-col items-center gap-8">
               <button 
                  onClick={() => setShowAbout(true)} 
                  className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-500 px-8 py-4 rounded-2xl transition-all shadow-sm border border-slate-200"
               >
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Términos y Responsabilidad</span>
               </button>
               <div className="text-center opacity-30 grayscale pointer-events-none">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">EscalaPro — Bulnes, Chile — 2026</p>
               </div>
            </footer>
          </div>
        </main>
      </div>

      {/* --- ELEMENTOS FLOTANTES / FIJOS --- */}

      {/* 1. Botón Informe Flotante */}
      {pacienteActivo && listaResultados.length > 0 && !activeScale && !viewingReport && !showAbout && (
        <div className="fixed bottom-24 right-6 z-[40] animate-in slide-in-from-bottom-4">
          <button 
            onClick={() => setViewingReport(true)} 
            className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border border-teal-500/30 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <ClipboardList className="text-white" size={20} />
            </div>
            <div className="text-left pr-2">
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest leading-none">Ver Informe</p>
              <p className="text-sm font-bold text-white leading-none mt-1">{listaResultados.length} escalas listas</p>
            </div>
          </button>
        </div>
      )}

      {/* 2. Botón Menú Hamburguesa (FIJO) */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[50] bg-slate-900 text-white p-5 rounded-2xl shadow-2xl active:scale-95 border border-white/20 transition-all"
      >
        <Menu size={24} />
      </button>

      {/* 3. Modal Nuevo Paciente */}
      {showPatientModal && (
        <PatientModal 
          onConfirm={(data) => { 
            setPacienteActivo(data); 
            setShowPatientModal(false); 
          }} 
          onClose={() => setShowPatientModal(false)} 
        />
      )}
    </div>
  );
}