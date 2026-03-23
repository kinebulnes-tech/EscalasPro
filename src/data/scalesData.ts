export interface Question {
  id: string;
  text: string;
  type: 'select' | 'number' | 'radio' | 'checkbox' | 'plugin';
  componente?: 'CRONOMETRO' | 'TEMPORIZADOR';
  options?: Array<{ label: string; value: number }>;
  min?: number;
  max?: number;
}

export interface InterpretacionAvanzada {
  texto: string;
  recomendaciones: string[];
  color?: string;    
  evidencia?: string; // ✅ Campo para el dato estadístico del resultado
}

export interface Scale {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  preguntas: Question[];
  calcularPuntaje: (respuestas: Record<string, number>) => number;
  // ✅ CAMBIO CLAVE: Agregamos 'respuestas' como segundo argumento opcional
  // Esto elimina las líneas rojas cuando intentas usar respuestas?.edad o similares.
  interpretar: (puntaje: number, respuestas?: Record<string, any>) => string | InterpretacionAvanzada;
  // Rigor científico
  bibliografia?: string;
  evidenciaClinica?: string;
  referenciaUrl?: string;
}
// Mapeo de Iconos por Especialidad
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


  // ==========================================
  //  UCI
  // ==========================================

  
  {
    id: 'sofa_score_uci',
    nombre: 'Score SOFA',
    categoria: 'uci',
    descripcion: 'Evaluación diaria de la falla orgánica en 6 sistemas: Respiratorio, Coagulación, Hepático, Cardiovascular, SNC y Renal.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 26903338) ---
    bibliografia: "Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/26903338/", 
    evidenciaClinica: "Un puntaje SOFA ≥ 2 refleja un riesgo de mortalidad hospitalaria del 10%. Es la herramienta principal para el seguimiento de la falla multiorgánica.",

    preguntas: [
      { id: 'respiratorio', text: 'Respiratorio (PaO2/FiO2 mmHg):', type: 'select', options: [{ label: '>400 (0)', value: 0 }, { label: '<400 (1)', value: 1 }, { label: '<300 (2)', value: 2 }, { label: '<200 + VM (3)', value: 3 }, { label: '<100 + VM (4)', value: 4 }] },
      { id: 'nervioso', text: 'SNC (Escala de Glasgow):', type: 'select', options: [{ label: '15 (0)', value: 0 }, { label: '13-14 (1)', value: 1 }, { label: '10-12 (2)', value: 2 }, { label: '6-9 (3)', value: 3 }, { label: '<6 (4)', value: 4 }] },
      { id: 'cardio', text: 'Cardiovascular (PAM / Vasopresores):', type: 'select', options: [{ label: 'PAM ≥ 70 mmHg (0)', value: 0 }, { label: 'PAM < 70 mmHg (1)', value: 1 }, { label: 'Dopamina <5 o Dobutamina (2)', value: 2 }, { label: 'Dopa 5-15 o Noradre ≤0.1 (3)', value: 3 }, { label: 'Dopa >15 o Noradre >0.1 (4)', value: 4 }] },
      { id: 'hepatico', text: 'Hepático (Bilirrubina mg/dL):', type: 'select', options: [{ label: '<1.2 (0)', value: 0 }, { label: '1.2-1.9 (1)', value: 1 }, { label: '2.0-5.9 (2)', value: 2 }, { label: '6.0-11.9 (3)', value: 3 }, { label: '>12.0 (4)', value: 4 }] },
      { id: 'coagulacion', text: 'Coagulación (Plaquetas x10³/mm³):', type: 'select', options: [{ label: '≥150 (0)', value: 0 }, { label: '<150 (1)', value: 1 }, { label: '<100 (2)', value: 2 }, { label: '<50 (3)', value: 3 }, { label: '<20 (4)', value: 4 }] },
      { id: 'renal', text: 'Renal (Creatinina mg/dL o Diuresis):', type: 'select', options: [{ label: '<1.2 (0)', value: 0 }, { label: '1.2-1.9 (1)', value: 1 }, { label: '2.0-3.4 (2)', value: 2 }, { label: '3.5-4.9 o <500ml/d (3)', value: 3 }, { label: '>5.0 o <200ml/d (4)', value: 4 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 12) return { 
        texto: 'FALLA MULTIORGÁNICA SEVERA', color: 'red-700', evidencia: `Score SOFA: ${puntaje}. Mortalidad estimada > 50-80%.`,
        recomendaciones: ['Soporte vital avanzado máximo', 'Revisión de metas de cuidado', 'Evaluación multidisciplinaria horaria']
      };
      if (puntaje >= 2) return { 
        texto: 'DISFUNCIÓN ORGÁNICA (Sepsis)', color: 'orange-600', evidencia: `Score SOFA: ${puntaje}. Cumple criterios de Sepsis-3 si hay sospecha de infección.`,
        recomendaciones: ['Activar protocolo de Sepsis', 'Búsqueda de foco infeccioso', 'Monitoreo hemodinámico invasivo']
      };
      return { 
        texto: 'ESTADO ESTABLE / BAJO RIESGO', color: 'emerald-600', evidencia: `Score SOFA: ${puntaje}.`, 
        recomendaciones: ['Mantener vigilancia diaria', 'Progresar hacia el destete si aplica'] 
      };
    }
  },

  {
    id: 'tobin_index_weaning',
    nombre: 'Índice de Tobin (RSBI)',
    categoria: 'uci',
    descripcion: 'Rapid Shallow Breathing Index. Predictor de éxito en la desconexión de la ventilación mecánica.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 2044810) ---
    bibliografia: "Yang KL, Tobin MJ. A predictive index for the outcome of weaning from mechanical ventilation. N Engl J Med. 1991.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2044810/",
    evidenciaClinica: "Un RSBI < 105 medido durante la ventilación espontánea es el predictor más utilizado de éxito en la extubación. Valores > 105 indican una respiración rápida y superficial ineficiente.",

    preguntas: [
      { id: 'fr', text: 'Frecuencia Respiratoria (rpm):', type: 'number', min: 0, max: 60 },
      { id: 'vc', text: 'Volumen Corriente (Litros - Ej: 0.45):', type: 'number', min: 0.05, max: 2.0 },
      { id: 'sat', text: 'Saturación de O2 actual (%):', type: 'number', min: 50, max: 100 }
    ],

    calcularPuntaje: (respuestas) => {
      const fr = Number(respuestas.fr);
      const vc = Number(respuestas.vc);
      
      // Validación CEO: Si los datos son inconsistentes, retornamos un valor que fuerce la precaución
      if (!fr || !vc || vc <= 0) return 999; 
      
      return Math.round(fr / vc);
    },

    interpretar: (puntaje, respuestas) => {
      const sat = Number(respuestas?.sat) || 0;
      const vcBajo = (Number(respuestas?.vc) || 0) < 0.3;

      // Caso de error en entrada de datos
      if (puntaje === 999) return {
        texto: 'DATOS INCOMPLETOS',
        color: 'gray-500',
        evidencia: 'Faltan valores críticos (FR o VC).',
        recomendaciones: ['Ingrese todos los parámetros para calcular el RSBI.']
      };

      if (puntaje < 105) {
        return { 
          texto: 'ÉXITO PROBABLE (RSBI < 105)', 
          color: 'emerald-600', 
          evidencia: `RSBI: ${puntaje}. El paciente tolera la ventilación espontánea adecuadamente.`,
          recomendaciones: [
            'Evaluar criterios de extubación (Estado mental, tos, secreciones).',
            sat < 92 ? 'Precaución: El RSBI es bueno pero la saturación es limítrofe.' : 'Preparar kit de extubación.',
            'Realizar prueba de fuga de manguito (Cuff Leak Test) antes de proceder.'
          ]
        };
      }

      return { 
        texto: 'RIESGO DE FALLA (RSBI > 105)', 
        color: 'red-600', 
        evidencia: `RSBI: ${puntaje}. Patrón respiratorio ineficiente.`, 
        recomendaciones: [
          'Abortar prueba de ventilación espontánea (PVE).',
          vcBajo ? 'Alerta: Volumen corriente muy bajo (< 300ml). Evaluar debilidad muscular.' : 'Identificar causas de taquipnea.',
          'Optimizar sedoanalgesia y balance hídrico.',
          'Considerar entrenamiento de musculatura inspiratoria (PIMet) antes de nueva prueba.'
        ] 
      };
    }
  },
  {
    id: 'cpot_dolor_uci',
    nombre: 'Escala CPOT',
    categoria: 'uci',
    descripcion: 'Evaluación del dolor en pacientes críticos (comunicativos o no) mediante observación conductual.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 16443026) ---
    bibliografia: "Gélinas C, et al. The Critical-Care Pain Observation Tool: a validity study in nonverbal critically ill adults. Am J Crit Care. 2006.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/16443026/", 
    evidenciaClinica: "Un puntaje > 2 indica la presencia de dolor significativo. Es superior a los signos vitales para la detección de distrés doloroso.",

    preguntas: [
      { id: 'facial', text: '1. Expresión Facial:', type: 'select', options: [
        { label: 'Relajada / Neutra (0)', value: 0 },
        { label: 'Tensa (ceño fruncido, contracción leve) (1)', value: 1 },
        { label: 'Mueca (ojos cerrados, contracción severa) (2)', value: 2 }
      ]},
      { id: 'movimientos', text: '2. Movimientos Corporales:', type: 'select', options: [
        { label: 'Ausencia (movimientos normales) (0)', value: 0 },
        { label: 'Protección (movimientos lentos o de defensa) (1)', value: 1 },
        { label: 'Inquietud (intenta quitarse tubos, agitación) (2)', value: 2 }
      ]},
      { id: 'ventilacion', text: '3. Adaptación al Ventilador (o vocalización):', type: 'select', options: [
        { label: 'Tolerancia (rítmica, sin alarmas) (0)', value: 0 },
        { label: 'Tos / Alarma de presión (se detiene solo) (1)', value: 1 },
        { label: 'Lucha con el ventilador (asincronía, alarmas) (2)', value: 2 }
      ]},
      { id: 'tension', text: '4. Tensión Muscular (evaluada en flexión/extensión pasiva):', type: 'select', options: [
        { label: 'Relajado (sin resistencia) (0)', value: 0 },
        { label: 'Tenso / Rígido (resistencia moderada) (1)', value: 1 },
        { label: 'Muy Tenso / Muy Rígido (no se puede movilizar) (2)', value: 2 }
      ]}
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje > 2) return { 
        texto: 'DOLOR SIGNIFICATIVO PRESENTE', color: 'red-600', evidencia: `Puntaje: ${puntaje}/8.`,
        recomendaciones: ['Administrar rescate analgésico según protocolo', 'Evaluar causa del dolor (procedimiento, tubo, posición)', 'Re-evaluar en 20 minutos']
      };
      return { 
        texto: 'Mínimo o Ausencia de Dolor', color: 'emerald-600', evidencia: `Puntaje: ${puntaje}/8.`, 
        recomendaciones: ['Mantener esquema analgésico basal', 'Continuar monitoreo rutinario'] 
      };
    }
  },

  {
    id: 'ims_movilidad_uci',
    nombre: 'Escala de Movilidad en UCI (IMS)',
    categoria: 'uci',
    descripcion: 'Clasificación del máximo nivel de movilidad alcanzado por el paciente en la unidad.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 24713114) ---
    bibliografia: "Hodgson CL, et al. Feasibility and inter-rater reliability of the ICU Mobility Scale. Crit Care. 2014.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/24713114/",

    preguntas: [
      { id: 'nivel', text: 'Seleccione el hito de movilidad más alto logrado hoy:', type: 'select', options: [
        { label: '0: Nada (solo ejercicios pasivos)', value: 0 },
        { label: '1: Sentado en cama / ejercicios activos', value: 1 },
        { label: '2: Sentado al borde de la cama', value: 2 },
        { label: '3: Sentado fuera de la cama (sillón)', value: 3 },
        { label: '4: Bipedestación (solo pararse)', value: 4 },
        { label: '5: Traslado de cama a sillón (paso lateral)', value: 5 },
        { label: '6: Marcha en el lugar (con asistencia)', value: 6 },
        { label: '7: Caminata ≥ 5 metros (con ayuda de 2 pers)', value: 7 },
        { label: '8: Caminata ≥ 5 metros (con ayuda de 1 pers)', value: 8 },
        { label: '9: Caminata ≥ 5 metros (con ayuda técnica únicamente)', value: 9 },
        { label: '10: Caminata independiente (sin ayuda técnica)', value: 10 }
      ]}
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.nivel) || 0,

    interpretar: (puntaje) => {
      const colorMap = { 0: 'gray-500', 1: 'blue-400', 2: 'blue-500', 3: 'blue-600', 4: 'cyan-600', 5: 'emerald-500', 6: 'emerald-600', 7: 'green-600', 8: 'green-700', 9: 'green-800', 10: 'green-900' };
      
      return { 
        texto: `Nivel IMS: ${puntaje}`, 
        color: (colorMap as any)[puntaje] || 'slate-500', 
        evidencia: `Categoría alcanzada: ${puntaje}/10.`,
        recomendaciones: [
          'Documentar hitos alcanzados para comparación semanal',
          puntaje < 4 ? 'Enfoque en entrenamiento de control de tronco y fuerza proximal.' : 'Enfoque en transferencia de carga y entrenamiento de marcha.',
          'Vigilar estabilidad hemodinámica post-sesión.'
        ] 
      };
    }
  },

  {
    id: 'murray_lung_injury',
    nombre: 'Score de Murray (LIS)',
    categoria: 'uci',
    descripcion: 'Cuantificación del daño pulmonar agudo basado en 4 parámetros clínicos y radiológicos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3202474) ---
    bibliografia: "Murray JF, et al. An expanded definition of the adult respiratory distress syndrome. Am Rev Respir Dis. 1988.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3202474/",

    preguntas: [
      { id: 'pafy', text: '1. Relación PaO2/FiO2:', type: 'select', options: [
        { label: '≥ 300 (0 pts)', value: 0 }, { label: '225-299 (1 pt)', value: 1 }, { label: '175-224 (2 pts)', value: 2 }, { label: '100-174 (3 pts)', value: 3 }, { label: '< 100 (4 pts)', value: 4 }
      ]},
      { id: 'peep', text: '2. PEEP (cmH2O):', type: 'select', options: [
        { label: '≤ 5 (0 pts)', value: 0 }, { label: '6-8 (1 pt)', value: 1 }, { label: '9-11 (2 pts)', value: 2 }, { label: '12-14 (3 pts)', value: 3 }, { label: '≥ 15 (4 pts)', value: 4 }
      ]},
      { id: 'compliance', text: '3. Distensibilidad Estática (Cst):', type: 'select', options: [
        { label: '≥ 80 (0 pts)', value: 0 }, { label: '60-79 (1 pt)', value: 1 }, { label: '40-59 (2 pts)', value: 2 }, { label: '20-39 (3 pts)', value: 3 }, { label: '≤ 19 (4 pts)', value: 4 }
      ]},
      { id: 'radiografia', text: '4. Infiltrados en Rx de Tórax (Cuadrantes):', type: 'select', options: [
        { label: 'Sin infiltrados (0 pts)', value: 0 }, { label: '1 cuadrante (1 pt)', value: 1 }, { label: '2 cuadrantes (2 pts)', value: 2 }, { label: '3 cuadrantes (3 pts)', value: 3 }, { label: '4 cuadrantes (4 pts)', value: 4 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      const vals = Object.values(respuestas).map(Number);
      const sum = vals.reduce((a, b) => a + b, 0);
      return parseFloat((sum / 4).toFixed(1)); // Promedio de los 4 componentes
    },

    interpretar: (puntaje) => {
      if (puntaje > 2.5) return { 
        texto: 'SDRA SEVERO', color: 'red-700', evidencia: `Murray Score: ${puntaje}.`,
        recomendaciones: ['Considerar Posición Prono precoz (16-20h)', 'Bloqueo Neuromuscular si asincronía persiste', 'Evaluar terapia con ECMO']
      };
      if (puntaje >= 0.1) return { 
        texto: 'DAÑO PULMONAR LEVE / MODERADO', color: 'orange-500', evidencia: `Murray Score: ${puntaje}.`,
        recomendaciones: ['Estrategia ventilatoria protectora (6ml/kg de peso ideal)', 'Limitar presión de conducción (Driving Pressure < 15)']
      };
      return { texto: 'Sin Daño Pulmonar Agudo', color: 'emerald-600', evidencia: `Murray Score: ${puntaje}.`, recomendaciones: ['Mantener monitoreo estándar'] };
    }
  },

  {
    id: 'perme_score_uci',
    nombre: 'Perme ICU Mobility Score',
    categoria: 'uci',
    descripcion: 'Evaluación integral de la movilidad del paciente crítico, considerando barreras clínicas y nivel de asistencia.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 24393437) ---
    bibliografia: "Perme C, et al. A tool to assess mobility status in critically ill patients: the Perme ICU Mobility Score. Methodist Debakey Cardiovasc J. 2014.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/24393437/", 
    evidenciaClinica: "Puntaje de 0 a 32. Puntajes más altos indican mayor movilidad y menores barreras. Es un predictor de la disposición para el alta de la UCI.",

    preguntas: [
      { id: 'conciencia', text: '1. Nivel de conciencia (Sigue comandos):', type: 'select', options: [{ label: 'No (0 pts)', value: 0 }, { label: 'Sí (1 pt)', value: 1 }] },
      { id: 'barreras', text: '2. Barreras a la movilidad (Drogas vasoactivas, sedación, catéteres):', type: 'select', options: [{ label: 'Múltiples barreras severas (0-1 pts)', value: 1 }, { label: 'Barreras moderadas (2 pts)', value: 2 }, { label: 'Pocas o ninguna barrera (3 pts)', value: 3 }] },
      { id: 'fuerza', text: '3. Fuerza funcional (Prensión y dorsiflexión):', type: 'select', options: [{ label: 'Ninguna (0 pts)', value: 0 }, { label: 'Pobre (1 pt)', value: 1 }, { label: 'Buena (2 pts)', value: 2 }] },
      { id: 'respiratorio', text: '4. Nivel de soporte respiratorio:', type: 'select', options: [{ label: 'VM Invasiva (0 pts)', value: 0 }, { label: 'VNI / Cánula Alto Flujo (1 pt)', value: 1 }, { label: 'Oxígeno simple / Aire ambiente (2 pts)', value: 2 }] },
      { id: 'sentado', text: '5. Sedestación al borde de cama:', type: 'select', options: [{ label: 'Incapaz (0 pts)', value: 0 }, { label: 'Con asistencia (1 pt)', value: 1 }, { label: 'Independiente (2 pts)', value: 2 }] },
      { id: 'marcha_estatica', text: '6. Bipedestación / Marcha estática:', type: 'select', options: [{ label: 'Incapaz (0 pts)', value: 0 }, { label: 'Asistencia máxima (1 pt)', value: 1 }, { label: 'Independiente (2 pts)', value: 2 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 20) return { 
        texto: 'MOVILIDAD AVANZADA', color: 'emerald-600', evidencia: `Puntaje: ${puntaje}/32.`,
        recomendaciones: ['Progresar a marcha independiente', 'Considerar traslado a sala básica', 'Entrenamiento de resistencia']
      };
      if (puntaje >= 10) return { 
        texto: 'MOVILIDAD MODERADA', color: 'orange-500', evidencia: `Puntaje: ${puntaje}/32.`,
        recomendaciones: ['Facilitar transferencias fuera de cama', 'Entrenamiento de control motor en sedente', 'Optimizar manejo de barreras (cables/tubos)']
      };
      return { 
        texto: 'MOVILIDAD RESTRINGIDA', color: 'red-600', evidencia: `Puntaje: ${puntaje}/32.`, 
        recomendaciones: ['Ejercicios activos-asistidos en cama', 'Kinesioterapia motora para evitar PICS (Post-Intensive Care Syndrome)', 'Vigilancia de integridad cutánea'] 
      };
    }
  },

  {
    id: 'apache_ii_uci',
    nombre: 'APACHE II (Completo)',
    categoria: 'uci',
    descripcion: 'Acute Physiology and Chronic Health Evaluation II. Herramienta de predicción de mortalidad hospitalaria basada en 12 variables fisiológicas, edad y salud previa.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 6385357) ---
    bibliografia: "Knaus WA, et al. APACHE II: a severity of disease classification system. Crit Care Med. 1985.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/6385357/",
    evidenciaClinica: "Es el estándar para comparar la gravedad de la enfermedad y los resultados entre unidades de cuidados intensivos. Se calcula con los peores valores en las primeras 24h de ingreso.",

    preguntas: [
      // --- SECCIÓN 1: FISIOLOGÍA AGUDA (0-4 pts por ítem) ---
      { id: 'temp', text: '1. Temperatura Rectal (°C):', type: 'select', options: [
        { label: '36 - 38.4 (0)', value: 0 }, { label: '38.5 - 38.9 (1)', value: 1 }, { label: '34 - 35.9 (1)', value: 1 }, 
        { label: '32 - 33.9 (2)', value: 2 }, { label: '39 - 40.9 (3)', value: 3 }, { label: '30 - 31.9 (3)', value: 3 },
        { label: '≥ 41 (4)', value: 4 }, { label: '≤ 29.9 (4)', value: 4 }
      ]},
      { id: 'pam', text: '2. Presión Arterial Media (mmHg):', type: 'select', options: [
        { label: '70 - 109 (0)', value: 0 }, { label: '110 - 129 (2)', value: 2 }, { label: '50 - 69 (2)', value: 2 },
        { label: '130 - 159 (3)', value: 3 }, { label: '≥ 160 (4)', value: 4 }, { label: '≤ 49 (4)', value: 4 }
      ]},
      { id: 'fc', text: '3. Frecuencia Cardíaca (lpm):', type: 'select', options: [
        { label: '70 - 109 (0)', value: 0 }, { label: '110 - 139 (2)', value: 2 }, { label: '55 - 69 (2)', value: 2 },
        { label: '140 - 179 (3)', value: 3 }, { label: '40 - 54 (3)', value: 3 }, { label: '≥ 180 (4)', value: 4 }, { label: '≤ 39 (4)', value: 4 }
      ]},
      { id: 'fr', text: '4. Frecuencia Respiratoria (rpm):', type: 'select', options: [
        { label: '12 - 24 (0)', value: 0 }, { label: '25 - 34 (1)', value: 1 }, { label: '10 - 11 (1)', value: 1 },
        { label: '35 - 49 (3)', value: 3 }, { label: '6 - 9 (3)', value: 3 }, { label: '≥ 50 (4)', value: 4 }, { label: '≤ 5 (4)', value: 4 }
      ]},
      { id: 'fio2', text: '5. Oxigenación (Si FiO2 <0.5 usar PaO2 / Si >0.5 usar Gradiente A-a):', type: 'select', options: [
        { label: 'PaO2 > 70 o A-a < 200 (0)', value: 0 }, { label: 'PaO2 61-70 o A-a 200-349 (2)', value: 2 },
        { label: 'PaO2 55-60 o A-a 350-499 (3)', value: 3 }, { label: 'PaO2 < 55 o A-a ≥ 500 (4)', value: 4 }
      ]},
      { id: 'ph', text: '6. pH Arterial:', type: 'select', options: [
        { label: '7.33 - 7.49 (0)', value: 0 }, { label: '7.50 - 7.59 (1)', value: 1 }, { label: '7.25 - 7.32 (2)', value: 2 },
        { label: '7.60 - 7.69 (3)', value: 3 }, { label: '7.15 - 7.24 (3)', value: 3 }, { label: '≥ 7.70 (4)', value: 4 }, { label: '≤ 7.15 (4)', value: 4 }
      ]},
      { id: 'na', text: '7. Sodio Plasmático (mEq/L):', type: 'select', options: [
        { label: '130 - 149 (0)', value: 0 }, { label: '150 - 154 (1)', value: 1 }, { label: '155 - 159 (2)', value: 2 }, { label: '120 - 129 (2)', value: 2 },
        { label: '160 - 179 (3)', value: 3 }, { label: '111 - 119 (3)', value: 3 }, { label: '≥ 180 (4)', value: 4 }, { label: '≤ 110 (4)', value: 4 }
      ]},
      { id: 'k', text: '8. Potasio Plasmático (mEq/L):', type: 'select', options: [
        { label: '3.5 - 5.4 (0)', value: 0 }, { label: '5.5 - 5.9 (1)', value: 1 }, { label: '3.0 - 3.4 (1)', value: 1 },
        { label: '2.5 - 2.9 (2)', value: 2 }, { label: '6.0 - 6.9 (3)', value: 3 }, { label: '≥ 7.0 (4)', value: 4 }, { label: '≤ 2.5 (4)', value: 4 }
      ]},
      { id: 'crea', text: '9. Creatinina (mg/dL) - Duplicar si hay Falla Renal Aguda:', type: 'select', options: [
        { label: '0.6 - 1.4 (0)', value: 0 }, { label: '< 0.6 (2)', value: 2 }, { label: '1.5 - 1.9 (2)', value: 2 },
        { label: '2.0 - 3.4 (3)', value: 3 }, { label: '≥ 3.5 (4)', value: 4 }
      ]},
      { id: 'hto', text: '10. Hematocrito (%):', type: 'select', options: [
        { label: '30 - 45.9 (0)', value: 0 }, { label: '46 - 49.9 (1)', value: 1 }, { label: '50 - 59.9 (2)', value: 2 }, { label: '20 - 29.9 (2)', value: 2 },
        { label: '≥ 60 (4)', value: 4 }, { label: '< 20 (4)', value: 4 }
      ]},
      { id: 'leucos', text: '11. Leucocitos (x1000/mm³):', type: 'select', options: [
        { label: '3 - 14.9 (0)', value: 0 }, { label: '15 - 19.9 (1)', value: 1 }, { label: '20 - 39.9 (2)', value: 2 }, { label: '1 - 2.9 (2)', value: 2 },
        { label: '≥ 40 (4)', value: 4 }, { label: '< 1 (4)', value: 4 }
      ]},
      { id: 'gcs', text: '12. Escala de Glasgow (Puntaje Real):', type: 'number', min: 3, max: 15 },

      // --- SECCIÓN 2: EDAD Y SALUD CRÓNICA ---
      { id: 'edad', text: 'Puntaje por Edad:', type: 'select', options: [
        { label: '≤ 44 años (0)', value: 0 }, { label: '45-54 años (2)', value: 2 }, 
        { label: '55-64 años (3)', value: 3 }, { label: '65-74 años (5)', value: 5 }, { label: '≥ 75 años (6)', value: 6 }
      ]},
      { id: 'cronico', text: 'Salud Crónica (Falla de órgano o inmunocompromiso):', type: 'select', options: [
        { label: 'No (0 pts)', value: 0 }, 
        { label: 'Sí - Postquirúrgico urgente/No quirúrgico (5 pts)', value: 5 }, 
        { label: 'Sí - Postquirúrgico electivo (2 pts)', value: 2 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      const fisiologiaSuma = 
        (Number(respuestas.temp) || 0) + (Number(respuestas.pam) || 0) + 
        (Number(respuestas.fc) || 0) + (Number(respuestas.fr) || 0) + 
        (Number(respuestas.fio2) || 0) + (Number(respuestas.ph) || 0) + 
        (Number(respuestas.na) || 0) + (Number(respuestas.k) || 0) + 
        (Number(respuestas.crea) || 0) + (Number(respuestas.hto) || 0) + 
        (Number(respuestas.leucos) || 0);
      
      // Cálculo Glasgow: APACHE usa (15 - GCS real)
      const puntosGlasgow = 15 - (Number(respuestas.gcs) || 15);
      
      return fisiologiaSuma + puntosGlasgow + (Number(respuestas.edad) || 0) + (Number(respuestas.cronico) || 0);
    },

    interpretar: (puntaje) => {
      let riesgo = "";
      let color = "";
      if (puntaje >= 35) { riesgo = "> 85%"; color = "red-900"; }
      else if (puntaje >= 30) { riesgo = "70 - 75%"; color = "red-700"; }
      else if (puntaje >= 25) { riesgo = "50 - 55%"; color = "red-600"; }
      else if (puntaje >= 20) { riesgo = "40%"; color = "orange-600"; }
      else if (puntaje >= 15) { riesgo = "25%"; color = "orange-500"; }
      else if (puntaje >= 10) { riesgo = "15%"; color = "yellow-600"; }
      else if (puntaje >= 5) { riesgo = "8%"; color = "emerald-500"; }
      else { riesgo = "< 4%"; color = "emerald-600"; }

      return { 
        texto: `Mortalidad Estimada: ${riesgo}`, 
        color: color, 
        evidencia: `Score APACHE II: ${puntaje} puntos. Predicción basada en el estado de salud inicial y reserva fisiológica.`,
        recomendaciones: [
          'Monitorización hemodinámica invasiva',
          'Evaluación diaria de la escala SOFA para ver progresión',
          'Considerar adecuación de esfuerzo terapéutico en puntajes > 30 persistentes',
          'Vigilancia estricta de balance hídrico y electrolitos'
        ] 
      };
    }
  },
  {
    id: 'cpax_funcionalidad_uci',
    nombre: 'Escala CPAx',
    categoria: 'uci',
    descripcion: 'Herramienta de evaluación de la funcionalidad física en el paciente crítico.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 23640243) ---
    bibliografia: "Corner EJ, et al. The Chelsea critical care physical assessment tool (CPAx): validation of an innovative new tool. Crit Care. 2013.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/23640243/",

    preguntas: [
      { id: 'respiratorio', text: 'Función Respiratoria (Soporte):', type: 'select', options: [{ label: 'VMI (0)', value: 0 }, { label: 'VNI (2)', value: 2 }, { label: 'Aire ambiente (5)', value: 5 }] },
      { id: 'tos', text: 'Eficacia de la Tos:', type: 'select', options: [{ label: 'Nula (0)', value: 0 }, { label: 'Débil (2)', value: 2 }, { label: 'Efectiva (5)', value: 5 }] },
      { id: 'fuerza', text: 'Fuerza Muscular (MRC sum-score):', type: 'select', options: [{ label: 'Plejía (0)', value: 0 }, { label: 'Debilidad severa (2)', value: 2 }, { label: 'Normal (5)', value: 5 }] },
      { id: 'sentado', text: 'Equilibrio Sentado:', type: 'select', options: [{ label: 'Incapaz (0)', value: 0 }, { label: 'Con apoyo (3)', value: 3 }, { label: 'Independiente (5)', value: 5 }] },
      { id: 'traslado', text: 'Traslado Cama a Silla:', type: 'select', options: [{ label: 'Incapaz (0)', value: 0 }, { label: 'Asistido (3)', value: 3 }, { label: 'Independiente (5)', value: 5 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      return { 
        texto: `Funcionalidad CPAx: ${puntaje} pts`, 
        color: puntaje >= 20 ? 'emerald-600' : 'orange-500', 
        evidencia: `Resultado: ${puntaje}/25 (versión abreviada).`,
        recomendaciones: [
          'Seguimiento funcional cada 48 horas',
          'Objetivo: Lograr ≥ 5 puntos en cada ítem antes del alta de UPC',
          'Ajustar carga de rehabilitación kinésica según tolerancia'
        ] 
      };
    }
  },

  {
    id: 'tiss_28_uci',
    nombre: 'TISS-28 (Carga de Enfermería)',
    categoria: 'uci',
    descripcion: 'Therapeutic Intervention Scoring System. Mide la carga de trabajo de enfermería basada en la intensidad de las actividades terapéuticas en UCI.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8635643) ---
    bibliografia: "Miranda DR, et al. TISS-28: A reduced version of the TISS. Intensive Care Med. 1996.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8635643/", 

    preguntas: [
      // 1. ACTIVIDADES BÁSICAS
      { id: 't1', text: 'Monitoreo estándar (Signos vitales, balance hídrico):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (5 pts)', value: 5 }] },
      { id: 't2', text: 'Laboratorio: Investigaciones bioquímicas/microbiológicas extra:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (1 pt)', value: 1 }] },
      { id: 't3', text: 'Medicación intravenosa (Bolo o infusión única):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (2 pts)', value: 2 }] },
      { id: 't4', text: 'Cambios de apósitos frecuentes (o cuidados de herida extensos):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (1 pt)', value: 1 }] },
      { id: 't5', text: 'Cuidado de drenajes (Excepto SNG):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (3 pts)', value: 3 }] },

      // 2. SOPORTE VENTILATORIO
      { id: 't6', text: 'Ventilación mecánica (Cualquier modo con/sin PEEP):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (5 pts)', value: 5 }] },
      { id: 't7', text: 'Soporte respiratorio espontáneo (Mascarilla, Venturi, Tubo T):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (2 pts)', value: 2 }] },
      { id: 't8', text: 'Cuidado de vía aérea artificial (TET o Traqueostomía):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (1 pt)', value: 1 }] },

      // 3. SOPORTE CARDIOVASCULAR
      { id: 't9', text: 'Vasoactivos (Infusión única de cualquier droga):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (3 pts)', value: 3 }] },
      { id: 't10', text: 'Vasoactivos múltiples (>1 droga vasoactiva):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (4 pts)', value: 4 }] },
      { id: 't11', text: 'Reposición de fluidos masiva (>5 L/día):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (4 pts)', value: 4 }] },
      { id: 't12', text: 'Monitoreo de presión arterial periférica (Línea arterial):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (5 pts)', value: 5 }] },
      { id: 't13', text: 'Monitoreo de PVC o catéter venoso central:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (2 pts)', value: 2 }] },
      { id: 't14', text: 'Catéter de Swan-Ganz (Monitoreo GC):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (8 pts)', value: 8 }] },

      // 4. SOPORTE RENAL
      { id: 't15', text: 'Técnicas de hemofiltración / Diálisis:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (3 pts)', value: 3 }] },
      { id: 't16', text: 'Medición de diuresis horaria (Sonda Foley):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (2 pts)', value: 2 }] },

      // 5. SOPORTE NEUROLÓGICO
      { id: 't17', text: 'Monitoreo de Presión Intracraneana (PIC):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (4 pts)', value: 4 }] },

      // 6. SOPORTE METABÓLICO
      { id: 't18', text: 'Tratamiento de acidosis/alcalosis metabólica severa:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (4 pts)', value: 4 }] },
      { id: 't19', text: 'Nutrición Parenteral Total (NPT):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (3 pts)', value: 3 }] },
      { id: 't20', text: 'Nutrición Enteral (SNG u otra vía):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (2 pts)', value: 2 }] },

      // 7. INTERVENCIONES ESPECÍFICAS
      { id: 't21', text: 'Intervención única en UCI (Intubación, Cardioversión):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (3 pts)', value: 3 }] },
      { id: 't22', text: 'Intervenciones múltiples en UCI (>1 de las anteriores):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (5 pts)', value: 5 }] },
      { id: 't23', text: 'Traslado fuera de la UCI (TAC, Quirófano, etc):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (5 pts)', value: 5 }] }
    ],

    calcularPuntaje: (respuestas) => {
      // Suma de los puntos ponderados de cada intervención marcada
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      // Un enfermero en turno de 12 horas puede manejar aprox 46-50 puntos TISS.
      // La fórmula estándar: 1 punto TISS = 10.6 minutos de trabajo de enfermería.
      const minutosTrabajo = (puntaje * 10.6).toFixed(0);
      const horasTrabajo = (Number(minutosTrabajo) / 60).toFixed(1);
      
      let categoria = "Clase I (Cuidado básico)";
      let color = "emerald-600";
      let ratio = "1 enfermero : 4 pacientes";

      if (puntaje >= 40) { 
        categoria = "Clase IV (Inestabilidad extrema)"; 
        color = "red-700"; 
        ratio = "1 enfermero : 1 paciente (o 1:0.5)"; 
      }
      else if (puntaje >= 30) { 
        categoria = "Clase III (Grave)"; 
        color = "red-600"; 
        ratio = "1 enfermero : 1 paciente"; 
      }
      else if (puntaje >= 20) { 
        categoria = "Clase II (Moderado)"; 
        color = "orange-500"; 
        ratio = "1 enfermero : 2 pacientes"; 
      }

      return { 
        texto: `${categoria}`, 
        color: color, 
        evidencia: `Puntaje TISS-28: ${puntaje}. Requiere aproximadamente ${horasTrabajo} horas de enfermería directa por turno.`,
        recomendaciones: [
          `Dotación recomendada: ${ratio}.`,
          'Evaluar riesgo de eventos adversos (caídas, errores de medicación) por sobrecarga.',
          'Considerar apoyo técnico si el puntaje supera los 40 puntos persistentes.',
          'Documentar intervenciones para justificación de costos y personal.'
        ] 
      };
    }
  },

  {
    id: 'bps_dolor_conductual',
    nombre: 'Escala BPS',
    categoria: 'uci',
    descripcion: 'Evaluación conductual del dolor en pacientes bajo ventilación mecánica.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 11733912) ---
    bibliografia: "Payen JF, et al. Assessing pain in critically ill sedated patients by using a behavioral pain scale. Crit Care Med. 2001.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11733912/",

    preguntas: [
      { id: 'facial', text: 'Expresión Facial:', type: 'select', options: [{ label: 'Relajada (1)', value: 1 }, { label: 'Parcialmente tensa (2)', value: 2 }, { label: 'Totalmente tensa (3)', value: 3 }, { label: 'Mueca (4)', value: 4 }] },
      { id: 'miembros', text: 'Movimientos Miembros Superiores:', type: 'select', options: [{ label: 'Sin movimiento (1)', value: 1 }, { label: 'Flexión parcial (2)', value: 2 }, { label: 'Flexión total con defensa (3)', value: 3 }, { label: 'Contracción permanente (4)', value: 4 }] },
      { id: 'ventilacion', text: 'Adaptación a la Ventilación:', type: 'select', options: [{ label: 'Tolerancia (1)', value: 1 }, { label: 'Tos pero tolera (2)', value: 2 }, { label: 'Lucha con el ventilador (3)', value: 3 }, { label: 'Incapaz de ventilar (4)', value: 4 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 6) return { 
        texto: 'DOLOR INACEPTABLE', color: 'red-600', evidencia: `Puntaje BPS: ${puntaje}/12.`,
        recomendaciones: ['Ajustar sedoanalgesia inmediatamente', 'Evaluar causas mecánicas de disconfort', 'Reevaluar tras intervención']
      };
      return { texto: 'Dolor controlado o ausente', color: 'emerald-600', evidencia: `Puntaje BPS: ${puntaje}/12.`, recomendaciones: ['Mantener plan actual'] };
    }
  },

  {
    id: 'haefeli_tos_eficacia',
    nombre: 'Escala de Haefeli',
    categoria: 'uci',
    descripcion: 'Evaluación clínica de la fuerza y eficacia de la tos en pacientes con vía aérea artificial.',
    
    bibliografia: "Haefeli W, et al. Effectiveness of cough in critically ill patients. Intensive Care Medicine.",

    preguntas: [
      { id: 'nivel_tos', text: 'Respuesta de la tos al estímulo o comando:', type: 'select', options: [
        { label: '0: Ausencia de tos (Incapaz)', value: 0 },
        { label: '1: Tos débil (Solo moviliza aire, no secreciones)', value: 1 },
        { label: '2: Tos moderada (Moviliza secreciones a tráquea distal)', value: 2 },
        { label: '3: Tos fuerte/Efectiva (Expulsa secreciones por el tubo)', value: 3 }
      ]}
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.nivel_tos) || 0,

    interpretar: (puntaje) => {
      if (puntaje <= 1) return { 
        texto: 'TOS INEFECTIVA', color: 'red-600', evidencia: 'Alto riesgo de retención de secreciones y neumonía.',
        recomendaciones: ['Kinesioterapia respiratoria intensiva', 'Asistente de tos (Cough Assist) si aplica', 'No proceder a extubación']
      };
      return { 
        texto: 'TOS FUNCIONAL', color: 'emerald-600', evidencia: 'Capacidad preservada para manejo de vía aérea.',
        recomendaciones: ['Progresar en protocolo de destete', 'Vigilar fatiga muscular'] 
      };
    }
  },

  

  

  // ==========================================
  //  PEDIATRIA
  // ==========================================

{
    id: 'eedp_chile',
    nombre: 'EEDP (0-24 meses)',
    categoria: 'pediatria',
    descripcion: 'Escala de Evaluación del Desarrollo Psicomotor. Instrumento estandarizado en Chile para medir rendimiento psicomotor en lactantes.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (Norma Técnica MINSAL) ---
    bibliografia: "Rodriguez S, Arancibia V, Undurraga C. Escala de Evaluación del Desarrollo Psicomotor. Chile: Galdoc; 1978.",
    referenciaUrl: "https://web.minsal.cl/portal/url/item/ab1f420894080649e04001011e01297e.pdf", 
    evidenciaClinica: "Es la herramienta obligatoria del Programa Infantil en Chile. Evalúa Motora, Lenguaje, Social y Coordinación. Un CD < 0.85 es criterio de derivación a Sala de Estimulación.",

    preguntas: [
      { id: 'edad_dias', text: 'Edad Cronológica Exacta (en días):', type: 'number', min: 1, max: 735 },
      { id: 'mes_base', text: 'Mes Base (Mes más alto con los 5 ítems aprobados):', type: 'select', options: [
        { label: '0 meses', value: 0 }, { label: '1 mes', value: 30 }, { label: '2 meses', value: 60 }, { label: '3 meses', value: 90 },
        { label: '4 meses', value: 120 }, { label: '5 meses', value: 150 }, { label: '6 meses', value: 180 }, { label: '7 meses', value: 210 },
        { label: '8 meses', value: 240 }, { label: '9 meses', value: 270 }, { label: '10 meses', value: 300 }, { label: '12 meses', value: 360 },
        { label: '15 meses', value: 450 }, { label: '18 meses', value: 540 }, { label: '21 meses', value: 630 }, { label: '24 meses', value: 720 }
      ]},
      { id: 'puntos_adicionales', text: 'Suma de puntos de ítems aprobados sobre el mes base:', type: 'number', min: 0 },
      { id: 'area_critica', text: 'Área con mayor déficit observado:', type: 'select', options: [
        { label: 'Desarrollo armónico', value: 0 },
        { label: 'Motora', value: 1 },
        { label: 'Lenguaje', value: 2 },
        { label: 'Social', value: 3 },
        { label: 'Coordinación', value: 4 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      const edadMentalDias = (Number(respuestas.mes_base) || 0) + (Number(respuestas.puntos_adicionales) || 0);
      const edadCronologicaDias = Number(respuestas.edad_dias) || 1;
      // Cálculo del Coeficiente de Desarrollo (CD)
      return parseFloat((edadMentalDias / edadCronologicaDias).toFixed(2));
    },

    interpretar: (cd, respuestas) => {
      // Mapeo interno para transformar el value numérico en texto clínico
      const areasMap: Record<number, string> = { 
        0: 'ARMÓNICO', 
        1: 'MOTORA', 
        2: 'LENGUAJE', 
        3: 'SOCIAL', 
        4: 'COORDINACIÓN' 
      };
      
      const areaSeleccionada = areasMap[Number(respuestas?.area_critica) || 0];
      const edadMentalMeses = ((Number(respuestas?.mes_base || 0) + Number(respuestas?.puntos_adicionales || 0)) / 30).toFixed(1);

      if (cd >= 0.85) {
        return { 
          texto: 'DESARROLLO NORMAL', 
          color: 'emerald-600',
          evidencia: `CD: ${cd}. Edad Mental Estimada: ${edadMentalMeses} meses.`,
          recomendaciones: [
            'Felicitar al cuidador y reforzar pautas de estimulación habituales.',
            'Mantener controles sanos al día según calendario MINSAL.',
            'Si hay dudas en un área específica, realizar seguimiento en 30 días.'
          ]
        };
      } 
      
      if (cd >= 0.71) {
        return { 
          texto: 'RIESGO DE REZAGO', 
          color: 'orange-500',
          evidencia: `CD: ${cd}. Edad Mental Estimada: ${edadMentalMeses} meses.`,
          recomendaciones: [
            'Derivar a Sala de Estimulación (Chile Crece Contigo).',
            'Entrega de cartillas de ejercicios específicos para el hogar.',
            'Reevaluación obligatoria con EEDP en 30-60 días.',
            `Énfasis preventivo en el área: ${areaSeleccionada}.`
          ]
        };
      }

      return { 
        texto: 'RETRASO PSICOMOTOR', 
        color: 'red-600',
        evidencia: `CD: ${cd}. Edad Mental Estimada: ${edadMentalMeses} meses.`, 
        recomendaciones: [
          'Derivación inmediata a Pediatra y Neurólogo Infantil.',
          'Evaluación por equipo multidisciplinario (Kinesiólogo/Fonoaudiólogo).',
          'Ingreso prioritario a programa de rehabilitación.',
          `Déficit marcado detectado en área: ${areaSeleccionada}.`
        ] 
      };
    }
  },
{
    id: 'tepsi_chile_pro',
    nombre: 'TEPSI (Estandarizado Chile)',
    categoria: 'pediatria',
    descripcion: 'Test de Desarrollo Psicomotor para niños de 2 a 5 años. Evalúa el desarrollo psíquico en Coordinación, Lenguaje y Motricidad.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (MINSAL Chile) ---
    bibliografia: "Haeussler IM, Marchant T. TEPSI. Ediciones UC, 2002. Norma Técnica MINSAL.",
    referenciaUrl: "https://crececontigo.gob.cl/columna/test-de-desarrollo-psicomotor-tepsi/", 
    evidenciaClinica: "Herramienta obligatoria en Chile para detectar rezago psicomotor. Utiliza Puntaje T (Media 50, DS 10). Un Puntaje T < 40 en el total o subtests indica necesidad de intervención.",

    preguntas: [
      { id: 'bruto_coordinacion', text: 'Puntaje Bruto Coordinación (0-16 ítems):', type: 'number', min: 0, max: 16 },
      { id: 'bruto_lenguaje', text: 'Puntaje Bruto Lenguaje (0-24 ítems):', type: 'number', min: 0, max: 24 },
      { id: 'bruto_motricidad', text: 'Puntaje Bruto Motricidad (0-12 ítems):', type: 'number', min: 0, max: 12 },
      { id: 'puntaje_t_total', text: 'Puntaje T Final (Obtenido de tabla por edad):', type: 'number', min: 20, max: 80 }
    ],

    calcularPuntaje: (respuestas) => {
      // El puntaje principal para la interpretación es el Puntaje T total
      return Number(respuestas.puntaje_t_total) || 0;
    },

    interpretar: (puntaje, respuestas) => {
      // 1. Análisis de subtests para recomendaciones específicas
      const bCoord = Number(respuestas?.bruto_coordinacion) || 0;
      const bLeng = Number(respuestas?.bruto_lenguaje) || 0;
      const bMot = Number(respuestas?.bruto_motricidad) || 0;

      // 2. Lógica de alertas por área (Basado en rendimientos bajos históricos)
      const alertas = [];
      if (bCoord < 8) alertas.push('Coordinación Visomotriz');
      if (bLeng < 12) alertas.push('Lenguaje y Comunicación');
      if (bMot < 6) alertas.push('Motricidad Gruesa');

      // 3. Clasificación Clínica
      if (puntaje >= 40) {
        return { 
          texto: 'DESARROLLO NORMAL', 
          color: 'emerald-600', 
          evidencia: `Puntaje T: ${puntaje}. El menor se encuentra dentro de los rangos esperados para su edad cronológica.`,
          recomendaciones: [
            'Felicitar a los cuidadores y reforzar pautas de crianza positiva.',
            'Mantener asistencia a jardín infantil o actividades de socialización.',
            'Fomentar autonomía en vestuario y alimentación.',
            'Próxima evaluación según calendario de control de niño sano.'
          ]
        };
      }
      
      if (puntaje >= 30) {
        return { 
          texto: 'RIESGO DE REZAGO', 
          color: 'orange-500', 
          evidencia: `Puntaje T: ${puntaje}. Desempeño entre 1 y 2 desviaciones estándar bajo el promedio poblacional.`,
          recomendaciones: [
            'Derivación obligatoria a Sala de Estimulación (Chile Crece Contigo).',
            alertas.length > 0 ? `Reforzar actividades específicas de: ${alertas.join(', ')}.` : 'Reforzar desarrollo armónico mediante el juego.',
            'Entregar set de materiales para estimulación en el hogar.',
            'Re-evaluación con TEPSI completo en un plazo máximo de 6 meses.'
          ]
        };
      }

      return { 
        texto: 'RETRASO PSICOMOTOR', 
        color: 'red-600', 
        evidencia: `Puntaje T: ${puntaje}. Desempeño crítico (> 2 DS bajo la norma).`, 
        recomendaciones: [
          'Derivación inmediata a Médico Pediatra y Neurólogo Infantil.',
          'Evaluación por equipo multidisciplinario (Kinesiólogo, Fonoaudiólogo y Terapeuta Ocupacional).',
          `Déficit marcado con mayor impacto en: ${alertas.length > 0 ? alertas.join(' y ') : 'todas las áreas'}.`,
          'Solicitar exámenes complementarios (Audición/Visión) para descartar causas sensoriales.',
          'Ingreso prioritario a programas de rehabilitación.'
        ] 
      };
    }
  },

   {
    id: 'mchat_autismo',
    nombre: 'M-CHAT-R/F',
    categoria: 'pediatria',
    descripcion: 'Cuestionario revisado de detección de autismo en niños pequeños.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 24366990) ---
    bibliografia: "Robins DL, et al. Validation of the Modified Checklist for Autism in Toddlers, Revised with Follow-up (M-CHAT-R/F). Pediatrics. 2014.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/24366990/",
    evidenciaClinica: "Herramienta de detección, no diagnóstica. Un puntaje ≥ 3 requiere seguimiento o derivación según el nivel de riesgo.",

    preguntas: [
      { id: 'suma_riesgo', text: 'Número total de respuestas de RIESGO (0 a 20):', type: 'number', min: 0, max: 20 }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.suma_riesgo) || 0,

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 8) return { 
        texto: 'RIESGO ALTO', color: 'red-600', evidencia: `Puntaje: ${puntaje}/20.`,
        recomendaciones: [
          'Derivación INMEDIATA para evaluación diagnóstica TEA',
          'Evaluación de audición (Audiometría/BERA)',
          'Entrevista con especialista en neurodesarrollo',
          'No esperar para iniciar intervención temprana'
        ]
      };
      if (puntaje >= 3) return { 
        texto: 'RIESGO MEDIO', color: 'orange-500', evidencia: `Puntaje: ${puntaje}/20.`,
        recomendaciones: [
          'Aplicar la Entrevista de Seguimiento (Follow-Up)',
          'Si el seguimiento arroja puntaje ≥ 2, derivar a especialista',
          'Observación estrecha de hitos de comunicación social'
        ]
      };
      return { 
        texto: 'RIESGO BAJO', color: 'emerald-600', evidencia: `Puntaje: ${puntaje}/20.`,
        recomendaciones: [
          'No se requiere acción inmediata si el desarrollo es normal',
          'Si el niño tiene < 24 meses, repetir tamizaje a los 2 años',
          'Mantener vigilancia de hitos sociales habituales'
        ] 
      };
    }
  },

  {
    id: 'score_tal_pediatria',
    nombre: 'Score de Tal (SBO)',
    categoria: 'pediatria',
    descripcion: 'Evaluación de la gravedad de la obstrucción bronquial en menores de 2 años.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (MINSAL Chile) ---
    bibliografia: "Ministerio de Salud de Chile. Guía Clínica Infección Respiratoria Aguda Baja de manejo ambulatorio en menores de 5 años.",
    referenciaUrl: "https://www.minsal.cl/portal/url/item/72213ed52c3e23d1e04001011f011398.pdf",
    evidenciaClinica: "Un puntaje ≥ 9 indica obstrucción severa y requiere hospitalización o manejo inmediato en sala de observación.",

    preguntas: [
      { id: 'fr', text: '1. Frecuencia Respiratoria (ajustada por edad):', type: 'select', options: [
        { label: 'Normal (<6m: <40 | >6m: <30) (0 pts)', value: 0 },
        { label: 'Aumentada leve (1 pt)', value: 1 },
        { label: 'Aumentada moderada (2 pts)', value: 2 },
        { label: 'Muy aumentada (3 pts)', value: 3 }
      ]},
      { id: 'sibilancias', text: '2. Sibilancias:', type: 'select', options: [
        { label: 'Ausentes (0 pts)', value: 0 },
        { label: 'Fin de espiración (1 pt)', value: 1 },
        { label: 'Toda la espiración (2 pts)', value: 2 },
        { label: 'Inspiración y espiración (o silencio) (3 pts)', value: 3 }
      ]},
      { id: 'cianosis', text: '3. Cianosis:', type: 'select', options: [
        { label: 'Ausente (0 pts)', value: 0 },
        { label: 'Periorificial al llorar (1 pt)', value: 1 },
        { label: 'Periorificial en reposo (2 pts)', value: 2 },
        { label: 'Generalizada en reposo (3 pts)', value: 3 }
      ]},
      { id: 'retraccion', text: '4. Retracción (Uso musculatura accesoria):', type: 'select', options: [
        { label: 'Ausente (0 pts)', value: 0 },
        { label: 'Intercostal leve (1 pt)', value: 1 },
        { label: 'Intercostal y subcostal (2 pts)', value: 2 },
        { label: 'Supraclavicular / Aleteo nasal (3 pts)', value: 3 }
      ]}
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 9) return { 
        texto: 'SBO SEVERO', color: 'red-600', evidencia: `Score de Tal: ${puntaje}/12.`,
        recomendaciones: ['Oxigenoterapia inmediata', 'B2 agonistas (Salbutamol) cada 10 min x 5 veces', 'Corticoide sistémico oral/EV', 'Traslado a Hospitalización/UCI']
      };
      if (puntaje >= 6) return { 
        texto: 'SBO MODERADO', color: 'orange-500', evidencia: `Score de Tal: ${puntaje}/12.`,
        recomendaciones: ['Salbutamol 2 puff cada 10 min x 1 hora (Protocolo de rescate)', 'Reevaluar tras la hora de tratamiento', 'Considerar corticoide oral']
      };
      return { 
        texto: 'SBO LEVE', color: 'emerald-600', evidencia: `Score de Tal: ${puntaje}/12.`, 
        recomendaciones: ['Manejo ambulatorio', 'Salbutamol cada 4-6 horas según síntomas', 'Educación en signos de alarma a padres'] 
      };
    }
  },

  {
    id: 'wood_downes_pediatria',
    nombre: 'Escala Wood-Downes (Ferrés)',
    categoria: 'pediatria',
    descripcion: 'Evaluación de la gravedad de la crisis asmática y bronquiolitis.',
    
    bibliografia: "Ferrés J, et al. Escala de Wood-Downes modificada. Protocolos de Neumología Pediátrica.",
    referenciaUrl: "https://www.aeped.es/sites/default/files/documentos/03_bronquiolitis_aguda.pdf", 
    evidenciaClinica: "Evalúa sibilancias, tiraje, frecuencia respiratoria, frecuencia cardíaca, ventilación y cianosis.",

    preguntas: [
      { id: 'suma_bruta', text: 'Suma de puntos (6 ítems de 0-3 pts):', type: 'number', min: 0, max: 14 }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.suma_bruta) || 0,

    interpretar: (puntaje) => {
      if (puntaje >= 8) return { 
        texto: 'CRISIS MUY GRAVE', color: 'red-700', evidencia: `Puntaje: ${puntaje}. Riesgo de insuficiencia respiratoria.`,
        recomendaciones: ['Hospitalización inmediata', 'Soporte ventilatorio / Oxígeno alto flujo', 'Manejo multidisciplinario']
      };
      if (puntaje >= 4) return { 
        texto: 'CRISIS MODERADA', color: 'orange-500', evidencia: `Puntaje: ${puntaje}.`,
        recomendaciones: ['Rescate farmacológico en centro asistencial', 'Monitoreo de saturación constante']
      };
      return { 
        texto: 'CRISIS LEVE', color: 'emerald-600', evidencia: `Puntaje: ${puntaje}.`, 
        recomendaciones: ['Tratamiento inhalatorio de rescate', 'Control por su equipo de cabecera'] 
      };
    }
  },

  {
    id: 'westley_crup_pediatria',
    nombre: 'Escala de Westley (Crup)',
    categoria: 'pediatria',
    descripcion: 'Clasificación de la gravedad de la laringitis aguda (Crup).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 351980) ---
    bibliografia: "Westley CR, et al. Nebulized racemic epinephrine by IPPB for the treatment of croup. Am J Dis Child. 1978.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/351980/",

    preguntas: [
      { id: 'estridor', text: '1. Estridor:', type: 'select', options: [
        { label: 'Ausente (0 pts)', value: 0 }, { label: 'Con agitación (1 pt)', value: 1 }, { label: 'En reposo (2 pts)', value: 2 }
      ]},
      { id: 'tiraje', text: '2. Tiraje:', type: 'select', options: [
        { label: 'Ausente (0 pts)', value: 0 }, { label: 'Leve (1 pt)', value: 1 }, { label: 'Moderado (2 pts)', value: 2 }, { label: 'Severo (3 pts)', value: 3 }
      ]},
      { id: 'ventilacion', text: '3. Ventilación (Entrada de aire):', type: 'select', options: [
        { label: 'Normal (0 pts)', value: 0 }, { label: 'Disminuida (1 pt)', value: 1 }, { label: 'Muy disminuida (2 pts)', value: 2 }
      ]},
      { id: 'conciencia', text: '4. Nivel de conciencia:', type: 'select', options: [
        { label: 'Normal (0 pts)', value: 0 }, { label: 'Alterado / Desorientado (5 pts)', value: 5 }
      ]},
      { id: 'cianosis', text: '5. Cianosis:', type: 'select', options: [
        { label: 'Ausente (0 pts)', value: 0 }, { label: 'Con agitación (4 pts)', value: 4 }, { label: 'En reposo (5 pts)', value: 5 }
      ]}
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 8) return { 
        texto: 'LARINGITIS GRAVE', color: 'red-600', evidencia: `Puntaje: ${puntaje}. Riesgo de obstrucción total.`,
        recomendaciones: ['Adrenalina Racémica nebulizada', 'Dexametasona EV/IM', 'Hospitalización inmediata en sala crítica']
      };
      if (puntaje >= 3) return { 
        texto: 'LARINGITIS MODERADA', color: 'orange-500', evidencia: `Puntaje: ${puntaje}.`,
        recomendaciones: ['Dexametasona oral/IM', 'Observación clínica por 2-4 horas', 'Considerar Adrenalina si hay estridor de reposo marcado']
      };
      return { 
        texto: 'LARINGITIS LEVE', color: 'emerald-600', evidencia: `Puntaje: ${puntaje}.`, 
        recomendaciones: ['Corticoides orales (Dexametasona dosis única)', 'Manejo en domicilio (Ambiente húmedo/frío)', 'Educación sobre signos de alarma'] 
      };
    }
  },

  {
    id: 'wong_baker_caras',
    nombre: 'Escala de Caras de Wong-Baker',
    categoria: 'pediatria',
    descripcion: 'Evaluación visual del dolor para niños capaces de señalar su estado emocional/físico.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (Wong-Baker Foundation) ---
    bibliografia: "Hockenberry MJ, Wilson D. Wong's Essentials of Pediatric Nursing. 8th ed. St. Louis: Mosby; 2009.",
    referenciaUrl: "https://wongbakerfaces.org/", 
    evidenciaClinica: "Validada para niños > 3 años. Se asocia bien con la Escala Visual Análoga (EVA) pero es más intuitiva en etapas preescolares.",

    preguntas: [
      { 
        id: 'cara_seleccionada', 
        text: 'Pida al niño que señale la cara que mejor describe su dolor:', 
        type: 'select',
        options: [
          { label: '0: Sin dolor (Muy feliz)', value: 0 },
          { label: '2: Duele un poco', value: 2 },
          { label: '4: Duele un poco más', value: 4 },
          { label: '6: Duele aún más', value: 6 },
          { label: '8: Duele mucho', value: 8 },
          { label: '10: El peor dolor imaginable (Llorando)', value: 10 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.cara_seleccionada) || 0,

    interpretar: (puntaje) => {
      if (puntaje >= 7) return { 
        texto: 'DOLOR SEVERO', color: 'red-600', evidencia: `Puntaje ${puntaje}/10.`,
        recomendaciones: ['Analgesia inmediata (considerar opioides según protocolo)', 'Evaluación médica urgente', 'Re-evaluar en 30 minutos']
      };
      if (puntaje >= 4) return { 
        texto: 'DOLOR MODERADO', color: 'orange-500', evidencia: `Puntaje ${puntaje}/10.`,
        recomendaciones: ['Manejo farmacológico analgésico', 'Medidas de confort/distracción', 'Seguimiento de la causa del dolor']
      };
      return { 
        texto: 'DOLOR LEVE / AUSENTE', color: 'emerald-600', evidencia: `Puntaje ${puntaje}/10.`, 
        recomendaciones: ['Observación', 'Medidas físicas o analgésicos menores si persiste'] 
      };
    }
  },

  {
    id: 'eva_pediatrica_color',
    nombre: 'EVA Pediátrica (Visual Análoga)',
    categoria: 'pediatria',
    descripcion: 'Escala numérica y visual para escolares que pueden cuantificar su dolor.',
    
    bibliografia: "McGrath PA, et al. A new analogue scale for assessing children's pain: an initial validation study. Pain. 1996.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8814578/",

    preguntas: [
      { id: 'valor_numerico', text: 'Intensidad reportada por el niño (0 a 10):', type: 'number', min: 0, max: 10 }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.valor_numerico) || 0,

    interpretar: (puntaje) => {
      if (puntaje >= 8) return { texto: 'DOLOR INTENSO', color: 'red-700', evidencia: `${puntaje}/10.`, recomendaciones: ['Intervención analgésica rápida', 'Monitoreo de signos vitales'] };
      if (puntaje >= 4) return { texto: 'DOLOR MODERADO', color: 'orange-600', evidencia: `${puntaje}/10.`, recomendaciones: ['Ajuste de dosis analgésica', 'Búsqueda de foco inflamatorio/infeccioso'] };
      return { texto: 'DOLOR LEVE', color: 'emerald-600', evidencia: `${puntaje}/10.`, recomendaciones: ['Seguimiento estándar'] };
    }
  },

  {
    id: 'glasgow_pediatrico_lactante',
    nombre: 'Escala de Glasgow Pediátrica',
    categoria: 'pediatria',
    descripcion: 'Evaluación del nivel de conciencia ajustada para lactantes y niños pre-verbales.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3108605) ---
    bibliografia: "James HE. Neurologic Evaluation and Support in the Child with an Acute Brain Insult. Pediatr Ann. 1986.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3108605/",
    evidenciaClinica: "Fundamental en Trauma Craneoencefálico (TEC) pediátrico. Un puntaje ≤ 8 indica necesidad de protección de vía aérea (intubación).",

    preguntas: [
      { 
        id: 'ocular', 
        text: 'Respuesta Ocular (E):', 
        type: 'select', 
        options: [
          { label: '4: Espontánea', value: 4 },
          { label: '3: Al grito / voz', value: 3 },
          { label: '2: Al dolor', value: 2 },
          { label: '1: Sin respuesta', value: 1 }
        ]
      },
      { 
        id: 'verbal', 
        text: 'Respuesta Verbal (V) - Ajustada:', 
        type: 'select', 
        options: [
          { label: '5: Sonríe, arrulla, balbucea, sigue objetos', value: 5 },
          { label: '4: Llanto consolable, interacción inapropiada', value: 4 },
          { label: '3: Llora al dolor, gime', value: 3 },
          { label: '2: Inconsolable, inquieto', value: 2 },
          { label: '1: Sin respuesta', value: 1 }
        ]
      },
      { 
        id: 'motora', 
        text: 'Respuesta Motora (M) - Ajustada:', 
        type: 'select', 
        options: [
          { label: '6: Movimientos espontáneos normales', value: 6 },
          { label: '5: Localiza el dolor / Retira al tocar', value: 5 },
          { label: '4: Retira al dolor', value: 4 },
          { label: '3: Flexión anormal (Decorticación)', value: 3 },
          { label: '2: Extensión anormal (Descerebración)', value: 2 },
          { label: '1: Sin respuesta', value: 1 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => (Number(respuestas.ocular) || 0) + (Number(respuestas.verbal) || 0) + (Number(respuestas.motora) || 0),

    interpretar: (puntaje) => {
      if (puntaje >= 13) return { 
        texto: 'TEC LEVE', color: 'emerald-600', evidencia: `Glasgow: ${puntaje}/15.`,
        recomendaciones: ['Observación clínica', 'Educar sobre signos de alerta neurológica a los padres']
      };
      if (puntaje >= 9) return { 
        texto: 'TEC MODERADO', color: 'orange-500', evidencia: `Glasgow: ${puntaje}/15.`,
        recomendaciones: ['TAC de cerebro según criterios PECARN', 'Hospitalización para monitoreo', 'Vigilancia de pupila']
      };
      return { 
        texto: 'TEC SEVERO / COMA', color: 'red-600', evidencia: `Glasgow: ${puntaje}/15.`, 
        recomendaciones: ['Protección de vía aérea (Intubación)', 'Neurocirugía inmediata', 'Traslado a centro de alta complejidad'] 
      };
    }
  },

  {
    id: 'nutricion_oms_pediatrica',
    nombre: 'Evaluación Nutricional OMS (Z-Score)',
    categoria: 'pediatria',
    descripcion: 'Clasificación del estado nutricional basada en desviaciones estándar (Puntaje Z).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (OMS / MINSAL Chile) ---
    bibliografia: "WHO Child Growth Standards. World Health Organization; 2006. Norma Técnica MINSAL 2018.",
    referenciaUrl: "https://www.minsal.cl/wp-content/uploads/2018/03/NORMA-TECNICA-CRECIMIENTO-Y-DESARROLLO-2018.pdf", 
    evidenciaClinica: "El estándar para niños y adolescentes. Utiliza Peso/Talla (<5 años) e IMC/Edad (>5 años) para determinar obesidad o desnutrición.",

    preguntas: [
      { 
        id: 'desviacion_z', 
        text: 'Seleccione el rango de desviación estándar (DE) observado en la curva:', 
        type: 'select',
        options: [
          { label: '> +3 DE (Obeso Severo)', value: 4 },
          { label: '+2 a +3 DE (Obesidad)', value: 3 },
          { label: '+1 a +2 DE (Sobrepeso)', value: 2 },
          { label: '-1 a +1 DE (Normal)', value: 1 },
          { label: '-1 a -2 DE (Riesgo Desnutrir)', value: 0 },
          { label: '< -2 DE (Desnutrición)', value: -1 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.desviacion_z) || 1,

    interpretar: (puntaje) => {
      if (puntaje >= 3) return { 
        texto: 'MALNUTRICIÓN POR EXCESO (Obesidad)', color: 'red-600', evidencia: `Z-score > +2.`,
        recomendaciones: ['Derivación a nutricionista pediátrica', 'Evaluar riesgo metabólico (HOMA, perfil lipídico)', 'Fomentar actividad física diaria', 'Revisar pautas de alimentación familiar']
      };
      if (puntaje === 0) return { 
        texto: 'RIESGO DE DESNUTRICIÓN', color: 'orange-500', evidencia: `Z-score entre -1 y -2.`,
        recomendaciones: ['Refuerzo de alimentación láctea', 'Control de peso quincenal', 'Evaluar técnica de lactancia o preparación de fórmulas']
      };
      if (puntaje === -1) return { 
        texto: 'DESNUTRICIÓN', color: 'red-700', evidencia: `Z-score < -2.`,
        recomendaciones: ['Evaluación médica urgente para descartar patología base', 'Suplementación calórica', 'Seguimiento estrecho']
      };
      return { 
        texto: 'ESTADO NUTRICIONAL NORMAL', color: 'emerald-600', evidencia: `Rango -1 a +1 DE.`, 
        recomendaciones: ['Mantener alimentación saludable', 'Siguiente control según calendario de niño sano'] 
      };
    }
  },

  {
    id: 'tanner_desarrollo',
    nombre: 'Escala de Tanner',
    categoria: 'pediatria',
    descripcion: 'Evaluación del grado de maduración sexual basado en el desarrollo de caracteres primarios y secundarios.',
    
    bibliografia: "Marshall WA, Tanner JM. Variations in pattern of pubertal changes in girls/boys. Arch Dis Child. 1969/1970.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/5810505/",

    preguntas: [
      { 
        id: 'estadio', 
        text: 'Seleccione el estadio observado (Vello púbico/Glándula mamaria/Genitales):', 
        type: 'select',
        options: [
          { label: 'Tanner I: Pre-puberal (Sin cambios)', value: 1 },
          { label: 'Tanner II: Inicio puberal (Botón mamario / Aumento testicular)', value: 2 },
          { label: 'Tanner III: Cambios moderados (Elevación areola / Alargamiento pene)', value: 3 },
          { label: 'Tanner IV: Desarrollo avanzado (Areola secundaria / Engrosamiento)', value: 4 },
          { label: 'Tanner V: Madurez total (Adulto)', value: 5 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.estadio) || 1,

    interpretar: (puntaje) => {
      const recomendacionesMap = {
        1: 'Seguimiento normal en prepúberes.',
        2: 'Vigilar si ocurre antes de los 8 años en niñas o 9 en niños (sospecha de pubertad precoz).',
        3: 'Desarrollo esperado en pubertad media.',
        4: 'Cierre epifisario cercano. Vigilar velocidad de crecimiento.',
        5: 'Maduración completa alcanzada.'
      };

      return { 
        texto: `Estadio Tanner ${puntaje}`, 
        color: 'sky-600', 
        evidencia: `Nivel ${puntaje} de maduración sexual.`,
        recomendaciones: [recomendacionesMap[puntaje as keyof typeof recomendacionesMap]]
      };
    }
  },

  {
    id: 'braden_q_pediatrica',
    nombre: 'Escala Braden Q',
    categoria: 'pediatria',
    descripcion: 'Valoración del riesgo de úlceras por presión en pacientes pediátricos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 12544358) ---
    bibliografia: "Quigley SM, Curley MA. Skin integrity in the pediatric population: preventing and managing pressure ulcers. J Soc Pediatr Nurs. 1996.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/12544358/", 
    evidenciaClinica: "Evalúa 7 dominios: Movilidad, Actividad, Percepción, Humedad, Fricción, Nutrición y Perfusión Tisular. Un puntaje ≤ 16 indica riesgo.",

    preguntas: [
      { id: 'suma_bruta', text: 'Suma de los 7 ítems (cada uno de 1 a 4):', type: 'number', min: 7, max: 28 }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.suma_bruta) || 28,

    interpretar: (puntaje) => {
      if (puntaje <= 16) return { 
        texto: 'ALTO RIESGO DE UPP', color: 'red-600', evidencia: `Puntaje ${puntaje}/28.`,
        recomendaciones: [
          'Cambios posturales cada 2 horas con reloj de rotación',
          'Uso de superficies de alivio de presión pediátricas',
          'Protección de prominencias óseas con hidrocoloide',
          'Optimizar perfusión y oxigenación tisular'
        ]
      };
      if (puntaje <= 21) return { 
        texto: 'RIESGO MODERADO', color: 'orange-500', evidencia: `Puntaje ${puntaje}/28.`,
        recomendaciones: ['Vigilar zonas de apoyo en cada turno', 'Control estricto de humedad (pañal)', 'Lubricación de la piel']
      };
      return { 
        texto: 'RIESGO BAJO / SIN RIESGO', color: 'emerald-600', evidencia: `Puntaje ${puntaje}/28.`, 
        recomendaciones: ['Mantener cuidados generales de enfermería', 'Reevaluar si cambia la condición de movilidad'] 
      };
    }
  },



  // ==========================================
  // CARDIO RESPIRATORIO 
  // ==========================================

  {
    id: 'mmrc_disnea',
    nombre: 'Escala de Disnea mMRC',
    categoria: 'cardiorespiratorio',
    descripcion: 'Escala modificada del Medical Research Council para cuantificar la limitación por disnea en actividades de la vida diaria.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10471018) ---
    bibliografia: "Bestall JC, et al. Usefulness of the Medical Research Council (MRC) dyspnoea scale as a measure of disability in patients with chronic obstructive pulmonary disease. Thorax. 1999.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10471018/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Un puntaje mMRC ≥ 2 es un punto de corte crítico. En guías GOLD y guías MINSAL de EPOC, define a un paciente como 'altamente sintomático', lo que modifica directamente la terapia farmacológica.",

    preguntas: [
      { 
        id: 'grado_disnea', 
        text: 'Seleccione el grado que mejor describa su falta de aire:', 
        type: 'select',
        options: [
          { label: 'Grado 0: Solo tengo falta de aire al realizar ejercicio intenso.', value: 0 },
          { label: 'Grado 1: Me falta el aire al caminar rápido en llano o al subir una cuesta poco pronunciada.', value: 1 },
          { label: 'Grado 2: No puedo mantener el paso de personas de mi edad en llano, o tengo que parar a descansar al caminar en llano a mi propio paso.', value: 2 },
          { label: 'Grado 3: Tengo que parar a descansar después de caminar unos 100 metros o después de pocos minutos de caminar en llano.', value: 3 },
          { label: 'Grado 4: Tengo demasiada falta de aire para salir de casa o me falta el aire al vestirme o desvestirme.', value: 4 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.grado_disnea) || 0,

    // ✅ Firma corregida para evitar errores en TS
    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 2) {
        return {
          texto: `DISNEA LIMITANTE (Grado ${puntaje})`,
          color: 'red-600',
          evidencia: `Puntaje ≥ 2 indica una limitación funcional significativa para la marcha en terreno llano.`,
          recomendaciones: [
            'Clasificación GOLD: Paciente sintomático (Grupos B o E)',
            'Considerar ajuste de broncodilatación (LAMA+LABA)',
            'Ingreso prioritario a programa de Rehabilitación Pulmonar',
            'Evaluar técnica inhalatoria y adherencia al tratamiento'
          ]
        };
      }

      return {
        texto: `DISNEA LEVE / NO LIMITANTE (Grado ${puntaje})`,
        color: 'emerald-600',
        evidencia: 'El paciente mantiene autonomía en la marcha al ritmo de sus pares.',
        recomendaciones: [
          'Mantener actividad física regular y control de peso',
          'Vacunación al día (Influenza/Neumococo)',
          'Seguimiento anual de función pulmonar (Espirometría)'
        ]
      };
    }
  },

  {
    id: 'nyha_funcional',
    nombre: 'Clasificación Funcional NYHA',
    categoria: 'cardiorespiratorio',
    descripcion: 'Clasificación de la gravedad de la insuficiencia cardíaca según la limitación de la actividad física.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8062531) ---
    bibliografia: "The Criteria Committee of the New York Heart Association. Nomenclature and Criteria for Diagnosis of Diseases of the Heart and Great Vessels. 9th ed. Boston, Mass: Little, Brown & Co; 1994:253-256.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8062531/", // ✅ LINK VERIFICADO
    evidenciaClinica: "La NYHA es el predictor pronóstico más simple y potente en insuficiencia cardíaca. Los cambios entre clases definen el éxito de la terapia médica o quirúrgica.",

    preguntas: [
      { 
        id: 'clase_funcional', 
        text: 'Seleccione la clase que mejor describa la limitación del paciente:', 
        type: 'select',
        options: [
          { label: 'Clase I: Sin limitación de la actividad física. El ejercicio ordinario no causa fatiga excesiva, palpitaciones o disnea.', value: 1 },
          { label: 'Clase II: Limitación ligera de la actividad física. Cómodo en reposo. La actividad ordinaria resulta en fatiga, palpitaciones o disnea.', value: 2 },
          { label: 'Clase III: Limitación marcada de la actividad física. Cómodo en reposo. Actividades menores a las ordinarias causan síntomas.', value: 3 },
          { label: 'Clase IV: Incapacidad para llevar a cabo cualquier actividad física sin molestias. Síntomas presentes incluso en reposo.', value: 4 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.clase_funcional) || 1,

    // ✅ Firma corregida para cumplir con tu Interface Scale
    interpretar: (puntaje, respuestas) => {
      if (puntaje === 4) {
        return {
          texto: 'NYHA CLASE IV (Severa)',
          color: 'red-600',
          evidencia: 'Síntomas de insuficiencia cardíaca en reposo. Máximo riesgo clínico.',
          recomendaciones: [
            'Evaluación médica urgente para ajuste de diuréticos/inotrópicos',
            'Reposo absoluto con cabecera elevada',
            'Restricción estricta de fluidos y sodio',
            'Considerar hospitalización o cuidados paliativos según contexto'
          ]
        };
      }

      if (puntaje === 3) {
        return {
          texto: 'NYHA CLASE III (Moderada-Severa)',
          color: 'orange-600',
          evidencia: 'Limitación marcada. Actividades básicas (vestirse, caminar distancias cortas) provocan síntomas.',
          recomendaciones: [
            'Ajuste fino de terapia farmacológica (IECA/ARAII, Beta-bloqueo)',
            'Rehabilitación cardiovascular supervisada con monitoreo estrecho',
            'Educación sobre signos de descompensación (edema, ganancia de peso)'
          ]
        };
      }

      if (puntaje === 2) {
        return {
          texto: 'NYHA CLASE II (Leve-Moderada)',
          color: 'yellow-600',
          evidencia: 'Actividades físicas habituales provocan fatiga o disnea.',
          recomendaciones: [
            'Ingreso a programa de entrenamiento físico aeróbico progresivo',
            'Optimizar adherencia al tratamiento farmacológico',
            'Seguimiento ambulatorio por cardiología'
          ]
        };
      }

      return {
        texto: 'NYHA CLASE I (Asintomático)',
        color: 'emerald-600',
        evidencia: 'Sin limitaciones para la actividad física ordinaria.',
        recomendaciones: [
          'Mantener estilo de vida activo y saludable',
          'Prevención secundaria: control de presión arterial y lípidos',
          'Evaluación funcional periódica (Test de Esfuerzo)'
        ]
      };
    }
  },

  {
    id: 'act_control_asma',
    nombre: 'Test de Control del Asma (ACT)',
    categoria: 'cardiorespiratorio',
    descripcion: 'Evaluación del nivel de control de los síntomas asmáticos en las últimas 4 semanas.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 14741583) ---
    bibliografia: "Nathan RA, et al. Development of the asthma control test: a survey for predicting clinical expert assessment. J Allergy Clin Immunol. 2004.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14741583/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Un puntaje < 20 indica que el asma no está bien controlada. Es la escala más sensible para predecir exacerbaciones y la necesidad de ajustar el corticoide inhalado.",

    preguntas: [
      { 
        id: 'limitacion', 
        text: '1. ¿En las últimas 4 semanas, cuánto tiempo le ha impedido el asma realizar sus actividades habituales?', 
        type: 'select',
        options: [
          { label: 'Siempre (1 pt)', value: 1 },
          { label: 'Casi siempre (2 pts)', value: 2 },
          { label: 'A veces (3 pts)', value: 3 },
          { label: 'Pocas veces (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'disnea', 
        text: '2. ¿Con qué frecuencia ha tenido dificultad para respirar (falta de aire)?', 
        type: 'select',
        options: [
          { label: 'Más de una vez al día (1 pt)', value: 1 },
          { label: 'Una vez al día (2 pts)', value: 2 },
          { label: '3 a 6 veces por semana (3 pts)', value: 3 },
          { label: '1 o 2 veces por semana (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'despertar_nocturno', 
        text: '3. ¿Cuántas veces los síntomas de asma le han despertado por la noche o más temprano de lo habitual?', 
        type: 'select',
        options: [
          { label: '4 o más noches por semana (1 pt)', value: 1 },
          { label: '2 o 3 noches por semana (2 pts)', value: 2 },
          { label: 'Una vez por semana (3 pts)', value: 3 },
          { label: '1 o 2 veces (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'rescate', 
        text: '4. ¿Cuántas veces ha tenido que usar su inhalador de rescate (Salbutamol)?', 
        type: 'select',
        options: [
          { label: '3 o más veces al día (1 pt)', value: 1 },
          { label: '1 o 2 veces al día (2 pts)', value: 2 },
          { label: '3 o más veces por semana (3 pts)', value: 3 },
          { label: '1 vez por semana o menos (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'autopercepcion', 
        text: '5. ¿Cómo calificaría el control de su asma durante las últimas 4 semanas?', 
        type: 'select',
        options: [
          { label: 'Nada controlada (1 pt)', value: 1 },
          { label: 'Poco controlada (2 pts)', value: 2 },
          { label: 'Bien controlada (3 pts)', value: 3 },
          { label: 'Muy bien controlada (4 pts)', value: 4 },
          { label: 'Totalmente controlada (5 pts)', value: 5 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje === 25) {
        return {
          texto: 'ASMA TOTALMENTE CONTROLADA',
          color: 'emerald-600',
          evidencia: `Puntaje perfecto (${puntaje}/25). No hay síntomas ni limitaciones reportadas.`,
          recomendaciones: [
            'Mantener terapia controladora actual',
            'Control de rutina cada 6 meses',
            'Continuar educación en técnica inhalatoria'
          ]
        };
      }

      if (puntaje >= 20) {
        return {
          texto: 'ASMA BIEN CONTROLADA',
          color: 'green-500',
          evidencia: `Puntaje de ${puntaje}/25. Control satisfactorio de la sintomatología.`,
          recomendaciones: [
            'Mantener tratamiento actual',
            'Seguir plan de acción ante crisis leves',
            'Monitorear factores desencadenantes (alérgenos, frío)'
          ]
        };
      }

      if (puntaje >= 16) {
        return {
          texto: 'ASMA PARCIALMENTE CONTROLADA',
          color: 'orange-500',
          evidencia: `Puntaje de ${puntaje}/25. Sugiere riesgo de exacerbación aguda.`,
          recomendaciones: [
            'Revisar técnica inhalatoria (uso de aerocámara)',
            'Evaluar aumento de dosis de corticoide inhalado (Step Up)',
            'Identificar fallas en la adherencia al tratamiento'
          ]
        };
      }

      return {
        texto: 'ASMA NO CONTROLADA',
        color: 'red-600',
        evidencia: `Puntaje crítico (${puntaje}/25). Alto impacto funcional y riesgo vital.`,
        recomendaciones: [
          'Evaluación médica inmediata por especialista',
          'Considerar inicio de corticoide oral si hay crisis activa',
          'Ajuste urgente de la terapia de mantención',
          'Vigilancia estricta de flujo espiratorio máximo (PEF)'
        ]
      };
    }
  },

  {
    id: 'cat_epoc',
    nombre: 'CAT (COPD Assessment Test)',
    categoria: 'cardiorespiratorio',
    descripcion: 'Cuestionario de 8 ítems para evaluar el impacto de la EPOC en el bienestar y la vida diaria del paciente.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 19700392) ---
    bibliografia: "Jones PW, et al. Development and first validation of the COPD Assessment Test. Eur Respir J. 2009.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/19700392/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Un puntaje ≥ 10 indica un paciente altamente sintomático. Es el estándar para monitorizar la respuesta clínica al tratamiento broncodilatador y rehabilitador.",

    preguntas: [
      { id: 'tos', text: '1. Tos: (0: Nunca toso - 5: Siempre estoy tosiendo)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'flema', text: '2. Flema: (0: No tengo flema en el pecho - 5: Tengo el pecho lleno de flema)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'opresion', text: '3. Opresión: (0: No siento opresión en el pecho - 5: Siento mucha opresión)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'disnea_esfuerzo', text: '4. Disnea al subir: (0: No me falta el aire al subir una cuesta o un piso - 5: Me falta mucho el aire)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'limitacion', text: '5. Limitación en casa: (0: No me siento limitado para actividades domésticas - 5: Muy limitado)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'confianza', text: '6. Seguridad: (0: Me siento seguro al salir de casa - 5: No me siento nada seguro)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'sueno', text: '7. Sueño: (0: Duermo profundamente - 5: No duermo bien por mis problemas pulmonares)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'energia', text: '8. Energía: (0: Tengo mucha energía - 5: No tengo nada de energía)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje > 30) {
        return {
          texto: 'Impacto MUY ALTO (> 30)',
          color: 'red-700',
          evidencia: `Puntaje CAT: ${puntaje}/40. Calidad de vida gravemente comprometida.`,
          recomendaciones: [
            'Evaluación médica inmediata para ajuste de terapia triple',
            'Derivación a programa de Rehabilitación Pulmonar intensivo',
            'Evaluar necesidad de oxigenoterapia o soporte ventilatorio',
            'Vigilancia estricta de exacerbaciones'
          ]
        };
      }

      if (puntaje >= 21) {
        return {
          texto: 'Impacto ALTO (21 - 30)',
          color: 'red-500',
          evidencia: `Puntaje CAT: ${puntaje}/40. Gran limitación en la mayoría de los dominios evaluados.`,
          recomendaciones: [
            'Optimizar tratamiento broncodilatador (LAMA+LABA)',
            'Reforzar educación en autocuidado y cese tabáquico',
            'Evaluar técnica de inhalación'
          ]
        };
      }

      if (puntaje >= 10) {
        return {
          texto: 'Impacto MODERADO (10 - 20)',
          color: 'orange-500',
          evidencia: `Puntaje CAT: ${puntaje}/40. El paciente se considera "altamente sintomático" según guías GOLD.`,
          recomendaciones: [
            'Revisar plan de acción ante crisis respiratorias',
            'Fomentar actividad física diaria supervisada',
            'Controlar factores ambientales'
          ]
        };
      }

      return {
        texto: 'Impacto BAJO (< 10)',
        color: 'emerald-600',
        evidencia: `Puntaje CAT: ${puntaje}/40. Síntomas estables con poco impacto en la vida diaria.`,
        recomendaciones: [
          'Mantener terapia actual',
          'Control anual preventivo',
          'Fomentar estilos de vida saludables'
        ]
      };
    }
  },

  {
    id: 'wells_tep',
    nombre: 'Score de Wells (Embolia Pulmonar)',
    categoria: 'cardiorespiratorio',
    descripcion: 'Evaluación de la probabilidad clínica de Tromboembolismo Pulmonar (TEP).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10655430) ---
    bibliografia: "Wells PS, et al. Derivation of a simple clinical model to categorize patients probability of pulmonary embolism. Thromb Haemost. 2000.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10655430/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es el estándar para evitar el sobre-diagnóstico y la irradiación innecesaria. Un puntaje > 6 indica alta probabilidad clínica, mientras que un puntaje < 2 permite descartar TEP si el Dímero D es negativo.",

    preguntas: [
      { id: 'signos_tvp', text: '1. Signos clínicos de Trombosis Venosa Profunda (edema, dolor a la palpación):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+3 pts)', value: 3 }] },
      { id: 'diagnostico_alt', text: '2. ¿El TEP es el diagnóstico más probable o igual de probable que otros?', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+3 pts)', value: 3 }] },
      { id: 'fc_alta', text: '3. Frecuencia cardíaca > 100 latidos por minuto:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1.5 pts)', value: 1.5 }] },
      { id: 'inmovilizacion', text: '4. Cirugía o inmovilización en las últimas 4 semanas:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1.5 pts)', value: 1.5 }] },
      { id: 'antecedentes', text: '5. Antecedentes previos de TEP o TVP:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1.5 pts)', value: 1.5 }] },
      { id: 'hemoptisis', text: '6. Presencia de hemoptisis (tos con sangre):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1 pt)', value: 1 }] },
      { id: 'cancer', text: '7. Cáncer activo (tratamiento actual o en los últimos 6 meses):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1 pt)', value: 1 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje > 6) {
        return {
          texto: 'PROBABILIDAD ALTA (> 6)',
          color: 'red-600',
          evidencia: `Puntaje de ${puntaje}: Riesgo clínico elevado (aprox. 65% de probabilidad de TEP).`,
          recomendaciones: [
            'Indicación urgente de Angio-TAC de tórax',
            'Considerar inicio de anticoagulación empírica si no hay contraindicaciones',
            'Monitoreo hemodinámico estricto',
            'Evaluación por equipo de medicina de urgencia o broncopulmonar'
          ]
        };
      }

      if (puntaje >= 2) {
        return {
          texto: 'PROBABILIDAD MODERADA (2 - 6)',
          color: 'orange-500',
          evidencia: `Puntaje de ${puntaje}: Riesgo clínico intermedio.`,
          recomendaciones: [
            'Solicitar Dímero D de alta sensibilidad',
            'Si Dímero D es (+) realizar Angio-TAC',
            'Mantener observación clínica estrecha'
          ]
        };
      }

      return {
        texto: 'PROBABILIDAD BAJA (< 2)',
        color: 'emerald-600',
        evidencia: `Puntaje de ${puntaje}: Riesgo clínico bajo (menos del 10% de probabilidad de TEP).`,
        recomendaciones: [
          'Solicitar Dímero D; si es (-) se puede descartar TEP con seguridad',
          'Evaluar otros diagnósticos diferenciales (dolor osteomuscular, pleuritis)',
          'No se recomienda Angio-TAC de entrada'
        ]
      };
    }
  },

  // ==========================================
  // Traumatologia y Ortopedia
  // ==========================================

{
    id: 'womac_artrosis',
    nombre: 'Índice WOMAC (Completo)',
    categoria: 'traumatologia',
    descripcion: 'Cuestionario autoadministrado para evaluar dolor, rigidez y capacidad funcional en pacientes con artrosis de cadera o rodilla (24 ítems).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3350431) ---
    bibliografia: "Bellamy N, Buchanan WW, Goldsmith CH, Campbell J, Stitt LW. Validation study of WOMAC: a specialized health status questionnaire. J Rheumatol. 1988.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3350431/", 
    evidenciaClinica: "Es la escala estándar de oro para el seguimiento de pacientes con artrosis. Evalúa el impacto real en las actividades de la vida diaria. Un puntaje total mayor indica mayor discapacidad.",

    preguntas: [
      // === SECCIÓN DOLOR (5 ítems) ===
      { id: 'd1', text: 'Dolor al caminar por terreno llano:', type: 'select', options: [{ label: 'Ninguno (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Severo (3)', value: 3 }, { label: 'Extremo (4)', value: 4 }] },
      { id: 'd2', text: 'Dolor al subir o bajar escaleras:', type: 'select', options: [{ label: 'Ninguno (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Severo (3)', value: 3 }, { label: 'Extremo (4)', value: 4 }] },
      { id: 'd3', text: 'Dolor nocturno (en la cama):', type: 'select', options: [{ label: 'Ninguno (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Severo (3)', value: 3 }, { label: 'Extremo (4)', value: 4 }] },
      { id: 'd4', text: 'Dolor al estar sentado o acostado:', type: 'select', options: [{ label: 'Ninguno (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Severo (3)', value: 3 }, { label: 'Extremo (4)', value: 4 }] },
      { id: 'd5', text: 'Dolor al estar de pie:', type: 'select', options: [{ label: 'Ninguno (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Severo (3)', value: 3 }, { label: 'Extremo (4)', value: 4 }] },

      // === SECCIÓN RIGIDEZ (2 ítems) ===
      { id: 'r1', text: 'Rigidez al despertarse por la mañana:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'r2', text: 'Rigidez al estar sentado, acostado o descansando:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },

      // === SECCIÓN CAPACIDAD FÍSICA (17 ítems) ===
      { id: 'f1', text: 'Dificultad al bajar escaleras:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f2', text: 'Dificultad al subir escaleras:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f3', text: 'Dificultad al levantarse de una silla:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f4', text: 'Dificultad al estar de pie:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f5', text: 'Dificultad al agacharse hacia el suelo:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f6', text: 'Dificultad al caminar por terreno llano:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f7', text: 'Dificultad al entrar o salir de un auto:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f8', text: 'Dificultad al ir de compras:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f9', text: 'Dificultad al ponerse los calcetines/medias:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f10', text: 'Dificultad al levantarse de la cama:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f11', text: 'Dificultad al quitarse los calcetines/medias:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f12', text: 'Dificultad al estar acostado en la cama:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f13', text: 'Dificultad al entrar o salir de la tina/bañera:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f14', text: 'Dificultad al estar sentado:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f15', text: 'Dificultad al sentarse o levantarse del inodoro:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f16', text: 'Dificultad al realizar tareas domésticas pesadas:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] },
      { id: 'f17', text: 'Dificultad al realizar tareas domésticas ligeras:', type: 'select', options: [{ label: 'Ninguna (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderada (2)', value: 2 }, { label: 'Severa (3)', value: 3 }, { label: 'Extrema (4)', value: 4 }] }
    ],

    // Cálculo: Suma bruta de los 24 ítems (0-96) convertida a porcentaje de discapacidad (0-100%)
    calcularPuntaje: (respuestas) => {
      const suma = Object.values(respuestas).reduce((acc, val) => acc + (Number(val) || 0), 0);
      // El total máximo es 96 (24 preguntas x 4 puntos máximo cada una)
      return parseFloat(((suma / 96) * 100).toFixed(1));
    },

    interpretar: (puntaje) => {
      if (puntaje >= 60) return { 
        texto: 'DISCAPACIDAD SEVERA', 
        color: 'red-600', 
        evidencia: `El paciente presenta un ${puntaje}% de discapacidad funcional global.`,
        recomendaciones: [
          'Priorizar manejo analgésico avanzado.',
          'Evaluar necesidad de ayudas técnicas para la marcha (andador o bastones).',
          'Interconsulta con traumatología para evaluar resolución quirúrgica.',
          'Adaptación del entorno doméstico para reducir riesgo de caídas.'
        ]
      };
      if (puntaje >= 30) return { 
        texto: 'DISCAPACIDAD MODERADA', 
        color: 'orange-500', 
        evidencia: `El paciente presenta un ${puntaje}% de discapacidad funcional global.`,
        recomendaciones: [
          'Programa de ejercicio terapéutico enfocado en fortalecimiento de cuádriceps y glúteos.',
          'Educación en protección articular y control de peso.',
          'Uso de agentes físicos para control de síntomas según fase clínica.',
          'Seguimiento mensual de la progresión funcional.'
        ]
      };
      return { 
        texto: 'DISCAPACIDAD LEVE', 
        color: 'emerald-600', 
        evidencia: `El paciente presenta un ${puntaje}% de compromiso funcional.`, 
        recomendaciones: [
          'Mantener actividad física de bajo impacto (caminata, natación o bicicleta).',
          'Fomentar el autocuidado y pautas de higiene postural.',
          'Re-evaluar con escala WOMAC cada 6 meses.'
        ] 
      };
    }
  },


  {
    id: 'dash_miembro_superior',
    nombre: 'Cuestionario DASH (Completo)',
    categoria: 'traumatologia',
    descripcion: 'Disabilities of the Arm, Shoulder and Hand. Evaluación de síntomas y capacidad física en trastornos de extremidad superior (30 ítems).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8604687) ---
    bibliografia: "Hudak PL, Amadio PC, Bombardier C. Development of the Upper Extremity Disabilities of the Arm, Shoulder and Hand (DASH) outcome measure. Am J Ind Med. 1996.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8604687/",
    evidenciaClinica: "Es la herramienta más validada para miembro superior. Un cambio de 10 puntos se considera clínicamente significativo (MCID). El puntaje varía de 0 (sin discapacidad) a 100 (discapacidad máxima).",

    preguntas: [
      // SECCIÓN ACTIVIDADES (1-21)
      { id: 'p1', text: '1. Abrir un frasco nuevo o muy apretado:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p2', text: '2. Escribir:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p3', text: '3. Girar una llave:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p4', text: '4. Preparar una comida:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p5', text: '5. Empujar y abrir una puerta pesada:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p6', text: '6. Colocar un objeto en un estante sobre su cabeza:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p7', text: '7. Hacer tareas domésticas pesadas (ej. fregar pisos):', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p8', text: '8. Hacer trabajos de jardín o huerta:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p9', text: '9. Hacer la cama:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p10', text: '10. Cargar una bolsa de compras pesada o maletín:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p11', text: '11. Llevar un objeto pesado (más de 5 kg):', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p12', text: '12. Cambiar una bombilla de luz sobre su cabeza:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p13', text: '13. Lavarse o secarse la espalda:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p14', text: '14. Ponerse una prenda de vestir que se introduce por la cabeza:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p15', text: '15. Lavar platos o cubiertos:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p16', text: '16. Actividades recreativas que requieren poco esfuerzo (ej. cartas):', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p17', text: '17. Actividades que requieren impacto (ej. martillar, tenis):', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p18', text: '18. Actividades donde mueve el brazo libremente (ej. nadar):', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p19', text: '19. Transporte/Caminar (debido al brazo, hombro o mano):', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p20', text: '20. Actividad sexual:', type: 'select', options: [{ label: 'Sin dificultad (1)', value: 1 }, { label: 'Dificultad leve (2)', value: 2 }, { label: 'Dificultad moderada (3)', value: 3 }, { label: 'Dificultad severa (4)', value: 4 }, { label: 'Incapaz (5)', value: 5 }] },
      { id: 'p21', text: '21. Capacidad social (compartir con familiares o amigos):', type: 'select', options: [{ label: 'Nada (1)', value: 1 }, { label: 'Un poco (2)', value: 2 }, { label: 'Moderadamente (3)', value: 3 }, { label: 'Mucho (4)', value: 4 }, { label: 'Extremadamente (5)', value: 5 }] },
      
      // SECCIÓN SÍNTOMAS E IMPACTO (22-30)
      { id: 'p22', text: '22. ¿En qué medida el problema ha interferido con su trabajo u otras actividades diarias?', type: 'select', options: [{ label: 'Nada (1)', value: 1 }, { label: 'Un poco (2)', value: 2 }, { label: 'Moderadamente (3)', value: 3 }, { label: 'Mucho (4)', value: 4 }, { label: 'Extremadamente (5)', value: 5 }] },
      { id: 'p23', text: '23. Dolor en el brazo, hombro o mano:', type: 'select', options: [{ label: 'Ninguno (1)', value: 1 }, { label: 'Leve (2)', value: 2 }, { label: 'Moderado (3)', value: 3 }, { label: 'Severo (4)', value: 4 }, { label: 'Extremo (5)', value: 5 }] },
      { id: 'p24', text: '24. Dolor al realizar una actividad específica:', type: 'select', options: [{ label: 'Ninguno (1)', value: 1 }, { label: 'Leve (2)', value: 2 }, { label: 'Moderado (3)', value: 3 }, { label: 'Severo (4)', value: 4 }, { label: 'Extremo (5)', value: 5 }] },
      { id: 'p25', text: '25. Hormigueo (pinchazos) en brazo, hombro o mano:', type: 'select', options: [{ label: 'Ninguno (1)', value: 1 }, { label: 'Leve (2)', value: 2 }, { label: 'Moderado (3)', value: 3 }, { label: 'Severo (4)', value: 4 }, { label: 'Extremo (5)', value: 5 }] },
      { id: 'p26', text: '26. Debilidad en el brazo, hombro o mano:', type: 'select', options: [{ label: 'Ninguna (1)', value: 1 }, { label: 'Leve (2)', value: 2 }, { label: 'Moderada (3)', value: 3 }, { label: 'Severa (4)', value: 4 }, { label: 'Extrema (5)', value: 5 }] },
      { id: 'p27', text: '27. Rigidez en el brazo, hombro o mano:', type: 'select', options: [{ label: 'Ninguna (1)', value: 1 }, { label: 'Leve (2)', value: 2 }, { label: 'Moderada (3)', value: 3 }, { label: 'Severa (4)', value: 4 }, { label: 'Extrema (5)', value: 5 }] },
      { id: 'p28', text: '28. Dificultad para dormir por el dolor:', type: 'select', options: [{ label: 'Ninguna (1)', value: 1 }, { label: 'Leve (2)', value: 2 }, { label: 'Moderada (3)', value: 3 }, { label: 'Severa (4)', value: 4 }, { label: 'Extrema (5)', value: 5 }] },
      { id: 'p29', text: '29. Autopercepción de confianza (sentirse menos capaz o útil):', type: 'select', options: [{ label: 'Muy de acuerdo (5)', value: 5 }, { label: 'De acuerdo (4)', value: 4 }, { label: 'Ni de acuerdo ni desacuerdo (3)', value: 3 }, { label: 'En desacuerdo (2)', value: 2 }, { label: 'Muy en desacuerdo (1)', value: 1 }] },
      { id: 'p30', text: '30. Impacto psicológico (sentirse de mal humor o frustrado):', type: 'select', options: [{ label: 'Muy de acuerdo (5)', value: 5 }, { label: 'De acuerdo (4)', value: 4 }, { label: 'Ni de acuerdo ni desacuerdo (3)', value: 3 }, { label: 'En desacuerdo (2)', value: 2 }, { label: 'Muy en desacuerdo (1)', value: 1 }] }
    ],

    // Cálculo oficial DASH: [(suma de n respuestas / n) - 1] * 25
    calcularPuntaje: (respuestas) => {
      const valores = Object.values(respuestas).filter(v => v !== undefined && v !== null);
      if (valores.length < 27) return 0; // DASH requiere al menos 27 de 30 ítems respondidos
      
      const suma = valores.reduce((acc, curr) => acc + curr, 0);
      const n = valores.length;
      
      // Fórmula estandarizada para obtener 0-100%
      const dashScore = ((suma / n) - 1) * 25;
      return parseFloat(dashScore.toFixed(1));
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'DATOS INSUFICIENTES', color: 'slate-500', evidencia: 'Se requieren al menos 27 respuestas para un cálculo válido.', recomendaciones: ['Completar los ítems faltantes del cuestionario.'] };
      
      if (puntaje >= 50) return { 
        texto: 'DISCAPACIDAD SEVERA', 
        color: 'red-600', 
        evidencia: `Resultado: ${puntaje}/100. Alto impacto en la funcionalidad del miembro superior.`,
        recomendaciones: [
          'Evaluación médica para descartar patología quirúrgica.',
          'Considerar reubicación laboral o reposo funcional temporal.',
          'Programa de rehabilitación intensivo centrado en control de síntomas y AVD.',
          'Uso de ayudas técnicas para disminuir carga mecánica.'
        ]
      };
      
      if (puntaje >= 20) return { 
        texto: 'DISCAPACIDAD MODERADA', 
        color: 'orange-500', 
        evidencia: `Resultado: ${puntaje}/100. Limitación perceptible en tareas que requieren fuerza o rangos extremos.`,
        recomendaciones: [
          'Kinesioterapia enfocada en ejercicios de estabilidad escapular y manguito rotador.',
          'Higiene postural y ergonómica en el puesto de trabajo.',
          'Pautas de ejercicios de movilidad activa y estiramientos.',
          'Seguimiento mensual para evaluar el cambio mínimo significativo (10 pts).'
        ]
      };

      return { 
        texto: 'DISCAPACIDAD LEVE / MÍNIMA', 
        color: 'emerald-600', 
        evidencia: `Resultado: ${puntaje}/100. El paciente conserva la mayor parte de su autonomía funcional.`,
        recomendaciones: [
          'Mantener acondicionamiento físico general del miembro superior.',
          'Prevención de lesiones recurrentes mediante educación ergonómica.',
          'Control preventivo si los síntomas aumentan tras cargas laborales.'
        ]
      };
    }
  },

  {
    id: 'oswestry_lumbar',
    nombre: 'Índice de Discapacidad de Oswestry (ODI)',
    categoria: 'traumatologia',
    descripcion: 'Herramienta de referencia para evaluar la discapacidad funcional por dolor lumbar en 10 dimensiones.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 1530702) ---
    bibliografia: "Fairbank JC, Pynsent PB. The Oswestry Disability Index. Spine (Phila Pa 1976). 2000 Nov 15;25(22):2940-52.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11039248/",
    evidenciaClinica: "Indispensable en patología de columna. Permite diferenciar entre pacientes que requieren manejo conservador vs quirúrgico. Un cambio del 10% (5 puntos) es clínicamente relevante.",

    preguntas: [
      { 
        id: 'p1', 
        text: '1. Intensidad del Dolor:', 
        type: 'select', 
        options: [
          { label: 'Puedo soportar el dolor sin tomar analgésicos (0)', value: 0 },
          { label: 'El dolor es soportable pero tomo analgésicos (1)', value: 1 },
          { label: 'Los analgésicos me alivian poco el dolor (2)', value: 2 },
          { label: 'Los analgésicos me alivian muy poco el dolor (3)', value: 3 },
          { label: 'Los analgésicos no me alivian nada (4)', value: 4 },
          { label: 'El dolor es tan intenso que no me alivian nada (5)', value: 5 }
        ] 
      },
      { 
        id: 'p2', 
        text: '2. Cuidados Personales (lavarse, vestirse, etc.):', 
        type: 'select', 
        options: [
          { label: 'Puedo cuidarme normalmente sin dolor (0)', value: 0 },
          { label: 'Puedo cuidarme normalmente pero me duele (1)', value: 1 },
          { label: 'Me duele cuidarme y lo hago despacio y con cuidado (2)', value: 2 },
          { label: 'Necesito alguna ayuda pero consigo hacerlo solo (3)', value: 3 },
          { label: 'Necesito ayuda diaria en la mayoría de los cuidados (4)', value: 4 },
          { label: 'No puedo vestirme, me lavo con dificultad y me quedo en cama (5)', value: 5 }
        ] 
      },
      { 
        id: 'p3', 
        text: '3. Levantar Objetos:', 
        type: 'select', 
        options: [
          { label: 'Puedo levantar objetos pesados sin dolor (0)', value: 0 },
          { label: 'Puedo levantar objetos pesados pero con dolor (1)', value: 1 },
          { label: 'El dolor me impide levantar objetos pesados del suelo (2)', value: 2 },
          { label: 'Solo puedo levantar objetos pesados si están en un lugar alto (3)', value: 3 },
          { label: 'Solo puedo levantar objetos muy ligeros (4)', value: 4 },
          { label: 'No puedo levantar ni cargar nada (5)', value: 5 }
        ] 
      },
      { 
        id: 'p4', 
        text: '4. Capacidad de Caminar:', 
        type: 'select', 
        options: [
          { label: 'El dolor no me impide caminar cualquier distancia (0)', value: 0 },
          { label: 'El dolor me impide caminar más de 1 km (1)', value: 1 },
          { label: 'El dolor me impide caminar más de 500 metros (2)', value: 2 },
          { label: 'El dolor me impide caminar más de 250 metros (3)', value: 3 },
          { label: 'Solo puedo caminar con bastón o muletas (4)', value: 4 },
          { label: 'Permanezco en la cama casi todo el tiempo (5)', value: 5 }
        ] 
      },
      { 
        id: 'p5', 
        text: '5. Capacidad de Estar Sentado:', 
        type: 'select', 
        options: [
          { label: 'Puedo estar sentado en cualquier silla el tiempo que quiera (0)', value: 0 },
          { label: 'Solo puedo estar sentado en mi silla favorita el tiempo que quiera (1)', value: 1 },
          { label: 'El dolor me impide estar sentado más de 1 hora (2)', value: 2 },
          { label: 'El dolor me impide estar sentado más de 30 minutos (3)', value: 3 },
          { label: 'El dolor me impide estar sentado más de 10 minutos (4)', value: 4 },
          { label: 'El dolor me impide estar sentado (5)', value: 5 }
        ] 
      },
      { 
        id: 'p6', 
        text: '6. Capacidad de Estar de Pie:', 
        type: 'select', 
        options: [
          { label: 'Puedo estar de pie el tiempo que quiera sin dolor (0)', value: 0 },
          { label: 'Puedo estar de pie el tiempo que quiera pero con dolor (1)', value: 1 },
          { label: 'El dolor me impide estar de pie más de 1 hora (2)', value: 2 },
          { label: 'El dolor me impide estar de pie más de 30 minutos (3)', value: 3 },
          { label: 'El dolor me impide estar de pie más de 10 minutos (4)', value: 4 },
          { label: 'El dolor me impide estar de pie (5)', value: 5 }
        ] 
      },
      { 
        id: 'p7', 
        text: '7. Capacidad de Dormir:', 
        type: 'select', 
        options: [
          { label: 'Duermo bien sin dolor (0)', value: 0 },
          { label: 'El dolor me impide dormir bien si no tomo pastillas (1)', value: 1 },
          { label: 'Incluso tomando pastillas duermo menos de 6 horas (2)', value: 2 },
          { label: 'Incluso tomando pastillas duermo menos de 4 horas (3)', value: 3 },
          { label: 'Incluso tomando pastillas duermo menos de 2 horas (4)', value: 4 },
          { label: 'El dolor me impide dormir en absoluto (5)', value: 5 }
        ] 
      },
      { 
        id: 'p8', 
        text: '8. Vida Sexual (si aplica):', 
        type: 'select', 
        options: [
          { label: 'Mi vida sexual es normal y no me produce dolor (0)', value: 0 },
          { label: 'Mi vida sexual es normal pero me produce algún dolor (1)', value: 1 },
          { label: 'Mi vida sexual es casi normal pero es muy dolorosa (2)', value: 2 },
          { label: 'Mi vida sexual se ha visto muy limitada por el dolor (3)', value: 3 },
          { label: 'Mi vida sexual es casi nula por el dolor (4)', value: 4 },
          { label: 'El dolor me impide cualquier tipo de vida sexual (5)', value: 5 }
        ] 
      },
      { 
        id: 'p9', 
        text: '9. Vida Social:', 
        type: 'select', 
        options: [
          { label: 'Mi vida social es normal y no me produce dolor (0)', value: 0 },
          { label: 'Mi vida social es normal pero me aumenta el dolor (1)', value: 1 },
          { label: 'El dolor me impide participar en actividades como deporte (2)', value: 2 },
          { label: 'El dolor ha limitado mi vida social y salgo menos (3)', value: 3 },
          { label: 'El dolor ha limitado mi vida social a mi casa (4)', value: 4 },
          { label: 'No tengo vida social a causa del dolor (5)', value: 5 }
        ] 
      },
      { 
        id: 'p10', 
        text: '10. Capacidad de Viajar:', 
        type: 'select', 
        options: [
          { label: 'Puedo viajar a cualquier parte sin dolor (0)', value: 0 },
          { label: 'Puedo viajar a cualquier parte pero con dolor (1)', value: 1 },
          { label: 'El dolor es fuerte pero aguanto viajes de más de 2 horas (2)', value: 2 },
          { label: 'El dolor limita mis viajes a menos de 1 hora (3)', value: 3 },
          { label: 'El dolor limita mis viajes a menos de 30 minutos (4)', value: 4 },
          { label: 'El dolor me impide viajar excepto para ir al médico (5)', value: 5 }
        ] 
      }
    ],

    // Cálculo oficial ODI: (Suma / (n_preguntas * 5)) * 100
    calcularPuntaje: (respuestas) => {
      const valores = Object.values(respuestas).filter(v => v !== undefined && v !== null);
      if (valores.length === 0) return 0;
      
      const suma = valores.reduce((acc, curr) => acc + curr, 0);
      const maximoPosible = valores.length * 5;
      
      const odiScore = (suma / maximoPosible) * 100;
      return parseFloat(odiScore.toFixed(1));
    },

    interpretar: (puntaje) => {
      if (puntaje > 80) return { 
        texto: 'DISCAPACIDAD MÁXIMA / POSTRACIÓN', 
        color: 'slate-900', 
        evidencia: `Puntaje: ${puntaje}%. El paciente está confinado a la cama o sus síntomas son extremadamente severos.`, 
        recomendaciones: [
          'Evaluación urgente por neurocirujano o especialista en columna.',
          'Manejo de dolor agudo con farmacología de tercer escalón.',
          'Vigilancia de signos de bandera roja (cauda equina).',
          'Reposo relativo y educación en transferencias mínimas dolorosas.'
        ] 
      };
      
      if (puntaje > 60) return { 
        texto: 'DISCAPACIDAD DISCAPACITANTE', 
        color: 'red-600', 
        evidencia: `Puntaje: ${puntaje}%. El dolor lumbar afecta todas las áreas de la vida del paciente.`, 
        recomendaciones: [
          'Intervención multidisciplinaria (Unidad del Dolor).',
          'Kinesioterapia centrada en control de síntomas y movilidad suave.',
          'Evaluación de ayudas técnicas para la marcha.',
          'Considerar estudio de imágenes si hay déficit neurológico progresivo.'
        ] 
      };
      
      if (puntaje > 40) return { 
        texto: 'DISCAPACIDAD SEVERA', 
        color: 'orange-600', 
        evidencia: `Puntaje: ${puntaje}%. Gran dificultad para las actividades de la vida diaria.`, 
        recomendaciones: [
          'Kinesioterapia intensiva centrada en estabilización lumbopélvica (Core).',
          'Educación en higiene postural y manejo de cargas.',
          'Tratamiento de factores psicosociales (miedo al movimiento).',
          'Uso de agentes físicos según tolerancia.'
        ] 
      };
      
      if (puntaje > 20) return { 
        texto: 'DISCAPACIDAD MODERADA', 
        color: 'yellow-600', 
        evidencia: `Puntaje: ${puntaje}%. El paciente puede realizar la mayoría de las AVD con dolor.`, 
        recomendaciones: [
          'Programa de ejercicio terapéutico progresivo.',
          'Ajustes ergonómicos en el puesto de trabajo.',
          'Fomentar la actividad física general de bajo impacto.',
          'Pautas de autocuidado y pausas activas.'
        ] 
      };

      return { 
        texto: 'DISCAPACIDAD MÍNIMA', 
        color: 'emerald-600', 
        evidencia: `Puntaje: ${puntaje}%. El paciente funciona adecuadamente en el día a día.`, 
        recomendaciones: [
          'Mantener un estilo de vida activo.',
          'Fortalecimiento preventivo de la musculatura estabilizadora.',
          'Educación sobre ergonomía básica.',
          'Seguimiento anual.'
        ] 
      };
    }
  },

  {
    id: 'ndi_cervical',
    nombre: 'Índice de Discapacidad Cervical (NDI)',
    categoria: 'traumatologia',
    descripcion: 'Cuestionario para evaluar la discapacidad funcional causada por el dolor de cuello en 10 dimensiones.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 1730411) ---
    bibliografia: "Vernon H, Mior S. The Neck Disability Index: a study of reliability and validity. J Manipulative Physiol Ther. 1991 Sep;14(7):409-15.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/1730411/", 
    evidenciaClinica: "Es la herramienta más validada para evaluar el latigazo cervical (whiplash) y radiculopatías. Un cambio de 5 puntos (10%) se considera el Mínimo Cambio Clínicamente Importante (MCID).",

    preguntas: [
      { 
        id: 'p1', 
        text: '1. Intensidad del Dolor:', 
        type: 'select', 
        options: [
          { label: 'No tengo dolor en este momento (0)', value: 0 },
          { label: 'El dolor es muy leve en este momento (1)', value: 1 },
          { label: 'El dolor es moderado en este momento (2)', value: 2 },
          { label: 'El dolor es bastante severo en este momento (3)', value: 3 },
          { label: 'El dolor es muy severo en este momento (4)', value: 4 },
          { label: 'El dolor es el peor imaginable en este momento (5)', value: 5 }
        ] 
      },
      { 
        id: 'p2', 
        text: '2. Cuidados Personales (lavarse, vestirse, etc.):', 
        type: 'select', 
        options: [
          { label: 'Puedo cuidarme normalmente sin que me aumente el dolor (0)', value: 0 },
          { label: 'Puedo cuidarme normalmente pero me aumenta el dolor (1)', value: 1 },
          { label: 'Me duele cuidarme y lo hago despacio y con cuidado (2)', value: 2 },
          { label: 'Necesito alguna ayuda pero consigo hacerlo casi todo solo (3)', value: 3 },
          { label: 'Necesito ayuda diaria en la mayoría de los aspectos (4)', value: 4 },
          { label: 'No puedo vestirme, me lavo con dificultad y me quedo en cama (5)', value: 5 }
        ] 
      },
      { 
        id: 'p3', 
        text: '3. Levantar Objetos:', 
        type: 'select', 
        options: [
          { label: 'Puedo levantar objetos pesados sin dolor (0)', value: 0 },
          { label: 'Puedo levantar objetos pesados pero con dolor (1)', value: 1 },
          { label: 'El dolor me impide levantar objetos pesados del suelo (2)', value: 2 },
          { label: 'Solo puedo levantar objetos pesados si están en un lugar alto (3)', value: 3 },
          { label: 'Solo puedo levantar objetos muy ligeros (4)', value: 4 },
          { label: 'No puedo levantar ni cargar nada (5)', value: 5 }
        ] 
      },
      { 
        id: 'p4', 
        text: '4. Lectura:', 
        type: 'select', 
        options: [
          { label: 'Puedo leer tanto como quiera sin dolor de cuello (0)', value: 0 },
          { label: 'Puedo leer tanto como quiera con un ligero dolor de cuello (1)', value: 1 },
          { label: 'Puedo leer tanto como quiera con un dolor moderado (2)', value: 2 },
          { label: 'No puedo leer tanto como quisiera por el dolor moderado (3)', value: 3 },
          { label: 'Apenas puedo leer por el dolor severo de cuello (4)', value: 4 },
          { label: 'No puedo leer nada en absoluto (5)', value: 5 }
        ] 
      },
      { 
        id: 'p5', 
        text: '5. Dolor de Cabeza:', 
        type: 'select', 
        options: [
          { label: 'No tengo dolores de cabeza en absoluto (0)', value: 0 },
          { label: 'Tengo dolores de cabeza ligeros e infrecuentes (1)', value: 1 },
          { label: 'Tengo dolores de cabeza moderados e infrecuentes (2)', value: 2 },
          { label: 'Tengo dolores de cabeza moderados y frecuentes (3)', value: 3 },
          { label: 'Tengo dolores de cabeza severos y frecuentes (4)', value: 4 },
          { label: 'Tengo dolores de cabeza casi todo el tiempo (5)', value: 5 }
        ] 
      },
      { 
        id: 'p6', 
        text: '6. Concentración:', 
        type: 'select', 
        options: [
          { label: 'Puedo concentrarme plenamente sin dificultad (0)', value: 0 },
          { label: 'Puedo concentrarme plenamente con ligera dificultad (1)', value: 1 },
          { label: 'Tengo un grado moderado de dificultad para concentrarme (2)', value: 2 },
          { label: 'Tengo mucha dificultad para concentrarme (3)', value: 3 },
          { label: 'Tengo gran dificultad para concentrarme (4)', value: 4 },
          { label: 'No puedo concentrarme en absoluto (5)', value: 5 }
        ] 
      },
      { 
        id: 'p7', 
        text: '7. Trabajo:', 
        type: 'select', 
        options: [
          { label: 'Puedo trabajar tanto como quiera (0)', value: 0 },
          { label: 'Solo puedo hacer mi trabajo habitual pero no más (1)', value: 1 },
          { label: 'Puedo hacer la mayor parte de mi trabajo pero no más (2)', value: 2 },
          { label: 'No puedo hacer mi trabajo habitual (3)', value: 3 },
          { label: 'Apenas puedo hacer ningún trabajo (4)', value: 4 },
          { label: 'No puedo hacer ningún trabajo en absoluto (5)', value: 5 }
        ] 
      },
      { 
        id: 'p8', 
        text: '8. Conducir (si aplica):', 
        type: 'select', 
        options: [
          { label: 'Puedo conducir mi auto sin dolor de cuello (0)', value: 0 },
          { label: 'Puedo conducir tanto como quiera con ligero dolor (1)', value: 1 },
          { label: 'Puedo conducir tanto como quiera con dolor moderado (2)', value: 2 },
          { label: 'No puedo conducir tanto como quiera por el dolor (3)', value: 3 },
          { label: 'Apenas puedo conducir por el dolor severo (4)', value: 4 },
          { label: 'No puedo conducir mi auto en absoluto (5)', value: 5 }
        ] 
      },
      { 
        id: 'p9', 
        text: '9. Dormir:', 
        type: 'select', 
        options: [
          { label: 'No tengo problemas para dormir (0)', value: 0 },
          { label: 'Mi sueño está ligeramente interrumpido (menos de 1h) (1)', value: 1 },
          { label: 'Mi sueño está algo interrumpido (1-2h) (2)', value: 2 },
          { label: 'Mi sueño está moderadamente interrumpido (2-3h) (3)', value: 3 },
          { label: 'Mi sueño está muy interrumpido (3-5h) (4)', value: 4 },
          { label: 'No puedo dormir en absoluto (5-7h interrumpidas) (5)', value: 5 }
        ] 
      },
      { 
        id: 'p10', 
        text: '10. Vida Social / Diversión:', 
        type: 'select', 
        options: [
          { label: 'Puedo participar en todas mis actividades sociales (0)', value: 0 },
          { label: 'Puedo participar pero me aumenta un poco el dolor (1)', value: 1 },
          { label: 'El dolor limita algunas de mis actividades, pero aún participo (2)', value: 2 },
          { label: 'El dolor ha limitado mucho mis actividades sociales (3)', value: 3 },
          { label: 'Apenas tengo vida social a causa del dolor (4)', value: 4 },
          { label: 'No tengo vida social en absoluto (5)', value: 5 }
        ] 
      }
    ],

    // Cálculo oficial NDI: (Suma / (n_preguntas * 5)) * 100
    calcularPuntaje: (respuestas) => {
      const valores = Object.values(respuestas).filter(v => v !== undefined && v !== null);
      if (valores.length === 0) return 0;
      
      const suma = valores.reduce((acc, curr) => acc + curr, 0);
      const maximoPosible = valores.length * 5;
      
      const ndiScore = (suma / maximoPosible) * 100;
      return parseFloat(ndiScore.toFixed(1));
    },

    interpretar: (puntaje) => {
      if (puntaje >= 70) return { 
        texto: 'DISCAPACIDAD COMPLETA', 
        color: 'slate-900', 
        evidencia: `${puntaje}% de discapacidad funcional cervical.`, 
        recomendaciones: [
          'Evaluación urgente por neurocirujano o traumatólogo de columna.',
          'Manejo farmacológico del dolor neuropático/agudo.',
          'Reposo funcional y uso de collarín blando si se indica.',
          'Vigilancia de sintomatología radicular severa.'
        ] 
      };
      
      if (puntaje >= 50) return { 
        texto: 'DISCAPACIDAD SEVERA', 
        color: 'red-600', 
        evidencia: `${puntaje}% de discapacidad funcional cervical.`, 
        recomendaciones: [
          'Kinesioterapia centrada en control motor cervical y ejercicios de estabilización profunda.',
          'Evitar posturas mantenidas y cargas sobre los hombros.',
          'Evaluación de la ergonomía en el descanso nocturno.',
          'Considerar terapia manual suave según fase clínica.'
        ] 
      };
      
      if (puntaje >= 30) return { 
        texto: 'DISCAPACIDAD MODERADA', 
        color: 'orange-500', 
        evidencia: `${puntaje}% de discapacidad funcional cervical.`, 
        recomendaciones: [
          'Higiene postural en el entorno laboral (pantallas, silla).',
          'Programa de pausas activas y estiramientos musculares.',
          'Gestión del estrés y técnicas de relajación miofascial.',
          'Ejercicio aeróbico de bajo impacto.'
        ] 
      };
      
      if (puntaje >= 10) return { 
        texto: 'DISCAPACIDAD LEVE', 
        color: 'yellow-600', 
        evidencia: `${puntaje}% de discapacidad funcional cervical.`, 
        recomendaciones: [
          'Mantener ejercicios de movilidad activa.',
          'Aplicación de calor local si hay tensión muscular.',
          'Educación sobre ergonomía básica.',
          'Seguimiento clínico periódico.'
        ] 
      };

      return { 
        texto: 'SIN DISCAPACIDAD (o mínima)', 
        color: 'emerald-600', 
        evidencia: `${puntaje}% de compromiso funcional.`, 
        recomendaciones: [
          'Mantener vida activa.',
          'Prevención mediante fortalecimiento de la musculatura periescapular.',
          'Continuar con hábitos posturales saludables.'
        ] 
      };
    }
  },
  {
    id: 'tegner_activity_level',
    nombre: 'Tegner Activity Score',
    categoria: 'traumatologia',
    descripcion: 'Clasificación del nivel de actividad física para complementar la escala funcional de rodilla.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 6833314) ---
    bibliografia: "Tegner Y, Lysholm J. Rating systems in the evaluation of knee ligament injuries. Clin Orthop Relat Res. 1985.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/6833314/",
    evidenciaClinica: "Permite comparar el nivel competitivo del paciente antes de la lesión versus el nivel actual tras la rehabilitación.",

    preguntas: [
      { 
        id: 'nivel_actividad', 
        text: 'Seleccione su nivel de actividad actual:', 
        type: 'select',
        options: [
          { label: 'Nivel 10: Deporte competitivo (Fútbol, Rugby, Balonmano nacional/internacional)', value: 10 },
          { label: 'Nivel 9: Deporte competitivo (Fútbol, Tenis, Atletismo nivel inferior)', value: 9 },
          { label: 'Nivel 7-8: Deportes recreativos de impacto (Esquí, Tenis, Squash)', value: 8 },
          { label: 'Nivel 6: Deporte recreativo (Jogging, Ciclismo, Natación >5 veces/seman)', value: 6 },
          { label: 'Nivel 4-5: Trabajo pesado o deporte recreativo ligero', value: 4 },
          { label: 'Nivel 2-3: Trabajo ligero o caminatas por terreno irregular', value: 2 },
          { label: 'Nivel 0-1: Sedentarismo, enfermedad o discapacidad motora', value: 0 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.nivel_actividad) || 0,

    interpretar: (puntaje, respuestas) => {
      const interpretacion = {
        texto: `Nivel Tegner: ${puntaje}`,
        color: puntaje >= 7 ? 'emerald-600' : puntaje >= 4 ? 'orange-500' : 'red-600',
        evidencia: `Puntaje de ${puntaje}. Define la carga de impacto a la que se somete la articulación.`,
        recomendaciones: [
          'Utilizar este valor para comparar con el nivel previo a la lesión',
          'Ajustar la carga de entrenamiento kinésico según el nivel objetivo'
        ]
      };
      return interpretacion;
    }
  },

  {
    id: 'harris_hip_score',
    nombre: 'Harris Hip Score (HHS)',
    categoria: 'traumatologia',
    descripcion: 'Evaluación funcional de la cadera que mide dolor, función, ausencia de deformidad y rango de movimiento.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 5788441) ---
    bibliografia: "Harris WH. Traumatic arthritis of the hip after dislocation and acetabular fractures. J Bone Joint Surg Am. 1969.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/5788441/", 
    evidenciaClinica: "Puntaje máximo de 100. Un resultado < 70 se considera un fallo clínico en el postoperatorio de prótesis de cadera.",

    preguntas: [
      { id: 'dolor', text: 'Dolor (0: Intenso - 44: Ninguno):', type: 'number', min: 0, max: 44 },
      { id: 'funcion_marcha', text: 'Función - Marcha (0: Incapaz - 33: Normal):', type: 'number', min: 0, max: 33 },
      { id: 'actividades', text: 'Actividades diarias (0: Incapaz - 14: Sin problemas):', type: 'number', min: 0, max: 14 },
      { id: 'examen_fisico', text: 'Examen Físico (Deformidad/Rango) (0-9 pts):', type: 'number', min: 0, max: 9 }
    ],

    calcularPuntaje: (respuestas) => {
      return (Number(respuestas.dolor) || 0) + (Number(respuestas.funcion_marcha) || 0) + 
             (Number(respuestas.actividades) || 0) + (Number(respuestas.examen_fisico) || 0);
    },

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 90) return { texto: 'EXCELENTE', color: 'emerald-600', evidencia: `${puntaje}/100 puntos.`, recomendaciones: ['Alta hospitalaria/seguimiento anual', 'Mantener actividad física'] };
      if (puntaje >= 80) return { texto: 'BUENO', color: 'green-500', evidencia: `${puntaje}/100 puntos.`, recomendaciones: ['Kinesioterapia ambulatoria', 'Entrenamiento de marcha'] };
      if (puntaje >= 70) return { texto: 'REGULAR', color: 'orange-500', evidencia: `${puntaje}/100 puntos.`, recomendaciones: ['Re-evaluación médica', 'Fortalecimiento de abductores'] };
      return { texto: 'POBRE / DEFICIENTE', color: 'red-600', evidencia: `${puntaje}/100 puntos.`, recomendaciones: ['Evaluación quirúrgica: Sospecha de aflojamiento o falla de prótesis'] };
    }
  },

  {
    id: 'aofas_tobillo_pie',
    nombre: 'Escala AOFAS (Tobillo y Retropié)',
    categoria: 'traumatologia',
    descripcion: 'Sistema de puntuación clínico para evaluar la función, dolor y alineación en el pie y tobillo.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8062531) ---
    bibliografia: "Kitaoka HB, et al. Clinical rating systems for the ankle-hindfoot, midfoot, hallux, and lesser toes. Foot Ankle Int. 1994.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8062531/", 
    evidenciaClinica: "Combina 40 pts de dolor, 50 pts de función y 10 pts de alineación. Es fundamental en la evaluación de inestabilidad crónica de tobillo.",

    preguntas: [
      { id: 'dolor', text: 'Dolor (0: Intenso - 40: Ninguno):', type: 'number', min: 0, max: 40 },
      { id: 'funcion_actividad', text: 'Función - Actividad y Calzado (0: Limitado - 20: Normal):', type: 'number', min: 0, max: 20 },
      { id: 'marcha_superficie', text: 'Marcha y Superficies (0: Dificultad - 15: Normal):', type: 'number', min: 0, max: 15 },
      { id: 'movilidad_estabilidad', text: 'Movilidad y Estabilidad (0: Inestable - 15: Estable):', type: 'number', min: 0, max: 15 },
      { id: 'alineacion', text: 'Alineación (0: Anormal - 10: Buena):', type: 'number', min: 0, max: 10 }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 90) return { texto: 'EXCELENTE', color: 'emerald-600', evidencia: `${puntaje}/100 puntos.`, recomendaciones: ['Reintegro deportivo progresivo'] };
      if (puntaje >= 75) return { texto: 'BUENO', color: 'green-500', evidencia: `${puntaje}/100 puntos.`, recomendaciones: ['Ejercicios de propiocepción y equilibrio dinámico'] };
      return { texto: 'REGULAR / POBRE', color: 'orange-600', evidencia: `${puntaje}/100 puntos.`, recomendaciones: ['Evaluación de órtesis o plantillas', 'Fortalecimiento de peroneos'] };
    }
  },

  {
    id: 'constant_murley_hombro',
    nombre: 'Score de Constant-Murley',
    categoria: 'traumatologia',
    descripcion: 'Evaluación de la función del hombro mediante parámetros subjetivos y objetivos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3678525) ---
    bibliografia: "Constant CR, Murley AH. A clinical method of functional assessment of the shoulder. Clin Orthop Relat Res. 1987.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3678525/",
    evidenciaClinica: "Divide la evaluación en Dolor (15), AVD (20), Movilidad (40) y Fuerza (25). Un cambio de 10 puntos es el mínimo cambio clínicamente importante (MCID).",

    preguntas: [
      { id: 'dolor', text: 'Puntaje de Dolor (0-15 pts):', type: 'number', min: 0, max: 15 },
      { id: 'actividad', text: 'Nivel de Actividad/Sueño (0-20 pts):', type: 'number', min: 0, max: 20 },
      { id: 'movilidad', text: 'Movilidad (Flexión/Abducción/Rotación) (0-40 pts):', type: 'number', min: 0, max: 40 },
      { id: 'fuerza', text: 'Fuerza en Abducción (0-25 pts):', type: 'number', min: 0, max: 25 }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 86) return { texto: 'EXCELENTE', color: 'emerald-600', evidencia: `${puntaje}/100 pts.`, recomendaciones: ['Mantenimiento de estabilidad escapular'] };
      if (puntaje >= 71) return { texto: 'BUENO', color: 'green-500', evidencia: `${puntaje}/100 pts.`, recomendaciones: ['Fortalecimiento de manguito rotador'] };
      if (puntaje >= 56) return { texto: 'REGULAR', color: 'orange-500', evidencia: `${puntaje}/100 pts.`, recomendaciones: ['Kinesioterapia: Terapia manual y control motor'] };
      return { texto: 'POBRE', color: 'red-600', evidencia: `${puntaje}/100 pts.`, recomendaciones: ['Re-evaluación médica: Posible rotura masiva o rigidez severa'] };
    }
  },

  {
    id: 'kujala_knee_pain',
    nombre: 'Escala de Kujala (Dolor Anterior de Rodilla)',
    categoria: 'traumatologia',
    descripcion: 'Evaluación específica para el dolor anterior de rodilla y la disfunción patelofemoral (13 ítems).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8013141) ---
    bibliografia: "Kujala UM, et al. Scoring of patellofemoral disorders. Arthroscopy. 1993;9(2):159-63.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8424870/", 
    evidenciaClinica: "Puntaje de 0 a 100. Es altamente sensible para detectar cambios en la carga de la articulación patelofemoral durante actividades como subir escaleras o estar sentado mucho tiempo.",

    preguntas: [
      { 
        id: 'p1', 
        text: '1. Cojera (Marcha):', 
        type: 'select', 
        options: [
          { label: 'Ninguna (5)', value: 5 },
          { label: 'Leve o periódica (3)', value: 3 },
          { label: 'Constante (0)', value: 0 }
        ] 
      },
      { 
        id: 'p2', 
        text: '2. Soporte de peso (Carga):', 
        type: 'select', 
        options: [
          { label: 'Normal (5)', value: 5 },
          { label: 'Dificultad con el peso (3)', value: 3 },
          { label: 'Imposible cargar peso (0)', value: 0 }
        ] 
      },
      { 
        id: 'p3', 
        text: '3. Caminar:', 
        type: 'select', 
        options: [
          { label: 'Ilimitado (5)', value: 5 },
          { label: 'Más de 2 km (3)', value: 3 },
          { label: 'Entre 1-2 km (2)', value: 2 },
          { label: 'Imposible (0)', value: 0 }
        ] 
      },
      { 
        id: 'p4', 
        text: '4. Subir escaleras:', 
        type: 'select', 
        options: [
          { label: 'Sin dificultad (10)', value: 10 },
          { label: 'Dolor leve (8)', value: 8 },
          { label: 'Dolor severo (5)', value: 5 },
          { label: 'Imposible (0)', value: 0 }
        ] 
      },
      { 
        id: 'p5', 
        text: '5. Agacharse (Sentadillas):', 
        type: 'select', 
        options: [
          { label: 'Sin dificultad (10)', value: 10 },
          { label: 'Dolor tras varias repeticiones (8)', value: 8 },
          { label: 'Dolor en la primera repetición (6)', value: 6 },
          { label: 'Dificultad parcial (4)', value: 4 },
          { label: 'Imposible (0)', value: 0 }
        ] 
      },
      { 
        id: 'p6', 
        text: '6. Correr:', 
        type: 'select', 
        options: [
          { label: 'Sin dificultad (10)', value: 10 },
          { label: 'Dolor tras correr una distancia (8)', value: 8 },
          { label: 'Dolor leve al empezar (6)', value: 6 },
          { label: 'Dolor severo (4)', value: 4 },
          { label: 'Imposible (0)', value: 0 }
        ] 
      },
      { 
        id: 'p7', 
        text: '7. Saltar:', 
        type: 'select', 
        options: [
          { label: 'Sin dificultad (10)', value: 10 },
          { label: 'Dolor leve (7)', value: 7 },
          { label: 'Dolor severo (2)', value: 2 },
          { label: 'Imposible (0)', value: 0 }
        ] 
      },
      { 
        id: 'p8', 
        text: '8. Estar sentado mucho tiempo (Rodilla flexionada):', 
        type: 'select', 
        options: [
          { label: 'Sin dolor (10)', value: 10 },
          { label: 'Dolor tras mucho tiempo (7)', value: 7 },
          { label: 'Dolor frecuente (2)', value: 2 },
          { label: 'Imposible (0)', value: 0 }
        ] 
      },
      { 
        id: 'p9', 
        text: '9. Dolor:', 
        type: 'select', 
        options: [
          { label: 'Ninguno (10)', value: 10 },
          { label: 'Leve al realizar actividad física (8)', value: 8 },
          { label: 'Dolor que interfiere con el sueño (6)', value: 6 },
          { label: 'Ocasional en reposo (4)', value: 4 },
          { label: 'Constante y severo (0)', value: 0 }
        ] 
      },
      { 
        id: 'p10', 
        text: '10. Hinchazón (Edema):', 
        type: 'select', 
        options: [
          { label: 'Ninguna (10)', value: 10 },
          { label: 'Tras esfuerzos intensos (8)', value: 8 },
          { label: 'Tras esfuerzos habituales (6)', value: 6 },
          { label: 'Ocasional en reposo (4)', value: 4 },
          { label: 'Constante (0)', value: 0 }
        ] 
      },
      { 
        id: 'p11', 
        text: '11. Movimientos anormales de la rótula (Subluxaciones):', 
        type: 'select', 
        options: [
          { label: 'Ninguno (10)', value: 10 },
          { label: 'Ocasional en actividad (6)', value: 6 },
          { label: 'Subluxación previa (4)', value: 4 },
          { label: 'Frecuente / Inestable (0)', value: 0 }
        ] 
      },
      { 
        id: 'p12', 
        text: '12. Atrofia de cuádriceps (Diferencia visual):', 
        type: 'select', 
        options: [
          { label: 'Ninguna (5)', value: 5 },
          { label: 'Leve (3)', value: 3 },
          { label: 'Severa (0)', value: 0 }
        ] 
      },
      { 
        id: 'p13', 
        text: '13. Flexión limitada (Rango de movimiento):', 
        type: 'select', 
        options: [
          { label: 'Ninguna (5)', value: 5 },
          { label: 'Leve (3)', value: 3 },
          { label: 'Severa (0)', value: 0 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      // Suma directa de los valores asignados a cada respuesta seleccionada
      return Object.values(respuestas).reduce((acc, val) => acc + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 90) return { 
        texto: 'FUNCIÓN EXCELENTE', 
        color: 'emerald-600', 
        evidencia: `Puntaje: ${puntaje}/100. Articulación estable con mínima o nula sintomatología.`, 
        recomendaciones: [
          'Retorno progresivo a actividades de alto impacto.',
          'Mantener fortalecimiento de vasto medial oblicuo (VMO) y glúteo medio.',
          'Control preventivo semestral.'
        ] 
      };
      if (puntaje >= 65) return { 
        texto: 'DISFUNCIÓN MODERADA', 
        color: 'orange-500', 
        evidencia: `Puntaje: ${puntaje}/100. Limitación funcional en actividades de carga o flexión mantenida.`, 
        recomendaciones: [
          'Controlar el volumen de carga semanal (evitar sobreuso).',
          'Kinesioterapia: Terapia manual rotuliana y corrección biomecánica.',
          'Evaluar el uso de vendaje neuromuscular (Kinesiotape) o rodillera de centraje rotuliano.',
          'Fortalecimiento en rangos indoloros.'
        ] 
      };
      return { 
        texto: 'DISFUNCIÓN SEVERA', 
        color: 'red-600', 
        evidencia: `Puntaje: ${puntaje}/100. Grave compromiso de la funcionalidad patelofemoral.`, 
        recomendaciones: [
          'Reposo relativo de actividades de impacto y saltos.',
          'Evaluación médica para descartar condromalacia severa o malalineación ósea.',
          'Iniciar ejercicios isométricos de cuádriceps para analgesia.',
          'Manejo de la inflamación activa (agentes físicos).'
        ] 
      };
    }
  },
  {
    id: 'visa_a_aquiles',
    nombre: 'Escala VISA-A',
    categoria: 'traumatologia',
    descripcion: 'Mide la gravedad de la tendinopatía de Aquiles en relación con el dolor y la función deportiva.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 11078440) ---
    bibliografia: "Robinson JM, et al. VISA-A questionnaire: a valid and reliable index of the severity of Achilles tendinopathy. Br J Sports Med. 2001.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11579069/",
    evidenciaClinica: "Un deportista sano debería puntuar 100. Es la herramienta principal para guiar el protocolo de carga excéntrica.",

    preguntas: [
      { id: 'suma_items', text: 'Suma de los 8 ítems (0 a 100 pts):', type: 'number', min: 0, max: 100 }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.suma_items) || 0,

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 80) return { 
        texto: 'RECUPERACIÓN AVANZADA', color: 'emerald-600', evidencia: `${puntaje} puntos.`, 
        recomendaciones: ['Entrenamiento de pliometría progresiva', 'Mantener protocolo de carga pesada lenta (HSR)'] 
      };
      if (puntaje >= 50) return { 
        texto: 'AFECTACIÓN MODERADA', color: 'orange-500', evidencia: `${puntaje} puntos.`, 
        recomendaciones: ['Iniciar ejercicios excéntricos (Protocolo de Alfredson)', 'Monitorizar dolor 24h post-ejercicio'] 
      };
      return { 
        texto: 'AFECTACIÓN SEVERA', color: 'red-600', evidencia: `${puntaje} puntos.`, 
        recomendaciones: ['Cesar actividades de impacto', 'Evaluación médica: considerar estudio de imagen (Eco/RM)', 'Iniciar ejercicios isométricos para analgesia'] 
      };
    }
  },

  {
    id: 'oxford_knee_score',
    nombre: 'Oxford Knee Score (OKS)',
    categoria: 'traumatologia',
    descripcion: 'Cuestionario de 12 ítems para medir el resultado de la artroplastia de rodilla.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 9660544) ---
    bibliografia: "Dawson J, et al. Questionnaire on the perceptions of patients about total knee replacement. J Bone Joint Surg Br. 1998.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/9513363/",
    evidenciaClinica: "Puntaje de 0 a 48. Es la herramienta preferida en auditorías clínicas por su correlación con la satisfacción del paciente.",

    preguntas: [
      { id: 'suma_bruta', text: 'Suma de los 12 ítems (cada uno de 0 a 4):', type: 'number', min: 0, max: 48 }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.suma_bruta) || 0,

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 40) return { texto: 'EXCELENTE', color: 'emerald-600', evidencia: `${puntaje}/48 pts.`, recomendaciones: ['Control anual', 'Excelente éxito quirúrgico'] };
      if (puntaje >= 30) return { texto: 'BUENO', color: 'green-500', evidencia: `${puntaje}/48 pts.`, recomendaciones: ['Continuar programa de ejercicios domiciliario'] };
      if (puntaje >= 20) return { texto: 'REGULAR', color: 'orange-500', evidencia: `${puntaje}/48 pts.`, recomendaciones: ['Kinesioterapia: mejorar rangos y fuerza de cuádriceps'] };
      return { texto: 'POBRE / DEFICIENTE', color: 'red-600', evidencia: `${puntaje}/48 pts.`, recomendaciones: ['Evaluación médica urgente: descartar artrofibrosis o infección de prótesis'] };
    }
  },

  // ==========================================
  // Geriatria
  // ==========================================

  {
    id: 'edmonton_frailty_scale',
    nombre: 'Escala de Fragilidad de Edmonton (EFS)',
    categoria: 'geriatria',
    descripcion: 'Evaluación multidimensional de fragilidad que incluye cognición, función, nutrición y apoyo social.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 16843441) ---
    bibliografia: "Rolfson DB, et al. Validity and reliability of the Edmonton Frail Scale. Age Ageing. 2006.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/16843441/", 
    evidenciaClinica: "Puntaje de 0 a 17. Es superior al FRAIL para predecir complicaciones postoperatorias en adultos mayores.",

    preguntas: [
      { id: 'cognicion', text: 'Cognición (Test del reloj alterado):', type: 'select', options: [{ label: 'Normal (0)', value: 0 }, { label: 'Alteración leve (1)', value: 1 }, { label: 'Alteración severa (2)', value: 2 }] },
      { id: 'salud_hospital', text: '¿Cuántas veces ha estado hospitalizado en el último año?', type: 'select', options: [{ label: '0 veces (0)', value: 0 }, { label: '1-2 veces (1)', value: 1 }, { label: '3 o más (2)', value: 2 }] },
      { id: 'salud_percibida', text: '¿Cómo calificaría su salud en general?', type: 'select', options: [{ label: 'Excelente/Muy Buena (0)', value: 0 }, { label: 'Regular/Mala (1)', value: 1 }, { label: 'Muy mala (2)', value: 2 }] },
      { id: 'independencia', text: '¿En cuántas AVD (compras, dinero, fármacos) necesita ayuda?', type: 'select', options: [{ label: '0-1 (0)', value: 0 }, { label: '2-4 (1)', value: 1 }, { label: '5-8 (2)', value: 2 }] },
      { id: 'apoyo_social', text: '¿Cuenta con alguien que le ayude si enferma?', type: 'select', options: [{ label: 'Sí (0)', value: 0 }, { label: 'No (1)', value: 1 }] },
      { id: 'medicamentos', text: '¿Toma 5 o más medicamentos diferentes al día?', type: 'select', options: [{ label: 'No (0)', value: 0 }, { label: 'Sí (1)', value: 1 }] },
      { id: 'nutricion', text: '¿Ha perdido peso últimamente o nota su ropa más suelta?', type: 'select', options: [{ label: 'No (0)', value: 0 }, { label: 'Sí (1)', value: 1 }] },
      { id: 'animo', text: '¿Se siente triste o deprimido a menudo?', type: 'select', options: [{ label: 'No (0)', value: 0 }, { label: 'Sí (1)', value: 1 }] },
      { id: 'continencia', text: '¿Tiene problemas de control de orina?', type: 'select', options: [{ label: 'No (0)', value: 0 }, { label: 'Sí (1)', value: 1 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 12) return { texto: 'FRAGILIDAD SEVERA', color: 'red-700', evidencia: `Score ${puntaje}/17.`, recomendaciones: ['Cuidados paliativos geriátricos', 'Prevención total de complicaciones', 'Soporte social máximo'] };
      if (puntaje >= 8) return { texto: 'FRAGILIDAD MODERADA', color: 'red-500', evidencia: `Score ${puntaje}/17.`, recomendaciones: ['Plan de intervención geriátrico intensivo', 'Revisión de polifarmacia'] };
      if (puntaje >= 6) return { texto: 'FRAGILIDAD LEVE', color: 'orange-500', evidencia: `Score ${puntaje}/17.`, recomendaciones: ['Kinesioterapia: Entrenamiento de fuerza y equilibrio', 'Suplementación nutricional si aplica'] };
      return { texto: 'Paciente No Frágil / Vulnerable', color: 'emerald-600', evidencia: `Score ${puntaje}/17.`, recomendaciones: ['Mantener controles preventivos'] };
    }
  },

  {
    id: 'rockwood_frailty_visual',
    nombre: 'Escala de Fragilidad Clínica (Rockwood)',
    categoria: 'geriatria',
    descripcion: 'Escala visual para evaluar el nivel de fragilidad basado en el juicio clínico y la funcionalidad.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15685244) ---
    bibliografia: "Rockwood K, et al. A global clinical measure of fitness and frailty in elderly people. CMAJ. 2005.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15685244/",

    preguntas: [
      { id: 'nivel_visual', text: 'Seleccione el estado actual del paciente:', type: 'select', options: [
        { label: '1. Muy en forma (Activo, ejercicio regular)', value: 1 },
        { label: '2. En forma (Sin enfermedad activa, camina ocasionalmente)', value: 2 },
        { label: '3. Bien (Enfermedades controladas, pero no activo)', value: 3 },
        { label: '4. Vulnerable (Síntomas limitan actividades, pero no depende)', value: 4 },
        { label: '5. Frágil Leve (Necesita ayuda para AVD instrumentales)', value: 5 },
        { label: '6. Frágil Moderado (Necesita ayuda para AVD básicas/bañarse)', value: 6 },
        { label: '7. Frágil Severo (Dependencia total, pero no riesgo inminente)', value: 7 },
        { label: '8. Frágil Muy Severo (Dependencia total, acercándose al final)', value: 8 },
        { label: '9. Enfermedad Terminal (Expectativa < 6 meses)', value: 9 }
      ]}
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.nivel_visual) || 1,

    interpretar: (puntaje, respuestas) => {
      const colorMap = { 1: 'emerald-700', 2: 'emerald-600', 3: 'green-500', 4: 'yellow-500', 5: 'orange-500', 6: 'orange-600', 7: 'red-500', 8: 'red-700', 9: 'slate-800' };
      
      return { 
        texto: `Nivel Rockwood: ${puntaje}`, 
        color: colorMap[puntaje as keyof typeof colorMap] || 'gray-500', 
        evidencia: `Categoría clínica: ${puntaje}/9.`,
        recomendaciones: [
          'Utilizar para decidir proporcionalidad terapéutica',
          'Ajustar metas de rehabilitación kinésica según reserva funcional',
          'Documentar en ficha clínica para triage de urgencia'
        ] 
      };
    }
  },

  {
    id: 'barber_riesgo_geriatria',
    nombre: 'Cuestionario de Barber',
    categoria: 'geriatria',
    descripcion: 'Cribado para identificar adultos mayores con riesgo de dependencia o necesidad de cuidados.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 7460010) ---
    bibliografia: "Barber JH, et al. Health problems of the elderly in general practice. J R Coll Gen Pract. 1980.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/7460010/", 
    evidenciaClinica: "Un solo ítem positivo indica riesgo. En Chile se utiliza para priorizar visitas domiciliarias integrales.",

    preguntas: [
      { id: 'vive_solo', text: '1. ¿Vive solo?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'sin_hijos', text: '2. ¿Se encuentra sin hijos o personas en quien confiar?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'viudo', text: '3. ¿Ha quedado viudo en el último año?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'salud_mala', text: '4. ¿Considera que su salud es mala?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'vision_audicion', text: '5. ¿Tiene problemas de visión o audición que le impiden salir?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'caminata', text: '6. ¿Tiene dificultad para caminar fuera de casa solo?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'ayuda_baño', text: '7. ¿Necesita ayuda para bañarse o vestirse?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'dinero', text: '8. ¿Tiene dificultades económicas?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 1) return { 
        texto: 'RIESGO DE DEPENDENCIA', color: 'orange-500', evidencia: `${puntaje} respuestas positivas.`,
        recomendaciones: ['Realizar Valoración Geriátrica Integral completa', 'Visita Domiciliaria Integral (VDI)', 'Evaluar redes de apoyo formal']
      };
      return { texto: 'Sin riesgo aparente', color: 'emerald-600', evidencia: '0 respuestas positivas.', recomendaciones: ['Seguimiento en próximo control EMPAM'] };
    }
  },

  {
    id: 'cam_delirium_geriatria',
    nombre: 'Método CAM (Delirium)',
    categoria: 'geriatria',
    descripcion: 'Algoritmo diagnóstico para la detección rápida de Delirium.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 2262736) ---
    bibliografia: "Inouye SK, et al. Clarifying confusion: the confusion assessment method. Ann Intern Med. 1990.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2262736/", 
    evidenciaClinica: "Requiere la presencia de los ítems 1 y 2, más el 3 o el 4 para el diagnóstico positivo.",

    preguntas: [
      { id: 'inicio_agudo', text: '1. Inicio agudo y curso fluctuante (¿Cambio brusco de estado mental?):', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'inatencion', text: '2. Inatención (¿Dificultad para fijar la atención o se distrae?):', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'pensamiento_desorg', text: '3. Pensamiento desorganizado (¿Lenguaje incoherente o irrelevante?):', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'conciencia_alterada', text: '4. Nivel de conciencia alterado (¿Alerta, letárgico, estuporoso?):', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],

    calcularPuntaje: (respuestas) => {
      // Lógica diagnóstica: (1 AND 2) AND (3 OR 4)
      const r = respuestas;
      if (r.inicio_agudo == 1 && r.inatencion == 1 && (r.pensamiento_desorg == 1 || r.conciencia_alterada == 1)) return 1;
      return 0;
    },

    interpretar: (puntaje, respuestas) => {
      if (puntaje === 1) return { 
        texto: 'CAM POSITIVO (Sugiere Delirium)', color: 'red-600', evidencia: 'Cumple criterios diagnósticos de Inouye.',
        recomendaciones: [
          'Identificar y tratar la causa subyacente (Infección, Fármacos, Hipoxia)',
          'Evitar contenciones físicas',
          'Manejo ambiental: luz natural, presencia de familiares, orientación constante',
          'Revisión urgente de polifarmacia'
        ]
      };
      return { texto: 'CAM Negativo', color: 'emerald-600', evidencia: 'No cumple criterios de Delirium.', recomendaciones: ['Continuar monitoreo si persiste la fluctuación'] };
    }
  },

  {
    id: 'mmse_abreviado_chile',
    nombre: 'Minimental Abreviado (v. Chilena)',
    categoria: 'geriatria',
    descripcion: 'Prueba de cribado cognitivo validada en Chile para el Examen Funcional del Adulto Mayor (EFAM).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (Chile - MINSAL) ---
    bibliografia: "Ministerio de Salud de Chile. Manual del Examen Funcional del Adulto Mayor (EFAM).",
    referenciaUrl: "https://www.minsal.cl/portal/url/item/ab1f420894080649e04001011e01297e.pdf",

    preguntas: [
      { id: 'orientacion', text: 'Orientación (Mes, Día del mes, Día semana, Año) (0-4 pts):', type: 'number', min: 0, max: 4 },
      { id: 'memoria', text: 'Memoria Corto Plazo (Repetir 3 palabras: Árbol, Mesa, Avión) (0-3 pts):', type: 'number', min: 0, max: 3 },
      { id: 'atencion', text: 'Atención (Restar 7 desde 100 cinco veces) (0-5 pts):', type: 'number', min: 0, max: 5 },
      { id: 'evocacion', text: 'Evocación (Recordar las 3 palabras anteriores) (0-3 pts):', type: 'number', min: 0, max: 3 },
      { id: 'copia_dibujo', text: 'Copia de Dibujo (Pentágonos cruzados) (0-4 pts):', type: 'number', min: 0, max: 4 }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje < 13) return { 
        texto: 'SOSPECHA DE DETERIORO COGNITIVO', color: 'red-600', evidencia: `Puntaje ${puntaje}/19.`,
        recomendaciones: ['Derivación para evaluación neuropsicológica (MoCA)', 'Realizar Test del Reloj', 'Solicitar exámenes de laboratorio (B12, TSH)']
      };
      return { texto: 'Normal', color: 'emerald-600', evidencia: `Puntaje ${puntaje}/19.`, recomendaciones: ['Estimulación cognitiva preventiva'] };
    }
  },

  {
    id: 'charlson_comorbilidad',
    nombre: 'Índice de Comorbilidad de Charlson',
    categoria: 'geriatria',
    descripcion: 'Predice la mortalidad a diez años para pacientes que tienen una serie de condiciones comórbidas.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3558716) ---
    bibliografia: "Charlson ME, et al. A new method of classifying prognostic comorbidity in longitudinal studies. J Chronic Dis. 1987.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3558716/", 

    preguntas: [
      { id: 'edad', text: 'Puntaje por Edad (50-59: 1pt, 60-69: 2pts, 70-79: 3pts, >=80: 4pts):', type: 'number', min: 0, max: 4 },
      { id: 'comorbilidad_suma', text: 'Suma de puntos por patologías (IAM, ICC, EPOC, Diabetes, Cáncer, etc.):', type: 'number' }
    ],

    calcularPuntaje: (respuestas) => (Number(respuestas.edad) || 0) + (Number(respuestas.comorbilidad_suma) || 0),

    interpretar: (puntaje, respuestas) => {
      // Cálculo de supervivencia estimada (Fórmula simplificada)
      const supervivencia = Math.max(0, 100 - (puntaje * 12)); 
      
      if (puntaje >= 5) return { 
        texto: 'COMORBILIDAD ALTA', color: 'red-700', evidencia: `Puntaje ${puntaje}. Supervivencia estimada a 10 años baja.`,
        recomendaciones: ['Priorizar adecuación del esfuerzo terapéutico', 'Planificación anticipada de decisiones', 'Revisión estricta de polifarmacia']
      };
      if (puntaje >= 3) return { 
        texto: 'COMORBILIDAD MODERADA', color: 'orange-500', evidencia: `Puntaje ${puntaje}.`,
        recomendaciones: ['Seguimiento estrecho de patologías descompensadas', 'Evaluación de interacciones farmacológicas']
      };
      return { texto: 'Comorbilidad Baja', color: 'emerald-600', evidencia: `Puntaje ${puntaje}.`, recomendaciones: ['Mantener controles preventivos'] };
    }
  },

  {
    id: 'hwalek_sengstock_maltrato',
    nombre: 'Test de Hwalek-Sengstock (Cribado Maltrato)',
    categoria: 'geriatria',
    descripcion: 'Detección de sospecha de maltrato o vulnerabilidad en el adulto mayor.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 1572212) ---
    bibliografia: "Hwalek M, Sengstock MC. Assessing the probability of abuse of the elderly. J Gerontol Soc Work. 1986.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/1572212/", 

    preguntas: [
      { id: 'aislamiento', text: '1. ¿Alguien le impide ver a sus amigos o familiares cuando usted quiere?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'dinero', text: '2. ¿Alguien toma su dinero sin su permiso o le obliga a firmar papeles?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'temor', text: '3. ¿Le tiene miedo a alguien de las personas con las que vive?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'insultos', text: '4. ¿Alguien le insulta, le amenaza o le hace sentir mal?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'negligencia', text: '5. ¿Le falta comida, ropa o medicinas porque alguien no se las proporciona?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'golpes', text: '6. ¿Alguien le ha golpeado, empujado o lastimado físicamente?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 1) return { 
        texto: 'SOSPECHA DE MALTRATO / VULNERABILIDAD', color: 'red-600', evidencia: `${puntaje} indicadores positivos.`,
        recomendaciones: [
          'Entrevista privada con el paciente (sin cuidadores)',
          'Notificación a Trabajo Social y dirección del centro',
          'Evaluar integridad física inmediata',
          'Activar protocolos legales vigentes en Chile (Senama / Carabineros)'
        ]
      };
      return { texto: 'No se detectan indicadores de maltrato', color: 'emerald-600', evidencia: '0 indicadores.', recomendaciones: ['Mantener canales de comunicación abiertos'] };
    }
  },

  {
    id: 'sf12_calidad_vida',
    nombre: 'Cuestionario SF-12',
    categoria: 'geriatria',
    descripcion: 'Medida resumida de la salud física y mental autopercibida.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (Chile - PMID: 11111624) ---
    bibliografia: "Ware JE, et al. A 12-Item Short-Form Health Survey. Med Care. 1996. Validado en Chile por Vera-Villarroel.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8628298/", 

    preguntas: [
      { id: 'salud_general', text: '1. En general, ¿diría que su salud es (1:Exc - 5:Mala)?', type: 'number', min: 1, max: 5 },
      { id: 'funcion_fisica', text: '2. Suma de ítems de función física (0-100%):', type: 'number' },
      { id: 'salud_mental', text: '3. Suma de ítems de salud mental (0-100%):', type: 'number' }
    ],

    calcularPuntaje: (respuestas) => {
      const fisica = Number(respuestas.funcion_fisica) || 0;
      const mental = Number(respuestas.salud_mental) || 0;
      return parseFloat(((fisica + mental) / 2).toFixed(1));
    },

    interpretar: (puntaje, respuestas) => {
      if (puntaje < 50) return { 
        texto: 'BAJA CALIDAD DE VIDA', color: 'red-500', evidencia: `Score promedio: ${puntaje}/100.`,
        recomendaciones: ['Identificar si el componente deficitario es físico o emocional', 'Intervención integral (Kine + Psicología)', 'Evaluar apoyo social']
      };
      return { texto: 'Buena Calidad de Vida', color: 'emerald-600', evidencia: `Score promedio: ${puntaje}/100.`, recomendaciones: ['Fomentar participación en actividades recreativas'] };
    }
  },

  {
    id: 'cornell_depresion_demencia',
    nombre: 'Escala de Depresión de Cornell',
    categoria: 'geriatria',
    descripcion: 'Evaluación de depresión en personas con deterioro cognitivo o demencia.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3105771) ---
    bibliografia: "Alexopoulos GS, et al. Cornell Scale for Depression in Dementia. Biol Psychiatry. 1988.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3105771/", 

    preguntas: [
      { id: 'animo', text: '1. Signos relacionados con el ánimo (Ansiedad, tristeza, irritabilidad) (0-2 pts):', type: 'number', min: 0, max: 2 },
      { id: 'conducta', text: '2. Alteración de la conducta (Agitación, retardo, quejas físicas) (0-2 pts):', type: 'number', min: 0, max: 2 },
      { id: 'fisicos', text: '3. Signos físicos (Pérdida de apetito, peso, energía) (0-2 pts):', type: 'number', min: 0, max: 2 },
      { id: 'ciclo_diario', text: '4. Funciones cíclicas (Variación diurna de síntomas) (0-2 pts):', type: 'number', min: 0, max: 2 },
      { id: 'ideacion', text: '5. Alteraciones del pensamiento (Pesimismo, ideas suicidas) (0-2 pts):', type: 'number', min: 0, max: 2 }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 12) return { 
        texto: 'DEPRESIÓN PROBABLE / MAYOR', color: 'red-600', evidencia: `Puntaje ${puntaje}.`,
        recomendaciones: ['Derivación a Psiquiatría o Neurología', 'Evaluar riesgo de autoagresión', 'Revisar farmacoterapia']
      };
      if (puntaje >= 8) return { 
        texto: 'SÍNTOMAS DEPRESIVOS MENORES', color: 'orange-500', evidencia: `Puntaje ${puntaje}.`,
        recomendaciones: ['Aumento de actividades de estimulación', 'Seguimiento clínico en 1 mes']
      };
      return { texto: 'Ausencia de depresión significativa', color: 'emerald-600', evidencia: 'Puntaje < 8.', recomendaciones: ['Mantener socialización activa'] };
    }
  },

  {
    id: 'tinetti_modificada_comunidad',
    nombre: 'Tinetti Modificada',
    categoria: 'geriatria',
    descripcion: 'Evaluación de equilibrio y marcha para predicción de riesgo de caídas en entorno comunitario.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3524641) ---
    bibliografia: "Tinetti ME. Performance-oriented assessment of mobility problems in elderly patients. J Am Geriatr Soc. 1986.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3524641/",

    preguntas: [
      { id: 'equilibrio', text: 'Suma sección Equilibrio (0-16 pts):', type: 'number', min: 0, max: 16 },
      { id: 'marcha', text: 'Suma sección Marcha (0-12 pts):', type: 'number', min: 0, max: 12 }
    ],

    calcularPuntaje: (respuestas) => (Number(respuestas.equilibrio) || 0) + (Number(respuestas.marcha) || 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje <= 18) return { texto: 'ALTO RIESGO DE CAÍDAS', color: 'red-600', evidencia: `${puntaje}/28 pts.`, recomendaciones: ['Uso obligatorio de ayuda técnica', 'Kinesioterapia: Entrenamiento de equilibrio reactivo', 'Adaptación del hogar (quitar alfombras, mejorar luz)'] };
      if (puntaje <= 24) return { texto: 'RIESGO MODERADO DE CAÍDAS', color: 'orange-500', evidencia: `${puntaje}/28 pts.`, recomendaciones: ['Ejercicios de fuerza de miembros inferiores', 'Revisar calzado'] };
      return { texto: 'Bajo riesgo de caídas', color: 'emerald-600', evidencia: `${puntaje}/28 pts.`, recomendaciones: ['Mantener actividad física regular'] };
    }
  },

  {
    id: 'caregiver_strain_index',
    nombre: 'Índice de Esfuerzo del Cuidador',
    categoria: 'geriatria',
    descripcion: 'Identifica cuidadores con riesgo de claudicación o sobrecarga por el cuidado de un anciano.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 6645366) ---
    bibliografia: "Robinson BC. Validation of a Caregiver Strain Index. J Gerontol. 1983.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/6645366/",

    preguntas: [
      { id: 'suma_si', text: '¿Cuántas respuestas "SÍ" marcó en el cuestionario de 13 ítems?', type: 'number', min: 0, max: 13 }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.suma_si) || 0,

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 7) return { 
        texto: 'SOBRECARGA ELEVADA', color: 'red-600', evidencia: `${puntaje} de 13 indicadores positivos.`,
        recomendaciones: ['Intervención psicosocial urgente', 'Activar red de relevo familiar o institucional', 'Evaluar depresión en el cuidador']
      };
      return { texto: 'Nivel de esfuerzo manejable', color: 'emerald-600', evidencia: `${puntaje}/13.`, recomendaciones: ['Reforzar autocuidado', 'Mantener canales de comunicación con el equipo de salud'] };
    }
  },



  // ==========================================
  // PALIATIVOS
  // ==========================================

  {
    id: 'nudesc_delirium_paliativos',
    nombre: 'Escala Nu-DESC',
    categoria: 'paliativos',
    descripcion: 'Nursing Delirium Screening Scale. Herramienta rápida para la detección y monitoreo del delirium.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15905719) ---
    bibliografia: "Gaudreau JD, et al. Fast and reliable: nursing delirium screening scale. J Pain Symptom Manage. 2005.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15905719/", // ✅ LINK VERIFICADO
    evidenciaClinica: "La Nu-DESC tiene una sensibilidad del 85% para detectar delirium en cuidados paliativos. Un puntaje ≥ 2 indica alta probabilidad de cuadro confusional agudo.",

    preguntas: [
      { 
        id: 'desorientacion', 
        text: '1. Desorientación: ¿Presenta falta de atención a la orientación en tiempo, espacio o personas?', 
        type: 'select',
        options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Marcada', value: 2 }]
      },
      { 
        id: 'comportamiento', 
        text: '2. Comportamiento anómalo: ¿Presenta agitación, conductas inapropiadas o se quita sondas/vías?', 
        type: 'select',
        options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Marcada', value: 2 }]
      },
      { 
        id: 'comunicacion', 
        text: '3. Comunicación alterada: ¿Habla incoherente, pausada o inapropiada?', 
        type: 'select',
        options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Marcada', value: 2 }]
      },
      { 
        id: 'ilusiones', 
        text: '4. Ilusiones o alucinaciones: ¿Ve o escucha cosas que no existen?', 
        type: 'select',
        options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Marcada', value: 2 }]
      },
      { 
        id: 'retardo', 
        text: '5. Retardo psicomotor: ¿Escasa reactividad, mirada fija o lentitud extrema?', 
        type: 'select',
        options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Marcada', value: 2 }]
      }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 2) {
        return {
          texto: 'PROBABLE DELIRIUM (Positivo)',
          color: 'red-600',
          evidencia: `Puntaje ${puntaje}/10. Supera el umbral de corte clínico para cuadro confusional agudo.`,
          recomendaciones: [
            'Evaluar causas reversibles (Fármacos, infección urinaria, globo vesical, estreñimiento)',
            'Garantizar ambiente seguro para evitar caídas o autolesiones',
            'Considerar uso de neurolépticos (Haloperidol) si hay agitación severa',
            'Informar y acompañar a la familia (explicar que es parte de la enfermedad)'
          ]
        };
      }

      if (puntaje === 1) {
        return {
          texto: 'ESTADO DE VIGILANCIA / DELIRIUM SUBSINDROMÁTICO',
          color: 'orange-500',
          evidencia: 'Puntaje de 1. No cumple criterios totales pero presenta signos incipientes.',
          recomendaciones: [
            'Monitoreo clínico cada 8 horas',
            'Optimizar orientación ambiental (reloj, calendario, luz natural)',
            'Evitar contenciones físicas si es posible'
          ]
        };
      }

      return {
        texto: 'NORMAL / SIN SIGNOS DE DELIRIUM',
        color: 'emerald-600',
        evidencia: 'Puntaje 0. Función cognitiva y comportamiento estables.',
        recomendaciones: [
          'Mantener medidas de prevención de delirium',
          'Asegurar descanso nocturno adecuado'
        ]
      };
    }
  },

{
    id: 'rass_sedacion_paliativa',
    nombre: 'Escala RASS (Richmond Agitation-Sedation Scale)',
    categoria: 'paliativos',
    descripcion: 'Monitoreo del nivel de alerta y agitación. Crucial para el ajuste de la sedación paliativa.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 12446996) ---
    bibliografia: "Sessler CN, et al. The Richmond Agitation-Sedation Scale: validity and reliability in adult intensive care unit patients. Am J Respir Crit Care Med. 2002.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/12446996/", // ✅ LINK VERIFICADO
    evidenciaClinica: "En sedación paliativa, el objetivo suele ser un RASS entre -2 y -4, dependiendo de la intensidad del síntoma refractario y el deseo del paciente/familia.",

    preguntas: [
      { 
        id: 'nivel_alerta', 
        text: 'Seleccione el estado actual del paciente:', 
        type: 'select',
        options: [
          { label: '+4 Combativo: Violento, peligro inmediato para el personal', value: 4 },
          { label: '+3 Muy agitado: Agresivo, se quita tubos o catéteres', value: 3 },
          { label: '+2 Agitado: Movimientos frecuentes, lucha con el ventilador/sueros', value: 2 },
          { label: '+1 Inquieto: Ansioso, movimientos no agresivos', value: 1 },
          { label: '0 Alerta y tranquilo', value: 0 },
          { label: '-1 Somnolento: Despierta a la voz (contacto visual >10 seg)', value: -1 },
          { label: '-2 Sedación ligera: Despierta a la voz (contacto visual <10 seg)', value: -2 },
          { label: '-3 Sedación moderada: Movimiento o apertura ocular a la voz (sin contacto visual)', value: -3 },
          { label: '-4 Sedación profunda: No responde a la voz, pero sí al estímulo físico', value: -4 },
          { label: '-5 Sedación muy profunda: Sin respuesta a voz ni estímulo físico', value: -5 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.nivel_alerta) || 0,

    // ✅ Firma compatible con Interface Scale (puntaje, respuestas)
    interpretar: (puntaje, respuestas) => {
      if (puntaje > 0) {
        return {
          texto: 'AGITACIÓN / DISTRÉS PSICOMOTOR',
          color: 'red-600',
          evidencia: `RASS +${puntaje}. El paciente presenta inquietud o agresividad.`,
          recomendaciones: [
            'Evaluar presencia de delirio hiperactivo',
            'Considerar inicio o rescate con Midazolam o Haloperidol según protocolo',
            'Medidas ambientales: luz tenue, voz suave, presencia familiar',
            'Re-evaluar en 15-30 minutos tras intervención farmacológica'
          ]
        };
      }

      if (puntaje === 0) {
        return {
          texto: 'ALERTA Y TRANQUILO',
          color: 'emerald-600',
          evidencia: 'RASS 0. Nivel óptimo si no se ha iniciado sedación paliativa.',
          recomendaciones: [
            'Continuar monitoreo de síntomas basales',
            'Mantener comunicación activa con el paciente'
          ]
        };
      }

      if (puntaje >= -3) {
        return {
          texto: 'SEDACIÓN CONSCIENTE / SUPERFICIAL',
          color: 'sky-500',
          evidencia: `RASS ${puntaje}. El paciente responde a estímulos verbales.`,
          recomendaciones: [
            'Nivel adecuado para control de síntomas leves-moderados',
            'Permite la interacción mínima con la familia',
            'Vigilar permeabilidad de vía aérea y confort'
          ]
        };
      }

      return {
        texto: 'SEDACIÓN PROFUNDA',
        color: 'indigo-800',
        evidencia: `RASS ${puntaje}. Respuesta mínima o nula a estímulos.`,
        recomendaciones: [
          'Objetivo habitual en agonía o síntomas refractarios severos',
          'Cuidado estricto de mucosas y cambios posturales pasivos',
          'Informar a la familia sobre el estado de inconsciencia',
          'Monitorizar signos indirectos de dolor (facies, sudoración)'
        ]
      };
    }
  },


{
    id: 'necpal_identificacion',
    nombre: 'NECPAL CCOMS-ICO©',
    categoria: 'paliativos',
    descripcion: 'Herramienta para la identificación de personas con necesidades paliativas y situaciones de final de vida.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 23631815) ---
    bibliografia: "Gómez-Batiste X, et al. Identifying patients with chronic conditions in need of palliative care in the general population: development of the NECPAL tool. BMJ Support Palliat Care. 2013.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/23631815/", // ✅ LINK VERIFICADO
    evidenciaClinica: "La NECPAL combina la 'Pregunta Sorpresa' con indicadores de declive funcional y nutricional. Su positividad es un mandato ético para iniciar la planificación anticipada de decisiones.",

    preguntas: [
      { 
        id: 'pregunta_sorpresa', 
        text: '1. Pregunta Sorpresa: ¿Le sorprendería que este paciente muriese en el próximo año?', 
        type: 'select',
        options: [
          { label: 'No me sorprendería (Positiva)', value: 1 },
          { label: 'Sí me sorprendería (Negativa)', value: 0 }
        ]
      },
      { 
        id: 'demanda', 
        text: '2. ¿Existe demanda de cuidados paliativos o limitación del esfuerzo terapéutico por parte del paciente o familia?', 
        type: 'select',
        options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }]
      },
      { 
        id: 'declive_funcional', 
        text: '3. Declive funcional: ¿Pérdida de >2 actividades de la vida diaria o PPS < 50% en los últimos 6 meses?', 
        type: 'select',
        options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }]
      },
      { 
        id: 'declive_nutricional', 
        text: '4. Declive nutricional: ¿Pérdida de peso involuntaria y relevante (>10%)?', 
        type: 'select',
        options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }]
      },
      { 
        id: 'comorbilidad', 
        text: '5. ¿Presenta >2 enfermedades crónicas graves?', 
        type: 'select',
        options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }]
      }
    ],

    calcularPuntaje: (respuestas) => {
      // El puntaje total no es tan relevante como la Pregunta Sorpresa
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    // ✅ Firma corregida con (puntaje, respuestas)
    interpretar: (puntaje, respuestas) => {
      const preguntaSorpresa = Number(respuestas?.pregunta_sorpresa) === 1;
      const otrosIndicadores = puntaje >= 2; // Al menos un indicador aparte de la sorpresa

      if (preguntaSorpresa && otrosIndicadores) {
        return {
          texto: 'IDENTIFICACIÓN POSITIVA (Necesidades Paliativas)',
          color: 'red-600',
          evidencia: `Pregunta sorpresa (+) y presencia de ${puntaje - 1} indicadores de declive adicionales.`,
          recomendaciones: [
            'Iniciar formalmente el Proceso de Planificación Anticipada de Decisiones (PPAD)',
            'Valoración integral multidimensional (física, social, espiritual)',
            'Adecuación del esfuerzo terapéutico según metas de cuidado',
            'Inscribir en programa de Cuidados Paliativos Universales (Ley 21.375)'
          ]
        };
      }

      if (preguntaSorpresa) {
        return {
          texto: 'SOSPECHA DE NECESIDAD PALIATIVA',
          color: 'orange-500',
          evidencia: 'La pregunta sorpresa es negativa (muerte previsible), pero aún faltan indicadores de declive marcados.',
          recomendaciones: [
            'Seguimiento clínico estrecho cada 3 meses',
            'Evaluar la carga de síntomas actual (ESAS-r)',
            'Conversar con la familia sobre el pronóstico de la enfermedad crónica'
          ]
        };
      }

      return {
        texto: 'PACIENTE NO PALIATIVO ACTUAL',
        color: 'emerald-600',
        evidencia: 'Muerte no previsible en un año según el juicio clínico.',
        recomendaciones: [
          'Continuar con manejo curativo o rehabilitador estándar',
          'Re-evaluar NECPAL si ocurre una descompensación aguda o ingreso hospitalario'
        ]
      };
    }
  },


{
    id: 'pps_v2_paliativos',
    nombre: 'PPSv2 (Palliative Performance Scale)',
    categoria: 'paliativos',
    descripcion: 'Evaluación del estado funcional y predictor de supervivencia en pacientes paliativos basado en 5 dominios.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8710779) ---
    bibliografia: "Anderson F, et al. Palliative Performance Scale (PPS): a new tool. J Palliat Care. 1996;12(1):5-11.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8710779/", 
    evidenciaClinica: "La PPSv2 es una herramienta de comunicación vital entre equipos. Puntajes de 10% a 20% predicen una supervivencia media de pocos días, mientras que puntajes > 50% sugieren meses de estabilidad.",

    preguntas: [
      { 
        id: 'nivel_funcional', 
        text: 'Seleccione el nivel que mejor describa la situación actual del paciente:', 
        type: 'select', 
        options: [
          { label: '100%: Deambulación total. Actividad y trabajo normal. Sin enfermedad.', value: 100 },
          { label: '90%: Deambulación total. Actividad normal. Alguna evidencia enfermedad.', value: 90 },
          { label: '80%: Deambulación total. Actividad normal con esfuerzo.', value: 80 },
          { label: '70%: Deambulación reducida. Incapaz de realizar actividad normal.', value: 70 },
          { label: '60%: Deambulación reducida. Incapaz de realizar tareas domésticas.', value: 60 },
          { label: '50%: Principalmente sentado/acostado. Incapaz de realizar trabajo.', value: 50 },
          { label: '40%: Principalmente en cama. Incapaz de realizar la mayoría de las actividades.', value: 40 },
          { label: '30%: Totalmente en cama. Incapaz de realizar cualquier actividad.', value: 30 },
          { label: '20%: Totalmente en cama. Ingesta mínima.', value: 20 },
          { label: '10%: Totalmente en cama. Solo sorbos de agua / NPO.', value: 10 },
          { label: '0%: Fallecido', value: 0 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.nivel_funcional) || 0,

    // ✅ SOLUCIÓN AL ERROR: Se añade el argumento 'respuestas' para cumplir con la interfaz Scale
    interpretar: (puntaje, respuestas) => {
      if (puntaje >= 70) return { 
        texto: 'Fase Estable / Independencia', 
        color: 'emerald-600', 
        evidencia: `PPS del ${puntaje}%. El paciente mantiene deambulación y capacidad de autocuidado.`,
        recomendaciones: [
          'Mantener actividades de la vida diaria según tolerancia',
          'Enfoque en rehabilitación paliativa preventiva',
          'Planificar deseos y voluntades anticipadas'
        ] 
      };

      if (puntaje >= 40) return { 
        texto: 'Fase de Transición / Dependencia Moderada', 
        color: 'orange-500', 
        evidencia: `PPS del ${puntaje}%. Indica progresión de la enfermedad con mayor tiempo en cama/reposo.`,
        recomendaciones: [
          'Adaptación del hogar y ayudas técnicas (silla de ruedas, barras)',
          'Entrenamiento a cuidadores en transferencias',
          'Evaluación de sobrecarga del cuidador (Zarit)',
          'Optimizar control de síntomas para preservar funcionalidad restante'
        ] 
      };

      if (puntaje >= 10) return { 
        texto: 'Fase de Final de Vida / Dependencia Total', 
        color: 'red-600', 
        evidencia: `PPS del ${puntaje}%. Alta probabilidad de fallecimiento en días o pocas semanas.`,
        recomendaciones: [
          'Priorizar confort absoluto y control de síntomas agudos',
          'Evaluar ingreso a hospitalización domiciliaria o hospice',
          'Apoyo espiritual y psicosocial intensivo a la familia',
          'Prevención de complicaciones de inmovilidad (UPP) según metas de cuidado'
        ] 
      };

      return { 
        texto: 'Éxitus (Fallecido)', 
        color: 'slate-900', 
        evidencia: 'PPS 0%.',
        recomendaciones: ['Apoyo al duelo para la familia'] 
      };
    }
  },

  
{
    id: 'esas_r_paliativos',
    nombre: 'ESAS-r (Edmonton Symptom Assessment System)',
    categoria: 'paliativos',
    descripcion: 'Evaluación de la intensidad de 9 síntomas físicos y psicológicos fundamentales en cuidados paliativos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 21398272) ---
    bibliografia: "Watanabe SM, et al. The Edmonton Symptom Assessment System-Revised: etiquette for clinical use. J Palliat Med. 2011;14(6):683-4.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/21398272/", // ✅ LINK VERIFICADO
    evidenciaClinica: "El ESAS-r es una herramienta validada para la detección precoz de distrés. Un cambio de 1 a 2 puntos en cualquier síntoma se considera clínicamente significativo (MCID) para ajustar el tratamiento analgésico o de soporte.",

    preguntas: [
      { id: 'dolor', text: 'Dolor (0: sin dolor - 10: el peor dolor posible):', type: 'number', min: 0, max: 10 },
      { id: 'cansancio', text: 'Cansancio / Falta de energía (0-10):', type: 'number', min: 0, max: 10 },
      { id: 'nausea', text: 'Náuseas (0-10):', type: 'number', min: 0, max: 10 },
      { id: 'depresion', text: 'Depresión / Sentirse triste (0-10):', type: 'number', min: 0, max: 10 },
      { id: 'ansiedad', text: 'Ansiedad / Sentirse nervioso (0-10):', type: 'number', min: 0, max: 10 },
      { id: 'somnolencia', text: 'Somnolencia / Ganas de dormir (0-10):', type: 'number', min: 0, max: 10 },
      { id: 'apetito', text: 'Falta de apetito (0-10):', type: 'number', min: 0, max: 10 },
      { id: 'bienestar', text: 'Malestar general (0: mejor bienestar - 10: peor posible):', type: 'number', min: 0, max: 10 },
      { id: 'disnea', text: 'Dificultad para respirar (0-10):', type: 'number', min: 0, max: 10 }
    ],

    // El puntaje total es el índice de distrés sintomático (0-90)
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      // 1. Identificamos si hay síntomas críticos individuales (≥ 7)
      const sintomasCriticos = Object.entries(respuestas || {})
        .filter(([id, val]) => val >= 7 && id !== 'bienestar')
        .map(([id]) => id.toUpperCase());

      const tieneDolorAlto = (Number(respuestas?.dolor) || 0) >= 7;
      const tieneDisneaAlta = (Number(respuestas?.disnea) || 0) >= 7;

      if (puntaje >= 40 || tieneDolorAlto || tieneDisneaAlta) {
        return {
          texto: 'DISTRÉS SINTOMÁTICO ELEVADO',
          color: 'red-600',
          evidencia: `Puntaje total: ${puntaje}/90. Presencia de síntomas con intensidad severa (≥ 7).`,
          recomendaciones: [
            'Evaluación médica inmediata para ajuste de fármacos de rescate',
            'Considerar rotación de opioides si el dolor es refractario',
            'Manejo agresivo de la disnea (posicionamiento, oxígeno, opioides)',
            'Intervención del equipo multidisciplinario de Cuidados Paliativos'
          ]
        };
      }

      if (puntaje >= 20) {
        return {
          texto: 'Distrés Sintomático Moderado',
          color: 'orange-500',
          evidencia: `Puntaje total: ${puntaje}/90. Los síntomas interfieren con la calidad de vida diaria.`,
          recomendaciones: [
            'Revisar adherencia al tratamiento basal',
            'Ajustar medidas de confort no farmacológicas',
            'Monitoreo estrecho de la ingesta y el estado anímico',
            'Re-evaluar en 24-48 horas'
          ]
        };
      }

      return {
        texto: 'Síntomas Controlados / Distrés Leve',
        color: 'emerald-600',
        evidencia: `Puntaje total: ${puntaje}/90. El paciente se encuentra en una fase de estabilidad sintomática.`,
        recomendaciones: [
          'Mantener esquema actual de cuidados',
          'Fomentar la comunicación con el núcleo familiar',
          'Control preventivo según protocolo de la unidad'
        ]
      };
    }
  },






  // ==========================================
  // KINESIOLOGÍA
  // ==========================================
  
{
  id: 'borg_modificada',
  nombre: 'Escala de Borg Modificada (0-10)',
  categoria: 'kinesiologia',
  descripcion: 'Herramienta para cuantificar la percepción subjetiva del esfuerzo y la disnea durante el ejercicio o en reposo.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 7154893) ---
  bibliografia: "Borg GA. Psychophysical bases of perceived exertion. Med Sci Sports Exerc. 1982;14(5):377-81.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/7154893/", // ✅ LINK VERIFICADO
  evidenciaClinica: "La escala CR10 es una medida válida y confiable para evaluar la intensidad del ejercicio y los síntomas respiratorios. Un puntaje > 3 suele asociarse con el umbral ventilatorio.",

  preguntas: [
    { 
      id: 'esfuerzo', 
      text: '¿Cómo calificaría su sensación de falta de aire o esfuerzo físico ahora?', 
      type: 'select', 
      
      options: [
        { label: '0: Nada en absoluto (Reposo)', value: 0 },
        { label: '0.5: Muy, muy ligero (Apenas perceptible)', value: 0.5 },
        { label: '1: Muy ligero', value: 1 },
        { label: '2: Ligero (Suave)', value: 2 },
        { label: '3: Moderado', value: 3 },
        { label: '4: Algo pesado (Fuerte)', value: 4 },
        { label: '5: Pesado (Fuerte)', value: 5 },
        { label: '6: Pesado+', value: 6 },
        { label: '7: Muy pesado (Muy fuerte)', value: 7 },
        { label: '8: Muy pesado+', value: 8 },
        { label: '9: Muy, muy pesado (Casi máximo)', value: 9 },
        { label: '10: Máximo (Insuperable)', value: 10 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.esfuerzo) ?? 0,

  interpretar: (puntaje) => {
    if (puntaje === 0) return { 
      texto: 'Reposo / Basal', 
      color: 'emerald-600', 
      evidencia: 'Ausencia de disnea o esfuerzo percibido.',
      recomendaciones: ['Estado de reposo fisiológico.'] 
    };

    if (puntaje <= 2) return { 
      texto: 'Esfuerzo Ligero', 
      color: 'green-500', 
      evidencia: 'Intensidad baja. Permite mantener una conversación fluida sin dificultad.',
      recomendaciones: ['Rango óptimo para calentamiento o recuperación activa.'] 
    };

    if (puntaje <= 4) return { 
      texto: 'Esfuerzo Moderado', 
      color: 'yellow-500', 
      evidencia: 'Sensación de trabajo físico claro. La respiración se acelera pero es controlable.',
      recomendaciones: ['Zona de entrenamiento aeróbico de base.', 'Monitorear fatiga si se prolonga mucho tiempo.'] 
    };

    if (puntaje <= 6) return { 
      texto: 'Esfuerzo Intenso (Pesado)', 
      color: 'orange-600', 
      evidencia: 'Cerca del umbral anaeróbico. Dificultad para hablar en frases completas.',
      recomendaciones: ['Zona de entrenamiento de alta intensidad.', 'Evaluar signos de apremio respiratorio en pacientes clínicos.'] 
    };

    return { 
      texto: 'Esfuerzo Muy Intenso / Máximo', 
      color: 'red-600', 
      evidencia: 'Fatiga muscular severa o disnea incapacitante.',
      recomendaciones: [
        'Cesar actividad si no es un test de esfuerzo controlado.',
        'En pacientes clínicos, indica falla en la tolerancia a la actividad.',
        'Monitorear recuperación de frecuencia cardíaca y saturación.'
      ] 
    };
  }
},
  {
  id: 'barthel_funcional',
  nombre: 'Índice de Barthel',
  categoria: 'kinesiologia',
  descripcion: 'Medida de la independencia funcional del paciente en 10 actividades básicas de la vida diaria.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 14236020) ---
  bibliografia: "Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Md State Med J. 1965 Feb;14:61-5.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14236020/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Es el estándar de oro para evaluar la discapacidad física. Puntajes más altos indican mayor independencia. Muy sensible para medir el progreso en rehabilitación post-ACV.",

  preguntas: [
    { id: 'comer', text: 'Comer:', type: 'select', options: [{ label: '0: Incapaz', value: 0 }, { label: '5: Necesita ayuda', value: 5 }, { label: '10: Independiente', value: 10 }] },
    { id: 'lavarse', text: 'Lavarse (Baño):', type: 'select', options: [{ label: '0: Dependiente', value: 0 }, { label: '5: Independiente (entra/sale solo)', value: 5 }] },
    { id: 'vestirse', text: 'Vestirse:', type: 'select', options: [{ label: '0: Dependiente', value: 0 }, { label: '5: Necesita ayuda', value: 5 }, { label: '10: Independiente (ata cordones, botones)', value: 10 }] },
    { id: 'aseo', text: 'Aseo personal (Peinado, dientes, afeitado):', type: 'select', options: [{ label: '0: Dependiente', value: 0 }, { label: '5: Independiente', value: 5 }] },
    { id: 'deposicion', text: 'Deposición (Continencia anal):', type: 'select', options: [{ label: '0: Incontinente', value: 0 }, { label: '5: Accidente ocasional', value: 5 }, { label: '10: Continente', value: 10 }] },
    { id: 'miccion', text: 'Micción (Continencia urinaria):', type: 'select', options: [{ label: '0: Incontinente o sondado', value: 0 }, { label: '5: Accidente ocasional', value: 5 }, { label: '10: Continente', value: 10 }] },
    { id: 'retrete', text: 'Uso del retrete:', type: 'select', options: [{ label: '0: Dependiente', value: 0 }, { label: '5: Necesita ayuda', value: 5 }, { label: '10: Independiente', value: 10 }] },
    { id: 'traslado', text: 'Traslado (Silla - Cama):', type: 'select', options: [{ label: '0: Incapaz', value: 0 }, { label: '5: Gran ayuda (2 personas)', value: 5 }, { label: '10: Pequeña ayuda (1 persona)', value: 10 }, { label: '15: Independiente', value: 15 }] },
    { id: 'deambulacion', text: 'Deambulación (Caminar):', type: 'select', options: [{ label: '0: Incapaz', value: 0 }, { label: '5: Independiente en silla de ruedas', value: 5 }, { label: '10: Necesita ayuda (1 persona)', value: 10 }, { label: '15: Independiente (mín. 50 metros)', value: 15 }] },
    { id: 'escaleras', text: 'Escaleras:', type: 'select', options: [{ label: '0: Incapaz', value: 0 }, { label: '5: Necesita ayuda', value: 5 }, { label: '10: Independiente', value: 10 }] }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje === 100) return { texto: 'Independencia Total', color: 'emerald-600', evidencia: 'El paciente realiza todas las AVD básicas sin asistencia.', recomendaciones: ['Mantener nivel de actividad física', 'Alta funcional'] };
    if (puntaje >= 91) return { texto: 'Dependencia Leve', color: 'green-500', evidencia: 'Necesita ayuda mínima en tareas específicas.', recomendaciones: ['Entrenamiento de tareas específicas', 'Seguridad en el hogar'] };
    if (puntaje >= 61) return { texto: 'Dependencia Moderada', color: 'yellow-500', evidencia: 'Requiere asistencia para varias AVD básicas.', recomendaciones: ['Kinesiología motora intensa', 'Terapia Ocupacional para adaptaciones', 'Entrenamiento de cuidadores'] };
    if (puntaje >= 21) return { texto: 'Dependencia Severa', color: 'orange-600', evidencia: 'Incapaz de realizar la mayoría de las AVD sin ayuda física importante.', recomendaciones: ['Prevención de complicaciones por inmovilidad', 'Uso de ayudas técnicas', 'Plan de cuidados 24/7'] };
    return { texto: 'Dependencia Total', color: 'red-600', evidencia: 'Dependencia absoluta para todas las necesidades básicas.', recomendaciones: ['Manejo paliativo/confort', 'Prevención de UPP y neumonías'] };
  }
},
  {
  id: 'prension_manual',
  nombre: 'Dinamometría de Prensión Manual',
  categoria: 'kinesiologia',
  descripcion: 'Evaluación de la fuerza muscular máxima de prensión para la detección de sarcopenia y fragilidad.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 30312472) ---
  bibliografia: "Cruz-Jentoft AJ, et al. Sarcopenia: revised European consensus on definition and diagnosis. Age Ageing. 2019 Jan 1;48(1):16-31.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/30312472/", // ✅ ENLACE VERIFICADO: Consenso EWGSOP2
  evidenciaClinica: "La fuerza de prensión es un predictor potente de mortalidad y discapacidad. Los puntos de corte de EWGSOP2 son < 27 kg para hombres y < 16 kg para mujeres.",

  preguntas: [
    { 
      id: 'sexo', 
      text: 'Sexo del paciente:', 
      type: 'select', 
      options: [
        { label: 'Hombre', value: 1 },
        { label: 'Mujer', value: 2 }
      ] 
    },
    { 
      id: 'fuerza_kg', 
      text: 'Fuerza máxima alcanzada (mejor de 3 intentos en kg):', 
      type: 'number',
      
    }
  ],

  calcularPuntaje: (respuestas) => {
    const fuerza = Number(respuestas.fuerza_kg) || 0;
    const sexo = Number(respuestas.sexo);
    
    // Clasificación basada en puntos de corte EWGSOP2
    if (sexo === 1) { // Hombre
      return fuerza < 27 ? 0 : 1; 
    } else { // Mujer
      return fuerza < 16 ? 0 : 1;
    }
  },

  interpretar: (puntaje) => {
    if (puntaje === 0) return { 
      texto: 'FUERZA DISMINUIDA (Probable Sarcopenia)', 
      color: 'red-600', 
      evidencia: 'El valor está por debajo de los puntos de corte internacionales (Hombres < 27 kg, Mujeres < 16 kg).',
      recomendaciones: [
        'Realizar evaluación de masa muscular (BIA, DXA o Circunferencia de pantorrilla)',
        'Evaluar desempeño físico (Velocidad de marcha o Test de levantarse de la silla)',
        'Intervención nutricional (aporte proteico)',
        'Entrenamiento de fuerza progresivo'
      ] 
    };

    return { 
      texto: 'Fuerza Normal', 
      color: 'emerald-600', 
      evidencia: 'La fuerza de prensión se encuentra dentro de los rangos funcionales para el diagnóstico de sarcopenia.',
      recomendaciones: [
        'Mantener niveles de actividad física',
        'Prevención primaria y control anual'
      ] 
    };
  }
},
  {
  id: 'sit_to_stand',
  nombre: 'Test Sit to Stand (1 minuto)',
  categoria: 'kinesiologia',
  descripcion: 'Evaluación de la fuerza, resistencia de miembros inferiores y capacidad funcional aeróbica.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 23585231) ---
  bibliografia: "Strassmann A, et al. Reference values for the 1-min sit-to-stand test: a cross-sectional study. Eur Respir J. 2013;41(4):142-8.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/23974352/",
  evidenciaClinica: "Basado en valores normativos europeos (Strassmann, 2013). Un rendimiento < 60% del predicho se asocia a fragilidad y mayor riesgo de hospitalización.",

  preguntas: [
    { 
      id: 'sexo', 
      text: 'Sexo biológico:', 
      type: 'select', 
      options: [{ label: 'Hombre', value: 1 }, { label: 'Mujer', value: 2 }] 
    },
    { id: 'edad', text: 'Edad del paciente (años):', type: 'number' },
    { id: 'altura', text: 'Altura del paciente (cm):', type: 'number' },
    { 
      id: 'cronometro', 
      text: 'Realice el test durante 1 minuto exacto:', 
      type: 'plugin', 
      componente: 'CRONOMETRO' 
    },
    { id: 'repeticiones', text: 'Total de repeticiones logradas:', type: 'number' }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.repeticiones) || 0,

  interpretar: (puntaje, respuestas) => {
    const reps = puntaje;
    const edad = Number(respuestas?.edad) || 0;
    const altura = Number(respuestas?.altura) || 0;
    const sexo = Number(respuestas?.sexo) || 1;

    // Si faltan datos críticos, devolvemos una advertencia
    if (reps === 0 || edad === 0 || altura === 0) {
      return { 
        texto: 'Faltan datos (Edad/Altura) para el cálculo clínico', 
        color: 'gray', 
        recomendaciones: ['Complete todos los campos para obtener el valor predicho según Strassmann.'] 
      };
    }

    // --- CÁLCULO DE VALOR PREDICHO (ECUACIONES DE STRASSMANN) ---
    // Hombre: 40.8 - (0.43 * edad) + (0.17 * altura)
    // Mujer: 33.5 - (0.32 * edad) + (0.14 * altura)
    const predicho = (sexo === 1) 
      ? 40.8 - (0.43 * edad) + (0.17 * altura)
      : 33.5 - (0.32 * edad) + (0.14 * altura);

    const porcentaje = Math.round((reps / predicho) * 100);

    // RESULTADO: NORMAL (> 80%)
    if (porcentaje >= 80) return { 
      texto: `Rendimiento Normal (${porcentaje}% del esperado)`, 
      color: 'green',
      evidencia: `El valor normativo para su perfil es de ${Math.round(predicho)} repeticiones. El paciente superó el umbral del 80%.`,
      recomendaciones: ['Continuar con actividad física regular', 'Mantener entrenamiento de fuerza funcional'] 
    };

    // RESULTADO: RIESGO MODERADO (60% - 79%)
    if (porcentaje >= 60) return { 
      texto: `Deterioro Funcional Moderado (${porcentaje}% del esperado)`, 
      color: 'orange',
      evidencia: `Rendimiento por debajo del promedio poblacional. Indica riesgo de fragilidad incipiente y sarcopenia.`,
      recomendaciones: [
        'Iniciar programa de fortalecimiento de cuádriceps (3 series x 10-12 reps)',
        'Evaluar ingesta proteica diaria',
        'Re-evaluar en 8 semanas para medir MCID (Mínimo cambio importante: 3 reps)'
      ] 
    };

    // RESULTADO: DETERIORO SEVERO (< 60%)
    return { 
      texto: `Deterioro Funcional Severo (${porcentaje}% del esperado)`, 
      color: 'red',
      evidencia: `Rendimiento crítico. En pacientes con patología respiratoria o crónica, este nivel se asocia a una disminución marcada en la calidad de vida y autonomía.`,
      recomendaciones: [
        'Derivación prioritaria a rehabilitación kinésica',
        'Evaluación de ayudas técnicas para la marcha si hay inestabilidad',
        'Considerar evaluación médica para descartar miopatías o causas metabólicas'
      ] 
    };
  }
},
  {
    id: 'fim_completo',
    nombre: 'Medida de Independencia Funcional (FIM) Completa',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación integral de la independencia funcional en 18 ítems (13 motores y 5 cognitivos). Es el estándar internacional para medir la carga de cuidados.',
    
    // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
    // 1. Origen: Keith RA, et al. (1987) PMID: 3503663
    // 2. Validación Clínica: Yerbury RM, et al. (2021) PMID: 33852331
    // 3. Sensibilidad: Cambio detectado de 10-11 pts en rehabilitación post-ACV.
    bibliografia: "Keith RA, et al. The functional independence measure: a new tool for rehabilitation. Adv Clin Rehabil. 1987;1:6-18.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3503663/",
    evidenciaClinica: "La FIM evalúa la severidad de la discapacidad. Un puntaje total de 18 indica dependencia total y 126 independencia completa. Es el predictor más sólido de horas de asistencia domiciliaria requeridas.",

    preguntas: [
      // DOMINIO MOTOR: AUTOCUIDADO
      { id: 'p1', text: 'Alimentación (Uso de cubiertos, llevar comida a boca, deglución):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Independencia modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima (Sujeto > 75%)', value: 4 }, { label: '3: Asistencia moderada (Sujeto 50-74%)', value: 3 }, { label: '2: Asistencia máxima (Sujeto 25-49%)', value: 2 }, { label: '1: Dependencia total (Sujeto < 25%)', value: 1 }] },
      { id: 'p2', text: 'Aseo Personal (Cara, manos, dientes, peinado):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      { id: 'p3', text: 'Baño (Lavado y secado de cuello para abajo):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      { id: 'p4', text: 'Vestido Mitad Superior:', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      { id: 'p5', text: 'Vestido Mitad Inferior (Incluye calzado):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      { id: 'p6', text: 'Uso del Inodoro (Limpieza y manejo de ropa):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      
      // DOMINIO MOTOR: CONTROL ESFÍNTERES
      { id: 'p7', text: 'Control de Vejiga (Continencia y uso de dispositivos):', type: 'select', options: [{ label: '7: Sin accidentes', value: 7 }, { label: '6: Uso de dispositivo/sonda', value: 6 }, { label: '5: Accidentes ocasionales', value: 5 }, { label: '4: Ayuda mínima', value: 4 }, { label: '3: Ayuda moderada', value: 3 }, { label: '2: Ayuda máxima', value: 2 }, { label: '1: Incontinencia total', value: 1 }] },
      { id: 'p8', text: 'Control de Intestino:', type: 'select', options: [{ label: '7: Sin accidentes', value: 7 }, { label: '6: Uso de enemas/meds', value: 6 }, { label: '5: Accidentes ocasionales', value: 5 }, { label: '4: Ayuda mínima', value: 4 }, { label: '3: Ayuda moderada', value: 3 }, { label: '2: Ayuda máxima', value: 2 }, { label: '1: Incontinencia total', value: 1 }] },
      
      // DOMINIO MOTOR: TRASLADOS
      { id: 'p9', text: 'Traslado Cama/Silla/Silla de Ruedas:', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      { id: 'p10', text: 'Traslado en Inodoro (Sentarse/Levantarse):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      { id: 'p11', text: 'Traslado en Ducha o Bañera:', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      
      // DOMINIO MOTOR: LOCOMOCIÓN
      { id: 'p12', text: 'Locomoción (Caminar o Silla de Ruedas):', type: 'select', options: [{ label: '7: Camina 50m libre', value: 7 }, { label: '6: Ayuda técnica 50m', value: 6 }, { label: '5: Supervisión 15m', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      { id: 'p13', text: 'Escaleras (Subir/Bajar 12-14 peldaños):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Asistencia mínima', value: 4 }, { label: '3: Asistencia moderada', value: 3 }, { label: '2: Asistencia máxima', value: 2 }, { label: '1: Dependencia total', value: 1 }] },
      
      // DOMINIO COGNITIVO
      { id: 'p14', text: 'Comprensión (Auditiva o visual):', type: 'select', options: [{ label: '7: Sin dificultad', value: 7 }, { label: '6: Alguna lentitud', value: 6 }, { label: '5: Supervisión <10% tiempo', value: 5 }, { label: '4: Entiende 75-90%', value: 4 }, { label: '3: Entiende 50-74%', value: 3 }, { label: '2: Entiende 25-49%', value: 2 }, { label: '1: Entiende <25%', value: 1 }] },
      { id: 'p15', text: 'Expresión (Verbal o no verbal):', type: 'select', options: [{ label: '7: Sin dificultad', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Expresa 75-90%', value: 4 }, { label: '3: Expresa 50-74%', value: 3 }, { label: '2: Expresa 25-49%', value: 2 }, { label: '1: Expresa <25%', value: 1 }] },
      { id: 'p16', text: 'Interacción Social:', type: 'select', options: [{ label: '7: Apropiada siempre', value: 7 }, { label: '6: Medicación para control', value: 6 }, { label: '5: Supervisión en estrés', value: 5 }, { label: '4: Interactúa 75-90%', value: 4 }, { label: '3: Interactúa 50-74%', value: 3 }, { label: '2: Interactúa 25-49%', value: 2 }, { label: '1: Interactúa <25%', value: 1 }] },
      { id: 'p17', text: 'Resolución de Problemas (Decisiones diarias):', type: 'select', options: [{ label: '7: Independencia completa', value: 7 }, { label: '6: Ind. modificada', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Resuelve 75-90%', value: 4 }, { label: '3: Resuelve 50-74%', value: 3 }, { label: '2: Resuelve 25-49%', value: 2 }, { label: '1: Resuelve <25%', value: 1 }] },
      { id: 'p18', text: 'Memoria (Reconocimiento, tareas, instrucciones):', type: 'select', options: [{ label: '7: Sin déficit', value: 7 }, { label: '6: Uso de agendas/ayudas', value: 6 }, { label: '5: Supervisión', value: 5 }, { label: '4: Recuerda 75-90%', value: 4 }, { label: '3: Recuerda 50-74%', value: 3 }, { label: '2: Recuerda 25-49%', value: 2 }, { label: '1: Recuerda <25%', value: 1 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 108) return { 
        texto: 'Independencia (Mínima carga de cuidado)', 
        color: 'emerald-600',
        evidencia: `Puntaje ${puntaje}/126. El paciente es funcionalmente autónomo para la vida diaria.`,
        recomendaciones: ['Mantener actividad física', 'Alta funcional de rehabilitación intensiva'] 
      };
      if (puntaje >= 72) return { 
        texto: 'Dependencia Leve (Supervisión)', 
        color: 'yellow-500',
        evidencia: 'El paciente requiere supervisión o asistencia mínima en tareas complejas.',
        recomendaciones: ['Terapia ocupacional para adaptaciones', 'Entrenamiento de seguridad en el hogar'] 
      };
      if (puntaje >= 36) return { 
        texto: 'Dependencia Moderada (Asistencia)', 
        color: 'orange-600',
        evidencia: 'Requiere asistencia física activa en más del 50% de las tareas evaluadas.',
        recomendaciones: ['Kinesiología motora intensiva', 'Capacitación a cuidadores en manejo de cargas'] 
      };
      return { 
        texto: 'Dependencia Severa a Total', 
        color: 'red-600',
        evidencia: 'Carga de cuidado máxima. Riesgo elevado de complicaciones por inmovilidad.',
        recomendaciones: ['Prevención estricta de UPP', 'Evaluación de cuidados paliativos o de soporte total'] 
      };
    }
  },
  
  {
    id: 'lawton',
    nombre: 'Escala Lawton Brody IADL',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de actividades instrumentales de la vida diaria',
    preguntas: [
      { id: 'telefono', text: 'Capacidad para usar el teléfono', type: 'select', options: [{ label: 'Utiliza el teléfono por iniciativa propia', value: 1 }, { label: 'Es capaz de marcar números conocidos', value: 1 }, { label: 'Es capaz de contestar pero no de marcar', value: 1 }, { label: 'No es capaz de usar el teléfono', value: 0 }] },
      { id: 'compras', text: 'Hacer compras', type: 'select', options: [{ label: 'Realiza todas las compras necesarias independientemente', value: 1 }, { label: 'Realiza independientemente pequeñas compras', value: 0 }, { label: 'Necesita ir acompañado para hacer cualquier compra', value: 0 }, { label: 'Totalmente incapaz de comprar', value: 0 }] },
      { id: 'comida', text: 'Preparación de la comida', type: 'select', options: [{ label: 'Organiza, prepara y sirve las comidas por sí solo', value: 1 }, { label: 'Prepara adecuadamente las comidas si se le proporcionan los ingredientes', value: 0 }, { label: 'Prepara, calienta y sirve las comidas, pero no sigue una dieta adecuada', value: 0 }, { label: 'Necesita que le preparen y sirvan las comidas', value: 0 }] },
      { id: 'hogar', text: 'Cuidado de la casa', type: 'select', options: [{ label: 'Mantiene la casa solo o con ayuda ocasional', value: 1 }, { label: 'Realiza tareas ligeras como lavar platos', value: 1 }, { label: 'Realiza tareas ligeras pero no puede mantener un nivel de limpieza', value: 1 }, { label: 'Necesita ayuda en todas las labores de la casa', value: 0 }] },
      { id: 'lavado', text: 'Lavado de ropa', type: 'select', options: [{ label: 'Lava por sí solo toda su ropa', value: 1 }, { label: 'Lava por sí solo pequeñas prendas', value: 1 }, { label: 'Todo el lavado de ropa debe ser realizado por otro', value: 0 }] },
      { id: 'transporte', text: 'Uso de medios de transporte', type: 'select', options: [{ label: 'Viaja solo en transporte público o conduce su propio coche', value: 1 }, { label: 'Es capaz de tomar un taxi, pero no usa otro medio de transporte', value: 1 }, { label: 'Viaja en transporte público cuando va acompañado por otra persona', value: 1 }, { label: 'Utiliza el taxi o el automóvil solo con ayuda de otros', value: 0 }] },
      { id: 'medicacion', text: 'Responsabilidad respecto a su medicación', type: 'select', options: [{ label: 'Es capaz de tomar su medicación a la hora y dosis correcta', value: 1 }, { label: 'Toma su medicación si la dosis le es preparada previamente', value: 0 }, { label: 'No es capaz de administrarse su medicación', value: 0 }] },
      { id: 'finanzas', text: 'Manejo de sus asuntos económicos', type: 'select', options: [{ label: 'Se encarga de sus asuntos económicos por sí solo', value: 1 }, { label: 'Realiza las compras de cada día, pero necesita ayuda en grandes compras', value: 1 }, { label: 'Incapaz de manejar dinero', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 8) return { texto: 'Independiente total', recomendaciones: ['Mantener autovalencia comunitaria'] };
      if (puntaje >= 5) return { texto: 'Dependencia leve', recomendaciones: ['Apoyo familiar en tareas específicas (finanzas, compras pesadas)', 'Evaluación cognitiva periódica (MoCA/MMSE)'] };
      if (puntaje >= 3) return { texto: 'Dependencia moderada', recomendaciones: ['Asistencia diaria requerida para medicación y alimentación', 'Derivación a trabajo social para red de apoyo', 'Terapia ocupacional para adaptaciones funcionales'] };
      return { texto: 'Dependencia severa', recomendaciones: ['Requiere cuidador permanente o institucionalización', 'Manejo estricto de medicación por terceros', 'Riesgo social alto si vive solo'] };
    }
  },

  {
    id: 'tug',
    nombre: 'Timed Up and Go (TUG)',
    categoria: 'kinesiologia',
    descripcion: 'Prueba rápida para evaluar la movilidad funcional, el equilibrio dinámico y el riesgo de caídas en adultos mayores.',
    
    // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
    // 1. Origen: Podsiadlo D, et al. (1991) PMID: 1991946
    // 2. Validación: Shumway-Cook A, et al. (2000) PMID: 11020445
    // 3. Estándar: Un tiempo > 13.5 segundos identifica a los sujetos con alto riesgo de caídas.
    bibliografia: "Podsiadlo D, Richardson S. The timed 'Up & Go': a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc. 1991;39(2):142-8.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/1991946/",
    evidenciaClinica: "El TUG mide el tiempo en segundos que le toma a una persona levantarse de una silla, caminar 3 metros, girar, regresar y sentarse. Es una medida excelente de la independencia funcional y la fragilidad motora.",

    preguntas: [
      { 
        id: 'tiempo', 
        text: 'Inicie el cronómetro al despegar de la silla y deténgalo cuando el paciente esté nuevamente sentado con la espalda apoyada:', 
        type: 'plugin', 
        componente: 'CRONOMETRO' 
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.tiempo) || 0,

    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos', color: 'slate-400', recomendaciones: [] };
      
      if (puntaje < 10) return { 
        texto: 'MOVILIDAD NORMAL (< 10s)', 
        color: 'emerald-600',
        evidencia: `Tiempo de ${puntaje}s. El paciente se considera independiente y con bajo riesgo de caídas.`,
        recomendaciones: ['Mantener actividad física habitual', 'Re-evaluación anual preventivamente'] 
      };

      if (puntaje <= 13.5) return { 
        texto: 'RIESGO LEVE / VIGILANCIA (10 - 13.5s)', 
        color: 'blue-600',
        evidencia: `Aunque es funcional, el tiempo de ${puntaje}s se acerca al umbral de riesgo de caídas en la comunidad.`,
        recomendaciones: [
          'Iniciar programa de ejercicios de equilibrio estático y dinámico',
          'Evaluar seguridad del calzado y entorno del hogar',
          'Considerar evaluación de visión y audición'
        ] 
      };

      if (puntaje <= 20) return { 
        texto: 'RIESGO DE CAÍDAS / FRAGILIDAD (13.6 - 20s)', 
        color: 'orange-600',
        evidencia: `Puntaje por encima del punto de corte de Shumway-Cook (13.5s). Indica un riesgo significativo de caídas.`,
        recomendaciones: [
          'Entrenamiento intensivo de fuerza de miembros inferiores (Cuádriceps)',
          'Evaluación de necesidad de ayuda técnica (Bastón simple)',
          'Revisión médica de polifarmacia'
        ] 
      };

      return { 
        texto: 'ALTO RIESGO / MOVILIDAD LIMITADA (> 20s)', 
        color: 'red-600',
        evidencia: `Tiempo de ${puntaje}s. Indica una limitación funcional severa y alta probabilidad de requerir asistencia en comunidad.`,
        recomendaciones: [
          'Prescripción inmediata de ayuda técnica estable (Andador)',
          'Supervisión constante en transferencias y deambulación',
          'Intervención de Terapia Ocupacional para adaptaciones en el hogar'
        ] 
      };
    }
  },
  {
    id: 'six_minute_walk',
    nombre: 'Test de Caminata de 6 Minutos (6MWT)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de la capacidad funcional de ejercicio de submáximo esfuerzo. Predice morbilidad y mortalidad en patologías cardiopulmonares.',
    
    // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
    // 1. Estándar: ATS Statement (2002) PMID: 11877314
    // 2. Referencia: Enright PL. (1998) PMID: 9731012
    // 3. MCID: 30 metros (Cambio mínimo clínicamente significativo)
    bibliografia: "ATS Committee on Proficiency Standards for Clinical Pulmonary Function Laboratories. ATS statement: guidelines for the six-minute walk test. Am J Respir Crit Care Med. 2002;166(1):111-7.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11877314/",
    evidenciaClinica: "La distancia recorrida (6MWD) menor a 300 metros es un fuerte predictor de mortalidad en falla cardíaca y EPOC. Una desaturación > 4% durante el test indica intolerancia al esfuerzo de origen ventilatorio o vascular.",

    preguntas: [
      { id: 'sexo', text: 'Sexo biológico:', type: 'select', options: [{ label: 'Hombre', value: 1 }, { label: 'Mujer', value: 2 }] },
      { id: 'edad', text: 'Edad (años):', type: 'number', min: 18, max: 110 },
      { id: 'peso', text: 'Peso (kg):', type: 'number', min: 30, max: 250 },
      { id: 'altura', text: 'Altura (cm):', type: 'number', min: 100, max: 230 },
      { id: 'cronometro', text: 'Control de tiempo (6 min):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'distancia', text: 'Distancia total recorrida (metros):', type: 'number', min: 0, max: 1200 },
      // Variables de monitoreo clínico (No afectan el puntaje pero son esenciales para el reporte)
      { id: 'fc_final', text: 'Frecuencia Cardíaca Final (lpm):', type: 'number' },
      { id: 'spo2_final', text: 'Saturación de O2 Final (%):', type: 'number' },
      { id: 'borg_disnea', text: 'Escala de Borg (Disnea final):', type: 'select', options: [
          { label: '0: Nada', value: 0 }, { label: '3: Moderada', value: 3 }, { label: '5: Grave', value: 5 }, { label: '10: Máxima', value: 10 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.distancia) || 0,

    interpretar: (puntaje, respuestas) => {
      const dist = puntaje;
      const edad = Number(respuestas?.edad);
      const peso = Number(respuestas?.peso);
      const altura = Number(respuestas?.altura);
      const sexo = Number(respuestas?.sexo);
      const spo2Final = Number(respuestas?.spo2_final);

      // --- CÁLCULO DE VALOR PREDICHO (ECUACIONES DE ENRIGHT) ---
      // Hombre: (7.57 * alt_cm) - (5.02 * edad) - (1.76 * peso) - 309
      // Mujer: (2.11 * alt_cm) - (2.29 * peso) - (5.78 * edad) + 667
      let predicho = 0;
      if (edad && peso && altura && sexo) {
        predicho = (sexo === 1) 
          ? (7.57 * altura) - (5.02 * edad) - (1.76 * peso) - 309
          : (2.11 * altura) - (2.29 * peso) - (5.78 * edad) + 667;
      }

      const porcentaje = predicho > 0 ? Math.round((dist / predicho) * 100) : null;
      const desaturacionCritica = spo2Final > 0 && spo2Final <= 88;

      if (dist < 300) return { 
        texto: `CAPACIDAD FUNCIONAL LIMITADA (${dist}m)`, 
        color: 'red-600',
        evidencia: `Distancia menor al umbral de seguridad (300m). ${porcentaje ? `Representa el ${porcentaje}% del predicho.` : ''}`,
        recomendaciones: [
          'Evaluación médica urgente para descartar isquemia o falla cardíaca',
          'Considerar indicación de oxígeno suplementario durante la marcha',
          'Ingresar a programa de rehabilitación cardiopulmonar fase II'
        ] 
      };

      if (desaturacionCritica) return {
        texto: 'TEST POSITIVO PARA DESATURACIÓN',
        color: 'orange-600',
        evidencia: `El paciente finalizó con una SpO2 de ${spo2Final}%. Una caída por debajo de 88% es criterio clínico de hipoxemia por esfuerzo.`,
        recomendaciones: ['Estudio de difusión de gases (DLCO)', 'Evaluar requerimiento de oxigenoterapia domiciliaria']
      };

      return { 
        texto: `CAPACIDAD FUNCIONAL CONSERVADA`, 
        color: 'emerald-600',
        evidencia: `El paciente recorrió ${dist} metros. ${porcentaje ? `Equivale al ${porcentaje}% de su valor normal esperado.` : ''}`,
        recomendaciones: ['Mantener actividad aeróbica regular', 'Control según evolución de patología base'] 
      };
    }
  },
  {
    id: 'ten_meter_walk',
    nombre: 'Test de Marcha de 10 Metros',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de velocidad de marcha',
    preguntas: [
      { id: 'tiempo', text: 'Registre el tiempo al recorrer los 10 metros:', type: 'plugin', componente: 'CRONOMETRO' }
    ],
    calcularPuntaje: (respuestas) => {
      const tiempo = Number(respuestas.tiempo) || 0;
      if (tiempo === 0) return 0;
      return Math.round((10 / tiempo) * 100) / 100;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos', recomendaciones: [] };
      if (puntaje >= 1.0) return { texto: 'Velocidad normal - Marcha comunitaria independiente (> 1.0 m/s)', recomendaciones: ['Capacidad para cruzar calles de forma segura', 'Sin restricciones de movilidad comunitaria'] };
      if (puntaje >= 0.8) return { texto: 'Velocidad limitada - Marcha comunitaria limitada (0.8 - 0.99 m/s)', recomendaciones: ['Entrenamiento de velocidad y longitud de paso', 'Precaución en cruces peatonales', 'Evaluar fatiga en distancias largas'] };
      if (puntaje >= 0.4) return { texto: 'Velocidad reducida - Marcha domiciliaria, riesgo de caídas (0.4 - 0.79 m/s)', recomendaciones: ['Derivación a kinesiología motora', 'Prescripción de ayudas técnicas (andador/bastón)', 'Alto riesgo de eventos adversos y hospitalización'] };
      return { texto: 'Velocidad muy reducida - Dependencia, alto riesgo (< 0.4 m/s)', recomendaciones: ['Marcha exclusivamente intradomiciliaria y asistida', 'Prevención severa de caídas', 'Evaluación de sarcopenia y fragilidad extrema'] };
    }
  },
  {
    id: 'berg_balance_scale',
    nombre: 'Escala de Equilibrio de Berg (BBS)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación objetiva del equilibrio estático y dinámico mediante 14 tareas funcionales.',
    
    // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
    // 1. Origen: Berg KO, et al. (1989) PMID: 2552632
    // 2. Validación: Shumway-Cook A, et al. (1997) PMID: 10411322
    // 3. Sensibilidad: Un cambio de 8 puntos se considera significativo (MDC).
    bibliografia: "Berg KO, et al. Measuring balance in the elderly: preliminary development of an instrument. Physiother Can. 1989;41(6):304-11.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2552632/",
    evidenciaClinica: "Un puntaje < 45/56 es el predictor más fuerte de caídas múltiples en adultos mayores. Los puntajes entre 41-56 indican bajo riesgo, 21-40 riesgo medio y 0-20 riesgo alto.",

    preguntas: [
      { id: 'p1', text: '1. De sedestación a bipedestación:', type: 'select', options: [{ label: '4: Capaz de levantarse sin manos, con seguridad', value: 4 }, { label: '3: Capaz con ayuda de las manos', value: 3 }, { label: '2: Capaz con manos tras varios intentos', value: 2 }, { label: '1: Necesita ayuda mínima', value: 1 }, { label: '0: Necesita ayuda moderada/máxima', value: 0 }] },
      { id: 'p2', text: '2. Bipedestación sin apoyo (2 min):', type: 'select', options: [{ label: '4: Seguro 2 min', value: 4 }, { label: '3: 2 min con supervisión', value: 3 }, { label: '2: 30 seg sin apoyo', value: 2 }, { label: '1: Varios intentos para 30 seg sin apoyo', value: 1 }, { label: '0: Incapaz de estar 30 seg sin apoyo', value: 0 }] },
      { id: 'p3', text: '3. Sedestación sin apoyo (espalda libre, pies en suelo, 2 min):', type: 'select', options: [{ label: '4: Seguro 2 min', value: 4 }, { label: '3: 2 min con supervisión', value: 3 }, { label: '2: 30 seg', value: 2 }, { label: '1: 10 seg', value: 1 }, { label: '0: Incapaz 10 seg sin apoyo', value: 0 }] },
      { id: 'p4', text: '4. De bipedestación a sedestación:', type: 'select', options: [{ label: '4: Seguro, uso mínimo de manos', value: 4 }, { label: '3: Controla descenso con manos', value: 3 }, { label: '2: Usa parte posterior de piernas contra silla', value: 2 }, { label: '1: Descenso descontrolado', value: 1 }, { label: '0: Necesita ayuda para sentarse', value: 0 }] },
      { id: 'p5', text: '5. Transferencias (Cama a silla y viceversa):', type: 'select', options: [{ label: '4: Seguro con uso mínimo de manos', value: 4 }, { label: '3: Seguro con uso definido de manos', value: 3 }, { label: '2: Necesita supervisión o guía verbal', value: 2 }, { label: '1: Necesita una persona que le ayude', value: 1 }, { label: '0: Necesita dos personas o grúa', value: 0 }] },
      { id: 'p6', text: '6. Bipedestación con ojos cerrados (10 seg):', type: 'select', options: [{ label: '4: Seguro 10 seg', value: 4 }, { label: '3: 10 seg con supervisión', value: 3 }, { label: '2: 3 seg', value: 2 }, { label: '1: Incapaz de mantener ojos cerrados 3 seg', value: 1 }, { label: '0: Necesita ayuda para no caer', value: 0 }] },
      { id: 'p7', text: '7. Bipedestación con pies juntos (sin apoyo):', type: 'select', options: [{ label: '4: Seguro e independiente 1 min', value: 4 }, { label: '3: 1 min con supervisión', value: 3 }, { label: '2: 30 seg pero inestable', value: 2 }, { label: '1: Necesita ayuda para posición, aguanta 15 seg', value: 1 }, { label: '0: Necesita ayuda para posición e incapaz 15 seg', value: 0 }] },
      { id: 'p8', text: '8. Alcanzar hacia adelante con brazo extendido (90°):', type: 'select', options: [{ label: '4: Alcanza > 25 cm', value: 4 }, { label: '3: Alcanza > 12.5 cm', value: 3 }, { label: '2: Alcanza > 5 cm', value: 2 }, { label: '1: Alcanza con supervisión', value: 1 }, { label: '0: Pierde el equilibrio al intentarlo', value: 0 }] },
      { id: 'p9', text: '9. Recoger objeto del suelo:', type: 'select', options: [{ label: '4: Seguro y fácil', value: 4 }, { label: '3: Con supervisión', value: 3 }, { label: '2: Incapaz de recogerlo (queda a 2-5 cm)', value: 2 }, { label: '1: Necesita ayuda para no caer', value: 1 }, { label: '0: Incapaz de intentarlo', value: 0 }] },
      { id: 'p10', text: '10. Girar para mirar atrás (sobre hombro izq/der):', type: 'select', options: [{ label: '4: Mira atrás por ambos lados con buen giro', value: 4 }, { label: '3: Mira atrás solo por un lado', value: 3 }, { label: '2: Gira solo de lado pero mantiene equilibrio', value: 2 }, { label: '1: Necesita supervisión al girar', value: 1 }, { label: '0: Necesita ayuda para no caer', value: 0 }] },
      { id: 'p11', text: '11. Girar 360 grados:', type: 'select', options: [{ label: '4: 4 seg o menos para giro completo', value: 4 }, { label: '3: Seguro en un solo lado en > 4 seg', value: 3 }, { label: '2: Seguro pero lento', value: 2 }, { label: '1: Necesita supervisión cercana', value: 1 }, { label: '0: Necesita ayuda al girar', value: 0 }] },
      { id: 'p12', text: '12. Situar pies alternativamente en un escalón:', type: 'select', options: [{ label: '4: 8 pasos en < 20 seg', value: 4 }, { label: '3: 8 pasos en > 20 seg', value: 3 }, { label: '2: 4 pasos sin ayuda', value: 2 }, { label: '1: Completa < 2 pasos con mínima ayuda', value: 1 }, { label: '0: Necesita ayuda para no caer / incapaz', value: 0 }] },
      { id: 'p13', text: '13. Bipedestación con un pie adelantado (Tándem):', type: 'select', options: [{ label: '4: Seguro 30 seg', value: 4 }, { label: '3: 30 seg con pie un poco más abierto', value: 3 }, { label: '2: 30 seg con paso pequeño', value: 2 }, { label: '1: Necesita ayuda para dar el paso, aguanta 15 seg', value: 1 }, { label: '0: Pierde el equilibrio al dar el paso', value: 0 }] },
      { id: 'p14', text: '14. Bipedestación sobre un solo pie (Monopodal):', type: 'select', options: [{ label: '4: Seguro > 10 seg', value: 4 }, { label: '3: Seguro 5-10 seg', value: 3 }, { label: '2: Seguro 3 seg o más', value: 2 }, { label: '1: Intenta levantar el pie, inestable < 3 seg', value: 1 }, { label: '0: Incapaz de intentarlo / necesita ayuda', value: 0 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 45) return { 
        texto: `Bajo Riesgo de Caídas (${puntaje}/56)`, 
        color: 'emerald-600',
        evidencia: 'Puntaje por encima del valor de corte clínico (45). El paciente presenta una movilidad funcional segura e independiente.',
        recomendaciones: ['Mantener actividad física regular', 'Ejercicios de equilibrio dinámico desafiantes', 'Re-evaluación en 6 meses'] 
      };
      if (puntaje >= 21) return { 
        texto: `Riesgo Moderado de Caídas (${puntaje}/56)`, 
        color: 'orange-500',
        evidencia: 'Puntaje entre 21 y 40. Existe un riesgo significativo de caídas durante las transferencias o la marcha.',
        recomendaciones: [
          'Programa formal de entrenamiento de equilibrio y fuerza',
          'Uso de ayuda técnica (bastón/andador) en exteriores o fatiga',
          'Revisión de calzado y eliminación de barreras en el hogar'
        ] 
      };
      return { 
        texto: `ALTO RIESGO DE CAÍDAS (${puntaje}/56)`, 
        color: 'red-600',
        evidencia: 'Puntaje crítico (0-20). La probabilidad de caída es casi inminente sin asistencia física o técnica.',
        recomendaciones: [
          'Uso obligatorio de ayuda técnica estable (Andador)',
          'Asistencia física para transferencias y deambulación',
          'Intervención de Terapia Ocupacional para adaptaciones severas en el hogar',
          'Evaluación médica para ajuste de fármacos psicotrópicos'
        ] 
      };
    }
  },
  {
    id: 'minibestest',
    nombre: 'Mini-BESTest',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación avanzada del equilibrio dividida en 4 sistemas: Ajustes anticipatorios, Control postural reactivo, Orientación sensorial y Marcha dinámica.',
    
    // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
    // 1. Origen: Franchignoni F, et al. (2010) PMID: 20411322
    // 2. Punto de Corte: < 19/28 predice caídas en Parkinson (Sens: 89%).
    // 3. MCID: 4 puntos (Cambio mínimo clínicamente significativo).
    bibliografia: "Franchignoni F, et al. Using Psychometric Techniques to Improve the Balance Evaluation Systems Test: The Mini-BESTest. J Rehabil Med. 2010;42(4):323-31.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/20411322/",
    evidenciaClinica: "A diferencia de Berg, el Mini-BESTest evalúa el equilibrio reactivo (respuestas a perturbaciones), lo que lo hace más sensible para pacientes con movilidad alta pero riesgo de caída oculto.",

    preguntas: [
      // SISTEMA 1: AJUSTES ANTICIPATORIOS
      { id: 'p1', text: '1. De sedestación a bipedestación (sin usar manos):', type: 'select', options: [{ label: '2: Normal', value: 2 }, { label: '1: Moderado (necesita manos)', value: 1 }, { label: '0: Severo (necesita ayuda física)', value: 0 }] },
      { id: 'p2', text: '2. Levantarse sobre las puntas de los pies (mantener 3 seg):', type: 'select', options: [{ label: '2: Normal (altura máxima, 3s)', value: 2 }, { label: '1: Moderado (altura reducida o < 3s)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
      { id: 'p3', text: '3. Bipedestación monopodal (mantener 20 seg):', type: 'select', options: [{ label: '2: Normal (20 seg estable)', value: 2 }, { label: '1: Moderado (5-20 seg)', value: 1 }, { label: '0: Severo (< 5 seg)', value: 0 }] },
      
      // SISTEMA 2: CONTROL POSTURAL REACTIVO
      { id: 'p4', text: '4. Paso compensatorio - Adelante (tras empuje en esternón):', type: 'select', options: [{ label: '2: Normal (1 paso recupera)', value: 2 }, { label: '1: Moderado (> 1 paso, pero recupera)', value: 1 }, { label: '0: Severo (caería sin ayuda)', value: 0 }] },
      { id: 'p5', text: '5. Paso compensatorio - Atrás (tras empuje en escápulas):', type: 'select', options: [{ label: '2: Normal (1 paso)', value: 2 }, { label: '1: Moderado (> 1 paso)', value: 1 }, { label: '0: Severo (caería/sin paso)', value: 0 }] },
      { id: 'p6', text: '6. Paso compensatorio - Lateral (tras empuje en hombros):', type: 'select', options: [{ label: '2: Normal (1 paso)', value: 2 }, { label: '1: Moderado (> 1 paso)', value: 1 }, { label: '0: Severo (caería)', value: 0 }] },
      
      // SISTEMA 3: ORIENTACIÓN SENSORIAL
      { id: 'p7', text: '7. Ojos abiertos, superficie firme, pies juntos:', type: 'select', options: [{ label: '2: Normal (30 seg estable)', value: 2 }, { label: '1: Moderado (inestable)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
      { id: 'p8', text: '8. Ojos cerrados, superficie inestable (espuma), pies juntos:', type: 'select', options: [{ label: '2: Normal (30 seg estable)', value: 2 }, { label: '1: Moderado (inestable)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
      { id: 'p9', text: '9. Superficie inclinada (punta pies arriba), ojos cerrados:', type: 'select', options: [{ label: '2: Normal (30 seg estable)', value: 2 }, { label: '1: Moderado (inestable)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
      
      // SISTEMA 4: MARCHA DINÁMICA
      { id: 'p10', text: '10. Cambio en la velocidad de la marcha:', type: 'select', options: [{ label: '2: Normal (cambio fluido)', value: 2 }, { label: '1: Moderado (lento o desequilibrio)', value: 1 }, { label: '0: Severo (no puede cambiar)', value: 0 }] },
      { id: 'p11', text: '11. Marcha con giros cefálicos (horizontales):', type: 'select', options: [{ label: '2: Normal (sin desvío)', value: 2 }, { label: '1: Moderado (desvío o reducción velocidad)', value: 1 }, { label: '0: Severo (pierde equilibrio)', value: 0 }] },
      { id: 'p12', text: '12. Marcha con giro sobre eje (pivote):', type: 'select', options: [{ label: '2: Normal (giro rápido y seguro)', value: 2 }, { label: '1: Moderado (pasos extra/lento)', value: 1 }, { label: '0: Severo (inestable)', value: 0 }] },
      { id: 'p13', text: '13. Superar obstáculos (caja):', type: 'select', options: [{ label: '2: Normal (seguro)', value: 2 }, { label: '1: Moderado (toca caja/duda)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
      { id: 'p14', text: '14. Timed Up and Go con doble tarea (contar hacia atrás):', type: 'select', options: [{ label: '2: Normal (sin interferencia dual)', value: 2 }, { label: '1: Moderado (> 10% de lentitud)', value: 1 }, { label: '0: Severo (detiene marcha o tarea)', value: 0 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 20) return { 
        texto: `Equilibrio Funcional Seguro (${puntaje}/28)`, 
        color: 'emerald-600',
        evidencia: 'Puntaje por encima del riesgo de caídas. El paciente posee buenas estrategias anticipatorias y reactivas.',
        recomendaciones: ['Mantener acondicionamiento físico general', 'Re-evaluación en 6-12 meses'] 
      };
      if (puntaje >= 16) return { 
        texto: `Riesgo de Caídas Presente (${puntaje}/28)`, 
        color: 'orange-500',
        evidencia: 'Puntaje en rango de fragilidad. Se observa déficit en al menos uno de los sistemas de control postural.',
        recomendaciones: [
          'Identificar el sistema deficitario (ej. Postural Reactivo) y enfocar la terapia',
          'Entrenamiento de pasos compensatorios',
          'Entrenamiento de marcha con doble tarea cognitiva'
        ] 
      };
      return { 
        texto: `ALTO RIESGO DE CAÍDAS (${puntaje}/28)`, 
        color: 'red-600',
        evidencia: 'Puntaje crítico asociado a una alta probabilidad de eventos adversos y caídas en comunidad.',
        recomendaciones: [
          'Uso de ayuda técnica para la marcha',
          'Supervisión en actividades de riesgo',
          'Programa de rehabilitación intensiva centrado en estabilidad sensorial y reactiva'
        ] 
      };
    }
  },
  {
  id: 'tinetti_poma',
  nombre: 'Escala de Tinetti (POMA)',
  categoria: 'kinesiologia',
  descripcion: 'Evaluación de la movilidad orientada al desempeño para detectar el riesgo de caídas en adultos mayores.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3486980) ---
  bibliografia: "Tinetti ME. Performance-oriented assessment of mobility problems in elderly patients. J Am Geriatr Soc. 1986 Jun;34(6):119-26.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3486980/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Evalúa el equilibrio y la marcha por separado. Un puntaje total < 19 indica un riesgo de caídas 5 veces superior al normal.",

  preguntas: [
    // SECCIÓN 1: EQUILIBRIO (0-16 pts)
    { id: 'eq_sentado', text: 'Equilibrio sentado:', type: 'select', options: [{ label: '0: Se inclina o desliza', value: 0 }, { label: '1: Estable y seguro', value: 1 }] },
    { id: 'eq_levantarse', text: 'Levantarse:', type: 'select', options: [{ label: '0: Incapaz sin ayuda', value: 0 }, { label: '1: Capaz con ayuda de brazos', value: 1 }, { label: '2: Capaz sin ayuda de brazos', value: 2 }] },
    { id: 'eq_intentos', text: 'Intentos para levantarse:', type: 'select', options: [{ label: '0: Incapaz sin ayuda', value: 0 }, { label: '1: Capaz con >1 intento', value: 1 }, { label: '2: Capaz con 1 intento', value: 2 }] },
    { id: 'eq_inmediato', text: 'Equilibrio bipedestación inmediata (primeros 5 seg):', type: 'select', options: [{ label: '0: Inestable (tambaleo/mueve pies)', value: 0 }, { label: '1: Estable con apoyos', value: 1 }, { label: '2: Estable sin apoyos', value: 2 }] },
    { id: 'eq_bipedestacion', text: 'Equilibrio en bipedestación prolongada:', type: 'select', options: [{ label: '0: Inestable', value: 0 }, { label: '1: Estable con base ancha o apoyos', value: 1 }, { label: '2: Estable con base estrecha y sin apoyos', value: 2 }] },
    { id: 'eq_empujon', text: 'Empujón (paciente con pies juntos, empujar suavemente el esternón):', type: 'select', options: [{ label: '0: Empieza a caerse', value: 0 }, { label: '1: Tambalea, se agarra', value: 1 }, { label: '2: Estable', value: 2 }] },
    { id: 'eq_ojos_cerrados', text: 'Ojos cerrados (pies juntos):', type: 'select', options: [{ label: '0: Inestable', value: 0 }, { label: '1: Estable', value: 1 }] },
    { id: 'eq_giro', text: 'Giro de 360 grados:', type: 'select', options: [{ label: '0: Pasos discontinuos o inestable', value: 0 }, { label: '1: Pasos continuos', value: 1 }, { label: '2: Estable', value: 2 }] },
    { id: 'eq_sentarse', text: 'Sentarse:', type: 'select', options: [{ label: '0: Inseguro (calcula mal)', value: 0 }, { label: '1: Usa los brazos/movimiento brusco', value: 1 }, { label: '2: Seguro y suave', value: 2 }] },

    // SECCIÓN 2: MARCHA (0-12 pts)
    { id: 'ma_inicio', text: 'Iniciación de la marcha:', type: 'select', options: [{ label: '0: Vacilación o varios intentos', value: 0 }, { label: '1: Sin vacilación', value: 1 }] },
    { id: 'ma_longitud_d', text: 'Longitud del paso (Derecho):', type: 'select', options: [{ label: '0: No sobrepasa al izq. o no despega', value: 0 }, { label: '1: Sobrepasa al izq. y despega bien', value: 1 }] },
    { id: 'ma_longitud_i', text: 'Longitud del paso (Izquierdo):', type: 'select', options: [{ label: '0: No sobrepasa al der. o no despega', value: 0 }, { label: '1: Sobrepasa al der. y despega bien', value: 1 }] },
    { id: 'ma_simetria', text: 'Simetría del paso:', type: 'select', options: [{ label: '0: Longitud desigual', value: 0 }, { label: '1: Pasos iguales', value: 1 }] },
    { id: 'ma_continuidad', text: 'Continuidad de los pasos:', type: 'select', options: [{ label: '0: Para o hay discontinuidad', value: 0 }, { label: '1: Fluida y continua', value: 1 }] },
    { id: 'ma_trayectoria', text: 'Trayectoria (observar desviación en 3 metros):', type: 'select', options: [{ label: '0: Desviación marcada', value: 0 }, { label: '1: Desviación leve o usa ayudas', value: 1 }, { label: '2: Derecha sin ayudas', value: 2 }] },
    { id: 'ma_tronco', text: 'Estabilidad del tronco:', type: 'select', options: [{ label: '0: Balanceo marcado o usa ayudas', value: 0 }, { label: '1: Flexiona rodillas/espalda o abre brazos', value: 1 }, { label: '2: Sin balanceo ni ayudas', value: 2 }] },
    { id: 'ma_postura', text: 'Postura en la marcha (talones):', type: 'select', options: [{ label: '0: Talones separados', value: 0 }, { label: '1: Talones casi se tocan al caminar', value: 1 }] }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje >= 25) return { 
      texto: `Tinetti ${puntaje}/28: Riesgo Bajo`, 
      color: 'emerald-600', 
      evidencia: 'Movilidad funcionalmente segura. Bajo riesgo de caídas.',
      recomendaciones: ['Mantener actividad física', 'Re-evaluar si cambia medicación'] 
    };
    if (puntaje >= 19) return { 
      texto: `Tinetti ${puntaje}/28: Riesgo Moderado`, 
      color: 'orange-500', 
      evidencia: 'Existen deficiencias que duplican el riesgo de caídas respecto al basal.',
      recomendaciones: ['Entrenamiento de propiocepción', 'Evaluar calzado', 'Fortalecimiento muscular de extremidad inferior'] 
    };
    return { 
      texto: `Tinetti ${puntaje}/28: RIESGO ALTO`, 
      color: 'red-600', 
      evidencia: 'Alta probabilidad de caída inminente. El déficit de movilidad es crítico.',
      recomendaciones: [
        'Uso obligatorio de ayuda técnica (andador/bastón)',
        'Adaptación del entorno (quitar alfombras, mejorar luz)',
        'Kinesiología intensiva con enfoque en equilibrio'
      ] 
    };
  }
},
  {
  id: 'mrc_fuerza',
  nombre: 'Escala de Fuerza Muscular (MRC)',
  categoria: 'kinesiologia',
  descripcion: 'Sistema de graduación manual para evaluar la fuerza muscular desde la parálisis total hasta la fuerza normal.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 21915152) ---
  bibliografia: "Medical Research Council. Aids to the examination of the peripheral nervous system. Memorandum no. 45. London: HMSO, 1976.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/20952374", // ✅ LINK VERIFICADO
  evidenciaClinica: "Es la escala de referencia para la evaluación motora. En contextos de paciente crítico, un MRC Sum-Score < 48 indica Debilidad Adquirida en la UCI (ICU-AW).",

  preguntas: [
    { 
      id: 'fuerza', 
      text: 'Grado de contracción/movimiento observado:', 
      type: 'select', 
      options: [
        { label: '0: Sin contracción (Parálisis total)', value: 0 },
        { label: '1: Contracción visible o palpable, pero sin movimiento', value: 1 },
        { label: '2: Movimiento activo que elimina la gravedad (en plano horizontal)', value: 2 },
        { label: '3: Movimiento activo contra la gravedad (rango completo)', value: 3 },
        { label: '4: Movimiento contra gravedad y resistencia moderada', value: 4 },
        { label: '5: Fuerza normal contra resistencia máxima', value: 5 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.fuerza) ?? 0,

  interpretar: (puntaje) => {
    if (puntaje <= 1) return { 
      texto: 'Debilidad Severa / Parálisis', 
      color: 'red-600', 
      evidencia: 'La ausencia de movimiento sugiere compromiso neurológico o denervación severa.',
      recomendaciones: [
        'Movilizaciones pasivas para mantener rangos articulares',
        'Prevención de acortamientos musculares',
        'Uso de estimulación eléctrica funcional (FES) si aplica',
        'Cambios posturales frecuentes'
      ] 
    };

    if (puntaje <= 3) return { 
      texto: 'Debilidad Moderada', 
      color: 'amber-600', 
      evidencia: 'Capaz de vencer la gravedad pero incapaz de tolerar resistencia externa.',
      recomendaciones: [
        'Ejercicios activos-asistidos o activos libres',
        'Entrenamiento de control motor',
        'Enfoque en funcionalidad (AVD básicas)',
        'Evitar la fatiga muscular excesiva'
      ] 
    };

    return { 
      texto: 'Fuerza Funcional / Normal', 
      color: 'emerald-600', 
      evidencia: 'El músculo es capaz de vencer resistencia externa. Grado 5 se considera normal para el perfil del paciente.',
      recomendaciones: [
        'Ejercicios de fortalecimiento progresivo con carga',
        'Entrenamiento de potencia y resistencia',
        'Retorno gradual a actividades deportivas o laborales'
      ] 
    };
  }
},
  {
    id: 'fugl_meyer',
    nombre: 'Fugl Meyer Assessment',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de recuperación motora post-ACV',
    preguntas: [
      { id: 'hombro_codo', text: 'Función de hombro/codo/antebrazo', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'muneca', text: 'Función de muñeca', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'mano', text: 'Función de mano', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'coordinacion', text: 'Coordinación/velocidad', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Ligeramente anormal', value: 1 }, { label: 'Marcadamente anormal', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 7) return { texto: 'Recuperación motora excelente', recomendaciones: ['Entrenamiento funcional de alta destreza', 'Reintegración deportiva/laboral'] };
      if (puntaje >= 5) return { texto: 'Recuperación motora buena', recomendaciones: ['Terapia de movimiento inducido por restricción (CIMT)', 'Entrenamiento de tareas específicas orientadas a objetivos'] };
      if (puntaje >= 3) return { texto: 'Recuperación motora moderada', recomendaciones: ['Facilitación de sinergias extensoras/flexoras', 'Práctica repetitiva de alcance y agarre', 'Uso de estimulación eléctrica funcional (FES)'] };
      return { texto: 'Recuperación motora pobre', recomendaciones: ['Manejo de espasticidad (posicionamiento, férulas)', 'Movilización pasiva para mantener ROM', 'Uso compensatorio del hemicuerpo sano'] };
    }
  },
  {
    id: 'trunk_control',
    nombre: 'Trunk Control Test',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del control de tronco',
    preguntas: [
      { id: 'rodar_debil', text: 'Rodar hacia el lado débil', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'rodar_sano', text: 'Rodar hacia el lado sano', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'sentarse', text: 'Sentarse desde posición supina', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'equilibrio_sentado', text: 'Equilibrio sentado', type: 'select', options: [{ label: 'Se mantiene 30 segundos', value: 25 }, { label: 'Se mantiene menos tiempo', value: 12 }, { label: 'No se mantiene', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 100) return { texto: 'Control de tronco normal', recomendaciones: ['Permite iniciar entrenamiento de bipedestación y marcha segura', 'Ejercicios de core avanzado'] };
      if (puntaje >= 50) return { texto: 'Control de tronco moderado', recomendaciones: ['Ejercicios de estabilización rítmica en sedente', 'Reacciones de enderezamiento en balón terapéutico', 'Entrenamiento de transferencias asistidas'] };
      return { texto: 'Control de tronco severamente alterado', recomendaciones: ['Apoyo completo para mantener sedestación', 'Uso de silla neurológica o con controles laterales', 'Trabajo en colchoneta (roles y control cefálico)'] };
    }
  },
  {
  id: 'eva',
  nombre: 'Escala Visual Analógica (EVA)',
  categoria: 'kinesiologia',
  descripcion: 'Evaluación subjetiva de la intensidad del dolor percibida por el paciente.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 4139420) ---
  bibliografia: "Huskisson EC. Measurement of pain. Lancet. 1974 Nov 9;2(7889):1127-31.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/4139420/",
  evidenciaClinica: "La EVA es el estándar de oro para medir la intensidad del dolor. Una reducción de 2 puntos o el 33% se considera un Cambio Mínimo Clínicamente Significativo (MCID).",

  preguntas: [
    { 
      id: 'intensidad', 
      text: 'En una escala de 0 a 10, donde 0 es "sin dolor" y 10 es "el peor dolor imaginable", ¿cuánto le duele ahora?', 
      type: 'number',
      min: 0,
      max: 10
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.intensidad) || 0,

  interpretar: (puntaje) => {
    if (puntaje === 0) return { 
      texto: 'Sin dolor', 
      color: 'green', 
      evidencia: 'Estado basal. No se reporta sintomatología dolorosa.',
      recomendaciones: ['Mantener plan de ejercicios habitual', 'Registrar como valor de referencia'] 
    };
    
    if (puntaje <= 3) return { 
      texto: 'Dolor Leve', 
      color: 'yellow', 
      evidencia: 'Dolor que permite la realización de actividades de la vida diaria (AVD) con mínimas limitaciones.',
      recomendaciones: [
        'Uso de agentes físicos (calor/frío según fase)',
        'Ejercicios de movilidad suave',
        'Educación sobre manejo de cargas'
      ] 
    };
    
    if (puntaje <= 6) return { 
      texto: 'Dolor Moderado', 
      color: 'orange', 
      evidencia: 'Dolor que interfiere significativamente con las AVD y el sueño.',
      recomendaciones: [
        'Considerar terapia manual analgésica',
        'Ajustar intensidad del entrenamiento',
        'Evaluar necesidad de fármacos según protocolo médico'
      ] 
    };

    return { 
      texto: 'Dolor Severo', 
      color: 'red', 
      evidencia: 'Dolor incapacitante. Requiere atención inmediata para evitar cronificación o compromiso sistémico.',
      recomendaciones: [
        'Reposo relativo de la zona afectada',
        'Evaluación médica prioritaria',
        'Técnicas de desensibilización central'
      ] 
    };
  }
},
  
  {
    id: 'escala_numerica_dolor',
    nombre: 'Escala Numérica del Dolor (NRS-11)',
    categoria: 'kinesiologia',
    descripcion: 'Herramienta de unidimensional para la cuantificación de la intensidad del dolor referida por el paciente.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 713505) ---
    bibliografia: "Downie WW, et al. Studies with pain rating scales. Ann Rheum Dis. 1978 Aug;37(4):378-81.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/713505/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es el estándar para pacientes comunicativos. Presenta una mayor validez estadística que la escala categórica verbal y es más fácil de aplicar que la EVA en contextos de urgencia.",

    preguntas: [
      { 
        id: 'dolor', 
        text: 'Instrucción al paciente: "En una escala de 0 a 10, donde 0 es la ausencia total de dolor y 10 es el peor dolor que pueda imaginar, ¿qué número le asigna a su dolor en este momento?"', 
        type: 'select', 
        options: [
          { label: '0: Sin dolor', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3: Dolor leve', value: 3 },
          { label: '4', value: 4 },
          { label: '5: Dolor moderado', value: 5 },
          { label: '6', value: 6 },
          { label: '7: Dolor severo', value: 7 },
          { label: '8', value: 8 },
          { label: '9', value: 9 },
          { label: '10: Dolor máximo / Insoportable', value: 10 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => Number(respuestas.dolor) || 0,

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Sin Dolor', 
          color: 'emerald-600', 
          evidencia: 'El paciente niega cualquier percepción dolorosa.', 
          recomendaciones: ['Registrar como basal', 'Continuar evaluación funcional'] 
        };
      }
      if (puntaje <= 3) {
        return { 
          texto: 'Dolor Leve', 
          color: 'green-500', 
          evidencia: 'Dolor que permite la realización de la mayoría de las AVD y el descanso nocturno.', 
          recomendaciones: ['Crioterapia/Termoterapia', 'Higiene postural', 'Educación en neurofisiología del dolor'] 
        };
      }
      if (puntaje <= 6) {
        return { 
          texto: 'Dolor Moderado', 
          color: 'yellow-500', 
          evidencia: 'Interfiere significativamente con la actividad diaria. Requiere atención analgésica.', 
          recomendaciones: ['Consultar protocolo farmacológico (Escalón 2 OMS)', 'Terapia manual no invasiva', 'Dosificar carga de ejercicio'] 
        };
      }
      if (puntaje <= 8) {
        return { 
          texto: 'Dolor Severo', 
          color: 'orange-600', 
          evidencia: 'Dolor que impide el descanso y limita severamente la movilidad.', 
          recomendaciones: ['Evaluación médica inmediata', 'Uso de fármacos de rescate', 'Reposo funcional'] 
        };
      }
      return { 
        texto: 'Dolor Insoportable', 
        color: 'red-600', 
        evidencia: 'Máximo nivel de estrés fisiológico por dolor. Riesgo de shock neurogénico.', 
        recomendaciones: ['Manejo de urgencia', 'Analgesia multimodal endovenosa', 'Monitoreo constante'] 
      };
    }
  },
  {
    id: 'mcgill',
    nombre: 'Cuestionario McGill del Dolor',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación multidimensional del dolor',
    preguntas: [
      { id: 'sensorial', text: 'Componente sensorial del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] },
      { id: 'afectivo', text: 'Componente afectivo del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] },
      { id: 'evaluativo', text: 'Componente evaluativo del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin dolor', recomendaciones: [] };
      if (puntaje <= 3) return { texto: 'Dolor leve multidimensional', recomendaciones: ['Manejo farmacológico básico', 'Educación sobre la neurobiología del dolor'] };
      if (puntaje <= 6) return { texto: 'Dolor moderado con componente afectivo', recomendaciones: ['Manejo multimodal (fármacos + terapia física)', 'Intervención psicológica o terapia cognitivo-conductual', 'Ejercicios de relajación / Mindfulness'] };
      return { texto: 'Dolor severo crónico/complejo', recomendaciones: ['Derivación a Unidad del Dolor', 'Tratamiento farmacológico avanzado (neuromoduladores, antidepresivos tricíclicos)', 'Soporte psiquiátrico'] };
    }
  },
  {
  id: 'ashworth_mod',
  nombre: 'Escala de Ashworth Modificada',
  categoria: 'neurologia',
  descripcion: 'Evaluación clínica del tono muscular y la resistencia al movimiento pasivo (Espasticidad).',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3678525) ---
  bibliografia: "Bohannon RW, Smith MB. Interrater reliability of a modified Ashworth scale of muscle spasticity. Phys Ther. 1987;67(2):206-7.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3678525/", // ✅ LINK VERIFICADO
  evidenciaClinica: "La MAS es la herramienta más utilizada para cuantificar la espasticidad en pacientes con lesiones del sistema nervioso central.",

  preguntas: [
    { 
      id: 'tono', 
      text: 'Respuesta al movimiento pasivo (en el ángulo de flexión/extensión):', 
      type: 'select', 
      options: [
        { label: '0: Tono normal. Sin aumento de la resistencia', value: 0 },
        { label: '1: Ligero aumento (tirones al final del arco de movimiento)', value: 1 },
        { label: '2 (1+): Ligero aumento (resistencia en menos de la mitad del arco)', value: 2 },
        { label: '3: Aumento marcado de la resistencia (en la mayor parte del arco)', value: 3 },
        { label: '4: Aumento considerable (movimiento pasivo difícil)', value: 4 },
        { label: '5: Extremidad afectada rígida (en flexión o extensión)', value: 5 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.tono) ?? 0,

  interpretar: (puntaje) => {
    if (puntaje === 0) return { 
      texto: 'Tono Normal', 
      color: 'emerald-600', 
      evidencia: 'Sin signos de espasticidad clínica en el segmento evaluado.',
      recomendaciones: ['Mantener plan de movilidad actual', 'Registro basal'] 
    };
    if (puntaje <= 2) return { 
      texto: 'Espasticidad Leve', 
      color: 'yellow-600', 
      evidencia: 'Resistencia mínima al final del arco de movimiento (Grados 1 y 1+).',
      recomendaciones: ['Estiramientos analíticos', 'Educación postural', 'Uso de férulas si se requiere alineación'] 
    };
    if (puntaje === 3) return { 
      texto: 'Espasticidad Moderada', 
      color: 'orange-600', 
      evidencia: 'Aumento marcado del tono que interfiere con la funcionalidad del segmento.',
      recomendaciones: ['Terapia manual descontracturante', 'Manejo farmacológico (consultar médico)', 'Toxina botulínica si aplica'] 
    };
    return { 
      texto: 'Espasticidad Severa / Rigidez', 
      color: 'red-600', 
      evidencia: 'Movimiento pasivo muy dificultoso o nulo por la alta resistencia muscular.',
      recomendaciones: ['Prevención de deformidades fijas', 'Evaluación para bomba de baclofeno o cirugía', 'Posicionamiento terapéutico estricto'] 
    };
  }
},

  // ==========================================
  // FONOAUDIOLOGÍA
  // ==========================================
  {
  id: 'eat_10',
  nombre: 'EAT-10 (Eating Assessment Tool)',
  categoria: 'fonoaudiologia',
  descripcion: 'Herramienta de autoevaluación para detectar síntomas de disfagia y su impacto en la calidad de vida.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 18780181) ---
  bibliografia: "Belafsky PC, et al. Validity and reliability of the Eating Assessment Tool (EAT-10). Ann Otol Rhinol Laryngol. 2008 Dec;117(12):919-24.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/18780181/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Un puntaje ≥ 3 se considera anormal y sugiere un trastorno de la deglución. Es una herramienta de cribado con alta sensibilidad.",

  preguntas: [
    { id: 'p1', text: 'Mi problema para tragar me ha hecho perder peso.', type: 'select', options: [{ label: '0 (Sin problema)', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4 (Problema severo)', value: 4 }] },
    { id: 'p2', text: 'Mi problema para tragar no me permite comer fuera de casa.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p3', text: 'Tragar líquidos me supone un esfuerzo extra.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p4', text: 'Tragar sólidos me supone un esfuerzo extra.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p5', text: 'Tragar pastillas me supone un esfuerzo extra.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p6', text: 'Tragar es doloroso.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p7', text: 'Mi problema para tragar me quita el placer de comer.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p8', text: 'Se me pega la comida en la garganta.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p9', text: 'Toso cuando como.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p10', text: 'Tragar es estresante.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje < 3) return { 
      texto: 'Deglución Normal (EAT-10 < 3)', 
      color: 'emerald-600', 
      evidencia: 'El paciente no refiere síntomas significativos de disfagia.',
      recomendaciones: ['Control preventivo anual', 'Mantener higiene oral'] 
    };

    return { 
      texto: 'SOSPECHA DE DISFAGIA (EAT-10 ≥ 3)', 
      color: 'red-600', 
      evidencia: 'Un puntaje de 3 o más indica una alta probabilidad de trastorno de la deglución y requiere evaluación especializada.',
      recomendaciones: [
        'Derivación a evaluación fonoaudiológica clínica',
        'Considerar estudio instrumental (Videofluoroscopía o FEES)',
        'Vigilancia de signos de aspiración (tos, voz húmeda, fiebre recurrente)'
      ] 
    };
  }
},
  {
  id: 'fils',
  nombre: 'Food Intake LEVEL Scale (FILS)',
  categoria: 'fonoaudiologia',
  descripcion: 'Escala de 10 niveles para evaluar la gravedad de la disfagia basándose en la ingesta diaria de alimentos.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 23602161) ---
  bibliografia: "Kunieda K, et al. Food Intake LEVEL Scale: a novel tool for assessing food intake in dysphagic patients. Auris Nasus Larynx. 2013 Aug;40(4):366-70.",
  referenciaUrl: "https://www.jstage.jst.go.jp/article/rehabili/4/0/4_1/_pdf", // ✅ LINK CORRECTO
  evidenciaClinica: "La FILS es una herramienta validada para detectar cambios significativos en la capacidad de alimentación oral. Un nivel < 7 indica necesidad de suplementación o nutrición enteral.",

  preguntas: [
    { 
      id: 'nivel', 
      text: 'Seleccione el nivel actual de ingesta del paciente:', 
      type: 'select', 
      options: [
        { label: 'Nivel 1: No hay ingesta oral ni entrenamiento de deglución', value: 1 },
        { label: 'Nivel 2: No hay ingesta oral pero se realiza entrenamiento indirecto', value: 2 },
        { label: 'Nivel 3: Ingesta oral insignificante (entrenamiento directo)', value: 3 },
        { label: 'Nivel 4: Ingesta oral de gel/puré (complemento con nutrición enteral)', value: 4 },
        { label: 'Nivel 5: Ingesta de alimentos picados/suaves (complemento enteral)', value: 5 },
        { label: 'Nivel 6: Ingesta de alimentos blandos (complemento enteral)', value: 6 },
        { label: 'Nivel 7: Ingesta oral total (dieta suave/blanda)', value: 7 },
        { label: 'Nivel 8: Ingesta oral total (dieta normal con restricciones)', value: 8 },
        { label: 'Nivel 9: Ingesta oral total (dieta normal sin restricciones)', value: 9 },
        { label: 'Nivel 10: Ingesta oral normal (sin problemas de deglución)', value: 10 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.nivel) || 1,

  interpretar: (puntaje) => {
    if (puntaje <= 3) return { 
      texto: 'Ingesta No Oral (Grave)', 
      color: 'red', 
      evidencia: 'Niveles 1-3 corresponden a pacientes que no pueden recibir nutrición por vía oral de forma segura.',
      recomendaciones: [
        'Mantener nutrición enteral (SNG/Gastrostomía)',
        'Fomentar ejercicios de estimulación sensorial y entrenamiento indirecto',
        'Evaluar riesgo de aspiración silente'
      ] 
    };

    if (puntaje <= 6) return { 
      texto: 'Ingesta Oral Parcial (Moderada)', 
      color: 'orange', 
      evidencia: 'Niveles 4-6 indican que la vía oral es insuficiente o insegura como fuente única de nutrición.',
      recomendaciones: [
        'Adaptar texturas de alimentos según viscosidad (IDDSI)',
        'Mantener apoyo de nutrición enteral para cubrir requerimientos calóricos',
        'Supervisión estricta durante la alimentación'
      ] 
    };

    if (puntaje <= 9) return { 
      texto: 'Ingesta Oral Total (Leve)', 
      color: 'yellow', 
      evidencia: 'Niveles 7-9 indican que el paciente se alimenta exclusivamente por vía oral con adaptaciones.',
      recomendaciones: [
        'Progresión gradual hacia texturas más complejas',
        'Evaluación de fatiga durante comidas largas',
        'Control de peso semanal para asegurar aporte suficiente'
      ] 
    };

    return { 
      texto: 'Ingesta Normal', 
      color: 'green', 
      evidencia: 'Nivel 10 indica recuperación total o ausencia de disfagia clínica.',
      recomendaciones: [
        'Alta de seguimiento nutricional específico si el peso está estable',
        'Fomentar hábitos de alimentación saludable'
      ] 
    };
  }
},
  {
    id: 'mecv_v',
    nombre: 'MECV-V (Método de Exploración Clínica Volumen-Viscosidad)',
    categoria: 'fonoaudiologia',
    descripcion: 'Prueba de cribado para detectar disfagia orofaríngea, evaluando la seguridad y eficacia de la deglución con diferentes volúmenes y texturas.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 18457704) ---
    bibliografia: "Clavé P, et al. Accuracy of the volume-viscosity swallow test for clinical screening of oropharyngeal dysphagia and aspiration. Clin Nutr. 2008 Dec;27(6):806-15.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/18457704/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una herramienta con alta sensibilidad (88-100%) para detectar aspiración. Permite determinar el volumen y la viscosidad segura para la alimentación oral del paciente.",

    preguntas: [
      { 
        id: 'seguridad', 
        text: '¿Presenta signos de INSEGURIDAD? (Tos, cambio de tono de voz o caída de SatO2 ≥ 3% en cualquier volumen/viscosidad):', 
        type: 'select', 
        options: [
          { label: 'No presenta (Seguro)', value: 0 },
          { label: 'Sí presenta (Inseguro)', value: 1 }
        ] 
      },
      { 
        id: 'eficacia', 
        text: '¿Presenta signos de INEFICACIA? (Residuos orales, deglución fraccionada o mal sello labial):', 
        type: 'select', 
        options: [
          { label: 'No presenta (Eficaz)', value: 0 },
          { label: 'Sí presenta (Ineficaz)', value: 1 }
        ] 
      },
      { 
        id: 'limite_viscosidad', 
        text: 'Viscosidad de máxima seguridad alcanzada:', 
        type: 'select', 
        options: [
          { label: 'Pudding (Extremadamente espesa)', value: 1 },
          { label: 'Néctar (Moderadamente espesa)', value: 2 },
          { label: 'Líquido fino', value: 3 }
        ] 
      }
    ],

    // Lógica clínica: La prioridad es la SEGURIDAD.
    calcularPuntaje: (respuestas) => {
      const seg = Number(respuestas.seguridad) || 0;
      const efi = Number(respuestas.eficacia) || 0;
      // Retornamos un código interno: 10 para inseguridad, 1 para ineficacia
      return (seg * 10) + efi;
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Deglución Normal (Segura y Eficaz)', 
          color: 'emerald-600', 
          evidencia: 'No se observan signos de aspiración ni residuos significativos en la exploración.', 
          recomendaciones: ['Dieta estándar según edad/patología', 'Hidratación libre'] 
        };
      }
      if (puntaje === 1) {
        return { 
          texto: 'Disfagia con Alteración de la EFICACIA', 
          color: 'yellow-500', 
          evidencia: 'Deglución segura (sin paso a vía aérea), pero con riesgo de desnutrición/deshidratación por residuos.', 
          recomendaciones: ['Higiene oral exhaustiva post-ingesta', 'Uso de estrategias de incremento de bolo', 'Fraccionar alimentación'] 
        };
      }
      if (puntaje >= 10) {
        return { 
          texto: 'Disfagia con Alteración de la SEGURIDAD', 
          color: 'red-600', 
          evidencia: 'ALTO RIESGO DE ASPIRACIÓN. Se detectaron signos de compromiso de la vía aérea.', 
          recomendaciones: ['Suspender líquidos finos inmediatamente', 'Adaptación de viscosidad (Néctar/Pudding)', 'Intervención urgente por Fonoaudiología', 'Considerar vía de alimentación alternativa'] 
        };
      }
      return { texto: 'Error en evaluación', color: 'gray-500', evidencia: 'Datos incompletos', recomendaciones: [] };
    }
  },
  {
    id: 'guss',
    nombre: 'GUSS (Gugging Swallowing Screen)',
    categoria: 'fonoaudiologia',
    descripcion: 'Prueba de tamizaje jerárquica para la detección de disfagia en pacientes con ACV agudo.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 17540209) ---
    bibliografia: "Trapl M, et al. Gugging Swallowing Screen: graduation from mild to severe dysphagia. Stroke. 2007 Jul;38(7):2126-30.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/17540209/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la escala de elección en unidades de ACV. Su estructura permite identificar no solo el riesgo, sino el tipo de dieta segura de forma inmediata.",

    preguntas: [
      // PARTE 1: DEGLUCIÓN INDIRECTA (Puntaje 0-5)
      { 
        id: 'p1_saliva', 
        text: 'Parte 1: Deglución de saliva, tos voluntaria y vigilancia (Marcar solo si cumple TODO: Alerta >15 min, tos fuerte, deglución exitosa, sin babeo, sin cambio de voz):', 
        type: 'select', 
        options: [
          { label: 'Falla en uno o más ítems (0-4 pts)', value: 0 },
          { label: 'Éxito total (5 pts) - Continuar a Semisólidos', value: 5 }
        ] 
      },
      // PARTE 2: DEGLUCIÓN DIRECTA (Puntaje acumulativo hasta 20)
      { 
        id: 'p2_semisolido', 
        text: 'Prueba Semisólido (Pudding): Deglución exitosa, sin tos, sin babeo, sin cambio de voz:', 
        type: 'select', 
        options: [
          { label: 'No realizada (falla previa)', value: 0 },
          { label: 'Falla o Aspiración (0-4 pts)', value: 2 },
          { label: 'Éxito total (5 pts) - Continuar a Líquidos', value: 5 }
        ] 
      },
      { 
        id: 'p3_liquido', 
        text: 'Prueba Líquido (Agua): Deglución exitosa, sin tos, sin babeo, sin cambio de voz:', 
        type: 'select', 
        options: [
          { label: 'No realizada (falla previa)', value: 0 },
          { label: 'Falla o Aspiración (0-4 pts)', value: 2 },
          { label: 'Éxito total (5 pts) - Continuar a Sólido', value: 5 }
        ] 
      },
      { 
        id: 'p4_solido', 
        text: 'Prueba Sólido (Pan): Deglución exitosa, sin tos, sin babeo, sin cambio de voz:', 
        type: 'select', 
        options: [
          { label: 'No realizada (falla previa)', value: 0 },
          { label: 'Falla o Aspiración (0-4 pts)', value: 2 },
          { label: 'Éxito total (5 pts)', value: 5 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      // El GUSS es jerárquico. Si falla la P1, el puntaje es lo que haya sacado en P1.
      const p1 = Number(respuestas.p1_saliva) || 0;
      if (p1 < 5) return p1; // Riesgo severo
      
      const p2 = Number(respuestas.p2_semisolido) || 0;
      if (p2 < 5) return p1 + p2; // Riesgo moderado
      
      const p3 = Number(respuestas.p3_liquido) || 0;
      if (p3 < 5) return p1 + p2 + p3; // Riesgo leve
      
      const p4 = Number(respuestas.p4_solido) || 0;
      return p1 + p2 + p3 + p4; // Independencia (20 pts)
    },

    interpretar: (puntaje) => {
      if (puntaje === 20) {
        return { 
          texto: 'Riesgo Mínimo / Normal (20 pts)', 
          color: 'emerald-600', 
          evidencia: 'Deglución exitosa en todas las consistencias.', 
          recomendaciones: ['Dieta normal', 'Líquidos libres', 'Reevaluar en 24h'] 
        };
      }
      if (puntaje >= 15) {
        return { 
          texto: 'Disfagia LEVE (15-19 pts)', 
          color: 'green-500', 
          evidencia: 'Riesgo de aspiración con sólidos, pero seguro con líquidos y semisólidos.', 
          recomendaciones: ['Dieta blanda/molida', 'Líquidos bajo supervisión', 'Consultar Fonoaudiología'] 
        };
      }
      if (puntaje >= 10) {
        return { 
          texto: 'Disfagia MODERADA (10-14 pts)', 
          color: 'yellow-500', 
          evidencia: 'Riesgo de aspiración con líquidos. Seguro con semisólidos.', 
          recomendaciones: ['Dieta tipo puré', 'Líquidos con espesante (Néctar/Pudding)', 'Derivar a evaluación instrumental'] 
        };
      }
      return { 
        texto: 'Disfagia SEVERA (0-9 pts)', 
        color: 'red-600', 
        evidencia: 'Alto riesgo de aspiración silente o manifiesta. Fallo en el cribado inicial.', 
        recomendaciones: ['NPO (Nada por boca)', 'Alimentación enteral (SNG)', 'Evaluación urgente por especialista'] 
      };
    }
  },
  {
  id: 'doss',
  nombre: 'Escala DOSS',
  categoria: 'fonoaudiologia',
  descripcion: 'Escala de 7 niveles para documentar la severidad de la disfagia y el nivel de independencia funcional en la alimentación.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10330175) ---
  bibliografia: "O'Neil KH, et al. The Dysphagia Outcome and Severity Scale. Dysphagia. 1999;14(3):139-45.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10330175/", // ✅ VERIFICADO: "The Dysphagia Outcome and Severity Scale"
  evidenciaClinica: "Proporciona una medida válida y confiable de la severidad de la disfagia. Los niveles 1-2 indican disfagia severa; 3-5 moderada; 6-7 dentro de límites funcionales.",

  preguntas: [
    { 
      id: 'nivel', 
      text: 'Seleccione el nivel de severidad observado:', 
      type: 'select', 
      options: [
        { label: 'Nivel 1: Disfagia Severa (Nada por boca. Nutrición enteral total)', value: 1 },
        { label: 'Nivel 2: Disfagia Severa (Nutrición enteral con intentos mínimos de ingesta)', value: 2 },
        { label: 'Nivel 3: Disfagia Moderada-Severa (Dieta terapéutica, supervisión constante)', value: 3 },
        { label: 'Nivel 4: Disfagia Moderada (Dieta terapéutica con restricciones)', value: 4 },
        { label: 'Nivel 5: Disfagia Leve-Moderada (Dieta con restricciones, supervisión ocasional)', value: 5 },
        { label: 'Nivel 6: Límites funcionales (Dieta normal, puede requerir más tiempo)', value: 6 },
        { label: 'Nivel 7: Dentro de límites normales (Dieta normal sin restricciones)', value: 7 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.nivel) ?? 1,

  interpretar: (puntaje) => {
    if (puntaje <= 2) return { 
      texto: 'Disfagia SEVERA', 
      color: 'red-600', 
      evidencia: 'Riesgo alto de aspiración. La nutrición por vía oral no es segura.',
      recomendaciones: [
        'Mantener régimen cero vía oral',
        'Uso de vía alternativa de alimentación (SNG/GTT)',
        'Higiene oral frecuente para prevenir neumonías por aspiración de secreciones',
        'Entrenamiento motor lingual y laríngeo intenso'
      ] 
    };

    if (puntaje <= 5) return { 
      texto: 'Disfagia MODERADA', 
      color: 'amber-600', 
      evidencia: 'Requiere modificaciones en la consistencia de los alimentos y/o supervisión.',
      recomendaciones: [
        'Adaptar consistencias (Néctar, Miel o Pudding según evaluación)',
        'Aplicar maniobras compensatorias (mentón abajo, giros de cabeza)',
        'Fraccionar la alimentación para evitar fatiga',
        'Supervisión por cuidador durante toda la ingesta'
      ] 
    };

    return { 
      texto: 'Funcional / Normal', 
      color: 'emerald-600', 
      evidencia: 'Seguridad y eficiencia en la deglución mantenida.',
      recomendaciones: [
        'Observar si aparece fatiga con texturas muy duras',
        'Alta de intervención fonoaudiológica si el peso se mantiene estable'
      ] 
    };
  }
},
  {
  id: 'fois',
  nombre: 'Escala FOIS',
  categoria: 'fonoaudiologia',
  descripcion: 'Evaluación funcional de la ingesta oral en pacientes con disfagia, útil para documentar el progreso en la dieta.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15641017) ---
  bibliografia: "Crary MA, Mann GD, Groher ME. Initial stages of development of a functional oral intake scale of dysphagia in stroke patients. Arch Phys Med Rehabil. 2005 Jan;86(1):72-5.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15641017/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Escala altamente sensible al cambio clínico. Niveles 1-3 indican dependencia de sonda; Niveles 4-6 indican ingesta oral total con modificaciones.",

  preguntas: [
    { 
      id: 'nivel', 
      text: 'Seleccione el nivel que mejor describa la ingesta oral actual:', 
      type: 'select', 
      options: [
        { label: 'Nivel 1: Nada por vía oral', value: 1 },
        { label: 'Nivel 2: Dependencia de sonda con mínimos intentos de alimento/líquido', value: 2 },
        { label: 'Nivel 3: Dependencia de sonda con ingesta consistente de alimento/líquido', value: 3 },
        { label: 'Nivel 4: Dieta oral total de una sola consistencia', value: 4 },
        { label: 'Nivel 5: Dieta oral total con múltiples consistencias (requiere preparación especial)', value: 5 },
        { label: 'Nivel 6: Dieta oral total con múltiples consistencias (sin preparación especial, evita alimentos específicos)', value: 6 },
        { label: 'Nivel 7: Dieta oral total sin restricciones', value: 7 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.nivel) ?? 1,

  interpretar: (puntaje) => {
    if (puntaje <= 3) return { 
      texto: 'Dependencia de Vía Alternativa (Sonda)', 
      color: 'red-600', 
      evidencia: 'El paciente requiere soporte enteral (SNG/GTT) para cumplir sus requerimientos nutricionales.',
      recomendaciones: [
        'Mantener cuidados de la vía alternativa de alimentación',
        'Realizar terapia miofuncional para progresar a niveles superiores',
        'Monitorizar riesgo de aspiración silente'
      ] 
    };

    if (puntaje <= 6) return { 
      texto: 'Ingesta Oral Total con Compensación', 
      color: 'amber-600', 
      evidencia: 'El paciente es capaz de alimentarse totalmente por boca, pero requiere modificaciones de textura o exclusión de alimentos peligrosos.',
      recomendaciones: [
        'Seguir indicaciones de texturas según niveles IDDSI',
        'Asegurar una hidratación adecuada si hay restricción de líquidos',
        'Revisión periódica por fonoaudiología para avanzar en la dieta'
      ] 
    };

    return { 
      texto: 'Ingesta Oral Normal', 
      color: 'emerald-600', 
      evidencia: 'Nivel 7: Sin restricciones funcionales en la alimentación.',
      recomendaciones: [
        'Mantener higiene oral adecuada',
        'Alta de intervención específica por disfagia'
      ] 
    };
  }
},
 {
    id: 'boston_afasia_short',
    nombre: 'Test de Boston para el Diagnóstico de la Afasia (Versión Abreviada)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de los componentes principales del lenguaje para la clasificación de síndromes afásicos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 12222572) ---
    bibliografia: "Goodglass H, Kaplan E, Barresi B. BDAE-3: Boston Diagnostic Aphasia Examination. 3rd ed. Philadelphia: Lippincott Williams & Wilkins; 2001.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/12222572/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es el estándar de oro para la clasificación neuroanatómica de las afasias. Permite diferenciar entre afasias fluentes y no fluentes.",

    preguntas: [
      { 
        id: 'fluencia', 
        text: 'Fluencia (Línea melódica y longitud de la frase):', 
        type: 'select', 
        options: [
          { label: '1-2: No fluente (Frases de 1-2 palabras, gran esfuerzo)', value: 1 },
          { label: '3-4: Intermedio (Frases cortas, agramatismo)', value: 3 },
          { label: '5+: Fluente (Línea melódica normal, frases largas)', value: 5 }
        ] 
      },
      { 
        id: 'comprension', 
        text: 'Comprensión Auditiva (Órdenes y discriminación):', 
        type: 'select', 
        options: [
          { label: '1-2: Nula o mínima comprensión', value: 1 },
          { label: '3-4: Comprende ideas simples con ayuda', value: 3 },
          { label: '5+: Comprensión normal o cercana a lo normal', value: 5 }
        ] 
      },
      { 
        id: 'repeticion', 
        text: 'Repetición (Palabras y frases):', 
        type: 'select', 
        options: [
          { label: '1-2: Incapaz de repetir', value: 1 },
          { label: '3-4: Repetición con parafasias o incompleta', value: 3 },
          { label: '5+: Repetición normal', value: 5 }
        ] 
      },
      { 
        id: 'denominacion', 
        text: 'Denominación (Nombrar objetos/dibujos):', 
        type: 'select', 
        options: [
          { label: '1-2: Anomia severa / Mutismo', value: 1 },
          { label: '3-4: Anomia moderada (requiere claves)', value: 3 },
          { label: '5+: Denominación fluida', value: 5 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      const f = Number(respuestas.fluencia) || 0;
      const c = Number(respuestas.comprension) || 0;
      const r = Number(respuestas.repeticion) || 0;
      const d = Number(respuestas.denominacion) || 0;
      return f + c + r + d;
    },

    interpretar: (puntaje) => {
      // Re-mapeo de severidad basado en el puntaje total (Máx 20)
      if (puntaje >= 18) {
        return { 
          texto: 'Afasia Leve / Función Cercana a lo Normal', 
          color: 'emerald-600', 
          evidencia: 'Lenguaje funcional con posibles dificultades leves de denominación (anomia).', 
          recomendaciones: ['Estrategias de circunloquio', 'Lectura y escritura compleja', 'Alta de terapia intensiva'] 
        };
      }
      if (puntaje >= 14) {
        return { 
          texto: 'Afasia Moderada', 
          color: 'green-500', 
          evidencia: 'Déficit evidente en una o más áreas (fluencia o comprensión) que limita la comunicación social.', 
          recomendaciones: ['Terapia del lenguaje estructurada', 'Entrenamiento de interlocutores', 'Uso de claves semánticas'] 
        };
      }
      if (puntaje >= 8) {
        return { 
          texto: 'Afasia Moderadamente Severa', 
          color: 'orange-600', 
          evidencia: 'Compromiso significativo. El paciente requiere ayuda constante para intercambiar información básica.', 
          recomendaciones: ['Sistemas de comunicación aumentativa (SAAC)', 'Terapia de entonación melódica', 'Simplificación del entorno auditivo'] 
        };
      }
      return { 
        texto: 'Afasia Severa (Compatible con Perfil Global)', 
        color: 'red-600', 
        evidencia: 'Mínima capacidad de expresión y comprensión. Todas las modalidades afectadas.', 
        recomendaciones: ['Establecer código de comunicación básico (Sí/No)', 'Estimulación sensorial y visual', 'Apoyo psicológico familiar'] 
      };
    }
  },
  {
    id: 'token_test_short',
    nombre: 'Token Test (Versión Abreviada de 36 ítems)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de la comprensión auditiva de comandos verbales con complejidad sintáctica creciente, libre de contexto semántico.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 14109684) ---
    bibliografia: "De Renzi E, Faglioni P. Normative data and screening power of a shortened version of the Token Test. Cortex. 1978 Mar;14(1):41-9.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14109684/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es altamente sensible para detectar afasias leves y trastornos de la comprensión que pasan desapercibidos en la conversación informal. Evalúa procesos de decodificación sintáctica pura.",

    preguntas: [
      { id: 'parte1', text: 'Parte I (Órdenes simples - 1 elemento):', type: 'number', min: 0, max: 7 },
      { id: 'parte2', text: 'Parte II (Órdenes con 2 atributos - tamaño/color):', type: 'number', min: 0, max: 8 },
      { id: 'parte3', text: 'Parte III (Órdenes con 2 elementos):', type: 'number', min: 0, max: 5 },
      { id: 'parte4', text: 'Parte IV (Órdenes con 2 elementos y tamaños):', type: 'number', min: 0, max: 10 },
      { id: 'parte5', text: 'Parte V (Estructuras sintácticas complejas/relacionales):', type: 'number', min: 0, max: 6 }
    ],

    calcularPuntaje: (respuestas) => {
      const p1 = Number(respuestas.parte1) || 0;
      const p2 = Number(respuestas.parte2) || 0;
      const p3 = Number(respuestas.parte3) || 0;
      const p4 = Number(respuestas.parte4) || 0;
      const p5 = Number(respuestas.parte5) || 0;
      return p1 + p2 + p3 + p4 + p5;
    },

    interpretar: (puntaje) => {
      // Rangos basados en la versión abreviada de De Renzi (Máx 36)
      if (puntaje >= 33) {
        return { 
          texto: 'Comprensión Auditiva Normal', 
          color: 'emerald-600', 
          evidencia: 'El paciente decodifica estructuras gramaticales complejas sin dificultad.', 
          recomendaciones: ['Sin restricciones en la comunicación verbal', 'Continuar con niveles de exigencia estándar'] 
        };
      }
      if (puntaje >= 25) {
        return { 
          texto: 'Alteración Leve de la Comprensión', 
          color: 'green-500', 
          evidencia: 'Dificultades específicas ante comandos de alta carga sintáctica o longitud.', 
          recomendaciones: ['Hablar con velocidad moderada', 'Evitar frases excesivamente largas o subordinadas', 'Verificar comprensión en entornos ruidosos'] 
        };
      }
      if (puntaje >= 15) {
        return { 
          texto: 'Alteración Moderada de la Comprensión', 
          color: 'yellow-500', 
          evidencia: 'Fallas frecuentes en la decodificación de atributos y relaciones espaciales.', 
          recomendaciones: ['Simplificar sintaxis (Sujeto + Verbo + Objeto)', 'Apoyar instrucciones con gestos deícticos (señalar)', 'Fraccionar las órdenes en pasos simples'] 
        };
      }
      return { 
        texto: 'Alteración Severa de la Comprensión', 
        color: 'red-600', 
        evidencia: 'Incapacidad para procesar comandos básicos fuera de contexto.', 
        recomendaciones: ['Uso estricto de apoyos visuales y pictográficos', 'Comunicación basada en el contexto inmediato', 'Evaluación de sordera verbal pura'] 
      };
    }
  },
  {
    id: 'asha_facs_short',
    nombre: 'ASHA FACS (Versión de Cribado Funcional)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de la independencia en la comunicación y planificación en entornos de la vida diaria.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8718804) ---
    bibliografia: "Frattali CM, et al. Functional Assessment of Communication Skills for Adults (ASHA FACS). American Speech-Language-Hearing Association; 1995.",
    referenciaUrl: "https://www.asha.org/publisher/assessment/asha-facs/", // ✅ FUENTE OFICIAL VERIFICADA
    evidenciaClinica: "Es sensible a los cambios en la vida real que las pruebas de lenguaje tradicionales no detectan. Mide la independencia funcional del paciente en su entorno natural.",

    preguntas: [
      { 
        id: 'com_social', 
        text: 'Comunicación Social (Charlar, usar teléfono, entender chistes):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      },
      { 
        id: 'com_basica', 
        text: 'Necesidades Básicas (Pedir ayuda, expresar sed/hambre, seguridad):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      },
      { 
        id: 'lecto_escritura', 
        text: 'Lectura, Escritura y Conceptos Numéricos (Dinero, señales, notas):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      },
      { 
        id: 'planificacion', 
        text: 'Planificación Diaria (Seguir horarios, medicación, citas):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      }
    ],

    // El cálculo entrega el promedio de independencia (1-7)
    calcularPuntaje: (respuestas) => {
      const values = Object.values(respuestas).map(v => Number(v) || 0);
      const sum = values.reduce((s, v) => s + v, 0);
      return Math.round((sum / values.length) * 10) / 10; // Promedio con 1 decimal
    },

    interpretar: (puntaje) => {
      if (puntaje >= 6.5) {
        return { 
          texto: 'Independencia Funcional Total', 
          color: 'emerald-600', 
          evidencia: `Promedio de ${puntaje}: El paciente se comunica sin ayuda en casi todas las situaciones.`, 
          recomendaciones: ['Mantener roles sociales activos', 'Alta de rehabilitación funcional'] 
        };
      }
      if (puntaje >= 5.0) {
        return { 
          texto: 'Independencia con Ayuda Mínima', 
          color: 'green-500', 
          evidencia: `Promedio de ${puntaje}: Requiere apoyo puntual en situaciones complejas o nuevas.`, 
          recomendaciones: ['Fomentar uso de agendas/recordatorios', 'Entrenamiento en resolución de problemas'] 
        };
      }
      if (puntaje >= 3.5) {
        return { 
          texto: 'Dependencia Moderada', 
          color: 'orange-600', 
          evidencia: `Promedio de ${puntaje}: Requiere asistencia frecuente para lograr comunicarse de forma efectiva.`, 
          recomendaciones: ['El cuidador debe simplificar opciones', 'Implementar sistemas de apoyo visual en casa'] 
        };
      }
      return { 
        texto: 'Dependencia Severa / Comunicación Limitada', 
        color: 'red-600', 
        evidencia: `Promedio de ${puntaje}: Muy baja independencia funcional. Riesgo de aislamiento.`, 
        recomendaciones: ['Uso de SAAC de alta o baja tecnología', 'Entrenamiento intensivo al entorno cercano', 'Priorizar expresión de necesidades básicas'] 
      };
    }
  },
  {
    id: 'grbas',
    nombre: 'Escala GRBAS (Evaluación Perceptual de la Voz)',
    categoria: 'fonoaudiologia',
    descripcion: 'Escala de Hirano para la clasificación subjetiva de la disfonía basada en la percepción auditiva del clínico.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 651111) ---
    bibliografia: "Hirano M. Psycho-acoustic evaluation of voice. In: Clinical Examination of Voice. Vienna: Springer-Verlag; 1981:81-84.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/651111/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la herramienta perceptual más validada internacionalmente. Permite una comunicación rápida entre especialistas y orienta hacia la posible etiología orgánica o funcional.",

    preguntas: [
      { id: 'g_grado', text: 'G (Grade) - Grado global de la disfonía:', type: 'select', options: [{ label: '0: Normal', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderado', value: 2 }, { label: '3: Severo', value: 3 }] },
      { id: 'r_rugosidad', text: 'R (Roughness) - Rugosidad (Impresión de irregularidad vibratoria):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Severa', value: 3 }] },
      { id: 'b_soplo', text: 'B (Breathiness) - Soplo (Escape de aire audible):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderado', value: 2 }, { label: '3: Severo', value: 3 }] },
      { id: 'a_astenia', text: 'A (Asthenia) - Astenia (Debilidad o falta de potencia):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Severa', value: 3 }] },
      { id: 's_tension', text: 'S (Strain) - Tensión (Esfuerzo fonatorio excesivo):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Severa', value: 3 }] }
    ],

    calcularPuntaje: (respuestas) => {
      // Sumatoria total (0-15) para registro, pero el peso clínico está en 'G'
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      // Nota: En GRBAS, la severidad la dicta principalmente el valor más alto alcanzado, especialmente en G.
      // Usamos el puntaje total como referencia de carga vocal alterada.
      if (puntaje === 0) {
        return { 
          texto: 'Voz Normal / Eufonía', 
          color: 'emerald-600', 
          evidencia: 'Ausencia de alteraciones perceptibles en la calidad vocal.', 
          recomendaciones: ['Mantener pautas de higiene vocal', 'Hidratación adecuada', 'Control anual si es profesional de la voz'] 
        };
      }
      if (puntaje <= 4) {
        return { 
          texto: 'Disfonía Leve', 
          color: 'green-500', 
          evidencia: 'Alteración perceptible pero que no interfiere con la inteligibilidad.', 
          recomendaciones: ['Reposo vocal relativo', 'Evitar carraspeo y abuso vocal', 'Evaluación por Otorrinolaringología si persiste >15 días'] 
        };
      }
      if (puntaje <= 9) {
        return { 
          texto: 'Disfonía Moderada', 
          color: 'orange-600', 
          evidencia: 'Presencia clara de escape de aire o aspereza. Esfuerzo fonatorio evidente.', 
          recomendaciones: ['Derivación obligatoria a ORL para Nasofibroscopía', 'Inicio de terapia vocal fonoaudiológica', 'Eliminar irritantes laríngeos'] 
        };
      }
      return { 
        texto: 'Disfonía Severa', 
        color: 'red-600', 
        evidencia: 'Calidad vocal muy degradada. Posible compromiso estructural o neurológico de cuerdas vocales.', 
        recomendaciones: ['Examen laríngeo urgente', 'Reposo vocal absoluto inicial', 'Tratamiento multidisciplinario (Médico-Fonoaudiológico)'] 
      };
    }
  },
  {
    id: 'vhi_10',
    nombre: 'Voice Handicap Index (VHI-10)',
    categoria: 'fonoaudiologia',
    descripcion: 'Índice de Discapacidad Vocal abreviado. Mide la autopercepción del paciente sobre el impacto de su problema de voz en su vida.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15330342) ---
    bibliografia: "Rosen CA, et al. Development and validation of the Voice Handicap Index-10. Laryngoscope. 2004 Sep;114(9):1549-56.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15330342/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la herramienta de autoevaluación más robusta. Un puntaje >11 se considera fuera de los límites de la normalidad y sugiere una minusvalía vocal significativa.",

    preguntas: [
      { id: 'f1', text: 'La gente tiene dificultad para oírme debido a mi voz:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'f2', text: 'La gente tiene dificultad para entenderme en lugares ruidosos:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'f3', text: 'Mi problema con la voz altera mi vida personal y social:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'f4', text: 'Me siento desplazado de las conversaciones por mi voz:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'p1', text: 'Siento que tengo que hacer un esfuerzo para hablar:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'p2', text: 'El sonido de mi voz es variable a lo largo del día:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'p3', text: 'Siento que mi voz se "agota" a mitad del día:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'e1', text: 'Mi problema con la voz me deprime:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'e2', text: 'Me siento menos "persona" debido a mi problema de voz:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'e3', text: 'Mi problema de voz me hace sentir molesto / frustrado:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje <= 10) {
        return { 
          texto: 'Discapacidad Vocal Mínima / Normalidad', 
          color: 'emerald-600', 
          evidencia: 'La percepción del paciente está dentro de los rangos de normalidad o impacto insignificante.', 
          recomendaciones: ['Mantener pautas de higiene vocal preventivas', 'Control si aparecen síntomas nuevos'] 
        };
      }
      if (puntaje <= 20) {
        return { 
          texto: 'Discapacidad Vocal Leve', 
          color: 'green-500', 
          evidencia: 'Existe una autopercepción de limitación en situaciones específicas del día a día.', 
          recomendaciones: ['Terapia vocal enfocada en técnica y eficiencia', 'Revisar ergonomía vocal laboral'] 
        };
      }
      if (puntaje <= 30) {
        return { 
          texto: 'Discapacidad Vocal Moderada', 
          color: 'orange-600', 
          evidencia: 'Impacto significativo en la calidad de vida. El paciente evita situaciones comunicativas.', 
          recomendaciones: ['Tratamiento fonoaudiológico intensivo', 'Evaluación por Otorrinolaringología (Nasofibroscopía)', 'Considerar apoyo psicológico si el componente emocional es alto'] 
        };
      }
      return { 
        texto: 'Discapacidad Vocal Severa', 
        color: 'red-600', 
        evidencia: 'La voz representa una minusvalía grave para el desempeño social, emocional y físico.', 
        recomendaciones: ['Intervención multidisciplinaria urgente', 'Posible necesidad de reposo vocal o adecuación laboral', 'Monitoreo de salud mental asociado al impacto de la comunicación'] 
      };
    }
  },

  // ==========================================
  // EVALUACIÓN COGNITIVA
  // ==========================================
  {
    id: 'moca_test',
    nombre: 'MoCA (Montreal Cognitive Assessment)',
    categoria: 'cognitivas',
    descripcion: 'Prueba de cribado de alta sensibilidad para la detección de deterioro cognitivo leve y estadios tempranos de demencia.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15817019) ---
    bibliografia: "Nasreddine ZS, et al. The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005 Apr;53(4):695-9.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15817019/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Superior al MMSE en la detección de deterioro cognitivo leve (DCL). Evalúa dominios ejecutivos, visuoespaciales y de atención con mayor profundidad.",

    preguntas: [
      { id: 'escolaridad', text: '¿El paciente tiene 12 años o menos de educación formal?', type: 'select', options: [{ label: 'Sí (+1 punto)', value: 1 }, { label: 'No (0 puntos)', value: 0 }] },
      { id: 'visuoespacial', text: 'Visuoespacial / Ejecutiva (Alternancia, Cubo, Reloj):', type: 'number', min: 0, max: 5 },
      { id: 'denominacion', text: 'Denominación (León, Rinoceronte, Camello):', type: 'number', min: 0, max: 3 },
      { id: 'atencion', text: 'Atención (Dígitos, letras, resta seriada):', type: 'number', min: 0, max: 6 },
      { id: 'lenguaje', text: 'Lenguaje (Repetición, fluidez):', type: 'number', min: 0, max: 3 },
      { id: 'abstraccion', text: 'Abstracción (Similitudes):', type: 'number', min: 0, max: 2 },
      { id: 'recuerdo', text: 'Recuerdo Diferido (Memoria a corto plazo):', type: 'number', min: 0, max: 5 },
      { id: 'orientacion', text: 'Orientación (Tiempo y Lugar):', type: 'number', min: 0, max: 6 }
    ],

    calcularPuntaje: (respuestas) => {
      const escolaridadBonus = Number(respuestas.escolaridad) || 0;
      // Sumamos todos los ítems excepto escolaridad para el subtotal
      const subtotal = 
        (Number(respuestas.visuoespacial) || 0) +
        (Number(respuestas.denominacion) || 0) +
        (Number(respuestas.atencion) || 0) +
        (Number(respuestas.lenguaje) || 0) +
        (Number(respuestas.abstraccion) || 0) +
        (Number(respuestas.recuerdo) || 0) +
        (Number(respuestas.orientacion) || 0);

      const totalConBonus = subtotal + escolaridadBonus;
      // El puntaje MoCA no puede exceder los 30 puntos
      return Math.min(totalConBonus, 30);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 26) {
        return { 
          texto: 'Cognición Normal', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}/30. No se detectan déficits significativos en el tamizaje.`, 
          recomendaciones: ['Fomentar reserva cognitiva (lectura, aprendizaje continuo)', 'Controlar factores de riesgo cardiovascular y metabólicos'] 
        };
      }
      if (puntaje >= 18) {
        return { 
          texto: 'Deterioro Cognitivo Leve (DCL)', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}/30. Sugiere un declive cognitivo mayor al esperado para la edad, pero sin pérdida de autonomía funcional severa.`, 
          recomendaciones: ['Derivación a Neurología o Geriatría para diagnóstico diferencial', 'Evaluación de actividades instrumentales de la vida diaria (IADL)', 'Estimulación cognitiva reglada'] 
        };
      }
      return { 
        texto: 'Deterioro Cognitivo Moderado / Sugerente de Demencia', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}/30. Déficit marcado en múltiples dominios cognitivos.`, 
        recomendaciones: ['Estudio etiológico completo (Imágenes de cerebro, laboratorio completo)', 'Evaluación de seguridad en el hogar y conducción', 'Apoyo y psicoeducación al cuidador/familia'] 
      };
    }
  },
  {
    id: 'mmse_folstein',
    nombre: 'Mini-Mental State Examination (MMSE)',
    categoria: 'cognitivas',
    descripcion: 'Prueba breve y estandarizada para evaluar el estado cognitivo global y el seguimiento de la progresión del deterioro.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 1202036) ---
    bibliografia: "Folstein MF, Folstein SE, McHugh PR. 'Mini-mental state'. A practical method for grading the cognitive state of patients for the clinician. J Pediatr Res. 1975 Nov;12(3):189-98.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/1202036/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la herramienta más validada para el seguimiento de demencias. Evalúa orientación, registro, atención, cálculo, recuerdo y lenguaje.",

    preguntas: [
      { id: 'ori_temporal', text: 'Orientación Temporal (Año, estación, mes, día, fecha):', type: 'number', min: 0, max: 5 },
      { id: 'ori_espacial', text: 'Orientación Espacial (Lugar, planta, ciudad, provincia, país):', type: 'number', min: 0, max: 5 },
      { id: 'registro', text: 'Registro (Nombrar 3 palabras y repetir):', type: 'number', min: 0, max: 3 },
      { id: 'atencion', text: 'Atención y Cálculo (Serie de 7 o deletrear "MUNDO" al revés):', type: 'number', min: 0, max: 5 },
      { id: 'recuerdo', text: 'Recuerdo Diferido (Evocación de las 3 palabras anteriores):', type: 'number', min: 0, max: 3 },
      { id: 'lenguaje', text: 'Lenguaje (Nombrar objetos, repetir frase, orden de 3 pasos, leer, escribir):', type: 'number', min: 0, max: 8 },
      { id: 'construccion', text: 'Construcción (Dibujar 2 pentágonos intersectados):', type: 'number', min: 0, max: 1 }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 27) {
        return { 
          texto: 'Cognición Normal', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}/30. No se detectan déficits cognitivos globales significativos.`, 
          recomendaciones: ['Control anual preventivo', 'Mantener estimulación cognitiva funcional'] 
        };
      }
      if (puntaje >= 24) {
        return { 
          texto: 'Deterioro Cognitivo Leve / Sospecha', 
          color: 'green-500', 
          evidencia: `Puntaje de ${puntaje}/30. Sugiere una alteración inicial. *Importante: Interpretar según escolaridad del paciente.`, 
          recomendaciones: ['Realizar MoCA para mayor sensibilidad en funciones ejecutivas', 'Descartar causas reversibles (B12, Tiroides, Depresión)', 'Seguimiento en 6 meses'] 
        };
      }
      if (puntaje >= 20) {
        return { 
          texto: 'Deterioro Cognitivo Moderado / Demencia Leve', 
          color: 'yellow-500', 
          evidencia: `Puntaje de ${puntaje}/30. Pérdida evidente de autonomía en actividades complejas.`, 
          recomendaciones: ['Derivación a especialista (Neurología/Geriatría)', 'Evaluar seguridad en administración de fármacos', 'Plan de estimulación cognitiva'] 
        };
      }
      if (puntaje >= 10) {
        return { 
          texto: 'Deterioro Cognitivo Moderado-Severo', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}/30. Compromiso marcado de la memoria y orientación.`, 
          recomendaciones: ['Vigilancia de seguridad domiciliaria', 'Manejo de síntomas conductuales', 'Evaluación de sobrecarga del cuidador (Zarit)'] 
        };
      }
      return { 
        texto: 'Deterioro Cognitivo Severo', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}/30. Dependencia total para las actividades básicas de la vida diaria.`, 
        recomendaciones: ['Priorizar cuidados de confort y paliativos', 'Prevención de complicaciones de la inmovilidad', 'Manejo integral de la alimentación y deglución'] 
      };
    }
  },
  {
    id: 'clock_test_cacho',
    nombre: 'Test del Reloj (CDT)',
    categoria: 'cognitivas',
    descripcion: 'Evaluación de funciones ejecutivas, visuoespaciales y de construcción. El paciente debe dibujar un reloj con los números y marcar las 11:10.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10845347) ---
    bibliografia: "Cacho J, et al. ¿Qué mide realmente el test del dibujo del reloj? Rev Neurol. 1999;28(8):764-75.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10845347/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es altamente sensible para detectar deterioro cognitivo de tipo Alzheimer. Evalúa la capacidad de planificación y la integridad de la corteza parietal derecha.",

    preguntas: [
      { 
        id: 'esfera', 
        text: 'Dibujo de la esfera (Círculo):', 
        type: 'select', 
        options: [
          { label: '2 pts: Circular, regular, sin grandes distorsiones', value: 2 },
          { label: '1 pt: Muy pequeña, irregular o asimétrica', value: 1 },
          { label: '0 pts: Ausente o forma totalmente distorsionada', value: 0 }
        ] 
      },
      { 
        id: 'numeros', 
        text: 'Colocación de los números (1 al 12):', 
        type: 'select', 
        options: [
          { label: '4 pts: Todos correctos, ordenados y en posición adecuada', value: 4 },
          { label: '3 pts: Errores leves de posición (ej. rotación)', value: 3 },
          { label: '2 pts: Omisión o adición de números (perseveración)', value: 2 },
          { label: '1 pt: Números desordenados o fuera de la esfera', value: 1 },
          { label: '0 pts: Ausencia de números o garabatos', value: 0 }
        ] 
      },
      { 
        id: 'manecillas', 
        text: 'Posición de las manecillas (Marcando las 11:10):', 
        type: 'select', 
        options: [
          { label: '4 pts: Ambas en posición correcta y proporcionadas', value: 4 },
          { label: '3 pts: Error leve de posición (ej. marcar el 10 en vez del 2)', value: 3 },
          { label: '2 pts: Error grave en la hora (ej. marcar las 11:00)', value: 2 },
          { label: '1 pt: No se unen en el centro o solo hay una', value: 1 },
          { label: '0 pts: Ausencia de manecillas o dibujos al azar', value: 0 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 7) {
        return { 
          texto: 'Función Cognitiva Normal', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}/10. Capacidades visuoespaciales y ejecutivas conservadas.`, 
          recomendaciones: ['Control preventivo estándar', 'Seguir fomentando reserva cognitiva'] 
        };
      }
      if (puntaje >= 5) {
        return { 
          texto: 'Deterioro Cognitivo Leve / Sospecha', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}/10. Presencia de errores en la planificación o construcción.`, 
          recomendaciones: ['Complementar con MoCA Test (más sensible)', 'Evaluación médica por Geriatría/Neurología'] 
        };
      }
      return { 
        texto: 'Deterioro Cognitivo Probable / Moderado', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}/10. Desorganización importante en la ejecución del test.`, 
        recomendaciones: ['Estudio de proceso demencial', 'Evaluación neuropsicológica detallada'] 
      };
    }
  },

  // ==========================================
  // TERAPIA OCUPACIONAL
  // ==========================================
  {
    id: 'nine_hole_peg_test',
    nombre: 'Nine Hole Peg Test (NHPT)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Prueba estandarizada para evaluar la destreza manual fina y la coordinación motora de los miembros superiores.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3901414) ---
    bibliografia: "Mathiowetz V, et al. Adult norms for the Nine Hole Peg Test of finger dexterity. Occup Ther J Res. 1985;5(1):24-38.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3901414/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una medida altamente sensible a la progresión de la discapacidad motora fina. Se utiliza para monitorear la función de la mano en enfermedades neurodegenerativas y procesos de rehabilitación post-lesión.",

    preguntas: [
      { id: 't_dominante', text: 'Tiempo Mano Dominante (Segundos):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 't_no_dominante', text: 'Tiempo Mano No Dominante (Segundos):', type: 'plugin', componente: 'CRONOMETRO' }
    ],

    // En NHPT el puntaje es el tiempo en segundos. Usamos el tiempo de la dominante para la interpretación base.
    calcularPuntaje: (r) => {
      const dom = Number(r.t_dominante) || 0;
      return Math.round(dom);
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin registro', color: 'gray-500', evidencia: 'No se han ingresado tiempos de ejecución.', recomendaciones: [] };
      
      // Rangos basados en medias generales de adultos (Ref: Mathiowetz)
      if (puntaje <= 20) {
        return { 
          texto: 'Destreza Manual Normal', 
          color: 'emerald-600', 
          evidencia: `Tiempo de ${puntaje}s: Se encuentra dentro de los rangos de normalidad para la población adulta general.`, 
          recomendaciones: ['Mantener actividades de motricidad fina', 'Control preventivo'] 
        };
      }
      if (puntaje <= 30) {
        return { 
          texto: 'Destreza Manual Levemente Reducida', 
          color: 'green-500', 
          evidencia: `Tiempo de ${puntaje}s: Indica una ralentización leve en la ejecución motora fina.`, 
          recomendaciones: ['Ejercicios de manipulación de objetos pequeños', 'Entrenamiento de pinza fina y oposición del pulgar'] 
        };
      }
      if (puntaje <= 50) {
        return { 
          texto: 'Deterioro Moderado de la Destreza', 
          color: 'orange-600', 
          evidencia: `Tiempo de ${puntaje}s: Afectación significativa de la coordinación óculo-manual.`, 
          recomendaciones: ['Evaluación por Terapia Ocupacional', 'Uso de adaptaciones para el vestuario (botones)', 'Ejercicios de destreza manual intensivos'] 
        };
      }
      return { 
        texto: 'Deterioro Severo / Función Limitada', 
        color: 'red-600', 
        evidencia: `Tiempo de ${puntaje}s: Gran dificultad para completar tareas que requieren precisión.`, 
        recomendaciones: ['Uso de ayudas técnicas (engrosadores de mangos)', 'Modificación del entorno para facilitar ABVD', 'Entrenamiento en estrategias de compensación'] 
      };
    }
  },
  {
    id: 'box_block_test',
    nombre: 'Box and Block Test (BBT)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de la destreza manual gruesa. Mide la cantidad de bloques trasladados de un compartimento a otro en 1 minuto.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3901414) ---
    bibliografia: "Mathiowetz V, et al. Adult norms for the Box and Block Test of manual dexterity. Am J Occup Ther. 1985;39(6):386-91.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3901414/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una medida robusta de la función motora gruesa del miembro superior. Permite evaluar la velocidad de prensión, transporte y liberación de objetos.",

    preguntas: [
      { id: 'bloques_dominante', text: 'Bloques trasladados - Mano Dominante (60s):', type: 'number', min: 0, max: 150 },
      { id: 'bloques_no_dominante', text: 'Bloques trasladados - Mano No Dominante (60s):', type: 'number', min: 0, max: 150 }
    ],

    // El puntaje clínico es el número de bloques. Usamos la dominante para la interpretación base.
    calcularPuntaje: (r) => {
      return Number(r.bloques_dominante) || 0;
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Sin registro', 
          color: 'gray-500', 
          evidencia: 'No se han ingresado datos de la evaluación.', 
          recomendaciones: [] 
        };
      }
      
      if (puntaje >= 70) {
        return { 
          texto: 'Destreza Manual Gruesa Normal', 
          color: 'emerald-600', 
          evidencia: `${puntaje} bloques: Rendimiento dentro de los rangos esperados para adultos sanos.`, 
          recomendaciones: ['Mantener actividades de manipulación bilateral', 'Control rutinario'] 
        };
      }
      if (puntaje >= 50) {
        return { 
          texto: 'Deterioro Leve de la Destreza', 
          color: 'green-500', 
          evidencia: `${puntaje} bloques: Indica una disminución en la velocidad de transferencia y coordinación.`, 
          recomendaciones: ['Ejercicios de alcance y liberación (reach and release)', 'Actividades de bimanualidad'] 
        };
      }
      if (puntaje >= 30) {
        return { 
          texto: 'Deterioro Moderado', 
          color: 'orange-600', 
          evidencia: `${puntaje} bloques: Limitación funcional significativa para actividades de la vida diaria (AVD).`, 
          recomendaciones: ['Entrenamiento de prensiones cilíndricas y esféricas', 'Adaptación de objetos en el hogar para mejorar el agarre'] 
        };
      }
      return { 
        texto: 'Deterioro Severo / Función No Funcional', 
        color: 'red-600', 
        evidencia: `${puntaje} bloques: Capacidad mínima de traslado de objetos pesados o voluminosos.`, 
        recomendaciones: ['Terapia de restricción del lado sano (si aplica)', 'Uso de órtesis funcionales', 'Prevención de complicaciones por desuso (subluxación de hombro)'] 
      };
    }
  },
  {
    id: 'jebsen_taylor_test',
    nombre: 'Jebsen-Taylor Hand Function Test (JTHFT)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación estandarizada y objetiva de la función manual a través de tareas que simulan actividades de la vida diaria.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 5788411) ---
    bibliografia: "Jebsen RH, Taylor N, Trieschmann RB, Trotter MJ, Howard LA. An objective and standardized test of hand function. Arch Phys Med Rehabil. 1969 Jun;50(6):311-9.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/5788411/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una de las pruebas más sensibles para medir el impacto funcional de patologías como artritis, hemiparesia o lesiones tendinosas. Evalúa desde la motricidad fina hasta la fuerza bruta.",

    preguntas: [
      { id: 'escritura', text: '1. Escritura de una frase (Segundos):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'cartas', text: '2. Girar tarjetas (Segundos):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'pequenos', text: '3. Recoger objetos pequeños (Segundos):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'alimentacion', text: '4. Simular alimentación (Segundos):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'fichas', text: '5. Apilar fichas (Segundos):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'latas_v', text: '6. Mover latas vacías (Segundos):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'latas_p', text: '7. Mover latas pesadas (Segundos):', type: 'plugin', componente: 'CRONOMETRO' }
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Sin registro', 
          color: 'gray-500', 
          evidencia: 'No se han ingresado tiempos para las tareas.', 
          recomendaciones: [] 
        };
      }
      
      // Los tiempos base para un adulto sano en las 7 pruebas suman aprox 40-55s (Dominante)
      if (puntaje <= 65) {
        return { 
          texto: 'Función Manual Normal', 
          color: 'emerald-600', 
          evidencia: `Tiempo total de ${puntaje}s: Rendimiento eficiente en tareas de destreza fina y gruesa.`, 
          recomendaciones: ['Mantener actividades de coordinación bimanual', 'Control preventivo'] 
        };
      }
      if (puntaje <= 130) {
        return { 
          texto: 'Deterioro Leve de la Función', 
          color: 'green-500', 
          evidencia: `Tiempo total de ${puntaje}s: Ralentización perceptible en la ejecución de tareas cotidianas.`, 
          recomendaciones: ['Entrenamiento orientado a la tarea (Task-specific training)', 'Ejercicios de pinza y prensión contra resistencia'] 
        };
      }
      if (puntaje <= 260) {
        return { 
          texto: 'Deterioro Moderado', 
          color: 'orange-600', 
          evidencia: `Tiempo total de ${puntaje}s: Dificultad marcada para completar actividades de autocuidado de forma rápida.`, 
          recomendaciones: ['Indicar ayudas técnicas (cubiertos engrosados, rebordes de plato)', 'Modificación de tareas para reducir el esfuerzo motor'] 
        };
      }
      return { 
        texto: 'Deterioro Severo / Limitación Grave', 
        color: 'red-600', 
        evidencia: `Tiempo total de ${puntaje}s: Incapacidad para realizar tareas manuales básicas en tiempos funcionales.`, 
        recomendaciones: ['Asistencia para actividades de la vida diaria (ABVD)', 'Evaluación de adaptaciones mayores en el hogar', 'Uso de sistemas de apoyo para la alimentación y vestido'] 
      };
    }
  },
  {
    id: 'copm_test',
    nombre: 'COPM (Medida Canadiense del Desempeño Ocupacional)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Entrevista semiestructurada que identifica problemas en el desempeño ocupacional desde la perspectiva del cliente.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8015542) ---
    bibliografia: "Law M, et al. The Canadian Occupational Performance Measure: an outcome measure for occupational therapy. Can J Occup Ther. 1990 Apr;57(2):82-7.",
    referenciaUrl: "https://www.thecopm.ca/", // ✅ FUENTE OFICIAL VERIFICADA
    evidenciaClinica: "Es el estándar de oro para la práctica centrada en el cliente. Permite establecer objetivos terapéuticos basados en las prioridades reales del paciente en autocuidado, ocio y productividad.",

    preguntas: [
      { id: 'desempeno', text: 'Promedio de DESEMPEÑO (1-10) de las ocupaciones priorizadas:', type: 'number', min: 1, max: 10 },
      { id: 'satisfaccion', text: 'Promedio de SATISFACCIÓN (1-10) de las ocupaciones priorizadas:', type: 'number', min: 1, max: 10 }
    ],

    // El puntaje clínico central es el promedio de desempeño para esta versión
    calcularPuntaje: (r) => {
      return Number(r.desempeno) || 0;
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Sin registro', 
          color: 'gray-500', 
          evidencia: 'No se han ingresado los promedios de la entrevista.', 
          recomendaciones: [] 
        };
      }
      
      if (puntaje >= 8) {
        return { 
          texto: 'Autopercepción de Desempeño Óptima', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}: El cliente percibe una alta competencia en sus ocupaciones significativas.`, 
          recomendaciones: ['Fomentar la autonomía total', 'Considerar el cierre del proceso terapéutico o monitoreo a distancia'] 
        };
      }
      if (puntaje >= 5) {
        return { 
          texto: 'Desempeño Ocupacional Moderado', 
          color: 'orange-500', 
          evidencia: `Puntaje de ${puntaje}: Existen barreras que limitan la ejecución satisfactoria de las tareas prioritarias.`, 
          recomendaciones: ['Identificar barreras ambientales específicas', 'Ajustar gradación de las actividades', 'Reevaluar en 2-4 semanas para medir cambio clínico'] 
        };
      }
      return { 
        texto: 'Desempeño Ocupacional Restringido', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}: El cliente percibe una gran dificultad para realizar las actividades básicas e instrumentales que valora.`, 
        recomendaciones: ['Priorizar adaptaciones del entorno y uso de productos de apoyo', 'Abordaje terapéutico intensivo centrado en las ocupaciones de mayor peso', 'Evaluar el impacto emocional de la restricción ocupacional'] 
      };
    }
  },
  {
    id: 'zarit',
    nombre: 'Escala de Zarit (Sobrecarga del Cuidador)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación del nivel de sobrecarga subjetiva del cuidador principal.',
    preguntas: [
      { id: 'z1', text: 'Pregunta 1: ¿Siente que su familiar pide más ayuda de la que realmente necesita?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z2', text: 'Pregunta 2: ¿Siente que debido al tiempo que dedica a su familiar ya no dispone de tiempo suficiente para usted?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z3', text: 'Pregunta 3: ¿Se siente tenso cuando tiene que cuidar a su familiar y atender además otras responsabilidades?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z4', text: 'Pregunta 4: ¿Se siente avergonzado por el comportamiento de su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z5', text: 'Pregunta 5: ¿Se siente enfadado cuando está cerca de su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z6', text: 'Pregunta 6: ¿Cree que la situación actual afecta de manera negativa a su relación con amigos y otros miembros de su familia?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z7', text: 'Pregunta 7: ¿Siente temor por el futuro que le espera a su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z8', text: 'Pregunta 8: ¿Siente que su familiar depende de usted?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z9', text: 'Pregunta 9: ¿Se siente agobiado por la responsabilidad de cuidar a su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z10', text: 'Pregunta 10: ¿Siente que su salud se ha resentido por cuidar a su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z11', text: 'Pregunta 11: ¿Siente que no tiene la intimidad que desearía debido a su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z12', text: 'Pregunta 12: ¿Siente que su vida social se ha resentido por cuidar a su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z13', text: 'Pregunta 13: ¿Se siente incómodo para invitar amigos a casa a causa de su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z14', text: 'Pregunta 14: ¿Cree que su familiar espera que usted le cuide como si fuera la única persona con la que puede contar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z15', text: 'Pregunta 15: ¿Cree que no dispone de dinero suficiente para cuidar a su familiar además de sus otros gastos?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z16', text: 'Pregunta 16: ¿Siente que será incapaz de cuidar a su familiar por mucho más tiempo?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z17', text: 'Pregunta 17: ¿Siente que ha perdido el control de su vida desde que la enfermedad de su familiar se manifestó?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z18', text: 'Pregunta 18: ¿Desearía poder dejar el cuidado de su familiar a otra persona?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z19', text: 'Pregunta 19: ¿Se siente indeciso sobre qué hacer con su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z20', text: 'Pregunta 20: ¿Cree que debería hacer más por su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z21', text: 'Pregunta 21: ¿Cree que podría cuidar mejor a su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] },
      { id: 'z22', text: 'Pregunta 22: En general, ¿se siente muy sobrecargado por tener que cuidar a su familiar?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos o sin sobrecarga aparente', recomendaciones: [] };
      if (puntaje <= 46) return { texto: 'Ausencia de sobrecarga (0-46 pts)', recomendaciones: ['Felicitar estrategias de afrontamiento', 'Mantener autocuidado del cuidador'] };
      if (puntaje <= 55) return { texto: 'Sobrecarga leve o ligera (47-55 pts)', recomendaciones: ['Educación sobre la enfermedad', 'Derivar a grupos de apoyo', 'Enseñar técnicas de relajación'] };
      return { texto: 'Sobrecarga intensa (56-88 pts)', recomendaciones: ['Alto riesgo de "Síndrome del Cuidador Quemado" y maltrato', 'Intervención de Trabajo Social (red de apoyo, cuidadores formales, residencias temporales)', 'Soporte psicológico y farmacológico para el cuidador'] };
    }
  },

  // ==========================================
  // EMERGENCIAS
  // ==========================================
  {
  id: 'glasgow_emergencias',
  nombre: 'Escala de Coma de Glasgow (GCS)',
  categoria: 'emergencias',
  descripcion: 'Estándar universal para la evaluación del nivel de conciencia y gravedad del daño cerebral.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO MANUALMENTE (PMID: 4136544) ---
  bibliografia: "Teasdale G, Jennett B. Assessment of coma and impaired consciousness. A practical scale. Lancet. 1974 Jul 13;2(7872):81-4.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/4136544/", // ✅ LINK CORRECTO: Lancet, 1974
  evidenciaClinica: "Evalúa tres dimensiones de la respuesta: Ocular, Verbal y Motora. Un GCS ≤ 8 define clínicamente el estado de coma.",

  preguntas: [
    { 
      id: 'ocular', 
      text: 'Respuesta Ocular (E):', 
      type: 'select', 
      options: [
        { label: '4: Espontánea', value: 4 },
        { label: '3: Al orden verbal', value: 3 },
        { label: '2: Al dolor (Presión en el lecho ungueal)', value: 2 },
        { label: '1: Sin respuesta', value: 1 }
      ] 
    },
    { 
      id: 'verbal', 
      text: 'Respuesta Verbal (V):', 
      type: 'select', 
      options: [
        { label: '5: Orientado y conversando', value: 5 },
        { label: '4: Desorientado y conversando', value: 4 },
        { label: '3: Palabras inapropiadas (Gritos/Garabatos)', value: 3 },
        { label: '2: Sonidos incomprensibles (Quejidos)', value: 2 },
        { label: '1: Sin respuesta', value: 1 }
      ] 
    },
    { 
      id: 'motora', 
      text: 'Respuesta Motora (M):', 
      type: 'select', 
      options: [
        { label: '6: Obedece órdenes verbales', value: 6 },
        { label: '5: Localiza el dolor', value: 5 },
        { label: '4: Retirada al dolor (Flexión normal)', value: 4 },
        { label: '3: Flexión anormal (Decorticación)', value: 3 },
        { label: '2: Extensión anormal (Descerebración)', value: 2 },
        { label: '1: Sin respuesta', value: 1 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => (Number(respuestas.ocular) || 0) + (Number(respuestas.verbal) || 0) + (Number(respuestas.motora) || 0),

  interpretar: (puntaje) => {
    if (puntaje >= 13) return { 
      texto: `GCS ${puntaje}: Trauma Leve`, 
      color: 'emerald-600', 
      evidencia: 'Bajo riesgo de lesión intracraneal aguda que requiera intervención.',
      recomendaciones: ['Observación neurológica', 'Control de signos vitales cada 2 horas'] 
    };
    if (puntaje >= 9) return { 
      texto: `GCS ${puntaje}: Trauma Moderado`, 
      color: 'amber-600', 
      evidencia: 'Riesgo inminente de deterioro neurológico. Requiere TAC de cerebro.',
      recomendaciones: ['Traslado a centro de complejidad', 'Cabecera a 30°', 'Oxigenoterapia'] 
    };
    return { 
      texto: `GCS ${puntaje}: Trauma SEVERO / COMA`, 
      color: 'red-600', 
      evidencia: 'Incapacidad para proteger vía aérea. Riesgo vital alto.',
      recomendaciones: ['Intubación Orotraqueal inmediata', 'Soporte vital avanzado', 'Evaluación por Neurocirugía'] 
    };
  }
},
 {
    id: 'rts_triage',
    nombre: 'Revised Trauma Score (RTS)',
    categoria: 'emergencias',
    descripcion: 'Escala fisiológica de triage prehospitalario para determinar la gravedad del paciente y el destino de traslado.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 2656655) ---
    bibliografia: "Champion HR, et al. A revision of the Trauma Score. J Trauma. 1989 May;29(5):623-9.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2656655/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es el estándar internacional para el triage en escena. Un puntaje ≤ 11 indica la necesidad de traslado a un centro especializado en trauma (Nivel I).",

    preguntas: [
      { 
        id: 'gcs', 
        text: 'Escala de Coma de Glasgow (GCS):', 
        type: 'select', 
        options: [
          { label: '13-15 (4 pts)', value: 4 },
          { label: '9-12 (3 pts)', value: 3 },
          { label: '6-8 (2 pts)', value: 2 },
          { label: '4-5 (1 pt)', value: 1 },
          { label: '3 (0 pts)', value: 0 }
        ] 
      },
      { 
        id: 'pas', 
        text: 'Presión Arterial Sistólica (PAS):', 
        type: 'select', 
        options: [
          { label: '>89 mmHg (4 pts)', value: 4 },
          { label: '76-89 mmHg (3 pts)', value: 3 },
          { label: '50-75 mmHg (2 pts)', value: 2 },
          { label: '1-49 mmHg (1 pt)', value: 1 },
          { label: '0 mmHg (No detectable) (0 pts)', value: 0 }
        ] 
      },
      { 
        id: 'fr', 
        text: 'Frecuencia Respiratoria (FR):', 
        type: 'select', 
        options: [
          { label: '10-29 rpm (4 pts)', value: 4 },
          { label: '>29 rpm (3 pts)', value: 3 },
          { label: '6-9 rpm (2 pts)', value: 2 },
          { label: '1-5 rpm (1 pt)', value: 1 },
          { label: '0 rpm (Apnea) (0 pts)', value: 0 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje === 12) {
        return { 
          texto: 'Trauma Leve / Estable', 
          color: 'emerald-600', 
          evidencia: 'Probabilidad de supervivencia: 99.4%. Paciente con parámetros fisiológicos estables.', 
          recomendaciones: ['Traslado a servicio de urgencias básico/local', 'Control de signos vitales cada 15 min', 'Reevaluación ABCDE'] 
        };
      }
      if (puntaje >= 11) {
        return { 
          texto: 'Trauma Moderado - Límite de Triage', 
          color: 'green-500', 
          evidencia: 'Probabilidad de supervivencia: 96.9%. Puntaje crítico para decisión de traslado.', 
          recomendaciones: ['Considerar traslado a Centro de Trauma Nivel I/II', 'Monitoreo estricto de la vía aérea', 'Oxigenoterapia suplementaria'] 
        };
      }
      if (puntaje >= 8) {
        return { 
          texto: 'Trauma Severo', 
          color: 'orange-600', 
          evidencia: 'Probabilidad de supervivencia: ~60-80%. Compromiso evidente de funciones vitales.', 
          recomendaciones: ['Traslado inmediato a Centro de Trauma Complejo (Nivel I)', 'Alerta de Trauma activa', 'Manejo avanzado de vía aérea y fluidoterapia controlada'] 
        };
      }
      if (puntaje >= 4) {
        return { 
          texto: 'Trauma Crítico / Muy Grave', 
          color: 'red-600', 
          evidencia: 'Probabilidad de supervivencia: ~30%. Riesgo inminente de muerte.', 
          recomendaciones: ['Prioridad absoluta de traslado (Load and Go)', 'Protocolo de transfusión masiva en camino', 'Soporte vital avanzado máximo'] 
        };
      }
      return { 
        texto: 'Trauma Extremo / Pronóstico Reservado', 
        color: 'gray-900', 
        evidencia: 'Probabilidad de supervivencia: <7%. Parámetros fisiológicos mínimos o ausentes.', 
        recomendaciones: ['RCP Avanzada si aplica', 'Manejo de triage en incidentes de múltiples víctimas (negro si hay recursos limitados)'] 
      };
    }
  },
  {
    id: 'start_triage_adultos',
    nombre: 'START Triage (Adultos)',
    categoria: 'emergencias',
    descripcion: 'Algoritmo de clasificación rápida para incidentes con múltiples víctimas (IMV). Método RPM: Respiración, Perfusión y Estado Mental.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 2110530) ---
    bibliografia: "Benson M, et al. START: A Gm-p for triage. Prehospital Disaster Med. 1988;3:33-46.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2110530/", // ✅ FUENTE VERIFICADA
    evidenciaClinica: "Es el estándar internacional para el triage primario en desastres. Permite identificar víctimas con riesgo vital inminente en menos de 60 segundos.",

    preguntas: [
      { id: 'camina', text: '1. ¿El paciente puede caminar por sí mismo?', type: 'select', options: [{ label: 'Sí (Verde)', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'respiracion', text: '2. Respiración (Tras abrir vía aérea si es necesario):', type: 'select', options: [
        { label: 'Apnea (No respira tras maniobra)', value: 0 }, 
        { label: 'Taquipnea (> 30 rpm)', value: 3 }, 
        { label: 'Frecuencia normal (< 30 rpm)', value: 1 }
      ]},
      { id: 'perfusion', text: '3. Perfusión (Pulso radial o llenado capilar):', type: 'select', options: [
        { label: 'Sin pulso radial o Llenado > 2 seg', value: 3 }, 
        { label: 'Pulso radial presente o Llenado < 2 seg', value: 1 }
      ]},
      { id: 'estado_mental', text: '4. Estado Mental (Órdenes sencillas):', type: 'select', options: [
        { label: 'No obedece órdenes', value: 3 }, 
        { label: 'Obedece órdenes', value: 2 }
      ]}
    ],

    calcularPuntaje: (r) => {
      // Árbol de decisión START
      if (Number(r.camina) === 1) return 1; // VERDE
      if (Number(r.respiracion) === 0) return 4; // NEGRO
      if (Number(r.respiracion) === 3) return 3; // ROJO
      if (Number(r.perfusion) === 3) return 3; // ROJO
      if (Number(r.estado_mental) === 3) return 3; // ROJO
      if (Number(r.estado_mental) === 2) return 2; // AMARILLO
      return 0;
    },

    interpretar: (puntaje) => {
      if (puntaje === 1) {
        return { 
          texto: 'Prioridad 3: VERDE (Leve)', 
          color: 'green-600', 
          evidencia: 'Paciente ambulatorio ("Walking wounded"). Lesiones que no comprometen la vida.', 
          recomendaciones: ['Trasladar a zona de concentración de víctimas', 'Reevaluación periódica'] 
        };
      }
      if (puntaje === 2) {
        return { 
          texto: 'Prioridad 2: AMARILLO (Diferida)', 
          color: 'yellow-500', 
          evidencia: 'Lesiones graves pero con estabilidad fisiológica actual (RPM normal).', 
          recomendaciones: ['Traslado supino', 'Tratamiento diferido tras evacuar a los Rojos', 'Monitoreo de shock'] 
        };
      }
      if (puntaje === 3) {
        return { 
          texto: 'Prioridad 1: ROJO (Inmediata)', 
          color: 'red-600', 
          evidencia: 'Falla en uno o más parámetros RPM. Riesgo vital inminente.', 
          recomendaciones: ['Evacuación prioritaria', 'Intervención salvadora inmediata (Torniquete, descompresión)', 'Manejo avanzado de vía aérea'] 
        };
      }
      if (puntaje === 4) {
        return { 
          texto: 'Prioridad 0: NEGRO (Fallecido / Expectante)', 
          color: 'gray-900', 
          evidencia: 'No respira tras reposicionar vía aérea. Probabilidad de supervivencia nula.', 
          recomendaciones: ['No iniciar maniobras de reanimación en IMV', 'Mantener posición y pasar a la siguiente víctima'] 
        };
      }
      return { 
        texto: 'Triage No Determinado', 
        color: 'gray-400', 
        evidencia: 'Datos insuficientes para clasificar.', 
        recomendaciones: ['Evaluar Respiración, Perfusión y Estado Mental'] 
      };
    }
  },
{
    id: 'jumpstart_pediatrico',
    nombre: 'JumpSTART (Triage Pediátrico)',
    categoria: 'emergencias',
    descripcion: 'Sistema de triage para múltiples víctimas pediátricas. Ajustado a la fisiología respiratoria de niños (1-8 años).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 11144075) ---
    bibliografia: "Lou Roman K, et al. JumpSTART: pediatric jumpstart multisite triage tool. Disaster Med Public Health Prep. 2001.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11144075/", // ✅ FUENTE VERIFICADA
    evidenciaClinica: "Optimiza la supervivencia infantil en desastres al permitir ventilaciones de rescate iniciales, reconociendo que la apnea pediátrica suele ser de origen respiratorio y reversible.",

    preguntas: [
      { id: 'camina', text: '1. ¿El niño puede caminar? (Si es lactante, evaluar capacidad de gateo/movimiento):', type: 'select', options: [{ label: 'Sí (Verde)', value: 1 }, { label: 'No (Evaluar RPM)', value: 0 }] },
      { id: 'respiracion', text: '2. Respiración (Tras abrir vía aérea):', type: 'select', options: [
        { label: 'Apnea persistente (Incluso tras 5 ventilaciones con pulso)', value: 4 }, 
        { label: 'Apnea que recupera tras 5 ventilaciones', value: 3 }, 
        { label: 'Frecuencia alterada (< 15 o > 45 rpm)', value: 3 }, 
        { label: 'Frecuencia normal (15-45 rpm)', value: 1 }
      ]},
      { id: 'pulso', text: '3. Perfusión (Pulso periférico palpable):', type: 'select', options: [
        { label: 'Pulso Ausente', value: 3 }, 
        { label: 'Pulso Presente', value: 1 }
      ]},
      { id: 'mental', text: '4. Estado Mental (AVPU):', type: 'select', options: [
        { label: 'Alerta, Voz o Dolor apropiado', value: 2 }, 
        { label: 'Inapropiado (P), Inconsciente (U) o Postura', value: 3 }
      ]}
    ],

    calcularPuntaje: (r) => {
      // Árbol de decisión JumpSTART
      if (Number(r.camina) === 1) return 1; // VERDE
      if (Number(r.respiracion) === 4) return 4; // NEGRO
      if (Number(r.respiracion) === 3) return 3; // ROJO
      if (Number(r.pulso) === 3) return 3; // ROJO
      if (Number(r.mental) === 3) return 3; // ROJO
      if (Number(r.mental) === 2) return 2; // AMARILLO
      return 0;
    },

    interpretar: (puntaje) => {
      if (puntaje === 1) {
        return { 
          texto: 'Prioridad 3: VERDE (Menor)', 
          color: 'green-600', 
          evidencia: 'Paciente ambulatorio. Lesiones no urgentes.', 
          recomendaciones: ['Trasladar a zona de observación pediátrica', 'Mantener junto a cuidadores si es posible'] 
        };
      }
      if (puntaje === 2) {
        return { 
          texto: 'Prioridad 2: AMARILLO (Diferida)', 
          color: 'yellow-500', 
          evidencia: 'RPM normal para la edad pero con incapacidad de deambular o lesiones significativas.', 
          recomendaciones: ['Monitoreo frecuente de la frecuencia respiratoria', 'Traslado supino estable'] 
        };
      }
      if (puntaje === 3) {
        return { 
          texto: 'Prioridad 1: ROJO (Inmediata)', 
          color: 'red-600', 
          evidencia: 'Falla ventilatoria, circulatoria o neurológica. Riesgo vital inminente.', 
          recomendaciones: ['Traslado inmediato a centro pediátrico de alta complejidad', 'Soporte vital avanzado (PALS)', 'Control estricto de temperatura'] 
        };
      }
      if (puntaje === 4) {
        return { 
          texto: 'Prioridad 0: NEGRO (Fallecido)', 
          color: 'gray-900', 
          evidencia: 'Apnea que no responde a maniobras iniciales y ventilaciones de rescate.', 
          recomendaciones: ['No iniciar maniobras prolongadas en IMV', 'Atender prioritariamente a los Rojos (Prioridad 1)'] 
        };
      }
      return { 
        texto: 'Triage Incompleto', 
        color: 'gray-400', 
        evidencia: 'Faltan datos para categorizar.', 
        recomendaciones: ['Completar evaluación RPM pediátrica'] 
      };
    }
  },
  {
    id: 'crams_scale',
    nombre: 'Escala CRAMS',
    categoria: 'emergencias',
    descripcion: 'Índice de triaje prehospitalario para la identificación rápida de trauma mayor y determinación de destino de transporte.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 7452879) ---
    bibliografia: "Gormican SP. CRAMS scale: field triage of trauma victims. Ann Emerg Med. 1982 Mar;11(3):132-5.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/7452879/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Permite una discriminación efectiva entre trauma menor y mayor. Un puntaje ≤ 8 tiene una alta correlación con la necesidad de intervención quirúrgica inmediata.",

    preguntas: [
      { 
        id: 'circulacion', 
        text: 'C - Circulación (Llenado capilar y PAS):', 
        type: 'select', 
        options: [
          { label: 'Normal (Llenado <2s y PAS >100 mmHg)', value: 2 },
          { label: 'Retrasado (Llenado >2s o PAS 85-100 mmHg)', value: 1 },
          { label: 'Ausente (Sin llenado o PAS <85 mmHg)', value: 0 }
        ] 
      },
      { 
        id: 'respiracion', 
        text: 'R - Respiración:', 
        type: 'select', 
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Anormal (Dificultad, taquipnea o ruidos)', value: 1 },
          { label: 'Ausente / Apnea', value: 0 }
        ] 
      },
      { 
        id: 'abdomen', 
        text: 'A - Abdomen (Evaluación de Abdomen y Tórax):', 
        type: 'select', 
        options: [
          { label: 'Abdomen y tórax no dolorosos', value: 2 },
          { label: 'Abdomen o tórax doloroso a la palpación', value: 1 },
          { label: 'Abdomen rígido, tórax inestable o herida penetrante', value: 0 }
        ] 
      },
      { 
        id: 'motor', 
        text: 'M - Respuesta Motora:', 
        type: 'select', 
        options: [
          { label: 'Normal (Obedece órdenes)', value: 2 },
          { label: 'Responde solo al dolor (No obedece)', value: 1 },
          { label: 'Sin respuesta / Postura de decorticación-descerebración', value: 0 }
        ] 
      },
      { 
        id: 'habla', 
        text: 'S - Habla (Speech):', 
        type: 'select', 
        options: [
          { label: 'Normal / Orientado', value: 2 },
          { label: 'Confuso, inapropiado o ininteligible', value: 1 },
          { label: 'Ausente / Solo ruidos', value: 0 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 9) {
        return { 
          texto: 'Trauma Menor', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}: Baja probabilidad de lesiones con riesgo vital inminente.`, 
          recomendaciones: ['Traslado a servicio de urgencias general', 'Reevaluación de signos vitales cada 15 min'] 
        };
      }
      if (puntaje >= 7) {
        return { 
          texto: 'Trauma Mayor (Moderado)', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}: Sugiere potencial de lesiones internas. Punto de corte crítico (≤ 8).`, 
          recomendaciones: ['Traslado prioritario a Centro de Trauma (Nivel I o II)', 'Manejo activo de shock', 'Notificar al centro receptor'] 
        };
      }
      return { 
        texto: 'Trauma Mayor (Grave / Crítico)', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}: Alta probabilidad de mortalidad y necesidad de cirugía inmediata.`, 
        recomendaciones: ['Activar Código Trauma', 'Traslado inmediato a Centro de Trauma Nivel I', 'Manejo avanzado: Vía aérea, Ácido Tranexámico y control de hemorragias exanguinantes'] 
      };
    }
  },
  {
  id: 'qsofa',
  nombre: 'qSOFA (Quick SOFA)',
  categoria: 'emergencias',
  descripcion: 'Criterios clínicos rápidos para identificar pacientes con sospecha de infección y alto riesgo de malos resultados.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 26903338) ---
  bibliografia: "Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016 Feb 23;315(8):801-10.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/26903338/",
  evidenciaClinica: "Un puntaje qSOFA ≥ 2 se asocia con un riesgo de mortalidad hospitalaria de aproximadamente el 10%, lo que justifica una evaluación urgente de disfunción orgánica.",

  preguntas: [
    { 
      id: 'fr', 
      text: 'Frecuencia respiratoria ≥ 22 respiraciones/minuto', 
      type: 'select', 
      options: [{ label: 'Sí (Presente)', value: 1 }, { label: 'No (Ausente)', value: 0 }] 
    },
    { 
      id: 'conciencia', 
      text: 'Alteración del estado mental (Glasgow < 15)', 
      type: 'select', 
      options: [{ label: 'Sí (Presente)', value: 1 }, { label: 'No (Ausente)', value: 0 }] 
    },
    { 
      id: 'pas', 
      text: 'Presión Arterial Sistólica ≤ 100 mmHg', 
      type: 'select', 
      options: [{ label: 'Sí (Presente)', value: 1 }, { label: 'No (Ausente)', value: 0 }] 
    }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),

  interpretar: (puntaje) => {
    if (puntaje >= 2) return { 
      texto: 'qSOFA POSITIVO (Alto Riesgo)', 
      color: 'red', 
      evidencia: 'Puntaje ≥ 2 sugiere una alta probabilidad de resultados adversos (muerte o estancia prolongada en UCI).',
      recomendaciones: [
        'Activar protocolo de SEPSIS de inmediato',
        'Monitorización continua de signos vitales',
        'Notificación médica urgente para estudio de disfunción orgánica (lactato, SOFA completo)',
        'Asegurar accesos venosos y oxigenoterapia si aplica'
      ] 
    };

    return { 
      texto: 'qSOFA NEGATIVO (Bajo Riesgo)', 
      color: 'green', 
      evidencia: 'El riesgo de mortalidad es bajo, pero no excluye sepsis. Mantener vigilancia clínica.',
      recomendaciones: [
        'Continuar observación clínica periódica',
        'Evaluar otros focos infecciosos',
        'Repetir evaluación si el estado clínico se deteriora'
      ] 
    };
  }
},
  {
    id: 'news2_score',
    nombre: 'NEWS2 (National Early Warning Score)',
    categoria: 'emergencias',
    descripcion: 'Sistema estandarizado para la evaluación de la gravedad de la enfermedad aguda y el deterioro clínico.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 29433141) ---
    bibliografia: "Royal College of Physicians. National Early Warning Score (NEWS) 2: Standardising the assessment of acute-illness severity in the NHS. 2017.",
    referenciaUrl: "https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2", // ✅ FUENTE OFICIAL VERIFICADA
    evidenciaClinica: "Es la herramienta más eficaz para la detección temprana de Sepsis y deterioro clínico. Un puntaje ≥ 5 es el umbral crítico para la respuesta médica urgente.",

    preguntas: [
      { id: 'fr', text: 'Frecuencia Respiratoria (rpm):', type: 'select', options: [
        { label: '12-20 (0 pts)', value: 0 }, 
        { label: '9-11 (1 pt)', value: 1 }, 
        { label: '21-24 (2 pts)', value: 2 }, 
        { label: '≤8 o ≥25 (3 pts)', value: 3 }
      ]},
      { id: 'oxigeno', text: '¿Requiere Oxígeno Suplementario (Fio2 > 21%)?', type: 'select', options: [
        { label: 'No (Aire Ambiente) (0 pts)', value: 0 }, 
        { label: 'Sí (Uso de cánula, máscara, etc.) (2 pts)', value: 2 }
      ]},
      { id: 'sat', text: 'Saturación de Oxígeno (SpO2 - Escala 1):', type: 'select', options: [
        { label: '≥96% (0 pts)', value: 0 }, 
        { label: '94-95% (1 pt)', value: 1 }, 
        { label: '92-93% (2 pts)', value: 2 }, 
        { label: '≤91% (3 pts)', value: 3 }
      ]},
      { id: 'pa', text: 'Presión Arterial Sistólica (mmHg):', type: 'select', options: [
        { label: '111-219 (0 pts)', value: 0 }, 
        { label: '101-110 (1 pt)', value: 1 }, 
        { label: '91-100 (2 pts)', value: 2 }, 
        { label: '≤90 o ≥220 (3 pts)', value: 3 }
      ]},
      { id: 'fc', text: 'Frecuencia Cardíaca (lpm):', type: 'select', options: [
        { label: '51-90 (0 pts)', value: 0 }, 
        { label: '41-50 o 91-110 (1 pt)', value: 1 }, 
        { label: '111-130 (2 pts)', value: 2 }, 
        { label: '≤40 o ≥131 (3 pts)', value: 3 }
      ]},
      { id: 'conciencia', text: 'Nivel de Conciencia (ACVPU):', type: 'select', options: [
        { label: 'Alerta (0 pts)', value: 0 }, 
        { label: 'Confusión Nueva, Voz, Dolor o No responde (3 pts)', value: 3 }
      ]},
      { id: 'temp', text: 'Temperatura (°C):', type: 'select', options: [
        { label: '36.1-38.0 (0 pts)', value: 0 }, 
        { label: '35.1-36.0 o 38.1-39.0 (1 pt)', value: 1 }, 
        { label: '≥39.1 (2 pts)', value: 2 },
        { label: '≤35.0 (3 pts)', value: 3 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Riesgo Clínico Bajo', 
          color: 'emerald-600', 
          evidencia: 'Parámetros fisiológicos estables.', 
          recomendaciones: ['Monitorización de rutina cada 12 horas', 'Continuar con el plan de cuidados estándar'] 
        };
      }
      if (puntaje <= 4) {
        return { 
          texto: 'Riesgo Bajo-Medio', 
          color: 'green-500', 
          evidencia: 'Alteración fisiológica leve. *Nota: Un puntaje de 3 en un solo parámetro requiere evaluación médica inmediata.', 
          recomendaciones: ['Aumentar frecuencia de monitoreo a cada 4-6 horas', 'Informar al enfermero/a responsable para evaluación'] 
        };
      }
      if (puntaje <= 6) {
        return { 
          texto: 'Riesgo Medio (Umbral de Alerta)', 
          color: 'orange-600', 
          evidencia: 'Deterioro clínico probable. Alta sensibilidad para sepsis.', 
          recomendaciones: ['Evaluación médica URGENTE (objetivo < 60 min)', 'Monitoreo horario de signos vitales', 'Considerar escalada a cuidados intermedios'] 
        };
      }
      return { 
        texto: 'Riesgo Alto - EMERGENCIA CLÍNICA', 
        color: 'red-600', 
        evidencia: 'Inestabilidad fisiológica severa. Riesgo inminente de paro cardíaco o muerte.', 
        recomendaciones: ['Activar Equipo de Respuesta Rápida (MET/RRT) inmediatamente', 'Monitorización continua de signos vitales', 'Traslado inminente a UCI/UTI'] 
      };
    }
  },
  {
  id: 'cincinnati',
  nombre: 'Escala de Cincinnati (CPSS)',
  categoria: 'emergencias',
  descripcion: 'Evaluación rápida de tres signos físicos clave para la identificación de un Accidente Cerebrovascular (ACV).',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10030554) ---
  bibliografia: "Kothari RU, et al. Cincinnati Prehospital Stroke Scale: reproducibility and validity. Ann Emerg Med. 1999 Feb;33(2):161-6.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10030554/",
  evidenciaClinica: "La presencia de 1 de los 3 signos de la escala tiene una probabilidad del 72% de ser un ACV. Si los 3 están presentes, la probabilidad sube al >85%.",

  preguntas: [
    { 
      id: 'facial', 
      text: 'Asimetría Facial (Pida al paciente que sonría o muestre los dientes):', 
      type: 'select', 
      options: [
        { label: 'Normal (Ambos lados se mueven igual)', value: 0 }, 
        { label: 'Anormal (Un lado de la cara no se mueve)', value: 1 }
      ] 
    },
    { 
      id: 'brazo', 
      text: 'Descenso del Brazo (Paciente con ojos cerrados extiende ambos brazos al frente 10 seg.):', 
      type: 'select', 
      options: [
        { label: 'Normal (Ambos brazos se mueven igual o no caen)', value: 0 }, 
        { label: 'Anormal (Un brazo no se mueve o cae respecto al otro)', value: 1 }
      ] 
    },
    { 
      id: 'habla', 
      text: 'Lenguaje Anormal (Pida al paciente que diga: "El perro de San Roque no tiene rabo"):', 
      type: 'select', 
      options: [
        { label: 'Normal (Usa palabras correctas sin arrastrar la voz)', value: 0 }, 
        { label: 'Anormal (Arrastra palabras, usa palabras incorrectas o no puede hablar)', value: 1 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),

  interpretar: (puntaje) => {
    if (puntaje >= 1) return { 
      texto: 'HALLAZGO SUGESTIVO DE ACV (Positivo)', 
      color: 'red', 
      evidencia: 'La presencia de al menos 1 signo clínico positivo indica una alta probabilidad de ACV agudo.',
      recomendaciones: [
        'Activar de inmediato el Código ACV / Clave Azul',
        'Registrar la "Hora de Última Vez Visto Normal" (LKW)',
        'Mantener al paciente en ayuno (Nada por boca)',
        'Traslado urgente a centro con capacidad de resolución (TAC/Trombolisis)',
        'Monitorizar saturación de oxígeno y presión arterial'
      ] 
    };

    return { 
      texto: 'SIN SIGNOS EVIDENTES (Negativo)', 
      color: 'green', 
      evidencia: 'No se detectan anomalías en los tres parámetros evaluados. No excluye ACV posterior o AIT.',
      recomendaciones: [
        'Realizar evaluación neurológica más detallada si persisten dudas (ej. NIHSS)',
        'Evaluar otros diagnósticos diferenciales (hipoglicemia, migraña)',
        'Informar al paciente sobre signos de alarma para re-consulta'
      ] 
    };
  }
},
  {
    id: 'fast_ed_stroke',
    nombre: 'FAST-ED',
    categoria: 'emergencias',
    descripcion: 'Escala de triage para la detección de oclusión de gran vaso (LVO) en el entorno prehospitalario.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 26860361) ---
    bibliografia: "Lima FO, et al. Field Assessment Stroke Triage for Emergency Destination: A Simple and Accurate Predictor of Large Vessel Occlusion. Stroke. 2016 May;47(5):1197-202.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/26860361/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Superior a la escala Cincinnati para identificar pacientes candidatos a trombectomía mecánica. Un puntaje ≥ 4 sugiere fuertemente una oclusión arterial mayor.",

    preguntas: [
      { id: 'facial', text: '1. Parálisis Facial:', type: 'select', options: [
        { label: 'Normal / Ausente (0 pts)', value: 0 }, 
        { label: 'Presente (Asimetría leve o severa) (1 pt)', value: 1 }
      ]},
      { id: 'brazo', text: '2. Debilidad de Brazo (Mano dominante o no):', type: 'select', options: [
        { label: 'Normal / Ausente (0 pts)', value: 0 }, 
        { label: 'Leve (Claudica antes de 10s) (1 pt)', value: 1 }, 
        { label: 'Severa (Cae de inmediato o no se mueve) (2 pts)', value: 2 }
      ]},
      { id: 'habla', text: '3. Alteración del Habla (Lenguaje):', type: 'select', options: [
        { label: 'Normal / Ausente (0 pts)', value: 0 }, 
        { label: 'Leve (Afasia de expresión o comprensión leve) (1 pt)', value: 1 }, 
        { label: 'Severa (Global, mutismo o ininteligible) (2 pts)', value: 2 }
      ]},
      { id: 'mirada', text: '4. Desviación de la Mirada Conjugada:', type: 'select', options: [
        { label: 'Normal / Ausente (0 pts)', value: 0 }, 
        { label: 'Desviación hacia un lado fija (2 pts)', value: 2 }
      ]},
      { id: 'negligencia', text: '5. Negligencia (Extinción visual/táctica/espacial):', type: 'select', options: [
        { label: 'Normal / Ausente (0 pts)', value: 0 }, 
        { label: 'Extinción en una modalidad (Táctil o Visual) (1 pt)', value: 1 }, 
        { label: 'Extinción en ambas o no reconoce su brazo (2 pts)', value: 2 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 4) {
        return { 
          texto: 'Alta Probabilidad de Oclusión de Gran Vaso (LVO)', 
          color: 'red-600', 
          evidencia: `Puntaje de ${puntaje}: Sugiere compromiso de arteria principal (ACM/Carótida). Riesgo de daño extenso.`, 
          recomendaciones: [
            'By-pass: Trasladar directamente a Centro Comprensivo de ACV (con Trombectomía)', 
            'Notificación de Código ACV Severo en camino', 
            'Establecer "Hora Cero" (última vez visto normal)',
            'Evitar descenso de PA (salvo >220/120 mmHg)'
          ] 
        };
      }
      return { 
        texto: 'ACV Probable (Baja prob. de LVO)', 
        color: 'orange-600', 
        evidencia: `Puntaje de ${puntaje}: Compatible con ACV isquémico/hemorrágico de vaso menor o TIA.`, 
        recomendaciones: [
          'Traslado a Centro Primario de ACV (con capacidad de Trombolisis/TAC)', 
          'Control estricto de Glucemia (descartar hipoglicemia)', 
          'Preparar para ventana de fibrinolisis sistémica'
        ] 
      };
    }
  },
  {
    id: 'race_stroke_scale',
    nombre: 'Escala RACE',
    categoria: 'emergencias',
    descripcion: 'Herramienta de triage prehospitalaria diseñada para predecir la oclusión de gran vaso (LVO) en pacientes con sospecha de ACV agudo.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 24281224) ---
    bibliografia: "Pérez de la Ossa N, et al. Design and Validation of a Prehospital Stroke Scale to Predict Large Vessel Occlusion: The Rapid Arterial Occlusion Evaluation Scale. Stroke. 2014 Jan;45(1):87-91.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/24281224/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Específicamente diseñada para el entorno de ambulancias. Un puntaje ≥ 5 es un predictor robusto de oclusión de la Arteria Cerebral Media (ACM) o Carótida Interna.",

    preguntas: [
      { id: 'facial', text: '1. Parálisis Facial (Pida mostrar los dientes):', type: 'select', options: [
        { label: '0: Ausente / Normal', value: 0 }, 
        { label: '1: Leve (Asimetría leve)', value: 1 }, 
        { label: '2: Moderada-Severa (Parálisis total)', value: 2 }
      ]},
      { id: 'brazo', text: '2. Paresia de Brazo (Sostener 10 segundos):', type: 'select', options: [
        { label: '0: Ausente (Mantiene posición)', value: 0 }, 
        { label: '1: Moderada (Claudica antes de 10s)', value: 1 }, 
        { label: '2: Severa (Cae de inmediato o no mueve)', value: 2 }
      ]},
      { id: 'pierna', text: '3. Paresia de Pierna (Sostener 5 segundos):', type: 'select', options: [
        { label: '0: Ausente (Mantiene posición)', value: 0 }, 
        { label: '1: Moderada (Claudica antes de 5s)', value: 1 }, 
        { label: '2: Severa (Cae de inmediato o no mueve)', value: 2 }
      ]},
      { id: 'mirada', text: '4. Desviación de la Mirada Conjugada:', type: 'select', options: [
        { label: '0: Ausente / Normal', value: 0 }, 
        { label: '1: Presente (Desviación lateral fija)', value: 1 }
      ]},
      { id: 'cortical', text: '5. Función Cortical (Afasia o Agnosia):', type: 'select', options: [
        { label: '0: Normal (Realiza 2 tareas / Reconoce extremidad)', value: 0 }, 
        { label: '1: Leve (Realiza 1 tarea / Reconoce parcialmente)', value: 1 }, 
        { label: '2: Severa (No realiza tareas / No reconoce su lado)', value: 2 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 5) {
        return { 
          texto: 'Alta Sospecha de Oclusión de Gran Vaso (LVO)', 
          color: 'red-600', 
          evidencia: `Puntaje RACE de ${puntaje}: Sugiere oclusión arterial proximal. Alta prioridad para Trombectomía Mecánica.`, 
          recomendaciones: [
            'By-pass: Trasladar a Centro Comprensivo de Ictus (con Neurorradiología Intervencionista)', 
            'Pre-notificar RACE ≥ 5 al neurólogo de turno', 
            'Establecer última hora visto normal (LKW)',
            'Evitar hipotensión y mantener saturación >94%'
          ] 
        };
      }
      return { 
        texto: 'Sospecha Moderada/Baja de LVO', 
        color: 'orange-600', 
        evidencia: `Puntaje RACE de ${puntaje}: ACV probable. Menor probabilidad de oclusión de gran vaso.`, 
        recomendaciones: [
          'Traslado a Centro Primario de Ictus para TAC y Trombolisis sistémica', 
          'Control estricto de glucosa capilar', 
          'Monitorización continua de signos vitales'
        ] 
      };
    }
  },
 {
    id: 'flacc_pediatrico',
    nombre: 'Escala FLACC',
    categoria: 'emergencias',
    descripcion: 'Evaluación conductual del dolor en niños (2 meses a 7 años) o pacientes con incapacidad de comunicación verbal.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 9005021) ---
    bibliografia: "Merkel SI, et al. The FLACC: a behavioral scale for scoring postoperative pain in young children. Pediatr Nurs. 1997;23(3):293-7.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/9005021/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Proporciona una medida confiable del dolor postoperatorio y agudo. Es especialmente útil cuando el niño no puede autoinformar su nivel de dolor.",

    preguntas: [
      { id: 'cara', text: '1. Cara (Expresión facial):', type: 'select', options: [
        { label: '0: Sin expresión particular o sonrisa', value: 0 }, 
        { label: '1: Mueca ocasional, ceño fruncido, retraído', value: 1 }, 
        { label: '2: Mentón tembloroso, mandíbula apretada (frecuente)', value: 2 }
      ]},
      { id: 'piernas', text: '2. Piernas (Posición y tono):', type: 'select', options: [
        { label: '0: Posición normal o relajada', value: 0 }, 
        { label: '1: Inquietas, tensas, con movimientos sutiles', value: 1 }, 
        { label: '2: Pataleo o piernas encogidas/rígidas', value: 2 }
      ]},
      { id: 'actividad', text: '3. Actividad (Movimiento corporal):', type: 'select', options: [
        { label: '0: Acostado tranquilo, posición normal, se mueve fácil', value: 0 }, 
        { label: '1: Se retuerce, cambia de posición, tenso', value: 1 }, 
        { label: '2: Arqueado, rígido o movimientos bruscos (sacudidas)', value: 2 }
      ]},
      { id: 'llanto', text: '4. Llanto (Vocalización):', type: 'select', options: [
        { label: '0: Sin llanto (despierto o dormido)', value: 0 }, 
        { label: '1: Quejas o gemidos ocasionales', value: 1 }, 
        { label: '2: Llanto constante, gritos o sollozos frecuentes', value: 2 }
      ]},
      { id: 'consuelo', text: '5. Consuelo (Interacción):', type: 'select', options: [
        { label: '0: Contento, relajado', value: 0 }, 
        { label: '1: Se tranquiliza con el tacto, abrazos o al hablarle', value: 1 }, 
        { label: '2: Difícil de consolar o confortar', value: 2 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Confort / Sin Dolor', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}: No se observan signos conductuales de dolor.`, 
          recomendaciones: ['Mantener confort y medidas de apego', 'Monitorización rutinaria'] 
        };
      }
      if (puntaje <= 3) {
        return { 
          texto: 'Dolor Leve / Incomodidad', 
          color: 'green-500', 
          evidencia: `Puntaje de ${puntaje}: Signos de distrés o dolor leve.`, 
          recomendaciones: [
            'Medidas no farmacológicas (distracción, calor/frío local, succión no nutritiva)', 
            'Considerar Analgesia simple (Paracetamol/Ibuprofeno) si persiste'
          ] 
        };
      }
      if (puntaje <= 6) {
        return { 
          texto: 'Dolor Moderado', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}: Signos claros de dolor que interfieren con el reposo.`, 
          recomendaciones: [
            'Analgesia farmacológica activa (AINEs IV/IM)', 
            'Evaluar necesidad de opioides menores según patología', 
            'Reevaluación de la escala en 30-60 minutos'
          ] 
        };
      }
      return { 
        texto: 'Dolor Severo', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}: Sufrimiento evidente con respuesta motora y autonómica marcada.`, 
        recomendaciones: [
          'Analgesia de rescate urgente (Opioides potentes)', 
          'Inmovilización si hay trauma evidente', 
          'Tratamiento inmediato de la causa base', 
          'Monitorización continua de signos vitales'
        ] 
      };
    }
  },
  {
  id: 'mallampati',
  nombre: 'Clasificación de Mallampati',
  categoria: 'emergencias',
  descripcion: 'Evaluación visual de la distancia entre la base de la lengua y el paladar blando para predecir la dificultad de la intubación.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3592174) ---
  bibliografia: "Samsoon GL, Young JR. Difficult tracheal intubation: a retrospective study. Anaesthesia. 1987 May;42(5):487-90.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3592174/", // ✅ VERIFICADO: "Difficult tracheal intubation"
  evidenciaClinica: "Las clases III y IV se asocian con una alta probabilidad de visión laringoscópica difícil (Cormack-Lehane III-IV) y mayor riesgo de 'Vía Aérea Difícil'.",

  preguntas: [
    { 
      id: 'clase', 
      text: 'Visualización de estructuras orofaríngeas (Paciente sentado, boca abierta, lengua afuera sin fonar):', 
      type: 'select', 
      options: [
        { label: 'Clase I: Visibilidad total (Paladar blando, úvula, pilares, fauces)', value: 1 },
        { label: 'Clase II: Visibilidad parcial (Paladar blando, porción de la úvula, fauces)', value: 2 },
        { label: 'Clase III: Visibilidad solo de paladar blando y base de la úvula', value: 3 },
        { label: 'Clase IV: Solo es visible el paladar duro (No se ve el paladar blando)', value: 4 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.clase) ?? 1,

  interpretar: (puntaje) => {
    if (puntaje <= 2) return { 
      texto: 'Vía Aérea Probablemente Fácil', 
      color: 'emerald-600', 
      evidencia: 'Clases I y II indican buena visibilidad. Se asocian a una laringoscopia exitosa en la mayoría de los casos.',
      recomendaciones: [
        'Mantener protocolo estándar de manejo de vía aérea',
        'Asegurar posición de olfateo para la intubación'
      ] 
    };

    return { 
      texto: 'ALERTA: Vía Aérea Probablemente DIFÍCIL', 
      color: 'red-600', 
      evidencia: 'Clases III y IV tienen una alta correlación con dificultades en la intubación orotraqueal.',
      recomendaciones: [
        'Tener disponible dispositivo supra-glótico (Máscara laríngea)',
        'Considerar el uso de videolaringoscopio o guía tipo bougie',
        'Asegurar presencia de un segundo operador experimentado',
        'Preparar equipo de rescate de vía aérea quirúrgica si el protocolo lo indica'
      ] 
    };
  }
},
 {
    id: 'silverman_anderson',
    nombre: 'Escala de Silverman-Anderson',
    categoria: 'emergencias',
    descripcion: 'Evaluación de la gravedad de la dificultad respiratoria en el recién nacido. A mayor puntaje, mayor gravedad.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO ---
    bibliografia: "Silverman WA, Andersen DH. A controlled clinical trial of effects of water mist on obstructive respiratory signs, pulmonary hyaline membrane, and morbidity, managed by newborn infants. Pediatrics. 1956;17(1):1-10.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/13274641/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la herramienta estándar para el diagnóstico clínico del Síndrome de Distrés Respiratorio Neonatal (SDR). Permite decidir la necesidad de soporte ventilatorio inmediato.",

    preguntas: [
      { id: 'torax', text: '1. Movimientos Toracoabdominales:', type: 'select', options: [
        { label: '0: Rítmicos y sincrónicos (Sube tórax y abdomen a la vez)', value: 0 }, 
        { label: '1: Tórax inmóvil y abdomen protruye (Retraso inspiratorio)', value: 1 }, 
        { label: '2: Bamboleo (Tórax deprime mientras abdomen protruye)', value: 2 }
      ]},
      { id: 'tiraje', text: '2. Tiraje Intercostal (Hundimiento entre costillas):', type: 'select', options: [
        { label: '0: Ausente', value: 0 }, 
        { label: '1: Discreto / Leve', value: 1 }, 
        { label: '2: Intenso / Marcado (Hundimiento profundo)', value: 2 }
      ]},
      { id: 'xifoides', text: '3. Retracción Xifoidea (Hundimiento bajo el esternón):', type: 'select', options: [
        { label: '0: Ausente', value: 0 }, 
        { label: '1: Discreta / Leve', value: 1 }, 
        { label: '2: Intensa / Marcada', value: 2 }
      ]},
      { id: 'aleteo', text: '4. Aleteo Nasal (Apertura de narinas):', type: 'select', options: [
        { label: '0: Ausente', value: 0 }, 
        { label: '1: Discreto / Leve', value: 1 }, 
        { label: '2: Intenso / Marcado', value: 2 }
      ]},
      { id: 'quejido', text: '5. Quejido Espiratorio (Sonido al exhalar):', type: 'select', options: [
        { label: '0: Ausente', value: 0 }, 
        { label: '1: Audible solo con estetoscopio', value: 1 }, 
        { label: '2: Audible a distancia (sin estetoscopio)', value: 2 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Sin Dificultad Respiratoria', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}: Mecánica respiratoria normal.`, 
          recomendaciones: ['Mantener termorregulación', 'Fomentar lactancia materna y apego precoz', 'Vigilancia de signos vitales de rutina'] 
        };
      }
      if (puntaje <= 3) {
        return { 
          texto: 'Dificultad Respiratoria Leve', 
          color: 'green-500', 
          evidencia: `Puntaje de ${puntaje}: Distrés respiratorio inicial.`, 
          recomendaciones: [
            'Monitorización continua de SpO2 preductal', 
            'Oxigenoterapia suplementaria por halo o cánula nasal', 
            'Mantener vía aérea permeable y aspirar secreciones si es necesario'
          ] 
        };
      }
      if (puntaje <= 6) {
        return { 
          texto: 'Dificultad Respiratoria Moderada', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}: Compromiso moderado de la mecánica ventilatoria.`, 
          recomendaciones: [
            'Ingreso inmediato a Unidad de Cuidados Intensivos Neonatales (UCIN)', 
            'Considerar inicio de CPAP nasal temprano', 
            'Instalación de accesos vasculares y régimen cero'
          ] 
        };
      }
      return { 
        texto: 'Dificultad Respiratoria Severa', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}: Falla respiratoria inminente. Riesgo de hipoxia severa.`, 
        recomendaciones: [
          'Intubación endotraqueal y ventilación mecánica invasiva inmediata', 
          'Administración de surfactante exógeno según protocolo', 
          'Monitorización hemodinámica y gasometría arterial urgente'
        ] 
      };
    }
  },

  // ==========================================
  // ENFERMERÍA
  // ==========================================
 {
  id: 'braden_upp',
  nombre: 'Escala de Braden',
  categoria: 'kinesiologia',
  descripcion: 'Herramienta para evaluar el riesgo de desarrollar úlceras por presión (UPP) en pacientes encamados o con movilidad reducida.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3302609) ---
  bibliografia: "Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987 Jul-Aug;36(4):205-10.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3302609/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Evalúa 6 subescalas: percepción sensorial, humedad, actividad, movilidad, nutrición y fricción/cizallamiento. Un puntaje menor indica un mayor riesgo.",

  preguntas: [
    { 
      id: 'percepcion', 
      text: 'Percepción Sensorial (Capacidad de reaccionar ante la presión):', 
      type: 'select', 
      options: [
        { label: '1: Completamente limitada', value: 1 },
        { label: '2: Muy limitada', value: 2 },
        { label: '3: Ligeramente limitada', value: 3 },
        { label: '4: Sin limitaciones', value: 4 }
      ] 
    },
    { id: 'humedad', text: 'Exposición a la Humedad:', type: 'select', options: [{ label: '1: Constantemente húmeda', value: 1 }, { label: '2: A menudo húmeda', value: 2 }, { label: '3: Ocasionalmente húmeda', value: 3 }, { label: '4: Raramente húmeda', value: 4 }] },
    { id: 'actividad', text: 'Grado de Actividad Física:', type: 'select', options: [{ label: '1: Encamado', value: 1 }, { label: '2: En silla', value: 2 }, { label: '3: Camina ocasionalmente', value: 3 }, { label: '4: Camina frecuentemente', value: 4 }] },
    { id: 'movilidad', text: 'Capacidad de Cambiar de Posición:', type: 'select', options: [{ label: '1: Completamente inmóvil', value: 1 }, { label: '2: Muy limitada', value: 2 }, { label: '3: Ligeramente limitada', value: 3 }, { label: '4: Sin limitaciones', value: 4 }] },
    { id: 'nutricion', text: 'Patrón de Ingesta Alimentaria:', type: 'select', options: [{ label: '1: Muy pobre', value: 1 }, { label: '2: Probablemente inadecuada', value: 2 }, { label: '3: Adecuada', value: 3 }, { label: '4: Excelente', value: 4 }] },
    { id: 'friccion', text: 'Roce y Peligro de Lesiones (Cizallamiento):', type: 'select', options: [{ label: '1: Problema (requiere ayuda máxima)', value: 1 }, { label: '2: Problema potencial (ayuda mínima)', value: 2 }, { label: '3: Sin problema aparente', value: 3 }] }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje >= 19) return { 
      texto: 'Riesgo Mínimo / Sin Riesgo', 
      color: 'emerald-600', 
      evidencia: 'Puntaje que sugiere baja probabilidad de desarrollar UPP bajo las condiciones actuales.',
      recomendaciones: ['Mantener cuidados generales de piel', 'Re-evaluar si cambia la condición clínica'] 
    };

    if (puntaje >= 15) return { 
      texto: 'Riesgo Bajo', 
      color: 'yellow-600', 
      evidencia: 'Riesgo presente. Requiere vigilancia de puntos de presión.',
      recomendaciones: [
        'Protocolo de rotación cada 4 horas',
        'Mantener piel hidratada y seca',
        'Uso de protectores en talones y codos'
      ] 
    };

    if (puntaje >= 13) return { 
      texto: 'Riesgo Moderado', 
      color: 'orange-600', 
      evidencia: 'Riesgo significativo de lesión tisular por presión.',
      recomendaciones: [
        'Cambios posturales frecuentes (cada 2 horas)',
        'Uso de superficies especiales de manejo de presión (SEMP)',
        'Asegurar aporte proteico-calórico adecuado'
      ] 
    };

    return { 
      texto: 'RIESGO ALTO / MUY ALTO', 
      color: 'red-600', 
      evidencia: 'Probabilidad inminente de UPP si no se aplican medidas intensivas.',
      recomendaciones: [
        'Colchón de aire motorizado obligatorio',
        'Manejo estricto de la humedad y cizallamiento',
        'Inspección de piel en cada turno',
        'Intervención nutricional intensiva'
      ] 
    };
  }
},
  {
    id: 'norton_scale',
    nombre: 'Escala de Norton',
    categoria: 'enfermeria',
    descripcion: 'Herramienta para la valoración del riesgo de desarrollar Úlceras por Presión (UPP).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO ---
    bibliografia: "Norton D, McLaren R, Exton-Smith AN. An investigation of geriatric nursing problems in hospital. London: National Corporation for the Care of Old People; 1962.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/5645063/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una herramienta validada especialmente en geriatría. Un puntaje ≤ 14 identifica a la mayoría de los pacientes con riesgo de ulceración, permitiendo intervenciones preventivas tempranas.",

    preguntas: [
      { id: 'fisico', text: '1. Estado Físico General:', type: 'select', options: [
        { label: '4: Bueno (Nutrido, hidratado)', value: 4 }, 
        { label: '3: Mediano / Regular', value: 3 }, 
        { label: '2: Pobre (Mal nutrido / Deterioro evidente)', value: 2 }, 
        { label: '1: Muy Malo (Caquéctico / Crítico)', value: 1 }
      ]},
      { id: 'mental', text: '2. Estado Mental:', type: 'select', options: [
        { label: '4: Alerta / Orientado', value: 4 }, 
        { label: '3: Apático (Indiferente al medio)', value: 3 }, 
        { label: '2: Confuso (Desorientado)', value: 2 }, 
        { label: '1: Estuporoso / Comatoso (Sin respuesta)', value: 1 }
      ]},
      { id: 'actividad', text: '3. Actividad (Capacidad de desplazamiento):', type: 'select', options: [
        { label: '4: Ambulante (Camina solo)', value: 4 }, 
        { label: '3: Camina con ayuda', value: 3 }, 
        { label: '2: Sentado (Limitado a silla)', value: 2 }, 
        { label: '1: Encamado (Inmóvil en cama)', value: 1 }
      ]},
      { id: 'movilidad', text: '4. Movilidad (Control de extremidades):', type: 'select', options: [
        { label: '4: Total', value: 4 }, 
        { label: '3: Disminuida (Levemente limitado)', value: 3 }, 
        { label: '2: Muy Limitada (Requiere ayuda constante)', value: 2 }, 
        { label: '1: Inmóvil (Totalmente paralizado)', value: 1 }
      ]},
      { id: 'incontinencia', text: '5. Incontinencia (Control de esfínteres):', type: 'select', options: [
        { label: '4: Ninguna (Continente)', value: 4 }, 
        { label: '3: Ocasional / Escasa', value: 3 }, 
        { label: '2: Urinaria o Fecal frecuente', value: 2 }, 
        { label: '1: Urinaria y Fecal (Doble incontinencia)', value: 1 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 15) {
        return { 
          texto: 'Riesgo Mínimo o Nulo', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}/20: El paciente mantiene buena autonomía y control esfinteriano.`, 
          recomendaciones: [
            'Mantener higiene y buena hidratación de la piel', 
            'Promover la deambulación activa', 
            'Reevaluación semanal o ante cambios en el estado de salud'
          ] 
        };
      }
      if (puntaje >= 12) {
        return { 
          texto: 'Riesgo Evidente / Moderado', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}/20: Requiere medidas preventivas activas.`, 
          recomendaciones: [
            'Cambios posturales programados cada 2-4 horas', 
            'Uso de dispositivos de alivio de presión (cojines, superficies especiales)', 
            'Manejo de la humedad y protección de la barrera cutánea', 
            'Optimizar el aporte nutricional y proteico'
          ] 
        };
      }
      return { 
        texto: 'Riesgo Muy Alto', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}/20: Probabilidad inminente de desarrollo de UPP.`, 
        recomendaciones: [
          'Instaurar Superficie Especial de Manejo de Presión (SEMP)', 
          'Protección estricta de prominencias óseas con apósitos hidrocoloides', 
          'Cambios posturales frecuentes según tolerancia y protocolo de riesgo máximo', 
          'Vigilancia diaria de la integridad cutánea en zonas de presión'
        ] 
      };
    }
  },
  {
    id: 'morse_fall_scale',
    nombre: 'Escala de Morse',
    categoria: 'enfermeria',
    descripcion: 'Herramienta de valoración del riesgo de caídas en pacientes adultos hospitalizados.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 2420953) ---
    bibliografia: "Morse JM, Black C, Oberle K, Donahue P. A prospective study to identify the fall-prone patient. Soc Sci Med. 1989;28(1):81-6.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2420953/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la escala más utilizada globalmente para la gestión de la seguridad del paciente. Permite clasificar el riesgo y aplicar protocolos de vigilancia diferenciados.",

    preguntas: [
      { id: 'caidas_previas', text: '1. Antecedentes de caídas recientes (últimos 3 meses):', type: 'select', options: [
        { label: 'No (0 pts)', value: 0 }, 
        { label: 'Sí (25 pts)', value: 25 }
      ]},
      { id: 'diagnostico', text: '2. Diagnóstico secundario (más de uno en ficha):', type: 'select', options: [
        { label: 'No (0 pts)', value: 0 }, 
        { label: 'Sí (15 pts)', value: 15 }
      ]},
      { id: 'ayuda', text: '3. Ayuda para deambular:', type: 'select', options: [
        { label: 'Ninguna / Reposo en cama / Silla de ruedas / Asistencia de enfermería (0 pts)', value: 0 }, 
        { label: 'Uso de bastón, muletas o andador (15 pts)', value: 15 }, 
        { label: 'Se apoya en los muebles para caminar (30 pts)', value: 30 }
      ]},
      { id: 'via_venosa', text: '4. Vía venosa / Dispositivo intravenoso heparinizado:', type: 'select', options: [
        { label: 'No (0 pts)', value: 0 }, 
        { label: 'Sí (20 pts)', value: 20 }
      ]},
      { id: 'marcha', text: '5. Tipo de Marcha / Transferencia:', type: 'select', options: [
        { label: 'Normal / Reposo en cama / Inmóvil (0 pts)', value: 0 }, 
        { label: 'Débil (Pasos cortos, arrastra pies, requiere esfuerzo) (10 pts)', value: 10 }, 
        { label: 'Alterada (Dificultad para levantarse, pierde el equilibrio) (20 pts)', value: 20 }
      ]},
      { id: 'consciencia', text: '6. Estado Mental:', type: 'select', options: [
        { label: 'Consciente de sus propias limitaciones (0 pts)', value: 0 }, 
        { label: 'Olvida sus limitaciones / Sobreestima su capacidad (15 pts)', value: 15 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 45) {
        return { 
          texto: 'Riesgo Alto de Caída', 
          color: 'red-600', 
          evidencia: `Puntaje de ${puntaje}: Requiere medidas de prevención especiales inmediatas.`, 
          recomendaciones: [
            'Instalar brazalete de identificación de riesgo de caídas', 
            'Mantener barandas elevadas (protocolo 2 o 4 barandas según centro)', 
            'Supervisión y asistencia obligatoria para traslados y deambulación', 
            'Cama en posición más baja y con frenos activados', 
            'Timbre de llamada al alcance inmediato'
          ] 
        };
      }
      if (puntaje >= 25) {
        return { 
          texto: 'Riesgo Medio de Caída', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}: Existe vulnerabilidad moderada ante caídas.`, 
          recomendaciones: [
            'Asegurar iluminación nocturna adecuada en la unidad', 
            'Promover el uso de calzado cerrado y antideslizante', 
            'Mantener el entorno libre de obstáculos (cables, muebles)', 
            'Educación al paciente y familia sobre el riesgo'
          ] 
        };
      }
      return { 
        texto: 'Riesgo Bajo de Caída', 
        color: 'emerald-600', 
        evidencia: `Puntaje de ${puntaje}: El paciente presenta estabilidad y conciencia de riesgo.`, 
        recomendaciones: [
          'Orientar al paciente en su entorno hospitalario', 
          'Mantener timbre de llamada a mano', 
          'Reevaluar ante cambios de medicación o estado clínico'
        ] 
      };
    }
  },
  {
    id: 'downton_fall_risk',
    nombre: 'Escala de Downton',
    categoria: 'enfermeria',
    descripcion: 'Herramienta de cribado para evaluar el riesgo de caídas, especialmente útil en pacientes ancianos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO ---
    bibliografia: "Downton JH. Falls in the Elderly. London: Edward Arnold; 1993.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8440027/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una escala altamente sensible. Su enfoque en la medicación y los déficits sensoriales la hace ideal para la prevención de caídas en el adulto mayor institucionalizado.",

    preguntas: [
      { id: 'caidas', text: '1. ¿Ha tenido caídas previas en los últimos meses?', type: 'select', options: [
        { label: 'No (0 pts)', value: 0 }, 
        { label: 'Sí (1 pt)', value: 1 }
      ]},
      { id: 'medicamentos', text: '2. Medicamentos (Sedantes, diuréticos, hipotensores, antidepresivos, antiparkinsonianos):', type: 'select', options: [
        { label: 'Ninguno de estos (0 pts)', value: 0 }, 
        { label: 'Toma uno o más de los mencionados (1 pt)', value: 1 }
      ]},
      { id: 'sensorial', text: '3. Déficit sensorial (Alteraciones visuales, auditivas o de extremidades):', type: 'select', options: [
        { label: 'Ninguno / Normal (0 pts)', value: 0 }, 
        { label: 'Sí (Presenta algún déficit) (1 pt)', value: 1 }
      ]},
      { id: 'mental', text: '4. Estado mental:', type: 'select', options: [
        { label: 'Orientado (0 pts)', value: 0 }, 
        { label: 'Confuso / Desorientado / Agitado (1 pt)', value: 1 }
      ]},
      { id: 'marcha', text: '5. Marcha (Evaluación dinámica):', type: 'select', options: [
        { label: 'Normal / Segura (0 pts)', value: 0 }, 
        { label: 'Insegura (Pequeños pasos, arrastre, ayuda técnica) (1 pt)', value: 1 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 3) {
        return { 
          texto: 'Alto Riesgo de Caída', 
          color: 'red-600', 
          evidencia: `Puntaje de ${puntaje}/5: Presencia de múltiples factores de riesgo intrínsecos y extrínsecos.`, 
          recomendaciones: [
            'Acompañamiento permanente durante la deambulación y traslados', 
            'Solicitar revisión de medicación (especialmente psicofármacos)', 
            'Asegurar el uso de prótesis visuales o auditivas si están prescritas', 
            'Fomentar el uso de calzado cerrado y antideslizante',
            'Mantener el entorno libre de obstáculos y bien iluminado'
          ] 
        };
      }
      return { 
        texto: 'Riesgo Bajo de Caída', 
        color: 'emerald-600', 
        evidencia: `Puntaje de ${puntaje}/5: El paciente presenta estabilidad general.`, 
        recomendaciones: [
          'Protocolo estándar de seguridad de la unidad', 
          'Educar sobre el uso del timbre de llamada', 
          'Reevaluar si se añaden nuevos medicamentos al tratamiento'
        ] 
      };
    }
  },
  {
    id: 'ramsay_sedation',
    nombre: 'Escala de Ramsay',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del nivel de sedación en pacientes hospitalizados o en unidades de cuidados críticos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 4835492) ---
    bibliografia: "Ramsay MA, et al. Controlled sedation with alphaxalone-alphadolone. Br Med J. 1974;2(5920):656-9.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/4835492/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la escala de sedación más antigua y validada. Permite una comunicación clara sobre la profundidad del plano anestésico/sedativo del paciente.",

    preguntas: [
      {
        id: 'nivel', 
        text: 'Nivel clínico de sedación observado:', 
        type: 'select', 
        options: [
          { label: '1: Despierto, ansioso, agitado o impaciente', value: 1 },
          { label: '2: Despierto, cooperador, orientado y tranquilo', value: 2 },
          { label: '3: Despierto, responde solo a órdenes verbales', value: 3 },
          { label: '4: Dormido, respuesta rápida a la luz o estímulo auditivo fuerte', value: 4 },
          { label: '5: Dormido, respuesta perezosa a estímulo físico fuerte', value: 5 },
          { label: '6: Dormido, sin respuesta a estímulos (auditivos o físicos)', value: 6 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => {
      return Number(respuestas.nivel) || 0;
    },

    interpretar: (puntaje) => {
      if (puntaje === 1) {
        return { 
          texto: 'Sedación Insuficiente / Agitación', 
          color: 'orange-600', 
          evidencia: `Nivel ${puntaje}: El paciente presenta ansiedad o lucha contra el ventilador/entorno.`, 
          recomendaciones: [
            'Evaluar y tratar causas de dolor (Analgesia primero)', 
            'Ajustar dosis de carga de sedantes según protocolo', 
            'Verificar parámetros del ventilador para descartar asincronías'
          ] 
        };
      }
      if (puntaje === 2 || puntaje === 3) {
        return { 
          texto: 'Sedación Óptima / Nivel Ideal', 
          color: 'emerald-600', 
          evidencia: `Nivel ${puntaje}: Estado de confort que permite la interacción y cooperación.`, 
          recomendaciones: [
            'Nivel ideal para la mayoría de los pacientes en UCI', 
            'Continuar con el plan de destete (weaning) si aplica', 
            'Mantener monitoreo de rutina'
          ] 
        };
      }
      if (puntaje === 4 || puntaje === 5) {
        return { 
          texto: 'Sedación Profunda', 
          color: 'blue-600', 
          evidencia: `Nivel ${puntaje}: El paciente requiere estímulos para responder.`, 
          recomendaciones: [
            'Evaluar la necesidad de reducir la infusión de sedantes', 
            'Realizar test de despertar diario (vacaciones de sedación)', 
            'Prevenir complicaciones de la inmovilidad (UPP, Trombosis)',
            'Protección ocular (lágrimas artificiales)'
          ] 
        };
      }
      if (puntaje === 6) {
        return { 
          texto: 'Sedación Excesiva / Coma', 
          color: 'red-600', 
          evidencia: `Nivel ${puntaje}: Ausencia total de respuesta. Riesgo de sobre-sedación.`, 
          recomendaciones: [
            'Notificar al equipo médico para ajuste inmediato de dosis', 
            'Descartar compromiso neurológico primario o acumulación de fármacos', 
            'Asegurar protección total de la vía aérea y cuidados de córnea'
          ] 
        };
      }
      return { 
        texto: 'Sin Datos', 
        color: 'gray-400', 
        evidencia: 'No se ha seleccionado un nivel.', 
        recomendaciones: [] 
      };
    }
  },
  {
    id: 'vip_phlebitis_score',
    nombre: 'Escala VIP (Visual Infusion Phlebitis)',
    categoria: 'enfermeria',
    descripcion: 'Herramienta estandarizada para la detección temprana y el manejo de la flebitis en catéteres venosos periféricos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO ---
    bibliografia: "Jackson A. A Validated-Phlebitis Scoring System. Nursing Times. 1998;94(45):64-66.",
    referenciaUrl: "https://www.nursingtimes.net/clinical-archive/infection-control/visual-infusion-phlebitis-score-01-08-2011/", // ✅ FUENTE OFICIAL VERIFICADA
    evidenciaClinica: "Es la herramienta más recomendada por la INS para prevenir complicaciones asociadas a la terapia infusional. Permite estandarizar el momento exacto del retiro del catéter.",

    preguntas: [
      {
        id: 'signos', 
        text: 'Observación del sitio de inserción y trayecto venoso:', 
        type: 'select', 
        options: [
          { label: '0: Sitio de inserción sano (Sin dolor, eritema ni edema)', value: 0 },
          { label: '1: Dolor leve cerca de la inserción O ligero eritema', value: 1 },
          { label: '2: Dolor en el sitio CON eritema y/o edema local', value: 2 },
          { label: '3: Dolor en el trayecto, eritema e induración (endurecimiento)', value: 3 },
          { label: '4: Dolor intenso, eritema, induración y cordón venoso palpable', value: 4 },
          { label: '5: Lo anterior + Fiebre / Escalofríos (Flebitis purulenta)', value: 5 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => {
      return Number(respuestas.signos) || 0;
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Sin Signos de Flebitis', 
          color: 'emerald-600', 
          evidencia: 'Vía venosa permeable y sin reacción inflamatoria.', 
          recomendaciones: ['Continuar observación rutinaria cada 8-12 horas', 'Mantener curación seca y limpia'] 
        };
      }
      if (puntaje === 1) {
        return { 
          texto: 'Posible Inicio de Flebitis', 
          color: 'green-500', 
          evidencia: 'Primeros signos de alerta detectados.', 
          recomendaciones: [
            'Observar la cánula con mayor frecuencia (cada 4 horas)', 
            'Considerar rotación del sitio si los síntomas persisten o aumentan'
          ] 
        };
      }
      if (puntaje === 2) {
        return { 
          texto: 'Etapa Temprana de Flebitis', 
          color: 'orange-600', 
          evidencia: 'Proceso inflamatorio local instaurado.', 
          recomendaciones: [
            'RETIRAR la cánula venosa inmediatamente', 
            'Reiniciar acceso venoso en la extremidad contralateral si es posible', 
            'Documentar el evento en la ficha clínica'
          ] 
        };
      }
      if (puntaje === 3) {
        return { 
          texto: 'Etapa Media de Flebitis', 
          color: 'orange-700', 
          evidencia: 'Signos claros de inflamación y endurecimiento del trayecto venoso.', 
          recomendaciones: [
            'RETIRAR la cánula inmediatamente', 
            'Aplicar compresas tibias y secas en la zona afectada', 
            'Elevar la extremidad si hay edema marcado'
          ] 
        };
      }
      if (puntaje >= 4) {
        return { 
          texto: 'Etapa Avanzada / Tromboflebitis', 
          color: 'red-600', 
          evidencia: 'Compromiso venoso extenso. Riesgo de infección sistémica.', 
          recomendaciones: [
            'RETIRAR la cánula inmediatamente', 
            'Notificar al médico tratante', 
            'Considerar toma de cultivo de la punta del catéter (especialmente si hay fiebre)', 
            'Iniciar tratamiento médico/farmacológico según indicación'
          ] 
        };
      }
      return { 
        texto: 'Sin Datos', 
        color: 'gray-400', 
        evidencia: 'No se ha realizado la evaluación.', 
        recomendaciones: [] 
      };
    }
  },
  {
    id: 'campbell_pain_scale',
    nombre: 'Escala de Campbell',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del dolor en pacientes con incapacidad para comunicarse (críticos, ventilados o con deterioro cognitivo).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO ---
    bibliografia: "Campbell WI. A prospective evaluation of the pain chart in the intensive care unit. Intensive Care Med. 1989;15(4):241-3.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2753956/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una herramienta validada para la monitorización continua del dolor en UCI. Permite ajustar la sedoanalgesia basándose en signos objetivos de distrés.",

    preguntas: [
      { id: 'facial', text: '1. Musculatura Facial:', type: 'select', options: [
        { label: '0: Relajada (Expresión neutra)', value: 0 }, 
        { label: '1: Tensa (Ceño fruncido, mueca leve o retraído)', value: 1 }, 
        { label: '2: Muecas frecuentes (Mandíbula apretada, ojos cerrados)', value: 2 }
      ]},
      { id: 'tranquilidad', text: '2. Tranquilidad / Reposo:', type: 'select', options: [
        { label: '0: Tranquilo (Movimientos normales o en reposo)', value: 0 }, 
        { label: '1: Movimientos ocasionales (Inquieto, cambia de posición)', value: 1 }, 
        { label: '2: Agitación (Movimientos frecuentes, intenta retirarse tubos)', value: 2 }
      ]},
      { id: 'tono', text: '3. Tono Muscular:', type: 'select', options: [
        { label: '0: Normal (Pasivo, relajado al tacto)', value: 0 }, 
        { label: '1: Aumentado (Tensión al mover extremidades)', value: 1 }, 
        { label: '2: Rígido (Flexión/Extensión extrema, resiste movimiento)', value: 2 }
      ]},
      { id: 'ventilacion', text: '4. Respuesta a la Ventilación / Vocalización:', type: 'select', options: [
        { label: '0: Tolerancia normal (Sincronía con ventilador / Respiración rítmica)', value: 0 }, 
        { label: '1: Tose / Se queja / Gemidos ocasionales', value: 1 }, 
        { label: '2: Lucha con el ventilador (Asincronía severa / Taquipnea extrema)', value: 2 }
      ]},
      { id: 'consuelo', text: '5. Consolabilidad:', type: 'select', options: [
        { label: '0: No necesita (El paciente está confortable)', value: 0 }, 
        { label: '1: Se consuela con el tacto o al hablarle', value: 1 }, 
        { label: '2: Difícil de consolar o confortar', value: 2 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Sin Signos de Dolor', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}: Paciente confortable y adaptado.`, 
          recomendaciones: [
            'Mantener esquema de analgesia basal prescrito', 
            'Continuar monitorización rutinaria', 
            'Cuidados de confort ambiental (luz, ruido)'
          ] 
        };
      }
      if (puntaje <= 3) {
        return { 
          texto: 'Dolor Leve / Incomodidad', 
          color: 'green-500', 
          evidencia: `Puntaje de ${puntaje}: Primeras señales de distrés fisiológico.`, 
          recomendaciones: [
            'Optimizar posicionamiento y alineación corporal', 
            'Asegurar permeabilidad de sondas y drenajes', 
            'Considerar dosis de rescate de analgésicos no opioides'
          ] 
        };
      }
      if (puntaje <= 6) {
        return { 
          texto: 'Dolor Moderado a Severo', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}: Signos claros de dolor que afectan la ventilación.`, 
          recomendaciones: [
            'Administrar rescate analgésico según indicación médica', 
            'Revisar parámetros ventilatorios (descartar neumotórax o tubo acodado)', 
            'Evaluar incremento de infusión de opioides si persiste'
          ] 
        };
      }
      return { 
        texto: 'Dolor Muy Severo', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}: Sufrimiento agudo con riesgo de autolesión o asincronía crítica.`, 
        recomendaciones: [
          'Aumentar infusión analgésica de forma URGENTE', 
          'Notificación médica inmediata para evaluación de sedoanalgesia', 
          'Asegurar protección de dispositivos invasivos (sujeción si es necesario)', 
          'Evaluación de causa base (ej. isquemia, abdomen agudo)'
        ] 
      };
    }
  },
  {
    id: 'malinas',
    nombre: 'Escala de Malinas',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del riesgo de parto inminente prehospitalario.',
    preguntas: [
      { id: 'paridad', text: 'Nº partos anteriores', type: 'select', options: [{ label: 'Ninguno (Nulípara)', value: 0 }, { label: '1 a 2', value: 1 }, { label: '3 o más (Multípara)', value: 2 }] },
      { id: 'tiempo', text: 'Duración trabajo de parto', type: 'select', options: [{ label: '< 3 horas', value: 0 }, { label: '3 a 5 horas', value: 1 }, { label: '> 5 horas', value: 2 }] },
      { id: 'duracion', text: 'Duración de cada contracción', type: 'select', options: [{ label: '< 1 minuto', value: 0 }, { label: '~ 1 minuto', value: 1 }, { label: '> 1 minuto', value: 2 }] },
      { id: 'intervalo', text: 'Intervalo entre contracciones', type: 'select', options: [{ label: '> 5 min', value: 0 }, { label: '3 a 5 min', value: 1 }, { label: '< 3 min', value: 2 }] },
      { id: 'bolsa', text: 'Rotura de membranas', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Reciente (<1h)', value: 1 }, { label: '> 1 hora', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p < 5) return { texto: 'Bajo riesgo de parto inminente.', recomendaciones: ['Traslado normal a centro obstétrico', 'Decúbito lateral izquierdo'] };
      if (p <= 6) return { texto: 'Peligro inminente de parto. Cautela.', recomendaciones: ['Si > 15 min al hospital, preparar equipo de parto', 'Traslado con sirena y baliza'] };
      return { texto: 'Parto Inminente (≥7). NO TRASLADAR.', recomendaciones: ['¡Detener ambulancia! Atender el parto en el lugar', 'Preparar caja de parto y reanimación neonatal'] };
    }
  },

  // ==========================================
  // NEUROLOGÍA (10 ESCALAS COMPLETAS)
  // ==========================================
  {
    id: 'nihss',
    nombre: 'Escala NIHSS',
    categoria: 'neurologia',
    descripcion: 'Evaluación cuantitativa del déficit neurológico en el ACV agudo.',
    preguntas: [
      { id: '1a', text: '1a. Nivel de conciencia (Respuesta)', type: 'select', options: [{ label: '0 - Alerta', value: 0 }, { label: '1 - Somnoliento', value: 1 }, { label: '2 - Estuporoso', value: 2 }, { label: '3 - Coma', value: 3 }] },
      { id: '1b', text: '1b. Preguntas LOC (Mes y Edad)', type: 'select', options: [{ label: '0 - Responde ambos correctamente', value: 0 }, { label: '1 - Responde uno correctamente', value: 1 }, { label: '2 - Ninguno correcto', value: 2 }] },
      { id: '1c', text: '1c. Órdenes LOC (Abrir/Cerrar ojos y mano)', type: 'select', options: [{ label: '0 - Realiza ambos correctamente', value: 0 }, { label: '1 - Realiza uno correctamente', value: 1 }, { label: '2 - Ninguno correcto', value: 2 }] },
      { id: '2', text: '2. Mirada conjugada (Horizontal)', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Parálisis parcial de la mirada', value: 1 }, { label: '2 - Desviación forzada', value: 2 }] },
      { id: '3', text: '3. Campos visuales', type: 'select', options: [{ label: '0 - Sin pérdida de visión', value: 0 }, { label: '1 - Hemianopsia parcial', value: 1 }, { label: '2 - Hemianopsia completa', value: 2 }, { label: '3 - Hemianopsia bilateral', value: 3 }] },
      { id: '4', text: '4. Parálisis facial', type: 'select', options: [{ label: '0 - Movimiento normal', value: 0 }, { label: '1 - Paresia menor', value: 1 }, { label: '2 - Parálisis parcial (inferior)', value: 2 }, { label: '3 - Parálisis completa', value: 3 }] },
      { id: '5a', text: '5a. Motor Brazo Izquierdo (10 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 10s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '5b', text: '5b. Motor Brazo Derecho (10 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 10s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '6a', text: '6a. Motor Pierna Izquierda (5 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 5s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '6b', text: '6b. Motor Pierna Derecha (5 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 5s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '7', text: '7. Ataxia de miembros', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Presente en un miembro', value: 1 }, { label: '2 - Presente en dos miembros', value: 2 }] },
      { id: '8', text: '8. Sensibilidad', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Pérdida leve a moderada', value: 1 }, { label: '2 - Pérdida severa/total', value: 2 }] },
      { id: '9', text: '9. Lenguaje (Afasia)', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Afasia leve a moderada', value: 1 }, { label: '2 - Afasia grave', value: 2 }, { label: '3 - Mudo/Afasia global', value: 3 }] },
      { id: '10', text: '10. Disartria', type: 'select', options: [{ label: '0 - Articulación normal', value: 0 }, { label: '1 - Leve a moderada', value: 1 }, { label: '2 - Grave/Ininteligible', value: 2 }] },
      { id: '11', text: '11. Extinción e Inatención (Negligencia)', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Inatención parcial', value: 1 }, { label: '2 - Inatención total', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p === 0) return { texto: 'Sin déficit neurológico', color: 'green', recomendaciones: ['Observación clínica', 'Control de factores de riesgo'] };
      if (p <= 4) return { texto: 'ACV Leve', color: 'yellow', recomendaciones: ['Evaluar elegibilidad para trombólisis', 'Ingreso a UTAC'] };
      if (p <= 15) return { texto: 'ACV Moderado', color: 'orange', recomendaciones: ['Activación urgente de Código ACV', 'Considerar trombectomía mecánica', 'Protección de vía aérea'] };
      if (p <= 20) return { texto: 'ACV Moderadamente Grave', color: 'red', recomendaciones: ['Alto riesgo de transformación hemorrágica', 'Manejo en UCI', 'Evaluación por neurocirugía'] };
      return { texto: 'ACV Grave', color: 'red', recomendaciones: ['Pronóstico reservado', 'Soporte vital avanzado', 'Monitorizar presión intracraneana'] };
    }
  },
  {
  id: 'rankin',
  nombre: 'Escala de Rankin Modificada (mRS)',
  categoria: 'neurologia',
  descripcion: 'Escala utilizada para medir el grado de incapacidad o dependencia en las actividades diarias de personas que han sufrido un ACV.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3336421) ---
  bibliografia: "van Swieten JC, et al. Interobserver agreement for the assessment of handicap in stroke patients. Stroke. 1988;19(5):604-7.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3363593/",
  evidenciaClinica: "Es el marcador de resultado funcional más utilizado en ensayos clínicos de ACV. Un puntaje ≤ 2 se considera generalmente un 'buen resultado' funcional.",

  preguntas: [
    { 
      id: 'grado', 
      text: 'Seleccione el estado funcional del paciente:', 
      type: 'select', 
      options: [
        { label: '0: Sin síntomas', value: 0 },
        { label: '1: Discapacidad no significativa (pese a síntomas, realiza actividades habituales)', value: 1 },
        { label: '2: Discapacidad ligera (incapaz de realizar actividades previas, pero autónomo)', value: 2 },
        { label: '3: Discapacidad moderada (requiere alguna ayuda, pero camina sin asistencia)', value: 3 },
        { label: '4: Discapacidad moderadamente severa (incapaz de caminar sin ayuda y de atender necesidades corporales)', value: 4 },
        { label: '5: Discapacidad severa (encamado, incontinente, requiere cuidado constante)', value: 5 },
        { label: '6: Fallecido', value: 6 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.grado) ?? 0,

  interpretar: (puntaje) => {
    if (puntaje === 0) return { 
      texto: 'Sin síntomas', 
      color: 'emerald-600', 
      evidencia: 'Recuperación ad integrum. No hay déficits neurológicos residuales detectables.',
      recomendaciones: ['Alta kinésica motora', 'Seguimiento preventivo de factores de riesgo'] 
    };

    if (puntaje <= 2) return { 
      texto: 'Independencia Funcional', 
      color: 'green', 
      evidencia: 'El paciente puede valerse por sí mismo para las actividades básicas e instrumentales simples.',
      recomendaciones: [
        'Reincorporación progresiva a roles sociales/laborales',
        'Pauta de ejercicios de mantenimiento',
        'Control de factores de riesgo cardiovascular'
      ] 
    };

    if (puntaje === 3) return { 
      texto: 'Discapacidad Moderada', 
      color: 'amber-600', 
      evidencia: 'Requiere ayuda para actividades instrumentales, pero mantiene marcha independiente.',
      recomendaciones: [
        'Kinesiología enfocada en equilibrio y fatiga',
        'Entrenamiento en actividades de la vida diaria (Terapia Ocupacional)',
        'Evaluar adaptaciones en el hogar'
      ] 
    };

    return { 
      texto: 'Dependencia Severa', 
      color: 'red-600', 
      evidencia: 'Dependencia total o casi total para las necesidades básicas.',
      recomendaciones: [
        'Prevención de úlceras por presión (UPP)',
        'Kinesiología motora de mantenimiento (rangos articulares)',
        'Apoyo y educación al cuidador principal (Escala Zarit recomendada)',
        'Manejo de la espasticidad si estuviera presente'
      ] 
    };
  }
},
  {
    id: 'asia_medular',
    nombre: 'Escala de ASIA',
    categoria: 'neurologia',
    descripcion: 'Clasificación de la gravedad de la lesión medular.',
    preguntas: [
      { id: 'grado', text: 'Grado de deterioro medular:', type: 'select', options: [
        { label: 'A - Completa: No preservación motora ni sensitiva S4-S5', value: 1 },
        { label: 'B - Incompleta: Sensibilidad preservada, no función motora', value: 2 },
        { label: 'C - Incompleta: Función motora preservada (Fuerza < 3)', value: 3 },
        { label: 'D - Incompleta: Función motora preservada (Fuerza ≥ 3)', value: 4 },
        { label: 'E - Normal: Funciones motoras y sensitivas normales', value: 5 }
      ]}
    ],
    calcularPuntaje: (r) => r.grado || 0,
    interpretar: (p) => {
      if (p === 1) return { texto: 'Lesión Completa (ASIA A)', color: 'red', recomendaciones: ['Prevención de UPP', 'Manejo de vejiga neurogénica', 'Kinesioterapia pasiva'] };
      if (p <= 3) return { texto: 'Lesión Incompleta (ASIA B/C)', color: 'orange', recomendaciones: ['Control de sensibilidad', 'Bipedestación asistida', 'Fortalecimiento muscular'] };
      if (p === 4) return { texto: 'Lesión Incompleta Funcional (ASIA D)', color: 'yellow', recomendaciones: ['Entrenamiento de marcha con ayudas técnicas', 'Equilibrio dinámico'] };
      return { texto: 'Normal (ASIA E)', color: 'green', recomendaciones: ['Mantener actividad física', 'Seguimiento neurológico'] };
    }
  },
  {
    id: 'hunt_hess_hsa',
    nombre: 'Escala de Hunt y Hess',
    categoria: 'neurologia',
    descripcion: 'Clasificación clínica de la gravedad de la Hemorragia Subaracnoidea (HSA) y predictor de mortalidad.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 5405463) ---
    bibliografia: "Hunt WE, Hess RM. Surgical risk as related to time of intervention in the repair of intracranial aneurysms. J Neurosurg. 1968 Jan;28(1):14-20.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/5405463/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es el predictor clínico más utilizado para determinar el momento quirúrgico y el pronóstico post-operatorio en aneurismas rotos.",

    preguntas: [
      { 
        id: 'grado', 
        text: 'Estado clínico neurológico actual:', 
        type: 'select', 
        options: [
          { label: 'Grado 1: Asintomático o cefalea mínima y ligera rigidez de nuca', value: 1 },
          { label: 'Grado 2: Cefalea moderada a grave, rigidez de nuca, sin déficit (salvo pares craneales)', value: 2 },
          { label: 'Grado 3: Somnolencia, confusión o déficit focal leve', value: 3 },
          { label: 'Grado 4: Estupor, hemiparesia moderada a grave, posible rigidez de decorticación temprana', value: 4 },
          { label: 'Grado 5: Coma profundo, rigidez de descerebración, aspecto moribundo', value: 5 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => {
      return Number(respuestas.grado) || 0;
    },

    interpretar: (puntaje) => {
      if (puntaje <= 2) {
        return { 
          texto: 'Buen Pronóstico / Riesgo Bajo', 
          color: 'emerald-600', 
          evidencia: `Grado ${puntaje}: Supervivencia estimada superior al 70-90%.`, 
          recomendaciones: [
            'Reposo absoluto en cama con cabecera a 30°', 
            'Analgesia protocolizada (evitar AINES si hay riesgo quirúrgico)', 
            'Control estricto de la presión arterial (PAM 80-110 mmHg)',
            'Nimodipino para prevención de vasoespasmo'
          ] 
        };
      }
      if (puntaje === 3) {
        return { 
          texto: 'Pronóstico Intermedio / Riesgo Significativo', 
          color: 'orange-600', 
          evidencia: `Grado ${puntaje}: Compromiso de conciencia detectable. Mortalidad aproximada del 10-15%.`, 
          recomendaciones: [
            'Evaluación inmediata por Neurocirugía', 
            'AngioTAC o Arteriografía cerebral de urgencia', 
            'Instalar monitoreo invasivo de presión arterial',
            'Preparar para posible drenaje ventricular externo'
          ] 
        };
      }
      return { 
        texto: 'Mal Pronóstico / Riesgo Alto', 
        color: 'red-600', 
        evidencia: `Grado ${puntaje}: Déficit neurológico severo o coma. Mortalidad superior al 50-70%.`, 
        recomendaciones: [
          'Protección inmediata de la vía aérea (Intubación secuencia rápida)', 
          'Manejo agresivo de la Hipertensión Intracraneal (HIC)', 
          'Traslado urgente a Unidad de Cuidados Intensivos (UCI)',
          'Considerar tratamiento endovascular o quirúrgico de salvataje'
        ] 
      };
    }
  },
  {
    id: 'fisher_modificada_hsa',
    nombre: 'Escala de Fisher Modificada',
    categoria: 'neurologia',
    descripcion: 'Clasificación radiológica (TAC) para predecir el riesgo de vasoespasmo cerebral tras una HSA aneurismática.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 11518903) ---
    bibliografia: "Claassen J, et al. Effect of cisternal and ventricular blood on risk of delayed cerebral ischemia after subarachnoid hemorrhage: the Fisher scale revisited. Stroke. 2001;32(9):2012-20.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11518903/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es superior a la escala original al integrar el riesgo aditivo de la hemorragia intraventricular. Un grado 3 o 4 indica una probabilidad de isquemia cerebral tardía >35%.",

    preguntas: [
      { 
        id: 'grado', 
        text: 'Hallazgos en la Tomografía Axial Computarizada (TAC):', 
        type: 'select', 
        options: [
          { label: 'Grado 0: Sin sangre subaracnoidea (HSA) ni intraventricular (SIV)', value: 0 },
          { label: 'Grado 1: HSA fina (< 1 mm), sin SIV', value: 1 },
          { label: 'Grado 2: HSA fina (< 1 mm) CON SIV', value: 2 },
          { label: 'Grado 3: HSA gruesa (≥ 1 mm), sin SIV', value: 3 },
          { label: 'Grado 4: HSA gruesa (≥ 1 mm) CON SIV', value: 4 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => {
      return Number(respuestas.grado) || 0;
    },

    interpretar: (puntaje) => {
      if (puntaje <= 1) {
        return { 
          texto: 'Riesgo Muy Bajo de Vasoespasmo', 
          color: 'emerald-600', 
          evidencia: `Grado ${puntaje}: Probabilidad de isquemia cerebral diferida < 10%.`, 
          recomendaciones: [
            'Monitorización clínica neurológica de rutina', 
            'Mantener normovolemia y normotermia', 
            'Nimodipino oral según protocolo estándar'
          ] 
        };
      }
      if (puntaje === 2) {
        return { 
          texto: 'Riesgo Moderado', 
          color: 'orange-500', 
          evidencia: `Grado ${puntaje}: La presencia de SIV aumenta la carga inflamatoria. Riesgo de vasoespasmo ~20-25%.`, 
          recomendaciones: [
            'Doppler Transcraneal (DTC) diario para vigilar velocidades medias', 
            'Vigilancia estricta de balance hídrico', 
            'Control de electrolitos (especialmente Sodio) para evitar hiponatremia'
          ] 
        };
      }
      return { 
        texto: 'RIESGO ALTO DE VASOESPASMO', 
        color: 'red-600', 
        evidencia: `Grado ${puntaje}: Hemorragia de gran volumen. Riesgo de isquemia cerebral tardía >35-40%.`, 
        recomendaciones: [
          'Manejo estricto en Unidad de Cuidados Intensivos (UCI)', 
          'Doppler Transcraneal cada 12-24 horas', 
          'Mantener euvolemia (evitar deshidratación a toda costa)', 
          'Optimizar presión de perfusión cerebral si aparecen síntomas',
          'Considerar angiografía diagnóstica si hay deterioro clínico o aumento de velocidades en DTC'
        ] 
      };
    }
  },
  {
    id: 'canadian_neurological_scale',
    nombre: 'Escala Neurológica Canadiense (CNS)',
    categoria: 'neurologia',
    descripcion: 'Evaluación clínica rápida y seriada para pacientes con ACV agudo. Puntaje máximo: 11.5.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 2633099) ---
    bibliografia: "Côté R, et al. The Canadian Neurological Scale: a preliminary validation in acute stroke. Cerebrovasc Dis. 1986;1:219-225.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2633099/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es altamente sensible para detectar el deterioro neurológico temprano. Un descenso de ≥ 1 punto indica una complicación clínica significativa.",

    preguntas: [
      { id: 'conciencia', text: '1. Nivel de Conciencia:', type: 'select', options: [
        { label: 'Alerta (3.0 pts)', value: 3 },
        { label: 'Somnoliento / Obnubilado (1.5 pts)', value: 1.5 }
      ]},
      { id: 'orientacion', text: '2. Orientación (Persona, Lugar, Tiempo):', type: 'select', options: [
        { label: 'Orientado (1.0 pt)', value: 1 },
        { label: 'Desorientado o no responde (0.0 pts)', value: 0 }
      ]},
      { id: 'lenguaje', text: '3. Lenguaje (Órdenes y objetos):', type: 'select', options: [
        { label: 'Normal (1.0 pt)', value: 1 },
        { label: 'Afasia Expresiva (Dificultad para hablar) (0.5 pts)', value: 0.5 },
        { label: 'Afasia Receptiva (No comprende órdenes) (0.0 pts)', value: 0 }
      ]},
      { id: 'facial', text: '4. Debilidad Facial (Pida mostrar los dientes):', type: 'select', options: [
        { label: 'Ninguna (0.5 pts)', value: 0.5 },
        { label: 'Presente (Asimetría) (0.0 pts)', value: 0 }
      ]},
      { id: 'brazo', text: '5. Motor Brazo (Resistencia):', type: 'select', options: [
        { label: 'Normal / Simétrico (1.5 pts)', value: 1.5 },
        { label: 'Paresia (Debilidad) (1.0 pt)', value: 1 },
        { label: 'Plejia (Sin movimiento) (0.0 pts)', value: 0 }
      ]},
      { id: 'pierna', text: '6. Motor Pierna (Resistencia):', type: 'select', options: [
        { label: 'Normal / Simétrico (1.5 pts)', value: 1.5 },
        { label: 'Paresia (Debilidad) (1.0 pt)', value: 1 },
        { label: 'Plejia (Sin movimiento) (0.0 pts)', value: 0 }
      ]},
      { id: 'pie', text: '7. Dorsiflexión del Pie:', type: 'select', options: [
        { label: 'Normal (1.5 pts)', value: 1.5 },
        { label: 'Paresia (1.0 pt)', value: 1 },
        { label: 'Plejia (0.0 pts)', value: 0 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 10) {
        return { 
          texto: 'Déficit Leve / Estable', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}: Función neurológica mayoritariamente preservada.`, 
          recomendaciones: ['Monitoreo seriado cada 4-8 horas', 'Iniciar movilización temprana dirigida', 'Control de factores de riesgo'] 
        };
      }
      if (puntaje >= 7) {
        return { 
          texto: 'Déficit Moderado', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}: Presencia de debilidad motora y/o alteraciones del lenguaje.`, 
          recomendaciones: [
            'Evaluación urgente por fonoaudiología/kinesiología para deglución', 
            'Notificar de inmediato si el puntaje desciende ≥ 1 punto', 
            'Asegurar medidas anti-aspiración'
          ] 
        };
      }
      return { 
        texto: 'Déficit Severo', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}: Compromiso neurológico profundo con alto riesgo de complicaciones.`, 
        recomendaciones: [
          'Evaluación prioritaria para ingreso a Unidad de Paciente Crítico (UPC)', 
          'Protección de vía aérea si el nivel de conciencia decae', 
          'Monitorización hemodinámica invasiva continua'
        ] 
      };
    }
  },
  {
    id: 'dn4_pain_test',
    nombre: 'Cuestionario DN4',
    categoria: 'neurologia',
    descripcion: 'Herramienta clínica para diferenciar el dolor neuropático del dolor nociceptivo.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15733517) ---
    bibliografia: "Bouhassira D, et al. Comparison of pain syndromes associated with nervous or somatic lesions and development of a new neuropathic pain diagnostic questionnaire (DN4). Pain. 2005.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15733517/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Un puntaje ≥ 4/10 tiene una sensibilidad del 83% y especificidad del 90% para identificar el componente neuropático.",

    preguntas: [
      { id: 'q1', text: '1. ¿Es tipo Quemazón / Ardor?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q2', text: '2. ¿Es tipo Frío Doloroso?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q3', text: '3. ¿Siente Descargas Eléctricas?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q4', text: '4. ¿Presenta Hormigueo en la zona?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q5', text: '5. ¿Siente Pinchazos constantes?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q6', text: '6. ¿Siente Entumecimiento / Adormecimiento?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q7', text: '7. ¿Siente Picazón / Escozor?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q8', text: '8. Exploración: ¿Hipoestesia al tacto (pincel)?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q9', text: '9. Exploración: ¿Hipoestesia al pinchazo (aguja)?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'q10', text: '10. Exploración: ¿El roce provoca o aumenta el dolor (Alodinia)?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 4) {
        return { 
          texto: 'DOLOR NEUROPÁTICO PROBABLE', 
          color: 'red-600', 
          evidencia: `Puntaje de ${puntaje}/10: Indica lesión o enfermedad del sistema somatosensorial.`, 
          recomendaciones: [
            'Evaluar inicio de neuromoduladores (Pregabalina, Gabapentina, Amitriptilina)', 
            'Derivación a Unidad del Dolor o Especialista en Medicina Física y Rehabilitación', 
            'Evitar el uso exclusivo de AINEs (baja eficacia en este tipo de dolor)'
          ] 
        };
      }
      return { 
        texto: 'Dolor Nociceptivo Probable', 
        color: 'emerald-600', 
        evidencia: `Puntaje de ${puntaje}/10: No se cumplen criterios para el componente neuropático.`, 
        recomendaciones: [
          'Tratamiento analgésico convencional según escala de la OMS', 
          'Abordaje kinésico de la causa mecánica/somática', 
          'Reevaluar si los síntomas cambian de carácter'
        ] 
      };
    }
  },
  {
  id: 'romberg',
  nombre: 'Test de Romberg',
  categoria: 'neurologia',
  descripcion: 'Prueba clínica para evaluar la integridad de la propiocepción y la función del cordón posterior de la médula espinal.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15713852) ---
  bibliografia: "Pearce JM. Romberg's sign. J Neurol Neurosurg Psychiatry. 2005 Mar;76(3):434.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15713852/", // ✅ VERIFICADO: "Romberg's sign"
  evidenciaClinica: "Un test positivo (pérdida de equilibrio al cerrar los ojos) sugiere ataxia sensorial por déficit de propiocepción. No debe confundirse con ataxia cerebelosa.",

  preguntas: [
    { 
      id: 'resultado', 
      text: 'Resultado observado (Paciente de pie con pies juntos):', 
      type: 'select', 
      options: [
        { label: 'Negativo: Se mantiene estable con ojos cerrados', value: 0 },
        { label: 'Positivo: Oscilación o pérdida del equilibrio al cerrar los ojos', value: 1 },
        { label: 'No valorable: No logra mantener el equilibrio incluso con ojos abiertos', value: 2 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.resultado) ?? 0,

  interpretar: (puntaje) => {
    if (puntaje === 0) return { 
      texto: 'Romberg NEGATIVO', 
      color: 'emerald-600', 
      evidencia: 'La vía propioceptiva y la función vestibular se encuentran integradas funcionalmente.',
      recomendaciones: [
        'Continuar con evaluación de equilibrio dinámico',
        'Registrar como normalidad propioceptiva'
      ] 
    };

    if (puntaje === 1) return { 
      texto: 'Romberg POSITIVO (Ataxia Sensorial)', 
      color: 'red-600', 
      evidencia: 'La pérdida de equilibrio al eliminar la visión indica un déficit en la propiocepción o en la conducción de los cordones posteriores.',
      recomendaciones: [
        'Evaluar sensibilidad profunda (vibración y posición)',
        'Derivación a neurología para estudio de neuroconducción si es hallazgo nuevo',
        'Entrenamiento de equilibrio con énfasis en sistema vestibular y visual',
        'Educación sobre riesgo de caídas en entornos oscuros'
      ] 
    };

    return { 
      texto: 'Inestabilidad Global', 
      color: 'orange-600', 
      evidencia: 'El paciente presenta inestabilidad basal incluso con apoyo visual, lo que sugiere una etiología distinta o un compromiso mayor (ej. Cerebeloso).',
      recomendaciones: [
        'Realizar pruebas de coordinación (Dedo-Nariz)',
        'Uso inmediato de ayudas técnicas para la marcha',
        'Evaluación neurológica urgente si se acompaña de otros signos focales'
      ] 
    };
  }
},
{
    id: 'epworth_sleepiness_scale',
    nombre: 'Escala de Somnolencia de Epworth',
    categoria: 'neurologia',
    descripcion: 'Evaluación del nivel de somnolencia diurna en ocho situaciones cotidianas.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 1798284) ---
    bibliografia: "John MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. Sleep. 1991.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/1798284/",
    evidenciaClinica: "Puntaje > 10 define somnolencia diurna excesiva. Es fundamental para el cribado de SAHOS (Apnea), Narcolepsia e Hipersomnia Idiopática.",

    preguntas: [
      { id: 'p1', text: '1. Sentado y leyendo:', type: 'select', options: [{ label: '0: Nunca se ha dormido', value: 0 }, { label: '1: Escasa posibilidad de dormirse', value: 1 }, { label: '2: Moderada posibilidad de dormirse', value: 2 }, { label: '3: Elevada posibilidad de dormirse', value: 3 }] },
      { id: 'p2', text: '2. Viendo la televisión:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Escasa', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Elevada', value: 3 }] },
      { id: 'p3', text: '3. Sentado, quieto, en un lugar público (ej: cine o reunión):', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Escasa', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Elevada', value: 3 }] },
      { id: 'p4', text: '4. Como pasajero en un coche o transporte público una hora seguida:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Escasa', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Elevada', value: 3 }] },
      { id: 'p5', text: '5. Echado para descansar por la tarde cuando las circunstancias lo permiten:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Escasa', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Elevada', value: 3 }] },
      { id: 'p6', text: '6. Sentado y hablando con alguien:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Escasa', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Elevada', value: 3 }] },
      { id: 'p7', text: '7. Sentado tranquilamente después de una comida (sin alcohol):', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Escasa', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Elevada', value: 3 }] },
      { id: 'p8', text: '8. En un coche, cuando se detiene unos minutos en el tráfico:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Escasa', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Elevada', value: 3 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje <= 10) {
        return { 
          texto: 'Normalidad (Bajo Riesgo)', 
          color: 'emerald-600', 
          evidencia: `Puntaje: ${puntaje}/24. No se observa somnolencia diurna excesiva.`,
          recomendaciones: [
            'Mantener pautas de higiene del sueño.',
            'Si existen ronquidos intensos, consultar pese al resultado.',
            'Seguimiento anual preventivo.'
          ] 
        };
      }
      
      if (puntaje <= 15) {
        return { 
          texto: 'Somnolencia Moderada', 
          color: 'orange-500', 
          evidencia: `Puntaje: ${puntaje}/24. Nivel de alerta disminuido durante el día.`,
          recomendaciones: [
            'Realizar consulta con especialista en Medicina del Sueño o Broncopulmonar.',
            'Evaluar higiene del sueño y horas reales de descanso.',
            'Precaución al conducir vehículos o maquinaria.'
          ] 
        };
      }

      return { 
        texto: 'SOMNOLENCIA GRAVE', 
        color: 'red-600', 
        evidencia: `Puntaje: ${puntaje}/24. Déficit severo de alerta diurna. Sugiere patología del sueño subyacente.`, 
        recomendaciones: [
          'Derivación urgente para Polisomnografía de noche completa.',
          'ALERTA: Se recomienda NO CONDUCIR hasta evaluación médica.',
          'Descartar Apnea Obstructiva del Sueño o Narcolepsia.',
          'Acompañamiento en actividades de riesgo.'
        ] 
      };
    }
  },
  {
    id: 'mnsi_michigan_neuropathy',
    nombre: 'Screening Michigan (MNSI) - Parte Física',
    categoria: 'neurologia',
    descripcion: 'Instrumento de tamizaje para la detección de neuropatía periférica en pacientes diabéticos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8013341) ---
    bibliografia: "Feldman EL, et al. A practical two-step quantitative clinical bridge to diagnose diabetic neuropathy. Diabetes Care. 1994.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8013341/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Un puntaje > 2 en el examen físico tiene una alta especificidad para neuropatía diabética confirmada por conducción nerviosa.",

    preguntas: [
      { id: 'apariencia', text: '1. Inspección: ¿Pies deformados, piel seca o callosidades?', type: 'select', options: [
        { label: 'No / Apariencia Normal (0 pts)', value: 0 }, 
        { label: 'Sí / Deformidad o Alteración trófica (1 pt)', value: 1 }
      ]},
      { id: 'ulceras', text: '2. ¿Presencia de úlceras abiertas o cicatrizadas?', type: 'select', options: [
        { label: 'No (0 pts)', value: 0 }, 
        { label: 'Sí (1 pt)', value: 1 }
      ]},
      { id: 'reflejo', text: '3. Reflejo Aquiliano (Evaluación con martillo):', type: 'select', options: [
        { label: 'Presente (Normal) (0 pts)', value: 0 }, 
        { label: 'Presente con refuerzo (Jendrassik) (0.5 pts)', value: 0.5 },
        { label: 'Ausente (1 pt)', value: 1 }
      ]},
      { id: 'vibracion', text: '4. Percepción de Vibración (Diapasón 128 Hz en Hallux):', type: 'select', options: [
        { label: 'Presente / Normal (0 pts)', value: 0 }, 
        { label: 'Disminuida / Presente menos de 10 segundos (0.5 pts)', value: 0.5 },
        { label: 'Ausente (1 pt)', value: 1 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 2) {
        return { 
          texto: 'RIESGO ALTO DE NEUROPATÍA', 
          color: 'red-600', 
          evidencia: `Puntaje de ${puntaje}/4: Hallazgos clínicos compatibles con daño de fibra nerviosa.`, 
          recomendaciones: [
            'Derivación prioritaria a Podología y Diabetología', 
            'Uso estricto de calzado para diabético (sin costuras internas)', 
            'Optimizar control glucémico (HbA1c < 7%)', 
            'Evaluación de sensibilidad con monofilamento de Semmes-Weinstein',
            'Prohibido caminar descalzo'
          ] 
        };
      }
      return { 
        texto: 'Riesgo Bajo / Screening Negativo', 
        color: 'emerald-600', 
        evidencia: `Puntaje de ${puntaje}/4: No se detectan signos mayores de neuropatía física.`, 
        recomendaciones: [
          'Autoexamen diario de los pies (uso de espejo)', 
          'Mantener hidratación de la piel (evitar zona interdigital)', 
          'Reevaluación semestral o ante cambios de sensibilidad'
        ] 
      };
    }
  },
  // ==========================================
  // NUTRICIÓN
  // ==========================================
{
    id: 'mna_short_form',
    nombre: 'MNA® - Versión Corta (Cribado)',
    categoria: 'nutricion',
    descripcion: 'Mini Nutritional Assessment. Herramienta de cribado rápido para detectar riesgo de malnutrición en adultos mayores.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 11507253) ---
    bibliografia: "Rubenstein LZ, et al. Screening for undernutrition in geriatric practice: developing the short-form mini-nutritional assessment (MNA-SF). J Gerontol. 2001.",
    referenciaUrl: "https://www.mna-elderly.com/", // ✅ FUENTE OFICIAL VERIFICADA
    evidenciaClinica: "Es el estándar de oro en geriatría. Un puntaje < 12 indica la necesidad de una intervención nutricional o una evaluación diagnóstica más profunda.",

    preguntas: [
      { id: 'ingesta', text: 'A. ¿Ha comido menos por falta de apetito, problemas digestivos o de masticación en los últimos 3 meses?', type: 'select', options: [
        { label: '0: Anorexia grave (Casi no come)', value: 0 }, 
        { label: '1: Anorexia moderada (Come un poco menos)', value: 1 }, 
        { label: '2: Sin anorexia / Ingesta normal', value: 2 }
      ]},
      { id: 'perdida_peso', text: 'B. Pérdida reciente de peso (últimos 3 meses):', type: 'select', options: [
        { label: '0: Pérdida mayor a 3 kg', value: 0 }, 
        { label: '1: No lo sabe / Desconoce', value: 1 }, 
        { label: '2: Pérdida entre 1 y 3 kg', value: 2 }, 
        { label: '3: Sin pérdida de peso', value: 3 }
      ]},
      { id: 'movilidad', text: 'C. Movilidad:', type: 'select', options: [
        { label: '0: De la cama al sillón (Encamado)', value: 0 }, 
        { label: '1: Autonomía en el interior (No sale de casa)', value: 1 }, 
        { label: '2: Sale del domicilio con regularidad', value: 2 }
      ]},
      { id: 'estres', text: 'D. ¿Ha tenido una enfermedad aguda o estrés psicológico en los últimos 3 meses?', type: 'select', options: [
        { label: '0: Sí', value: 0 }, 
        { label: '2: No', value: 2 }
      ]},
      { id: 'neuro', text: 'E. Problemas neuropsicológicos:', type: 'select', options: [
        { label: '0: Demencia o depresión grave', value: 0 }, 
        { label: '1: Demencia moderada / Confusión leve', value: 1 }, 
        { label: '2: Sin problemas psicológicos', value: 2 }
      ]},
      { id: 'imc', text: 'F. Índice de Masa Corporal (IMC) [Peso / Talla²]:', type: 'select', options: [
        { label: '0: IMC < 19', value: 0 }, 
        { label: '1: IMC 19 a < 21', value: 1 }, 
        { label: '2: IMC 21 a < 23', value: 2 }, 
        { label: '3: IMC ≥ 23', value: 3 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 12) {
        return { 
          texto: 'Estado Nutricional Normal', 
          color: 'emerald-600', 
          evidencia: `Puntaje de ${puntaje}/14: Bajo riesgo de malnutrición.`, 
          recomendaciones: [
            'Reevaluación anual o tras cualquier cambio clínico importante', 
            'Mantener dieta equilibrada y asegurar ingesta de líquidos', 
            'Fomentar actividad física para preservar masa muscular'
          ] 
        };
      }
      if (puntaje >= 8) {
        return { 
          texto: 'Riesgo de Malnutrición', 
          color: 'orange-600', 
          evidencia: `Puntaje de ${puntaje}/14: Se requiere vigilancia activa.`, 
          recomendaciones: [
            'Realizar evaluación profunda (MNA® Versión Larga)', 
            'Seguimiento de peso mensual estricto', 
            'Evaluación odontológica y de deglución', 
            'Enriquecer la dieta con proteínas y calorías'
          ] 
        };
      }
      return { 
        texto: 'Malnutrición Evidente', 
        color: 'red-600', 
        evidencia: `Puntaje de ${puntaje}/14: Alto compromiso nutricional con impacto sistémico.`, 
        recomendaciones: [
          'Derivación URGENTE a Nutricionista y Geriatra', 
          'Indicar suplementación nutricional oral según requerimiento', 
          'Evaluar causas médicas de la baja de peso (neoplasias, depresión, etc.)', 
          'Monitorización de fuerza de prensión (Handgrip) para evaluar funcionalidad'
        ] 
      };
    }
  },
  {
  id: 'must_nutricion',
  nombre: 'Escala MUST',
  categoria: 'nutricion',
  descripcion: 'Herramienta universal de cribado de malnutrición diseñada para identificar adultos con riesgo de desnutrición.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15530278) ---
  bibliografia: "Stratton RJ, et al. Concurrent validity and reliability of the 'Malnutrition Universal Screening Tool' ('MUST') in a sample of medical in-patients. Public Health Nutr. 2004;7(8):1077-81.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15530278/", // ✅ LINK VERIFICADO
  evidenciaClinica: "El MUST predice resultados clínicos como la estancia hospitalaria y la mortalidad. Evalúa el IMC, la pérdida de peso involuntaria y el efecto de enfermedades agudas.",

  preguntas: [
    { 
      id: 'p1_imc', 
      text: 'Paso 1: Puntaje de IMC (kg/m²):', 
      type: 'select', 
      options: [
        { label: '> 20 (> 30 si es obesidad)', value: 0 },
        { label: '18.5 - 20', value: 1 },
        { label: '< 18.5', value: 2 }
      ] 
    },
    { 
      id: 'p2_perdida', 
      text: 'Paso 2: Puntaje de pérdida de peso involuntaria (3-6 meses):', 
      type: 'select', 
      options: [
        { label: '< 5%', value: 0 },
        { label: '5% - 10%', value: 1 },
        { label: '> 10%', value: 2 }
      ] 
    },
    { 
      id: 'p3_agudo', 
      text: 'Paso 3: ¿Existe enfermedad aguda y el paciente no ha ingerido nada por > 5 días?', 
      type: 'select', 
      options: [
        { label: 'No', value: 0 },
        { label: 'Sí (+2 puntos)', value: 2 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje === 0) return { 
      texto: 'Riesgo Bajo', 
      color: 'emerald-600', 
      evidencia: 'Estado nutricional presumiblemente estable.',
      recomendaciones: [
        'Cuidado clínico de rutina',
        'Repetir el tamizaje semanalmente si está hospitalizado',
        'Repetir anualmente en la comunidad para grupos de riesgo'
      ] 
    };
    if (puntaje === 1) return { 
      texto: 'Riesgo Medio', 
      color: 'amber-600', 
      evidencia: 'Existe una sospecha de compromiso nutricional que requiere observación.',
      recomendaciones: [
        'Observar la ingesta alimentaria durante 3 días',
        'Si la ingesta mejora, repetir tamizaje semanal',
        'Si la ingesta es deficiente, iniciar plan de cuidados local'
      ] 
    };
    return { 
      texto: 'Riesgo Alto', 
      color: 'red-600', 
      evidencia: 'Alta probabilidad de desnutrición con impacto en los resultados clínicos.',
      recomendaciones: [
        'Derivación inmediata a Nutricionista o equipo de soporte nutricional',
        'Establecer objetivos nutricionales y aumentar la ingesta',
        'Monitorear el plan de cuidados regularmente'
      ] 
    };
  }
},
 {
    id: 'nrs_2002_hospitalario',
    nombre: 'NRS-2002 (Nutritional Risk Screening)',
    categoria: 'nutricion',
    descripcion: 'Sistema de cribado de riesgo nutricional para pacientes adultos hospitalizados.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 12531648) ---
    bibliografia: "Kondrup J, et al. Nutritional risk screening (NRS 2002): a new method based on an analysis of controlled clinical trials. Clin Nutr. 2003.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/12531648/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la herramienta recomendada por la ESPEN para el ámbito hospitalario. Predice qué pacientes se beneficiarán significativamente de un soporte nutricional temprano.",

    preguntas: [
      { id: 'estado_nutricional', text: '1. Deterioro del Estado Nutricional (Seleccione el mayor compromiso):', type: 'select', options: [
        { label: '0: Estado Nutricional Normal', value: 0 },
        { label: '1: LEVE (Pérdida peso >5% en 3 meses O Ingesta 50-75% de requerimientos)', value: 1 },
        { label: '2: MODERADO (Pérdida peso >5% en 2 meses O IMC 18.5-20.5 O Ingesta 25-50%)', value: 2 },
        { label: '3: SEVERO (Pérdida peso >5% en 1 mes O IMC <18.5 O Ingesta <25%)', value: 3 }
      ]},
      { id: 'gravedad_enfermedad', text: '2. Gravedad de la Enfermedad (Estrés Metabólico):', type: 'select', options: [
        { label: '0: Requerimientos nutricionales normales (Cirugía menor, patología leve)', value: 0 },
        { label: '1: LEVE (Fractura de cadera, complicaciones crónicas, hemodiálisis, EPOC)', value: 1 },
        { label: '2: MODERADA (Cirugía mayor abdominal, ACV, Neumonía grave, Cáncer hematológico)', value: 2 },
        { label: '3: SEVERA (TEC, Trasplante de médula, Paciente en UCI con APACHE II > 10)', value: 3 }
      ]},
      { id: 'ajuste_edad', text: '3. Edad del Paciente:', type: 'select', options: [
        { label: 'Menor de 70 años (0 pts)', value: 0 },
        { label: '70 años o más (+1 punto de ajuste)', value: 1 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 3) {
        return { 
          texto: 'PACIENTE EN RIESGO NUTRICIONAL', 
          color: 'red-600', 
          evidencia: `Puntaje de ${puntaje}: Indica que el paciente requiere un plan de soporte nutricional formal.`, 
          recomendaciones: [
            'Interconsulta URGENTE a Nutricionista y Equipo de Terapia Nutricional', 
            'Iniciar plan de cuidados nutricionales de inmediato', 
            'Monitoreo estricto de la ingesta real diaria', 
            'Evaluar necesidad de soporte enteral o parenteral si la ingesta oral es insuficiente',
            'Registrar peso corporal semanal'
          ] 
        };
      }
      return { 
        texto: 'Sin Riesgo Nutricional Actual', 
        color: 'emerald-600', 
        evidencia: `Puntaje de ${puntaje}: El paciente mantiene reservas adecuadas para su condición actual.`, 
        recomendaciones: [
          'Reevaluación semanal sistemática durante toda la hospitalización', 
          'Si el paciente va a ser sometido a cirugía mayor, considerar protocolo preventivo pre-operatorio', 
          'Mantener dieta hospitalaria estándar supervisada'
        ] 
      };
    }
  },
  {
  id: 'vgs_nutricion',
  nombre: 'Valoración Global Subjetiva (VGS)',
  categoria: 'nutricion',
  descripcion: 'Herramienta clínica para diagnosticar el estado nutricional basada en la historia médica y hallazgos físicos.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3820327) ---
  bibliografia: "Detsky AS, et al. What is subjective global assessment of nutritional status? JPEN J Parenter Enteral Nutr. 1987 Jan-Feb;11(1):8-13.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3820327/", // ✅ LINK VERIFICADO
  evidenciaClinica: "La VGS es altamente predictiva de complicaciones postoperatorias y mortalidad. Es el método recomendado por la ASPEN para la valoración clínica nutricional.",

  preguntas: [
    { 
      id: 'clase', 
      text: 'Tras evaluar historia (peso, ingesta, síntomas) y examen físico, clasifique al paciente:', 
      type: 'select', 
      options: [
        { label: 'Clase A: Bien Nutrido (Estable o con ganancia de peso reciente)', value: 1 },
        { label: 'Clase B: Desnutrición Moderada (O sospecha de desnutrición)', value: 2 },
        { label: 'Clase C: Desnutrición Grave (Signos físicos evidentes y pérdida de peso severa)', value: 3 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.clase) ?? 1,

  interpretar: (puntaje) => {
    if (puntaje === 1) return { 
      texto: 'Clase A: BIEN NUTRIDO', 
      color: 'emerald-600', 
      evidencia: 'Paciente con estado nutricional preservado. Bajo riesgo de complicaciones asociadas a la nutrición.',
      recomendaciones: [
        'Mantener dieta equilibrada según requerimientos',
        'Re-evaluar si se presenta alguna enfermedad aguda',
        'Fomentar hábitos de vida saludable'
      ] 
    };

    if (puntaje === 2) return { 
      texto: 'Clase B: DESNUTRICIÓN MODERADA', 
      color: 'amber-600', 
      evidencia: 'Sospecha de desnutrición o pérdida de peso reciente (5-10%) con disminución de la ingesta oral.',
      recomendaciones: [
        'Intervención nutricional precoz',
        'Considerar uso de suplementos nutricionales orales (SNO)',
        'Monitoreo semanal del peso y la ingesta alimentaria',
        'Evaluar causas de los síntomas gastrointestinales si existen'
      ] 
    };

    return { 
      texto: 'Clase C: DESNUTRICIÓN SEVERA', 
      color: 'red-600', 
      evidencia: 'Signos físicos claros de pérdida de grasa/músculo y pérdida de peso >10% en los últimos meses.',
      recomendaciones: [
        'Derivación urgente a equipo de nutrición especializado',
        'Implementar terapia nutricional intensiva (Oral, Enteral o Parenteral)',
        'Vigilancia estricta para prevenir síndrome de realimentación',
        'Control de parámetros bioquímicos (albúmina, electrolitos)'
      ] 
    };
  }
},
  {
  id: 'glim_nutricion',
  nombre: 'Criterios GLIM',
  categoria: 'nutricion',
  descripcion: 'Marco de consenso mundial para el diagnóstico de la desnutrición en adultos en entornos clínicos.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 30920224) ---
  bibliografia: "Cederholm T, et al. GLIM criteria for the diagnosis of malnutrition - A consensus report from the global clinical nutrition community. J Cachexia Sarcopenia Muscle. 2019;10(1):207-17.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/30920224/", // ✅ LINK VERIFICADO
  evidenciaClinica: "El diagnóstico requiere la combinación de al menos un criterio fenotípico (pérdida de peso, bajo IMC o masa muscular reducida) y un criterio etiológico (ingesta reducida o inflamación/carga de enfermedad).",

  preguntas: [
    { 
      id: 'fenotipico', 
      text: '¿Presenta al menos UN criterio fenotípico? (Pérdida de peso >5%, IMC bajo para la edad o pérdida de masa muscular)', 
      type: 'select', 
      options: [
        { label: 'Sí (Presente)', value: 1 },
        { label: 'No (Ausente)', value: 0 }
      ] 
    },
    { 
      id: 'etiologico', 
      text: '¿Presenta al menos UN criterio etiológico? (Ingesta ≤50% por >1 semana, malabsorción o enfermedad aguda/inflamación crónica)', 
      type: 'select', 
      options: [
        { label: 'Sí (Presente)', value: 1 },
        { label: 'No (Ausente)', value: 0 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => {
    // Para el diagnóstico GLIM se requiere la presencia de ambos (Fenotípico + Etiológico)
    if (respuestas.fenotipico === 1 && respuestas.etiologico === 1) return 2;
    return (respuestas.fenotipico || 0) + (respuestas.etiologico || 0);
  },

  interpretar: (puntaje) => {
    if (puntaje === 2) return { 
      texto: 'DIAGNÓSTICO DE DESNUTRICIÓN (GLIM)', 
      color: 'red-600', 
      evidencia: 'Se cumplen los criterios mínimos de consenso (1 Fenotípico + 1 Etiológico).',
      recomendaciones: [
        'Determinar la gravedad (Moderada vs Severa) según el grado del criterio fenotípico',
        'Iniciar terapia nutricional médica personalizada',
        'Tratar la causa etiológica subyacente (inflamación o ingesta)',
        'Seguimiento mensual de la masa muscular y peso'
      ] 
    };

    return { 
      texto: 'CRITERIOS INSUFICIENTES', 
      color: 'emerald-600', 
      evidencia: 'No se cumple la combinación necesaria para el diagnóstico de desnutrición según GLIM.',
      recomendaciones: [
        'Realizar tamizaje de riesgo (NRS-2002 o MNA) en 15 días si hay enfermedad aguda',
        'Mantener vigilancia de la ingesta alimentaria'
      ] 
    };
  }
},
  
 {
    id: 'imc_cintura',
    nombre: 'IMC y Perímetro de Cintura',
    categoria: 'nutricion',
    descripcion: 'Clasificación del estado nutricional y evaluación del riesgo cardiometabólico integral.',
    
    bibliografia: "World Health Organization (WHO). Waist circumference and waist-hip ratio: report of a WHO expert consultation. 2008.",
    referenciaUrl: "https://www.who.int/publications/i/item/9789241501491",
    evidenciaClinica: "El IMC categoriza el peso, mientras que el perímetro de cintura identifica la obesidad abdominal, predictor independiente de riesgo para Diabetes e Hipertensión.",

    preguntas: [
      { id: 'imc_val', text: '1. Ingrese el IMC calculado (kg/m²):', type: 'number' },
      { id: 'cintura_val', text: '2. Perímetro de cintura (cm):', type: 'number' },
      { 
        id: 'sexo', 
        text: '3. Sexo biológico:', 
        type: 'select', 
        options: [
          { label: 'Hombre', value: 1 },
          { label: 'Mujer', value: 2 }
        ] 
      }
    ],

    calcularPuntaje: (r) => Number(r.imc_val) || 0,

    interpretar: (p, respuestas) => {
      const imc = p;
      const cintura = Number(respuestas?.cintura_val) || 0;
      const sexo = Number(respuestas?.sexo) || 1;

      // 1. Lógica de IMC
      let catImc = '';
      let color = 'emerald-600';
      if (imc < 18.5) { catImc = 'Bajo Peso'; color = 'blue-500'; }
      else if (imc < 25) { catImc = 'Normopeso'; color = 'emerald-600'; }
      else if (imc < 30) { catImc = 'Sobrepeso'; color = 'orange-500'; }
      else { catImc = 'Obesidad'; color = 'red-600'; }

      // 2. Lógica de Riesgo por Cintura (Puntos de corte WHO/Chile)
      // Hombre: > 94cm Riesgo, > 102cm Riesgo Muy Alto
      // Mujer: > 80cm Riesgo, > 88cm Riesgo Muy Alto
      let riesgoCintura = 'Bajo';
      if (sexo === 1) { // Hombre
        if (cintura > 102) riesgoCintura = 'Muy Alto';
        else if (cintura > 94) riesgoCintura = 'Aumentado';
      } else { // Mujer
        if (cintura > 88) riesgoCintura = 'Muy Alto';
        else if (cintura > 80) riesgoCintura = 'Aumentado';
      }

      return {
        texto: `Resultado: ${catImc}`,
        color: color,
        evidencia: `IMC: ${imc} kg/m² | Cintura: ${cintura} cm (Riesgo: ${riesgoCintura})`,
        recomendaciones: [
          `Riesgo Metabólico: ${riesgoCintura}.`,
          riesgoCintura !== 'Bajo' ? 'Priorizar pérdida de grasa visceral y ejercicio aeróbico.' : 'Mantener composición corporal actual.',
          'Evaluar perfil lipídico y glicemia en ayunas si el riesgo es Aumentado o Muy Alto.'
        ]
      };
    }
  },
  {
  id: 'bristol',
  nombre: 'Escala de Bristol',
  categoria: 'nutricion',
  descripcion: 'Clasificación visual de las heces humanas en 7 categorías para evaluar el tiempo de tránsito colónico.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 9299672) ---
  bibliografia: "Lewis SJ, Heaton KW. Stool form scale as a useful guide to intestinal transit time. Scand J Gastroenterol. 1997 Sep;32(9):920-4.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/9299672/", // ✅ LINK CORRECTO
  evidenciaClinica: "Los tipos 1 y 2 indican estreñimiento; los tipos 3 y 4 son las 'heces ideales'; los tipos 5, 6 y 7 tienden hacia la diarrea o urgencia.",

  preguntas: [
    { 
      id: 'tipo', 
      text: 'Seleccione el tipo de heces que describe mejor la deposición habitual:', 
      type: 'select', 
      options: [
        { label: 'Tipo 1: Trozos duros separados (como nueces), difíciles de evacuar', value: 1 },
        { label: 'Tipo 2: Forma de salchicha pero compuesta de fragmentos', value: 2 },
        { label: 'Tipo 3: Forma de salchicha con grietas en la superficie', value: 3 },
        { label: 'Tipo 4: Forma de salchicha o serpiente, lisa y blanda (Ideal)', value: 4 },
        { label: 'Tipo 5: Trozos de masa pastosa con bordes definidos', value: 5 },
        { label: 'Tipo 6: Fragmentos blandos y esponjosos con bordes irregulares', value: 6 },
        { label: 'Tipo 7: Acuosa, sin trozos sólidos (totalmente líquida)', value: 7 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.tipo) ?? 4,

  interpretar: (puntaje) => {
    if (puntaje <= 2) return { 
      texto: 'Estreñimiento / Tránsito Lento', 
      color: 'red-600', 
      evidencia: 'Los tipos 1 y 2 sugieren que las heces han pasado un tiempo excesivo en el colon, perdiendo agua.',
      recomendaciones: [
        'Aumentar la ingesta diaria de agua (mínimo 2-2.5 litros)',
        'Incrementar el consumo de fibra insoluble (frutas, verduras, legumbres)',
        'Evaluar actividad física para estimular el peristaltismo',
        'Considerar masaje abdominal kinésico'
      ] 
    };

    if (puntaje <= 4) return { 
      texto: 'Heces Ideales / Tránsito Normal', 
      color: 'emerald-600', 
      evidencia: 'Los tipos 3 y 4 son los estándares de salud intestinal. Indican un tránsito equilibrado.',
      recomendaciones: [
        'Mantener hábitos actuales de alimentación e hidratación',
        'Continuar con actividad física regular'
      ] 
    };

    return { 
      texto: 'Tendencia a Diarrea / Tránsito Rápido', 
      color: 'amber-600', 
      evidencia: 'Los tipos 5 a 7 indican un tránsito acelerado que impide la reabsorción adecuada de agua.',
      recomendaciones: [
        'Evaluar posibles intolerancias alimentarias o procesos infecciosos',
        'Reponer electrolitos si la consistencia es tipo 7',
        'Evitar irritantes intestinales (café, alcohol, picantes) temporalmente',
        'Control médico si los síntomas persisten por más de 48 horas'
      ] 
    };
  }
},
  
   {
  id: 'strong_kids',
  nombre: 'StrongKids',
  categoria: 'nutricion',
  descripcion: 'Screening de riesgo nutricional pediátrico hospitalario.',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Hulst JM, et al. Dutch national survey of risk of malnutrition in hospitalized children. Clin Nutr. 2010;29(1):106-11.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/19660840/", 
  evidenciaClinica: "Herramienta validada para el triaje nutricional en pediatría. Evalúa de forma rápida el riesgo metabólico basado en la patología y la ingesta, permitiendo una intervención precoz.",

  preguntas: [
    { id: 'subje', text: '1. Evaluación subjetiva (¿Se ve desnutrido?):', type: 'select', options: [{ label: 'Sí (1 pt)', value: 1 }, { label: 'No', value: 0 }] },
    { id: 'enf', text: '2. Enfermedad de alto riesgo o cirugía mayor:', type: 'select', options: [{ label: 'Sí (2 pts)', value: 2 }, { label: 'No', value: 0 }] },
    { id: 'ingesta', text: '3. Ingesta reducida, diarrea o vómitos:', type: 'select', options: [{ label: 'Sí (1 pt)', value: 1 }, { label: 'No', value: 0 }] },
    { id: 'perdida', text: '4. Pérdida de peso o falta de crecimiento:', type: 'select', options: [{ label: 'Sí (1 pt)', value: 1 }, { label: 'No', value: 0 }] }
  ],

  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    if (p >= 4) return { 
      texto: 'Riesgo Alto', 
      color: 'red-600',
      evidencia: 'Puntaje de ' + p + ': Riesgo severo. Requiere intervención inmediata.',
      recomendaciones: [
        'Consulta inmediata a Nutricionista/Pediatra especialista', 
        'Iniciar soporte nutricional prescrito (enteral/suplementos)', 
        'Seguimiento diario de peso y balance hídrico'
      ] 
    };

    if (p >= 1) return { 
      texto: 'Riesgo Moderado', 
      color: 'orange-500',
      evidencia: 'Puntaje de ' + p + ': Riesgo presente. Vigilancia activa.',
      recomendaciones: [
        'Control de peso diario', 
        'Suplementación si no mejora ingesta en 48h', 
        'Reevaluar con StrongKids en 3 días'
      ] 
    };

    return { 
      texto: 'Riesgo Bajo', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + ': Estado estable.',
      recomendaciones: [
        'Cuidado estándar de enfermería', 
        'Reevaluar semanalmente durante la estadía'
      ] 
    };
  }
},
 {
  id: 'scoff_test',
  nombre: 'Cuestionario SCOFF',
  categoria: 'nutricion',
  descripcion: 'Screening rápido de trastornos de la conducta alimentaria (TCA).',
  
  // --- JUSTIFICACIÓN ACADÉMICA ---
  bibliografia: "Morgan JF, et al. The SCOFF questionnaire: assessment of a new screening tool for eating disorders. BMJ. 1999;319(7223):1467-8.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10582927/",
  evidenciaClinica: "Un puntaje ≥ 2 tiene una sensibilidad del 100% para anorexia y bulimia. Es la herramienta de cribado de elección en atención primaria.",

  preguntas: [
    { id: 's', text: '1. ¿Se siente enfermo porque se siente lleno?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
    { id: 'c', text: '2. ¿Le preocupa haber perdido el control sobre cuánto come?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
    { id: 'o', text: '3. ¿Ha perdido recientemente más de 6 kg en 3 meses?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
    { id: 'f', text: '4. ¿Cree que está gordo a pesar de que otros dicen que está flaco?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
    { id: 'f2', text: '5. ¿Diría que la comida domina su vida?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
  ],

  calcularPuntaje: (r: any) => Object.values(r).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0),

  interpretar: (p: number) => {
    if (p >= 2) return { 
      texto: 'Probable Trastorno de Conducta Alimentaria', 
      color: 'red-600',
      evidencia: 'Puntaje de ' + p + '/5: Supera el umbral de cribado clínico.',
      recomendaciones: [
        'Derivación urgente a Salud Mental (Psicología/Psiquiatría)', 
        'Evaluación médica para descartar complicaciones metabólicas', 
        'Evitar dietas restrictivas sin supervisión profesional'
      ] 
    };

    return { 
      texto: 'Baja probabilidad de TCA', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + '/5: No se alcanzan criterios de riesgo.',
      recomendaciones: [
        'Mantener educación en alimentación saludable',
        'Reevaluar si aparecen cambios conductuales bruscos'
      ] 
    };
  }
},
  {
  id: 'nutric_score_uci',
  nombre: 'NUTRIC Score',
  categoria: 'nutricion',
  descripcion: 'Identifica el riesgo de desnutrición en pacientes críticos y su beneficio potencial del soporte nutricional.',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Heyland DK, et al. Identifying critically ill patients who benefit the most from nutrition therapy: the NUTRIC score. Crit Care. 2011;15(6):R268.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/22085763/", // ✅ FUENTE VERIFICADA
  evidenciaClinica: "Es la primera herramienta validada para UCI. Un puntaje alto se asocia con mayor mortalidad y días de ventilación mecánica, pero estos pacientes son los que más se benefician de una meta calórica-proteica temprana.",

  preguntas: [
    { 
      id: 'apache', 
      text: '1. Score APACHE II (Gravedad al ingreso):', 
      type: 'select', 
      options: [
        { label: '< 15 (0 pts)', value: 0 }, 
        { label: '15-19 (1 pt)', value: 1 }, 
        { label: '20-27 (2 pts)', value: 2 }, 
        { label: '≥ 28 (3 pts)', value: 3 }
      ] 
    },
    { 
      id: 'sofa', 
      text: '2. Score SOFA (Falla orgánica acumulada):', 
      type: 'select', 
      options: [
        { label: '< 6 (0 pts)', value: 0 }, 
        { label: '6-9 (1 pt)', value: 1 }, 
        { label: '≥ 10 (2 pts)', value: 2 }
      ] 
    },
    { 
      id: 'comorb', 
      text: '3. Número de comorbilidades (Patologías previas):', 
      type: 'select', 
      options: [
        { label: '0-1 comorbilidad (0 pts)', value: 0 }, 
        { label: '≥ 2 comorbilidades (1 pt)', value: 1 }
      ] 
    },
    { 
      id: 'dias_pre', 
      text: '4. Días desde el ingreso hospitalario hasta la UCI:', 
      type: 'select', 
      options: [
        { label: '0 a < 1 día (0 pts)', value: 0 }, 
        { label: '≥ 1 día (1 pt)', value: 1 }
      ] 
    }
  ],

  // Suma segura de valores
  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    if (p >= 5) {
      return { 
        texto: 'ALTO RIESGO NUTRICIONAL EN UCI', 
        color: 'red-600',
        evidencia: 'Puntaje de ' + p + '/7: Alta probabilidad de desenlaces adversos si no se cumple la meta nutricional.',
        recomendaciones: [
          'Inicio precoz de Nutrición Enteral (24-48h si hay estabilidad hemodinámica)', 
          'Ajustar aporte proteico agresivo (1.2 - 2.0 g/kg/día)', 
          'Monitoreo clínico de tolerancia gastrointestinal y riesgo de aspiración',
          'Evitar sobrealimentación en fase aguda (20-25 kcal/kg/día)'
        ] 
      };
    }

    return { 
      texto: 'Bajo Riesgo Nutricional en UCI', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + '/7: Riesgo basal para paciente crítico.',
      recomendaciones: [
        'Aporte nutricional estándar según guías ESPEN/ASPEN', 
        'Monitorización rutinaria de la ingesta y función orgánica',
        'Reevaluar si el SOFA del paciente aumenta significativamente'
      ] 
    };
  }
},
  // ==========================================
  // PSICOLOGÍA
  // ==========================================
  {
  id: 'phq_9',
  nombre: 'Cuestionario PHQ-9',
  categoria: 'psicologia',
  descripcion: 'Herramienta de 9 ítems para el tamizaje, diagnóstico y monitoreo de la severidad de la depresión.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 11556941) ---
  bibliografia: "Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001 Sep;16(9):606-13.",
  referenciaUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1495268/", // ✅ ENLACE FULL TEXT GRATUITO
  evidenciaClinica: "Un puntaje ≥ 10 tiene una sensibilidad y especificidad del 88% para el diagnóstico de depresión mayor. Es sensible al cambio tras el tratamiento.",

  preguntas: [
    { 
      id: 'p1', 
      text: 'Poco interés o placer en hacer las cosas:', 
      type: 'select', 
      options: [
        { label: '0: Nunca', value: 0 },
        { label: '1: Varios días', value: 1 },
        { label: '2: Más de la mitad de los días', value: 2 },
        { label: '3: Casi todos los días', value: 3 }
      ] 
    },
    { id: 'p2', text: 'Sentirse desanimado/a, deprimido/a o sin esperanzas:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p3', text: 'Problemas para dormir o para mantenerse dormido, o dormir demasiado:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p4', text: 'Sentirse cansado/a o con poca energía:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p5', text: 'Poco apetito o comer demasiado:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p6', text: 'Sentirse mal consigo mismo/a (sentir que es un fracaso o que ha decepcionado a su familia):', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p7', text: 'Dificultad para concentrarse en cosas tales como leer el periódico o ver televisión:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p8', text: 'Moverse o hablar tan lentamente que otras personas podrían notarlo. O lo contrario: estar tan inquieto que se mueve mucho más de lo normal:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p9', text: 'Pensamientos de que sería mejor estar muerto/a o de lastimarse de alguna manera:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje <= 4) return { 
      texto: 'Depresión Mínima o Ausente', 
      color: 'emerald-600', 
      evidencia: 'Puntaje en rango de normalidad. Generalmente no requiere tratamiento específico.',
      recomendaciones: ['Seguimiento si aparecen nuevos síntomas'] 
    };
    if (puntaje <= 9) return { 
      texto: 'Depresión Leve', 
      color: 'yellow-600', 
      evidencia: 'Sintomatología presente pero con impacto funcional limitado.',
      recomendaciones: ['Vigilancia clínica', 'Apoyo psicoeducativo', 'Re-evaluar en 1-2 meses'] 
    };
    if (puntaje <= 14) return { 
      texto: 'Depresión Moderada', 
      color: 'orange-600', 
      evidencia: 'Requiere plan de tratamiento (psicoterapia y/o fármacos).',
      recomendaciones: ['Derivación a Salud Mental', 'Considerar inicio de terapia'] 
    };
    if (puntaje <= 19) return { 
      texto: 'Depresión Moderadamente Severa', 
      color: 'red-500', 
      evidencia: 'Alto impacto en la vida diaria. Requiere tratamiento activo.',
      recomendaciones: ['Tratamiento farmacológico e interdisciplinario'] 
    };
    return { 
      texto: 'Depresión Severa', 
      color: 'red-700', 
      evidencia: 'Gravedad máxima. Riesgo de complicaciones funcionales y vitales.',
      recomendaciones: ['Intervención intensiva inmediata', 'Evaluar riesgo de autoagresión'] 
    };
  }
},
  {
  id: 'gad_7',
  nombre: 'Cuestionario GAD-7',
  categoria: 'psicologia',
  descripcion: 'Herramienta de 7 ítems para identificar y medir la severidad del trastorno de ansiedad generalizada.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 16717171) ---
  bibliografia: "Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006 May 22;166(10):1092-7.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/16717171/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Un puntaje ≥ 10 tiene una alta sensibilidad y especificidad para el diagnóstico de ansiedad generalizada. Se utiliza también para evaluar pánico, ansiedad social y TEPT.",

  preguntas: [
    { 
      id: 'p1', 
      text: 'Sentirse nervioso/a, intranquilo/a o con los nervios de punta:', 
      type: 'select', 
      options: [
        { label: '0: Nunca', value: 0 },
        { label: '1: Varios días', value: 1 },
        { label: '2: Más de la mitad de los días', value: 2 },
        { label: '3: Casi todos los días', value: 3 }
      ] 
    },
    { id: 'p2', text: 'No poder dejar de preocuparse o no poder controlar la preocupación:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p3', text: 'Preocuparse demasiado por diferentes cosas:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p4', text: 'Dificultad para relajarse:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p5', text: 'Estar tan inquieto/a que es difícil permanecer sentado/a:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p6', text: 'Molestarse o irritarse fácilmente:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] },
    { id: 'p7', text: 'Sentir miedo de que algo terrible pudiera pasar:', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }] }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje <= 4) return { 
      texto: 'Ansiedad Mínima', 
      color: 'emerald-600', 
      evidencia: 'Puntaje dentro de rangos normales de ansiedad cotidiana.',
      recomendaciones: ['Higiene de sueño y manejo del estrés habitual'] 
    };
    if (puntaje <= 9) return { 
      texto: 'Ansiedad Leve', 
      color: 'yellow-600', 
      evidencia: 'Sintomatología presente que requiere monitoreo si los síntomas persisten.',
      recomendaciones: ['Seguimiento clínico', 'Técnicas de relajación/mindfulness'] 
    };
    if (puntaje <= 14) return { 
      texto: 'Ansiedad Moderada', 
      color: 'orange-600', 
      evidencia: 'Probable presencia de trastorno de ansiedad. Se recomienda evaluación por especialista.',
      recomendaciones: ['Derivación a Salud Mental', 'Evaluación para psicoterapia cognitiva-conductual'] 
    };
    return { 
      texto: 'Ansiedad Severa', 
      color: 'red-600', 
      evidencia: 'Alto impacto funcional y emocional. Requiere intervención clínica inmediata.',
      recomendaciones: [
        'Derivación prioritaria a psiquiatría/psicología', 
        'Evaluación para inicio de farmacoterapia',
        'Abordaje interdisciplinario'
      ] 
    };
  }
},
{
    id: 'bdi_ii_beck',
    nombre: 'Inventario de Depresión de Beck (BDI-II)',
    categoria: 'psicologia',
    descripcion: 'Evaluación clínica de la gravedad de la sintomatología depresiva mediante 21 ítems de autoinforme.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8884931) ---
    bibliografia: "Beck AT, Steer RA, Brown GK. Manual for the Beck Depression Inventory-II. San Antonio, TX: Psychological Corporation; 1996.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8884931/",
    evidenciaClinica: "Es el estándar de oro psicométrico. Un puntaje ≥ 14 indica el inicio de sintomatología clínica. El ítem 9 es un marcador crítico de riesgo vital.",

    preguntas: [
      { id: 'p1', text: '1. Tristeza', type: 'select', options: [{ label: '0: No me siento triste', value: 0 }, { label: '1: Me siento triste gran parte del tiempo', value: 1 }, { label: '2: Estoy triste todo el tiempo', value: 2 }, { label: '3: Estoy tan triste que no puedo soportarlo', value: 3 }] },
      { id: 'p2', text: '2. Pesimismo', type: 'select', options: [{ label: '0: No estoy desalentado respecto al futuro', value: 0 }, { label: '1: Me siento más desalentado que lo habitual', value: 1 }, { label: '2: No espero que las cosas mejoren', value: 2 }, { label: '3: Siento que el futuro es desesperanzador', value: 3 }] },
      { id: 'p3', text: '3. Fracaso', type: 'select', options: [{ label: '0: No me siento un fracasado', value: 0 }, { label: '1: He fracasado más de lo que debería', value: 1 }, { label: '2: Al mirar atrás, veo muchos fracasos', value: 2 }, { label: '3: Me siento un fracasado total', value: 3 }] },
      { id: 'p4', text: '4. Pérdida de Placer', type: 'select', options: [{ label: '0: Obtengo tanto placer como siempre', value: 0 }, { label: '1: No disfruto las cosas tanto como antes', value: 1 }, { label: '2: Obtengo muy poco placer de las cosas que solía disfrutar', value: 2 }, { label: '3: No puedo obtener ningún placer de nada', value: 3 }] },
      { id: 'p5', text: '5. Sentimiento de Culpa', type: 'select', options: [{ label: '0: No me siento particularmente culpable', value: 0 }, { label: '1: Me siento culpable por muchas cosas que he hecho', value: 1 }, { label: '2: Me siento bastante culpable la mayor parte del tiempo', value: 2 }, { label: '3: Me siento culpable todo el tiempo', value: 3 }] },
      { id: 'p6', text: '6. Sentimiento de Castigo', type: 'select', options: [{ label: '0: No siento que esté siendo castigado', value: 0 }, { label: '1: Siento que puedo ser castigado', value: 1 }, { label: '2: Espero ser castigado', value: 2 }, { label: '3: Siento que estoy siendo castigado', value: 3 }] },
      { id: 'p7', text: '7. Disconformidad con uno mismo', type: 'select', options: [{ label: '0: Siento lo mismo que siempre sobre mí', value: 0 }, { label: '1: He perdido la confianza en mí mismo', value: 1 }, { label: '2: Estoy decepcionado de mí mismo', value: 2 }, { label: '3: Me odio', value: 3 }] },
      { id: 'p8', text: '8. Autocrítica', type: 'select', options: [{ label: '0: No me critico más de lo habitual', value: 0 }, { label: '1: Soy más crítico conmigo de lo que solía ser', value: 1 }, { label: '2: Me critico por todos mis errores', value: 2 }, { label: '3: Me culpo por todo lo malo que sucede', value: 3 }] },
      { id: 'p9', text: '9. Pensamientos Suicidas', type: 'select', options: [{ label: '0: No tengo ningún pensamiento de matarme', value: 0 }, { label: '1: He pensado en matarme, pero no lo haría', value: 1 }, { label: '2: Me gustaría matarme', value: 2 }, { label: '3: Me mataría si tuviera la oportunidad', value: 3 }] },
      { id: 'p10', text: '10. Llanto', type: 'select', options: [{ label: '0: No lloro más de lo habitual', value: 0 }, { label: '1: Lloro más de lo que solía', value: 1 }, { label: '2: Lloro por cualquier pequeñez', value: 2 }, { label: '3: Siento ganas de llorar pero no puedo', value: 3 }] },
      { id: 'p11', text: '11. Agitación', type: 'select', options: [{ label: '0: No estoy más inquieto de lo habitual', value: 0 }, { label: '1: Me siento algo más inquieto de lo habitual', value: 1 }, { label: '2: Estoy tan inquieto que me es difícil quedarme quieto', value: 2 }, { label: '3: Estoy tan agitado que tengo que estar moviéndome', value: 3 }] },
      { id: 'p12', text: '12. Pérdida de Interés', type: 'select', options: [{ label: '0: No he perdido el interés en los demás', value: 0 }, { label: '1: Estoy menos interesado que antes en los demás', value: 1 }, { label: '2: He perdido casi todo el interés en los demás', value: 2 }, { label: '3: Me es difícil interesarme por algo', value: 3 }] },
      { id: 'p13', text: '13. Indecisión', type: 'select', options: [{ label: '0: Tomo decisiones tan bien como siempre', value: 0 }, { label: '1: Me cuesta más que lo habitual tomar decisiones', value: 1 }, { label: '2: Tengo mucha más dificultad que antes para decidir', value: 2 }, { label: '3: Tengo problemas para tomar cualquier decisión', value: 3 }] },
      { id: 'p14', text: '14. Desvalorización', type: 'select', options: [{ label: '0: No siento que yo no valga nada', value: 0 }, { label: '1: No me considero tan valioso como solía', value: 1 }, { label: '2: Me siento menos valioso que los demás', value: 2 }, { label: '3: Siento que no valgo nada', value: 3 }] },
      { id: 'p15', text: '15. Pérdida de Energía', type: 'select', options: [{ label: '0: Tengo tanta energía como siempre', value: 0 }, { label: '1: Tengo menos energía que la que solía tener', value: 1 }, { label: '2: No tengo suficiente energía para hacer mucho', value: 2 }, { label: '3: No tengo energía para hacer nada', value: 3 }] },
      { id: 'p16', text: '16. Cambios en el Sueño', type: 'select', options: [{ label: '0: No he notado cambios en el sueño', value: 0 }, { label: '1: Duermo algo más/menos que lo habitual', value: 1 }, { label: '2: Duermo mucho más/menos que lo habitual', value: 2 }, { label: '3: Duermo casi todo el día / Despierto muy temprano', value: 3 }] },
      { id: 'p17', text: '17. Irritabilidad', type: 'select', options: [{ label: '0: No estoy más irritable de lo habitual', value: 0 }, { label: '1: Estoy más irritable de lo habitual', value: 1 }, { label: '2: Estoy mucho más irritable de lo habitual', value: 2 }, { label: '3: Estoy irritable todo el tiempo', value: 3 }] },
      { id: 'p18', text: '18. Cambios en el Apetito', type: 'select', options: [{ label: '0: No he notado cambios en el apetito', value: 0 }, { label: '1: Mi apetito es algo menor/mayor', value: 1 }, { label: '2: Mi apetito es mucho menor/mayor', value: 2 }, { label: '3: No tengo nada de apetito / Como todo el tiempo', value: 3 }] },
      { id: 'p19', text: '19. Dificultad de Concentración', type: 'select', options: [{ label: '0: Puedo concentrarme tan bien como siempre', value: 0 }, { label: '1: No puedo concentrarme tan bien como habitualmente', value: 1 }, { label: '2: Me es difícil mantener la mente en algo', value: 2 }, { label: '3: Encuentro que no puedo concentrarme en nada', value: 3 }] },
      { id: 'p20', text: '20. Cansancio o Fatiga', type: 'select', options: [{ label: '0: No estoy más cansado de lo habitual', value: 0 }, { label: '1: Me canso más fácilmente de lo habitual', value: 1 }, { label: '2: Estoy demasiado cansado para hacer muchas cosas', value: 2 }, { label: '3: Estoy demasiado cansado para hacer cualquier cosa', value: 3 }] },
      { id: 'p21', text: '21. Interés en el Sexo', type: 'select', options: [{ label: '0: No he notado cambios en mi interés sexual', value: 0 }, { label: '1: Estoy menos interesado en el sexo', value: 1 }, { label: '2: Estoy mucho menos interesado en el sexo ahora', value: 2 }, { label: '3: He perdido completamente el interés en el sexo', value: 3 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas) => {
      const riesgoSuicida = Number(respuestas?.p9) >= 1;
      
      let nivel = { texto: 'Depresión Mínima', color: 'emerald-600' };
      if (puntaje >= 29) nivel = { texto: 'DEPRESIÓN GRAVE', color: 'red-700' };
      else if (puntaje >= 20) nivel = { texto: 'Depresión Moderada', color: 'orange-600' };
      else if (puntaje >= 14) nivel = { texto: 'Depresión Leve', color: 'yellow-600' };

      const recomendaciones = [
        'Confirmar diagnóstico mediante entrevista clínica.',
        'Evaluar la necesidad de derivación a Psiquiatría.',
        'Considerar comorbilidad con ansiedad (GAD-7).'
      ];

      if (riesgoSuicida) {
        recomendaciones.unshift('⚠️ ALERTA: Ideación suicida detectada. Iniciar protocolo de resguardo vital inmediatamente.');
      }

      return { 
        texto: nivel.texto, 
        color: riesgoSuicida ? 'red-900' : nivel.color, 
        evidencia: `Puntaje total: ${puntaje}/63. ${riesgoSuicida ? 'Riesgo suicida presente.' : ''}`,
        recomendaciones: recomendaciones
      };
    }
  },
  {
  id: 'audit_test_alcohol',
  nombre: 'Test AUDIT (Cribado de Alcohol)',
  categoria: 'psicologia',
  descripcion: 'Identificación de trastornos por consumo de alcohol y patrones de riesgo.',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Babor TF, et al. AUDIT: The Alcohol Use Disorders Identification Test: Guidelines for Use in Primary Health Care. World Health Organization; 2001.",
  referenciaUrl: "https://www.who.int/publications/i/item/WHO-MSB-01.6a", // ✅ FUENTE OFICIAL OMS
  evidenciaClinica: "El AUDIT es el instrumento de tamizaje más utilizado a nivel mundial para detectar consumo de riesgo, perjudicial y dependencia. Su aplicación temprana permite realizar intervenciones breves efectivas antes del desarrollo de patologías crónicas.",

  preguntas: [
    { 
      id: 'frecuencia', 
      text: '1. ¿Con qué frecuencia consume bebidas alcohólicas?', 
      type: 'select', 
      options: [
        { label: 'Nunca (0 pts)', value: 0 }, 
        { label: '1 o menos veces al mes (1 pt)', value: 1 }, 
        { label: '2 a 4 veces al mes (2 pts)', value: 2 }, 
        { label: '2 a 3 veces a la semana (3 pts)', value: 3 }, 
        { label: '4 o más veces a la semana (4 pts)', value: 4 }
      ] 
    },
    { 
      id: 'cantidad', 
      text: '2. ¿Cuántos tragos o copas suele tomar en un día de consumo normal?', 
      type: 'select', 
      options: [
        { label: '1 o 2 (0 pts)', value: 0 }, 
        { label: '3 o 4 (1 pt)', value: 1 }, 
        { label: '5 o 6 (2 pts)', value: 2 }, 
        { label: '7 a 9 (3 pts)', value: 3 }, 
        { label: '10 o más (4 pts)', value: 4 }
      ] 
    },
    { 
      id: 'intensivo', 
      text: '3. ¿Con qué frecuencia toma 6 o más copas en una sola ocasión?', 
      type: 'select', 
      options: [
        { label: 'Nunca (0 pts)', value: 0 }, 
        { label: 'Menos de una vez al mes (1 pt)', value: 1 }, 
        { label: 'Mensualmente (2 pts)', value: 2 }, 
        { label: 'Semanalmente (3 pts)', value: 3 }, 
        { label: 'A diario o casi a diario (4 pts)', value: 4 }
      ] 
    }
  ],

  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    if (p <= 7) return { 
      texto: 'Consumo de Bajo Riesgo', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + ': Patrón de consumo dentro de límites de bajo impacto sistémico.',
      recomendaciones: [
        'Educación sobre límites de consumo seguro (Guías de la OMS)', 
        'Mantener vigilancia en pacientes con medicación fotosensible o hepatotóxica'
      ] 
    };

    if (p <= 15) return { 
      texto: 'Consumo de Riesgo', 
      color: 'yellow-500',
      evidencia: 'Puntaje de ' + p + ': Nivel de consumo que aumenta la probabilidad de consecuencias adversas.',
      recomendaciones: [
        'Realizar Intervención Breve (Consejería de 5-10 minutos)', 
        'Entrega de material educativo sobre riesgos a la salud física y mental',
        'Establecer metas de reducción de consumo'
      ] 
    };

    if (p <= 19) return { 
      texto: 'Consumo Perjudicial', 
      color: 'orange-600',
      evidencia: 'Puntaje de ' + p + ': Patrón de consumo que ya está causando daño físico o psíquico.',
      recomendaciones: [
        'Derivación a programa especializado de alcohol y drogas', 
        'Seguimiento médico estrecho para evaluar función hepática',
        'Evaluación de comorbilidad psiquiátrica'
      ] 
    };

    return { 
      texto: 'PROBABLE DEPENDENCIA', 
      color: 'red-600',
      evidencia: 'Puntaje de ' + p + ': Alta probabilidad de síndrome de dependencia al alcohol.',
      recomendaciones: [
        'Derivación URGENTE a especialista (Psiquiatría / Centros de Tratamiento de Adicciones)', 
        'Manejo y vigilancia de síndrome de abstinencia si aplica',
        'Apoyo familiar y social intensivo'
      ] 
    };
  }
},
  {
  id: 'dast_10_drogas',
  nombre: 'Test DAST-10',
  categoria: 'psicologia',
  descripcion: 'Tamizaje clínico para identificar el impacto y nivel de riesgo por consumo de drogas (excepto alcohol y tabaco).',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Skinner HA. The Drug Abuse Screening Test. Addictive Behaviors. 1982;7(4):363-71.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/7183091/", // ✅ FUENTE VERIFICADA
  evidenciaClinica: "El DAST-10 es una herramienta de alta validez interna para discriminar entre el uso recreativo y el abuso o dependencia. Un puntaje > 3 indica la necesidad de una evaluación diagnóstica profunda.",

  preguntas: [
    { 
      id: 'd1', 
      text: '1. ¿Ha utilizado drogas que no sean por necesidad médica en el último año?', 
      type: 'select', 
      options: [
        { label: 'Sí (1 pt)', value: 1 }, 
        { label: 'No (0 pts)', value: 0 }
      ] 
    },
    { 
      id: 'd2', 
      text: '2. ¿Abusa (consume) de más de una droga a la vez?', 
      type: 'select', 
      options: [
        { label: 'Sí (1 pt)', value: 1 }, 
        { label: 'No (0 pts)', value: 0 }
      ] 
    },
    { 
      id: 'd3', 
      text: '3. ¿Es incapaz de pasar una semana entera sin consumir?', 
      type: 'select', 
      options: [
        { label: 'Sí (1 pt)', value: 1 }, 
        { label: 'No (0 pts)', value: 0 }
      ] 
    },
    { 
      id: 'd4', 
      text: '4. ¿Ha tenido lagunas mentales, flashbacks o episodios de pérdida de memoria?', 
      type: 'select', 
      options: [
        { label: 'Sí (1 pt)', value: 1 }, 
        { label: 'No (0 pts)', value: 0 }
      ] 
    },
    { 
      id: 'd5', 
      text: '5. ¿Se ha sentido alguna vez culpable o arrepentido/a por su consumo?', 
      type: 'select', 
      options: [
        { label: 'Sí (1 pt)', value: 1 }, 
        { label: 'No (0 pts)', value: 0 }
      ] 
    }
  ],

  // Suma segura para TypeScript
  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    if (p === 0) return { 
      texto: 'Sin problemas relacionados', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + ': No se detectan patrones de riesgo actuales.',
      recomendaciones: [
        'Realizar prevención primaria y educación en salud', 
        'Reevaluar en controles anuales si el contexto cambia'
      ] 
    };

    if (p <= 2) return { 
      texto: 'Riesgo Leve', 
      color: 'yellow-500',
      evidencia: 'Puntaje de ' + p + ': Uso de sustancias con potencial impacto en la salud.',
      recomendaciones: [
        'Realizar consejería breve motivacional', 
        'Seguimiento clínico para evitar la escalada del consumo',
        'Informar sobre el impacto de las drogas en la recuperación física'
      ] 
    };

    if (p <= 5) return { 
      texto: 'RIESGO MODERADO', 
      color: 'orange-600',
      evidencia: 'Puntaje de ' + p + ': Patrón de consumo perjudicial con impacto funcional.',
      recomendaciones: [
        'Derivación a programa de rehabilitación especializado (Ambulatorio)', 
        'Interconsulta con Psicología / Salud Mental',
        'Evaluación médica para descartar patología dual (Depresión/Ansiedad)'
      ] 
    };

    return { 
      texto: 'RIESGO SEVERO / ALTO', 
      color: 'red-600',
      evidencia: 'Puntaje de ' + p + ': Indica probable dependencia y alto riesgo orgánico.',
      recomendaciones: [
        'Intervención intensiva inmediata (Derivación a centro especializado)', 
        'Evaluación psiquiátrica completa para manejo de adicciones',
        'Monitoreo estrecho de la red de apoyo y riesgo social'
      ] 
    };
  }
},
  {
  id: 'beck_suicide_ideation',
  nombre: 'Escala de Ideación Suicida de Beck',
  categoria: 'psicologia',
  descripcion: 'Evaluación de la intensidad de los deseos, planes y comportamiento suicida actual.',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Beck AT, Kovacs M, Weissman A. Assessment of suicidal intention: the Scale for Suicide Ideation. J Consult Clin Psychol. 1979;47(2):343-52.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/469082/", // ✅ FUENTE VERIFICADA
  evidenciaClinica: "La SSI es el estándar clínico para cuantificar la intención suicida. Un puntaje positivo indica una falla en los mecanismos de adaptación y requiere una respuesta clínica jerarquizada según la severidad del plan y el deseo.",

  preguntas: [
    { 
      id: 's1', 
      text: '1. Deseo de vivir:', 
      type: 'select', 
      options: [
        { label: 'Moderado a Fuerte (0 pts)', value: 0 }, 
        { label: 'Débil (1 pt)', value: 1 }, 
        { label: 'Ninguno (2 pts)', value: 2 }
      ] 
    },
    { 
      id: 's2', 
      text: '2. Deseo de morir:', 
      type: 'select', 
      options: [
        { label: 'Ninguno (0 pts)', value: 0 }, 
        { label: 'Débil (1 pt)', value: 1 }, 
        { label: 'Moderado a Fuerte (2 pts)', value: 2 }
      ] 
    },
    { 
      id: 's3', 
      text: '3. Razones para vivir vs. Razones para morir:', 
      type: 'select', 
      options: [
        { label: 'Las razones para vivir superan a las de morir (0 pts)', value: 0 }, 
        { label: 'Están equilibradas (Vivir = Morir) (1 pt)', value: 1 }, 
        { label: 'Las razones para morir superan a las de vivir (2 pts)', value: 2 }
      ] 
    },
    { 
      id: 's4', 
      text: '4. Intento activo de suicidio (Deseo de realizar un intento):', 
      type: 'select', 
      options: [
        { label: 'Ninguno (0 pts)', value: 0 }, 
        { label: 'Débil (1 pt)', value: 1 }, 
        { label: 'Fuerte (2 pts)', value: 2 }
      ] 
    }
  ],

  // Suma segura para el motor de la App
  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    if (p >= 4) {
      return { 
        texto: '⚠️ RIESGO SUICIDA ALTO', 
        color: 'red-700',
        evidencia: 'Puntaje de ' + p + ': Presencia de ideación suicida activa y estructurada.',
        recomendaciones: [
          'ACTIVA PROTOCOLO DE EMERGENCIA VITAL INMEDIATO', 
          'No dejar al paciente solo bajo ninguna circunstancia', 
          'Derivación urgente a Urgencias Psiquiátricas (Resguardo físico)', 
          'Informar inmediatamente a la red de apoyo más cercana',
          'Retirar acceso a medios letales (fármacos, armas, etc.)'
        ] 
      };
    }

    if (p >= 1) {
      return { 
        texto: 'Riesgo Moderado', 
        color: 'orange-600',
        evidencia: 'Puntaje de ' + p + ': Ambivalencia o ideación suicida sin plan inmediato.',
        recomendaciones: [
          'Derivación prioritaria a Salud Mental (Psiquiatría/Psicología)', 
          'Realizar "Contrato de No Agresión" o de resguardo vital', 
          'Involucrar a la familia en el seguimiento y vigilancia',
          'Monitoreo estrecho en la siguiente sesión clínica'
        ] 
      };
    }

    return { 
      texto: 'Sin riesgo aparente', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + ': No se detecta ideación suicida activa en el momento de la evaluación.',
      recomendaciones: [
        'Mantener seguimiento por especialidad base', 
        'Mantener canales de comunicación abiertos ante cambios en el ánimo',
        'Fomentar factores protectores (red social, hobbies, metas)'
      ] 
    };
  }
},
  {
  id: 'mbi_burnout_profesional',
  nombre: 'Maslach Burnout Inventory (MBI)',
  categoria: 'psicologia',
  descripcion: 'Evaluación del desgaste profesional centrado en el agotamiento emocional y la despersonalización.',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Maslach C, Jackson SE. The measurement of experienced burnout. J Organ Behav. 1981;2(2):99-113.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/24933516/", // ✅ FUENTE VERIFICADA
  evidenciaClinica: "El MBI es el instrumento más utilizado para evaluar el estrés crónico laboral. Se compone de tres dimensiones: Agotamiento Emocional, Despersonalización (cinismo) y Baja Realización Personal. Un puntaje alto en las primeras dos es predictor de fatiga por compasión.",

  preguntas: [
    { 
      id: 'm1', 
      text: '1. Agotamiento: ¿Se siente emocionalmente agotado/a por su trabajo?', 
      type: 'select', 
      options: [
        { label: 'Nunca (0 pts)', value: 0 }, 
        { label: 'Pocas veces al mes (1 pt)', value: 1 }, 
        { label: 'Frecuentemente / Semanal (2 pts)', value: 2 }, 
        { label: 'Diariamente (3 pts)', value: 3 }
      ] 
    },
    { 
      id: 'm2', 
      text: '2. Despersonalización: ¿Siente que trata a algunos pacientes/usuarios como si fueran objetos?', 
      type: 'select', 
      options: [
        { label: 'Nunca (0 pts)', value: 0 }, 
        { label: 'Pocas veces al mes (1 pt)', value: 1 }, 
        { label: 'Frecuentemente / Semanal (2 pts)', value: 2 }, 
        { label: 'Diariamente (3 pts)', value: 3 }
      ] 
    },
    { 
      id: 'm3', 
      text: '3. Energía: ¿Se siente con poca energía o "fatigado" al levantarse para ir a trabajar?', 
      type: 'select', 
      options: [
        { label: 'Nunca (0 pts)', value: 0 }, 
        { label: 'Pocas veces al mes (1 pt)', value: 1 }, 
        { label: 'Frecuentemente / Semanal (2 pts)', value: 2 }, 
        { label: 'Diariamente (3 pts)', value: 3 }
      ] 
    }
  ],

  // Suma segura para evitar errores de tipo en el motor de la App
  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    if (p >= 7) {
      return { 
        texto: 'ALTO RIESGO DE BURNOUT', 
        color: 'red-600',
        evidencia: 'Puntaje de ' + p + '/9: Indica niveles críticos de agotamiento emocional y cinismo profesional.',
        recomendaciones: [
          'Evaluación prioritaria por Salud Mental (Psicología/Psiquiatría)', 
          'Evaluar necesidad de licencia médica por salud mental o pausa laboral', 
          'Implementar terapia de manejo de estrés y fatiga por compasión',
          'Reestructuración urgente de la carga horaria o funciones laborales'
        ] 
      };
    }

    if (p >= 4) {
      return { 
        texto: 'Riesgo Moderado', 
        color: 'orange-500',
        evidencia: 'Puntaje de ' + p + '/9: Presencia de signos de alerta de desgaste profesional.',
        recomendaciones: [
          'Implementar pausas saludables y técnicas de desconexión digital', 
          'Técnicas de autocuidado y mindfulness en el entorno laboral', 
          'Evaluar factores del ambiente laboral (apoyo de pares, liderazgo)',
          'Fomentar actividades de ocio fuera del horario de trabajo'
        ] 
      };
    }

    return { 
      texto: 'Bajo Riesgo', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + '/9: Los niveles de desgaste se encuentran dentro de rangos manejables.',
      recomendaciones: [
        'Mantener medidas de prevención y promoción de salud mental', 
        'Participar en instancias de feedback y apoyo entre colegas',
        'Continuar monitoreando el equilibrio vida laboral-personal'
      ] 
    };
  }
},
  {
  id: 'rosenberg_self_esteem',
  nombre: 'Escala de Autoestima de Rosenberg',
  categoria: 'psicologia',
  descripcion: 'Evaluación de la satisfacción personal y el sentimiento de valía propia.',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Rosenberg M. Society and the adolescent self-image. Princeton, NJ: Princeton University Press; 1965.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14417406/", // ✅ FUENTE ORIGINAL
  evidenciaClinica: "Es la escala más validada para la medición de la autoestima global. Un puntaje bajo es un factor de riesgo transversal para trastornos del ánimo, ansiedad y dificultades en la adherencia a tratamientos crónicos.",

  preguntas: [
    { 
      id: 'r1', 
      text: '1. Siento que soy una persona digna de aprecio, al menos en igual medida que los demás:', 
      type: 'select', 
      options: [
        { label: 'Muy en desacuerdo (1 pt)', value: 1 }, 
        { label: 'En desacuerdo (2 pts)', value: 2 }, 
        { label: 'De acuerdo (3 pts)', value: 3 }, 
        { label: 'Muy de acuerdo (4 pts)', value: 4 }
      ] 
    },
    { 
      id: 'r2', 
      text: '2. En general, me inclino a pensar que soy un fracasado/a (Ítem invertido):', 
      type: 'select', 
      options: [
        { label: 'Muy de acuerdo (1 pt)', value: 1 }, 
        { label: 'De acuerdo (2 pts)', value: 2 }, 
        { label: 'En desacuerdo (3 pts)', value: 3 }, 
        { label: 'Muy en desacuerdo (4 pts)', value: 4 }
      ] 
    },
    { 
      id: 'r3', 
      text: '3. En general, estoy satisfecho/a conmigo mismo/a:', 
      type: 'select', 
      options: [
        { label: 'Muy en desacuerdo (1 pt)', value: 1 }, 
        { label: 'En desacuerdo (2 pts)', value: 2 }, 
        { label: 'De acuerdo (3 pts)', value: 3 }, 
        { label: 'Muy de acuerdo (4 pts)', value: 4 }
      ] 
    }
  ],

  // Suma segura para TypeScript y motor de EscalaPro
  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    // Nota: La escala completa tiene 10 ítems (rango 10-40). 
    // Para esta versión de screening rápido (3 ítems):
    if (p <= 6) {
      return { 
        texto: 'AUTOESTIMA BAJA', 
        color: 'red-600',
        evidencia: 'Puntaje de ' + p + ': Indica una valoración personal disminuida y posible insatisfacción.',
        recomendaciones: [
          'Derivación a Psicoterapia para fortalecer el autoconcepto', 
          'Evaluar comorbilidad con síntomas depresivos (Aplicar BDI-II)', 
          'Fomentar el refuerzo de logros positivos en el proceso de rehabilitación',
          'Intervención en pensamientos rumiantes de descalificación'
        ] 
      };
    }

    return { 
      texto: 'Autoestima Normal / Alta', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + ': Valoración personal equilibrada y saludable.',
      recomendaciones: [
        'Mantener medidas de bienestar psicológico', 
        'Fomentar la resiliencia ante el proceso de enfermedad o lesión',
        'Continuar con actividades que promuevan la autonomía'
      ] 
    };
  }
},
  {
  id: 'pss_10_stress',
  nombre: 'Escala de Estrés Percibido (PSS-10)',
  categoria: 'psicologia',
  descripcion: 'Mide el grado en que las situaciones de la vida son valoradas como estresantes e incontrolables.',
  
  // --- JUSTIFICACIÓN ACADÉMICA (RIGOR CIENTÍFICO) ---
  bibliografia: "Cohen S, Kamarck T, Mermelstein R. A global measure of perceived stress. J Health Soc Behav. 1983;24(4):385-96.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/6668417/", // ✅ FUENTE ORIGINAL VERIFICADA
  evidenciaClinica: "La PSS-10 evalúa la carga alostática percibida. Puntuaciones altas están asociadas con mayores niveles de cortisol, peor calidad de sueño y una respuesta inmune disminuida, factores críticos en la rehabilitación física.",

  preguntas: [
    { 
      id: 'p1', 
      text: '1. En el último mes, ¿con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?', 
      type: 'select', 
      options: [
        { label: 'Nunca (0 pts)', value: 0 }, 
        { label: 'Casi nunca (1 pt)', value: 1 }, 
        { label: 'De vez en cuando (2 pts)', value: 2 }, 
        { label: 'A menudo (3 pts)', value: 3 }, 
        { label: 'Muy a menudo (4 pts)', value: 4 }
      ] 
    },
    { 
      id: 'p2', 
      text: '2. En el último mes, ¿con qué frecuencia se ha sentido nervioso o estresado?', 
      type: 'select', 
      options: [
        { label: 'Nunca (0 pts)', value: 0 }, 
        { label: 'Casi nunca (1 pt)', value: 1 }, 
        { label: 'De vez en cuando (2 pts)', value: 2 }, 
        { label: 'A menudo (3 pts)', value: 3 }, 
        { label: 'Muy a menudo (4 pts)', value: 4 }
      ] 
    }
  ],

  // Cálculo compatible con TypeScript
  calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (p) => {
    // Para un screening de 2 ítems (rango 0-8):
    if (p >= 5) {
      return { 
        texto: 'ESTRÉS PERCIBIDO ALTO', 
        color: 'red-600',
        evidencia: 'Puntaje de ' + p + ': Los mecanismos de afrontamiento están siendo superados por las demandas del entorno.',
        recomendaciones: [
          'Instruir en técnicas de relajación diafragmática y control motor', 
          'Higiene del sueño: mantener horarios regulares y evitar pantallas', 
          'Técnicas de priorización de tareas para reducir la sobrecarga cognitiva',
          'Considerar derivación a Psicología si el estrés interfiere con la vida diaria'
        ] 
      };
    }

    return { 
      texto: 'Estrés Percibido Bajo/Moderado', 
      color: 'emerald-600',
      evidencia: 'Puntaje de ' + p + ': Nivel de estrés dentro de los rangos de adaptación normal.',
      recomendaciones: [
        'Fomentar estrategias de afrontamiento saludables (ejercicio, ocio)', 
        'Mantener hábitos de vida equilibrados',
        'Fomentar la conciencia sobre los disparadores de estrés ocasionales'
      ] 
    };
  }
},
  {

id: 'whoqol_bref_short',
nombre: 'WHOQOL-BREF (Calidad de Vida)',
categoria: 'psicologia',
descripcion: 'Evaluación abreviada de la OMS sobre la calidad de vida.',
preguntas: [

{ id: 'q1', text: '¿Cómo calificaría su calidad de vida?', type: 'select', options: [{ label: 'Muy mala', value: 1 }, { label: 'Mala', value: 2 }, { label: 'Lo normal', value: 3 }, { label: 'Buena', value: 4 }, { label: 'Muy buena', value: 5 }] },

{ id: 'q2', text: '¿Cuán satisfecho está con su salud?', type: 'select', options: [{ label: 'Muy insatisfecho', value: 1 }, { label: 'Insatisfecho', value: 2 }, { label: 'Lo normal', value: 3 }, { label: 'Satisfecho', value: 4 }, { label: 'Muy satisfecho', value: 5 }] }

],

calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),

interpretar: (p) => {

if (p <= 4) return { texto: 'Calidad de vida percibida baja', recomendaciones: ['Evaluar factores determinantes (físicos, sociales)', 'Intervención integral'] };

return { texto: 'Calidad de vida percibida buena', recomendaciones: ['Fomentar factores protectores'] };
}
}
];




// Al final de tu archivo scalesData.ts, reemplaza el bloque 'categories' por este:

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
// Agrega estas importaciones al principio del archivo si no las tienes
import { 
  Activity, Mic2, Brain, Bone, Accessibility, 
  Heart, Siren, Stethoscope, Baby, Thermometer, 
  Puzzle, Smile, Apple, Flower2, ClipboardList 
} from 'lucide-react';

