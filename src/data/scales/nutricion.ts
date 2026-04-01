// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [

  {
    id: 'mna_short_form',
    nombre: 'MNA® - Versión Corta (Cribado)',
    categoria: 'nutricion',
    descripcion: 'Mini Nutritional Assessment. Herramienta de cribado rápido para detectar riesgo de malnutrición en adultos mayores.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 11507253) ---
    bibliografia: "Rubenstein LZ, et al. Screening for undernutrition in geriatric practice: developing the short-form mini-nutritional assessment (MNA-SF). J Gerontol. 2001.",
    referenciaUrl: "https://www.mna-elderly.com/",
    evidenciaClinica: "Estándar de oro en geriatría. Puntos de corte validados (Kaiser et al., 2009): 12-14 = normal, 8-11 = riesgo de malnutrición, 0-7 = malnutrición. Sensibilidad 89%, especificidad 82%. Puntajes 0-7 asociados con probabilidad 6x mayor de mortalidad hospitalaria.",

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

    // ✅ FIX: Puntos de corte corregidos con rangos explícitos y evidencia clínica completa
    interpretar: (puntaje) => {
      if (puntaje >= 12) {
        return { 
          texto: 'Estado Nutricional Normal', 
          color: 'emerald-600', 
          evidencia: `Puntaje ${puntaje}/14 (rango normal: 12-14). Sin criterios de malnutrición ni riesgo según MNA-SF (Kaiser et al., 2009). Sensibilidad 89%, especificidad 82%.`, 
          recomendaciones: [
            'Reevaluación trimestral en paciente institucionalizado o anual en comunidad.',
            'Mantener dieta equilibrada y asegurar ingesta de líquidos ≥ 1.5L/día.',
            'Fomentar actividad física para preservar masa muscular y prevenir sarcopenia.'
          ] 
        };
      }

      if (puntaje >= 8) {
        return { 
          texto: 'Riesgo de Malnutrición', 
          color: 'orange-600', 
          // ✅ FIX: rango 8-11 explícito + evidencia de mortalidad
          evidencia: `Puntaje ${puntaje}/14 (rango de riesgo: 8-11). Riesgo de malnutrición confirmado. Asociado con probabilidad 3x mayor de mortalidad hospitalaria y 1.5x mayor riesgo de rehospitalización a 90 días. Requiere evaluación nutricional completa con MNA® Versión Larga.`, 
          recomendaciones: [
            'Realizar evaluación completa con MNA® Versión Larga (18 ítems).',
            'Seguimiento de peso mensual estricto con registro.',
            'Evaluación odontológica y de deglución si hay dificultad para masticar.',
            'Enriquecer la dieta con proteínas (1.0-1.2 g/kg/día) y calorías.',
            'Reevaluar con MNA-SF en 1 mes o ante cualquier cambio clínico.'
          ] 
        };
      }

      // ✅ FIX: rango 0-7 explícito + etiqueta clínicamente precisa + evidencia de riesgo severo
      return { 
        texto: 'Malnutrición Confirmada', 
        color: 'red-600', 
        evidencia: `Puntaje ${puntaje}/14 (rango malnutrición: 0-7). Malnutrición confirmada según MNA-SF. Asociada con probabilidad 6x mayor de mortalidad hospitalaria y 1.5x mayor riesgo de rehospitalización a 90 días (Frontiers Nutr, 2022). Intervención inmediata requerida.`, 
        recomendaciones: [
          'Derivación URGENTE a Nutricionista y Médico Geriatra.',
          'Indicar suplementación nutricional oral (SNO) según requerimiento calórico-proteico.',
          'Evaluar causas médicas subyacentes: neoplasias, depresión, disfagia, polifarmacia.',
          'Monitorización semanal de peso, ingesta y fuerza de prensión manual (Handgrip).',
          'Considerar soporte enteral si la ingesta oral es insuficiente tras 3-5 días de intervención.',
          'Vigilar síndrome de realimentación si el puntaje es ≤ 4.'
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

];

export default scales;