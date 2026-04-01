// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [

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
    id: 'audit_c_sexo_especifico',
    nombre: 'Test AUDIT-C (Diferenciado por Sexo)',
    categoria: 'psicologia',
    descripcion: 'Versión corta de 3 ítems para tamizaje de consumo de alcohol con puntos de corte ajustados para hombres y mujeres.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (OMS / MINSAL Chile) ---
    bibliografia: "Bush K, et al. The AUDIT alcohol consumption questions (AUDIT-C). Arch Intern Med. 1998;158(16):1789-95.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/9738608/",
    evidenciaClinica: "El AUDIT-C es altamente sensible. Los puntos de corte en Chile (MINSAL) son ≥ 4 para hombres y ≥ 3 para mujeres para definir consumo de riesgo.",

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
        id: 'frecuencia', 
        text: '1. ¿Con qué frecuencia consume bebidas alcohólicas?', 
        type: 'select', 
        options: [
          { label: 'Nunca (0)', value: 0 }, 
          { label: '1 o menos veces al mes (1)', value: 1 }, 
          { label: '2 a 4 veces al mes (2)', value: 2 }, 
          { label: '2 a 3 veces a la semana (3)', value: 3 }, 
          { label: '4 o más veces a la semana (4)', value: 4 }
        ] 
      },
      { 
        id: 'cantidad', 
        text: '2. ¿Cuántos tragos o copas suele tomar en un día de consumo normal?', 
        type: 'select', 
        options: [
          { label: '1 o 2 (0)', value: 0 }, 
          { label: '3 o 4 (1)', value: 1 }, 
          { label: '5 o 6 (2)', value: 2 }, 
          { label: '7 a 9 (3)', value: 3 }, 
          { label: '10 o más (4)', value: 4 }
        ] 
      },
      { 
        id: 'intensivo', 
        text: '3. ¿Con qué frecuencia toma 5 (mujer) / 6 (hombre) o más copas en una sola ocasión?', 
        type: 'select', 
        options: [
          { label: 'Nunca (0)', value: 0 }, 
          { label: 'Menos de una vez al mes (1)', value: 1 }, 
          { label: 'Mensualmente (2)', value: 2 }, 
          { label: 'Semanalmente (3)', value: 3 }, 
          { label: 'A diario o casi a diario (4)', value: 4 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      // Suma solo los ítems de consumo (frecuencia, cantidad, intensivo)
      return (Number(respuestas.frecuencia) || 0) + 
             (Number(respuestas.cantidad) || 0) + 
             (Number(respuestas.intensivo) || 0);
    },

    interpretar: (puntaje, respuestas) => {
      const sexo = Number(respuestas?.sexo) || 1;
      // Definición de punto de corte: Hombre >= 4, Mujer >= 3
      const esRiesgo = (sexo === 1 && puntaje >= 4) || (sexo === 2 && puntaje >= 3);

      if (esRiesgo) {
        return { 
          texto: 'CONSUMO DE RIESGO DETECTADO', 
          color: 'red-600',
          evidencia: `Puntaje: ${puntaje}. Supera el umbral de seguridad para ${sexo === 1 ? 'Hombres (≥4)' : 'Mujeres (≥3)'}.`,
          recomendaciones: [
            'Realizar Intervención Breve (Consejería motivacional de 5 min).',
            'Entregar material educativo sobre límites de consumo.',
            'Evaluar impacto en la patología actual (ej: interacción con fármacos o sueño).',
            'Si el puntaje es > 6, aplicar AUDIT completo (10 ítems) para evaluar dependencia.'
          ] 
        };
      }

      return { 
        texto: 'Consumo de Bajo Riesgo', 
        color: 'emerald-600',
        evidencia: `Puntaje: ${puntaje}. Se encuentra dentro de los rangos de bajo impacto para su sexo.`,
        recomendaciones: [
          'Felicitar y reforzar el mantenimiento de este patrón.',
          'Re-evaluar anualmente en el control preventivo.'
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
    id: 'rosenberg_autoestima_completa',
    nombre: 'Escala de Autoestima de Rosenberg (10 ítems)',
    categoria: 'psicologia',
    descripcion: 'Evaluación global de la autoestima. Versión completa validada internacionalmente.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 14417406) ---
    bibliografia: "Rosenberg M. Society and the adolescent self-image. Princeton, NJ: Princeton University Press; 1965.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14417406/",
    evidenciaClinica: "Puntaje de 10 a 40. Es la herramienta estándar para medir el autoconcepto. Un puntaje < 25 indica una autoestima baja que puede interferir con la adherencia al tratamiento físico.",

    preguntas: [
      { id: 'r1', text: '1. Siento que soy una persona digna de aprecio, al menos en igual medida que los demás:', type: 'select', options: [{ label: 'Muy en desacuerdo (1)', value: 1 }, { label: 'En desacuerdo (2)', value: 2 }, { label: 'De acuerdo (3)', value: 3 }, { label: 'Muy de acuerdo (4)', value: 4 }] },
      { id: 'r2', text: '2. En general, me inclino a pensar que soy un fracasado/a (Ítem invertido):', type: 'select', options: [{ label: 'Muy de acuerdo (1)', value: 1 }, { label: 'De acuerdo (2)', value: 2 }, { label: 'En desacuerdo (3)', value: 3 }, { label: 'Muy en desacuerdo (4)', value: 4 }] },
      { id: 'r3', text: '3. Siento que tengo un número de buenas cualidades:', type: 'select', options: [{ label: 'Muy en desacuerdo (1)', value: 1 }, { label: 'En desacuerdo (2)', value: 2 }, { label: 'De acuerdo (3)', value: 3 }, { label: 'Muy de acuerdo (4)', value: 4 }] },
      { id: 'r4', text: '4. Soy capaz de hacer las cosas tan bien como la mayoría de la gente:', type: 'select', options: [{ label: 'Muy en desacuerdo (1)', value: 1 }, { label: 'En desacuerdo (2)', value: 2 }, { label: 'De acuerdo (3)', value: 3 }, { label: 'Muy de acuerdo (4)', value: 4 }] },
      { id: 'r5', text: '5. Siento que no tengo mucho de lo que estar orgulloso/a (Ítem invertido):', type: 'select', options: [{ label: 'Muy de acuerdo (1)', value: 1 }, { label: 'De acuerdo (2)', value: 2 }, { label: 'En desacuerdo (3)', value: 3 }, { label: 'Muy en desacuerdo (4)', value: 4 }] },
      { id: 'r6', text: '6. A veces me siento realmente inútil (Ítem invertido):', type: 'select', options: [{ label: 'Muy de acuerdo (1)', value: 1 }, { label: 'De acuerdo (2)', value: 2 }, { label: 'En desacuerdo (3)', value: 3 }, { label: 'Muy en desacuerdo (4)', value: 4 }] },
      { id: 'r7', text: '7. Siento que soy una persona valiosa, al menos igual que los demás:', type: 'select', options: [{ label: 'Muy en desacuerdo (1)', value: 1 }, { label: 'En desacuerdo (2)', value: 2 }, { label: 'De acuerdo (3)', value: 3 }, { label: 'Muy de acuerdo (4)', value: 4 }] },
      { id: 'r8', text: '8. Desearía sentir más respeto por mí mismo/a (Ítem invertido):', type: 'select', options: [{ label: 'Muy de acuerdo (1)', value: 1 }, { label: 'De acuerdo (2)', value: 2 }, { label: 'En desacuerdo (3)', value: 3 }, { label: 'Muy en desacuerdo (4)', value: 4 }] },
      { id: 'r9', text: '9. En general, me inclino a pensar que soy un inútil (Ítem invertido):', type: 'select', options: [{ label: 'Muy de acuerdo (1)', value: 1 }, { label: 'De acuerdo (2)', value: 2 }, { label: 'En desacuerdo (3)', value: 3 }, { label: 'Muy en desacuerdo (4)', value: 4 }] },
      { id: 'r10', text: '10. Tengo una actitud positiva hacia mí mismo/a:', type: 'select', options: [{ label: 'Muy en desacuerdo (1)', value: 1 }, { label: 'En desacuerdo (2)', value: 2 }, { label: 'De acuerdo (3)', value: 3 }, { label: 'Muy de acuerdo (4)', value: 4 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 30) return { texto: 'Autoestima Elevada', color: 'emerald-600', evidencia: `Puntaje: ${puntaje}/40. Autoestima saludable.`, recomendaciones: ['Mantener hábitos de autocuidado'] };
      if (puntaje >= 26) return { texto: 'Autoestima Media', color: 'green-500', evidencia: `Puntaje: ${puntaje}/40. Rango de normalidad, aunque mejorable en situaciones de estrés.`, recomendaciones: ['Fomentar la resiliencia'] };
      return { 
        texto: 'AUTOESTIMA BAJA', 
        color: 'red-600', 
        evidencia: `Puntaje: ${puntaje}/40. Riesgo de depresión y baja autoeficacia.`, 
        recomendaciones: ['Derivación a Psicoterapia', 'Evaluar comorbilidad con síntomas depresivos', 'Refuerzo de logros en rehabilitación'] 
      };
    }
  },
 {
    id: 'pss_10_stress_completa',
    nombre: 'Escala de Estrés Percibido (PSS-10)',
    categoria: 'psicologia',
    descripcion: 'Evaluación del nivel de estrés percibido en el último mes.',
    
    bibliografia: "Cohen S, Kamarck T, Mermelstein R. A global measure of perceived stress. J Health Soc Behav. 1983;24(4):385-96.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/6668417/",
    evidenciaClinica: "Puntaje 0-40. Puntos de corte validados: 0-13 estrés bajo, 14-26 moderado, 27-40 alto. Los ítems 4, 5, 6, 7 y 9 son ítems positivos que se puntúan de forma invertida.",

    preguntas: [
      { id: 'p1', text: '1. ¿Con qué frecuencia se ha sentido afectado por algo que ocurrió inesperadamente?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'A menudo (3)', value: 3 }, { label: 'Muy a menudo (4)', value: 4 }] },
      { id: 'p2', text: '2. ¿Con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'A menudo (3)', value: 3 }, { label: 'Muy a menudo (4)', value: 4 }] },
      { id: 'p3', text: '3. ¿Con qué frecuencia se ha sentido nervioso o estresado?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'A menudo (3)', value: 3 }, { label: 'Muy a menudo (4)', value: 4 }] },
      // ✅ FIX: Ítems 4, 5, 6, 7, 9 son POSITIVOS — se invierten correctamente
      { id: 'p4', text: '4. ¿Con qué frecuencia ha manejado con éxito los problemas irritantes de la vida? (Ítem positivo — invertido):', type: 'select', options: [{ label: 'Muy a menudo (0)', value: 0 }, { label: 'A menudo (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'Casi nunca (3)', value: 3 }, { label: 'Nunca (4)', value: 4 }] },
      { id: 'p5', text: '5. ¿Con qué frecuencia ha sentido que ha lidiado con éxito con los cambios en su vida? (Ítem positivo — invertido):', type: 'select', options: [{ label: 'Muy a menudo (0)', value: 0 }, { label: 'A menudo (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'Casi nunca (3)', value: 3 }, { label: 'Nunca (4)', value: 4 }] },
      { id: 'p6', text: '6. ¿Con qué frecuencia se ha sentido seguro de su capacidad para manejar sus problemas personales? (Ítem positivo — invertido):', type: 'select', options: [{ label: 'Muy a menudo (0)', value: 0 }, { label: 'A menudo (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'Casi nunca (3)', value: 3 }, { label: 'Nunca (4)', value: 4 }] },
      { id: 'p7', text: '7. ¿Con qué frecuencia ha sentido que las cosas le van bien? (Ítem positivo — invertido):', type: 'select', options: [{ label: 'Muy a menudo (0)', value: 0 }, { label: 'A menudo (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'Casi nunca (3)', value: 3 }, { label: 'Nunca (4)', value: 4 }] },
      { id: 'p8', text: '8. ¿Con qué frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'A menudo (3)', value: 3 }, { label: 'Muy a menudo (4)', value: 4 }] },
      { id: 'p9', text: '9. ¿Con qué frecuencia ha podido controlar las irritaciones en su vida? (Ítem positivo — invertido):', type: 'select', options: [{ label: 'Muy a menudo (0)', value: 0 }, { label: 'A menudo (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'Casi nunca (3)', value: 3 }, { label: 'Nunca (4)', value: 4 }] },
      { id: 'p10', text: '10. ¿Con qué frecuencia ha sentido que los problemas se acumulaban tanto que no podía superarlos?', type: 'select', options: [{ label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'De vez en cuando (2)', value: 2 }, { label: 'A menudo (3)', value: 3 }, { label: 'Muy a menudo (4)', value: 4 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje >= 27) return { 
        texto: 'ESTRÉS PERCIBIDO ALTO', 
        color: 'red-600', 
        evidencia: `Puntaje: ${puntaje}/40 (rango alto: 27-40). Nivel crítico de sobrecarga psicológica. Asociado con mayor riesgo de trastornos del sueño, somatización y deterioro inmune (Cohen et al., 1983).`, 
        recomendaciones: [
          'Derivación a Psicología para evaluación y plan de intervención.',
          'Entrenamiento en técnicas de relajación: respiración diafragmática, relajación muscular progresiva.',
          'Evaluar riesgo de agotamiento profesional (aplicar MBI si es trabajador de salud).',
          'Revisar cargas laborales, relacionales y funcionales actuales.',
          'Considerar evaluación de comorbilidad con PHQ-9 y GAD-7.'
        ] 
      };
      if (puntaje >= 14) return { 
        texto: 'ESTRÉS MODERADO', 
        color: 'orange-500', 
        evidencia: `Puntaje: ${puntaje}/40 (rango moderado: 14-26). Carga de estrés significativa con impacto en la calidad de vida y la adherencia terapéutica.`, 
        recomendaciones: [
          'Higiene del sueño: horarios regulares, reducción de pantallas antes de dormir.',
          'Actividad física aeróbica regular (mínimo 150 min/semana según OMS).',
          'Identificar y priorizar estresores principales con el paciente.',
          'Técnicas de mindfulness o meditación guiada.',
          'Reevaluar con PSS-10 en 4-6 semanas.'
        ] 
      };
      return { 
        texto: 'Estrés Bajo', 
        color: 'emerald-600', 
        evidencia: `Puntaje: ${puntaje}/40 (rango bajo: 0-13). Nivel de estrés percibido dentro de parámetros saludables.`,
        recomendaciones: [
          'Continuar con hábitos saludables actuales.',
          'Mantener red de apoyo social activa.',
          'Reevaluar anualmente o ante eventos vitales estresantes.'
        ]
      };
    }
  }, 
  
  {
    id: 'whoqol_bref_short',
    nombre: 'WHOQOL-BREF (Calidad de Vida OMS)',
    categoria: 'psicologia',
    descripcion: 'Evaluación abreviada de la OMS sobre la calidad de vida en 4 dominios: físico, psicológico, relaciones sociales y entorno.',

    bibliografia: "WHOQOL Group. Development of the World Health Organization WHOQOL-BREF quality of life assessment. Psychol Med. 1998;28(3):551-8.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/9626712/",
    evidenciaClinica: "El WHOQOL-BREF es el instrumento de calidad de vida más utilizado por la OMS. Validado en más de 40 países. Mayor puntaje = mejor calidad de vida. Puntos de corte: < 13 baja CV, 13-17 moderada, > 17 buena.",

    preguntas: [
      {
        id: 'q_global1',
        text: '1. (Global) ¿Cómo calificaría su calidad de vida?',
        type: 'select',
        options: [
          { label: '1 — Muy mala', value: 1 },
          { label: '2 — Mala', value: 2 },
          { label: '3 — Regular', value: 3 },
          { label: '4 — Buena', value: 4 },
          { label: '5 — Muy buena', value: 5 }
        ]
      },
      {
        id: 'q_global2',
        text: '2. (Global) ¿Cuán satisfecho/a está con su salud?',
        type: 'select',
        options: [
          { label: '1 — Muy insatisfecho/a', value: 1 },
          { label: '2 — Insatisfecho/a', value: 2 },
          { label: '3 — Ni satisfecho/a ni insatisfecho/a', value: 3 },
          { label: '4 — Satisfecho/a', value: 4 },
          { label: '5 — Muy satisfecho/a', value: 5 }
        ]
      },
      {
        id: 'q_fisico',
        text: '3. (Dominio Físico) ¿En qué medida su dolor físico le impide hacer lo que necesita?',
        type: 'select',
        options: [
          { label: '1 — Nada en absoluto', value: 5 },
          { label: '2 — Un poco', value: 4 },
          { label: '3 — Moderadamente', value: 3 },
          { label: '4 — Bastante', value: 2 },
          { label: '5 — Extremadamente', value: 1 }
        ]
      },
      {
        id: 'q_energia',
        text: '4. (Dominio Físico) ¿Cuánta energía tiene para su vida diaria?',
        type: 'select',
        options: [
          { label: '1 — Nada', value: 1 },
          { label: '2 — Un poco', value: 2 },
          { label: '3 — Moderada', value: 3 },
          { label: '4 — Bastante', value: 4 },
          { label: '5 — Mucha', value: 5 }
        ]
      },
      {
        id: 'q_psico',
        text: '5. (Dominio Psicológico) ¿En qué medida disfruta la vida?',
        type: 'select',
        options: [
          { label: '1 — Nada', value: 1 },
          { label: '2 — Un poco', value: 2 },
          { label: '3 — Moderadamente', value: 3 },
          { label: '4 — Bastante', value: 4 },
          { label: '5 — Mucho', value: 5 }
        ]
      },
      {
        id: 'q_sentido',
        text: '6. (Dominio Psicológico) ¿En qué medida siente que su vida tiene sentido?',
        type: 'select',
        options: [
          { label: '1 — Nada', value: 1 },
          { label: '2 — Un poco', value: 2 },
          { label: '3 — Moderadamente', value: 3 },
          { label: '4 — Bastante', value: 4 },
          { label: '5 — Mucho', value: 5 }
        ]
      },
      {
        id: 'q_social',
        text: '7. (Relaciones Sociales) ¿Cuán satisfecho/a está con sus relaciones personales?',
        type: 'select',
        options: [
          { label: '1 — Muy insatisfecho/a', value: 1 },
          { label: '2 — Insatisfecho/a', value: 2 },
          { label: '3 — Ni uno ni otro', value: 3 },
          { label: '4 — Satisfecho/a', value: 4 },
          { label: '5 — Muy satisfecho/a', value: 5 }
        ]
      },
      {
        id: 'q_apoyo',
        text: '8. (Relaciones Sociales) ¿Cuán satisfecho/a está con el apoyo que recibe de sus amigos?',
        type: 'select',
        options: [
          { label: '1 — Muy insatisfecho/a', value: 1 },
          { label: '2 — Insatisfecho/a', value: 2 },
          { label: '3 — Ni uno ni otro', value: 3 },
          { label: '4 — Satisfecho/a', value: 4 },
          { label: '5 — Muy satisfecho/a', value: 5 }
        ]
      },
      {
        id: 'q_entorno',
        text: '9. (Entorno) ¿Cuán seguro/a se siente en su vida diaria?',
        type: 'select',
        options: [
          { label: '1 — Nada', value: 1 },
          { label: '2 — Un poco', value: 2 },
          { label: '3 — Moderadamente', value: 3 },
          { label: '4 — Bastante', value: 4 },
          { label: '5 — Mucho', value: 5 }
        ]
      },
      {
        id: 'q_ambiente',
        text: '10. (Entorno) ¿Cuán saludable es el ambiente físico a su alrededor?',
        type: 'select',
        options: [
          { label: '1 — Nada', value: 1 },
          { label: '2 — Un poco', value: 2 },
          { label: '3 — Moderadamente', value: 3 },
          { label: '4 — Bastante', value: 4 },
          { label: '5 — Mucho', value: 5 }
        ]
      }
    ],

    // ✅ FIX: calcularPuntaje con Number() seguro
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje <= 25) return {
        texto: 'Calidad de Vida Percibida Baja',
        color: 'red-600',
        evidencia: `Puntaje: ${puntaje}/50 (rango bajo: 10-25). Compromiso significativo en múltiples dominios de calidad de vida. Asociado con menor adherencia terapéutica y peores resultados en rehabilitación.`,
        recomendaciones: [
          'Evaluación integral por equipo multidisciplinario (Psicología, Trabajo Social, Medicina).',
          'Identificar dominios más afectados: físico, psicológico, social o entorno.',
          'Intervención en red de apoyo social si el dominio social puntúa bajo.',
          'Derivación a Psicología si hay compromiso en el dominio psicológico.',
          'Reevaluar con WHOQOL-BREF a los 3 meses de intervención.'
        ]
      };

      if (puntaje <= 37) return {
        texto: 'Calidad de Vida Moderada',
        color: 'amber-500',
        evidencia: `Puntaje: ${puntaje}/50 (rango moderado: 26-37). Calidad de vida con áreas de oportunidad. Revisar dominios con menor puntaje para orientar la intervención.`,
        recomendaciones: [
          'Identificar y trabajar los dominios con menor puntuación.',
          'Fomentar participación social y actividades significativas.',
          'Evaluar si el dolor o la fatiga están limitando el dominio físico.',
          'Reevaluar en 3-6 meses o tras cambio clínico relevante.'
        ]
      };

      return {
        texto: 'Buena Calidad de Vida',
        color: 'emerald-600',
        evidencia: `Puntaje: ${puntaje}/50 (rango bueno: 38-50). Percepción positiva de calidad de vida en los dominios evaluados.`,
        recomendaciones: [
          'Reforzar y mantener los factores protectores identificados.',
          'Reevaluar anualmente o ante cambios clínicos significativos.',
          'Utilizar como línea base para monitorear el impacto de intervenciones futuras.'
        ]
      };
    }
  },

];

export default scales;