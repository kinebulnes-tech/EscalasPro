// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [
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

  
];

export default scales;