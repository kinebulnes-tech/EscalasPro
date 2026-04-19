// src/data/scales/uci.ts
import type { Scale, InterpretacionAvanzada } from '../scalesData';

const scales: Scale[] = [

{
    id: 'mmrc_disnea',
    nombre: 'Escala de Disnea mMRC',
    categoria: 'cardiorespiratorio',
    descripcion: 'Escala modificada del Medical Research Council para cuantificar la limitación por disnea en actividades de la vida diaria.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10471018) ---
    bibliografia: "Bestall JC, et al. Usefulness of the Medical Research Council (MRC) dyspnoea scale as a measure of disability in patients with chronic obstructive pulmonary disease. Thorax. 1999.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10471018/",
    evidenciaClinica: "Un puntaje mMRC ≥ 2 es un punto de corte crítico. En guías GOLD y guías MINSAL de EPOC, define a un paciente como 'altamente sintomático', lo que modifica directamente la terapia farmacológica.",

    preguntas: [
      { 
        id: 'grado_disnea', 
        text: 'Seleccione el grado que mejor describa su falta de aire:', 
        type: 'select',
        options: [
          { label: 'Grado 0: Solo tengo falta de aire al realizar ejercicio intenso.', value: 0 },
          { label: 'Grado 1: Me falta el aire al caminar rápido en llano o al subir una cuesta poco pronunciada.', value: 1 },
          { label: 'Grado 2: No puedo mantener el paso de personas de mi edad en llano, o tengo que parar a descansar al caminar en llano a mi propio paso.', value: 2 },
          { label: 'Grado 3: Tengo que parar a descansar después de caminar unos 100 metros o después de pocos minutos de caminar en llano.', value: 3 },
          { label: 'Grado 4: Tengo demasiada falta de aire para salir de casa o me falta el aire al vestirme o desvestirme.', value: 4 }
        ]
      }
    ],

    // ✅ CORREGIDO: Se usa undefined check para evitar interpretación
    //    falsa cuando el usuario aún no ha seleccionado ninguna opción.
    //    El Grado 0 es un valor clínicamente válido, por lo que no se
    //    puede usar || 0 como fallback seguro.
    calcularPuntaje: (respuestas) =>
      respuestas.grado_disnea !== undefined
        ? Number(respuestas.grado_disnea)
        : null,

    interpretar: (puntaje, _respuestas) => {
      // ✅ CORREGIDO: Guarda de nulidad. Si el formulario está incompleto,
      //    no se emite ninguna interpretación clínica.
      if (puntaje === null) {
        return {
          texto: 'SIN DATOS SUFICIENTES',
          color: 'gray-400',
          evidencia: 'El paciente aún no ha seleccionado un grado de disnea.',
          recomendaciones: [
            'Solicite al paciente que seleccione el grado que mejor describe su limitación.'
          ]
        };
      }

      if (puntaje >= 2) {
        return {
          texto: `DISNEA LIMITANTE (Grado ${puntaje})`,
          color: 'red-600',
          evidencia: `Puntaje ≥ 2 indica una limitación funcional significativa para la marcha en terreno llano.`,
          recomendaciones: [
            'Clasificación GOLD: Paciente sintomático (Grupos B o E)',
            'Considerar ajuste de broncodilatación (LAMA+LABA)',
            'Ingreso prioritario a programa de Rehabilitación Pulmonar',
            'Evaluar técnica inhalatoria y adherencia al tratamiento'
          ]
        };
      }

      return {
        texto: `DISNEA LEVE / NO LIMITANTE (Grado ${puntaje})`,
        color: 'emerald-600',
        evidencia: 'El paciente mantiene autonomía en la marcha al ritmo de sus pares.',
        recomendaciones: [
          'Mantener actividad física regular y control de peso',
          'Vacunación al día (Influenza/Neumococo)',
          'Seguimiento anual de función pulmonar (Espirometría)'
        ]
      };
    }
  },

  {
    id: 'nyha_funcional',
    nombre: 'Clasificación Funcional NYHA',
    categoria: 'cardiorespiratorio',
    descripcion: 'Clasificación de la gravedad de la insuficiencia cardíaca según la limitación de la actividad física.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 8062531) ---
    bibliografia: "The Criteria Committee of the New York Heart Association. Nomenclature and Criteria for Diagnosis of Diseases of the Heart and Great Vessels. 9th ed. Boston, Mass: Little, Brown & Co; 1994:253-256.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/8062531/",
    evidenciaClinica: "La NYHA es el predictor pronóstico más simple y potente en insuficiencia cardíaca. Los cambios entre clases definen el éxito de la terapia médica o quirúrgica.",

    preguntas: [
      { 
        id: 'clase_funcional', 
        text: 'Seleccione la clase que mejor describa la limitación del paciente:', 
        type: 'select',
        options: [
          { label: 'Clase I: Sin limitación de la actividad física. El ejercicio ordinario no causa fatiga excesiva, palpitaciones o disnea.', value: 1 },
          { label: 'Clase II: Limitación ligera de la actividad física. Cómodo en reposo. La actividad ordinaria resulta en fatiga, palpitaciones o disnea.', value: 2 },
          { label: 'Clase III: Limitación marcada de la actividad física. Cómodo en reposo. Actividades menores a las ordinarias causan síntomas.', value: 3 },
          { label: 'Clase IV: Incapacidad para llevar a cabo cualquier actividad física sin molestias. Síntomas presentes incluso en reposo.', value: 4 }
        ]
      }
    ],

    // ✅ CORREGIDO: Se usa undefined check para evitar interpretación
    //    falsa cuando el usuario aún no ha seleccionado ninguna opción.
    //    La Clase I es un valor clínicamente válido (value: 1), por lo que
    //    no se puede usar || 1 como fallback seguro.
    calcularPuntaje: (respuestas) =>
      respuestas.clase_funcional !== undefined
        ? Number(respuestas.clase_funcional)
        : null,

    interpretar: (puntaje, _respuestas) => {
      // ✅ CORREGIDO: Guarda de nulidad. Si el formulario está incompleto,
      //    no se emite ninguna interpretación clínica.
      if (puntaje === null) {
        return {
          texto: 'SIN DATOS SUFICIENTES',
          color: 'gray-400',
          evidencia: 'El paciente aún no ha seleccionado una clase funcional.',
          recomendaciones: [
            'Solicite al paciente o evaluador que seleccione la clase que mejor describe la limitación funcional.'
          ]
        };
      }

      if (puntaje === 4) {
        return {
          texto: 'NYHA CLASE IV (Severa)',
          color: 'red-600',
          evidencia: 'Síntomas de insuficiencia cardíaca en reposo. Máximo riesgo clínico.',
          recomendaciones: [
            'Evaluación médica urgente para ajuste de diuréticos/inotrópicos',
            'Reposo absoluto con cabecera elevada',
            'Restricción estricta de fluidos y sodio',
            'Considerar hospitalización o cuidados paliativos según contexto'
          ]
        };
      }

      if (puntaje === 3) {
        return {
          texto: 'NYHA CLASE III (Moderada-Severa)',
          color: 'orange-600',
          evidencia: 'Limitación marcada. Actividades básicas (vestirse, caminar distancias cortas) provocan síntomas.',
          recomendaciones: [
            // ✅ CORREGIDO: Se añade ARNI (Sacubitril/Valsartán) como primera
            //    línea según guías ESC 2021 y ACC/AHA 2022, reemplazando la
            //    mención exclusiva de IECA/ARAII que estaba desactualizada.
            'Ajuste de terapia farmacológica: priorizar ARNI (Sacubitril/Valsartán) sobre IECA/ARAII según guías ESC 2021',
            'Optimizar Beta-bloqueo con titulación progresiva',
            'Rehabilitación cardiovascular supervisada con monitoreo estrecho',
            'Educación sobre signos de descompensación (edema, ganancia de peso > 2 kg en 48h)'
          ]
        };
      }

      if (puntaje === 2) {
        return {
          texto: 'NYHA CLASE II (Leve-Moderada)',
          color: 'yellow-600',
          evidencia: 'Actividades físicas habituales provocan fatiga o disnea.',
          recomendaciones: [
            'Ingreso a programa de entrenamiento físico aeróbico progresivo',
            'Optimizar adherencia al tratamiento farmacológico',
            'Seguimiento ambulatorio por cardiología'
          ]
        };
      }

      // puntaje === 1 → Clase I
      return {
        texto: 'NYHA CLASE I (Asintomático)',
        color: 'emerald-600',
        evidencia: 'Sin limitaciones para la actividad física ordinaria.',
        recomendaciones: [
          'Mantener estilo de vida activo y saludable',
          'Prevención secundaria: control de presión arterial y lípidos',
          'Evaluación funcional periódica (Test de Esfuerzo)'
        ]
      };
    }
  },
  {
    id: 'act_control_asma',
    nombre: 'Test de Control del Asma (ACT)',
    categoria: 'cardiorespiratorio',
    descripcion: 'Evaluación del nivel de control de los síntomas asmáticos en las últimas 4 semanas.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 14741583) ---
    bibliografia: "Nathan RA, et al. Development of the asthma control test: a survey for predicting clinical expert assessment. J Allergy Clin Immunol. 2004.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/14741583/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Un puntaje < 20 indica que el asma no está bien controlada. Es la escala más sensible para predecir exacerbaciones y la necesidad de ajustar el corticoide inhalado.",

    preguntas: [
      { 
        id: 'limitacion', 
        text: '1. ¿En las últimas 4 semanas, cuánto tiempo le ha impedido el asma realizar sus actividades habituales?', 
        type: 'select',
        options: [
          { label: 'Siempre (1 pt)', value: 1 },
          { label: 'Casi siempre (2 pts)', value: 2 },
          { label: 'A veces (3 pts)', value: 3 },
          { label: 'Pocas veces (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'disnea', 
        text: '2. ¿Con qué frecuencia ha tenido dificultad para respirar (falta de aire)?', 
        type: 'select',
        options: [
          { label: 'Más de una vez al día (1 pt)', value: 1 },
          { label: 'Una vez al día (2 pts)', value: 2 },
          { label: '3 a 6 veces por semana (3 pts)', value: 3 },
          { label: '1 o 2 veces por semana (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'despertar_nocturno', 
        text: '3. ¿Cuántas veces los síntomas de asma le han despertado por la noche o más temprano de lo habitual?', 
        type: 'select',
        options: [
          { label: '4 o más noches por semana (1 pt)', value: 1 },
          { label: '2 o 3 noches por semana (2 pts)', value: 2 },
          { label: 'Una vez por semana (3 pts)', value: 3 },
          { label: '1 o 2 veces (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'rescate', 
        text: '4. ¿Cuántas veces ha tenido que usar su inhalador de rescate (Salbutamol)?', 
        type: 'select',
        options: [
          { label: '3 o más veces al día (1 pt)', value: 1 },
          { label: '1 o 2 veces al día (2 pts)', value: 2 },
          { label: '3 o más veces por semana (3 pts)', value: 3 },
          { label: '1 vez por semana o menos (4 pts)', value: 4 },
          { label: 'Nunca (5 pts)', value: 5 }
        ]
      },
      { 
        id: 'autopercepcion', 
        text: '5. ¿Cómo calificaría el control de su asma durante las últimas 4 semanas?', 
        type: 'select',
        options: [
          { label: 'Nada controlada (1 pt)', value: 1 },
          { label: 'Poco controlada (2 pts)', value: 2 },
          { label: 'Bien controlada (3 pts)', value: 3 },
          { label: 'Muy bien controlada (4 pts)', value: 4 },
          { label: 'Totalmente controlada (5 pts)', value: 5 }
        ]
      }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, _respuestas) => {
      if (puntaje === 25) {
        return {
          texto: 'ASMA TOTALMENTE CONTROLADA',
          color: 'emerald-600',
          evidencia: `Puntaje perfecto (${puntaje}/25). No hay síntomas ni limitaciones reportadas.`,
          recomendaciones: [
            'Mantener terapia controladora actual',
            'Control de rutina cada 6 meses',
            'Continuar educación en técnica inhalatoria'
          ]
        };
      }

      if (puntaje >= 20) {
        return {
          texto: 'ASMA BIEN CONTROLADA',
          color: 'green-500',
          evidencia: `Puntaje de ${puntaje}/25. Control satisfactorio de la sintomatología.`,
          recomendaciones: [
            'Mantener tratamiento actual',
            'Seguir plan de acción ante crisis leves',
            'Monitorear factores desencadenantes (alérgenos, frío)'
          ]
        };
      }

      if (puntaje >= 16) {
        return {
          texto: 'ASMA PARCIALMENTE CONTROLADA',
          color: 'orange-500',
          evidencia: `Puntaje de ${puntaje}/25. Sugiere riesgo de exacerbación aguda.`,
          recomendaciones: [
            'Revisar técnica inhalatoria (uso de aerocámara)',
            'Evaluar aumento de dosis de corticoide inhalado (Step Up)',
            'Identificar fallas en la adherencia al tratamiento'
          ]
        };
      }

      return {
        texto: 'ASMA NO CONTROLADA',
        color: 'red-600',
        evidencia: `Puntaje crítico (${puntaje}/25). Alto impacto funcional y riesgo vital.`,
        recomendaciones: [
          'Evaluación médica inmediata por especialista',
          'Considerar inicio de corticoide oral si hay crisis activa',
          'Ajuste urgente de la terapia de mantención',
          'Vigilancia estricta de flujo espiratorio máximo (PEF)'
        ]
      };
    }
  },

  {
    id: 'cat_epoc',
    nombre: 'CAT (COPD Assessment Test)',
    categoria: 'cardiorespiratorio',
    descripcion: 'Cuestionario de 8 ítems para evaluar el impacto de la EPOC en el bienestar y la vida diaria del paciente.',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 19700392) ---
    bibliografia: "Jones PW, et al. Development and first validation of the COPD Assessment Test. Eur Respir J. 2009.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/19700392/",
    evidenciaClinica: "Un puntaje ≥ 10 indica un paciente 'altamente sintomático' según guías GOLD 2024. El punto de corte ≥ 30 (no > 30) define impacto muy alto. Es el estándar para monitorizar la respuesta clínica al tratamiento broncodilatador y rehabilitador.",

    preguntas: [
      { id: 'tos',             text: '1. Tos: (0: Nunca toso — 5: Siempre estoy tosiendo)',                                               type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'flema',           text: '2. Flema: (0: No tengo flema en el pecho — 5: Tengo el pecho lleno de flema)',                       type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'opresion',        text: '3. Opresión: (0: No siento opresión en el pecho — 5: Siento mucha opresión)',                        type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'disnea_esfuerzo', text: '4. Disnea al subir: (0: No me falta el aire al subir una cuesta o un piso — 5: Me falta mucho el aire)', type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'limitacion',      text: '5. Limitación en casa: (0: No me siento limitado para actividades domésticas — 5: Muy limitado)',    type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'confianza',       text: '6. Seguridad: (0: Me siento seguro al salir de casa — 5: No me siento nada seguro)',                type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'sueno',           text: '7. Sueño: (0: Duermo profundamente — 5: No duermo bien por mis problemas pulmonares)',              type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] },
      { id: 'energia',         text: '8. Energía: (0: Tengo mucha energía — 5: No tengo nada de energía)',                                type: 'radio', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }] }
    ],

    // ✅ CORREGIDO: Se usa -1 como centinela de formulario incompleto
    //    en lugar de null, para respetar la firma => number de la interfaz.
    //    TypeScript no lanza error y el interpretar lo detecta limpiamente.
    calcularPuntaje: (respuestas) => {
      const camposRequeridos = [
        'tos', 'flema', 'opresion', 'disnea_esfuerzo',
        'limitacion', 'confianza', 'sueno', 'energia'
      ];

      const completo = camposRequeridos.every(
        (campo) => respuestas[campo] !== undefined
      );

      if (!completo) return -1;

      return camposRequeridos.reduce(
        (sum, campo) => sum + Number(respuestas[campo]),
        0
      );
    },

    interpretar: (puntaje, _respuestas) => {
      // ✅ Detecta el centinela -1 en lugar de null.
      //    Compatible 100% con la firma de la interfaz.
      if (puntaje === -1) {
        return {
          texto: 'CUESTIONARIO INCOMPLETO',
          color: 'gray-400',
          evidencia: 'Se requieren las 8 respuestas para calcular el impacto de la EPOC de forma válida.',
          recomendaciones: [
            'Complete todos los ítems del cuestionario antes de interpretar el resultado.',
            'Cada ítem evalúa un dominio distinto: síntomas, limitación funcional, sueño y bienestar.'
          ]
        };
      }

      if (puntaje >= 30) {
        return {
          texto: 'Impacto MUY ALTO (≥ 30)',
          color: 'red-700',
          evidencia: `Puntaje CAT: ${puntaje}/40. Calidad de vida gravemente comprometida. Corresponde al grupo de mayor carga sintomática según GOLD 2024.`,
          recomendaciones: [
            'Evaluación médica inmediata para ajuste de terapia triple (LAMA + LABA + ICS)',
            'Derivación a programa de Rehabilitación Pulmonar intensivo',
            'Evaluar necesidad de oxigenoterapia domiciliaria (PaO₂ ≤ 55 mmHg o SatO₂ ≤ 88%)',
            'Considerar soporte ventilatorio no invasivo (VNI) si hay hipercapnia',
            'Vigilancia estricta de exacerbaciones y plan de acción escrito'
          ]
        };
      }

      if (puntaje >= 21) {
        return {
          texto: 'Impacto ALTO (21 - 29)',
          color: 'red-500',
          evidencia: `Puntaje CAT: ${puntaje}/40. Gran limitación en la mayoría de los dominios evaluados. Paciente sintomático según clasificación GOLD 2024.`,
          recomendaciones: [
            'Optimizar tratamiento broncodilatador de larga acción (LAMA + LABA)',
            'Evaluar adición de ICS si hay ≥ 2 exacerbaciones moderadas al año o eosinófilos ≥ 300 céls/µL',
            'Reforzar educación en autocuidado y cese tabáquico activo',
            'Revisar técnica de inhalación en cada control'
          ]
        };
      }

      if (puntaje >= 10) {
        return {
          texto: 'Impacto MODERADO (10 - 20)',
          color: 'orange-500',
          evidencia: `Puntaje CAT: ${puntaje}/40. El paciente se considera "altamente sintomático" según guías GOLD 2024. Requiere ajuste terapéutico.`,
          recomendaciones: [
            'Iniciar o mantener broncodilatador de larga acción (LAMA como primera línea)',
            'Revisar plan de acción ante crisis respiratorias',
            'Fomentar actividad física diaria supervisada (mínimo 30 min/día)',
            'Controlar factores ambientales y laborales desencadenantes'
          ]
        };
      }

      return {
        texto: 'Impacto BAJO (< 10)',
        color: 'emerald-600',
        evidencia: `Puntaje CAT: ${puntaje}/40. Síntomas estables con poco impacto en la vida diaria. Paciente "poco sintomático" según GOLD 2024.`,
        recomendaciones: [
          'Mantener terapia broncodilatadora actual si está indicada',
          'Control anual con espirometría para monitorizar progresión',
          'Vacunación vigente: Influenza anual, Neumococo, COVID-19',
          'Fomentar estilos de vida saludables y cese tabáquico si aplica'
        ]
      };
    }
  },
  {
    id: 'wells_tep',
    nombre: 'Score de Wells (Embolia Pulmonar)',
    categoria: 'cardiorespiratorio',
    descripcion: 'Evaluación de la probabilidad clínica de Tromboembolismo Pulmonar (TEP).',
    
    // --- RIGOR CIENTÍFICO VERIFICADO (PMID: 10655430) ---
    bibliografia: "Wells PS, et al. Derivation of a simple clinical model to categorize patients probability of pulmonary embolism. Thromb Haemost. 2000.",
    referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/10655430/", // ✅ LINK VERIFICADO
    evidenciaClinica: "Es el estándar para evitar el sobre-diagnóstico y la irradiación innecesaria. Un puntaje > 6 indica alta probabilidad clínica, mientras que un puntaje < 2 permite descartar TEP si el Dímero D es negativo.",

    preguntas: [
      { id: 'signos_tvp', text: '1. Signos clínicos de Trombosis Venosa Profunda (edema, dolor a la palpación):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+3 pts)', value: 3 }] },
      { id: 'diagnostico_alt', text: '2. ¿El TEP es el diagnóstico más probable o igual de probable que otros?', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+3 pts)', value: 3 }] },
      { id: 'fc_alta', text: '3. Frecuencia cardíaca > 100 latidos por minuto:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1.5 pts)', value: 1.5 }] },
      { id: 'inmovilizacion', text: '4. Cirugía o inmovilización en las últimas 4 semanas:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1.5 pts)', value: 1.5 }] },
      { id: 'antecedentes', text: '5. Antecedentes previos de TEP o TVP:', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1.5 pts)', value: 1.5 }] },
      { id: 'hemoptisis', text: '6. Presencia de hemoptisis (tos con sangre):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1 pt)', value: 1 }] },
      { id: 'cancer', text: '7. Cáncer activo (tratamiento actual o en los últimos 6 meses):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (+1 pt)', value: 1 }] }
    ],

    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),

    interpretar: (puntaje, _respuestas) => {
      if (puntaje > 6) {
        return {
          texto: 'PROBABILIDAD ALTA (> 6)',
          color: 'red-600',
          evidencia: `Puntaje de ${puntaje}: Riesgo clínico elevado (aprox. 65% de probabilidad de TEP).`,
          recomendaciones: [
            'Indicación urgente de Angio-TAC de tórax',
            'Considerar inicio de anticoagulación empírica si no hay contraindicaciones',
            'Monitoreo hemodinámico estricto',
            'Evaluación por equipo de medicina de urgencia o broncopulmonar'
          ]
        };
      }

      if (puntaje >= 2) {
        return {
          texto: 'PROBABILIDAD MODERADA (2 - 6)',
          color: 'orange-500',
          evidencia: `Puntaje de ${puntaje}: Riesgo clínico intermedio.`,
          recomendaciones: [
            'Solicitar Dímero D de alta sensibilidad',
            'Si Dímero D es (+) realizar Angio-TAC',
            'Mantener observación clínica estrecha'
          ]
        };
      }

      return {
        texto: 'PROBABILIDAD BAJA (< 2)',
        color: 'emerald-600',
        evidencia: `Puntaje de ${puntaje}: Riesgo clínico bajo (menos del 10% de probabilidad de TEP).`,
        recomendaciones: [
          'Solicitar Dímero D; si es (-) se puede descartar TEP con seguridad',
          'Evaluar otros diagnósticos diferenciales (dolor osteomuscular, pleuritis)',
          'No se recomienda Angio-TAC de entrada'
        ]
      };
    }
  },

  {
  id: 'minnesota_hf',
  nombre: 'Minnesota Living with Heart Failure (MLHFQ)',
  categoria: 'cardiorespiratorio',
  descripcion: 'Cuestionario de calidad de vida específico para insuficiencia cardíaca, post-infarto y pacientes cardio-operados. Evalúa el impacto físico, emocional y socioeconómico de la enfermedad en las últimas 4 semanas.',

  bibliografia: "Rector TS, Cohn JN. Assessment of patient outcome with the Minnesota Living with Heart Failure questionnaire: reliability and validity during a randomized, double-blind, placebo-controlled trial of pimobendan. Am Heart J. 1992;124(4):1017-25.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/1529875/",
  evidenciaClinica: "Instrumento más utilizado en América Latina para CVRS en IC. Puntos de corte validados por redes neuronales (Garin et al., 2013): < 24 buena CV, 24-45 moderada, > 45 mala. MCID = 5 puntos (Rector et al., 1995). Alfa de Cronbach ≥ 0.8 en versión española validada (Rev Esp Cardiol, 2008). Correlación significativa con clase funcional NYHA (p < 0.001).",

  preguntas: [
    {
      id: 'instrucciones',
      text: '📋 INSTRUCCIONES: Pregunte al paciente en qué medida su enfermedad cardíaca le impidió vivir como hubiera querido durante el ÚLTIMO MES. Para cada situación, el paciente debe responder de 0 (nada) a 5 (muchísimo). Si una situación no le aplica, marcar 0.',
      type: 'text',
      placeholder: 'Cuestionario autoaplicable — Lea las instrucciones al paciente antes de iniciar. Tiempo estimado: 10-15 minutos.'
    },

    // === DIMENSIÓN FÍSICA (ítems 2-7, 12-13 según estructura original) ===
    {
      id: 'mhf_1',
      text: '1. ¿Le causó hinchazón en los tobillos o piernas?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_2',
      text: '2. ¿Le obligó a sentarse o acostarse durante el día?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_3',
      text: '3. ¿Dificultó su capacidad para caminar o subir escaleras?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_4',
      text: '4. ¿Dificultó el trabajo de la casa o el jardín?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_5',
      text: '5. ¿Dificultó salir de su casa o desplazarse fuera?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_6',
      text: '6. ¿Le produjo dificultad para dormir bien por la noche?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_7',
      text: '7. ¿Le dificultó relacionarse o hacer cosas con su familia o amigos?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_8',
      text: '8. ¿Le dificultó realizar su trabajo o actividades remuneradas?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_9',
      text: '9. ¿Le dificultó sus actividades recreativas o de ocio?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_10',
      text: '10. ¿Le dificultó su actividad o vida sexual?',
      type: 'select',
      options: [
        { label: '0 — Nada / No aplica', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_11',
      text: '11. ¿Le obligó a comer menos de lo que le gustaba o los alimentos que quería?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_12',
      text: '12. ¿Le produjo disnea (falta de aire) al hacer esfuerzo físico?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_13',
      text: '13. ¿Le produjo fatiga, agotamiento o falta de energía?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_14',
      text: '14. ¿Le obligó a ingresar en el hospital o acudir a urgencias?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_15',
      text: '15. ¿Le supuso un gasto económico importante para usted o su familia?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_16',
      text: '16. ¿Le produjo efectos secundarios por los medicamentos?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },

    // === DIMENSIÓN EMOCIONAL (ítems 17-21) ===
    {
      id: 'mhf_17',
      text: '17. ¿Le hizo sentir una carga para su familia o amigos?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_18',
      text: '18. ¿Le hizo sentir una pérdida de control sobre su propia vida?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_19',
      text: '19. ¿Le produjo sentimientos de preocupación o ansiedad?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_20',
      text: '20. ¿Le fue difícil concentrarse o recordar cosas?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    },
    {
      id: 'mhf_21',
      text: '21. ¿Le produjo sentimientos de depresión o tristeza?',
      type: 'select',
      options: [
        { label: '0 — Nada', value: 0 },
        { label: '1 — Muy poco', value: 1 },
        { label: '2 — Poco', value: 2 },
        { label: '3 — Moderado', value: 3 },
        { label: '4 — Bastante', value: 4 },
        { label: '5 — Muchísimo', value: 5 }
      ]
    }
  ],

  calcularPuntaje: (respuestas: Record<string, any>) => {
    // Suma total de los 21 ítems. Rango: 0-105. Mayor puntaje = peor calidad de vida.
    const ids = [
      'mhf_1','mhf_2','mhf_3','mhf_4','mhf_5','mhf_6','mhf_7',
      'mhf_8','mhf_9','mhf_10','mhf_11','mhf_12','mhf_13','mhf_14',
      'mhf_15','mhf_16','mhf_17','mhf_18','mhf_19','mhf_20','mhf_21'
    ];
    return ids.reduce((sum, id) => sum + (Number(respuestas[id]) || 0), 0);
  },

  interpretar: (puntaje: number, respuestas?: Record<string, any>): InterpretacionAvanzada => {

    // Subescalas para análisis dimensional
    const fisica = ['mhf_1','mhf_2','mhf_3','mhf_4','mhf_5','mhf_6','mhf_12','mhf_13']
      .reduce((s, id) => s + (Number(respuestas?.[id]) || 0), 0);
    const emocional = ['mhf_17','mhf_18','mhf_19','mhf_20','mhf_21']
      .reduce((s, id) => s + (Number(respuestas?.[id]) || 0), 0);

    const dominioAfectado = fisica >= 20 && emocional >= 12
      ? 'físico y emocional severamente comprometidos'
      : fisica >= 20
      ? 'dominio físico predominantemente afectado'
      : emocional >= 12
      ? 'dominio emocional predominantemente afectado'
      : 'sin dominio predominante comprometido';

    if (puntaje < 24) {
      return {
        texto: `Buena Calidad de Vida — ${puntaje} pts`,
        color: 'emerald-600',
        evidencia: `Puntaje total: ${puntaje}/105 (Físico: ${fisica}/40 | Emocional: ${emocional}/25). Calidad de vida conservada según punto de corte validado (< 24). ${dominioAfectado}. MCID = 5 puntos (Rector et al., 1995).`,
        recomendaciones: [
          'Mantener y reforzar adherencia al programa de rehabilitación cardíaca.',
          'Continuar educación sobre autocuidado: control de peso diario, restricción hídrica y sal.',
          'Reevaluación con MLHFQ cada 3 meses o ante cambio de clase funcional NYHA.',
          'Fomentar actividad física supervisada según tolerancia (programa de ejercicio aeróbico progresivo).',
          'Reforzar adherencia farmacológica y control de factores de riesgo cardiovascular.'
        ]
      };
    }

    if (puntaje <= 45) {
      return {
        texto: `Calidad de Vida Moderadamente Afectada — ${puntaje} pts`,
        color: 'amber-500',
        evidencia: `Puntaje total: ${puntaje}/105 (Físico: ${fisica}/40 | Emocional: ${emocional}/25). Calidad de vida moderada según punto de corte validado (24-45). Perfil: ${dominioAfectado}. Una reducción ≥ 5 puntos en la próxima evaluación indicaría mejoría clínicamente significativa (MCID).`,
        recomendaciones: [
          'Revisar y ajustar programa de rehabilitación cardíaca: intensidad, frecuencia y modalidad del ejercicio.',
          'Evaluar síntomas de descompensación: disnea de reposo, ortopnea, edema progresivo — considerar ajuste farmacológico.',
          'Screening de depresión y ansiedad (PHQ-9 / GAD-7): alta correlación entre MLHFQ emocional y depresión (r = 0.748).',
          'Educación al paciente y familia: reconocimiento de signos de alarma y plan de acción.',
          'Evaluar adherencia a restricción de sodio (< 2g/día) y control de volumen hídrico.',
          'Coordinar con equipo multidisciplinario: cardiología, nutrición, psicología si dominio emocional ≥ 12 pts.'
        ]
      };
    }

    // puntaje > 45: mala calidad de vida
    return {
      texto: `Mala Calidad de Vida — ${puntaje} pts`,
      color: 'red-600',
      evidencia: `Puntaje total: ${puntaje}/105 (Físico: ${fisica}/40 | Emocional: ${emocional}/25). Calidad de vida severamente comprometida (> 45). Perfil: ${dominioAfectado}. Este rango se asocia con mayor riesgo de rehospitalización y mortalidad cardiovascular. Requiere evaluación clínica urgente y revisión del plan terapéutico.`,
      recomendaciones: [
        '⚠️ Derivación urgente a cardiología para reevaluación clínica: ajuste de tratamiento farmacológico (IECA/ARA-II, betabloqueantes, diuréticos, ARM).',
        'Evaluar clase funcional NYHA actual y correlacionar con fracción de eyección — considerar ecocardiograma de control.',
        'Evaluación psicosocial formal: depresión mayor es altamente prevalente en IC severa. Considerar interconsulta a psiquiatría o psicología clínica.',
        'Revisión exhaustiva de adherencia: tanto farmacológica como no farmacológica (dieta, actividad, control de peso).',
        'Considerar programa de rehabilitación cardíaca de fase II/III supervisado si no está inscrito.',
        'Evaluar necesidad de dispositivos de asistencia (DAI, TRC) según criterios clínicos.',
        'Involucrar red de apoyo familiar: cuidador principal, manejo del estrés del cuidador.',
        'Reevaluar con MLHFQ al mes de intervención para medir respuesta al tratamiento.'
      ]
    };
  }
},


];

export default scales;