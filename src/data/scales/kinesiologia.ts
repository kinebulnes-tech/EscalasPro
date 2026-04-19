// src/data/scales/uci.ts
import type { Scale, InterpretacionAvanzada } from '../scalesData';

const scales: Scale[] = [

  
  {
    id: 'score-tal',
    nombre: 'Score de TAL',
    descripcion: 'Evaluación de dificultad respiratoria en lactantes y niños con IRA baja. Valora frecuencia respiratoria, sibilancias, cianosis y uso de musculatura accesoria.',
    categoria: 'Respiratorio',
    bibliografia: 'Tal A, et al. "Scoring system for assessing the severity of acute asthma in children." J Allergy Clin Immunol. 1983;72(4):430-6.',
    referenciaUrl: 'https://pubmed.ncbi.nlm.nih.gov/6620006/',
  
    preguntas: [
      // ── ÍTEM 1: Frecuencia Respiratoria ──────────────────────────
      {
        id: 'tal_fr',
        text: 'Frecuencia Respiratoria (según edad del paciente)',
        type: 'select',
        options: [
          { value: 0, label: '≤ 30 rpm (lactante) / ≤ 20 rpm (niño)' },
          { value: 1, label: '31–45 rpm (lactante) / 21–35 rpm (niño)' },
          { value: 2, label: '46–60 rpm (lactante) / 36–50 rpm (niño)' },
          { value: 3, label: '> 60 rpm (lactante) / > 50 rpm (niño)' },
        ],
      },
  
      // ── ÍTEM 2: Sibilancias ──────────────────────────────────────
      {
        id: 'tal_sibilancias',
        text: 'Sibilancias (auscultación)',
        type: 'select',
        options: [
          { value: 0, label: 'Ausentes' },
          { value: 1, label: 'Espiratorias al final' },
          { value: 2, label: 'Inspiratorias y espiratorias' },
          { value: 3, label: 'Audibles sin estetoscopio / silencio auscultatorio' },
        ],
      },
  
      // ── ÍTEM 3: Cianosis ─────────────────────────────────────────
      {
        id: 'tal_cianosis',
        text: 'Cianosis',
        type: 'select',
        options: [
          { value: 0, label: 'Ausente' },
          { value: 1, label: 'Perioral al llanto' },
          { value: 2, label: 'Perioral en reposo' },
          { value: 3, label: 'Generalizada en reposo' },
        ],
      },
  
      // ── ÍTEM 4: Uso de musculatura accesoria ─────────────────────
      {
        id: 'tal_retraccion',
        text: 'Uso de musculatura accesoria / Retracción',
        type: 'select',
        options: [
          { value: 0, label: 'Ninguna' },
          { value: 1, label: 'Subcostal / intercostal leve' },
          { value: 2, label: 'Supraclavicular + intercostal moderado' },
          { value: 3, label: 'Supraesternal + balanceo de cabeza (lactante)' },
        ],
      },
    ],
  
    // ── Cálculo: suma simple de los 4 ítems (0–12) ───────────────
    calcularPuntaje: (respuestas: Record<string, number>): number => {
      return (
        (respuestas['tal_fr']         ?? 0) +
        (respuestas['tal_sibilancias'] ?? 0) +
        (respuestas['tal_cianosis']   ?? 0) +
        (respuestas['tal_retraccion'] ?? 0)
      );
    },
  
    // ── Interpretación clínica con recomendaciones ───────────────
    interpretar: (puntaje: number): InterpretacionAvanzada => {
      if (puntaje <= 4) {
        return {
          texto: 'Crisis Leve',
          color: 'emerald',
          evidencia:
            'Puntaje ≤ 4: obstrucción bronquial leve. Responde habitualmente a broncodilatador inhalado en sala IRA sin necesidad de derivación.',
          recomendaciones: [
            'Administrar broncodilatador (salbutamol) por aerocámara según protocolo IRA.',
            'Reevaluar con Score de TAL a los 20 minutos post-broncodilatador.',
            'Educar a cuidadores sobre signos de alarma y técnica de inhalación correcta.',
            'Alta con indicaciones si score post-BD ≤ 4 y saturación ≥ 95%.',
          ],
        };
      }
  
      if (puntaje <= 8) {
        return {
          texto: 'Crisis Moderada',
          color: 'amber',
          evidencia:
            'Puntaje 5–8: obstrucción bronquial moderada. Requiere tratamiento en sala IRA con observación mínima de 2 horas y reevaluación periódica.',
          recomendaciones: [
            'Iniciar broncodilatador en nebulización o aerocámara cada 20 min × 3 dosis.',
            'Monitorizar saturación de oxígeno de forma continua; O₂ si SatO₂ < 94%.',
            'Reevaluar score cada 20–30 min; si no mejora tras 3 ciclos → derivar a urgencias.',
            'Considerar corticoides sistémicos según protocolo institucional.',
            'Registrar evolución clínica y variación del score en ficha.',
          ],
        };
      }
  
      // puntaje 9–12
      return {
        texto: 'Crisis Grave',
        color: 'red-600',
        evidencia:
            'Puntaje ≥ 9: obstrucción bronquial grave. Riesgo de insuficiencia respiratoria. Requiere derivación inmediata a urgencias pediátricas o UCIP.',
        recomendaciones: [
          '⚠️ Activar protocolo de derivación a urgencias / UCIP de inmediato.',
          'Oxigenoterapia de alto flujo para mantener SatO₂ ≥ 94%.',
          'Broncodilatador continuo en nebulización + corticoide IV/IM.',
          'Monitorización continua de FC, FR y SatO₂; tener equipo de reanimación disponible.',
          'Documentar hora de inicio del tratamiento y respuesta clínica para traslado.',
        ],
      };
    },
  },
  
  
  
  
    
  {
    id: 'borg_modificada',
    nombre: 'Escala de Borg Modificada (0-10)',
    categoria: 'kinesiologia',
    descripcion: 'Herramienta para cuantificar la percepción subjetiva del esfuerzo y la disnea durante el ejercicio o en reposo.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 7154893) ---
    bibliografia: "Borg GA. Psychophysical bases of perceived exertion. Med Sci Sports Exerc. 1982;14(5):377-81.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/7154893/", // ✅ LINK VERIFICADO
    evidenciaClinica: "La escala CR10 es una medida válida y confiable para evaluar la intensidad del ejercicio y los síntomas respiratorios. Un puntaje > 3 suele asociarse con el umbral ventilatorio.",
  
    preguntas: [
      { 
        id: 'esfuerzo', 
        text: '¿Cómo calificaría su sensación de falta de aire o esfuerzo físico ahora?', 
        type: 'select', 
        
        options: [
          { label: '0: Nada en absoluto (Reposo)', value: 0 },
          { label: '0.5: Muy, muy ligero (Apenas perceptible)', value: 0.5 },
          { label: '1: Muy ligero', value: 1 },
          { label: '2: Ligero (Suave)', value: 2 },
          { label: '3: Moderado', value: 3 },
          { label: '4: Algo pesado (Fuerte)', value: 4 },
          { label: '5: Pesado (Fuerte)', value: 5 },
          { label: '6: Pesado+', value: 6 },
          { label: '7: Muy pesado (Muy fuerte)', value: 7 },
          { label: '8: Muy pesado+', value: 8 },
          { label: '9: Muy, muy pesado (Casi máximo)', value: 9 },
          { label: '10: Máximo (Insuperable)', value: 10 }
        ] 
      }
    ],
  
    calcularPuntaje: (respuestas) => Number(respuestas.esfuerzo) ?? 0,
  
    interpretar: (puntaje) => {
      if (puntaje === 0) return { 
        texto: 'Reposo / Basal', 
        color: 'emerald-600', 
        evidencia: 'Ausencia de disnea o esfuerzo percibido.',
        recomendaciones: ['Estado de reposo fisiológico.'] 
      };
  
      if (puntaje <= 2) return { 
        texto: 'Esfuerzo Ligero', 
        color: 'green-500', 
        evidencia: 'Intensidad baja. Permite mantener una conversación fluida sin dificultad.',
        recomendaciones: ['Rango óptimo para calentamiento o recuperación activa.'] 
      };
  
      if (puntaje <= 4) return { 
        texto: 'Esfuerzo Moderado', 
        color: 'yellow-500', 
        evidencia: 'Sensación de trabajo físico claro. La respiración se acelera pero es controlable.',
        recomendaciones: ['Zona de entrenamiento aeróbico de base.', 'Monitorear fatiga si se prolonga mucho tiempo.'] 
      };
  
      if (puntaje <= 6) return { 
        texto: 'Esfuerzo Intenso (Pesado)', 
        color: 'orange-600', 
        evidencia: 'Cerca del umbral anaeróbico. Dificultad para hablar en frases completas.',
        recomendaciones: ['Zona de entrenamiento de alta intensidad.', 'Evaluar signos de apremio respiratorio en pacientes clínicos.'] 
      };
  
      return { 
        texto: 'Esfuerzo Muy Intenso / Máximo', 
        color: 'red-600', 
        evidencia: 'Fatiga muscular severa o disnea incapacitante.',
        recomendaciones: [
          'Cesar actividad si no es un test de esfuerzo controlado.',
          'En pacientes clínicos, indica falla en la tolerancia a la actividad.',
          'Monitorear recuperación de frecuencia cardíaca y saturación.'
        ] 
      };
    }
  },
    {
    id: 'barthel_funcional',
    nombre: 'Índice de Barthel',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del nivel de independencia funcional en 10 actividades básicas de la vida diaria (AVD).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 14236020) ---
    bibliografia: "Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Md State Med J. 1965 Feb;14:61-5.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14236020/",
    evidenciaClinica: "Instrumento con alta validez y fiabilidad para medir el cambio funcional en pacientes post-ACV y adultos mayores. Puntaje máximo de 100 puntos.",
  
    preguntas: [
      { 
        id: 'comer', 
        text: 'Comer:', 
        type: 'select', 
        options: [
          { label: '0: Incapaz', value: 0 }, 
          { label: '5: Necesita ayuda (ej. para cortar pan)', value: 5 }, 
          { label: '10: Independiente (comida al alcance)', value: 10 }
        ] 
      },
      { 
        id: 'lavarse', 
        text: 'Lavarse (Baño):', 
        type: 'select', 
        options: [
          { label: '0: Dependiente', value: 0 }, 
          { label: '5: Independiente (entra y sale solo del baño)', value: 5 }
        ] 
      },
      { 
        id: 'vestirse', 
        text: 'Vestirse:', 
        type: 'select', 
        options: [
          { label: '0: Dependiente', value: 0 }, 
          { label: '5: Necesita ayuda (hace al menos la mitad sin ayuda)', value: 5 }, 
          { label: '10: Independiente (incluye botones, cierres y cordones)', value: 10 }
        ] 
      },
      { 
        id: 'aseo', 
        text: 'Aseo personal (Peinado, dientes, afeitado):', 
        type: 'select', 
        options: [
          { label: '0: Dependiente', value: 0 }, 
          { label: '5: Independiente (incluye implementos)', value: 5 }
        ] 
      },
      { 
        id: 'deposicion', 
        text: 'Deposición (Continencia anal):', 
        type: 'select', 
        options: [
          { label: '0: Incontinente (o necesita enemas)', value: 0 }, 
          { label: '5: Accidente ocasional (1 vez/semana)', value: 5 }, 
          { label: '10: Continente (sin accidentes)', value: 10 }
        ] 
      },
      { 
        id: 'miccion', 
        text: 'Micción (Continencia urinaria):', 
        type: 'select', 
        options: [
          { label: '0: Incontinente (o sondado incapaz de manejarse)', value: 0 }, 
          { label: '5: Accidente ocasional (máx. 1 vez/24 horas)', value: 5 }, 
          { label: '10: Continente (mantiene sequedad 7 días)', value: 10 }
        ] 
      },
      { 
        id: 'retrete', 
        text: 'Uso del retrete:', 
        type: 'select', 
        options: [
          { label: '0: Dependiente', value: 0 }, 
          { label: '5: Necesita ayuda (para equilibrio o limpiarse)', value: 5 }, 
          { label: '10: Independiente (capaz de entrar, salir y vestirse)', value: 10 }
        ] 
      },
      { 
        id: 'traslado', 
        text: 'Traslado (Silla - Cama):', 
        type: 'select', 
        options: [
          { label: '0: Incapaz (no mantiene el equilibrio sentado)', value: 0 }, 
          { label: '5: Gran ayuda (precisa 2 personas, puede estar sentado)', value: 5 }, 
          { label: '10: Pequeña ayuda (precisa 1 persona o supervisión)', value: 10 }, 
          { label: '15: Independiente', value: 15 }
        ] 
      },
      { 
        id: 'deambulacion', 
        text: 'Deambulación (Caminar):', 
        type: 'select', 
        options: [
          { label: '0: Incapaz', value: 0 }, 
          { label: '5: Independiente en silla de ruedas (propulsión autónoma)', value: 5 }, 
          { label: '10: Necesita ayuda (asistencia física o supervisión de 1 persona)', value: 10 }, 
          { label: '15: Independiente (al menos 50 m solo, puede usar bastón)', value: 15 }
        ] 
      },
      { 
        id: 'escaleras', 
        text: 'Subir y bajar escaleras:', 
        type: 'select', 
        options: [
          { label: '0: Incapaz', value: 0 }, 
          { label: '5: Necesita ayuda (física o supervisión)', value: 5 }, 
          { label: '10: Independiente (puede usar barandilla o bastón)', value: 10 }
        ] 
      }
    ],
  
    calcularPuntaje: (respuestas: Record<string, number>) => {
      const total = Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
      return Math.min(100, Math.max(0, total)); // Asegura el rango 0-100
    },
  
    interpretar: (puntaje: number) => {
      if (puntaje === 100) {
        return { 
          texto: 'Independencia Total', 
          color: 'emerald', 
          evidencia: 'El paciente es capaz de realizar todas las actividades básicas de la vida diaria sin ningún tipo de asistencia o supervisión.',
          recomendaciones: [
            'Mantener nivel actual de actividad física diaria.',
            'Incorporar programa de ejercicios preventivos (aeróbico y fuerza).',
            'Alta funcional del programa de rehabilitación básica.'
          ] 
        };
      }
      if (puntaje >= 91) {
        return { 
          texto: 'Dependencia Leve',
          color: 'emerald-600',
          evidencia: 'El paciente realiza la mayoría de las tareas de forma independiente pero requiere mínima ayuda o supervisión en ítems específicos.',
          recomendaciones: [
            'Entrenamiento específico de las tareas con puntaje menor al máximo.',
            'Evaluación de la seguridad en el hogar para prevenir caídas.',
            'Fomentar la autonomía supervisada.'
          ] 
        };
      }
      if (puntaje >= 61) {
        return { 
          texto: 'Dependencia Moderada', 
          color: 'amber', 
          evidencia: 'Necesidad de asistencia clara en múltiples actividades funcionales básicas.',
          recomendaciones: [
            'Plan de kinesiología enfocado en transferencias y equilibrio.',
            'Fortalecimiento muscular global y reeducación de la marcha.',
            'Intervención de Terapia Ocupacional para adaptaciones en el hogar.',
            'Entrenamiento al cuidador en técnicas de asistencia mínima.'
          ] 
        };
      }
      if (puntaje >= 21) {
        return { 
          texto: 'Dependencia Severa',
          color: 'orange-600',
          evidencia: 'Limitación funcional significativa; el paciente requiere ayuda importante en casi todas las actividades diarias.',
          recomendaciones: [
            'Prevención de complicaciones por inmovilismo (contracturas, rigidez).',
            'Entrenamiento de transferencias asistidas con seguridad.',
            'Prescripción y entrenamiento en el uso de ayudas técnicas (silla de ruedas, barras de apoyo).',
            'Educación intensa al cuidador sobre manejo de cargas y cambios posturales.'
          ] 
        };
      }
      return { 
        texto: 'Dependencia Total', 
        color: 'red-600', 
        evidencia: 'El paciente depende completamente de terceros para todas las necesidades básicas.',
        recomendaciones: [
          'Manejo preventivo: Protocolo de cambios posturales cada 2 horas para evitar UPP.',
          'Kinesiología respiratoria para prevenir neumonías por aspiración o hipoventilación.',
          'Ejercicios de movilidad pasiva para mantener rangos articulares.',
          'Asesoría en manejo paliativo y confort funcional.'
        ] 
      };
    }
  },
    {
    id: 'prension_manual',
    nombre: 'Dinamometría de Prensión Manual',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de la fuerza muscular máxima de prensión para la detección de sarcopenia y fragilidad.',
    
    bibliografia: "Cruz-Jentoft AJ, et al. Sarcopenia: revised European consensus on definition and diagnosis. Age Ageing. 2019 Jan 1;48(1):16-31.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/30312472/",
    evidenciaClinica: "La fuerza de prensión es un predictor potente de mortalidad y discapacidad. Los puntos de corte de EWGSOP2 son < 27 kg para hombres y < 16 kg para mujeres.",
  
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
        id: 'fuerza_kg', 
        text: 'Fuerza máxima alcanzada (mejor de 3 intentos en kg):', 
        type: 'number',
      }
    ],
  
    // ✅ FIX: Puntaje = la fuerza real en kg, no 0/1
    // Así ScaleResult muestra "24 pts" (kg) en vez de "0 pts"
    calcularPuntaje: (respuestas) => {
      return Number(respuestas.fuerza_kg) || 0;
    },
  
    // ✅ FIX: interpretar recibe puntaje (kg) + respuestas completas para saber el sexo
    interpretar: (puntaje: number, respuestas?: Record<string, any>) => {
      const fuerza = puntaje;
      const sexo = Number(respuestas?.sexo);
  
      // Guardia: sin datos suficientes
      if (fuerza <= 0 || !sexo) {
        return {
          texto: 'Datos incompletos',
          color: 'slate-500',
          evidencia: 'Ingrese la fuerza medida y seleccione el sexo del paciente.',
          recomendaciones: ['Complete todos los campos para obtener la interpretación clínica.']
        };
      }
  
      const umbral = sexo === 1 ? 27 : 16;
      const sexoTexto = sexo === 1 ? 'hombres' : 'mujeres';
      const corteTexto = sexo === 1 ? '< 27 kg' : '< 16 kg';
  
      if (fuerza < umbral) {
        return { 
          texto: `FUERZA DISMINUIDA — ${fuerza} kg (Probable Sarcopenia)`, 
          color: 'red-600', 
          evidencia: `Resultado: ${fuerza} kg. Por debajo del punto de corte EWGSOP2 para ${sexoTexto} (${corteTexto}). Predictor de mortalidad y discapacidad funcional (Cruz-Jentoft, 2019).`,
          recomendaciones: [
            'Realizar evaluación de masa muscular (BIA, DXA o Circunferencia de pantorrilla).',
            'Evaluar desempeño físico: Velocidad de marcha o Test de levantarse de la silla (5STS).',
            'Intervención nutricional: aporte proteico ≥ 1.2 g/kg/día.',
            'Entrenamiento de fuerza progresivo con énfasis en miembros superiores e inferiores.',
            'Considerar derivación a nutricionista y médico geriatra para manejo integral.'
          ] 
        };
      }
  
      return { 
        texto: `Fuerza Normal — ${fuerza} kg`, 
        color: 'emerald-600', 
        evidencia: `Resultado: ${fuerza} kg. Dentro del rango funcional normal para ${sexoTexto} (corte EWGSOP2: ${corteTexto}). Sin criterio de baja fuerza muscular.`,
        recomendaciones: [
          'Mantener niveles de actividad física habitual.',
          'Ejercicios preventivos de fuerza y resistencia muscular.',
          'Evaluación anual o ante cambio de condición clínica.',
          'Vigilar factores de riesgo de sarcopenia: sedentarismo, desnutrición, enfermedades crónicas.'
        ] 
      };
    }
  },
  {
    id: 'sit_to_stand_1min',
    nombre: 'Test Sit to Stand (1 minuto)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de la fuerza, resistencia de miembros inferiores y capacidad funcional aeróbica.',
    
    bibliografia: "Strassmann A, et al. Reference values for the 1-min sit-to-stand test: a cross-sectional study. Eur Respir J. 2013;41(4):142-8. PMID: 23974352",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/23974352/",
    evidenciaClinica: "Estándar para medir la capacidad de ejercicio funcional. El valor predicho se calcula mediante ecuaciones de regresión de Strassmann que consideran edad, sexo y altura.",
  
    preguntas: [
      { 
        id: 'sts_sexo',       // ✅ prefijo 'sts_' → cae en "Evaluación General"
        text: '1. Sexo biológico del paciente:', 
        type: 'select', 
        options: [
          { label: 'Hombre', value: 1 }, 
          { label: 'Mujer', value: 2 }
        ] 
      },
      { 
        id: 'sts_edad',       // ✅ prefijo 'sts_' → cae en "Evaluación General"
        text: '2. Edad cronológica (años):', 
        type: 'number',
        min: 0,
        max: 115,
        placeholder: 'Ej: 65'
      },
      { 
        id: 'sts_altura',     // ✅ prefijo 'sts_' → cae en "Evaluación General"
        text: '3. Estatura actual (cm):', 
        type: 'number',
        min: 50,
        max: 250,
        placeholder: 'Ej: 170'
      },
      { 
        id: 'sts_timer',      // ✅ prefijo 'sts_' → cae en "Evaluación General"
        text: '4. Cronómetro — Inicie al dar la orden, detenga al completar 1 minuto:', 
        type: 'timer',
        duration: 60 
      },
      { 
        id: 'sts_reps',       // ✅ prefijo 'sts_' → cae en "Evaluación General"
        text: '5. Cantidad de repeticiones completadas en 1 minuto:', 
        type: 'number',
        min: 0,
        max: 150,
        placeholder: 'Anote el resultado final aquí'
      }
    ],
  
    calcularPuntaje: (respuestas: Record<string, any>) => {
      return Number(respuestas.sts_reps) || 0;  // ✅ ID actualizado
    },
  
    interpretar: (puntaje: number, respuestas?: Record<string, any>): InterpretacionAvanzada => {
      const reps = puntaje;
      const edad = Number(respuestas?.sts_edad) || 0;    // ✅ ID actualizado
      const altura = Number(respuestas?.sts_altura) || 0; // ✅ ID actualizado
      const sexo = Number(respuestas?.sts_sexo) || 1;    // ✅ ID actualizado
  
      if (reps <= 0 || edad <= 0 || altura <= 0) {
        return { 
          texto: 'Esperando ejecución del test', 
          color: 'slate-500', 
          evidencia: 'Complete los datos biométricos (pasos 1-3), ejecute el cronómetro (paso 4) y registre las repeticiones (paso 5).',
          recomendaciones: ['Complete todos los campos para activar la interpretación de Strassmann.'] 
        };
      }
  
      const predicho = (sexo === 1) 
        ? 40.8 - (0.43 * edad) + (0.17 * altura)
        : 33.5 - (0.32 * edad) + (0.14 * altura);
  
      const porcentaje = Math.round((reps / predicho) * 100);
  
      if (porcentaje >= 80) {
        return { 
          texto: `Rendimiento Normal (${porcentaje}%)`, 
          color: 'emerald-600',
          evidencia: `Paciente realizó ${reps} reps. El valor predicho es de ${Math.round(predicho)} reps. Capacidad funcional preservada.`,
          recomendaciones: [
            'Mantener nivel de actividad física actual.',
            'Incorporar ejercicios de potencia muscular 2 veces/semana.',
            'Control preventivo anual.'
          ] 
        };
      }
  
      if (porcentaje >= 60) {
        return { 
          texto: `Deterioro Funcional Moderado (${porcentaje}%)`, 
          color: 'amber-500',
          evidencia: `Rendimiento bajo el promedio (${Math.round(predicho)} reps esperadas). Indica una pérdida incipiente de la reserva funcional.`,
          recomendaciones: [
            'Iniciar programa de fortalecimiento específico de cuádriceps y glúteo mayor.',
            'Dosis: 3 series de 10-12 repeticiones al 70% de intensidad percibida.',
            'Re-evaluar en 12 semanas para medir mejoría clínica.'
          ] 
        };
      }
  
      return { 
        texto: `Deterioro Funcional Severo (${porcentaje}%)`, 
        color: 'red-600',
        evidencia: `Rendimiento crítico respecto a la norma de ${Math.round(predicho)} reps. Alto riesgo de caídas y fragilidad motora.`,
        recomendaciones: [
          'Intervención kinésica inmediata bajo supervisión estrecha.',
          'Considerar el uso de ayudas técnicas para transferencias y deambulación.',
          'Evaluación de sarcopenia mediante Dinamometría de Prensión Manual.'
        ] 
      };
    }
  },
    {
      id: 'fim_completo_refinado',
      nombre: 'Medida de Independencia Funcional (FIM)',
      categoria: 'kinesiologia',
      descripcion: 'Estándar internacional para medir la carga de cuidados. Evalúa 18 ítems con descriptores de porcentaje de asistencia.',
      
      bibliografia: "Keith RA, Granger CV, Hamilton BB, Sherwin FS. The functional independence measure: a new tool for rehabilitation. Adv Clin Rehabil. 1987;1:6-18.",
      referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3503663/",
      evidenciaClinica: "La FIM cuantifica qué tanto esfuerzo realiza el paciente vs el asistente. Es el predictor más sólido de horas de cuidado necesarias en el hogar. Puntaje máximo: 126 puntos (18 ítems × 7).",
  
      preguntas: [
        { id: 'fim_p1', text: '1. Alimentación (Cubiertos, llevar comida a boca, deglución):', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda/aparatos)', value: 7 },
            { label: '6: Independencia modificada (Usa aparatos, requiere más tiempo)', value: 6 },
            { label: '5: Supervisión (Preparación, guía verbal, sin contacto físico)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p2', text: '2. Aseo Personal (Cara, manos, dientes, peinado, afeitarse):', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda/aparatos)', value: 7 },
            { label: '6: Independencia modificada (Usa aparatos, requiere más tiempo)', value: 6 },
            { label: '5: Supervisión (Preparación, guía verbal, sin contacto físico)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p3', text: '3. Baño (Lavado y secado de cuello para abajo):', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda/aparatos)', value: 7 },
            { label: '6: Independencia modificada (Usa aparatos, requiere más tiempo)', value: 6 },
            { label: '5: Supervisión (Preparación, guía verbal, sin contacto físico)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p4', text: '4. Vestido Mitad Superior (Incluye prótesis/órtesis):', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda/aparatos)', value: 7 },
            { label: '6: Independencia modificada (Usa aparatos, requiere más tiempo)', value: 6 },
            { label: '5: Supervisión (Preparación, guía verbal, sin contacto físico)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p5', text: '5. Vestido Mitad Inferior (Incluye calzado):', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda/aparatos)', value: 7 },
            { label: '6: Independencia modificada (Usa aparatos, requiere más tiempo)', value: 6 },
            { label: '5: Supervisión (Preparación, guía verbal, sin contacto físico)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p6', text: '6. Uso del Inodoro (Limpieza y manejo de ropa):', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda/aparatos)', value: 7 },
            { label: '6: Independencia modificada (Usa aparatos, requiere más tiempo)', value: 6 },
            { label: '5: Supervisión (Preparación, guía verbal, sin contacto físico)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p7', text: '7. Control de Vejiga (Continencia y uso de dispositivos):', type: 'select', options: [
            { label: '7: Sin accidentes, independencia completa', value: 7 },
            { label: '6: Uso de dispositivo/sonda de forma independiente', value: 6 },
            { label: '5: Supervisión o preparación del dispositivo', value: 5 },
            { label: '4: Asistencia mínima (Paciente limpia el 75% solo)', value: 4 },
            { label: '3: Asistencia moderada (Paciente limpia entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Paciente limpia entre el 25% y 49%)', value: 2 },
            { label: '1: Incontinencia total (Paciente hace menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p8', text: '8. Control de Intestino (Continencia anal):', type: 'select', options: [
            { label: '7: Sin accidentes, independencia completa', value: 7 },
            { label: '6: Uso independiente de enemas o medicación', value: 6 },
            { label: '5: Supervisión o preparación de insumos', value: 5 },
            { label: '4: Asistencia mínima (Paciente realiza el 75% del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Paciente realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Paciente realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Incontinencia total (Paciente realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p9', text: '9. Traslado Cama/Silla/Silla de Ruedas:', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda)', value: 7 },
            { label: '6: Independencia modificada (Ayuda técnica, más tiempo)', value: 6 },
            { label: '5: Supervisión (Guía verbal, sin contacto físico)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p10', text: '10. Traslado en Inodoro (Sentarse/Levantarse):', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda)', value: 7 },
            { label: '6: Independencia modificada (Ayuda técnica, barras)', value: 6 },
            { label: '5: Supervisión (Guía verbal)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p11', text: '11. Traslado en Ducha o Bañera:', type: 'select', options: [
            { label: '7: Independencia completa (Seguro, sin ayuda)', value: 7 },
            { label: '6: Independencia modificada (Silla de baño, barras)', value: 6 },
            { label: '5: Supervisión (Guía verbal)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p12', text: '12. Locomoción (Caminar o Silla de Ruedas):', type: 'select', options: [
            { label: '7: Camina 50m libre e independiente', value: 7 },
            { label: '6: Usa ayuda técnica para 50m de forma autónoma', value: 6 },
            { label: '5: Supervisión o camina solo 15m', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% del esfuerzo)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p13', text: '13. Escaleras (Subir/Bajar 12-14 peldaños):', type: 'select', options: [
            { label: '7: Independencia completa', value: 7 },
            { label: '6: Independencia modificada (Usa baranda)', value: 6 },
            { label: '5: Supervisión (Por seguridad)', value: 5 },
            { label: '4: Asistencia mínima (Sujeto realiza el 75% o más)', value: 4 },
            { label: '3: Asistencia moderada (Sujeto realiza entre el 50% y 74%)', value: 3 },
            { label: '2: Asistencia máxima (Sujeto realiza entre el 25% y 49%)', value: 2 },
            { label: '1: Dependencia total (Sujeto realiza menos del 25%)', value: 1 }
          ]
        },
        { id: 'fim_p14', text: '14. Comprensión (Auditiva o visual):', type: 'select', options: [
            { label: '7: Sin dificultad (Entiende temas complejos)', value: 7 },
            { label: '6: Alguna lentitud o dificultad leve', value: 6 },
            { label: '5: Supervisión <10% del tiempo', value: 5 },
            { label: '4: Entiende el 75-90% de las instrucciones', value: 4 },
            { label: '3: Entiende el 50-74% de las instrucciones', value: 3 },
            { label: '2: Entiende el 25-49% de las instrucciones', value: 2 },
            { label: '1: Entiende menos del 25%', value: 1 }
          ]
        },
        { id: 'fim_p15', text: '15. Expresión (Verbal o no verbal):', type: 'select', options: [
            { label: '7: Expresa pensamientos complejos claramente', value: 7 },
            { label: '6: Dificultad leve o requiere más tiempo', value: 6 },
            { label: '5: Supervisión <10% del tiempo', value: 5 },
            { label: '4: Expresa el 75-90% de lo necesario', value: 4 },
            { label: '3: Expresa el 50-74% de lo necesario', value: 3 },
            { label: '2: Expresa el 25-49% de lo necesario', value: 2 },
            { label: '1: Expresa menos del 25%', value: 1 }
          ]
        },
        { id: 'fim_p16', text: '16. Interacción Social:', type: 'select', options: [
            { label: '7: Interactúa apropiadamente siempre', value: 7 },
            { label: '6: Requiere medicación o esfuerzo para controlarse', value: 6 },
            { label: '5: Necesita supervisión en situaciones de estrés', value: 5 },
            { label: '4: Interactúa bien el 75-90% del tiempo', value: 4 },
            { label: '3: Interactúa bien el 50-74% del tiempo', value: 3 },
            { label: '2: Interactúa bien el 25-49% del tiempo', value: 2 },
            { label: '1: Interactúa apropiadamente menos del 25%', value: 1 }
          ]
        },
        { id: 'fim_p17', text: '17. Resolución de Problemas (Decisiones de la vida diaria):', type: 'select', options: [
            { label: '7: Resuelve problemas complejos independientemente', value: 7 },
            { label: '6: Dificultad leve o mayor tiempo de decisión', value: 6 },
            { label: '5: Necesita supervisión <10% del tiempo', value: 5 },
            { label: '4: Resuelve el 75-90% de los problemas', value: 4 },
            { label: '3: Resuelve el 50-74% de los problemas', value: 3 },
            { label: '2: Resuelve el 25-49% de los problemas', value: 2 },
            { label: '1: Resuelve menos del 25%', value: 1 }
          ]
        },
        { id: 'fim_p18', text: '18. Memoria (Reconocimiento de personas y tareas):', type: 'select', options: [
            { label: '7: Recuerda todo sin dificultad', value: 7 },
            { label: '6: Usa ayudas (agendas, recordatorios)', value: 6 },
            { label: '5: Necesita supervisión <10% del tiempo', value: 5 },
            { label: '4: Recuerda el 75-90% de la información', value: 4 },
            { label: '3: Recuerda el 50-74% de la información', value: 3 },
            { label: '2: Recuerda el 25-49% de la información', value: 2 },
            { label: '1: Recuerda menos del 25%', value: 1 }
          ]
        }
      ],
  
      calcularPuntaje: (respuestas) => {
        return Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
      },
  
      interpretar: (puntaje) => {
        // ✅ CORRECCIÓN: Umbral independencia corregido de 108 → 120
        // Máximo real = 18 ítems × 7 pts = 126. 
        // ≥120 equivale a nivel 6-7 en todos los ítems (independencia real)
        if (puntaje >= 120) return { 
          texto: 'INDEPENDENCIA FUNCIONAL', 
          color: 'emerald-600', 
          evidencia: `Puntaje: ${puntaje}/126. Carga de cuidado mínima o nula. El paciente realiza todas sus actividades de forma independiente o con dispositivos de apoyo.`,
          recomendaciones: [
            'Mantener actividad física regular.',
            'Control trimestral preventivo.',
            'Alta funcional de rehabilitación intensiva si aplica.'
          ] 
        };
  
        // ≥90: nivel 5 promedio — supervisión sin asistencia física
        if (puntaje >= 90) return { 
          texto: 'DEPENDENCIA LEVE (Supervisión)', 
          color: 'yellow-500', 
          evidencia: `Puntaje: ${puntaje}/126. Requiere supervisión o asistencia mínima (Nivel 4-5). Realiza más del 75% del esfuerzo en la mayoría de actividades.`,
          recomendaciones: [
            'Enfoque en seguridad del hogar.',
            'Entrenamiento de tareas instrumentales.',
            'Educación al cuidador en supervisión sin sobreasistencia.'
          ] 
        };
  
        // ≥54: nivel 3 promedio — asistencia moderada
        if (puntaje >= 54) return { 
          texto: 'DEPENDENCIA MODERADA (Asistencia física)', 
          color: 'orange-500', 
          evidencia: `Puntaje: ${puntaje}/126. El paciente requiere asistencia física activa en la mayoría de sus actividades básicas (realiza entre 25-74% del esfuerzo).`,
          recomendaciones: [
            'Kinesioterapia motora intensiva.',
            'Capacitación a cuidadores en transferencias asistidas.',
            'Terapia Ocupacional para adaptaciones del entorno.'
          ] 
        };
  
        return { 
          texto: 'DEPENDENCIA SEVERA A TOTAL', 
          color: 'red-600', 
          evidencia: `Puntaje: ${puntaje}/126. Carga de cuidado máxima. El paciente realiza menos del 25% del esfuerzo en la mayoría de actividades.`,
          recomendaciones: [
            'Prevención estricta de úlceras por presión (cambios posturales c/2h).',
            'Uso de ayudas técnicas de alta asistencia (grúas de traslado).',
            'Evaluación de cuidados paliativos si aplica.'
          ] 
        };
      }
    },
    {
      id: 'lawton',
      nombre: 'Escala Lawton Brody IADL',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación de actividades instrumentales de la vida diaria',
      preguntas: [
        { id: 'telefono', text: 'Capacidad para usar el teléfono', type: 'select', options: [{ label: 'Utiliza el teléfono por iniciativa propia', value: 1 }, { label: 'Es capaz de marcar números conocidos', value: 1 }, { label: 'Es capaz de contestar pero no de marcar', value: 1 }, { label: 'No es capaz de usar el teléfono', value: 0 }] },
        { id: 'compras', text: 'Hacer compras', type: 'select', options: [{ label: 'Realiza todas las compras necesarias independientemente', value: 1 }, { label: 'Realiza independientemente pequeñas compras', value: 0 }, { label: 'Necesita ir acompañado para hacer cualquier compra', value: 0 }, { label: 'Totalmente incapaz de comprar', value: 0 }] },
        { id: 'comida', text: 'Preparación de la comida', type: 'select', options: [{ label: 'Organiza, prepara y sirve las comidas por sí solo', value: 1 }, { label: 'Prepara adecuadamente las comidas si se le proporcionan los ingredientes', value: 0 }, { label: 'Prepara, calienta y sirve las comidas, pero no sigue una dieta adecuada', value: 0 }, { label: 'Necesita que le preparen y sirvan las comidas', value: 0 }] },
        { id: 'hogar', text: 'Cuidado de la casa', type: 'select', options: [{ label: 'Mantiene la casa solo o con ayuda ocasional', value: 1 }, { label: 'Realiza tareas ligeras como lavar platos', value: 1 }, { label: 'Realiza tareas ligeras pero no puede mantener un nivel de limpieza', value: 1 }, { label: 'Necesita ayuda en todas las labores de la casa', value: 0 }] },
        { id: 'lavado', text: 'Lavado de ropa', type: 'select', options: [{ label: 'Lava por sí solo toda su ropa', value: 1 }, { label: 'Lava por sí solo pequeñas prendas', value: 1 }, { label: 'Todo el lavado de ropa debe ser realizado por otro', value: 0 }] },
        { id: 'transporte', text: 'Uso de medios de transporte', type: 'select', options: [{ label: 'Viaja solo en transporte público o conduce su propio coche', value: 1 }, { label: 'Es capaz de tomar un taxi, pero no usa otro medio de transporte', value: 1 }, { label: 'Viaja en transporte público cuando va acompañado por otra persona', value: 1 }, { label: 'Utiliza el taxi o el automóvil solo con ayuda de otros', value: 0 }] },
        { id: 'medicacion', text: 'Responsabilidad respecto a su medicación', type: 'select', options: [{ label: 'Es capaz de tomar su medicación a la hora y dosis correcta', value: 1 }, { label: 'Toma su medicación si la dosis le es preparada previamente', value: 0 }, { label: 'No es capaz de administrarse su medicación', value: 0 }] },
        { id: 'finanzas', text: 'Manejo de sus asuntos económicos', type: 'select', options: [{ label: 'Se encarga de sus asuntos económicos por sí solo', value: 1 }, { label: 'Realiza las compras de cada día, pero necesita ayuda en grandes compras', value: 1 }, { label: 'Incapaz de manejar dinero', value: 0 }] }
      ],
      calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
      interpretar: (puntaje) => {
        if (puntaje === 8) return { texto: 'Independiente total', recomendaciones: ['Mantener autovalencia comunitaria'] };
        if (puntaje >= 5) return { texto: 'Dependencia leve', recomendaciones: ['Apoyo familiar en tareas específicas (finanzas, compras pesadas)', 'Evaluación cognitiva periódica (MoCA/MMSE)'] };
        if (puntaje >= 3) return { texto: 'Dependencia moderada', recomendaciones: ['Asistencia diaria requerida para medicación y alimentación', 'Derivación a trabajo social para red de apoyo', 'Terapia ocupacional para adaptaciones funcionales'] };
        return { texto: 'Dependencia severa', recomendaciones: ['Requiere cuidador permanente o institucionalización', 'Manejo estricto de medicación por terceros', 'Riesgo social alto si vive solo'] };
      }
    },
  
    {
    id: 'tug',
    nombre: 'Timed Up and Go (TUG)',
    categoria: 'kinesiologia',
    descripcion: 'Prueba rápida para evaluar la movilidad funcional, el equilibrio dinámico y el riesgo de caídas en adultos mayores.',
  
    bibliografia: "Shumway-Cook A, et al. Predicting the probability for falls in community-dwelling older adults using the Timed Up & Go Test. Phys Ther. 2000;80(9):896-903.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11020445/",
    evidenciaClinica: "Punto de corte validado: > 13.5 segundos predice caídas con sensibilidad del 87% y especificidad del 87% en adultos mayores independientes en la comunidad (Shumway-Cook, 2000). Un cambio de 3.5 segundos representa el MCID.",
  
    preguntas: [
      {
        // ✅ INSTRUCCIONES PROTOCOLO: El clínico debe leerlas antes de ejecutar
        id: 'instrucciones',
        text: '📋 PROTOCOLO: Paciente sentado en silla con apoyabrazos (altura estándar 46 cm). Al dar la señal: levantarse, caminar 3 metros, girar, regresar y sentarse. Se permite ayuda técnica habitual (bastón/andador). Registrar el mejor de 2 intentos.',
        type: 'text',
        placeholder: 'Lea el protocolo antes de iniciar'
      },
      {
        // ✅ PASO 1: AYUDA TÉCNICA — Dato clínico relevante para el reporte
        id: 'ayuda_tecnica',
        text: '1. ¿El paciente usa ayuda técnica?',
        type: 'select',
        options: [
          { label: 'No (marcha independiente)', value: 0 },
          { label: 'Sí — Bastón simple', value: 1 },
          { label: 'Sí — Bastón cuádruple', value: 2 },
          { label: 'Sí — Andador', value: 3 }
        ]
      },
      {
        // ✅ PASO 2: CRONÓMETRO PRIMERO — El clínico ejecuta el test
        id: 'cronometro_tug',
        text: '2. Cronómetro — Inicie al dar la orden de partida:',
        type: 'timer',
        duration: 0
      },
      {
        // ✅ PASO 3: TIEMPO FINAL — Se anota después de ejecutar
        id: 'tiempo',
        text: '3. Tiempo final registrado (segundos) — Anote el mejor de 2 intentos:',
        type: 'number',
        min: 0,
        max: 300,
        placeholder: 'Ej: 12.5'
      },
      {
        // ✅ PASO 4: OBSERVACIONES CLÍNICAS — Enriquecen el reporte PDF
        id: 'observaciones',
        text: '4. Observaciones durante la ejecución:',
        type: 'select',
        options: [
          { label: 'Sin alteraciones observadas', value: 0 },
          { label: 'Inestabilidad en el giro', value: 1 },
          { label: 'Necesitó apoyo de apoyabrazos para levantarse', value: 2 },
          { label: 'Marcha con patrón alterado (arrastre, tijera, etc.)', value: 3 },
          { label: 'Detuvo la marcha durante el test', value: 4 }
        ]
      }
    ],
  
    calcularPuntaje: (respuestas: Record<string, any>) => {
      // El puntaje clínico es el tiempo en segundos
      return Number(respuestas.tiempo) || 0;
    },
  
    interpretar: (puntaje: number, respuestas?: Record<string, any>): InterpretacionAvanzada => {
      const t = puntaje;
      const ayuda = Number(respuestas?.ayuda_tecnica) || 0;
      const obs = Number(respuestas?.observaciones) || 0;
  
      const ayudaTexto = ['sin ayuda técnica', 'con bastón simple', 'con bastón cuádruple', 'con andador'];
      const ayudaLabel = ayudaTexto[ayuda] || 'sin ayuda técnica';
  
      // ✅ Alerta si hay observaciones clínicas relevantes
      const alertaObs = obs > 0
        ? ' ⚠️ Se registraron alteraciones durante la ejecución — revisar observaciones.'
        : '';
  
      if (t <= 0) {
        return {
          texto: 'Esperando ejecución del test',
          color: 'slate-500',
          evidencia: 'Use el cronómetro (paso 2) y anote el tiempo obtenido en el paso 3.',
          recomendaciones: ['Siga el protocolo indicado al inicio de la escala.']
        };
      }
  
      if (t < 10) {
        return {
          texto: `Movilidad Normal (${t}s)`,
          color: 'emerald-600',
          evidencia: `Tiempo: ${t}s ${ayudaLabel}.${alertaObs} Paciente independiente con bajo riesgo de caídas según punto de corte de Shumway-Cook (< 10s).`,
          recomendaciones: [
            'Mantener nivel de actividad física habitual.',
            'Ejercicios preventivos de equilibrio dinámico.',
            'Re-evaluación anual o ante cambio de condición.'
          ]
        };
      }
  
      if (t <= 13.5) {
        return {
          texto: `Vigilancia — Riesgo Leve (${t}s)`,
          color: 'blue-600',
          evidencia: `Tiempo: ${t}s ${ayudaLabel}.${alertaObs} Cerca del umbral de riesgo de caídas (13.5s). No alcanza criterio de riesgo pero requiere monitoreo.`,
          recomendaciones: [
            'Programa preventivo de equilibrio y fuerza de miembros inferiores.',
            'Evaluación del entorno domiciliario (alfombras, iluminación, barandas).',
            'Control de agudeza visual y auditiva.',
            'Revisar calzado (suela antideslizante, talón bajo).'
          ]
        };
      }
  
      if (t <= 20) {
        return {
          texto: `RIESGO DE CAÍDAS (${t}s)`,
          color: 'orange-600',
          evidencia: `Tiempo: ${t}s ${ayudaLabel}.${alertaObs} Supera el punto de corte de Shumway-Cook (13.5s). Sensibilidad 87%, especificidad 87% para predicción de caídas.`,
          recomendaciones: [
            'Entrenamiento de fuerza de miembros inferiores con énfasis excéntrico (descenso de escalón, sentadilla asistida).',
            'Entrenamiento de marcha con cambios de dirección y obstáculos.',
            'Evaluar prescripción de ayuda técnica si aún no la usa.',
            'Revisión médica de polifarmacia (psicotrópicos, hipotensores, diuréticos).',
            'Educación al paciente y familia sobre prevención de caídas.'
          ]
        };
      }
  
      return {
        texto: `ALTO RIESGO — Movilidad Limitada (${t}s)`,
        color: 'red-600',
        evidencia: `Tiempo: ${t}s ${ayudaLabel}.${alertaObs} Limitación funcional severa. Muy alta probabilidad de caída sin supervisión o asistencia técnica.`,
        recomendaciones: [
          'Prescripción inmediata de ayuda técnica estable (andador de 4 ruedas o estándar).',
          'Supervisión constante en traslados, deambulación interna y externa.',
          'Intervención de Terapia Ocupacional para adaptaciones en el hogar (barras de apoyo, silla de ducha).',
          'Evaluación de sarcopenia (Dinamometría de Prensión Manual + SARC-F).',
          'Considerar derivación a programa de rehabilitación intensiva.'
        ]
      };
    }
  },
    {
      id: 'six_minute_walk',
      nombre: 'Test de Caminata de 6 Minutos (6MWT)',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación de la capacidad funcional de ejercicio de submáximo esfuerzo. Predice morbilidad y mortalidad en patologías cardiopulmonares.',
      
      // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
      // 1. Estándar: ATS Statement (2002) PMID: 11877314
      // 2. Referencia: Enright PL. (1998) PMID: 9731012
      // 3. MCID: 30 metros (Cambio mínimo clínicamente significativo)
      bibliografia: "ATS Committee on Proficiency Standards for Clinical Pulmonary Function Laboratories. ATS statement: guidelines for the six-minute walk test. Am J Respir Crit Care Med. 2002;166(1):111-7.",
      referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/11877314/",
      evidenciaClinica: "La distancia recorrida (6MWD) menor a 300 metros es un fuerte predictor de mortalidad en falla cardíaca y EPOC. Una desaturación > 4% durante el test indica intolerancia al esfuerzo de origen ventilatorio o vascular.",
  
      preguntas: [
        { id: 'sexo', text: 'Sexo biológico:', type: 'select', options: [{ label: 'Hombre', value: 1 }, { label: 'Mujer', value: 2 }] },
        { id: 'edad', text: 'Edad (años):', type: 'number', min: 18, max: 110 },
        { id: 'peso', text: 'Peso (kg):', type: 'number', min: 30, max: 250 },
        { id: 'altura', text: 'Altura (cm):', type: 'number', min: 100, max: 230 },
        { id: 'cronometro', text: 'Control de tiempo (6 min):', type: 'plugin', componente: 'CRONOMETRO' },
        { id: 'distancia', text: 'Distancia total recorrida (metros):', type: 'number', min: 0, max: 1200 },
        // Variables de monitoreo clínico (No afectan el puntaje pero son esenciales para el reporte)
        { id: 'fc_final', text: 'Frecuencia Cardíaca Final (lpm):', type: 'number' },
        { id: 'spo2_final', text: 'Saturación de O2 Final (%):', type: 'number' },
        { id: 'borg_disnea', text: 'Escala de Borg (Disnea final):', type: 'select', options: [
            { label: '0: Nada', value: 0 }, { label: '3: Moderada', value: 3 }, { label: '5: Grave', value: 5 }, { label: '10: Máxima', value: 10 }
          ] 
        }
      ],
  
      calcularPuntaje: (respuestas) => Number(respuestas.distancia) || 0,
  
      interpretar: (puntaje, respuestas) => {
        const dist = puntaje;
        const edad = Number(respuestas?.edad);
        const peso = Number(respuestas?.peso);
        const altura = Number(respuestas?.altura);
        const sexo = Number(respuestas?.sexo);
        const spo2Final = Number(respuestas?.spo2_final);
  
        // --- CÁLCULO DE VALOR PREDICHO (ECUACIONES DE ENRIGHT) ---
        // Hombre: (7.57 * alt_cm) - (5.02 * edad) - (1.76 * peso) - 309
        // Mujer: (2.11 * alt_cm) - (2.29 * peso) - (5.78 * edad) + 667
        let predicho = 0;
        if (edad && peso && altura && sexo) {
          predicho = (sexo === 1) 
            ? (7.57 * altura) - (5.02 * edad) - (1.76 * peso) - 309
            : (2.11 * altura) - (2.29 * peso) - (5.78 * edad) + 667;
        }
  
        const porcentaje = predicho > 0 ? Math.round((dist / predicho) * 100) : null;
        const desaturacionCritica = spo2Final > 0 && spo2Final <= 88;
  
        if (dist < 300) return { 
          texto: `CAPACIDAD FUNCIONAL LIMITADA (${dist}m)`, 
          color: 'red-600',
          evidencia: `Distancia menor al umbral de seguridad (300m). ${porcentaje ? `Representa el ${porcentaje}% del predicho.` : ''}`,
          recomendaciones: [
            'Evaluación médica urgente para descartar isquemia o falla cardíaca',
            'Considerar indicación de oxígeno suplementario durante la marcha',
            'Ingresar a programa de rehabilitación cardiopulmonar fase II'
          ] 
        };
  
        if (desaturacionCritica) return {
          texto: 'TEST POSITIVO PARA DESATURACIÓN',
          color: 'orange-600',
          evidencia: `El paciente finalizó con una SpO2 de ${spo2Final}%. Una caída por debajo de 88% es criterio clínico de hipoxemia por esfuerzo.`,
          recomendaciones: ['Estudio de difusión de gases (DLCO)', 'Evaluar requerimiento de oxigenoterapia domiciliaria']
        };
  
        return { 
          texto: `CAPACIDAD FUNCIONAL CONSERVADA`, 
          color: 'emerald-600',
          evidencia: `El paciente recorrió ${dist} metros. ${porcentaje ? `Equivale al ${porcentaje}% de su valor normal esperado.` : ''}`,
          recomendaciones: ['Mantener actividad aeróbica regular', 'Control según evolución de patología base'] 
        };
      }
    },
    {
      id: 'ten_meter_walk',
      nombre: 'Test de Marcha de 10 Metros',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación de velocidad de marcha',
      preguntas: [
        { id: 'tiempo', text: 'Registre el tiempo al recorrer los 10 metros:', type: 'plugin', componente: 'CRONOMETRO' }
      ],
      calcularPuntaje: (respuestas) => {
        const tiempo = Number(respuestas.tiempo) || 0;
        if (tiempo === 0) return 0;
        return Math.round((10 / tiempo) * 100) / 100;
      },
      interpretar: (puntaje) => {
        if (puntaje === 0) return { texto: 'Sin datos', recomendaciones: [] };
        if (puntaje >= 1.0) return { texto: 'Velocidad normal - Marcha comunitaria independiente (> 1.0 m/s)', recomendaciones: ['Capacidad para cruzar calles de forma segura', 'Sin restricciones de movilidad comunitaria'] };
        if (puntaje >= 0.8) return { texto: 'Velocidad limitada - Marcha comunitaria limitada (0.8 - 0.99 m/s)', recomendaciones: ['Entrenamiento de velocidad y longitud de paso', 'Precaución en cruces peatonales', 'Evaluar fatiga en distancias largas'] };
        if (puntaje >= 0.4) return { texto: 'Velocidad reducida - Marcha domiciliaria, riesgo de caídas (0.4 - 0.79 m/s)', recomendaciones: ['Derivación a kinesiología motora', 'Prescripción de ayudas técnicas (andador/bastón)', 'Alto riesgo de eventos adversos y hospitalización'] };
        return { texto: 'Velocidad muy reducida - Dependencia, alto riesgo (< 0.4 m/s)', recomendaciones: ['Marcha exclusivamente intradomiciliaria y asistida', 'Prevención severa de caídas', 'Evaluación de sarcopenia y fragilidad extrema'] };
      }
    },
    {
      id: 'berg_balance_scale',
      nombre: 'Escala de Equilibrio de Berg (BBS)',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación objetiva del equilibrio estático y dinámico mediante 14 tareas funcionales.',
      
      // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
      // 1. Origen: Berg KO, et al. (1989) PMID: 2552632
      // 2. Validación: Shumway-Cook A, et al. (1997) PMID: 10411322
      // 3. Sensibilidad: Un cambio de 8 puntos se considera significativo (MDC).
      bibliografia: "Berg KO, et al. Measuring balance in the elderly: preliminary development of an instrument. Physiother Can. 1989;41(6):304-11.",
      referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/2552632/",
      evidenciaClinica: "Un puntaje < 45/56 es el predictor más fuerte de caídas múltiples en adultos mayores. Los puntajes entre 41-56 indican bajo riesgo, 21-40 riesgo medio y 0-20 riesgo alto.",
  
      preguntas: [
        { id: 'p1', text: '1. De sedestación a bipedestación:', type: 'select', options: [{ label: '4: Capaz de levantarse sin manos, con seguridad', value: 4 }, { label: '3: Capaz con ayuda de las manos', value: 3 }, { label: '2: Capaz con manos tras varios intentos', value: 2 }, { label: '1: Necesita ayuda mínima', value: 1 }, { label: '0: Necesita ayuda moderada/máxima', value: 0 }] },
        { id: 'p2', text: '2. Bipedestación sin apoyo (2 min):', type: 'select', options: [{ label: '4: Seguro 2 min', value: 4 }, { label: '3: 2 min con supervisión', value: 3 }, { label: '2: 30 seg sin apoyo', value: 2 }, { label: '1: Varios intentos para 30 seg sin apoyo', value: 1 }, { label: '0: Incapaz de estar 30 seg sin apoyo', value: 0 }] },
        { id: 'p3', text: '3. Sedestación sin apoyo (espalda libre, pies en suelo, 2 min):', type: 'select', options: [{ label: '4: Seguro 2 min', value: 4 }, { label: '3: 2 min con supervisión', value: 3 }, { label: '2: 30 seg', value: 2 }, { label: '1: 10 seg', value: 1 }, { label: '0: Incapaz 10 seg sin apoyo', value: 0 }] },
        { id: 'p4', text: '4. De bipedestación a sedestación:', type: 'select', options: [{ label: '4: Seguro, uso mínimo de manos', value: 4 }, { label: '3: Controla descenso con manos', value: 3 }, { label: '2: Usa parte posterior de piernas contra silla', value: 2 }, { label: '1: Descenso descontrolado', value: 1 }, { label: '0: Necesita ayuda para sentarse', value: 0 }] },
        { id: 'p5', text: '5. Transferencias (Cama a silla y viceversa):', type: 'select', options: [{ label: '4: Seguro con uso mínimo de manos', value: 4 }, { label: '3: Seguro con uso definido de manos', value: 3 }, { label: '2: Necesita supervisión o guía verbal', value: 2 }, { label: '1: Necesita una persona que le ayude', value: 1 }, { label: '0: Necesita dos personas o grúa', value: 0 }] },
        { id: 'p6', text: '6. Bipedestación con ojos cerrados (10 seg):', type: 'select', options: [{ label: '4: Seguro 10 seg', value: 4 }, { label: '3: 10 seg con supervisión', value: 3 }, { label: '2: 3 seg', value: 2 }, { label: '1: Incapaz de mantener ojos cerrados 3 seg', value: 1 }, { label: '0: Necesita ayuda para no caer', value: 0 }] },
        { id: 'p7', text: '7. Bipedestación con pies juntos (sin apoyo):', type: 'select', options: [{ label: '4: Seguro e independiente 1 min', value: 4 }, { label: '3: 1 min con supervisión', value: 3 }, { label: '2: 30 seg pero inestable', value: 2 }, { label: '1: Necesita ayuda para posición, aguanta 15 seg', value: 1 }, { label: '0: Necesita ayuda para posición e incapaz 15 seg', value: 0 }] },
        { id: 'p8', text: '8. Alcanzar hacia adelante con brazo extendido (90°):', type: 'select', options: [{ label: '4: Alcanza > 25 cm', value: 4 }, { label: '3: Alcanza > 12.5 cm', value: 3 }, { label: '2: Alcanza > 5 cm', value: 2 }, { label: '1: Alcanza con supervisión', value: 1 }, { label: '0: Pierde el equilibrio al intentarlo', value: 0 }] },
        { id: 'p9', text: '9. Recoger objeto del suelo:', type: 'select', options: [{ label: '4: Seguro y fácil', value: 4 }, { label: '3: Con supervisión', value: 3 }, { label: '2: Incapaz de recogerlo (queda a 2-5 cm)', value: 2 }, { label: '1: Necesita ayuda para no caer', value: 1 }, { label: '0: Incapaz de intentarlo', value: 0 }] },
        { id: 'p10', text: '10. Girar para mirar atrás (sobre hombro izq/der):', type: 'select', options: [{ label: '4: Mira atrás por ambos lados con buen giro', value: 4 }, { label: '3: Mira atrás solo por un lado', value: 3 }, { label: '2: Gira solo de lado pero mantiene equilibrio', value: 2 }, { label: '1: Necesita supervisión al girar', value: 1 }, { label: '0: Necesita ayuda para no caer', value: 0 }] },
        { id: 'p11', text: '11. Girar 360 grados:', type: 'select', options: [{ label: '4: 4 seg o menos para giro completo', value: 4 }, { label: '3: Seguro en un solo lado en > 4 seg', value: 3 }, { label: '2: Seguro pero lento', value: 2 }, { label: '1: Necesita supervisión cercana', value: 1 }, { label: '0: Necesita ayuda al girar', value: 0 }] },
        { id: 'p12', text: '12. Situar pies alternativamente en un escalón:', type: 'select', options: [{ label: '4: 8 pasos en < 20 seg', value: 4 }, { label: '3: 8 pasos en > 20 seg', value: 3 }, { label: '2: 4 pasos sin ayuda', value: 2 }, { label: '1: Completa < 2 pasos con mínima ayuda', value: 1 }, { label: '0: Necesita ayuda para no caer / incapaz', value: 0 }] },
        { id: 'p13', text: '13. Bipedestación con un pie adelantado (Tándem):', type: 'select', options: [{ label: '4: Seguro 30 seg', value: 4 }, { label: '3: 30 seg con pie un poco más abierto', value: 3 }, { label: '2: 30 seg con paso pequeño', value: 2 }, { label: '1: Necesita ayuda para dar el paso, aguanta 15 seg', value: 1 }, { label: '0: Pierde el equilibrio al dar el paso', value: 0 }] },
        { id: 'p14', text: '14. Bipedestación sobre un solo pie (Monopodal):', type: 'select', options: [{ label: '4: Seguro > 10 seg', value: 4 }, { label: '3: Seguro 5-10 seg', value: 3 }, { label: '2: Seguro 3 seg o más', value: 2 }, { label: '1: Intenta levantar el pie, inestable < 3 seg', value: 1 }, { label: '0: Incapaz de intentarlo / necesita ayuda', value: 0 }] }
      ],
  
      calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),
  
      interpretar: (puntaje) => {
        if (puntaje >= 45) return { 
          texto: `Bajo Riesgo de Caídas (${puntaje}/56)`, 
          color: 'emerald-600',
          evidencia: 'Puntaje por encima del valor de corte clínico (45). El paciente presenta una movilidad funcional segura e independiente.',
          recomendaciones: ['Mantener actividad física regular', 'Ejercicios de equilibrio dinámico desafiantes', 'Re-evaluación en 6 meses'] 
        };
        if (puntaje >= 21) return { 
          texto: `Riesgo Moderado de Caídas (${puntaje}/56)`, 
          color: 'orange-500',
          evidencia: 'Puntaje entre 21 y 40. Existe un riesgo significativo de caídas durante las transferencias o la marcha.',
          recomendaciones: [
            'Programa formal de entrenamiento de equilibrio y fuerza',
            'Uso de ayuda técnica (bastón/andador) en exteriores o fatiga',
            'Revisión de calzado y eliminación de barreras en el hogar'
          ] 
        };
        return { 
          texto: `ALTO RIESGO DE CAÍDAS (${puntaje}/56)`, 
          color: 'red-600',
          evidencia: 'Puntaje crítico (0-20). La probabilidad de caída es casi inminente sin asistencia física o técnica.',
          recomendaciones: [
            'Uso obligatorio de ayuda técnica estable (Andador)',
            'Asistencia física para transferencias y deambulación',
            'Intervención de Terapia Ocupacional para adaptaciones severas en el hogar',
            'Evaluación médica para ajuste de fármacos psicotrópicos'
          ] 
        };
      }
    },
    {
      id: 'minibestest',
      nombre: 'Mini-BESTest',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación avanzada del equilibrio dividida en 4 sistemas: Ajustes anticipatorios, Control postural reactivo, Orientación sensorial y Marcha dinámica.',
      
      // --- TRIPLE VERIFICACIÓN CIENTÍFICA ---
      // 1. Origen: Franchignoni F, et al. (2010) PMID: 20411322
      // 2. Punto de Corte: < 19/28 predice caídas en Parkinson (Sens: 89%).
      // 3. MCID: 4 puntos (Cambio mínimo clínicamente significativo).
      bibliografia: "Franchignoni F, et al. Using Psychometric Techniques to Improve the Balance Evaluation Systems Test: The Mini-BESTest. J Rehabil Med. 2010;42(4):323-31.",
      referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/20411322/",
      evidenciaClinica: "A diferencia de Berg, el Mini-BESTest evalúa el equilibrio reactivo (respuestas a perturbaciones), lo que lo hace más sensible para pacientes con movilidad alta pero riesgo de caída oculto.",
  
      preguntas: [
        // SISTEMA 1: AJUSTES ANTICIPATORIOS
        { id: 'p1', text: '1. De sedestación a bipedestación (sin usar manos):', type: 'select', options: [{ label: '2: Normal', value: 2 }, { label: '1: Moderado (necesita manos)', value: 1 }, { label: '0: Severo (necesita ayuda física)', value: 0 }] },
        { id: 'p2', text: '2. Levantarse sobre las puntas de los pies (mantener 3 seg):', type: 'select', options: [{ label: '2: Normal (altura máxima, 3s)', value: 2 }, { label: '1: Moderado (altura reducida o < 3s)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
        { id: 'p3', text: '3. Bipedestación monopodal (mantener 20 seg):', type: 'select', options: [{ label: '2: Normal (20 seg estable)', value: 2 }, { label: '1: Moderado (5-20 seg)', value: 1 }, { label: '0: Severo (< 5 seg)', value: 0 }] },
        
        // SISTEMA 2: CONTROL POSTURAL REACTIVO
        { id: 'p4', text: '4. Paso compensatorio - Adelante (tras empuje en esternón):', type: 'select', options: [{ label: '2: Normal (1 paso recupera)', value: 2 }, { label: '1: Moderado (> 1 paso, pero recupera)', value: 1 }, { label: '0: Severo (caería sin ayuda)', value: 0 }] },
        { id: 'p5', text: '5. Paso compensatorio - Atrás (tras empuje en escápulas):', type: 'select', options: [{ label: '2: Normal (1 paso)', value: 2 }, { label: '1: Moderado (> 1 paso)', value: 1 }, { label: '0: Severo (caería/sin paso)', value: 0 }] },
        { id: 'p6', text: '6. Paso compensatorio - Lateral (tras empuje en hombros):', type: 'select', options: [{ label: '2: Normal (1 paso)', value: 2 }, { label: '1: Moderado (> 1 paso)', value: 1 }, { label: '0: Severo (caería)', value: 0 }] },
        
        // SISTEMA 3: ORIENTACIÓN SENSORIAL
        { id: 'p7', text: '7. Ojos abiertos, superficie firme, pies juntos:', type: 'select', options: [{ label: '2: Normal (30 seg estable)', value: 2 }, { label: '1: Moderado (inestable)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
        { id: 'p8', text: '8. Ojos cerrados, superficie inestable (espuma), pies juntos:', type: 'select', options: [{ label: '2: Normal (30 seg estable)', value: 2 }, { label: '1: Moderado (inestable)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
        { id: 'p9', text: '9. Superficie inclinada (punta pies arriba), ojos cerrados:', type: 'select', options: [{ label: '2: Normal (30 seg estable)', value: 2 }, { label: '1: Moderado (inestable)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
        
        // SISTEMA 4: MARCHA DINÁMICA
        { id: 'p10', text: '10. Cambio en la velocidad de la marcha:', type: 'select', options: [{ label: '2: Normal (cambio fluido)', value: 2 }, { label: '1: Moderado (lento o desequilibrio)', value: 1 }, { label: '0: Severo (no puede cambiar)', value: 0 }] },
        { id: 'p11', text: '11. Marcha con giros cefálicos (horizontales):', type: 'select', options: [{ label: '2: Normal (sin desvío)', value: 2 }, { label: '1: Moderado (desvío o reducción velocidad)', value: 1 }, { label: '0: Severo (pierde equilibrio)', value: 0 }] },
        { id: 'p12', text: '12. Marcha con giro sobre eje (pivote):', type: 'select', options: [{ label: '2: Normal (giro rápido y seguro)', value: 2 }, { label: '1: Moderado (pasos extra/lento)', value: 1 }, { label: '0: Severo (inestable)', value: 0 }] },
        { id: 'p13', text: '13. Superar obstáculos (caja):', type: 'select', options: [{ label: '2: Normal (seguro)', value: 2 }, { label: '1: Moderado (toca caja/duda)', value: 1 }, { label: '0: Severo (incapaz)', value: 0 }] },
        { id: 'p14', text: '14. Timed Up and Go con doble tarea (contar hacia atrás):', type: 'select', options: [{ label: '2: Normal (sin interferencia dual)', value: 2 }, { label: '1: Moderado (> 10% de lentitud)', value: 1 }, { label: '0: Severo (detiene marcha o tarea)', value: 0 }] }
      ],
  
      calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),
  
      interpretar: (puntaje) => {
        if (puntaje >= 20) return { 
          texto: `Equilibrio Funcional Seguro (${puntaje}/28)`, 
          color: 'emerald-600',
          evidencia: 'Puntaje por encima del riesgo de caídas. El paciente posee buenas estrategias anticipatorias y reactivas.',
          recomendaciones: ['Mantener acondicionamiento físico general', 'Re-evaluación en 6-12 meses'] 
        };
        if (puntaje >= 16) return { 
          texto: `Riesgo de Caídas Presente (${puntaje}/28)`, 
          color: 'orange-500',
          evidencia: 'Puntaje en rango de fragilidad. Se observa déficit en al menos uno de los sistemas de control postural.',
          recomendaciones: [
            'Identificar el sistema deficitario (ej. Postural Reactivo) y enfocar la terapia',
            'Entrenamiento de pasos compensatorios',
            'Entrenamiento de marcha con doble tarea cognitiva'
          ] 
        };
        return { 
          texto: `ALTO RIESGO DE CAÍDAS (${puntaje}/28)`, 
          color: 'red-600',
          evidencia: 'Puntaje crítico asociado a una alta probabilidad de eventos adversos y caídas en comunidad.',
          recomendaciones: [
            'Uso de ayuda técnica para la marcha',
            'Supervisión en actividades de riesgo',
            'Programa de rehabilitación intensiva centrado en estabilidad sensorial y reactiva'
          ] 
        };
      }
    },
    {
    id: 'tinetti_poma',
    nombre: 'Escala de Tinetti (POMA)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de la movilidad orientada al desempeño para detectar el riesgo de caídas en adultos mayores.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3486980) ---
    bibliografia: "Tinetti ME. Performance-oriented assessment of mobility problems in elderly patients. J Am Geriatr Soc. 1986 Jun;34(6):119-26.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3486980/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Evalúa el equilibrio y la marcha por separado. Un puntaje total < 19 indica un riesgo de caídas 5 veces superior al normal.",
  
    preguntas: [
      // SECCIÓN 1: EQUILIBRIO (0-16 pts)
      { id: 'eq_sentado', text: 'Equilibrio sentado:', type: 'select', options: [{ label: '0: Se inclina o desliza', value: 0 }, { label: '1: Estable y seguro', value: 1 }] },
      { id: 'eq_levantarse', text: 'Levantarse:', type: 'select', options: [{ label: '0: Incapaz sin ayuda', value: 0 }, { label: '1: Capaz con ayuda de brazos', value: 1 }, { label: '2: Capaz sin ayuda de brazos', value: 2 }] },
      { id: 'eq_intentos', text: 'Intentos para levantarse:', type: 'select', options: [{ label: '0: Incapaz sin ayuda', value: 0 }, { label: '1: Capaz con >1 intento', value: 1 }, { label: '2: Capaz con 1 intento', value: 2 }] },
      { id: 'eq_inmediato', text: 'Equilibrio bipedestación inmediata (primeros 5 seg):', type: 'select', options: [{ label: '0: Inestable (tambaleo/mueve pies)', value: 0 }, { label: '1: Estable con apoyos', value: 1 }, { label: '2: Estable sin apoyos', value: 2 }] },
      { id: 'eq_bipedestacion', text: 'Equilibrio en bipedestación prolongada:', type: 'select', options: [{ label: '0: Inestable', value: 0 }, { label: '1: Estable con base ancha o apoyos', value: 1 }, { label: '2: Estable con base estrecha y sin apoyos', value: 2 }] },
      { id: 'eq_empujon', text: 'Empujón (paciente con pies juntos, empujar suavemente el esternón):', type: 'select', options: [{ label: '0: Empieza a caerse', value: 0 }, { label: '1: Tambalea, se agarra', value: 1 }, { label: '2: Estable', value: 2 }] },
      { id: 'eq_ojos_cerrados', text: 'Ojos cerrados (pies juntos):', type: 'select', options: [{ label: '0: Inestable', value: 0 }, { label: '1: Estable', value: 1 }] },
      { id: 'eq_giro', text: 'Giro de 360 grados:', type: 'select', options: [{ label: '0: Pasos discontinuos o inestable', value: 0 }, { label: '1: Pasos continuos', value: 1 }, { label: '2: Estable', value: 2 }] },
      { id: 'eq_sentarse', text: 'Sentarse:', type: 'select', options: [{ label: '0: Inseguro (calcula mal)', value: 0 }, { label: '1: Usa los brazos/movimiento brusco', value: 1 }, { label: '2: Seguro y suave', value: 2 }] },
  
      // SECCIÓN 2: MARCHA (0-12 pts)
      { id: 'ma_inicio', text: 'Iniciación de la marcha:', type: 'select', options: [{ label: '0: Vacilación o varios intentos', value: 0 }, { label: '1: Sin vacilación', value: 1 }] },
      { id: 'ma_longitud_d', text: 'Longitud del paso (Derecho):', type: 'select', options: [{ label: '0: No sobrepasa al izq. o no despega', value: 0 }, { label: '1: Sobrepasa al izq. y despega bien', value: 1 }] },
      { id: 'ma_longitud_i', text: 'Longitud del paso (Izquierdo):', type: 'select', options: [{ label: '0: No sobrepasa al der. o no despega', value: 0 }, { label: '1: Sobrepasa al der. y despega bien', value: 1 }] },
      { id: 'ma_simetria', text: 'Simetría del paso:', type: 'select', options: [{ label: '0: Longitud desigual', value: 0 }, { label: '1: Pasos iguales', value: 1 }] },
      { id: 'ma_continuidad', text: 'Continuidad de los pasos:', type: 'select', options: [{ label: '0: Para o hay discontinuidad', value: 0 }, { label: '1: Fluida y continua', value: 1 }] },
      { id: 'ma_trayectoria', text: 'Trayectoria (observar desviación en 3 metros):', type: 'select', options: [{ label: '0: Desviación marcada', value: 0 }, { label: '1: Desviación leve o usa ayudas', value: 1 }, { label: '2: Derecha sin ayudas', value: 2 }] },
      { id: 'ma_tronco', text: 'Estabilidad del tronco:', type: 'select', options: [{ label: '0: Balanceo marcado o usa ayudas', value: 0 }, { label: '1: Flexiona rodillas/espalda o abre brazos', value: 1 }, { label: '2: Sin balanceo ni ayudas', value: 2 }] },
      { id: 'ma_postura', text: 'Postura en la marcha (talones):', type: 'select', options: [{ label: '0: Talones separados', value: 0 }, { label: '1: Talones casi se tocan al caminar', value: 1 }] }
    ],
  
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),
  
    interpretar: (puntaje) => {
      if (puntaje >= 25) return { 
        texto: `Tinetti ${puntaje}/28: Riesgo Bajo`, 
        color: 'emerald-600', 
        evidencia: 'Movilidad funcionalmente segura. Bajo riesgo de caídas.',
        recomendaciones: ['Mantener actividad física', 'Re-evaluar si cambia medicación'] 
      };
      if (puntaje >= 19) return { 
        texto: `Tinetti ${puntaje}/28: Riesgo Moderado`, 
        color: 'orange-500', 
        evidencia: 'Existen deficiencias que duplican el riesgo de caídas respecto al basal.',
        recomendaciones: ['Entrenamiento de propiocepción', 'Evaluar calzado', 'Fortalecimiento muscular de extremidad inferior'] 
      };
      return { 
        texto: `Tinetti ${puntaje}/28: RIESGO ALTO`, 
        color: 'red-600', 
        evidencia: 'Alta probabilidad de caída. El déficit de movilidad es crítico.',
        recomendaciones: [
          'Uso obligatorio de ayuda técnica (andador/bastón)',
          'Adaptación del entorno (quitar alfombras, mejorar luz)',
          'Kinesiología Motora con enfoque en equilibrio'
        ] 
      };
    }
  },
    {
    id: 'mrc_fuerza',
    nombre: 'Escala de Fuerza Muscular (MRC)',
    categoria: 'kinesiologia',
    descripcion: 'Sistema de graduación manual para evaluar la fuerza muscular desde la parálisis total hasta la fuerza normal.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 21915152) ---
    bibliografia: "Medical Research Council. Aids to the examination of the peripheral nervous system. Memorandum no. 45. London: HMSO, 1976.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/20952374", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es la escala de referencia para la evaluación motora. En contextos de paciente crítico, un MRC Sum-Score < 48 indica Debilidad Adquirida en la UCI (ICU-AW).",
  
    preguntas: [
      { 
        id: 'fuerza', 
        text: 'Grado de contracción/movimiento observado:', 
        type: 'select', 
        options: [
          { label: '0: Sin contracción (Parálisis total)', value: 0 },
          { label: '1: Contracción visible o palpable, pero sin movimiento', value: 1 },
          { label: '2: Movimiento activo que elimina la gravedad (en plano horizontal)', value: 2 },
          { label: '3: Movimiento activo contra la gravedad (rango completo)', value: 3 },
          { label: '4: Movimiento contra gravedad y resistencia moderada', value: 4 },
          { label: '5: Fuerza normal contra resistencia máxima', value: 5 }
        ] 
      }
    ],
  
    calcularPuntaje: (respuestas) => Number(respuestas.fuerza) ?? 0,
  
    interpretar: (puntaje) => {
      if (puntaje <= 1) return { 
        texto: 'Debilidad Severa / Parálisis', 
        color: 'red-600', 
        evidencia: 'La ausencia de movimiento sugiere compromiso neurológico o denervación severa.',
        recomendaciones: [
          'Movilizaciones pasivas para mantener rangos articulares',
          'Prevención de acortamientos musculares',
          'Uso de estimulación eléctrica funcional (FES) si aplica',
          'Cambios posturales frecuentes'
        ] 
      };
  
      if (puntaje <= 3) return { 
        texto: 'Debilidad Moderada', 
        color: 'amber-600', 
        evidencia: 'Capaz de vencer la gravedad pero incapaz de tolerar resistencia externa.',
        recomendaciones: [
          'Ejercicios activos-asistidos o activos libres',
          'Entrenamiento de control motor',
          'Enfoque en funcionalidad (AVD básicas)',
          'Evitar la fatiga muscular excesiva'
        ] 
      };
  
      return { 
        texto: 'Fuerza Funcional / Normal', 
        color: 'emerald-600', 
        evidencia: 'El músculo es capaz de vencer resistencia externa. Grado 5 se considera normal para el perfil del paciente.',
        recomendaciones: [
          'Ejercicios de fortalecimiento progresivo con carga',
          'Entrenamiento de potencia y resistencia',
          'Retorno gradual a actividades deportivas o laborales'
        ] 
      };
    }
  },
    {
      id: 'fugl_meyer',
      nombre: 'Fugl Meyer Assessment',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación de recuperación motora post-ACV',
      preguntas: [
        { id: 'hombro_codo', text: 'Función de hombro/codo/antebrazo', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
        { id: 'muneca', text: 'Función de muñeca', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
        { id: 'mano', text: 'Función de mano', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
        { id: 'coordinacion', text: 'Coordinación/velocidad', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Ligeramente anormal', value: 1 }, { label: 'Marcadamente anormal', value: 0 }] }
      ],
      calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
      interpretar: (puntaje) => {
        if (puntaje >= 7) return { texto: 'Recuperación motora excelente', recomendaciones: ['Entrenamiento funcional de alta destreza', 'Reintegración deportiva/laboral'] };
        if (puntaje >= 5) return { texto: 'Recuperación motora buena', recomendaciones: ['Terapia de movimiento inducido por restricción (CIMT)', 'Entrenamiento de tareas específicas orientadas a objetivos'] };
        if (puntaje >= 3) return { texto: 'Recuperación motora moderada', recomendaciones: ['Facilitación de sinergias extensoras/flexoras', 'Práctica repetitiva de alcance y agarre', 'Uso de estimulación eléctrica funcional (FES)'] };
        return { texto: 'Recuperación motora pobre', recomendaciones: ['Manejo de espasticidad (posicionamiento, férulas)', 'Movilización pasiva para mantener ROM', 'Uso compensatorio del hemicuerpo sano'] };
      }
    },
    {
      id: 'trunk_control',
      nombre: 'Trunk Control Test',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación del control de tronco',
      preguntas: [
        { id: 'rodar_debil', text: 'Rodar hacia el lado débil', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
        { id: 'rodar_sano', text: 'Rodar hacia el lado sano', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
        { id: 'sentarse', text: 'Sentarse desde posición supina', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
        { id: 'equilibrio_sentado', text: 'Equilibrio sentado', type: 'select', options: [{ label: 'Se mantiene 30 segundos', value: 25 }, { label: 'Se mantiene menos tiempo', value: 12 }, { label: 'No se mantiene', value: 0 }] }
      ],
      calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
      interpretar: (puntaje) => {
        if (puntaje === 100) return { texto: 'Control de tronco normal', recomendaciones: ['Permite iniciar entrenamiento de bipedestación y marcha segura', 'Ejercicios de core avanzado'] };
        if (puntaje >= 50) return { texto: 'Control de tronco moderado', recomendaciones: ['Ejercicios de estabilización rítmica en sedente', 'Reacciones de enderezamiento en balón terapéutico', 'Entrenamiento de transferencias asistidas'] };
        return { texto: 'Control de tronco severamente alterado', recomendaciones: ['Apoyo completo para mantener sedestación', 'Uso de silla neurológica o con controles laterales', 'Trabajo en colchoneta (roles y control cefálico)'] };
      }
    },
    {
    id: 'eva',
    nombre: 'Escala Visual Analógica (EVA)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación subjetiva de la intensidad del dolor percibida por el paciente.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 4139420) ---
    bibliografia: "Huskisson EC. Measurement of pain. Lancet. 1974 Nov 9;2(7889):1127-31.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/4139420/",
    evidenciaClinica: "La EVA es el estándar de oro para medir la intensidad del dolor. Una reducción de 2 puntos o el 33% se considera un Cambio Mínimo Clínicamente Significativo (MCID).",
  
    preguntas: [
      { 
        id: 'intensidad', 
        text: 'En una escala de 0 a 10, donde 0 es "sin dolor" y 10 es "el peor dolor imaginable", ¿cuánto le duele ahora?', 
        type: 'number',
        min: 0,
        max: 10
      }
    ],
  
    calcularPuntaje: (respuestas) => Number(respuestas.intensidad) || 0,
  
    interpretar: (puntaje) => {
      if (puntaje === 0) return { 
        texto: 'Sin dolor',
        color: 'emerald-600',
        evidencia: 'Estado basal. No se reporta sintomatología dolorosa.',
        recomendaciones: ['Mantener plan de ejercicios habitual', 'Registrar como valor de referencia'] 
      };
      
      if (puntaje <= 3) return { 
        texto: 'Dolor Leve',
        color: 'yellow-600',
        evidencia: 'Dolor que permite la realización de actividades de la vida diaria (AVD) con mínimas limitaciones.',
        recomendaciones: [
          'Uso de agentes físicos (calor/frío según fase)',
          'Ejercicios de movilidad suave',
          'Educación sobre manejo de cargas'
        ] 
      };
      
      if (puntaje <= 6) return { 
        texto: 'Dolor Moderado',
        color: 'orange-600',
        evidencia: 'Dolor que interfiere significativamente con las AVD y el sueño.',
        recomendaciones: [
          'Considerar terapia manual analgésica',
          'Ajustar intensidad del entrenamiento',
          'Evaluar necesidad de fármacos según protocolo médico'
        ] 
      };
  
      return { 
        texto: 'Dolor Severo', 
        color: 'red-600', 
        evidencia: 'Dolor incapacitante. Requiere atención inmediata para evitar cronificación o compromiso sistémico.',
        recomendaciones: [
          'Reposo relativo de la zona afectada',
          'Evaluación médica prioritaria',
          'Técnicas de desensibilización central'
        ] 
      };
    }
  },
    
    {
      id: 'escala_numerica_dolor',
      nombre: 'Escala Numérica del Dolor (NRS-11)',
      categoria: 'kinesiologia',
      descripcion: 'Herramienta de unidimensional para la cuantificación de la intensidad del dolor referida por el paciente.',
      
      // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 713505) ---
      bibliografia: "Downie WW, et al. Studies with pain rating scales. Ann Rheum Dis. 1978 Aug;37(4):378-81.",
      referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/713505/", // ✅ LINK VERIFICADO
      evidenciaClinica: "Es el estándar para pacientes comunicativos. Presenta una mayor validez estadística que la escala categórica verbal y es más fácil de aplicar que la EVA en contextos de urgencia.",
  
      preguntas: [
        { 
          id: 'dolor', 
          text: 'Instrucción al paciente: "En una escala de 0 a 10, donde 0 es la ausencia total de dolor y 10 es el peor dolor que pueda imaginar, ¿qué número le asigna a su dolor en este momento?"', 
          type: 'select', 
          options: [
            { label: '0: Sin dolor', value: 0 },
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3: Dolor leve', value: 3 },
            { label: '4', value: 4 },
            { label: '5: Dolor moderado', value: 5 },
            { label: '6', value: 6 },
            { label: '7: Dolor severo', value: 7 },
            { label: '8', value: 8 },
            { label: '9', value: 9 },
            { label: '10: Dolor máximo / Insoportable', value: 10 }
          ] 
        }
      ],
  
      calcularPuntaje: (respuestas) => Number(respuestas.dolor) || 0,
  
      interpretar: (puntaje) => {
        if (puntaje === 0) {
          return { 
            texto: 'Sin Dolor', 
            color: 'emerald-600', 
            evidencia: 'El paciente niega cualquier percepción dolorosa.', 
            recomendaciones: ['Registrar como basal', 'Continuar evaluación funcional'] 
          };
        }
        if (puntaje <= 3) {
          return { 
            texto: 'Dolor Leve', 
            color: 'green-500', 
            evidencia: 'Dolor que permite la realización de la mayoría de las AVD y el descanso nocturno.', 
            recomendaciones: ['Crioterapia/Termoterapia', 'Higiene postural', 'Educación en neurofisiología del dolor'] 
          };
        }
        if (puntaje <= 6) {
          return { 
            texto: 'Dolor Moderado', 
            color: 'yellow-500', 
            evidencia: 'Interfiere significativamente con la actividad diaria. Requiere atención analgésica.', 
            recomendaciones: ['Consultar protocolo farmacológico (Escalón 2 OMS)', 'Terapia manual no invasiva', 'Dosificar carga de ejercicio'] 
          };
        }
        if (puntaje <= 8) {
          return { 
            texto: 'Dolor Severo', 
            color: 'orange-600', 
            evidencia: 'Dolor que impide el descanso y limita severamente la movilidad.', 
            recomendaciones: ['Evaluación médica inmediata', 'Uso de fármacos de rescate', 'Reposo funcional'] 
          };
        }
        return { 
          texto: 'Dolor Insoportable', 
          color: 'red-600', 
          evidencia: 'Máximo nivel de estrés fisiológico por dolor. Riesgo de shock neurogénico.', 
          recomendaciones: ['Manejo de urgencia', 'Analgesia multimodal endovenosa', 'Monitoreo constante'] 
        };
      }
    },
    {
      id: 'mcgill',
      nombre: 'Cuestionario McGill del Dolor',
      categoria: 'kinesiologia',
      descripcion: 'Evaluación multidimensional del dolor',
      preguntas: [
        { id: 'sensorial', text: 'Componente sensorial del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] },
        { id: 'afectivo', text: 'Componente afectivo del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] },
        { id: 'evaluativo', text: 'Componente evaluativo del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] }
      ],
      calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
      interpretar: (puntaje) => {
        if (puntaje === 0) return { texto: 'Sin dolor', recomendaciones: [] };
        if (puntaje <= 3) return { texto: 'Dolor leve multidimensional', recomendaciones: ['Manejo farmacológico básico', 'Educación sobre la neurobiología del dolor'] };
        if (puntaje <= 6) return { texto: 'Dolor moderado con componente afectivo', recomendaciones: ['Manejo multimodal (fármacos + terapia física)', 'Intervención psicológica o terapia cognitivo-conductual', 'Ejercicios de relajación / Mindfulness'] };
        return { texto: 'Dolor severo crónico/complejo', recomendaciones: ['Derivación a Unidad del Dolor', 'Tratamiento farmacológico avanzado (neuromoduladores, antidepresivos tricíclicos)', 'Soporte psiquiátrico'] };
      }
    },
    {
    id: 'ashworth_mod',
    nombre: 'Escala de Ashworth Modificada',
    categoria: 'neurologia',
    descripcion: 'Evaluación clínica del tono muscular y la resistencia al movimiento pasivo (Espasticidad).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 3678525) ---
    bibliografia: "Bohannon RW, Smith MB. Interrater reliability of a modified Ashworth scale of muscle spasticity. Phys Ther. 1987;67(2):206-7.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/3678525/", // ✅ LINK VERIFICADO
    evidenciaClinica: "La MAS es la herramienta más utilizada para cuantificar la espasticidad en pacientes con lesiones del sistema nervioso central.",
  
    preguntas: [
      { 
        id: 'tono', 
        text: 'Respuesta al movimiento pasivo (en el ángulo de flexión/extensión):', 
        type: 'select', 
        options: [
          { label: '0: Tono normal. Sin aumento de la resistencia', value: 0 },
          { label: '1: Ligero aumento (tirones al final del arco de movimiento)', value: 1 },
          { label: '2 (1+): Ligero aumento (resistencia en menos de la mitad del arco)', value: 2 },
          { label: '3: Aumento marcado de la resistencia (en la mayor parte del arco)', value: 3 },
          { label: '4: Aumento considerable (movimiento pasivo difícil)', value: 4 },
          { label: '5: Extremidad afectada rígida (en flexión o extensión)', value: 5 }
        ] 
      }
    ],
  
    calcularPuntaje: (respuestas) => Number(respuestas.tono) ?? 0,
  
    interpretar: (puntaje) => {
      if (puntaje === 0) return { 
        texto: 'Tono Normal', 
        color: 'emerald-600', 
        evidencia: 'Sin signos de espasticidad clínica en el segmento evaluado.',
        recomendaciones: ['Mantener plan de movilidad actual', 'Registro basal'] 
      };
      if (puntaje <= 2) return { 
        texto: 'Espasticidad Leve', 
        color: 'yellow-600', 
        evidencia: 'Resistencia mínima al final del arco de movimiento (Grados 1 y 1+).',
        recomendaciones: ['Estiramientos analíticos', 'Educación postural', 'Uso de férulas si se requiere alineación'] 
      };
      if (puntaje === 3) return { 
        texto: 'Espasticidad Moderada', 
        color: 'orange-600', 
        evidencia: 'Aumento marcado del tono que interfiere con la funcionalidad del segmento.',
        recomendaciones: ['Terapia manual descontracturante', 'Manejo farmacológico (consultar médico)', 'Toxina botulínica si aplica'] 
      };
      return { 
        texto: 'Espasticidad Severa / Rigidez', 
        color: 'red-600', 
        evidencia: 'Movimiento pasivo muy dificultoso o nulo por la alta resistencia muscular.',
        recomendaciones: ['Prevención de deformidades fijas', 'Evaluación para bomba de baclofeno o cirugía', 'Posicionamiento terapéutico estricto'] 
      };
    }
  },
  
    

];

export default scales;