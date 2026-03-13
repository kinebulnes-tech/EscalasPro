# ESCALAS CLÍNICAS PRO

Plataforma profesional de calculadoras clínicas para profesionales de la salud.

## Descripción

Aplicación web completa que proporciona 48 escalas clínicas validadas para:
- Kinesiología (18 escalas)
- Fonoaudiología (10 escalas)
- Evaluación Cognitiva (3 escalas)
- Terapia Ocupacional (4 escalas)
- Emergencias (13 escalas)

## Tecnologías

- React 18
- TypeScript
- Vite
- TailwindCSS
- Express (Backend)
- Lucide React (Iconos)

## Instalación

```bash
npm install
```

## Ejecutar la aplicación

### Frontend

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

### Backend (Opcional)

```bash
npm run server
```

El servidor backend estará disponible en http://localhost:3001

## Build para producción

```bash
npm run build
```

## Características

- 48 escalas clínicas validadas
- Cálculo automático de puntajes
- Interpretación clínica automática
- Búsqueda de escalas
- Filtrado por categorías
- Diseño responsive
- Interfaz médica profesional

## Escalas Incluidas

### Kinesiología
- Índice de Barthel
- Medida de Independencia Funcional (FIM)
- Escala Lawton Brody IADL
- Timed Up and Go (TUG)
- Test de Caminata de 6 Minutos
- Test de Marcha de 10 Metros
- Escala de Equilibrio de Berg
- MiniBESTest
- BESTest
- Escala de Tinetti POMA
- Escala de Fuerza Muscular MRC
- Fugl Meyer Assessment
- Trunk Control Test
- Escala Visual Analógica del Dolor (EVA)
- Escala Numérica del Dolor
- Cuestionario McGill del Dolor
- Escala de Ashworth Modificada

### Fonoaudiología
- EAT-10
- MECV-V
- GUSS
- DOSS
- FOIS
- Examen de Afasia de Boston
- Token Test
- ASHA FACS
- GRBAS
- Voice Handicap Index (VHI)

### Evaluación Cognitiva
- MoCA
- Mini Mental State Examination (MMSE)
- Test del Reloj

### Terapia Ocupacional
- Nine Hole Peg Test
- Box and Block Test
- Jebsen Taylor Hand Function Test
- Canadian Occupational Performance Measure (COPM)

### Emergencias
- Escala de Glasgow
- Revised Trauma Score (RTS)
- START Triage
- JumpSTART
- CRAMS
- qSOFA
- NEWS2
- Escala Cincinnati para ACV
- FAST-ED
- RACE
- Escala FLACC de dolor pediátrico
- Escala Mallampati
- Silverman Anderson

## Estructura del Proyecto

```
src/
  components/
    Header.tsx
    Sidebar.tsx
    ScaleCard.tsx
    ScaleForm.tsx
    ScaleResult.tsx
    SearchBar.tsx
  pages/
    Home.tsx
  data/
    scalesData.ts
  utils/
    scaleEngine.ts
  App.tsx
  main.tsx
backend/
  server.ts
```

## Licencia

Herramienta de apoyo clínico. Los resultados deben ser interpretados por un profesional de la salud calificado.
