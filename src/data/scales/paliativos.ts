// src/data/scales/paliativos.ts
import type { Scale, InterpretacionAvanzada } from '../scalesData';

const scales: Scale[] = [

  {
    id: 'nudesc_delirium_paliativos',
    nombre: 'Escala Nu-DESC',
    categoria: 'paliativos',
    descripcion: 'Nursing Delirium Screening Scale. Herramienta rápida para la detección y monitoreo del delirium.',
    bibliografia: "Gaudreau JD, et al. Fast and reliable: nursing delirium screening scale. J Pain Symptom Manage. 2005.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15905719/",
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

    calcularPuntaje: (respuestas) =>
      Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje): InterpretacionAvanzada => {
      if (puntaje >= 2) {
        return {
          texto: 'PROBABLE DELIRIUM (Positivo)',
          color: 'red-600',
          evidencia: `Puntaje ${puntaje}/10. Supera el umbral de corte clínico para cuadro confusional agudo.`,
          recomendaciones: [
            'Evaluar causas reversibles (fármacos, infección urinaria, globo vesical, estreñimiento)',
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
    bibliografia: "Sessler CN, et al. The Richmond Agitation-Sedation Scale: validity and reliability in adult intensive care unit patients. Am J Respir Crit Care Med. 2002.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/12446996/",
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

    interpretar: (puntaje): InterpretacionAvanzada => {
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
    bibliografia: "Gómez-Batiste X, et al. Identifying patients with chronic conditions in need of palliative care in the general population: development of the NECPAL tool. BMJ Support Palliat Care. 2013.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/23631815/",
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

    calcularPuntaje: (respuestas) =>
      Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas): InterpretacionAvanzada => {
      const preguntaSorpresa = Number(respuestas?.pregunta_sorpresa) === 1;
      const otrosIndicadores = puntaje >= 2;

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

    interpretar: (puntaje): InterpretacionAvanzada => {
      if (puntaje >= 70) {
        return {
          texto: 'Fase Estable / Independencia',
          color: 'emerald-600',
          evidencia: `PPS del ${puntaje}%. El paciente mantiene deambulación y capacidad de autocuidado.`,
          recomendaciones: [
            'Mantener actividades de la vida diaria según tolerancia',
            'Enfoque en rehabilitación paliativa preventiva',
            'Planificar deseos y voluntades anticipadas'
          ]
        };
      }

      if (puntaje >= 40) {
        return {
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
      }

      if (puntaje >= 10) {
        return {
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
      }

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
    bibliografia: "Watanabe SM, et al. The Edmonton Symptom Assessment System-Revised: etiquette for clinical use. J Palliat Med. 2011;14(6):683-4.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/21398272/",
    evidenciaClinica: "El ESAS-r es una herramienta validada para la detección precoz de distrés. Un cambio de 1 a 2 puntos en cualquier síntoma se considera clínicamente significativo (MCID) para ajustar el tratamiento analgésico o de soporte.",

    preguntas: [
      { id: 'dolor',       text: 'Dolor (0: sin dolor — 10: el peor dolor posible):',          type: 'number', min: 0, max: 10 },
      { id: 'cansancio',   text: 'Cansancio / Falta de energía (0-10):',                        type: 'number', min: 0, max: 10 },
      { id: 'nausea',      text: 'Náuseas (0-10):',                                              type: 'number', min: 0, max: 10 },
      { id: 'depresion',   text: 'Depresión / Sentirse triste (0-10):',                          type: 'number', min: 0, max: 10 },
      { id: 'ansiedad',    text: 'Ansiedad / Sentirse nervioso (0-10):',                         type: 'number', min: 0, max: 10 },
      { id: 'somnolencia', text: 'Somnolencia / Ganas de dormir (0-10):',                        type: 'number', min: 0, max: 10 },
      { id: 'apetito',     text: 'Falta de apetito (0-10):',                                     type: 'number', min: 0, max: 10 },
      { id: 'bienestar',   text: 'Malestar general (0: mejor bienestar — 10: peor posible):',    type: 'number', min: 0, max: 10 },
      { id: 'disnea',      text: 'Dificultad para respirar (0-10):',                             type: 'number', min: 0, max: 10 }
    ],

    calcularPuntaje: (respuestas) =>
      Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, respuestas): InterpretacionAvanzada => {
      const tieneDolorAlto  = (Number(respuestas?.dolor)  || 0) >= 7;
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
  }

];

export default scales;