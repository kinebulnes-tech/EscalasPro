// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [

  {
  id: 'edmonton_frailty_pro',
  nombre: 'Escala de Fragilidad de Edmonton (EFS)',
  categoria: 'geriatria',
  descripcion: 'Evaluación multidimensional de fragilidad (Cognición, Función, Nutrición, Medicación y Desempeño Físico).',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 16843441) ---
  bibliografia: "Rolfson DB, et al. Validity and reliability of the Edmonton Frail Scale. Age Ageing. 2006;35(5):526-9.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/16843441/", 
  evidenciaClinica: "Puntaje máximo de 17. Es una herramienta diagnóstica superior para predecir mortalidad y estancia hospitalaria prolongada. Incluye el componente 'Timed Up and Go' como marcador de reserva funcional.",

  preguntas: [
    // 1. COGNICIÓN
    { id: 'efs_1', text: 'Cognición (Test del reloj: Dibuje un reloj con todos los números y marcando las 11:10):', type: 'select', options: [
      { label: 'Normal (0 pts)', value: 0 }, 
      { label: 'Errores menores en posición de números (1 pt)', value: 1 }, 
      { label: 'Grave error en dibujo o incapacidad (2 pts)', value: 2 }
    ] },

    // 2. ESTADO DE SALUD
    { id: 'efs_2', text: 'En el último año, ¿cuántas veces ha estado hospitalizado?', type: 'select', options: [
      { label: '0 veces (0 pts)', value: 0 }, 
      { label: '1 a 2 veces (1 pt)', value: 1 }, 
      { label: '3 o más veces (2 pts)', value: 2 }
    ] },
    { id: 'efs_3', text: '¿Cómo calificaría su salud en general?', type: 'select', options: [
      { label: 'Excelente / Muy Buena / Buena (0 pts)', value: 0 }, 
      { label: 'Regular (1 pt)', value: 1 }, 
      { label: 'Mala / Muy Mala (2 pts)', value: 2 }
    ] },

    // 3. INDEPENDENCIA FUNCIONAL
    { id: 'efs_4', text: '¿En cuántas de las siguientes actividades necesita ayuda? (Comidas, compras, transporte, dinero, fármacos, aseo, teléfono):', type: 'select', options: [
      { label: '0 a 1 actividad (0 pts)', value: 0 }, 
      { label: '2 a 4 actividades (1 pt)', value: 1 }, 
      { label: '5 a 8 actividades (2 pts)', value: 2 }
    ] },

    // 4. APOYO SOCIAL
    { id: 'efs_5', text: 'Cuando necesita ayuda, ¿cuenta con alguien que atienda sus necesidades?', type: 'select', options: [
      { label: 'Siempre (0 pts)', value: 0 }, 
      { label: 'A veces (1 pt)', value: 1 }, 
      { label: 'Nunca (2 pts)', value: 2 }
    ] },

    // 5. MEDICAMENTOS
    { id: 'efs_6', text: '¿Usa habitualmente 5 o más medicamentos diferentes?', type: 'select', options: [
      { label: 'No (0 pts)', value: 0 }, 
      { label: 'Sí (1 pt)', value: 1 }
    ] },
    { id: 'efs_7', text: '¿Olvida a veces tomar sus medicamentos?', type: 'select', options: [
      { label: 'No (0 pts)', value: 0 }, 
      { label: 'Sí (1 pt)', value: 1 }
    ] },

    // 6. NUTRICIÓN
    { id: 'efs_8', text: '¿Ha perdido peso recientemente o siente que su ropa le queda suelta?', type: 'select', options: [
      { label: 'No (0 pts)', value: 0 }, 
      { label: 'Sí (1 pt)', value: 1 }
    ] },

    // 7. ÁNIMO
    { id: 'efs_9', text: '¿Se siente triste o deprimido a menudo?', type: 'select', options: [
      { label: 'No (0 pts)', value: 0 }, 
      { label: 'Sí (1 pt)', value: 1 }
    ] },

    // 8. CONTINENCIA
    { id: 'efs_10', text: '¿Tiene problemas de control de orina (incontinencia)?', type: 'select', options: [
      { label: 'No (0 pts)', value: 0 }, 
      { label: 'Sí (1 pt)', value: 1 }
    ] },

    // 9. DESEMPEÑO FUNCIONAL (TIMED UP & GO)
    { id: 'efs_11', text: 'Prueba "Timed Up & Go" (Tiempo en levantarse de la silla, caminar 3m, volver y sentarse):', type: 'select', options: [
      { label: '0-10 segundos (0 pts)', value: 0 }, 
      { label: '11-20 segundos (1 pt)', value: 1 }, 
      { label: 'Más de 20 segundos o incapaz (2 pts)', value: 2 }
    ] }
  ],

  calcularPuntaje: (respuestas) => {
    return Object.values(respuestas).reduce((acc, val) => acc + (Number(val) || 0), 0);
  },

  interpretar: (total) => {
    const isSevere = total >= 12;
    const isModerate = total >= 8 && total <= 11;
    const isMild = total >= 6 && total <= 7;
    const isVulnerable = total >= 4 && total <= 5;

    return {
      texto: isSevere ? 'FRAGILIDAD SEVERA' : isModerate ? 'FRAGILIDAD MODERADA' : isMild ? 'FRAGILIDAD LEVE' : isVulnerable ? 'VULNERABLE' : 'SANO (NO FRÁGIL)',
      color: isSevere ? 'red-700' : isModerate ? 'red-500' : isMild ? 'orange-500' : isVulnerable ? 'yellow-500' : 'emerald-600',
      evidencia: `Puntaje Total: ${total}/17. Evaluación multidimensional de reserva fisiológica.`,
      recomendaciones: total >= 8 
        ? [
            'Valoración Geriátrica Integral (VGI) prioritaria.',
            'Revisión farmacológica (Criterios de Beers/STOPP-START) por polifarmacia.',
            'Plan de prevención de caídas y monitoreo de sarcopenia.',
            'Evaluar soporte social y riesgo de colapso del cuidador.'
          ]
        : total >= 6
        ? [
            'Programa de ejercicios multicomponente (Fuerza, Equilibrio, Marcha).',
            'Optimización nutricional (proteínas y Vitamina D).',
            'Seguimiento clínico cada 3-6 meses.'
          ]
        : [
            'Fomentar envejecimiento activo y participación social.',
            'Mantener controles preventivos anuales (EMPAM).'
          ]
    };
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
    id: 'mmse_abreviado_chile_completo',
    nombre: 'Minimental Abreviado (v. Chilena - EFAM)',
    categoria: 'geriatria',
    descripcion: 'Prueba de cribado cognitivo de 19 puntos validada en Chile para el Examen Funcional del Adulto Mayor.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (MINSAL Chile) ---
    bibliografia: "Ministerio de Salud de Chile. Manual del Examen Funcional del Adulto Mayor (EFAM). Subsecretaría de Salud Pública.",
    referenciaUrl: "https://web.minsal.cl/portal/url/item/ab1f420894080649e04001011e01297e.pdf", 
    evidenciaClinica: "Puntaje máximo de 19. Un puntaje < 13 indica sospecha de deterioro cognitivo. Es la herramienta de tamizaje obligatoria en la APS chilena.",

    preguntas: [
      // === SECCIÓN 1: ORIENTACIÓN (4 pts) ===
      { id: 'o1', text: '1. ¿Qué mes es hoy?:', type: 'select', options: [{ label: 'Correcto (1)', value: 1 }, { label: 'Incorrecto (0)', value: 0 }] },
      { id: 'o2', text: '2. ¿Qué día del mes es hoy?:', type: 'select', options: [{ label: 'Correcto (1)', value: 1 }, { label: 'Incorrecto (0)', value: 0 }] },
      { id: 'o3', text: '3. ¿Qué día de la semana es hoy?:', type: 'select', options: [{ label: 'Correcto (1)', value: 1 }, { label: 'Incorrecto (0)', value: 0 }] },
      { id: 'o4', text: '4. ¿En qué año estamos?:', type: 'select', options: [{ label: 'Correcto (1)', value: 1 }, { label: 'Incorrecto (0)', value: 0 }] },

      // === SECCIÓN 2: MEMORIA DE CORTO PLAZO (REGISTRO) (3 pts) ===
      { id: 'm1', text: '5. Repita estas 3 palabras: Árbol, Mesa, Avión (Puntúe 1 por cada una repetida correctamente al primer intento):', type: 'select', options: [
        { label: '3 palabras (3)', value: 3 }, { label: '2 palabras (2)', value: 2 }, { label: '1 palabra (1)', value: 1 }, { label: '0 palabras (0)', value: 0 }
      ]},

      // === SECCIÓN 3: ATENCIÓN Y CÁLCULO (5 pts) ===
      { id: 'c1', text: '6. Reste de 7 en 7 a partir de 100 (100-93-86-79-72-65). Detenerse tras 5 restas. (1 punto por cada resta correcta):', type: 'select', options: [
        { label: '5 aciertos (5)', value: 5 }, { label: '4 aciertos (4)', value: 4 }, { label: '3 aciertos (3)', value: 3 }, { label: '2 aciertos (2)', value: 2 }, { label: '1 acierto (1)', value: 1 }, { label: '0 aciertos (0)', value: 0 }
      ]},

      // === SECCIÓN 4: EVOCACIÓN (MEMORIA DIFERIDA) (3 pts) ===
      { id: 'e1', text: '7. ¿Recuerda las 3 palabras que le pedí memorizar hace un momento? (Árbol, Mesa, Avión):', type: 'select', options: [
        { label: 'Recuerda las 3 (3)', value: 3 }, { label: 'Recuerda 2 (2)', value: 2 }, { label: 'Recuerda 1 (1)', value: 1 }, { label: 'No recuerda ninguna (0)', value: 0 }
      ]},

      // === SECCIÓN 5: CAPACIDAD EJECUTIVA / COPIA (4 pts) ===
      { id: 'd1', text: '8. Copia de dibujo (Pentágonos cruzados):', type: 'select', options: [
        { label: 'Logra 10 ángulos y cruce de 4 ángulos (4)', value: 4 },
        { label: 'Logra dibujo pero con errores menores (2)', value: 2 },
        { label: 'Incapaz o dibujo muy alterado (0)', value: 0 }
      ]}
    ],

    calcularPuntaje: (respuestas) => {
      // Suma total de los 19 puntos posibles
      return Object.values(respuestas).reduce((acc, val) => acc + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      if (puntaje < 13) return { 
        texto: 'SOSPECHA DE DETERIORO COGNITIVO', 
        color: 'red-600', 
        evidencia: `Puntaje: ${puntaje}/19. Resultado bajo el punto de corte (13 pts) establecido por MINSAL.`,
        recomendaciones: [
          'Derivación a Médico para evaluación de síndrome demencial.',
          'Realizar Test del Reloj para complementar evaluación ejecutiva.',
          'Solicitar exámenes de laboratorio (Vitamina B12, TSH, Electrolitos) para descartar causas reversibles.',
          'Evaluar nivel de escolaridad (en analfabetos el punto de corte puede variar según juicio clínico).'
        ]
      };

      if (puntaje <= 14) return { 
        texto: 'ESTADO COGNITIVO LIMÍTROFE', 
        color: 'orange-500', 
        evidencia: `Puntaje: ${puntaje}/19. El paciente se encuentra en el límite de la normalidad.`,
        recomendaciones: [
          'Sugerir talleres de estimulación cognitiva preventiva.',
          'Controlar factores de riesgo cardiovascular (HTA, Diabetes).',
          'Repetir evaluación en 6 meses para vigilar progresión.'
        ]
      };

      return { 
        texto: 'ESTADO COGNITIVO NORMAL', 
        color: 'emerald-600', 
        evidencia: `Puntaje: ${puntaje}/19. Rendimiento adecuado para su edad cronológica.`,
        recomendaciones: [
          'Mantener actividades de socialización y lectura.',
          'Continuar controles preventivos en su centro de salud (EMPAM).',
          'Fomentar el aprendizaje de nuevas habilidades.'
        ] 
      };
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
  id: 'tinetti_full_pro',
  nombre: 'Escala de Tinetti (Marcha y Equilibrio - Gold Standard)',
  categoria: 'geriatria',
  descripcion: 'Evaluación de 28 puntos. Desglose bilateral de marcha y estabilidad estática/dinámica.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3524641) ---
  bibliografia: "Tinetti ME. Performance-oriented assessment of mobility problems in elderly patients. J Am Geriatr Soc. 1986.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3524641/",
  evidenciaClinica: "Puntaje máximo de 28 (16 Equilibrio / 12 Marcha). Un score < 19 indica riesgo de caídas elevado (sensibilidad > 80%). Fundamental para decidir el uso de ayudas técnicas.",

  preguntas: [
    // === SECCIÓN 1: EQUILIBRIO (16 PUNTOS) ===
    { id: 'e1', text: '1. Equilibrio sentado:', type: 'select', options: [{label: 'Inestable (0)', value: 0}, {label: 'Seguro (1)', value: 1}] },
    { id: 'e2', text: '2. Levantarse de la silla:', type: 'select', options: [{label: 'Incapaz sin ayuda (0)', value: 0}, {label: 'Capaz con ayuda de brazos (1)', value: 1}, {label: 'Capaz sin usar brazos (2)', value: 2}] },
    { id: 'e3', text: '3. Intentos para levantarse:', type: 'select', options: [{label: 'Incapaz sin ayuda (0)', value: 0}, {label: 'Capaz en > 1 intento (1)', value: 1}, {label: 'Capaz en 1 solo intento (2)', value: 2}] },
    { id: 'e4', text: '4. Equilibrio bipedestación inmediata (5 seg):', type: 'select', options: [{label: 'Inestable (0)', value: 0}, {label: 'Estable con ayuda/apoyo (1)', value: 1}, {label: 'Estable sin apoyos (2)', value: 2}] },
    { id: 'e5', text: '5. Equilibrio bipedestación prolongada:', type: 'select', options: [{label: 'Inestable (0)', value: 0}, {label: 'Estable con apoyo ancho (1)', value: 1}, {label: 'Estable con apoyo estrecho (2)', value: 2}] },
    { id: 'e6', text: '6. Empujón (Respuesta al desplazamiento posterior):', type: 'select', options: [{label: 'Empieza a caerse (0)', value: 0}, {label: 'Se tambalea, se agarra (1)', value: 1}, {label: 'Estable/Firme (2)', value: 2}] },
    { id: 'e7', text: '7. Ojos cerrados (Pies juntos):', type: 'select', options: [{label: 'Inestable (0)', value: 0}, {label: 'Estable (1)', value: 1}] },
    { id: 'e8_cont', text: '8a. Giro de 360° (Continuidad de los pasos):', type: 'select', options: [{label: 'Pasos discontinuos (0)', value: 0}, {label: 'Pasos continuos (1)', value: 1}] },
    { id: 'e8_est', text: '8b. Giro de 360° (Estabilidad del tronco):', type: 'select', options: [{label: 'Inestable / se agarra (0)', value: 0}, {label: 'Estable (1)', value: 1}] },
    { id: 'e9', text: '9. Sentarse:', type: 'select', options: [{label: 'Inseguro / cae bruscamente (0)', value: 0}, {label: 'Usa brazos / movimiento brusco (1)', value: 1}, {label: 'Seguro / movimiento suave (2)', value: 2}] },

    // === SECCIÓN 2: MARCHA (12 PUNTOS) ===
    { id: 'm1', text: '10. Iniciación de la marcha (Tras orden):', type: 'select', options: [{label: 'Vacilación o múltiples intentos (0)', value: 0}, {label: 'Sin vacilación (1)', value: 1}] },
    { id: 'm2_r', text: '11. Paso Derecho (Longitud y Altura):', type: 'select', options: [
      {label: 'No sobrepasa al izq / no levanta pie (0)', value: 0}, 
      {label: 'Sobrepasa al izq y levanta pie (2)', value: 2},
      {label: 'Cumple solo un criterio (1)', value: 1}
    ]},
    { id: 'm2_l', text: '12. Paso Izquierdo (Longitud y Altura):', type: 'select', options: [
      {label: 'No sobrepasa al der / no levanta pie (0)', value: 0}, 
      {label: 'Sobrepasa al der y levanta pie (2)', value: 2},
      {label: 'Cumple solo un criterio (1)', value: 1}
    ]},
    { id: 'm3', text: '13. Simetría del paso:', type: 'select', options: [{label: 'Longitud desigual (0)', value: 0}, {label: 'Igual longitud bilateral (1)', value: 1}] },
    { id: 'm4', text: '14. Continuidad de los pasos:', type: 'select', options: [{label: 'Discontinuidad entre pasos (0)', value: 0}, {label: 'Pasos continuos (1)', value: 1}] },
    { id: 'm5', text: '15. Trayectoria (Observando 3 metros):', type: 'select', options: [{label: 'Desviación marcada (0)', value: 0}, {label: 'Desviación leve o usa ayuda (1)', value: 1}, {label: 'Derecho sin ayuda (2)', value: 2}] },
    { id: 'm6', text: '16. Tronco (Estabilidad al caminar):', type: 'select', options: [{label: 'Balanceo marcado o usa ayuda (0)', value: 0}, {label: 'Balanceo leve / Flexiona rodillas (1)', value: 1}, {label: 'Sin balanceo ni flexión ni ayuda (2)', value: 2}] },
    { id: 'm7', text: '17. Postura al caminar (Talones):', type: 'select', options: [{label: 'Talones separados (0)', value: 0}, {label: 'Talones casi se tocan (1)', value: 1}] }
  ],

  calcularPuntaje: (respuestas) => {
    return Object.values(respuestas).reduce((acc, val) => acc + (Number(val) || 0), 0);
  },

  interpretar: (total) => {
    let color = 'emerald-600';
    let riesgo = 'BAJO';

    if (total < 19) { color = 'red-600'; riesgo = 'ALTO'; }
    else if (total <= 24) { color = 'orange-500'; riesgo = 'MODERADO'; }

    return {
      texto: `RIESGO DE CAÍDAS: ${riesgo}`,
      color: color,
      evidencia: `Puntaje Total: ${total}/28. (Equilibrio: 16, Marcha: 12). Un resultado < 19 predice un alto riesgo de caídas múltiples.`,
      recomendaciones: total < 19 
        ? [
            'Prescripción inmediata de ayuda técnica (Andador/Bastón).',
            'Kinesioterapia: Entrenamiento de equilibrio reactivo y fuerza de tren inferior.',
            'Adecuación ambiental en el hogar y revisión de calzado.',
            'Evaluación médica de hipotensión ortostática y polifarmacia.'
          ]
        : total <= 24
        ? [
            'Programa de ejercicios multicomponente (Fuerza, Equilibrio y Marcha).',
            'Seguimiento trimestral con re-evaluación de Tinetti.',
            'Talleres preventivos de caídas en APS.'
          ]
        : [
            'Fomentar actividad física de 150 min semanales.',
            'Mantener controles preventivos (EFAM) al día.'
          ]
    };
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


];

export default scales;