import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  // Al cargar, revisar si ya existía una preferencia guardada
  useEffect(() => {
    const savedMode = localStorage.getItem('escalapro_theme');
    if (savedMode === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('escalapro_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('escalapro_theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Ícono clínico */}
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">EscalaPro</h1>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm font-medium opacity-90 hidden sm:block">
            Herramientas Clínicas
          </p>
          
          {/* Botón Switch Modo Oscuro */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-90"
            aria-label="Cambiar tema"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}