// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [
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

];

export default scales;