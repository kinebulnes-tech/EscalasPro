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
import DisclaimerModal from './components/DisclaimerModal';
import CategoryPills from './components/CategoryPills'; 
import TrendChart from './components/TrendChart';

// ✅ NUEVO COMPONENTE
import RecentPatients from './components/RecentPatients';

// ✅ Integración de DB y Seguridad
import { db } from './utils/db';
import { Security } from './utils/security';

import { 
  ArrowLeft, Menu, Search, UserPlus, Activity, ShieldCheck, FileText, Star
} from 'lucide-react';

// --- INTERFACES ---
interface Paciente {
  nombre: string;
  id: string;      
  country: string; 
  edad: string;
  diagnostico: string;
  peso?: string;
  talla?: string;
  imc?: string;
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
  
  // ✅ ESTADO PARA PACIENTES RECIENTES
  const [recientes, setRecientes] = useState<any[]>([]);

  const [pacienteActivo, setPacienteActivo] = useState<Paciente | null>(() => {
    const saved = localStorage.getItem('escalapro_paciente');
    return saved ? Security.decrypt(saved) : null;
  });

  const [listaResultados, setListaResultados] = useState<ResultadoSesion[]>(() => {
    const saved = localStorage.getItem('escalapro_resultados');
    if (!saved) return [];
    const decrypted = Security.decrypt(saved);
    return Array.isArray(decrypted) ? decrypted : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('escalapro_favs');
    try { return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  // --- EFECTO INICIAL: CARGAR RECIENTES ---
  useEffect(() => {
    const cargarRecientes = async () => {
      const data = await db.getPacientesRecientes();
      setRecientes(data);
    };
    cargarRecientes();
  }, [pacienteActivo]); // Se recarga cuando cambia el paciente activo

  // --- PERSISTENCIA ---
  useEffect(() => {
    if (pacienteActivo) {
      localStorage.setItem('escalapro_paciente', Security.encrypt(pacienteActivo));
    } else {
      localStorage.removeItem('escalapro_paciente');
    }
    if (listaResultados.length > 0) {
      localStorage.setItem('escalapro_resultados', Security.encrypt(listaResultados));
    } else {
      localStorage.removeItem('escalapro_resultados');
    }
    localStorage.setItem('escalapro_favs', JSON.stringify(favorites));
  }, [pacienteActivo, listaResultados, favorites]);

  // --- LÓGICA DE NEGOCIO ---
  const handlePacienteIdentificado = async (data: Paciente) => {
    try {
      const historialExistente = await db.getHistorial(data.id);
      if (historialExistente && historialExistente.length > 0) {
        setPacienteActivo(data);
        setListaResultados(historialExistente as any);
        setShowPatientModal(false);
        return;
      }
      await db.upsertPaciente(data);
      setPacienteActivo(data);
      setListaResultados([]);
      setShowPatientModal(false);
    } catch (e) { alert("Error al acceder a la base de datos."); }
  };

  const finalizaSesionTotal = () => {
    if(confirm("¿Finalizar evaluación? Se borrarán los datos de la sesión actual.")) {
      setPacienteActivo(null);
      setListaResultados([]);
      setViewingReport(false);
      setActiveScale(null);
      localStorage.removeItem('escalapro_paciente');
      localStorage.removeItem('escalapro_resultados');
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // --- FILTRADO ---
  const { favoriteScales, otherScales } = useMemo(() => {
    const filtered = scales.filter(scale => {
      const matchesCategory = !selectedCategory || scale.categoria === selectedCategory;
      const matchesSearch = scale.nombre.toLowerCase().includes(query.toLowerCase()) || 
                           scale.descripcion.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    return {
      favoriteScales: filtered.filter(s => favorites.includes(s.id)),
      otherScales: filtered.filter(s => !favorites.includes(s.id))
    };
  }, [selectedCategory, query, favorites]);

  const groupedTrends = useMemo(() => {
    if (!listaResultados || listaResultados.length === 0) return [];
    const groups: Record<string, any[]> = {};
    listaResultados.forEach(res => {
      if (!groups[res.nombreEscala]) groups[res.nombreEscala] = [];
      groups[res.nombreEscala].push(res);
    });
    return Object.entries(groups).filter(([_, items]) => items.length >= 2).map(([nombre, items]) => ({ nombre, items }));
  }, [listaResultados]);

  const selectedScale = scales.find(s => s.id === activeScale);
  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-900">
      <DisclaimerModal />
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => { setSelectedCategory(id); setShowAbout(false); setViewingReport(false); setActiveScale(null); setQuery(''); }}
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
                  onSave={async (n) => { 
                    const res = { ...n, fecha: new Date().toISOString() };
                    setListaResultados(p => [...p, res]); 
                    setActiveScale(null); 
                    if(pacienteActivo) await db.guardarEvaluacion(pacienteActivo.id, selectedScale.id, res);
                  }} 
                  pacienteNombre={pacienteActivo?.nombre} 
                />
              </div>
            ) : (

              <div className="animate-in fade-in duration-700 flex-grow">
                
                {pacienteActivo ? (
                  <div className="space-y-6 mb-12">
                    <div className="bg-slate-900 text-white p-6 lg:p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center shadow-2xl border border-white/5">
                      <div className="flex items-center gap-4 lg:gap-6 text-center md:text-left">
                        <div className="hidden sm:flex w-16 h-16 bg-teal-500/10 rounded-[2rem] items-center justify-center border border-teal-500/20 shadow-inner">
                          <Activity size={30} className="text-teal-400 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-teal-400 tracking-[0.2em] mb-1 leading-none">Protocolo Activo</p>
                          <h2 className="text-2xl lg:text-3xl font-black italic tracking-tighter">{pacienteActivo.nombre}</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic opacity-70">
                            {listaResultados.length} escalas registradas
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                        {listaResultados.length > 0 && (
                          <button onClick={() => setViewingReport(true)} className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40">
                            <FileText size={16} /> Generar Informe
                          </button>
                        )}
                        <button onClick={finalizaSesionTotal} className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 px-6 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/10">
                          Finalizar
                        </button>
                      </div>
                    </div>

                    {groupedTrends.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        {groupedTrends.map((trend, idx) => (
                          <TrendChart key={idx} data={trend.items} titulo={trend.nombre} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-6 lg:mb-12 space-y-6">
                    {/* BOTÓN NUEVO PACIENTE */}
                    <button onClick={() => setShowPatientModal(true)} className="group flex items-center gap-4 lg:gap-6 bg-white border-2 border-dashed border-slate-200 p-4 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] w-full hover:border-teal-500 hover:bg-teal-50/30 transition-all text-left shadow-sm">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:bg-teal-500 transition-all">
                        <UserPlus size={20} className="text-slate-400 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 text-base lg:text-lg">Nueva Evaluación Clínica</h4>
                        <p className="text-slate-500 text-[11px] lg:text-sm font-medium leading-tight">Inicia un protocolo desde cero.</p>
                      </div>
                    </button>

                    {/* ✅ SECCIÓN DE PACIENTES RECIENTES */}
                    {!query && (
                      <RecentPatients 
                        patients={recientes} 
                        onSelect={(p) => handlePacienteIdentificado(p)} 
                      />
                    )}
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-8 mb-4">
                  <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
                    {selectedCategory ? currentCategory?.nombre : query ? 'Búsqueda' : 'Catálogo'}
                  </h3>
                  <div className="w-full md:w-[450px]">
                    <SearchBar value={query} onChange={(v) => { setQuery(v); if(v && selectedCategory) setSelectedCategory(null); }} />
                  </div>
                </div>

                <CategoryPills selectedCategory={selectedCategory} onSelectCategory={(id) => { setSelectedCategory(id); setQuery(''); setActiveScale(null); }} />

                <div className="space-y-12 pb-24">
                  {favoriteScales.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-6 text-amber-500">
                        <Star size={20} fill="currentColor" />
                        <h4 className="font-black uppercase tracking-widest text-xs">Escalas Frecuentes</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteScales.map(s => (
                          <ScaleCard key={s.id} scale={s} isFavorite={true} onToggleFavorite={() => toggleFavorite(s.id)} onClick={() => setActiveScale(s.id)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {otherScales.length > 0 ? (
                    <div>
                       {(selectedCategory || query) && favoriteScales.length > 0 && (
                         <h4 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-6">Otros Resultados</h4>
                       )}
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherScales.map(s => (
                          <ScaleCard key={s.id} scale={s} isFavorite={false} onToggleFavorite={() => toggleFavorite(s.id)} onClick={() => setActiveScale(s.id)} />
                        ))}
                      </div>
                    </div>
                  ) : favoriteScales.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                      <Search size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-400 font-black uppercase text-sm">Sin coincidencias</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <footer className="py-12 border-t border-slate-100 mt-auto flex flex-col items-center gap-6">
               <button onClick={() => setShowAbout(true)} className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-500 px-6 py-3 rounded-xl transition-all shadow-sm border border-slate-200 active:scale-95">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Información Legal & Privacidad</span>
               </button>
            </footer>
          </div>
        </main>
      </div>

      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden fixed bottom-8 right-8 z-[50] bg-slate-900 text-white p-5 rounded-2xl shadow-2xl active:scale-95 transition-all">
        <Menu size={24} />
      </button>

      {showPatientModal && (
        <PatientModal onConfirm={handlePacienteIdentificado} onClose={() => setShowPatientModal(false)} />
      )}
    </div>
  );
}