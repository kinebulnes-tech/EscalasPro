import React from 'react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Ícono clínico (Cruz/Latido) */}
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">EscalaPro</h1>
        </div>
        <p className="text-sm font-medium opacity-90 hidden sm:block">
          Herramientas Clínicas
        </p>
      </div>
    </header>
  );
}
