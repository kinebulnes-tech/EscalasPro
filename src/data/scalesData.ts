import { 
  Activity, Mic2, Brain, Bone, Accessibility, Heart, 
  Siren, Stethoscope, Baby, Thermometer, Puzzle, 
  Smile, Apple, Flower2, ClipboardList 
} from 'lucide-react';

// --- LAS INTERFACES DEBEN ESTAR AQUÍ, FUERA DE LOS IMPORTS ---

export interface Question {
  id: string;
  text: string;
  type: 'select' | 'number' | 'radio' | 'checkbox' | 'plugin' | 'timer' | 'text';
  componente?: 'CRONOMETRO' | 'TEMPORIZADOR';
  placeholder?: string;
  duration?: number;
  options?: Array<{ label: string; value: number }>;
  min?: number;
  max?: number;
}

export interface InterpretacionAvanzada {
  texto: string;
  recomendaciones: string[];
  color?: string;    
  evidencia?: string; 
}

export interface Scale {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  preguntas: Question[];
  calcularPuntaje: (respuestas: Record<string, any>) => number;
  interpretar: (puntaje: number, respuestas?: Record<string, any>) => string | InterpretacionAvanzada;
  bibliografia?: string;
  evidenciaClinica?: string;
  mcid?: number;
  referenciaUrl?: string;
}

// --- MAPEADO DE ICONOS ---

export const categoryIcons: Record<string, any> = {
  kinesiologia: Activity,
  fonoaudiologia: Mic2,
  neurologia: Brain,
  traumatologia: Bone,
  geriatria: Accessibility,
  cardiorespiratorio: Heart,
  emergencias: Siren,
  uci: Stethoscope,
  pediatria: Baby,
  enfermeria: Thermometer,
  terapia_ocupacional: Puzzle,
  psicologia: Smile,
  nutricion: Apple,
  paliativos: Flower2,
  cognitivas: ClipboardList,
};

export const scales: Scale[] = [
  
  ];



export const categories = [
  { id: 'kinesiologia', nombre: 'Kinesiología', descripcion: 'Evaluación funcional, movilidad y rehabilitación motora.' },
  { id: 'fonoaudiologia', nombre: 'Fonoaudiología', descripcion: 'Deglución, lenguaje, habla y comunicación funcional.' },
  { id: 'neurologia', nombre: 'Neurología', descripcion: 'Examen neurológico, escalas de ACV y daño cerebral.' },
  { id: 'traumatologia', nombre: 'Traumatología y Ortopedia', descripcion: 'Evaluación de lesiones osteomusculares y funcionalidad articular.' },
  { id: 'geriatria', nombre: 'Geriatría', descripcion: 'Valoración Geriátrica Integral (VGI) y detección de fragilidad.' },
  { id: 'cardiorespiratorio', nombre: 'Cardio-Respiratorio', descripcion: 'Función cardiopulmonar, disnea y riesgo cardiovascular.' },
  { id: 'emergencias', nombre: 'Emergencias y Trauma', descripcion: 'Sistemas de Triage, escalas de coma y manejo prehospitalario.' },
  { id: 'uci', nombre: 'Cuidados Críticos (UCI)', descripcion: 'Monitoreo avanzado, sedación y dolor en el paciente crítico.' },
  { id: 'pediatria', nombre: 'Pediatría', descripcion: 'Desarrollo infantil, crecimiento y urgencias pediátricas.' },
  { id: 'enfermeria', nombre: 'Enfermería', descripcion: 'Valoración de cuidados, riesgos de UPP y seguridad del paciente.' },
  { id: 'terapia_ocupacional', nombre: 'Terapia Ocupacional', descripcion: 'Destreza manual, actividades de la vida diaria y adaptaciones.' },
  { id: 'psicologia', nombre: 'Psicología y Salud Mental', descripcion: 'Tamizaje de depresión, ansiedad, estrés y conducta.' },
  { id: 'nutricion', nombre: 'Nutrición Clínica', descripcion: 'Estado nutricional, riesgo de malnutrición y composición corporal.' },
  { id: 'paliativos', nombre: 'Cuidados Paliativos', descripcion: 'Manejo de síntomas, calidad de vida y escalas oncológicas.' },
  { id: 'cognitivas', nombre: 'Evaluación Cognitiva', descripcion: 'Estado mental, memoria y funciones ejecutivas.' }
];

