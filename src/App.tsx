import { useState, useMemo, useEffect } from 'react';
import { categories, scales } from './data/scalesData';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ScaleCard from './components/ScaleCard';
import ScaleForm from './components/ScaleForm';
import PatientModal from './components/PatientModal';
import ReportSummary from './components/ReportSummary';
import { 
  Accessibility, Stethoscope, Siren, MessageSquare, 
  Brain, HandHelping, ArrowLeft, ChevronRight, Star,
  Apple, Zap, Smile, UserPlus, ClipboardList, UserMinus,
  Heart 
} from 'lucide-react';

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

const getCategoryIcon = (id: string) => {
  const props = { className: "w-10 h-10 mb-4 transition-transform group-hover:scale-110 duration-300" };
  switch (id) {
    case 'kinesiologia': return <Accessibility {...props} className={props.className + " text-blue-600"} />;
    case 'enfermeria': return <Stethoscope {...props} className={props.className + " text-rose-600"} />;
    case 'emergencias': return <Siren {...props} className={props.className + " text-red-600"} />;
    case 'fonoaudiologia': return <MessageSquare {...props} className={props.className + " text-orange-600"} />;
    case 'cognitivas': return <Brain {...props} className={props.className + " text-purple-600"} />;
    case 'terapia_ocupacional': return <HandHelping {...props} className={props.className + " text-emerald-600"} />;
    case 'psicologia': return <Smile {...props} className={props.className + " text-pink-500"} />;
    case 'nutricion': return <Apple {...props} className={props.className + " text-orange-500"} />;
    case 'neurologia': return <Zap {...props} className={props.className + " text-indigo-600"} />;
    default: return <Accessibility {...props} className={props.className + " text-gray-400"} />;
  }
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeScale, setActiveScale] = useState<string | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [viewingReport, setViewingReport] = useState(false);

  // --- PERSISTENCIA DE SESIÓN (OPCIÓN 3) ---
  const [pacienteActivo, setPacienteActivo] = useState<Paciente | null>(() => {
    const saved = sessionStorage.getItem('escalapro_paciente');
    return saved ? JSON.parse(saved) : null;
  });

  const [listaResultados, setListaResultados] = useState<ResultadoSesion[]>(() => {
    const saved = sessionStorage.getItem('escalapro_resultados');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardado automático en SessionStorage
  useEffect(() => {
    sessionStorage.setItem('escalapro_paciente', JSON.stringify(pacienteActivo));
    sessionStorage.setItem('escalapro_resultados', JSON.stringify(listaResultados));
  }, [pacienteActivo, listaResultados]);

  // Favoritos (LocalStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('escalapro_favs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('escalapro_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
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

  if (viewingReport && pacienteActivo) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <ReportSummary 
          paciente={pacienteActivo}
          resultados={listaResultados}
          onBack={() => setViewingReport(false)}
          onRemoveScale={(index) => setListaResultados(prev => prev.filter((_, i) => i !== index))}
          onFinalize={() => { 
            setPacienteActivo(null); 
            setListaResultados([]); 
            setViewingReport(false);
            sessionStorage.clear(); // Limpiamos al finalizar
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        {/* INDICADOR DE PACIENTE ACTIVO */}
        {pacienteActivo && (
          <div className="bg-teal-600 text-white p-6 rounded-[2rem] mb-8 flex flex-col md:flex-row justify-between items-center shadow-xl animate-in fade-in slide-in-from-top-6 duration-500">
            <div className="flex items-center gap-5 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-2xl"><ClipboardList className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-black uppercase opacity-70 tracking-tighter">Informe en curso para:</p>
                <h2 className="text-xl font-black leading-none mb-1">{pacienteActivo.nombre}</h2>
                <div className="flex gap-3 text-xs font-bold opacity-80">
                   <span>RUT: {pacienteActivo.rut}</span>
                   <span>Edad: {pacienteActivo.edad} años</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase opacity-70">Escalas</p>
                <p className="text-2xl font-black leading-none">{listaResultados.length}</p>
              </div>
              <button 
                onClick={() => { 
                  if(confirm("¿Deseas finalizar la sesión?")) { 
                    setPacienteActivo(null); 
                    setListaResultados([]); 
                    sessionStorage.clear();
                  } 
                }}
                className="bg-red-500/20 hover:bg-red-500 text-white p-3 rounded-xl transition-all flex items-center gap-2 font-bold text-sm"
              >
                <UserMinus className="w-5 h-5" /> Finalizar
              </button>
            </div>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        {activeScale && selectedScale ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setActiveScale(null)} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-teal-600 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Volver al listado
            </button>
            <ScaleForm 
              scale={selectedScale} 
              onBack={() => setActiveScale(null)} 
              onSave={(nuevo) => { setListaResultados(p => [...p, nuevo]); setActiveScale(null); }}
              pacienteNombre={pacienteActivo?.nombre}
            />
          </div>
        ) : !selectedCategory ? (
          <div className="animate-in fade-in zoom-in duration-500 pt-4">
            {!pacienteActivo && (
              <button 
                onClick={() => setShowPatientModal(true)} 
                className="w-full mb-12 bg-white border-4 border-dashed border-teal-100 p-12 rounded-[3.5rem] flex flex-col items-center justify-center group hover:border-teal-500 active:scale-[0.98] transition-all duration-500"
              >
                <div className="bg-teal-50 p-5 rounded-3xl mb-4 group-hover:bg-teal-500 group-hover:text-white transition-all"><UserPlus className="w-10 h-10 text-teal-600 group-hover:text-white" /></div>
                <h3 className="text-2xl font-black text-gray-900">Nueva Evaluación de Paciente</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2 text-center">Identifica al paciente para generar un informe consolidado</p>
              </button>
            )}

            {/* SECCIÓN FAVORITOS */}
            {favoriteScales.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6"><Star className="w-6 h-6 text-amber-500 fill-amber-500" /><h3 className="text-2xl font-black text-gray-900">Tus Favoritos</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteScales.map(s => <ScaleCard key={s.id} scale={s} isFavorite={true} onToggleFavorite={() => toggleFavorite(s.id)} onClick={() => setActiveScale(s.id)} />)}
                </div>
                <hr className="mt-12 border-gray-100" />
              </div>
            )}

            <div className="mb-10"><h3 className="text-2xl font-black text-gray-900 mb-2">Especialidades</h3><p className="text-gray-500 font-medium text-lg">Selecciona una categoría para explorar.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
              {categories.map(category => (
                <button 
                  key={category.id} 
                  onClick={() => setSelectedCategory(category.id)} 
                  className="group bg-white p-10 rounded-[3rem] border-2 border-transparent hover:border-teal-500 hover:shadow-2xl active:scale-95 active:shadow-inner transition-all duration-300 text-left flex flex-col items-start relative overflow-hidden"
                >
                  {getCategoryIcon(category.id)}
                  <h4 className="text-2xl font-black text-gray-900 mb-1">{category.nombre}</h4>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{scales.filter(s => s.categoria === category.id).length} Escalas</p>
                  <div className="absolute right-8 bottom-8 bg-gray-50 p-3 rounded-full group-hover:bg-teal-500 group-hover:text-white transition-all"><ChevronRight className="w-6 h-6" /></div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <button onClick={() => {setSelectedCategory(null); setQuery('');}} className="flex items-center gap-2 text-teal-600 font-bold mb-3 hover:bg-teal-50 px-3 py-1 rounded-lg w-fit transition-all"><ArrowLeft className="w-4 h-4" /> Volver al Panel</button>
                <h3 className="text-4xl font-black text-gray-900">{currentCategory?.nombre}</h3>
              </div>
              <div className="w-full md:w-96"><SearchBar query={query} setQuery={setQuery} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredScales.map(s => <ScaleCard key={s.id} scale={s} isFavorite={favorites.includes(s.id)} onToggleFavorite={() => toggleFavorite(s.id)} onClick={() => setActiveScale(s.id)} />)}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 pb-10 border-t border-gray-100 pt-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-teal-500 fill-teal-500" />
          <p className="text-gray-900 font-black text-sm uppercase tracking-tighter">EscalaPro</p>
        </div>
        <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-1">Soporte Clínico con Base en Evidencia</p>
        <p className="text-gray-300 text-[10px] font-medium">© 2026 — Desarrollado por Klgo. Maximiliano Villarroel Ávila</p>
      </footer>

      {/* BOTÓN FLOTANTE */}
      {pacienteActivo && listaResultados.length > 0 && !activeScale && !viewingReport && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
          <button 
            onClick={() => setViewingReport(true)} 
            className="w-full bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl flex items-center justify-between hover:bg-black active:scale-95 transition-all border-2 border-teal-500 animate-bounce-short"
          >
            <div className="flex items-center gap-3"><ClipboardList className="text-teal-400 w-6 h-6" /><span className="font-black text-xs uppercase tracking-widest">Ver Informe</span></div>
            <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-sm">{listaResultados.length}</span>
          </button>
        </div>
      )}

      {showPatientModal && (
        <PatientModal onConfirm={(data) => { setPacienteActivo(data); setShowPatientModal(false); }} onClose={() => setShowPatientModal(false)} />
      )}
    </div>
  );
}