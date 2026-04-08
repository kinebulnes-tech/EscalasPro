// src/data/clinicalFlows.ts

export interface ClinicalFlowStep {
  escalaId: string;
  nombreEscala: string;
  motivo: string;
}

export interface ClinicalFlow {
  id: string;
  nombre: string;
  descripcion: string;
  area: string;
  pasos: ClinicalFlowStep[];
}

export const clinicalFlows: ClinicalFlow[] = [

  {
    id: 'acv_agudo',
    nombre: 'ACV Agudo',
    descripcion: 'Evaluación neurológica inicial post stroke',
    area: 'Neurología',
    pasos: [
      { escalaId: 'nihss',   nombreEscala: 'NIHSS',         motivo: 'Severidad del déficit neurológico' },
      { escalaId: 'gcs',     nombreEscala: 'GCS',           motivo: 'Nivel de conciencia' },
      { escalaId: 'rankin',  nombreEscala: 'Rankin',        motivo: 'Discapacidad funcional' },
      { escalaId: 'barthel', nombreEscala: 'Barthel',       motivo: 'Independencia en AVD' },
    ]
  },

  {
    id: 'acv_rehabilitacion',
    nombre: 'ACV Rehabilitación',
    descripcion: 'Seguimiento funcional post stroke',
    area: 'Neurología',
    pasos: [
      { escalaId: 'barthel',     nombreEscala: 'Barthel',       motivo: 'Independencia en AVD' },
      { escalaId: 'berg',        nombreEscala: 'Berg',          motivo: 'Equilibrio' },
      { escalaId: 'tug',         nombreEscala: 'TUG',           motivo: 'Movilidad funcional' },
      { escalaId: 'fugel_meyer', nombreEscala: 'Fugl-Meyer',    motivo: 'Recuperación motora' },
      { escalaId: 'rankin',      nombreEscala: 'Rankin',        motivo: 'Discapacidad global' },
    ]
  },

  {
    id: 'trauma_craneal',
    nombre: 'Trauma Craneal',
    descripcion: 'Evaluación inicial TEC',
    area: 'Urgencias',
    pasos: [
      { escalaId: 'gcs',      nombreEscala: 'GCS',        motivo: 'Nivel de conciencia — primera línea' },
      { escalaId: 'nihss',    nombreEscala: 'NIHSS',      motivo: 'Déficit neurológico focal' },
      { escalaId: 'rankin',   nombreEscala: 'Rankin',     motivo: 'Estado funcional previo' },
      { escalaId: 'barthel',  nombreEscala: 'Barthel',    motivo: 'Funcionalidad basal' },
    ]
  },

  {
    id: 'paciente_critico',
    nombre: 'Paciente Crítico UCI',
    descripcion: 'Monitorización en unidad de cuidados intensivos',
    area: 'UCI',
    pasos: [
      { escalaId: 'sofa',        nombreEscala: 'SOFA',        motivo: 'Disfunción orgánica' },
      { escalaId: 'apache_ii',   nombreEscala: 'APACHE II',   motivo: 'Gravedad y mortalidad estimada' },
      { escalaId: 'rass',        nombreEscala: 'RASS',        motivo: 'Nivel de sedación/agitación' },
      { escalaId: 'cam_icu',     nombreEscala: 'CAM-ICU',     motivo: 'Detección de delirium' },
      { escalaId: 'mrc_sumscore',nombreEscala: 'MRC SumScore',motivo: 'Fuerza muscular global' },
    ]
  },

  {
    id: 'caida_adulto_mayor',
    nombre: 'Riesgo de Caída',
    descripcion: 'Evaluación geriátrica de riesgo de caída',
    area: 'Geriatría',
    pasos: [
      { escalaId: 'tinetti',  nombreEscala: 'Tinetti',   motivo: 'Marcha y equilibrio' },
      { escalaId: 'berg',     nombreEscala: 'Berg',      motivo: 'Equilibrio funcional' },
      { escalaId: 'tug',      nombreEscala: 'TUG',       motivo: 'Movilidad y riesgo de caída' },
      { escalaId: 'downton',  nombreEscala: 'Downton',   motivo: 'Índice de riesgo de caída' },
    ]
  },

  {
    id: 'geriatria_integral',
    nombre: 'Valoración Geriátrica',
    descripcion: 'Evaluación integral del adulto mayor',
    area: 'Geriatría',
    pasos: [
      { escalaId: 'barthel',      nombreEscala: 'Barthel',       motivo: 'Funcionalidad básica' },
      { escalaId: 'lawton_brody', nombreEscala: 'Lawton-Brody',  motivo: 'Actividades instrumentales' },
      { escalaId: 'minimental',   nombreEscala: 'Mini-Mental',   motivo: 'Estado cognitivo' },
      { escalaId: 'gds',          nombreEscala: 'GDS',           motivo: 'Depresión geriátrica' },
      { escalaId: 'mna',          nombreEscala: 'MNA',           motivo: 'Estado nutricional' },
      { escalaId: 'sarcf',        nombreEscala: 'SARC-F',        motivo: 'Sarcopenia' },
    ]
  },

  {
    id: 'dolor_cronico',
    nombre: 'Dolor Crónico',
    descripcion: 'Evaluación multidimensional del dolor',
    area: 'Traumatología',
    pasos: [
      { escalaId: 'eva',    nombreEscala: 'EVA',    motivo: 'Intensidad del dolor' },
      { escalaId: 'dn4',    nombreEscala: 'DN4',    motivo: 'Componente neuropático' },
      { escalaId: 'tampa',  nombreEscala: 'Tampa',  motivo: 'Kinesiofobia' },
      { escalaId: 'phq9',   nombreEscala: 'PHQ-9',  motivo: 'Depresión asociada al dolor' },
      { escalaId: 'gad7',   nombreEscala: 'GAD-7',  motivo: 'Ansiedad asociada al dolor' },
    ]
  },

  {
    id: 'epoc',
    nombre: 'EPOC',
    descripcion: 'Evaluación funcional respiratoria',
    area: 'Respiratorio',
    pasos: [
      { escalaId: 'mrc_disnea', nombreEscala: 'MRC Disnea', motivo: 'Grado de disnea' },
      { escalaId: 'cat_epoc',   nombreEscala: 'CAT',         motivo: 'Impacto de la enfermedad' },
      { escalaId: 'borg',       nombreEscala: 'Borg',        motivo: 'Esfuerzo percibido' },
      { escalaId: 'p6m',        nombreEscala: 'Test 6 Min',  motivo: 'Capacidad funcional' },
    ]
  },

  {
    id: 'salud_mental',
    nombre: 'Salud Mental',
    descripcion: 'Tamizaje psicológico integral',
    area: 'Psicología',
    pasos: [
      { escalaId: 'phq9',            nombreEscala: 'PHQ-9',          motivo: 'Depresión' },
      { escalaId: 'gad7',            nombreEscala: 'GAD-7',          motivo: 'Ansiedad' },
      { escalaId: 'pittsburgh',      nombreEscala: 'Pittsburgh',     motivo: 'Calidad del sueño' },
      { escalaId: 'pss',             nombreEscala: 'PSS',            motivo: 'Estrés percibido' },
    ]
  },

  {
    id: 'parkinson',
    nombre: 'Parkinson',
    descripcion: 'Evaluación funcional en enfermedad de Parkinson',
    area: 'Neurología',
    pasos: [
      { escalaId: 'hoehn_yahr', nombreEscala: 'Hoehn & Yahr', motivo: 'Estadio de la enfermedad' },
      { escalaId: 'updrs',      nombreEscala: 'UPDRS',         motivo: 'Severidad motora y no motora' },
      { escalaId: 'berg',       nombreEscala: 'Berg',          motivo: 'Equilibrio' },
      { escalaId: 'tug',        nombreEscala: 'TUG',           motivo: 'Movilidad funcional' },
      { escalaId: 'minimental', nombreEscala: 'Mini-Mental',   motivo: 'Cognición' },
    ]
  },

  {
    id: 'rodilla',
    nombre: 'Rodilla',
    descripcion: 'Evaluación funcional de rodilla',
    area: 'Traumatología',
    pasos: [
      { escalaId: 'womac',   nombreEscala: 'WOMAC',   motivo: 'Dolor, rigidez y función' },
      { escalaId: 'koos',    nombreEscala: 'KOOS',    motivo: 'Calidad de vida rodilla' },
      { escalaId: 'lysholm', nombreEscala: 'Lysholm', motivo: 'Función ligamentaria' },
      { escalaId: 'tug',     nombreEscala: 'TUG',     motivo: 'Movilidad funcional' },
      { escalaId: 'eva',     nombreEscala: 'EVA',     motivo: 'Intensidad del dolor' },
    ]
  },

  {
    id: 'hombro',
    nombre: 'Hombro',
    descripcion: 'Evaluación funcional de hombro',
    area: 'Traumatología',
    pasos: [
      { escalaId: 'constant_murley', nombreEscala: 'Constant-Murley', motivo: 'Función global del hombro' },
      { escalaId: 'dash',            nombreEscala: 'DASH',            motivo: 'Discapacidad miembro superior' },
      { escalaId: 'spadi',           nombreEscala: 'SPADI',           motivo: 'Dolor y discapacidad' },
      { escalaId: 'eva',             nombreEscala: 'EVA',             motivo: 'Intensidad del dolor' },
    ]
  },

];

// Áreas únicas para agrupar en el panel
export const flowAreas = [...new Set(clinicalFlows.map(f => f.area))];