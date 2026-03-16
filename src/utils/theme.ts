// src/utils/theme.ts

export const CLINICAL_COLORS = {
  SUCCESS: 'emerald-600', // Verde: Estable / Normal
  INFO: 'blue-600',       // Azul: Seguimiento / Leve
  WARNING: 'amber-500',    // Amarillo/Naranja: Riesgo Moderado
  DANGER: 'red-600',      // Rojo: Riesgo Alto / Emergencia
  NEUTRAL: 'slate-500'    // Gris: Sin datos / No valorable
};

// Mapa para los gradientes del ScaleResult
export const CLINICAL_GRADIENTS = {
  emerald: 'from-emerald-600 to-teal-700',
  blue: 'from-blue-600 to-indigo-700',
  amber: 'from-amber-500 to-orange-600',
  red: 'from-red-600 to-rose-800 animate-pulse',
  slate: 'from-slate-700 to-slate-900'
};