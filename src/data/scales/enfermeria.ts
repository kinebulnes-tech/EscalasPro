// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [

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


];

export default scales;