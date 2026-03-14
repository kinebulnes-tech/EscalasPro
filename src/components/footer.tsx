export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 mt-auto border-t border-gray-100 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-400 font-medium">
          © {year} <span className="text-teal-600 font-bold">EscalaPro</span> — Desarrollado por 
          <span className="text-gray-600 font-bold"> Maximiliano Andrés Villarroel Ávila</span>
        </p>
        <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em] mt-2 font-black">
          Kinesiólogo · Herramientas Clínicas de Precisión
        </p>
      </div>
    </footer>
  );
}