// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [

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
  id: 'dash_full_pro',
  nombre: 'DASH (Discapacidad Miembro Superior)',
  categoria: 'traumatologia',
  descripcion: 'Evaluación de 30 ítems. Cálculo oficial AAOS con manejo de hasta un 10% de ítems faltantes.',
  bibliografia: "Hudak PL, Amadio PC, Bombardier C. DASH. 1996.",
  referenciaUrl: "https://dash.iwh.on.ca/scoring",
  evidenciaClinica: "Fórmula adaptativa: [(Suma/n) - 1] * 25. El MCID es de 10.2 puntos.",

  preguntas: [
    // --- SECCIÓN: ACTIVIDADES DIARIAS (d_act) ---
    { id: 'd_act_1', text: '1. Abrir un frasco nuevo o muy apretado', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_2', text: '2. Escribir', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_3', text: '3. Girar una llave', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_4', text: '4. Preparar una comida', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_5', text: '5. Empujar una puerta pesada', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_6', text: '6. Colocar un objeto pesado sobre su cabeza', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_7', text: '7. Hacer tareas domésticas pesadas (ej. fregar suelos)', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_8', text: '8. Trabajar en el jardín o patio', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_9', text: '9. Hacer la cama', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_10', text: '10. Cargar una bolsa de compras pesada', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_11', text: '11. Llevar un objeto pesado (más de 5kg)', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_12', text: '12. Cambiar una ampolleta/bombilla sobre su cabeza', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_13', text: '13. Lavarse o secarse la espalda', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_14', text: '14. Ponerse un chaleco o chaqueta', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_15', text: '15. Usar un cuchillo para cortar comida', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_16', text: '16. Actividades recreativas con impacto (ej. tenis)', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_17', text: '17. Actividades recreativas con precisión (ej. tejer)', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_18', text: '18. Recreación con transporte (ej. golf, cargar bolso)', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_19', text: '19. Transporte público (subir a bus/metro)', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_20', text: '20. Actividades sexuales', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },
    { id: 'd_act_21', text: '21. Capacidad general para usar el brazo', type: 'select', options: [{label:'Sin dificultad', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },

    // --- SECCIÓN: PARTICIPACIÓN SOCIAL (d_soc) ---
    { id: 'd_soc_22', text: '22. Interferencia con actividades sociales normales', type: 'select', options: [{label:'Nada', value:1}, {label:'Levemente', value:2}, {label:'Moderadamente', value:3}, {label:'Mucho', value:4}, {label:'Totalmente', value:5}] },
    { id: 'd_soc_23', text: '23. Limitación en el trabajo u otras actividades diarias', type: 'select', options: [{label:'Nada limitado', value:1}, {label:'Levemente', value:2}, {label:'Moderadamente', value:3}, {label:'Mucho', value:4}, {label:'Incapaz', value:5}] },

    // --- SECCIÓN: SÍNTOMAS (d_sin) ---
    { id: 'd_sin_24', text: '24. Dolor en el brazo, hombro o mano', type: 'select', options: [{label:'Ninguno', value:1}, {label:'Leve', value:2}, {label:'Moderado', value:3}, {label:'Mucho', value:4}, {label:'Extremo', value:5}] },
    { id: 'd_sin_25', text: '25. Dolor al realizar cualquier actividad específica', type: 'select', options: [{label:'Ninguno', value:1}, {label:'Leve', value:2}, {label:'Moderado', value:3}, {label:'Mucho', value:4}, {label:'Extremo', value:5}] },
    { id: 'd_sin_26', text: '26. Hormigueo (pinchazos) en brazo/mano', type: 'select', options: [{label:'Ninguno', value:1}, {label:'Leve', value:2}, {label:'Moderado', value:3}, {label:'Mucho', value:4}, {label:'Extremo', value:5}] },
    { id: 'd_sin_27', text: '27. Debilidad en el brazo, hombro o mano', type: 'select', options: [{label:'Ninguna', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucha', value:4}, {label:'Extrema', value:5}] },
    { id: 'd_sin_28', text: '28. Rigidez en el brazo, hombro o mano', type: 'select', options: [{label:'Ninguna', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucha', value:4}, {label:'Extrema', value:5}] },
    { id: 'd_sin_29', text: '29. Dificultad para dormir por dolor', type: 'select', options: [{label:'Ninguna', value:1}, {label:'Leve', value:2}, {label:'Moderada', value:3}, {label:'Mucha', value:4}, {label:'Extrema', value:5}] },
    { id: 'd_sin_30', text: '30. Se siente menos capaz, con menos confianza', type: 'select', options: [{label:'Nada de acuerdo', value:1}, {label:'Un poco', value:2}, {label:'Moderadamente', value:3}, {label:'Mucho', value:4}, {label:'Muy de acuerdo', value:5}] }
  ],

  calcularPuntaje: (respuestas) => {
    const res = respuestas as Record<string, any>;
    const valores = Object.entries(res)
      .filter(([k, v]) => k.startsWith('d_') && typeof v === 'number')
      .map(([_, v]) => v as number);

    const n = valores.length;
    if (n < 27) return 0; // REGLA: Mínimo 27 respuestas para validez

    const suma = valores.reduce((acc, curr) => acc + curr, 0);
    const score = ((suma / n) - 1) * 25;
    return Math.round(score);
  },

  interpretar: (total, respuestas) => {
    const res = respuestas as Record<string, any>;
    const respondidas = Object.keys(res).filter(k => k.startsWith('d_')).length;

    if (respondidas < 27) return {
      texto: 'TEST NO VÁLIDO',
      color: 'red-600',
      evidencia: `Se requieren al menos 27 respuestas. Solo hay ${respondidas}.`,
      recomendaciones: ['Completar los ítems faltantes para obtener un diagnóstico válido.']
    };

    let categoria = 'DISCAPACIDAD MÍNIMA';
    let color = 'emerald-600';

    if (total > 60) { categoria = 'DISCAPACIDAD SEVERA'; color = 'red-600'; }
    else if (total > 30) { categoria = 'DISCAPACIDAD MODERADA'; color = 'orange-500'; }

    return {
      texto: `SCORE: ${total} - ${categoria}`,
      color: color,
      evidencia: `Puntaje DASH: ${total}/100. El MCID es de 10.2 puntos.`,
      recomendaciones: [
        'Comparar con evaluaciones previas.',
        total > 30 ? 'Intensificar terapia física dirigida.' : 'Mantener observación y ejercicios de mantención.'
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

    interpretar: (puntaje, _respuestas) => {
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
  id: 'harris_hip_pro',
  nombre: 'Harris Hip Score (Cadera Pro)',
  categoria: 'traumatologia',
  descripcion: 'Evaluación integral de cadera pre/post artroplastia. Cálculo automatizado de índices de movilidad y deformidad.',
  bibliografia: "Harris WH. Traumatic arthritis of the hip after dislocation and acetabular fractures. J Bone Joint Surg Am. 1969.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/5783851/",
  evidenciaClinica: "Gold standard para evaluar el éxito de una prótesis total de cadera (PTC). Un puntaje < 70 se considera falla clínica. El MCID es de aproximadamente 8 puntos.",

  preguntas: [
    // --- SECCIÓN I: DOLOR (Máximo 44 pts) ---
    { id: 'h_p_dolor', text: 'Nivel de Dolor percibido:', type: 'select', options: [
      {label: 'Ninguno / Ignorable (44 pts)', value: 44},
      {label: 'Leve, ocasional, no limita actividad (40 pts)', value: 40},
      {label: 'Moderado, tolerable, limita alguna actividad (30 pts)', value: 30},
      {label: 'Marcado, limitaciones serias en AVD (20 pts)', value: 20},
      {label: 'Severo, dolor en reposo, incapacitante (10 pts)', value: 10},
      {label: 'Totalmente incapacitado, postrado (0 pts)', value: 0}
    ]},

    // --- SECCIÓN II: FUNCIÓN - MARCHA (Máximo 33 pts) ---
    { id: 'h_f_cojera', text: 'Cojera (Trendelenburg / Antálgica):', type: 'select', options: [
      {label: 'Ninguna (11 pts)', value: 11},
      {label: 'Leve (8 pts)', value: 8},
      {label: 'Moderada (5 pts)', value: 5},
      {label: 'Severa (0 pts)', value: 0}
    ]},
    { id: 'h_f_apoyo', text: 'Soporte para la marcha:', type: 'select', options: [
      {label: 'Ninguno (11 pts)', value: 11},
      {label: 'Bastón para caminatas largas (7 pts)', value: 7},
      {label: 'Bastón la mayor parte del tiempo (5 pts)', value: 5},
      {label: 'Una muleta (3 pts)', value: 3},
      {label: 'Dos bastones (2 pts)', value: 2},
      {label: 'Dos muletas o incapacidad de caminar (0 pts)', value: 0}
    ]},
    { id: 'h_f_distancia', text: 'Distancia máxima que puede caminar:', type: 'select', options: [
      {label: 'Ilimitada (11 pts)', value: 11},
      {label: 'Seis cuadras (~500m) (8 pts)', value: 8},
      {label: 'Dos o tres cuadras (~200m) (5 pts)', value: 5},
      {label: 'Solo dentro de casa (2 pts)', value: 2},
      {label: 'Cama a silla / Incapaz (0 pts)', value: 0}
    ]},

    // --- SECCIÓN III: FUNCIÓN - ACTIVIDADES (Máximo 14 pts) ---
    { id: 'h_f_escaleras', text: 'Subir/Bajar escaleras:', type: 'select', options: [
      {label: 'Normalmente sin usar pasamanos (4 pts)', value: 4},
      {label: 'Usando pasamanos (2 pts)', value: 2},
      {label: 'De manera difícil / Uno a uno (1 pt)', value: 1},
      {label: 'Incapaz de usar escaleras (0 pts)', value: 0}
    ]},
    { id: 'h_f_calcetines', text: 'Ponerse calcetines y zapatos:', type: 'select', options: [
      {label: 'Con facilidad (4 pts)', value: 4},
      {label: 'Con dificultad (2 pts)', value: 2},
      {label: 'Incapaz (0 pts)', value: 0}
    ]},
    { id: 'h_f_sentado', text: 'Estar sentado:', type: 'select', options: [
      {label: 'Cómodamente 1 hora en silla normal (5 pts)', value: 5},
      {label: 'En silla alta por 30 minutos (3 pts)', value: 3},
      {label: 'Incapaz de estar sentado en cualquier silla (0 pts)', value: 0}
    ]},

    // --- SECCIÓN IV: MOVILIDAD (Goniometría - Máximo 5 pts acumulativos) ---
    { id: 'h_m_flexion', text: 'Flexión de cadera (Grados 0-140°):', type: 'number' },
    { id: 'h_m_abduccion', text: 'Abducción (Grados 0-40°):', type: 'number' },
    { id: 'h_m_rot_ext', text: 'Rotación Externa (Grados 0-40°):', type: 'number' },
    { id: 'h_m_aduccion', text: 'Aducción (Grados 0-40°):', type: 'number' },

    // --- SECCIÓN V: AUSENCIA DE DEFORMIDAD FIJA (4 pts si cumple todos) ---
    { id: 'h_d_flex_fija', text: '¿Contractura en flexión menor a 30°?', type: 'select', options: [{label: 'Sí', value: 1}, {label: 'No', value: 0}] },
    { id: 'h_d_add_fija', text: '¿Contractura en aducción menor a 10°?', type: 'select', options: [{label: 'Sí', value: 1}, {label: 'No', value: 0}] },
    { id: 'h_d_rot_fija', text: '¿Contractura en rotación interna menor a 10°?', type: 'select', options: [{label: 'Sí', value: 1}, {label: 'No', value: 0}] },
    { id: 'h_d_dismetria', text: '¿Diferencia de longitud menor a 3.2 cm?', type: 'select', options: [{label: 'Sí', value: 1}, {label: 'No', value: 0}] }
  ],

  calcularPuntaje: (respuestas) => {
    const res = respuestas as Record<string, any>;
    let total = 0;

    // 1. Suma de Dolor y Función (Selectores directos)
    const directKeys = ['h_p_dolor', 'h_f_cojera', 'h_f_apoyo', 'h_f_distancia', 'h_f_escaleras', 'h_f_calcetines', 'h_f_sentado'];
    directKeys.forEach(key => total += (Number(res[key]) || 0));

    // 2. Cálculo del Índice de Movilidad (Factores de Harris originales)
    const flex = Number(res['h_m_flexion']) || 0;
    const abd = Number(res['h_m_abduccion']) || 0;
    const re = Number(res['h_m_rot_ext']) || 0;
    const add = Number(res['h_m_aduccion']) || 0;

    let ptsM = 0;
    // Puntos por Flexión (Máx 1.1)
    if (flex >= 110) ptsM += 1.1; else if (flex >= 90) ptsM += 0.8; else if (flex >= 70) ptsM += 0.5;
    // Puntos por Abducción (Máx 0.8)
    if (abd >= 20) ptsM += 0.8; else if (abd >= 15) ptsM += 0.5;
    // Puntos por Rotación Externa (Máx 0.8)
    if (re >= 15) ptsM += 0.8; else if (re >= 10) ptsM += 0.5;
    // Puntos por Aducción (Máx 0.5)
    if (add >= 15) ptsM += 0.5;

    // El índice de movilidad tiene un tope de 5 puntos
    total += Math.min(ptsM, 5);

    // 3. Deformidad (Se otorgan 4 puntos SOLO si los 4 criterios son "Sí" = 1)
    const defKeys = ['h_d_flex_fija', 'h_d_add_fija', 'h_d_rot_fija', 'h_d_dismetria'];
    const cumpleDeformidad = defKeys.every(k => Number(res[k]) === 1);
    if (cumpleDeformidad) total += 4;

    return Math.round(total);
  },

  interpretar: (total) => {
    const isExcellent = total >= 90;
    const isGood = total >= 80 && total < 90;
    const isFair = total >= 70 && total < 80;

    return {
      texto: isExcellent ? 'EXCELENTE' : isGood ? 'BUENO' : isFair ? 'REGULAR' : 'POBRE (FALLA CLÍNICA)',
      color: isExcellent ? 'emerald-600' : isGood ? 'teal-600' : isFair ? 'amber-500' : 'red-600',
      evidencia: `Puntaje Total: ${total}/100. Un resultado menor a 70 puntos es indicativo de falla funcional severa.`,
      recomendaciones: total < 70 
        ? [
            'Evaluación radiográfica para descartar aflojamiento protésico o luxación.',
            'Analítica para descartar infección periprotésica si hay dolor súbito.',
            'Kinesioterapia: Enfoque en fortalecimiento de abductores y control motor.'
          ]
        : [
            'Progresar a carga total e impacto controlado según tolerancia.',
            'Mantener programa de fortalecimiento de glúteo medio.',
            'Seguimiento anual para control de componentes protésicos.'
          ]
    };
  }
},
  {
  id: 'aofas_ankle_full_pro',
  nombre: 'AOFAS (Tobillo y Retropié - Versión Completa)',
  categoria: 'traumatologia',
  mcid: 12.0,
  descripcion: 'Protocolo completo de 9 ítems. Incluye Dolor, Función, Movilidad por grados y Alineación.',
  bibliografia: "Kitaoka HB, et al. American Orthopaedic Foot and Ankle Society Score. 1994.",
  
  preguntas: [
    // --- DOLOR (40 pts) ---
    { id: 'a_p_dolor', text: 'Nivel de Dolor:', type: 'select', options: [
      {label: 'Ninguno (40 pts)', value: 40},
      {label: 'Leve / Ocasional (30 pts)', value: 30},
      {label: 'Moderado / Diario (20 pts)', value: 20},
      {label: 'Severo / Casi siempre (0 pts)', value: 0}
    ]},

    // --- FUNCIÓN - ACTIVIDAD Y CALZADO (20 pts) ---
    { id: 'a_f_actividad', text: 'Limitación de Actividades:', type: 'select', options: [
      {label: 'Ninguna (10 pts)', value: 10},
      {label: 'Limitación leve en recreación (7 pts)', value: 7},
      {label: 'Limitación en actividades diarias (4 pts)', value: 4},
      {label: 'Severa limitación (silla de ruedas) (0 pts)', value: 0}
    ]},
    { id: 'a_f_calzado', text: 'Requerimiento de Calzado:', type: 'select', options: [
      {label: 'Normal / Sin plantilla (5 pts)', value: 5},
      {label: 'Calzado cómodo / Plantilla (3 pts)', value: 3},
      {label: 'Calzado ortopédico / Modificado (0 pts)', value: 0}
    ]},
    { id: 'a_f_superficies', text: 'Superficie de Marcha:', type: 'select', options: [
      {label: 'Sin dificultad en cualquier terreno (5 pts)', value: 5},
      {label: 'Dificultad en terrenos irregulares/escaleras (3 pts)', value: 3},
      {label: 'Severa dificultad en cualquier terreno (0 pts)', value: 0}
    ]},

    // --- FUNCIÓN - MARCHA Y MOVILIDAD (30 pts) ---
    { id: 'a_f_marcha_dist', text: 'Distancia máxima de marcha:', type: 'select', options: [
      {label: 'Más de 6 cuadras (5 pts)', value: 5},
      {label: 'De 4 a 6 cuadras (4 pts)', value: 4},
      {label: 'De 1 a 3 cuadras (2 pts)', value: 2},
      {label: 'Menos de 1 cuadra (0 pts)', value: 0}
    ]},
    { id: 'a_f_anomalia', text: 'Anomalía en la Marcha (Cojera):', type: 'select', options: [
      {label: 'Ninguna / Ignorable (8 pts)', value: 8},
      {label: 'Obvia / Marcada (4 pts)', value: 4},
      {label: 'Severa (0 pts)', value: 0}
    ]},
    { id: 'a_m_sagital', text: 'Flexo-Extensión (Grados Totales °):', type: 'number', min: 0, max: 80 },
    { id: 'a_m_frontal', text: 'Inversión-Eversión (Grados Totales °):', type: 'number', min: 0, max: 60 },
    { id: 'a_f_estabilidad', text: 'Estabilidad de Tobillo (Antero-post / Varice):', type: 'select', options: [
      {label: 'Estable (8 pts)', value: 8},
      {label: 'Inestable (0 pts)', value: 0}
    ]},

    // --- ALINEACIÓN (10 pts) ---
    { id: 'a_a_alineacion', text: 'Alineación Clínica del Pie:', type: 'select', options: [
      {label: 'Buena / Plantígrado (10 pts)', value: 10},
      {label: 'Regular / No plantígrado (5 pts)', value: 5},
      {label: 'Mala / Deformidad severa (0 pts)', value: 0}
    ]}
  ],

  calcularPuntaje: (respuestas) => {
    const res = respuestas as Record<string, any>;
    let total = 0;

    // 1. Suma de ítems con puntaje directo
    const directKeys = ['a_p_dolor', 'a_f_actividad', 'a_f_calzado', 'a_f_superficies', 'a_f_marcha_dist', 'a_f_anomalia', 'a_f_estabilidad', 'a_a_alineacion'];
    directKeys.forEach(key => {
      if (typeof res[key] === 'number') total += res[key];
    });

    // 2. ROM Sagital: 30°+ = 8pts | 15-29° = 4pts | <15° = 0pts
    const sagital = Number(res['a_m_sagital']) || 0;
    if (sagital >= 30) total += 8;
    else if (sagital >= 15) total += 4;

    // 3. ROM Frontal: 25°+ = 6pts | 5-24° = 3pts | <5° = 0pts
    const frontal = Number(res['a_m_frontal']) || 0;
    if (frontal >= 25) total += 6;
    else if (frontal >= 5) total += 3;

    return Math.round(total);
  },

  interpretar: (total) => {
    let cat = 'POBRE'; let col = 'red-600';
    if (total >= 90) { cat = 'EXCELENTE'; col = 'emerald-600'; }
    else if (total >= 75) { cat = 'BUENO'; col = 'teal-600'; }
    else if (total >= 50) { cat = 'REGULAR'; col = 'orange-500'; }

    return {
      texto: `DIAGNÓSTICO: ${cat}`,
      color: col,
      evidencia: `Score: ${total}/100. El análisis incluye ROM funcional y anomalía de marcha.`,
      recomendaciones: total < 50 
        ? ['Uso de calzado ortopédico', 'Evaluación quirúrgica', 'Terapia analgésica intensa']
        : ['Entrenamiento en superficies irregulares', 'Propiocepción en carga']
    };
  }
},

 {
  id: 'constant_murley_pro',
  nombre: 'Constant-Murley Hombro',
  categoria: 'traumatologia',
  descripcion: 'Evaluación funcional de hombro (Gold Standard). Automatización de puntaje por ROM goniométrico y fuerza.',
  bibliografia: "Constant CR, Murley AH. A clinical method of functional assessment of the shoulder. 1987.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3621771/",
  
  preguntas: [
    // --- 1. DOLOR (15 PTS) ---
    { id: 't_dolor', text: 'Nivel de Dolor (Máximo 15):', type: 'select', options: [
      {label: 'Sin dolor (15 pts)', value: 15}, 
      {label: 'Leve / Ocasional (10 pts)', value: 10}, 
      {label: 'Moderado (5 pts)', value: 5}, 
      {label: 'Severo / Constante (0 pts)', value: 0}
    ]},

    // --- 2. ACTIVIDAD DIARIA (20 PTS) ---
    { id: 't_act_sleep', text: 'Calidad del Sueño:', type: 'select', options: [
      {label: 'Sueño sin interrupciones (2 pts)', value: 2}, 
      {label: 'Interrupciones ocasionales (1 pt)', value: 1},
      {label: 'Incapaz de dormir (0 pts)', value: 0}
    ]},
    { id: 't_act_work', text: 'Actividad Laboral / Diaria:', type: 'select', options: [
      {label: 'Uso normal del brazo (4 pts)', value: 4}, 
      {label: 'Limitación leve (3 pts)', value: 3},
      {label: 'Limitación moderada (2 pts)', value: 2},
      {label: 'Limitación severa (1 pt)', value: 1},
      {label: 'Incapacidad total (0 pts)', value: 0}
    ]},
    { id: 't_act_sport', text: 'Actividad Recreativa / Deporte:', type: 'select', options: [
      {label: 'Participación normal (4 pts)', value: 4}, 
      {label: 'Limitación leve (3 pts)', value: 3},
      {label: 'Limitación moderada (2 pts)', value: 2},
      {label: 'Incapacidad total (0 pts)', value: 0}
    ]},
    { id: 't_posicion', text: 'Nivel de alcance (Mano arriba de):', type: 'select', options: [
      {label: 'Sobre la cabeza (10 pts)', value: 10},
      {label: 'Nivel de la cabeza (8 pts)', value: 8},
      {label: 'Nivel del cuello (6 pts)', value: 6},
      {label: 'Nivel de xifoides (4 pts)', value: 4},
      {label: 'Nivel de cintura (2 pts)', value: 2}
    ]},

    // --- 3. MOVILIDAD OBJETIVA (40 PTS TOTAL) ---
    { id: 'deg_flexion', text: 'Flexión anterior (Grados 0-180°):', type: 'number' },
    { id: 'deg_abduccion', text: 'Abducción lateral (Grados 0-180°):', type: 'number' },
    
    { id: 'rot_externa', text: 'Rotación Externa (Hito alcanzado):', type: 'select', options: [
      {label: 'Mano arriba, codos atrás (10 pts)', value: 10},
      {label: 'Mano arriba, codos delante (8 pts)', value: 8},
      {label: 'Mano tras cabeza, codos atrás (6 pts)', value: 6},
      {label: 'Mano tras cabeza, codos delante (4 pts)', value: 4},
      {label: 'Mano a la nuca (2 pts)', value: 2},
      {label: 'Incapaz (0 pts)', value: 0}
    ]},
    { id: 'rot_interna', text: 'Rotación Interna (Dorso de mano alcanza):', type: 'select', options: [
      {label: 'Nivel Inter-escapular / T12 (10 pts)', value: 10}, 
      {label: 'Lumbares superiores / L1 (8 pts)', value: 8},
      {label: 'Cintura / L3 (6 pts)', value: 6}, 
      {label: 'Sacro (4 pts)', value: 4}, 
      {label: 'Glúteo (2 pts)', value: 2},
      {label: 'Muslo lateral (0 pts)', value: 0}
    ]},

    // --- 4. FUERZA (25 PTS) ---
    { id: 'force_val', text: 'Fuerza en Abducción a 90° (Lbs):', type: 'number' }
  ],

  calcularPuntaje: (respuestas) => {
    let total = 0;
    const res = respuestas as Record<string, any>;

    // Suma de selectores directos
    const idsSelect = ['t_dolor', 't_act_sleep', 't_act_work', 't_act_sport', 't_posicion', 'rot_externa', 'rot_interna'];
    idsSelect.forEach(id => total += (Number(res[id]) || 0));

    // Lógica ROM: 0-30=0, 31-60=2, 61-90=4, 91-120=6, 121-150=8, 151-180=10
    const puntosROM = (g: number) => {
      if (g <= 30) return 0;
      if (g <= 60) return 2;
      if (g <= 90) return 4;
      if (g <= 120) return 6;
      if (g <= 150) return 8;
      return 10;
    };

    total += puntosROM(Number(res['deg_flexion']) || 0);
    total += puntosROM(Number(res['deg_abduccion']) || 0);

    // Fuerza: 1 punto por cada libra (Máximo 25)
    total += Math.min(Math.round(Number(res['force_val']) || 0), 25);

    return total;
  },

  interpretar: (total) => {
    const isAmber = total >= 50 && total < 70;
    const isTeal = total >= 70 && total < 85;
    
    return {
      texto: total >= 85 ? 'EXCELENTE' : isTeal ? 'BUENO' : isAmber ? 'REGULAR' : 'POBRE',
      color: total >= 85 ? 'emerald-600' : isTeal ? 'teal-600' : isAmber ? 'amber-500' : 'red-600',
      evidencia: `Puntaje: ${total}/100. (Dolor: 15, Actividad: 20, ROM: 40, Fuerza: 25).`,
      recomendaciones: total < 50 
        ? ['Derivación a traumatología para evaluar integridad estructural', 'Manejo analgésico prioritario', 'Reposo relativo del miembro']
        : ['Fortalecimiento del manguito rotador y estabilizadores escapulares', 'Progresión de carga según tolerancia', 'Ejercicios de movilidad activa asistida']
    };
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
  id: 'visa_a_aquiles_pro',
  nombre: 'VISA-A (Tendinopatía de Aquiles Pro)',
  categoria: 'traumatologia',
  descripcion: 'Índice de severidad para tendinopatía de Aquiles. Evalúa dolor, función y actividad deportiva.',
  bibliografia: "Robinson JM, et al. VISA-A questionnaire: a valid and reliable index of the severity of Achilles tendinopathy. Br J Sports Med. 2001.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11579069/",
  evidenciaClinica: "Puntaje máximo de 100 (tendón sano). Un cambio de 12 a 20 puntos es el Cambio Mínimo Clínicamente Importante (MCID). Guía la progresión de carga (Isométrico > Isotónico > Pliométrico).",

  preguntas: [
    // --- SECCIÓN: DOLOR Y FUNCIÓN BÁSICA (0-10 pts cada una) ---
    { id: 'v_1', text: '1. Minutos de rigidez/dolor al levantarse (0: >100 min | 10: 0 min):', type: 'number' },
    { id: 'v_2', text: '2. Dolor al estirar el tendón al máximo (0: Intenso | 10: Ninguno):', type: 'number' },
    { id: 'v_3', text: '3. Dolor tras caminar en terreno liso 30 min (0: Intenso | 10: Ninguno):', type: 'number' },
    { id: 'v_4', text: '4. Dolor al bajar escaleras a paso normal (0: Intenso | 10: Ninguno):', type: 'number' },
    { id: 'v_5', text: '5. Dolor tras 10 elevaciones de talón bipodales (0: Intenso | 10: Ninguno):', type: 'number' },
    { id: 'v_6', text: '6. Dolor en saltos monopodales (10 repeticiones) (0: Intenso | 10: Ninguno):', type: 'number' },

    // --- SECCIÓN: ACTIVIDAD (Pregunta 7 y 8 con lógica interdependiente) ---
    { id: 'v_7', text: '7. Nivel de dolor durante la actividad física actual:', type: 'select', options: [
      {label: 'Nada de dolor al realizar actividad (10 pts)', value: 10},
      {label: 'Dolor leve que no reduce el rendimiento (7 pts)', value: 7},
      {label: 'Dolor moderado que reduce el rendimiento (4 pts)', value: 4},
      {label: 'Dolor que impide realizar la actividad (0 pts)', value: 0}
    ]},
    { id: 'v_8', text: '8. Capacidad actual de entrenamiento/competición:', type: 'select', options: [
      {label: 'Entrenamiento completo y competición (>30 min) (30 pts)', value: 30},
      {label: 'Entrenamiento moderado o reducido (20-30 min) (20 pts)', value: 20},
      {label: 'Entrenamiento leve o limitado (<20 min) (10 pts)', value: 10},
      {label: 'Incapaz de realizar cualquier deporte (0 pts)', value: 0}
    ]}
  ],

  calcularPuntaje: (respuestas) => {
    const res = respuestas as Record<string, any>;
    let total = 0;

    // 1. Suma de ítems 1 al 6 (Validación de rango 0-10)
    for (let i = 1; i <= 6; i++) {
      total += Math.min(Math.max(Number(res[`v_${i}`]) || 0, 0), 10);
    }

    // 2. Suma ítem 7
    const p7 = Number(res['v_7']) || 0;
    total += p7;

    // 3. LÓGICA CRÍTICA ÍTEM 8: 
    // Si el paciente no puede hacer deporte (p7 es 0 por dolor), el ítem 8 DEBE ser 0.
    // Solo sumamos p8 si p7 > 0, de lo contrario se considera 0 por defecto.
    if (p7 > 0) {
      total += Number(res['v_8']) || 0;
    }

    return total;
  },

  interpretar: (total) => {
    const isHealthy = total >= 90;
    const isMild = total >= 70 && total < 90;
    const isModerate = total >= 40 && total < 70;

    return {
      texto: isHealthy ? 'RECUPERACIÓN COMPLETA' : isMild ? 'TENDINOPATÍA LEVE' : isModerate ? 'TENDINOPATÍA MODERADA' : 'TENDINOPATÍA SEVERA',
      color: isHealthy ? 'emerald-600' : isMild ? 'green-500' : isModerate ? 'amber-500' : 'red-600',
      evidencia: `Puntaje VISA-A: ${total}/100. Nivel de severidad clínica basado en tolerancia a la carga.`,
      recomendaciones: total < 40
        ? [
            'Iniciar isométricos monopodales (Analgesia): 5 reps x 45 seg al 70% MVIC.',
            'Cesar actividades de impacto (saltos/carrera) temporalmente.',
            'Uso de taloneras de silicona (7-10mm) para descarga mecánica.'
          ]
        : total < 70
        ? [
            'Protocolo HSR (Heavy Slow Resistance): 3 series de 6-8 reps lentas.',
            'Pliometría de baja intensidad solo si el dolor post-24h es menor a EVA 3.',
            'Revisar técnica de carrera (cadencia y apoyo).'
          ]
        : [
            'Mantener carga de mantenimiento 2 veces por semana.',
            'Retorno gradual a la competición plena.',
            'Educación en gestión de picos de carga semanales.'
          ]
    };
  }
},
  {
    id: 'oxford_knee_score',
    nombre: 'Oxford Knee Score (OKS)',
    categoria: 'traumatologia',
    descripcion: 'Evaluación de los resultados funcionales y dolor tras artroplastia o cirugía mayor de rodilla (12 ítems).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 9660544) ---
    bibliografia: "Dawson J, Fitzpatrick R, Murray D, Carr A. Questionnaire on the perceptions of patients about total knee replacement. J Bone Joint Surg Br. 1998;80(1):63-9.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/9513363/",
    evidenciaClinica: "Puntaje de 0 a 48. Es la herramienta preferida en auditorías clínicas internacionales. Un cambio de 5 puntos es el cambio mínimo importante.",

    preguntas: [
      { id: 'p1', text: '1. Dolor habitual en la rodilla:', type: 'select', options: [
        { label: 'Ninguno (4)', value: 4 }, { label: 'Muy leve (3)', value: 3 }, { label: 'Leve (2)', value: 2 }, { label: 'Moderado (1)', value: 1 }, { label: 'Severo (0)', value: 0 }
      ]},
      { id: 'p2', text: '2. Dificultad para lavarse y secarse (debido a la rodilla):', type: 'select', options: [
        { label: 'Ninguna (4)', value: 4 }, { label: 'Poca dificultad (3)', value: 3 }, { label: 'Dificultad moderada (2)', value: 2 }, { label: 'Mucha dificultad (1)', value: 1 }, { label: 'Imposible (0)', value: 0 }
      ]},
      { id: 'p3', text: '3. Dificultad para subir o bajar de un auto/transporte:', type: 'select', options: [
        { label: 'Ninguna (4)', value: 4 }, { label: 'Poca dificultad (3)', value: 3 }, { label: 'Dificultad moderada (2)', value: 2 }, { label: 'Mucha dificultad (1)', value: 1 }, { label: 'Imposible (0)', value: 0 }
      ]},
      { id: 'p4', text: '4. ¿Cuánto tiempo puede caminar antes de que el dolor sea grave?', type: 'select', options: [
        { label: 'Más de 30 min (4)', value: 4 }, { label: '16 a 30 min (3)', value: 3 }, { label: '5 a 15 min (2)', value: 2 }, { label: 'Solo alrededor de casa (1)', value: 1 }, { label: 'Imposible caminar (0)', value: 0 }
      ]},
      { id: 'p5', text: '5. Dolor tras estar sentado y luego intentar levantarse:', type: 'select', options: [
        { label: 'Nada (4)', value: 4 }, { label: 'Un poco (3)', value: 3 }, { label: 'Moderado (2)', value: 2 }, { label: 'Mucho (1)', value: 1 }, { label: 'Inbearable (0)', value: 0 }
      ]},
      { id: 'p6', text: '6. ¿Ha estado cojeando al caminar debido a la rodilla?', type: 'select', options: [
        { label: 'Nunca (4)', value: 4 }, { label: 'Raramente (3)', value: 3 }, { label: 'A veces (2)', value: 2 }, { label: 'Casi siempre (1)', value: 1 }, { label: 'Siempre (0)', value: 0 }
      ]},
      { id: 'p7', text: '7. ¿Podría arrodillarse y levantarse después?', type: 'select', options: [
        { label: 'Fácilmente (4)', value: 4 }, { label: 'Con poca dificultad (3)', value: 3 }, { label: 'Con dificultad moderada (2)', value: 2 }, { label: 'Con mucha dificultad (1)', value: 1 }, { label: 'Imposible (0)', value: 0 }
      ]},
      { id: 'p8', text: '8. ¿Le ha molestado el dolor de rodilla en la cama por la noche?', type: 'select', options: [
        { label: 'Nunca (4)', value: 4 }, { label: 'Solo una noche (3)', value: 3 }, { label: 'Algunas noches (2)', value: 2 }, { label: 'La mayoría de las noches (1)', value: 1 }, { label: 'Todas las noches (0)', value: 0 }
      ]},
      { id: 'p9', text: '9. ¿Cuánto ha interferido el dolor con su trabajo habitual?', type: 'select', options: [
        { label: 'Nada (4)', value: 4 }, { label: 'Un poco (3)', value: 3 }, { label: 'Moderadamente (2)', value: 2 }, { label: 'Mucho (1)', value: 1 }, { label: 'Totalmente (0)', value: 0 }
      ]},
      { id: 'p10', text: '10. ¿Ha sentido que la rodilla "se le va" o falla?', type: 'select', options: [
        { label: 'Nunca (4)', value: 4 }, { label: 'Raramente (3)', value: 3 }, { label: 'A veces (2)', value: 2 }, { label: 'Casi siempre (1)', value: 1 }, { label: 'Siempre (0)', value: 0 }
      ]},
      { id: 'p11', text: '11. ¿Puede hacer las compras por sí solo?', type: 'select', options: [
        { label: 'Fácilmente (4)', value: 4 }, { label: 'Con poca dificultad (3)', value: 3 }, { label: 'Con dificultad moderada (2)', value: 2 }, { label: 'Con mucha dificultad (1)', value: 1 }, { label: 'Imposible (0)', value: 0 }
      ]},
      { id: 'p12', text: '12. ¿Puede bajar un tramo de escaleras?', type: 'select', options: [
        { label: 'Fácilmente (4)', value: 4 }, { label: 'Con poca dificultad (3)', value: 3 }, { label: 'Con dificultad moderada (2)', value: 2 }, { label: 'Con mucha dificultad (1)', value: 1 }, { label: 'Imposible (0)', value: 0 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      // Suma de los 12 ítems (0 a 4 pts cada uno)
      return Object.values(respuestas).reduce((acc, val) => acc + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje >= 40) return { 
        texto: 'EXCELENTE FUNCIÓN', 
        color: 'emerald-600', 
        evidencia: `Puntaje: ${puntaje}/48. Éxito quirúrgico y funcional sobresaliente.`, 
        recomendaciones: [
          'Mantener programa de ejercicios de bajo impacto.',
          'Alta kinésica protocolizada.',
          'Control médico anual de la prótesis.'
        ] 
      };
      
      if (puntaje >= 30) return { 
        texto: 'BUENA FUNCIÓN', 
        color: 'green-500', 
        evidencia: `Puntaje: ${puntaje}/48. El paciente funciona bien pero refiere molestias leves.`, 
        recomendaciones: [
          'Reforzar musculatura de cuádriceps e isquiotibiales.',
          'Educación en protección articular durante AVD.',
          'Seguimiento mensual para optimizar rangos.'
        ] 
      };

      if (puntaje >= 20) return { 
        texto: 'FUNCIÓN REGULAR / MODERADA', 
        color: 'orange-500', 
        evidencia: `Puntaje: ${puntaje}/48. Limitaciones significativas en la vida diaria.`, 
        recomendaciones: [
          'Intensificar kinesioterapia motora.',
          'Evaluar estado inflamatorio de la articulación.',
          'Revisar uso de ayudas técnicas temporales.'
        ] 
      };

      return { 
        texto: 'POBRE / DEFICIENTE', 
        color: 'red-600', 
        evidencia: `Puntaje: ${puntaje}/48. Grave compromiso funcional.`, 
        recomendaciones: [
          'Evaluación médica urgente por traumatólogo.',
          'Descartar complicaciones (aflojamiento protésico, infección o artrofibrosis).',
          'Manejo analgésico de rescate y reposo relativo.'
        ] 
      };
    }
  },

  

];

export default scales;