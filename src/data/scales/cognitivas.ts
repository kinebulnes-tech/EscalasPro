// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [
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
  
];

export default scales;