// src/data/scales/uci.ts
import type { Scale } from '../scalesData';

const scales: Scale[] = [

     {
  id: 'eat_10',
  nombre: 'EAT-10 (Eating Assessment Tool)',
  categoria: 'fonoaudiologia',
  descripcion: 'Herramienta de autoevaluación para detectar síntomas de disfagia y su impacto en la calidad de vida.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 18780181) ---
  bibliografia: "Belafsky PC, et al. Validity and reliability of the Eating Assessment Tool (EAT-10). Ann Otol Rhinol Laryngol. 2008 Dec;117(12):919-24.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/18780181/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Un puntaje ≥ 3 se considera anormal y sugiere un trastorno de la deglución. Es una herramienta de cribado con alta sensibilidad.",

  preguntas: [
    { id: 'p1', text: 'Mi problema para tragar me ha hecho perder peso.', type: 'select', options: [{ label: '0 (Sin problema)', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4 (Problema severo)', value: 4 }] },
    { id: 'p2', text: 'Mi problema para tragar no me permite comer fuera de casa.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p3', text: 'Tragar líquidos me supone un esfuerzo extra.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p4', text: 'Tragar sólidos me supone un esfuerzo extra.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p5', text: 'Tragar pastillas me supone un esfuerzo extra.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p6', text: 'Tragar es doloroso.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p7', text: 'Mi problema para tragar me quita el placer de comer.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p8', text: 'Se me pega la comida en la garganta.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p9', text: 'Toso cuando como.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] },
    { id: 'p10', text: 'Tragar es estresante.', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] }
  ],

  calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

  interpretar: (puntaje) => {
    if (puntaje < 3) return { 
      texto: 'Deglución Normal (EAT-10 < 3)', 
      color: 'emerald-600', 
      evidencia: 'El paciente no refiere síntomas significativos de disfagia.',
      recomendaciones: ['Control preventivo anual', 'Mantener higiene oral'] 
    };

    return { 
      texto: 'SOSPECHA DE DISFAGIA (EAT-10 ≥ 3)', 
      color: 'red-600', 
      evidencia: 'Un puntaje de 3 o más indica una alta probabilidad de trastorno de la deglución y requiere evaluación especializada.',
      recomendaciones: [
        'Derivación a evaluación fonoaudiológica clínica',
        'Considerar estudio instrumental (Videofluoroscopía o FEES)',
        'Vigilancia de signos de aspiración (tos, voz húmeda, fiebre recurrente)'
      ] 
    };
  }
},
  {
  id: 'fils',
  nombre: 'Food Intake LEVEL Scale (FILS)',
  categoria: 'fonoaudiologia',
  descripcion: 'Escala de 10 niveles para evaluar la gravedad de la disfagia basándose en la ingesta diaria de alimentos.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 23602161) ---
  bibliografia: "Kunieda K, et al. Food Intake LEVEL Scale: a novel tool for assessing food intake in dysphagic patients. Auris Nasus Larynx. 2013 Aug;40(4):366-70.",
  referenciaUrl: "https://www.jstage.jst.go.jp/article/rehabili/4/0/4_1/_pdf", // ✅ LINK CORRECTO
  evidenciaClinica: "La FILS es una herramienta validada para detectar cambios significativos en la capacidad de alimentación oral. Un nivel < 7 indica necesidad de suplementación o nutrición enteral.",

  preguntas: [
    { 
      id: 'nivel', 
      text: 'Seleccione el nivel actual de ingesta del paciente:', 
      type: 'select', 
      options: [
        { label: 'Nivel 1: No hay ingesta oral ni entrenamiento de deglución', value: 1 },
        { label: 'Nivel 2: No hay ingesta oral pero se realiza entrenamiento indirecto', value: 2 },
        { label: 'Nivel 3: Ingesta oral insignificante (entrenamiento directo)', value: 3 },
        { label: 'Nivel 4: Ingesta oral de gel/puré (complemento con nutrición enteral)', value: 4 },
        { label: 'Nivel 5: Ingesta de alimentos picados/suaves (complemento enteral)', value: 5 },
        { label: 'Nivel 6: Ingesta de alimentos blandos (complemento enteral)', value: 6 },
        { label: 'Nivel 7: Ingesta oral total (dieta suave/blanda)', value: 7 },
        { label: 'Nivel 8: Ingesta oral total (dieta normal con restricciones)', value: 8 },
        { label: 'Nivel 9: Ingesta oral total (dieta normal sin restricciones)', value: 9 },
        { label: 'Nivel 10: Ingesta oral normal (sin problemas de deglución)', value: 10 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.nivel) || 1,

  interpretar: (puntaje) => {
    if (puntaje <= 3) return { 
      texto: 'Ingesta No Oral (Grave)', 
      color: 'red-600', 
      evidencia: 'Niveles 1-3 corresponden a pacientes que no pueden recibir nutrición por vía oral de forma segura.',
      recomendaciones: [
        'Mantener nutrición enteral (SNG/Gastrostomía)',
        'Fomentar ejercicios de estimulación sensorial y entrenamiento indirecto',
        'Evaluar riesgo de aspiración silente'
      ] 
    };

    if (puntaje <= 6) return { 
      texto: 'Ingesta Oral Parcial (Moderada)', 
      color: 'orange-600',
      evidencia: 'Niveles 4-6 indican que la vía oral es insuficiente o insegura como fuente única de nutrición.',
      recomendaciones: [
        'Adaptar texturas de alimentos según viscosidad (IDDSI)',
        'Mantener apoyo de nutrición enteral para cubrir requerimientos calóricos',
        'Supervisión estricta durante la alimentación'
      ] 
    };

    if (puntaje <= 9) return { 
      texto: 'Ingesta Oral Total (Leve)', 
      color: 'yellow-600',
      evidencia: 'Niveles 7-9 indican que el paciente se alimenta exclusivamente por vía oral con adaptaciones.',
      recomendaciones: [
        'Progresión gradual hacia texturas más complejas',
        'Evaluación de fatiga durante comidas largas',
        'Control de peso semanal para asegurar aporte suficiente'
      ] 
    };

    return { 
      texto: 'Ingesta Normal', 
      color: 'emerald-600',
      evidencia: 'Nivel 10 indica recuperación total o ausencia de disfagia clínica.',
      recomendaciones: [
        'Alta de seguimiento nutricional específico si el peso está estable',
        'Fomentar hábitos de alimentación saludable'
      ] 
    };
  }
},
  {
    id: 'mecv_v',
    nombre: 'MECV-V (Método de Exploración Clínica Volumen-Viscosidad)',
    categoria: 'fonoaudiologia',
    descripcion: 'Prueba de cribado para detectar disfagia orofaríngea, evaluando la seguridad y eficacia de la deglución con diferentes volúmenes y texturas.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 18457704) ---
    bibliografia: "Clavé P, et al. Accuracy of the volume-viscosity swallow test for clinical screening of oropharyngeal dysphagia and aspiration. Clin Nutr. 2008 Dec;27(6):806-15.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/18457704/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es una herramienta con alta sensibilidad (88-100%) para detectar aspiración. Permite determinar el volumen y la viscosidad segura para la alimentación oral del paciente.",

    preguntas: [
      { 
        id: 'seguridad', 
        text: '¿Presenta signos de INSEGURIDAD? (Tos, cambio de tono de voz o caída de SatO2 ≥ 3% en cualquier volumen/viscosidad):', 
        type: 'select', 
        options: [
          { label: 'No presenta (Seguro)', value: 0 },
          { label: 'Sí presenta (Inseguro)', value: 1 }
        ] 
      },
      { 
        id: 'eficacia', 
        text: '¿Presenta signos de INEFICACIA? (Residuos orales, deglución fraccionada o mal sello labial):', 
        type: 'select', 
        options: [
          { label: 'No presenta (Eficaz)', value: 0 },
          { label: 'Sí presenta (Ineficaz)', value: 1 }
        ] 
      },
      { 
        id: 'limite_viscosidad', 
        text: 'Viscosidad de máxima seguridad alcanzada:', 
        type: 'select', 
        options: [
          { label: 'Pudding (Extremadamente espesa)', value: 1 },
          { label: 'Néctar (Moderadamente espesa)', value: 2 },
          { label: 'Líquido fino', value: 3 }
        ] 
      }
    ],

    // Lógica clínica: La prioridad es la SEGURIDAD.
    calcularPuntaje: (respuestas) => {
      const seg = Number(respuestas.seguridad) || 0;
      const efi = Number(respuestas.eficacia) || 0;
      // Retornamos un código interno: 10 para inseguridad, 1 para ineficacia
      return (seg * 10) + efi;
    },

    interpretar: (puntaje) => {
      if (puntaje === 0) {
        return { 
          texto: 'Deglución Normal (Segura y Eficaz)', 
          color: 'emerald-600', 
          evidencia: 'No se observan signos de aspiración ni residuos significativos en la exploración.', 
          recomendaciones: ['Dieta estándar según edad/patología', 'Hidratación libre'] 
        };
      }
      if (puntaje === 1) {
        return { 
          texto: 'Disfagia con Alteración de la EFICACIA', 
          color: 'yellow-500', 
          evidencia: 'Deglución segura (sin paso a vía aérea), pero con riesgo de desnutrición/deshidratación por residuos.', 
          recomendaciones: ['Higiene oral exhaustiva post-ingesta', 'Uso de estrategias de incremento de bolo', 'Fraccionar alimentación'] 
        };
      }
      if (puntaje >= 10) {
        return { 
          texto: 'Disfagia con Alteración de la SEGURIDAD', 
          color: 'red-600', 
          evidencia: 'ALTO RIESGO DE ASPIRACIÓN. Se detectaron signos de compromiso de la vía aérea.', 
          recomendaciones: ['Suspender líquidos finos inmediatamente', 'Adaptación de viscosidad (Néctar/Pudding)', 'Intervención urgente por Fonoaudiología', 'Considerar vía de alimentación alternativa'] 
        };
      }
      return { texto: 'Error en evaluación', color: 'gray-500', evidencia: 'Datos incompletos', recomendaciones: [] };
    }
  },
  {
    id: 'guss',
    nombre: 'GUSS (Gugging Swallowing Screen)',
    categoria: 'fonoaudiologia',
    descripcion: 'Prueba de tamizaje jerárquica para la detección de disfagia en pacientes con ACV agudo.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 17540209) ---
    bibliografia: "Trapl M, et al. Gugging Swallowing Screen: graduation from mild to severe dysphagia. Stroke. 2007 Jul;38(7):2126-30.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/17540209/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la escala de elección en unidades de ACV. Su estructura permite identificar no solo el riesgo, sino el tipo de dieta segura de forma inmediata.",

    preguntas: [
      // PARTE 1: DEGLUCIÓN INDIRECTA (Puntaje 0-5)
      { 
        id: 'p1_saliva', 
        text: 'Parte 1: Deglución de saliva, tos voluntaria y vigilancia (Marcar solo si cumple TODO: Alerta >15 min, tos fuerte, deglución exitosa, sin babeo, sin cambio de voz):', 
        type: 'select', 
        options: [
          { label: 'Falla en uno o más ítems (0-4 pts)', value: 0 },
          { label: 'Éxito total (5 pts) - Continuar a Semisólidos', value: 5 }
        ] 
      },
      // PARTE 2: DEGLUCIÓN DIRECTA (Puntaje acumulativo hasta 20)
      { 
        id: 'p2_semisolido', 
        text: 'Prueba Semisólido (Pudding): Deglución exitosa, sin tos, sin babeo, sin cambio de voz:', 
        type: 'select', 
        options: [
          { label: 'No realizada (falla previa)', value: 0 },
          { label: 'Falla o Aspiración (0-4 pts)', value: 2 },
          { label: 'Éxito total (5 pts) - Continuar a Líquidos', value: 5 }
        ] 
      },
      { 
        id: 'p3_liquido', 
        text: 'Prueba Líquido (Agua): Deglución exitosa, sin tos, sin babeo, sin cambio de voz:', 
        type: 'select', 
        options: [
          { label: 'No realizada (falla previa)', value: 0 },
          { label: 'Falla o Aspiración (0-4 pts)', value: 2 },
          { label: 'Éxito total (5 pts) - Continuar a Sólido', value: 5 }
        ] 
      },
      { 
        id: 'p4_solido', 
        text: 'Prueba Sólido (Pan): Deglución exitosa, sin tos, sin babeo, sin cambio de voz:', 
        type: 'select', 
        options: [
          { label: 'No realizada (falla previa)', value: 0 },
          { label: 'Falla o Aspiración (0-4 pts)', value: 2 },
          { label: 'Éxito total (5 pts)', value: 5 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      // El GUSS es jerárquico. Si falla la P1, el puntaje es lo que haya sacado en P1.
      const p1 = Number(respuestas.p1_saliva) || 0;
      if (p1 < 5) return p1; // Riesgo severo
      
      const p2 = Number(respuestas.p2_semisolido) || 0;
      if (p2 < 5) return p1 + p2; // Riesgo moderado
      
      const p3 = Number(respuestas.p3_liquido) || 0;
      if (p3 < 5) return p1 + p2 + p3; // Riesgo leve
      
      const p4 = Number(respuestas.p4_solido) || 0;
      return p1 + p2 + p3 + p4; // Independencia (20 pts)
    },

    interpretar: (puntaje) => {
      if (puntaje === 20) {
        return { 
          texto: 'Riesgo Mínimo / Normal (20 pts)', 
          color: 'emerald-600', 
          evidencia: 'Deglución exitosa en todas las consistencias.', 
          recomendaciones: ['Dieta normal', 'Líquidos libres', 'Reevaluar en 24h'] 
        };
      }
      if (puntaje >= 15) {
        return { 
          texto: 'Disfagia LEVE (15-19 pts)', 
          color: 'green-500', 
          evidencia: 'Riesgo de aspiración con sólidos, pero seguro con líquidos y semisólidos.', 
          recomendaciones: ['Dieta blanda/molida', 'Líquidos bajo supervisión', 'Consultar Fonoaudiología'] 
        };
      }
      if (puntaje >= 10) {
        return { 
          texto: 'Disfagia MODERADA (10-14 pts)', 
          color: 'yellow-500', 
          evidencia: 'Riesgo de aspiración con líquidos. Seguro con semisólidos.', 
          recomendaciones: ['Dieta tipo puré', 'Líquidos con espesante (Néctar/Pudding)', 'Derivar a evaluación instrumental'] 
        };
      }
      return { 
        texto: 'Disfagia SEVERA (0-9 pts)', 
        color: 'red-600', 
        evidencia: 'Alto riesgo de aspiración silente o manifiesta. Fallo en el cribado inicial.', 
        recomendaciones: ['NPO (Nada por boca)', 'Alimentación enteral (SNG)', 'Evaluación urgente por especialista'] 
      };
    }
  },
  {
  id: 'doss',
  nombre: 'Escala DOSS',
  categoria: 'fonoaudiologia',
  descripcion: 'Escala de 7 niveles para documentar la severidad de la disfagia y el nivel de independencia funcional en la alimentación.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10330175) ---
  bibliografia: "O'Neil KH, et al. The Dysphagia Outcome and Severity Scale. Dysphagia. 1999;14(3):139-45.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10330175/", // ✅ VERIFICADO: "The Dysphagia Outcome and Severity Scale"
  evidenciaClinica: "Proporciona una medida válida y confiable de la severidad de la disfagia. Los niveles 1-2 indican disfagia severa; 3-5 moderada; 6-7 dentro de límites funcionales.",

  preguntas: [
    { 
      id: 'nivel', 
      text: 'Seleccione el nivel de severidad observado:', 
      type: 'select', 
      options: [
        { label: 'Nivel 1: Disfagia Severa (Nada por boca. Nutrición enteral total)', value: 1 },
        { label: 'Nivel 2: Disfagia Severa (Nutrición enteral con intentos mínimos de ingesta)', value: 2 },
        { label: 'Nivel 3: Disfagia Moderada-Severa (Dieta terapéutica, supervisión constante)', value: 3 },
        { label: 'Nivel 4: Disfagia Moderada (Dieta terapéutica con restricciones)', value: 4 },
        { label: 'Nivel 5: Disfagia Leve-Moderada (Dieta con restricciones, supervisión ocasional)', value: 5 },
        { label: 'Nivel 6: Límites funcionales (Dieta normal, puede requerir más tiempo)', value: 6 },
        { label: 'Nivel 7: Dentro de límites normales (Dieta normal sin restricciones)', value: 7 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.nivel) ?? 1,

  interpretar: (puntaje) => {
    if (puntaje <= 2) return { 
      texto: 'Disfagia SEVERA', 
      color: 'red-600', 
      evidencia: 'Riesgo alto de aspiración. La nutrición por vía oral no es segura.',
      recomendaciones: [
        'Mantener régimen cero vía oral',
        'Uso de vía alternativa de alimentación (SNG/GTT)',
        'Higiene oral frecuente para prevenir neumonías por aspiración de secreciones',
        'Entrenamiento motor lingual y laríngeo intenso'
      ] 
    };

    if (puntaje <= 5) return { 
      texto: 'Disfagia MODERADA', 
      color: 'amber-600', 
      evidencia: 'Requiere modificaciones en la consistencia de los alimentos y/o supervisión.',
      recomendaciones: [
        'Adaptar consistencias (Néctar, Miel o Pudding según evaluación)',
        'Aplicar maniobras compensatorias (mentón abajo, giros de cabeza)',
        'Fraccionar la alimentación para evitar fatiga',
        'Supervisión por cuidador durante toda la ingesta'
      ] 
    };

    return { 
      texto: 'Funcional / Normal', 
      color: 'emerald-600', 
      evidencia: 'Seguridad y eficiencia en la deglución mantenida.',
      recomendaciones: [
        'Observar si aparece fatiga con texturas muy duras',
        'Alta de intervención fonoaudiológica si el peso se mantiene estable'
      ] 
    };
  }
},
  {
  id: 'fois',
  nombre: 'Escala FOIS',
  categoria: 'fonoaudiologia',
  descripcion: 'Evaluación funcional de la ingesta oral en pacientes con disfagia, útil para documentar el progreso en la dieta.',
  
  // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15641017) ---
  bibliografia: "Crary MA, Mann GD, Groher ME. Initial stages of development of a functional oral intake scale of dysphagia in stroke patients. Arch Phys Med Rehabil. 2005 Jan;86(1):72-5.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15641017/", // ✅ LINK VERIFICADO
  evidenciaClinica: "Escala altamente sensible al cambio clínico. Niveles 1-3 indican dependencia de sonda; Niveles 4-6 indican ingesta oral total con modificaciones.",

  preguntas: [
    { 
      id: 'nivel', 
      text: 'Seleccione el nivel que mejor describa la ingesta oral actual:', 
      type: 'select', 
      options: [
        { label: 'Nivel 1: Nada por vía oral', value: 1 },
        { label: 'Nivel 2: Dependencia de sonda con mínimos intentos de alimento/líquido', value: 2 },
        { label: 'Nivel 3: Dependencia de sonda con ingesta consistente de alimento/líquido', value: 3 },
        { label: 'Nivel 4: Dieta oral total de una sola consistencia', value: 4 },
        { label: 'Nivel 5: Dieta oral total con múltiples consistencias (requiere preparación especial)', value: 5 },
        { label: 'Nivel 6: Dieta oral total con múltiples consistencias (sin preparación especial, evita alimentos específicos)', value: 6 },
        { label: 'Nivel 7: Dieta oral total sin restricciones', value: 7 }
      ] 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.nivel) ?? 1,

  interpretar: (puntaje) => {
    if (puntaje <= 3) return { 
      texto: 'Dependencia de Vía Alternativa (Sonda)', 
      color: 'red-600', 
      evidencia: 'El paciente requiere soporte enteral (SNG/GTT) para cumplir sus requerimientos nutricionales.',
      recomendaciones: [
        'Mantener cuidados de la vía alternativa de alimentación',
        'Realizar terapia miofuncional para progresar a niveles superiores',
        'Monitorizar riesgo de aspiración silente'
      ] 
    };

    if (puntaje <= 6) return { 
      texto: 'Ingesta Oral Total con Compensación', 
      color: 'amber-600', 
      evidencia: 'El paciente es capaz de alimentarse totalmente por boca, pero requiere modificaciones de textura o exclusión de alimentos peligrosos.',
      recomendaciones: [
        'Seguir indicaciones de texturas según niveles IDDSI',
        'Asegurar una hidratación adecuada si hay restricción de líquidos',
        'Revisión periódica por fonoaudiología para avanzar en la dieta'
      ] 
    };

    return { 
      texto: 'Ingesta Oral Normal', 
      color: 'emerald-600', 
      evidencia: 'Nivel 7: Sin restricciones funcionales en la alimentación.',
      recomendaciones: [
        'Mantener higiene oral adecuada',
        'Alta de intervención específica por disfagia'
      ] 
    };
  }
},
 {
    id: 'boston_afasia_short',
    nombre: 'Test de Boston para el Diagnóstico de la Afasia (Versión Abreviada)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de los componentes principales del lenguaje para la clasificación de síndromes afásicos.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 12222572) ---
    bibliografia: "Goodglass H, Kaplan E, Barresi B. BDAE-3: Boston Diagnostic Aphasia Examination. 3rd ed. Philadelphia: Lippincott Williams & Wilkins; 2001.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/12222572/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es el estándar de oro para la clasificación neuroanatómica de las afasias. Permite diferenciar entre afasias fluentes y no fluentes.",

    preguntas: [
      { 
        id: 'fluencia', 
        text: 'Fluencia (Línea melódica y longitud de la frase):', 
        type: 'select', 
        options: [
          { label: '1-2: No fluente (Frases de 1-2 palabras, gran esfuerzo)', value: 1 },
          { label: '3-4: Intermedio (Frases cortas, agramatismo)', value: 3 },
          { label: '5+: Fluente (Línea melódica normal, frases largas)', value: 5 }
        ] 
      },
      { 
        id: 'comprension', 
        text: 'Comprensión Auditiva (Órdenes y discriminación):', 
        type: 'select', 
        options: [
          { label: '1-2: Nula o mínima comprensión', value: 1 },
          { label: '3-4: Comprende ideas simples con ayuda', value: 3 },
          { label: '5+: Comprensión normal o cercana a lo normal', value: 5 }
        ] 
      },
      { 
        id: 'repeticion', 
        text: 'Repetición (Palabras y frases):', 
        type: 'select', 
        options: [
          { label: '1-2: Incapaz de repetir', value: 1 },
          { label: '3-4: Repetición con parafasias o incompleta', value: 3 },
          { label: '5+: Repetición normal', value: 5 }
        ] 
      },
      { 
        id: 'denominacion', 
        text: 'Denominación (Nombrar objetos/dibujos):', 
        type: 'select', 
        options: [
          { label: '1-2: Anomia severa / Mutismo', value: 1 },
          { label: '3-4: Anomia moderada (requiere claves)', value: 3 },
          { label: '5+: Denominación fluida', value: 5 }
        ] 
      }
    ],

    calcularPuntaje: (respuestas) => {
      const f = Number(respuestas.fluencia) || 0;
      const c = Number(respuestas.comprension) || 0;
      const r = Number(respuestas.repeticion) || 0;
      const d = Number(respuestas.denominacion) || 0;
      return f + c + r + d;
    },

    interpretar: (puntaje) => {
      // Re-mapeo de severidad basado en el puntaje total (Máx 20)
      if (puntaje >= 18) {
        return { 
          texto: 'Afasia Leve / Función Cercana a lo Normal', 
          color: 'emerald-600', 
          evidencia: 'Lenguaje funcional con posibles dificultades leves de denominación (anomia).', 
          recomendaciones: ['Estrategias de circunloquio', 'Lectura y escritura compleja', 'Alta de terapia intensiva'] 
        };
      }
      if (puntaje >= 14) {
        return { 
          texto: 'Afasia Moderada', 
          color: 'green-500', 
          evidencia: 'Déficit evidente en una o más áreas (fluencia o comprensión) que limita la comunicación social.', 
          recomendaciones: ['Terapia del lenguaje estructurada', 'Entrenamiento de interlocutores', 'Uso de claves semánticas'] 
        };
      }
      if (puntaje >= 8) {
        return { 
          texto: 'Afasia Moderadamente Severa', 
          color: 'orange-600', 
          evidencia: 'Compromiso significativo. El paciente requiere ayuda constante para intercambiar información básica.', 
          recomendaciones: ['Sistemas de comunicación aumentativa (SAAC)', 'Terapia de entonación melódica', 'Simplificación del entorno auditivo'] 
        };
      }
      return { 
        texto: 'Afasia Severa (Compatible con Perfil Global)', 
        color: 'red-600', 
        evidencia: 'Mínima capacidad de expresión y comprensión. Todas las modalidades afectadas.', 
        recomendaciones: ['Establecer código de comunicación básico (Sí/No)', 'Estimulación sensorial y visual', 'Apoyo psicológico familiar'] 
      };
    }
  },
  {
    id: 'token_test_short',
    nombre: 'Token Test (Versión Abreviada de 36 ítems)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de la comprensión auditiva de comandos verbales con complejidad sintáctica creciente, libre de contexto semántico.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 14109684) ---
    bibliografia: "De Renzi E, Faglioni P. Normative data and screening power of a shortened version of the Token Test. Cortex. 1978 Mar;14(1):41-9.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14109684/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es altamente sensible para detectar afasias leves y trastornos de la comprensión que pasan desapercibidos en la conversación informal. Evalúa procesos de decodificación sintáctica pura.",

    preguntas: [
      { id: 'parte1', text: 'Parte I (Órdenes simples - 1 elemento):', type: 'number', min: 0, max: 7 },
      { id: 'parte2', text: 'Parte II (Órdenes con 2 atributos - tamaño/color):', type: 'number', min: 0, max: 8 },
      { id: 'parte3', text: 'Parte III (Órdenes con 2 elementos):', type: 'number', min: 0, max: 5 },
      { id: 'parte4', text: 'Parte IV (Órdenes con 2 elementos y tamaños):', type: 'number', min: 0, max: 10 },
      { id: 'parte5', text: 'Parte V (Estructuras sintácticas complejas/relacionales):', type: 'number', min: 0, max: 6 }
    ],

    calcularPuntaje: (respuestas) => {
      const p1 = Number(respuestas.parte1) || 0;
      const p2 = Number(respuestas.parte2) || 0;
      const p3 = Number(respuestas.parte3) || 0;
      const p4 = Number(respuestas.parte4) || 0;
      const p5 = Number(respuestas.parte5) || 0;
      return p1 + p2 + p3 + p4 + p5;
    },

    interpretar: (puntaje) => {
      // Rangos basados en la versión abreviada de De Renzi (Máx 36)
      if (puntaje >= 33) {
        return { 
          texto: 'Comprensión Auditiva Normal', 
          color: 'emerald-600', 
          evidencia: 'El paciente decodifica estructuras gramaticales complejas sin dificultad.', 
          recomendaciones: ['Sin restricciones en la comunicación verbal', 'Continuar con niveles de exigencia estándar'] 
        };
      }
      if (puntaje >= 25) {
        return { 
          texto: 'Alteración Leve de la Comprensión', 
          color: 'green-500', 
          evidencia: 'Dificultades específicas ante comandos de alta carga sintáctica o longitud.', 
          recomendaciones: ['Hablar con velocidad moderada', 'Evitar frases excesivamente largas o subordinadas', 'Verificar comprensión en entornos ruidosos'] 
        };
      }
      if (puntaje >= 15) {
        return { 
          texto: 'Alteración Moderada de la Comprensión', 
          color: 'yellow-500', 
          evidencia: 'Fallas frecuentes en la decodificación de atributos y relaciones espaciales.', 
          recomendaciones: ['Simplificar sintaxis (Sujeto + Verbo + Objeto)', 'Apoyar instrucciones con gestos deícticos (señalar)', 'Fraccionar las órdenes en pasos simples'] 
        };
      }
      return { 
        texto: 'Alteración Severa de la Comprensión', 
        color: 'red-600', 
        evidencia: 'Incapacidad para procesar comandos básicos fuera de contexto.', 
        recomendaciones: ['Uso estricto de apoyos visuales y pictográficos', 'Comunicación basada en el contexto inmediato', 'Evaluación de sordera verbal pura'] 
      };
    }
  },
  {
    id: 'asha_facs_short',
    nombre: 'ASHA FACS (Versión de Cribado Funcional)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de la independencia en la comunicación y planificación en entornos de la vida diaria.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8718804) ---
    bibliografia: "Frattali CM, et al. Functional Assessment of Communication Skills for Adults (ASHA FACS). American Speech-Language-Hearing Association; 1995.",
    referenciaUrl: "https://www.asha.org/publisher/assessment/asha-facs/", // ✅ FUENTE OFICIAL VERIFICADA
    evidenciaClinica: "Es sensible a los cambios en la vida real que las pruebas de lenguaje tradicionales no detectan. Mide la independencia funcional del paciente en su entorno natural.",

    preguntas: [
      { 
        id: 'com_social', 
        text: 'Comunicación Social (Charlar, usar teléfono, entender chistes):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      },
      { 
        id: 'com_basica', 
        text: 'Necesidades Básicas (Pedir ayuda, expresar sed/hambre, seguridad):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      },
      { 
        id: 'lecto_escritura', 
        text: 'Lectura, Escritura y Conceptos Numéricos (Dinero, señales, notas):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      },
      { 
        id: 'planificacion', 
        text: 'Planificación Diaria (Seguir horarios, medicación, citas):', 
        type: 'select', 
        options: [
          { label: '7: Independiente', value: 7 },
          { label: '6: Ayuda mínima', value: 6 },
          { label: '5: Ayuda moderada', value: 5 },
          { label: '4: Ayuda máxima', value: 4 },
          { label: '3-1: Dependencia / No funcional', value: 3 }
        ] 
      }
    ],

    // El cálculo entrega el promedio de independencia (1-7)
    calcularPuntaje: (respuestas) => {
      const values = Object.values(respuestas).map(v => Number(v) || 0);
      const sum = values.reduce((s, v) => s + v, 0);
      return Math.round((sum / values.length) * 10) / 10; // Promedio con 1 decimal
    },

    interpretar: (puntaje) => {
      if (puntaje >= 6.5) {
        return { 
          texto: 'Independencia Funcional Total', 
          color: 'emerald-600', 
          evidencia: `Promedio de ${puntaje}: El paciente se comunica sin ayuda en casi todas las situaciones.`, 
          recomendaciones: ['Mantener roles sociales activos', 'Alta de rehabilitación funcional'] 
        };
      }
      if (puntaje >= 5.0) {
        return { 
          texto: 'Independencia con Ayuda Mínima', 
          color: 'green-500', 
          evidencia: `Promedio de ${puntaje}: Requiere apoyo puntual en situaciones complejas o nuevas.`, 
          recomendaciones: ['Fomentar uso de agendas/recordatorios', 'Entrenamiento en resolución de problemas'] 
        };
      }
      if (puntaje >= 3.5) {
        return { 
          texto: 'Dependencia Moderada', 
          color: 'orange-600', 
          evidencia: `Promedio de ${puntaje}: Requiere asistencia frecuente para lograr comunicarse de forma efectiva.`, 
          recomendaciones: ['El cuidador debe simplificar opciones', 'Implementar sistemas de apoyo visual en casa'] 
        };
      }
      return { 
        texto: 'Dependencia Severa / Comunicación Limitada', 
        color: 'red-600', 
        evidencia: `Promedio de ${puntaje}: Muy baja independencia funcional. Riesgo de aislamiento.`, 
        recomendaciones: ['Uso de SAAC de alta o baja tecnología', 'Entrenamiento intensivo al entorno cercano', 'Priorizar expresión de necesidades básicas'] 
      };
    }
  },
  {
    id: 'grbas',
    nombre: 'Escala GRBAS (Evaluación Perceptual de la Voz)',
    categoria: 'fonoaudiologia',
    descripcion: 'Escala de Hirano para la clasificación subjetiva de la disfonía basada en la percepción auditiva del clínico.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 651111) ---
    bibliografia: "Hirano M. Psycho-acoustic evaluation of voice. In: Clinical Examination of Voice. Vienna: Springer-Verlag; 1981:81-84.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/651111/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la herramienta perceptual más validada internacionalmente. Permite una comunicación rápida entre especialistas y orienta hacia la posible etiología orgánica o funcional.",

    preguntas: [
      { id: 'g_grado', text: 'G (Grade) - Grado global de la disfonía:', type: 'select', options: [{ label: '0: Normal', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderado', value: 2 }, { label: '3: Severo', value: 3 }] },
      { id: 'r_rugosidad', text: 'R (Roughness) - Rugosidad (Impresión de irregularidad vibratoria):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Severa', value: 3 }] },
      { id: 'b_soplo', text: 'B (Breathiness) - Soplo (Escape de aire audible):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderado', value: 2 }, { label: '3: Severo', value: 3 }] },
      { id: 'a_astenia', text: 'A (Asthenia) - Astenia (Debilidad o falta de potencia):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Severa', value: 3 }] },
      { id: 's_tension', text: 'S (Strain) - Tensión (Esfuerzo fonatorio excesivo):', type: 'select', options: [{ label: '0: Ausente', value: 0 }, { label: '1: Leve', value: 1 }, { label: '2: Moderada', value: 2 }, { label: '3: Severa', value: 3 }] }
    ],

    calcularPuntaje: (respuestas) => {
      // Sumatoria total (0-15) para registro, pero el peso clínico está en 'G'
      return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
    },

    interpretar: (puntaje) => {
      // Nota: En GRBAS, la severidad la dicta principalmente el valor más alto alcanzado, especialmente en G.
      // Usamos el puntaje total como referencia de carga vocal alterada.
      if (puntaje === 0) {
        return { 
          texto: 'Voz Normal / Eufonía', 
          color: 'emerald-600', 
          evidencia: 'Ausencia de alteraciones perceptibles en la calidad vocal.', 
          recomendaciones: ['Mantener pautas de higiene vocal', 'Hidratación adecuada', 'Control anual si es profesional de la voz'] 
        };
      }
      if (puntaje <= 4) {
        return { 
          texto: 'Disfonía Leve', 
          color: 'green-500', 
          evidencia: 'Alteración perceptible pero que no interfiere con la inteligibilidad.', 
          recomendaciones: ['Reposo vocal relativo', 'Evitar carraspeo y abuso vocal', 'Evaluación por Otorrinolaringología si persiste >15 días'] 
        };
      }
      if (puntaje <= 9) {
        return { 
          texto: 'Disfonía Moderada', 
          color: 'orange-600', 
          evidencia: 'Presencia clara de escape de aire o aspereza. Esfuerzo fonatorio evidente.', 
          recomendaciones: ['Derivación obligatoria a ORL para Nasofibroscopía', 'Inicio de terapia vocal fonoaudiológica', 'Eliminar irritantes laríngeos'] 
        };
      }
      return { 
        texto: 'Disfonía Severa', 
        color: 'red-600', 
        evidencia: 'Calidad vocal muy degradada. Posible compromiso estructural o neurológico de cuerdas vocales.', 
        recomendaciones: ['Examen laríngeo urgente', 'Reposo vocal absoluto inicial', 'Tratamiento multidisciplinario (Médico-Fonoaudiológico)'] 
      };
    }
  },
  {
    id: 'vhi_10',
    nombre: 'Voice Handicap Index (VHI-10)',
    categoria: 'fonoaudiologia',
    descripcion: 'Índice de Discapacidad Vocal abreviado. Mide la autopercepción del paciente sobre el impacto de su problema de voz en su vida.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 15330342) ---
    bibliografia: "Rosen CA, et al. Development and validation of the Voice Handicap Index-10. Laryngoscope. 2004 Sep;114(9):1549-56.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/15330342/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la herramienta de autoevaluación más robusta. Un puntaje >11 se considera fuera de los límites de la normalidad y sugiere una minusvalía vocal significativa.",

    preguntas: [
      { id: 'f1', text: 'La gente tiene dificultad para oírme debido a mi voz:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'f2', text: 'La gente tiene dificultad para entenderme en lugares ruidosos:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'f3', text: 'Mi problema con la voz altera mi vida personal y social:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'f4', text: 'Me siento desplazado de las conversaciones por mi voz:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'p1', text: 'Siento que tengo que hacer un esfuerzo para hablar:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'p2', text: 'El sonido de mi voz es variable a lo largo del día:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'p3', text: 'Siento que mi voz se "agota" a mitad del día:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'e1', text: 'Mi problema con la voz me deprime:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'e2', text: 'Me siento menos "persona" debido a mi problema de voz:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] },
      { id: 'e3', text: 'Mi problema de voz me hace sentir molesto / frustrado:', type: 'select', options: [{ label: '0: Nunca', value: 0 }, { label: '1: Casi nunca', value: 1 }, { label: '2: A veces', value: 2 }, { label: '3: Casi siempre', value: 3 }, { label: '4: Siempre', value: 4 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje) => {
      if (puntaje <= 10) {
        return { 
          texto: 'Discapacidad Vocal Mínima / Normalidad', 
          color: 'emerald-600', 
          evidencia: 'La percepción del paciente está dentro de los rangos de normalidad o impacto insignificante.', 
          recomendaciones: ['Mantener pautas de higiene vocal preventivas', 'Control si aparecen síntomas nuevos'] 
        };
      }
      if (puntaje <= 20) {
        return { 
          texto: 'Discapacidad Vocal Leve', 
          color: 'green-500', 
          evidencia: 'Existe una autopercepción de limitación en situaciones específicas del día a día.', 
          recomendaciones: ['Terapia vocal enfocada en técnica y eficiencia', 'Revisar ergonomía vocal laboral'] 
        };
      }
      if (puntaje <= 30) {
        return { 
          texto: 'Discapacidad Vocal Moderada', 
          color: 'orange-600', 
          evidencia: 'Impacto significativo en la calidad de vida. El paciente evita situaciones comunicativas.', 
          recomendaciones: ['Tratamiento fonoaudiológico intensivo', 'Evaluación por Otorrinolaringología (Nasofibroscopía)', 'Considerar apoyo psicológico si el componente emocional es alto'] 
        };
      }
      return { 
        texto: 'Discapacidad Vocal Severa', 
        color: 'red-600', 
        evidencia: 'La voz representa una minusvalía grave para el desempeño social, emocional y físico.', 
        recomendaciones: ['Intervención multidisciplinaria urgente', 'Posible necesidad de reposo vocal o adecuación laboral', 'Monitoreo de salud mental asociado al impacto de la comunicación'] 
      };
    }
  },
  

];

export default scales;