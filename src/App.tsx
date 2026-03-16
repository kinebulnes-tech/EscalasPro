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
  ArrowLeft, Star, UserPlus, ClipboardList, UserMinus,
  Heart, Menu 
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeScale, setActiveScale] = useState<string | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [viewingReport, setViewingReport] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- PERSISTENCIA ---
  const [pacienteActivo, setPacienteActivo] = useState<any>(() => {
    const saved = localStorage.getItem('escalapro_paciente');
    return saved ? JSON.parse(saved) : null;
  });

  const [listaResultados, setListaResultados] = useState<any[]>(() => {
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

  useEffect(() => {
    localStorage.setItem('escalapro_favs', JSON.stringify(favorites));
  }, [favorites]);

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

  const filteredScales = useMemo(() => {
    return scales.filter(scale => {
      const matchesCategory = !selectedCategory || scale.categoria === selectedCategory;
      const matchesSearch = scale.nombre.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, query]);

  const favoriteScales = useMemo(() => scales.filter(s => favorites.includes(s.id)), [favorites]);
  const selectedScale = scales.find(s => s.id === activeScale);
  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* SIDEBAR IZQUIERDO */}
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

        {/* ÁREA DE CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto min-w-0">
          
          {/* Botón menú móvil */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-teal-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-all border-2 border-white"
          >
            <Menu size={24} />
          </button>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* VISTA DE INFORME */}
            {viewingReport && pacienteActivo ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ReportSummary 
                  paciente={pacienteActivo}
                  resultados={listaResultados}
                  onBack={() => setViewingReport(false)}
                  onRemoveScale={(index) => setListaResultados(prev => prev.filter((_, i) => i !== index))}
                  onFinalize={finalizaSesionTotal}
                />
              </div>
            ) : 

            /* VISTA ACERCA DE */
            showAbout ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => setShowAbout(false)} 
                  className="flex items-center gap-2 text-teal-600 font-bold mb-6 hover:bg-teal-50 px-4 py-2 rounded-2xl transition-all"
                >
                  <ArrowLeft size={20} /> Volver al Inicio
                </button>
                <About />
              </div>
            ) :

            /* VISTA FORMULARIO */
            activeScale && selectedScale ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button onClick={() => setActiveScale(null)} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-teal-600 transition-colors">
                  <ArrowLeft size={20} /> Volver al listado
                </button>
                <ScaleForm 
                  scale={selectedScale} 
                  onBack={() => setActiveScale(null)} 
                  onSave={(nuevo) => { setListaResultados(p => [...p, nuevo]); setActiveScale(null); }}
                  pacienteNombre={pacienteActivo?.nombre}
                />
              </div>
            ) : (

              /* DASHBOARD Y LISTADO */
              <div className="animate-in fade-in duration-500">
                
                {/* Banner Paciente Activo */}
                {pacienteActivo && (
                  <div className="bg-teal-600 text-white p-6 rounded-[2.5rem] mb-10 flex flex-col md:flex-row justify-between items-center shadow-xl border-b-4 border-teal-700">
                    <div className="flex items-center gap-5">
                      <div className="bg-white/20 p-4 rounded-2xl"><ClipboardList size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-70 tracking-[0.1em]">Evaluación en curso</p>
                        <h2 className="text-2xl font-black">{pacienteActivo.nombre}</h2>
                      </div>
                    </div>
                    <button 
                      onClick={() => { if(confirm("¿Finalizar sesión?")) finalizaSesionTotal(); }}
                      className="mt-4 md:mt-0 bg-white/10 hover:bg-red-500 text-white px-6 py-3 rounded-2xl transition-all font-black text-xs uppercase flex items-center gap-2"
                    >
                      <UserMinus size={18} /> Finalizar Sesión
                    </button>
                  </div>
                )}

                {/* Cabecera dinámica */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                      {selectedCategory ? currentCategory?.nombre : 'Dashboard'}
                    </h3>
                    <p className="text-slate-500 font-medium text-lg mt-1">
                      {selectedCategory ? `${filteredScales.length} escalas clínicas` : 'Selecciona una especialidad en el menú.'}
                    </p>
                  </div>
                  <div className="w-full md:w-96">
                    <SearchBar value={query} onChange={setQuery} />
                  </div>
                </div>

                {/* Grid de Escalas */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
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
          </div>

          <footer className="py-10 text-center border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 opacity-20 grayscale">
              <Heart size={14} className="text-teal-500 fill-teal-500" />
              <span className="text-xs font-black uppercase tracking-widest">EscalaPro v1.0.0</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Botón Informe Flotante */}
      {pacienteActivo && listaResultados.length > 0 && !activeScale && !viewingReport && !showAbout && (
        <div className="fixed bottom-10 left-1/2 lg:left-[calc(50%+144px)] -translate-x-1/2 z-50 w-full max-w-xs px-4">
          <button 
            onClick={() => setViewingReport(true)} 
            className="w-full bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl flex items-center justify-between border-2 border-teal-400 animate-bounce-short hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="text-teal-400" size={24} />
              <span className="font-black text-xs uppercase tracking-widest">Ver Informe</span>
            </div>
            <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-black">{listaResultados.length}</span>
          </button>
        </div>
      )}

      {showPatientModal && (
        <PatientModal onConfirm={(data) => { setPacienteActivo(data); setShowPatientModal(false); }} onClose={() => setShowPatientModal(false)} />
      )}
    </div>
  );
}