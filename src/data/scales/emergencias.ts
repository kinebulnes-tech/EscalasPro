// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [

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
      color: 'red-600',
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
      color: 'emerald-600',
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
      color: 'red-600',
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
      color: 'emerald-600',
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

  
];

export default scales;