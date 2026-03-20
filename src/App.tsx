import { useState, useMemo, useEffect } from 'react';
import { categories, scales, categoryIcons } from './data/scalesData';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ScaleCard from './components/ScaleCard';
import ScaleForm from './components/ScaleForm';
import About from './pages/About';
import Sidebar from './components/Sidebar'; 
import PatientModal from './components/PatientModal';
import ReportSummary from './components/ReportSummary';
import DisclaimerModal from './components/DisclaimerModal';
import CategoryPills from './components/CategoryPills'; 

// ✅ MEJORA FASE 1: Importamos el motor de seguridad
import { Security } from './utils/security';

import { 
  ArrowLeft, ClipboardList, Menu, ChevronRight, Search, UserPlus, Activity, ShieldCheck, FileText
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

  // --- PERSISTENCIA CIFRADA CON BLINDAJE ANTI-CRASH (MEJORA FASE 1) ---
  const [pacienteActivo, setPacienteActivo] = useState<Paciente | null>(() => {
    try {
      const saved = localStorage.getItem('escalapro_paciente');
      // Si no hay datos o el descifrado falla, devolvemos null de forma segura
      return saved ? Security.decrypt(saved) : null;
    } catch (error) {
      console.error("Error al recuperar paciente:", error);
      return null;
    }
  });

  const [listaResultados, setListaResultados] = useState<ResultadoSesion[]>(() => {
    try {
      const saved = localStorage.getItem('escalapro_resultados');
      if (!saved) return [];
      
      const decrypted = Security.decrypt(saved);
      // ✅ CRÍTICO: Validamos que sea un Array. Si no lo es (ej: dato viejo), devolvemos []
      // Esto evita el error "Cannot read properties of null (reading 'length')"
      return Array.isArray(decrypted) ? decrypted : [];
    } catch (error) {
      console.error("Error al recuperar resultados:", error);
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('escalapro_favs');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // ✅ Guardado seguro: Solo ciframos si hay datos reales
    if (pacienteActivo) {
      localStorage.setItem('escalapro_paciente', Security.encrypt(pacienteActivo));
    } else {
      localStorage.removeItem('escalapro_paciente');
    }

    if (listaResultados && listaResultados.length > 0) {
      localStorage.setItem('escalapro_resultados', Security.encrypt(listaResultados));
    } else {
      localStorage.removeItem('escalapro_resultados');
    }
    
    localStorage.setItem('escalapro_favs', JSON.stringify(favorites));
  }, [pacienteActivo, listaResultados, favorites]);

  // --- LÓGICA ---
  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const finalizaSesionTotal = () => {
    if(confirm("¿Finalizar evaluación? Se borrarán todos los datos del paciente de forma segura.")) {
      setPacienteActivo(null);
      setListaResultados([]);
      setViewingReport(false);
      setActiveScale(null);
      localStorage.removeItem('escalapro_paciente');
      localStorage.removeItem('escalapro_resultados');
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
      
      <DisclaimerModal />

      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => { 
            setSelectedCategory(id); 
            setShowAbout(false); 
            setViewingReport(false); 
            setActiveScale(null); 
            setQuery('');
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-sm relative custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 lg:px-12 py-4 lg:py-10 min-h-full flex flex-col">
            
            {showAbout ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <button onClick={() => setShowAbout(false)} className="group flex items-center gap-3 text-slate-400 font-bold mb-12 hover:text-teal-600 transition-all">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={18} /></div>
                  <span>Volver al Inicio</span>
                </button>
                <About />
              </div>
            ) : 

            viewingReport && pacienteActivo ? (
              <ReportSummary 
                paciente={pacienteActivo} 
                resultados={listaResultados} 
                onBack={() => setViewingReport(false)}
                onRemoveScale={(index) => setListaResultados(prev => prev.filter((_, i) => i !== index))}
                onFinalize={finalizaSesionTotal}
              />
            ) : 

            activeScale && selectedScale ? (
              <div className="animate-in slide-in-from-right-8 duration-500">
                <button onClick={() => setActiveScale(null)} className="group flex items-center gap-3 text-slate-400 font-bold mb-8 hover:text-teal-600 transition-all">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={18} /></div>
                  <span>Regresar</span>
                </button>
                <ScaleForm 
                  scale={selectedScale} 
                  onBack={() => setActiveScale(null)}
                  onSave={(n) => { setListaResultados(p => [...p, n]); setActiveScale(null); }} 
                  pacienteNombre={pacienteActivo?.nombre} 
                />
              </div>
            ) : (

              <div className="animate-in fade-in duration-700 flex-grow">
                
                {pacienteActivo ? (
                  <div className="bg-slate-900 text-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] mb-6 lg:mb-12 flex flex-col md:flex-row justify-between items-center shadow-2xl border border-white/5">
                    <div className="flex items-center gap-4 lg:gap-6 text-center md:text-left">
                      <div className="hidden sm:flex w-16 h-16 bg-teal-500/10 rounded-[2rem] items-center justify-center border border-teal-500/20 shadow-inner">
                        <Activity size={30} className="text-teal-400 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-[9px] lg:text-[10px] font-black uppercase text-teal-400 tracking-[0.2em] mb-1 leading-none">Protocolo Activo</p>
                        <h2 className="text-2xl lg:text-3xl font-black italic tracking-tighter">{pacienteActivo.nombre}</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic opacity-70">
                          {/* ✅ Acceso seguro a .length */}
                          {(listaResultados?.length || 0)} escalas vinculadas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                      {(listaResultados?.length || 0) > 0 && (
                        <button 
                          onClick={() => setViewingReport(true)} 
                          className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-teal-900/40"
                        >
                          <FileText size={16} />
                          Generar Informe
                        </button>
                      )}
                      <button 
                        onClick={finalizaSesionTotal} 
                        className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 px-6 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/10 active:scale-95"
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 lg:mb-12">
                    <button onClick={() => setShowPatientModal(true)} className="group flex items-center gap-4 lg:gap-6 bg-white border-2 border-dashed border-slate-200 p-4 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] w-full hover:border-teal-500 hover:bg-teal-50/30 transition-all text-left shadow-sm">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:bg-teal-500 group-hover:shadow-lg group-hover:shadow-teal-200 transition-all">
                        <UserPlus size={20} className="text-slate-400 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 text-base lg:text-lg">Nueva Evaluación Clínica</h4>
                        <p className="text-slate-500 text-[11px] lg:text-sm font-medium leading-tight">Identifica al paciente para consolidar sus resultados.</p>
                      </div>
                    </button>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-8 mb-4">
                  <div className="space-y-1">
                    <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter italic leading-tight uppercase">
                      {selectedCategory ? currentCategory?.nombre : query ? 'Búsqueda' : 'Catálogo'}
                    </h3>
                  </div>
                  <div className="w-full md:w-[450px]">
                    <SearchBar value={query} onChange={(v) => { setQuery(v); if(v && selectedCategory) setSelectedCategory(null); }} />
                  </div>
                </div>

                <CategoryPills 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={(id) => {
                    setSelectedCategory(id);
                    setQuery('');
                    setActiveScale(null);
                  }} 
                />

                <div className="mb-6 lg:mb-12 border-l-4 border-teal-500 pl-4">
                   <p className="text-slate-400 font-black uppercase text-[9px] lg:text-[11px] tracking-[0.3em]">
                      {selectedCategory || query ? `${filteredScales.length} opciones disponibles` : 'Filtrar por especialidad'}
                    </p>
                </div>

                {!selectedCategory && !query ? (
                  <>
                    <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      {categories.map((cat) => {
                        const IconComponent = categoryIcons[cat.id] || ClipboardList;
                        return (
                          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="group p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-1 transition-all duration-300 text-left flex items-center gap-5">
                            <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner">
                              <IconComponent size={32} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-1 leading-tight">{cat.nombre}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight line-clamp-2 opacity-60">{cat.descripcion}</p>
                            </div>
                            <ChevronRight size={20} className="text-slate-200 group-hover:text-teal-600 transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="lg:hidden flex flex-col items-center justify-center py-16 opacity-30">
                      <ShieldCheck size={48} className="text-slate-300 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selecciona un área de trabajo</p>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10 pb-20 animate-in fade-in duration-500">
                    {filteredScales.length > 0 ? (
                      filteredScales.map(s => (
                        <ScaleCard 
                          key={s.id} 
                          scale={s} 
                          isFavorite={favorites.includes(s.id)} 
                          onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(s.id); }} 
                          onClick={() => setActiveScale(s.id)} 
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <Search size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm">Sin resultados para esta búsqueda</p>
                        <button onClick={() => {setQuery(''); setSelectedCategory(null);}} className="mt-4 text-teal-600 font-bold text-xs uppercase tracking-widest hover:underline">Ver todo el catálogo</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <footer className="py-12 border-t border-slate-100 mt-auto flex flex-col items-center gap-6">
               <button onClick={() => setShowAbout(true)} className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-500 px-6 py-3 rounded-xl transition-all shadow-sm border border-slate-200 active:scale-95">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Información Legal & Privacidad</span>
               </button>
               <div className="text-center opacity-20 select-none">
                 <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-900">EscalaPro — Digital Clinical Intelligence</p>
               </div>
            </footer>
          </div>
        </main>
      </div>

      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden fixed bottom-8 right-8 z-[50] bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-white/10 active:scale-95 transition-all">
        <Menu size={24} />
      </button>

      {showPatientModal && (
        <PatientModal onConfirm={(data) => { setPacienteActivo(data); setShowPatientModal(false); }} onClose={() => setShowPatientModal(false)} />
      )}
    </div>
  );
}