/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // <--- Esta es la clave
  theme: {
    extend: {
      colors: {
        // Podríamos definir colores médicos personalizados aquí después
      },
    },
  },
  plugins: [],
};