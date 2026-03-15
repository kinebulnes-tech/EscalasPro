export interface Question {
  id: string;
  text: string;
  type: 'select' | 'number' | 'radio' | 'checkbox' | 'plugin';
  componente?: 'CRONOMETRO' | 'TEMPORIZADOR';
  options?: Array<{ label: string; value: number }>;
  min?: number;
  max?: number;
}

export interface InterpretacionAvanzada {
  texto: string;
  recomendaciones: string[];
  color?: string;    // <--- Cambiado a string para aceptar 'text-blue-600', etc.
  evidencia?: string; // <--- AÑADE ESTA LÍNEA para que acepte el dato estadístico
}

export interface Scale {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  preguntas: Question[];
  calcularPuntaje: (respuestas: Record<string, number>) => number;
  interpretar: (puntaje: number) => string | InterpretacionAvanzada;
  // Rigor científico
  bibliografia?: string;
  evidenciaClinica?: string;
  referenciaUrl?: string;
}

export const scales: Scale[] = [
  // ==========================================
  // KINESIOLOGÍA
  // ==========================================
  {
    id: 'barthel',
    nombre: 'Índice de Barthel',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de la capacidad funcional para actividades básicas de la vida diaria',
    preguntas: [
      { id: 'comer', text: 'Comer', type: 'select', options: [{ label: 'Independiente', value: 10 }, { label: 'Necesita ayuda', value: 5 }, { label: 'Dependiente', value: 0 }] },
      { id: 'banarse', text: 'Bañarse', type: 'select', options: [{ label: 'Independiente', value: 5 }, { label: 'Dependiente', value: 0 }] },
      { id: 'vestirse', text: 'Vestirse', type: 'select', options: [{ label: 'Independiente', value: 10 }, { label: 'Necesita ayuda', value: 5 }, { label: 'Dependiente', value: 0 }] },
      { id: 'arreglarse', text: 'Arreglarse', type: 'select', options: [{ label: 'Independiente', value: 5 }, { label: 'Dependiente', value: 0 }] },
      { id: 'deposiciones', text: 'Deposiciones', type: 'select', options: [{ label: 'Continente', value: 10 }, { label: 'Accidente ocasional', value: 5 }, { label: 'Incontinente', value: 0 }] },
      { id: 'miccion', text: 'Micción', type: 'select', options: [{ label: 'Continente', value: 10 }, { label: 'Accidente ocasional', value: 5 }, { label: 'Incontinente', value: 0 }] },
      { id: 'retrete', text: 'Usar el retrete', type: 'select', options: [{ label: 'Independiente', value: 10 }, { label: 'Necesita ayuda', value: 5 }, { label: 'Dependiente', value: 0 }] },
      { id: 'trasladarse', text: 'Trasladarse sillón/cama', type: 'select', options: [{ label: 'Independiente', value: 15 }, { label: 'Mínima ayuda', value: 10 }, { label: 'Gran ayuda', value: 5 }, { label: 'Dependiente', value: 0 }] },
      { id: 'deambular', text: 'Deambular', type: 'select', options: [{ label: 'Independiente', value: 15 }, { label: 'Necesita ayuda', value: 10 }, { label: 'Independiente en silla de ruedas', value: 5 }, { label: 'Inmóvil', value: 0 }] },
      { id: 'escalones', text: 'Subir y bajar escaleras', type: 'select', options: [{ label: 'Independiente', value: 10 }, { label: 'Necesita ayuda', value: 5 }, { label: 'Dependiente', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 100) return { texto: 'Independiente total', recomendaciones: ['Fomentar estilo de vida activo', 'Mantener rutinas de ejercicio preventivo'] };
      if (puntaje >= 60) return { texto: 'Dependencia leve', recomendaciones: ['Terapia física para fortalecimiento', 'Asistencia ocasional en ABVD específicas', 'Evaluación de seguridad en el hogar'] };
      if (puntaje >= 40) return { texto: 'Dependencia moderada', recomendaciones: ['Rehabilitación multidisciplinaria', 'Entrenamiento a cuidadores', 'Uso de ayudas técnicas para la marcha o transferencias'] };
      if (puntaje >= 20) return { texto: 'Dependencia severa', recomendaciones: ['Asistencia constante en ABVD', 'Prevención de úlceras por presión', 'Manejo de incontinencia'] };
      return { texto: 'Dependencia total', recomendaciones: ['Cuidados de enfermería continuos', 'Cambios posturales estrictos', 'Soporte integral al cuidador principal'] };
    }
  },
  {
    id: 'presion_manual',
    nombre: 'Escala de Presión Manual (Dinamometría)',
    categoria: 'kinesiologia',
    descripcion: 'Mide la fuerza muscular de miembros superiores en kg con dinamómetro.',
    preguntas: [
      { id: 'fuerza_kg', text: 'Ingrese la fuerza máxima obtenida en kilogramos (kg)', type: 'number' }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.fuerza_kg) || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos ingresados', recomendaciones: [] };
      if (puntaje < 16) return { texto: 'Fuerza baja - Riesgo de sarcopenia en mujeres (Corte EWGSOP2 < 16kg)', recomendaciones: ['Derivación a nutrición clínica (evaluar ingesta proteica)', 'Programa de ejercicios de resistencia progresiva (PRT)', 'Evaluación de riesgo de caídas', 'Descartar causas secundarias de debilidad'] };
      if (puntaje < 27) return { texto: 'Fuerza baja - Riesgo de sarcopenia en hombres (Corte EWGSOP2 < 27kg) / Rango normal para mujeres', recomendaciones: ['Para hombres: Iniciar protocolo de prevención de sarcopenia (ejercicio + nutrición)', 'Para mujeres: Mantener actividad física regular'] };
      return { texto: 'Fuerza muscular dentro de parámetros funcionales normales', recomendaciones: ['Mantener entrenamiento de fuerza 2-3 veces por semana', 'Asegurar ingesta proteica adecuada'] };
    }
  },
  {
    id: 'sit_to_stand',
    nombre: 'Test Sit to Stand (1 minuto)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación funcional de fuerza y resistencia de miembros inferiores.',
    preguntas: [
      { id: 'cronometro', text: 'Apoyo visual: Controle el minuto exacto', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'repeticiones', text: 'Número de repeticiones completadas en 1 minuto', type: 'number' }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.repeticiones) || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Prueba no realizada o 0 repeticiones', recomendaciones: ['Evaluar barreras físicas o cognitivas para la prueba'] };
      if (puntaje < 15) return { texto: 'Bajo rendimiento - Alto riesgo de caídas y fragilidad', recomendaciones: ['Programa supervisado de fortalecimiento de tren inferior', 'Entrenamiento de equilibrio y propiocepción', 'Evaluación integral del riesgo de caídas en el hogar'] };
      if (puntaje <= 30) return { texto: 'Rendimiento moderado/promedio', recomendaciones: ['Incorporar sentadillas y ejercicios funcionales en rutina diaria', 'Fomentar caminata diaria'] };
      return { texto: 'Alto rendimiento funcional', recomendaciones: ['Mantener nivel actual de actividad física', 'Fomentar independencia funcional'] };
    }
  },
  {
    id: 'fim',
    nombre: 'Medida de Independencia Funcional (FIM)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de independencia funcional en actividades de la vida diaria',
    preguntas: [
      { id: 'alimentacion', text: 'Alimentación', type: 'select', options: [{ label: 'Independencia completa', value: 7 }, { label: 'Independencia modificada', value: 6 }, { label: 'Supervisión', value: 5 }, { label: 'Asistencia mínima', value: 4 }, { label: 'Asistencia moderada', value: 3 }, { label: 'Asistencia máxima', value: 2 }, { label: 'Dependencia total', value: 1 }] },
      { id: 'aseo', text: 'Aseo personal', type: 'select', options: [{ label: 'Independencia completa', value: 7 }, { label: 'Independencia modificada', value: 6 }, { label: 'Supervisión', value: 5 }, { label: 'Asistencia mínima', value: 4 }, { label: 'Asistencia moderada', value: 3 }, { label: 'Asistencia máxima', value: 2 }, { label: 'Dependencia total', value: 1 }] },
      { id: 'bano', text: 'Baño', type: 'select', options: [{ label: 'Independencia completa', value: 7 }, { label: 'Independencia modificada', value: 6 }, { label: 'Supervisión', value: 5 }, { label: 'Asistencia mínima', value: 4 }, { label: 'Asistencia moderada', value: 3 }, { label: 'Asistencia máxima', value: 2 }, { label: 'Dependencia total', value: 1 }] },
      { id: 'vestido_superior', text: 'Vestido mitad superior', type: 'select', options: [{ label: 'Independencia completa', value: 7 }, { label: 'Independencia modificada', value: 6 }, { label: 'Supervisión', value: 5 }, { label: 'Asistencia mínima', value: 4 }, { label: 'Asistencia moderada', value: 3 }, { label: 'Asistencia máxima', value: 2 }, { label: 'Dependencia total', value: 1 }] },
      { id: 'vestido_inferior', text: 'Vestido mitad inferior', type: 'select', options: [{ label: 'Independencia completa', value: 7 }, { label: 'Independencia modificada', value: 6 }, { label: 'Supervisión', value: 5 }, { label: 'Asistencia mínima', value: 4 }, { label: 'Asistencia moderada', value: 3 }, { label: 'Asistencia máxima', value: 2 }, { label: 'Dependencia total', value: 1 }] },
      { id: 'wc', text: 'Uso del inodoro', type: 'select', options: [{ label: 'Independencia completa', value: 7 }, { label: 'Independencia modificada', value: 6 }, { label: 'Supervisión', value: 5 }, { label: 'Asistencia mínima', value: 4 }, { label: 'Asistencia moderada', value: 3 }, { label: 'Asistencia máxima', value: 2 }, { label: 'Dependencia total', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 36) return { texto: 'Independencia completa o modificada', recomendaciones: ['Alta domiciliaria segura', 'Prescribir ayudas técnicas menores si es necesario'] };
      if (puntaje >= 24) return { texto: 'Supervisión o asistencia mínima', recomendaciones: ['Terapia ocupacional para reentrenamiento de ABVD', 'Entrenamiento familiar para supervisión segura'] };
      if (puntaje >= 12) return { texto: 'Asistencia moderada a máxima', recomendaciones: ['Programa intensivo de rehabilitación neurológica o motora', 'Modificaciones mayores en el hogar (barras, silla de ducha)'] };
      return { texto: 'Dependencia total o casi total', recomendaciones: ['Soporte total de enfermería/cuidador', 'Prevención integral del síndrome de inmovilidad (UPP, TVP)', 'Evaluación de cuidados paliativos o de confort si aplica'] };
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
  descripcion: 'Evaluación de la movilidad funcional, el equilibrio dinámico y el riesgo de caídas.',
  
  // --- RIGOR CIENTÍFICO ---
  bibliografia: "Podsiadlo D, Richardson S. The timed 'Up & Go': a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc. 1991 Feb;39(2):142-8.",
  referenciaUrl: "https://pubmed.ncbi.nlm.nih.gov/1991915/",
  evidenciaClinica: "Un tiempo > 13.5 segundos es el punto de corte (cut-off) validado para predecir caídas en adultos mayores independientes, con una precisión diagnóstica del 80%.",

  preguntas: [
    { 
      id: 'tiempo', 
      text: 'Inicie el cronómetro al despegar de la silla y deténgalo al volver a sentarse:', 
      type: 'plugin', 
      componente: 'CRONOMETRO' 
    }
  ],

  calcularPuntaje: (respuestas) => Number(respuestas.tiempo) || 0,

  interpretar: (puntaje) => {
    if (puntaje === 0) return { texto: 'Prueba no realizada o sin datos', color: 'text-gray-400', recomendaciones: [] };
    
    // < 10 segundos: Independencia Total
    if (puntaje < 10) return { 
      texto: 'Movilidad Normal - Bajo Riesgo', 
      color: 'text-emerald-600',
      evidencia: 'Puntaje asociado a independencia total en actividades básicas de la vida diaria (ABVD).',
      recomendaciones: ['Mantener actividad física regular', 'Re-evaluación en 6 meses'] 
    };

    // 10 - 13.5 segundos: Rango de Vigilancia
    if (puntaje <= 13.5) return { 
      texto: 'Movilidad Aceptable - Riesgo Leve', 
      color: 'text-blue-600',
      evidencia: 'Se encuentra dentro del promedio para adultos mayores sanos, pero cercano al umbral de riesgo.',
      recomendaciones: ['Iniciar ejercicios de equilibrio preventivos', 'Evaluar calzado habitual'] 
    };

    // 13.6 - 20 segundos: Riesgo de Caídas Presente
    if (puntaje <= 20) return { 
      texto: 'Riesgo de Caídas - Fragilidad Moderada', 
      color: 'text-amber-600',
      evidencia: 'Según Podsiadlo (1991), tiempos > 13.5s predicen caídas en adultos mayores comunitarios con alta sensibilidad.',
      recomendaciones: ['Programa de entrenamiento de fuerza (cuádriceps)', 'Evaluar necesidad de bastón simple', 'Revisar polifarmacia'] 
    };

    // > 20 segundos: Limitación funcional severa
    return { 
      texto: 'Alto Riesgo de Caídas - Dependencia Funcional', 
      color: 'text-red-600',
      evidencia: 'Tiempos > 20s indican una limitación funcional severa y una alta probabilidad de requerir asistencia técnica.',
      recomendaciones: ['Prescripción inmediata de ayuda técnica (Andador/Bastones)', 'Intervención de Terapia Ocupacional para adaptaciones en el hogar', 'Supervisión constante en traslados'] 
    };
  }
},
  {
    id: 'six_minute_walk',
    nombre: 'Test de Caminata de 6 Minutos',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de capacidad funcional cardiopulmonar',
    preguntas: [
      { id: 'cronometro', text: 'Apoyo visual: Monitorear los 6 minutos', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'distancia', text: 'Distancia recorrida en 6 minutos (metros)', type: 'number', min: 0, max: 1000 },
      { id: 'edad', text: 'Edad del paciente', type: 'number', min: 18, max: 120 }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.distancia) || 0,
    interpretar: (puntaje) => {
      if (puntaje >= 500) return { texto: 'Capacidad funcional excelente', recomendaciones: ['Apto para programas de ejercicio aeróbico de moderada/alta intensidad'] };
      if (puntaje >= 400) return { texto: 'Capacidad funcional buena', recomendaciones: ['Mantener acondicionamiento aeróbico general', 'Riesgo perioperatorio bajo'] };
      if (puntaje >= 300) return { texto: 'Capacidad funcional moderada', recomendaciones: ['Derivar a rehabilitación cardiopulmonar fase II/III', 'Optimizar tratamiento médico base (Ej. inhaladores, antihipertensivos)'] };
      if (puntaje >= 150) return { texto: 'Capacidad funcional limitada', recomendaciones: ['Rehabilitación cardiopulmonar supervisada', 'Evaluación de necesidad de oxígeno domiciliario', 'Alto riesgo de morbimortalidad a corto plazo'] };
      return { texto: 'Capacidad funcional severamente limitada', recomendaciones: ['Evaluación médica urgente (Cardiología/Broncopulmonar)', 'Programa de conservación de energía', 'Asistencia total en ABVD que requieran esfuerzo'] };
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
    id: 'berg',
    nombre: 'Escala de Equilibrio de Berg',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del equilibrio funcional en adultos mayores',
    preguntas: [
      { id: 'cronometro', text: 'Apoyo visual: Para ítems que requieren tiempo', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'sedente_bipedo', text: 'Sedente a bipedestación', type: 'select', options: [{ label: 'Capaz sin usar las manos', value: 4 }, { label: 'Independiente usando las manos', value: 3 }, { label: 'Varios intentos', value: 2 }, { label: 'Mínima ayuda', value: 1 }, { label: 'Ayuda moderada/máxima', value: 0 }] },
      { id: 'bipedo_sin_apoyo', text: 'Bipedestación sin apoyo', type: 'select', options: [{ label: '2 minutos seguro', value: 4 }, { label: '2 minutos con supervisión', value: 3 }, { label: '30 segundos sin apoyo', value: 2 }, { label: 'Varios intentos para 30s', value: 1 }, { label: 'Incapaz 30s', value: 0 }] },
      { id: 'sentado_sin_apoyo', text: 'Sedente sin apoyo', type: 'select', options: [{ label: '2 minutos seguro', value: 4 }, { label: '2 minutos supervisión', value: 3 }, { label: '30 segundos', value: 2 }, { label: '10 segundos', value: 1 }, { label: 'Incapaz 10s', value: 0 }] },
      { id: 'bipedo_sedente', text: 'Bipedestación a sedente', type: 'select', options: [{ label: 'Seguro uso mínimo manos', value: 4 }, { label: 'Controla con manos', value: 3 }, { label: 'Usa piernas contra silla', value: 2 }, { label: 'Descenso descontrolado', value: 1 }, { label: 'Necesita ayuda', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.entries(respuestas).reduce((sum, [key, val]) => key === 'cronometro' ? sum : sum + Number(val), 0),
    interpretar: (puntaje) => {
      if (puntaje >= 45) return { texto: 'Bajo riesgo de caídas - Independiente', recomendaciones: ['Mantener actividad física', 'Ejercicios de equilibrio dinámico preventivos'] };
      if (puntaje >= 36) return { texto: 'Riesgo moderado de caídas', recomendaciones: ['Programa formal de entrenamiento de equilibrio', 'Uso de bastón en exteriores', 'Revisar calzado y entorno domiciliario'] };
      if (puntaje >= 21) return { texto: 'Alto riesgo de caídas - Requiere asistencia', recomendaciones: ['Uso estricto de andador', 'Asistencia para transferencias', 'Terapia física para control postural', 'Ajuste de medicamentos (psicofármacos)'] };
      return { texto: 'Muy alto riesgo de caídas - Requiere ayuda permanente', recomendaciones: ['Uso de silla de ruedas para desplazamientos', 'Transferencias asistidas por 1 o 2 personas', 'Prevención del síndrome post-caída'] };
    }
  },
  {
    id: 'minibestest',
    nombre: 'MiniBESTest',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación breve del equilibrio en 4 sistemas de control',
    preguntas: [
      { id: 'anticipatorio', text: 'Control postural anticipatorio', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] },
      { id: 'reactivo', text: 'Ajustes posturales reactivos', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] },
      { id: 'sensorial', text: 'Orientación sensorial', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] },
      { id: 'dinamico', text: 'Estabilidad en marcha', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 7) return { texto: 'Bajo riesgo de caídas', recomendaciones: ['Sistemas de equilibrio funcionales', 'Recomendaciones preventivas generales'] };
      if (puntaje >= 5) return { texto: 'Riesgo moderado de caídas', recomendaciones: ['Identificar sistema deficitario (ej. reactivo vs sensorial) y entrenar específicamente', 'Terapia propioceptiva'] };
      return { texto: 'Alto riesgo de caídas', recomendaciones: ['Asistencia técnica para la marcha', 'Entrenamiento de reacciones de enderezamiento y paso compensatorio', 'Educación familiar en prevención de caídas'] };
    }
  },
  {
    id: 'tinetti',
    nombre: 'Escala de Tinetti POMA',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del equilibrio y marcha',
    preguntas: [
      { id: 'equilibrio_sentado', text: 'Equilibrio sentado', type: 'select', options: [{ label: 'Estable', value: 1 }, { label: 'Inestable', value: 0 }] },
      { id: 'levantarse', text: 'Levantarse', type: 'select', options: [{ label: 'Capaz sin usar manos', value: 2 }, { label: 'Capaz usando manos', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'intentos_levantarse', text: 'Intentos de levantarse', type: 'select', options: [{ label: 'Capaz al primer intento', value: 1 }, { label: 'Necesita más de un intento', value: 0 }] },
      { id: 'equilibrio_inmediato', text: 'Equilibrio inmediato de pie (primeros 5s)', type: 'select', options: [{ label: 'Estable', value: 1 }, { label: 'Inestable', value: 0 }] },
      { id: 'equilibrio_pie', text: 'Equilibrio de pie', type: 'select', options: [{ label: 'Estable', value: 2 }, { label: 'Inestable pero se mantiene', value: 1 }, { label: 'Inestable', value: 0 }] },
      { id: 'inicio_marcha', text: 'Inicio de la marcha', type: 'select', options: [{ label: 'Comienza inmediatamente', value: 1 }, { label: 'Varios intentos', value: 0 }] },
      { id: 'longitud_paso', text: 'Longitud y altura del paso', type: 'select', options: [{ label: 'Adecuada', value: 1 }, { label: 'Inadecuada', value: 0 }] },
      { id: 'simetria_paso', text: 'Simetría del paso', type: 'select', options: [{ label: 'Simétrico', value: 1 }, { label: 'Asimétrico', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 25) return { texto: 'Bajo riesgo de caídas', recomendaciones: ['Movilidad segura', 'Revisión anual rutinaria'] };
      if (puntaje >= 19) return { texto: 'Riesgo moderado de caídas', recomendaciones: ['Intervención enfocada en la fase alterada (equilibrio vs marcha)', 'Kinesiología profiláctica 2 veces por semana', 'Considerar bastón de apoyo'] };
      return { texto: 'Alto riesgo de caídas', recomendaciones: ['Riesgo inminente (>50% prob. de caída en el año)', 'Prescripción de andador', 'Rehabilitación geriátrica intensiva', 'Eliminación de alfombras y obstáculos en casa'] };
    }
  },
  {
    id: 'mrc',
    nombre: 'Escala de Fuerza Muscular MRC',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de fuerza muscular según Medical Research Council',
    preguntas: [
      { id: 'fuerza', text: 'Fuerza muscular observada', type: 'select', options: [{ label: '5 - Fuerza normal', value: 5 }, { label: '4 - Movimiento contra gravedad y resistencia', value: 4 }, { label: '3 - Movimiento contra gravedad', value: 3 }, { label: '2 - Movimiento con gravedad eliminada', value: 2 }, { label: '1 - Contracción visible sin movimiento', value: 1 }, { label: '0 - Sin contracción', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.fuerza || 0,
    interpretar: (puntaje) => {
      if (puntaje === 5) return { texto: 'Fuerza muscular normal', recomendaciones: ['Mantener trofismo y resistencia'] };
      if (puntaje === 4) return { texto: 'Fuerza buena - Movimiento contra gravedad y resistencia', recomendaciones: ['Ejercicios de sobrecarga progresiva', 'Uso de bandas elásticas o pesas libres'] };
      if (puntaje === 3) return { texto: 'Fuerza aceptable - Movimiento contra gravedad completo', recomendaciones: ['Entrenamiento de fuerza activa libre', 'Fomentar funcionalidad en ABVD sin peso extra', 'Evitar fatiga muscular excesiva'] };
      if (puntaje === 2) return { texto: 'Fuerza pobre - Movimiento solo con gravedad eliminada', recomendaciones: ['Ejercicios activo-asistidos', 'Terapia en suspensión o hidroterapia', 'Prevención de contracturas'] };
      if (puntaje === 1) return { texto: 'Fuerza vestigial - Contracción palpable sin movimiento', recomendaciones: ['Electroestimulación neuromuscular (NMES)', 'Facilitación neuromuscular propioceptiva (FNP)', 'Biofeedback'] };
      return { texto: 'Sin contracción muscular', recomendaciones: ['Movilización pasiva estricta para prevenir rigidez y anquilosis', 'Posicionamiento con órtesis', 'Evaluar daño nervioso periférico/central'] };
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
    nombre: 'Escala Visual Analógica del Dolor (EVA)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación subjetiva de la intensidad del dolor',
    preguntas: [
      { id: 'intensidad', text: 'Intensidad del dolor (0 = sin dolor, 10 = dolor máximo)', type: 'number', min: 0, max: 10 }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.intensidad) || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin dolor', recomendaciones: ['Mantener plan de cuidados actuales'] };
      if (puntaje <= 3) return { texto: 'Dolor leve', recomendaciones: ['Analgesia de escalón 1 (Paracetamol, AINEs tópicos)', 'Fisioterapia analgésica (TENS, Termoterapia)', 'Reevaluar en 2 horas'] };
      if (puntaje <= 6) return { texto: 'Dolor moderado', recomendaciones: ['Analgesia de escalón 2 (AINEs VO/IV, opioides débiles)', 'Limitar movilización activa de la zona afectada', 'Reevaluar a los 60 minutos post-analgesia'] };
      return { texto: 'Dolor severo', recomendaciones: ['Analgesia de escalón 3 (Opioides fuertes, derivación médica)', 'Reposo de la zona afectada', 'Buscar signos de alarma (ej. compromiso vascular/nervioso)', 'Reevaluar a los 30 minutos'] };
    }
  },
  {
    id: 'escala_numerica_dolor',
    nombre: 'Escala Numérica del Dolor',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación numérica de la intensidad del dolor',
    preguntas: [
      { id: 'dolor', text: 'Nivel de dolor del 0 al 10', type: 'number', min: 0, max: 10 }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.dolor) || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin dolor', recomendaciones: [] };
      if (puntaje <= 3) return { texto: 'Dolor leve', recomendaciones: ['Medidas físicas de confort', 'AINEs o Paracetamol según protocolo'] };
      if (puntaje <= 6) return { texto: 'Dolor moderado', recomendaciones: ['Escalón 2 de la OMS', 'Modificar o posponer terapia física extenuante'] };
      if (puntaje <= 8) return { texto: 'Dolor severo', recomendaciones: ['Escalón 3 de la OMS (rescate con opioides)', 'Reevaluación médica inmediata'] };
      return { texto: 'Dolor insoportable', recomendaciones: ['Analgesia endovenosa urgente', 'Considerar PCA (Analgesia Controlada por el Paciente)', 'Manejo multidisciplinario del dolor agudo'] };
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
    id: 'ashworth',
    nombre: 'Escala de Ashworth Modificada',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de espasticidad muscular',
    preguntas: [
      { id: 'espasticidad', text: 'Grado de espasticidad', type: 'select', options: [{ label: '0 - Sin aumento del tono', value: 0 }, { label: '1 - Leve aumento', value: 1 }, { label: '1+ - Leve con resistencia mínima', value: 1.5 }, { label: '2 - Aumento marcado', value: 2 }, { label: '3 - Aumento considerable', value: 3 }, { label: '4 - Rígido', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.espasticidad || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin espasticidad', recomendaciones: ['Tono muscular normal. Fomentar rangos articulares completos'] };
      if (puntaje <= 1.5) return { texto: 'Espasticidad leve', recomendaciones: ['Elongación muscular sostenida', 'Carga de peso en extremidad afecta', 'Ortesis nocturnas para prevención de acortamientos'] };
      if (puntaje === 2) return { texto: 'Espasticidad moderada', recomendaciones: ['Férulas progresivas', 'Farmacoterapia oral (ej. Baclofeno, Tizanidina)', 'Terapia térmica previa a elongación'] };
      if (puntaje === 3) return { texto: 'Espasticidad considerable', recomendaciones: ['Evaluación médica para infiltración con Toxina Botulínica', 'Férulas seriadas', 'Terapia física post-infiltración intensiva'] };
      return { texto: 'Espasticidad severa - Rigidez', recomendaciones: ['Alta probabilidad de contractura estructurada', 'Evaluación quirúrgica (tenotomía, bomba de baclofeno intratecal)', 'Manejo del dolor y prevención de UPP por posturas viciosas'] };
    }
  },

  // ==========================================
  // FONOAUDIOLOGÍA
  // ==========================================
  {
    id: 'eat10',
    nombre: 'EAT-10',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de problemas de deglución',
    preguntas: [
      { id: 'problema_peso', text: 'Mi problema de deglución me ha hecho perder peso', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_salir', text: 'Interfiere con salir a comer', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_liquidos', text: 'Tragar líquidos me requiere esfuerzo extra', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_solidos', text: 'Tragar sólidos me requiere esfuerzo extra', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_pastillas', text: 'Tragar pastillas me requiere esfuerzo extra', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_doloroso', text: 'Tragar es doloroso', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_placer', text: 'El placer de comer se ve afectado', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_garganta', text: 'La comida se pega en mi garganta', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_tos', text: 'Toso cuando como', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] },
      { id: 'problema_estresante', text: 'Tragar es estresante', type: 'select', options: [{ label: 'Sin problema', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Considerable', value: 3 }, { label: 'Severo', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje <= 2) return { texto: 'Sin disfagia - Función de deglución normal', recomendaciones: ['Ingesta oral libre sin restricciones'] };
      if (puntaje <= 15) return { texto: 'Disfagia leve', recomendaciones: ['Evaluación clínica formal de la deglución', 'Modificaciones menores en la dieta (ej. volumen por bocado)', 'Evitar dobles consistencias'] };
      if (puntaje <= 25) return { texto: 'Disfagia moderada', recomendaciones: ['Derivación obligatoria a Fonoaudiología', 'Modificación de texturas y uso de espesantes', 'Maniobras posturales (chin tuck)'] };
      return { texto: 'Disfagia severa - Requiere evaluación urgente', recomendaciones: ['Suspender ingesta oral temporalmente (NPO)', 'Evaluación instrumental (FEES o Videofluoroscopia)', 'Considerar vía de alimentación alternativa (SNG/GTT)'] };
    }
  },
  {
    id: 'fils',
    nombre: 'Escala FILS (Food Intake Level Scale)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de la severidad de la disfagia y capacidad de ingesta de alimentos.',
    preguntas: [
      {
        id: 'nivel_ingesta', text: 'Nivel de ingesta', type: 'select', options: [
          { label: 'Nivel 1: Nada por boca. Alimentación alternativa exclusiva.', value: 1 },
          { label: 'Nivel 2: Nada por boca. Deglución solo posible en terapia.', value: 2 },
          { label: 'Nivel 3: Alimentación oral limitada + alternativa.', value: 3 },
          { label: 'Nivel 4: Combinada (oral y alternativa). Oral no es la vía principal.', value: 4 },
          { label: 'Nivel 5: Combinada. Oral en 1 a 2 comidas diarias.', value: 5 },
          { label: 'Nivel 6: Combinada. Oral en 3 comidas, pero usa vía alternativa como suplemento.', value: 6 },
          { label: 'Nivel 7: Vía oral exclusiva. Dieta regular pero con limitaciones en texturas.', value: 7 },
          { label: 'Nivel 8: Vía oral exclusiva. Dieta regular + texturas normales (requiere atención extra).', value: 8 },
          { label: 'Nivel 9: Vía oral exclusiva. Dieta regular sin restricciones, pero con adaptaciones menores.', value: 9 },
          { label: 'Nivel 10: Vía oral normal y sin restricciones.', value: 10 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.nivel_ingesta) || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos ingresados', recomendaciones: [] };
      if (puntaje <= 3) return { texto: 'Niveles 1-3: Ingesta no oral. Riesgo severo (Dependencia alternativa)', recomendaciones: ['Nutrición enteral exclusiva o casi exclusiva', 'Terapia de deglución indirecta (estimulación sensoriomotora oral)', 'Higiene bucal estricta para prevenir neumonía aspirativa'] };
      if (puntaje <= 6) return { texto: 'Niveles 4-6: Ingesta oral y alternativa combinada. Riesgo moderado', recomendaciones: ['Terapia directa de deglución con consistencias seguras', 'Monitoreo estricto del aporte calórico/hídrico', 'Destete progresivo de la sonda enteral según tolerancia'] };
      if (puntaje <= 9) return { texto: 'Niveles 7-9: Ingesta oral exclusiva con modificaciones/precauciones. Riesgo leve', recomendaciones: ['Dieta oral exclusiva con adaptación de texturas (IDDSI)', 'Uso de estrategias compensatorias (postura, volumen)', 'Supervisión durante las comidas principales'] };
      return { texto: 'Nivel 10: Ingesta normal sin restricciones', recomendaciones: ['Dieta libre', 'Alta fonoaudiológica (en área de deglución)'] };
    }
  },
  {
    id: 'mecv_v',
    nombre: 'MECV-V',
    categoria: 'fonoaudiologia',
    descripcion: 'Método de Exploración Clínica Volumen-Viscosidad',
    preguntas: [
      { id: 'nectar_5ml', text: 'Deglución néctar 5ml - Seguridad', type: 'select', options: [{ label: 'Sin alteraciones', value: 0 }, { label: 'Tos/cambio voz', value: 1 }] },
      { id: 'nectar_10ml', text: 'Deglución néctar 10ml - Seguridad', type: 'select', options: [{ label: 'Sin alteraciones', value: 0 }, { label: 'Tos/cambio voz', value: 1 }] },
      { id: 'nectar_20ml', text: 'Deglución néctar 20ml - Seguridad', type: 'select', options: [{ label: 'Sin alteraciones', value: 0 }, { label: 'Tos/cambio voz', value: 1 }] },
      { id: 'eficacia', text: 'Eficacia de la deglución', type: 'select', options: [{ label: 'Sin residuos', value: 0 }, { label: 'Deglución fraccionada', value: 1 }, { label: 'Residuo oral', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Deglución segura y eficaz', recomendaciones: ['Puede iniciar dieta líquida y sólida normal', 'Mantener hidratación estándar'] };
      if (puntaje <= 2) return { texto: 'Alteración leve de la deglución (Falla en eficacia)', recomendaciones: ['Higiene oral post-comidas para eliminar residuos', 'Alternar consistencias (sólido-líquido) para aclarar la vía', 'Comidas fraccionadas y de menor volumen'] };
      if (puntaje <= 4) return { texto: 'Alteración moderada - Problemas de seguridad', recomendaciones: ['Ajuste estricto de la viscosidad de los líquidos (uso de espesantes a néctar/miel)', 'Prohibir líquidos finos libres', 'Maniobra de flexión cervical (chin tuck)'] };
      return { texto: 'Alteración severa - Alto riesgo de aspiración', recomendaciones: ['Suspender vía oral para líquidos y texturas riesgosas', 'Alimentación por sonda nasogástrica', 'Derivar a Videofluoroscopia (VFS) o FEES'] };
    }
  },
  {
    id: 'guss',
    nombre: 'GUSS',
    categoria: 'fonoaudiologia',
    descripcion: 'Gugging Swallowing Screen',
    preguntas: [
      { id: 'vigilancia', text: 'Vigilancia', type: 'select', options: [{ label: 'Alerta >15 min', value: 1 }, { label: 'No cumple', value: 0 }] },
      { id: 'tos_voluntaria', text: 'Tos voluntaria o aclaramiento', type: 'select', options: [{ label: 'Presente', value: 1 }, { label: 'Ausente', value: 0 }] },
      { id: 'deglutir_saliva', text: 'Deglutir saliva', type: 'select', options: [{ label: 'Exitoso', value: 1 }, { label: 'No exitoso', value: 0 }] },
      { id: 'deglucion_semiliquido', text: 'Deglución semilíquido', type: 'select', options: [{ label: 'Sin problemas', value: 1 }, { label: 'Con problemas', value: 0 }] },
      { id: 'deglucion_liquido', text: 'Deglución líquido', type: 'select', options: [{ label: 'Sin problemas', value: 1 }, { label: 'Con problemas', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 4) return { texto: 'Bajo riesgo de disfagia (20 pts en GUSS completo)', recomendaciones: ['Dieta normal', 'Dar de beber líquidos de forma estándar', 'Reevaluación si cambia el estado neurológico'] };
      if (puntaje === 3) return { texto: 'Riesgo leve de disfagia (15-19 pts)', recomendaciones: ['Dieta blanda y líquidos espesados (néctar)', 'Supervisión durante las primeras comidas', 'Administrar pastillas trituradas en puré'] };
      if (puntaje === 2) return { texto: 'Riesgo moderado de disfagia (10-14 pts)', recomendaciones: ['Dieta tipo puré (homogénea)', 'Líquidos muy espesados (pudin)', 'Evaluación fonoaudiológica formal', 'Suplementación de hidratación endovenosa/enteral'] };
      return { texto: 'Alto riesgo de disfagia (0-9 pts)', recomendaciones: ['NPO absoluto (Nada por boca)', 'Alimentación por tubo nasogástrico/orogástrico', 'Manejo riguroso de secreciones', 'Interconsulta a SLP/Fonoaudiología urgente'] };
    }
  },
  {
    id: 'doss',
    nombre: 'DOSS',
    categoria: 'fonoaudiologia',
    descripcion: 'Dysphagia Outcome and Severity Scale',
    preguntas: [
      { id: 'nivel', text: 'Nivel de función de deglución', type: 'select', options: [{ label: 'Nivel 7 - Normal', value: 7 }, { label: 'Nivel 6 - Modificada', value: 6 }, { label: 'Nivel 5 - Supervisión leve', value: 5 }, { label: 'Nivel 4 - Intermitente', value: 4 }, { label: 'Nivel 3 - Total mod.', value: 3 }, { label: 'Nivel 2 - Total severa', value: 2 }, { label: 'Nivel 1 - No oral', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.nivel || 0,
    interpretar: (puntaje) => {
      if (puntaje === 7) return { texto: 'Normal', recomendaciones: ['Dieta normal sin restricciones'] };
      if (puntaje === 6) return { texto: 'Independencia funcional modificada', recomendaciones: ['Dieta normal pero requiere tiempo extra', 'Masticación consciente y estrategias compensatorias autónomas'] };
      if (puntaje === 5) return { texto: 'Supervisión leve', recomendaciones: ['Requiere recordatorios para uso de estrategias (ej. toser post-deglución)', 'Evitar consistencias mixtas de alto riesgo'] };
      if (puntaje === 4) return { texto: 'Supervisión intermitente', recomendaciones: ['Una o dos restricciones dietéticas (ej. líquidos espesos)', 'Supervisión fonoaudiológica periódica'] };
      if (puntaje === 3) return { texto: 'Supervisión total (Dietas modificadas)', recomendaciones: ['Dieta estricta en puré y líquidos miel/pudin', 'Asistencia completa para alimentación'] };
      if (puntaje === 2) return { texto: 'Supervisión total (Severas restricciones)', recomendaciones: ['Múltiples restricciones. Alimentación oral solo con fines terapéuticos', 'Nutrición principal por sonda'] };
      return { texto: 'Nutrición no oral', recomendaciones: ['Prohibida la vía oral por riesgo inminente de aspiración', 'Gastrostomía si condición es irreversible o de larga duración'] };
    }
  },
  {
    id: 'fois',
    nombre: 'FOIS',
    categoria: 'fonoaudiologia',
    descripcion: 'Functional Oral Intake Scale',
    preguntas: [
      { id: 'nivel', text: 'Nivel de ingesta oral', type: 'select', options: [{ label: 'Nivel 7 - Total sin restricción', value: 7 }, { label: 'Nivel 6 - Total sin compensación', value: 6 }, { label: 'Nivel 5 - Total con compensación', value: 5 }, { label: 'Nivel 4 - Única consistencia', value: 4 }, { label: 'Nivel 3 - Tubo + oral consistente', value: 3 }, { label: 'Nivel 2 - Tubo + oral mínima', value: 2 }, { label: 'Nivel 1 - Nada oral', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.nivel || 0,
    interpretar: (puntaje) => {
      if (puntaje === 7) return { texto: 'Total vía oral sin restricciones', recomendaciones: ['Alimentación libre'] };
      if (puntaje === 6) return { texto: 'Total vía oral sin compensaciones especiales', recomendaciones: ['Evitar alimentos extremadamente duros o secos preventivamente'] };
      if (puntaje === 5) return { texto: 'Total vía oral con compensaciones', recomendaciones: ['Uso constante de espesantes, maniobras deglutorias o utensilios especiales', 'Preparación especial de alimentos'] };
      if (puntaje === 4) return { texto: 'Vía oral con una consistencia', recomendaciones: ['Monotonía dietética requerida (solo puré o solo néctar)', 'Suplementación calórica oral'] };
      if (puntaje === 3) return { texto: 'Alimentación por tubo con ingesta oral consistente', recomendaciones: ['Iniciar protocolo de destete de sonda', 'Aumentar progresivamente el porcentaje de calorías vía oral'] };
      if (puntaje === 2) return { texto: 'Alimentación por tubo con ingesta oral mínima', recomendaciones: ['Alimentación oral solo recreacional o gustativa (terapia)', 'Higiene oral exhaustiva'] };
      return { texto: 'Nada por vía oral', recomendaciones: ['Nutrición enteral o parenteral exclusiva', 'Tratamiento de secreciones (aspiración/fármacos)'] };
    }
  },
  {
    id: 'boston_afasia',
    nombre: 'Examen de Afasia de Boston',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación comprensiva de las capacidades del lenguaje',
    preguntas: [
      { id: 'fluencia', text: 'Fluencia del habla', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] },
      { id: 'comprension_auditiva', text: 'Comprensión auditiva', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] },
      { id: 'repeticion', text: 'Repetición', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] },
      { id: 'denominacion', text: 'Denominación', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 18) return { texto: 'Afasia leve o función normal', recomendaciones: ['Entrenamiento en habilidades de comunicación compleja (discurso narrativo)', 'Estrategias de recuperación de palabras (anomia leve)'] };
      if (puntaje >= 14) return { texto: 'Afasia moderada', recomendaciones: ['Terapia del lenguaje estructurada', 'Uso de claves fonológicas/semánticas', 'Apoyo con comunicación alternativa de baja tecnología (tableros simples)'] };
      if (puntaje >= 10) return { texto: 'Afasia moderadamente severa', recomendaciones: ['Sistemas de Comunicación Aumentativa y Alternativa (SAAC)', 'Entrenamiento a la familia: frases cortas, preguntas de Sí/No', 'Terapia de entonación melódica (si es no fluente)'] };
      return { texto: 'Afasia severa (Afasia Global)', recomendaciones: ['Establecer métodos básicos de comunicación (gestos, pestañeos)', 'Apoyo intensivo a la familia para evitar frustración', 'Uso de imágenes y contexto visual estricto'] };
    }
  },
  {
    id: 'token_test',
    nombre: 'Token Test',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de comprensión auditiva verbal',
    preguntas: [
      { id: 'parte1', text: 'Parte 1 - Comandos simples', type: 'number', min: 0, max: 10 },
      { id: 'parte2', text: 'Parte 2 - Comandos con dos elementos', type: 'number', min: 0, max: 10 },
      { id: 'parte3', text: 'Parte 3 - Comandos con modificadores', type: 'number', min: 0, max: 10 },
      { id: 'parte4', text: 'Parte 4 - Comandos complejos', type: 'number', min: 0, max: 10 }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 36) return { texto: 'Comprensión auditiva normal', recomendaciones: ['No requiere intervención comprensiva específica'] };
      if (puntaje >= 29) return { texto: 'Alteración leve de comprensión', recomendaciones: ['Hablar a velocidad moderada', 'Asegurar contacto visual al dar instrucciones complejas'] };
      if (puntaje >= 20) return { texto: 'Alteración moderada de comprensión', recomendaciones: ['Simplificar la sintaxis (oraciones cortas)', 'Dar una instrucción a la vez', 'Apoyar el lenguaje oral con gestos y objetos visuales'] };
      return { texto: 'Alteración severa de comprensión auditiva (Sordera verbal o Wernicke grave)', recomendaciones: ['Dependencia absoluta de contexto visual y situacional', 'No sobrecargar con información verbal', 'Terapia orientada al reconocimiento de palabras familiares'] };
    }
  },
  {
    id: 'asha_facs',
    nombre: 'ASHA FACS',
    categoria: 'fonoaudiologia',
    descripcion: 'Functional Assessment of Communication Skills',
    preguntas: [
      { id: 'comunicacion_social', text: 'Comunicación social', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] },
      { id: 'comunicacion_basica', text: 'Necesidades básicas', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] },
      { id: 'lectura', text: 'Lectura/escritura/conceptos', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] },
      { id: 'planificacion', text: 'Planificación diaria', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 24) return { texto: 'Comunicación funcional independiente', recomendaciones: ['Autonomía en decisiones de salud y vida diaria'] };
      if (puntaje >= 20) return { texto: 'Comunicación funcional con ayuda mínima', recomendaciones: ['Fomentar la participación social', 'Proveer tiempo extra para responder'] };
      if (puntaje >= 16) return { texto: 'Comunicación funcional con ayuda moderada', recomendaciones: ['El cuidador debe actuar como "facilitador" comunicativo', 'Estructurar rutinas diarias para predecir necesidades'] };
      return { texto: 'Comunicación funcionalmente limitada', recomendaciones: ['Riesgo de aislamiento social severo', 'Entrenamiento intensivo a cuidadores', 'Uso obligatorio de SAAC para expresar dolor o necesidades urgentes'] };
    }
  },
  {
    id: 'grbas',
    nombre: 'GRBAS',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación perceptual de la voz',
    preguntas: [
      { id: 'g_grado', text: 'G - Grado general', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderado', value: 2 }, { label: '3 - Severo', value: 3 }] },
      { id: 'r_rugosidad', text: 'R - Rugosidad', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderada', value: 2 }, { label: '3 - Severa', value: 3 }] },
      { id: 'b_soplo', text: 'B - Soplo', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderado', value: 2 }, { label: '3 - Severo', value: 3 }] },
      { id: 'a_astenia', text: 'A - Astenia', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderada', value: 2 }, { label: '3 - Severa', value: 3 }] },
      { id: 's_tension', text: 'S - Tensión', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderada', value: 2 }, { label: '3 - Severa', value: 3 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Voz normal', recomendaciones: ['Pautas preventivas de higiene vocal'] };
      if (puntaje <= 4) return { texto: 'Disfonía leve', recomendaciones: ['Hidratación sistémica abundante', 'Reducir el consumo de irritantes (café, tabaco, reflujo)', 'Evitar el carraspeo vocal'] };
      if (puntaje <= 8) return { texto: 'Disfonía moderada', recomendaciones: ['Derivación a Otorrinolaringología (Nasofibroscopía)', 'Terapia vocal fonoaudiológica directa', 'Reposo vocal relativo'] };
      return { texto: 'Disfonía severa', recomendaciones: ['Nasofibroscopía urgente (descartar patología estructural/orgánica o parálisis de cuerda vocal)', 'Reposo vocal absoluto', 'Rehabilitación vocal intensiva'] };
    }
  },
  {
    id: 'vhi',
    nombre: 'Voice Handicap Index (VHI)',
    categoria: 'fonoaudiologia',
    descripcion: 'Índice de Discapacidad Vocal',
    preguntas: [
      { id: 'funcional1', text: 'Mi voz dificulta que me oigan', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] },
      { id: 'funcional2', text: 'Me quedo sin aire', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] },
      { id: 'emocional1', text: 'Me siento tenso al hablar', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] },
      { id: 'fisica1', text: 'Mi voz varía en el día', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje <= 14) return { texto: 'Discapacidad vocal mínima', recomendaciones: ['Control preventivo anual si usa la voz profesionalmente'] };
      if (puntaje <= 28) return { texto: 'Discapacidad vocal leve', recomendaciones: ['Entrenamiento en técnica vocal e higiene vocal', 'Amplificadores de voz si el entorno es ruidoso'] };
      if (puntaje <= 50) return { texto: 'Discapacidad vocal moderada', recomendaciones: ['Impacto psicológico y laboral: iniciar terapia vocal', 'Derivación a psiquiatría/psicología si predomina el componente emocional'] };
      return { texto: 'Discapacidad vocal severa', recomendaciones: ['Licencia médica fonoprotésica', 'Riesgo de pérdida de empleo por disfonía', 'Rehabilitación integral inmediata (ORL, Fonoaudiología, Psicología)'] };
    }
  },

  // ==========================================
  // EVALUACIÓN COGNITIVA
  // ==========================================
  {
    id: 'moca',
    nombre: 'MoCA',
    categoria: 'cognitivas',
    descripcion: 'Montreal Cognitive Assessment',
    preguntas: [
      { id: 'visuoespacial', text: 'Habilidades visuoespaciales/ejecutivas', type: 'number', min: 0, max: 5 },
      { id: 'denominacion', text: 'Denominación', type: 'number', min: 0, max: 3 },
      { id: 'memoria', text: 'Memoria', type: 'number', min: 0, max: 5 },
      { id: 'atencion', text: 'Atención', type: 'number', min: 0, max: 6 },
      { id: 'lenguaje', text: 'Lenguaje', type: 'number', min: 0, max: 3 },
      { id: 'abstraccion', text: 'Abstracción', type: 'number', min: 0, max: 2 },
      { id: 'recuerdo', text: 'Recuerdo diferido', type: 'number', min: 0, max: 5 },
      { id: 'orientacion', text: 'Orientación', type: 'number', min: 0, max: 6 }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 26) return { texto: 'Cognición normal', recomendaciones: ['Fomentar reserva cognitiva con actividades desafiantes (lectura, idiomas)', 'Control de factores de riesgo vascular'] };
      if (puntaje >= 18) return { texto: 'Deterioro cognitivo leve', recomendaciones: ['Derivación a Neurología/Geriatría', 'Revisión exhaustiva de polifarmacia (anticolinérgicos, BZD)', 'Terapia de estimulación cognitiva'] };
      return { texto: 'Deterioro cognitivo moderado a severo', recomendaciones: ['Estudio de demencia (Imágenes, lab, B12, Tiroides)', 'Asesoría a familiares para toma de decisiones financieras/médicas', 'Evaluación de seguridad para vivir solo o conducir'] };
    }
  },
  {
    id: 'mmse',
    nombre: 'Mini Mental State Examination (MMSE)',
    categoria: 'cognitivas',
    descripcion: 'Evaluación breve del estado mental',
    preguntas: [
      { id: 'orientacion_temporal', text: 'Orientación temporal', type: 'number', min: 0, max: 5 },
      { id: 'orientacion_espacial', text: 'Orientación espacial', type: 'number', min: 0, max: 5 },
      { id: 'registro', text: 'Registro de palabras', type: 'number', min: 0, max: 3 },
      { id: 'atencion_calculo', text: 'Atención y cálculo', type: 'number', min: 0, max: 5 },
      { id: 'recuerdo', text: 'Recuerdo', type: 'number', min: 0, max: 3 },
      { id: 'lenguaje', text: 'Lenguaje', type: 'number', min: 0, max: 8 },
      { id: 'construccion', text: 'Construcción', type: 'number', min: 0, max: 1 }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 27) return { texto: 'Cognición normal', recomendaciones: ['Mantener controles de salud rutinarios'] };
      if (puntaje >= 24) return { texto: 'Posible deterioro cognitivo leve (Ajustar por nivel educacional)', recomendaciones: ['Seguimiento longitudinal', 'Considerar aplicar MoCA para mayor sensibilidad ejecutiva'] };
      if (puntaje >= 20) return { texto: 'Demencia leve', recomendaciones: ['Inicio de tratamiento específico (Inhibidores de colinesterasa si aplica)', 'Apoyo domiciliario moderado', 'Estimulación cognitiva'] };
      if (puntaje >= 10) return { texto: 'Demencia moderada', recomendaciones: ['Vigilancia permanente (riesgo de fuga/accidentes)', 'Manejo de síntomas neuropsiquiátricos (agitación, delirio)', 'Apoyo intenso al cuidador (Zarit)'] };
      return { texto: 'Demencia severa', recomendaciones: ['Cuidados paliativos y confort', 'Prevención de UPP y neumonía aspirativa', 'Apoyo total en ABVD'] };
    }
  },
  {
    id: 'clock_test',
    nombre: 'Test del Reloj',
    categoria: 'cognitivas',
    descripcion: 'Evaluación de funciones ejecutivas y visuoespaciales',
    preguntas: [
      { id: 'circulo', text: 'Dibuja círculo cerrado', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'numeros', text: 'Coloca correctamente los 12 números', type: 'select', options: [{ label: 'Todos', value: 2 }, { label: 'Parcial', value: 1 }, { label: 'Incorrectos', value: 0 }] },
      { id: 'agujas', text: 'Coloca las agujas en la hora indicada', type: 'select', options: [{ label: 'Correctas', value: 2 }, { label: 'Parcial', value: 1 }, { label: 'Incorrectas', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 4) return { texto: 'Normal - Sin alteraciones visuoespaciales', recomendaciones: ['Función ejecutiva y parietal derecha conservadas'] };
      if (puntaje >= 2) return { texto: 'Alteración leve', recomendaciones: ['Posible deterioro cognitivo leve', 'Complementar con MoCA o MMSE', 'Evaluar dificultades en el manejo del dinero o agenda'] };
      return { texto: 'Alteración moderada a severa', recomendaciones: ['Alta sospecha de proceso demencial o daño cortical (ej. ACV parietal)', 'Evaluación neuropsicológica exhaustiva', 'Reevaluar seguridad al conducir'] };
    }
  },

  // ==========================================
  // TERAPIA OCUPACIONAL
  // ==========================================
  {
    id: 'nine_hole_peg',
    nombre: 'Nine Hole Peg Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de destreza manual fina',
    preguntas: [
      { id: 't_dominante', text: 'Tiempo mano dominante (cronómetro):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 't_no_dominante', text: 'Tiempo mano no dominante (cronómetro):', type: 'plugin', componente: 'CRONOMETRO' }
    ],
    calcularPuntaje: (r) => Math.round(((Number(r.t_dominante) || 0) + (Number(r.t_no_dominante) || 0)) / 2),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos', recomendaciones: [] };
      if (puntaje <= 20) return { texto: 'Destreza manual normal', recomendaciones: ['Mantener actividades que requieran motricidad fina'] };
      if (puntaje <= 30) return { texto: 'Destreza manual levemente reducida', recomendaciones: ['Ejercicios de pinza fina (monedas, botones)', 'Manejo de prensión trípode'] };
      if (puntaje <= 50) return { texto: 'Destreza manual moderadamente reducida', recomendaciones: ['Modificar botones por velcros en la ropa', 'Engrosadores de mangos para cubiertos y lápices', 'Terapia Ocupacional intensiva'] };
      return { texto: 'Destreza manual severamente reducida', recomendaciones: ['Incapacidad para ABVD finas de forma independiente', 'Proveer asistencia para alimentación y vestuario', 'Órtesis funcionales de apoyo'] };
    }
  },
  {
    id: 'box_block',
    nombre: 'Box and Block Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de destreza manual gruesa',
    preguntas: [
      { id: 'bloques_dominante', text: 'Bloques mano dominante', type: 'number', min: 0, max: 150 },
      { id: 'bloques_no_dominante', text: 'Bloques mano no dominante', type: 'number', min: 0, max: 150 }
    ],
    calcularPuntaje: (r) => Math.round(((Number(r.bloques_dominante) || 0) + (Number(r.bloques_no_dominante) || 0)) / 2),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos', recomendaciones: [] };
      if (puntaje >= 75) return { texto: 'Función manual excelente', recomendaciones: ['Normalidad en transferencias de objetos'] };
      if (puntaje >= 60) return { texto: 'Función manual buena', recomendaciones: ['Ejercicios de alcance y liberación (reach and release)'] };
      if (puntaje >= 45) return { texto: 'Función manual moderada', recomendaciones: ['Entrenamiento de prensión cilíndrica y esférica', 'Adaptación del entorno de trabajo/cocina para evitar caídas de objetos pesados'] };
      if (puntaje >= 30) return { texto: 'Función manual limitada', recomendaciones: ['Dificultad evidente en AIVD', 'Terapia de restricción del lado sano (CIMT) si hay hemiparesia'] };
      return { texto: 'Función manual severamente limitada', recomendaciones: ['Mínima o nula funcionalidad de miembro superior', 'Prevenir subluxación de hombro', 'Dependencia en vestido y aseo'] };
    }
  },
  {
    id: 'jebsen_taylor',
    nombre: 'Jebsen Taylor Hand Function Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de función manual en tareas específicas',
    preguntas: [
      { id: 'escritura', text: 'Tiempo escritura:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'girar_cartas', text: 'Tiempo girar cartas:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'objetos_pequenos', text: 'Tiempo manipular objetos:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'alimentacion', text: 'Tiempo simular alimentación:', type: 'plugin', componente: 'CRONOMETRO' }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos', recomendaciones: [] };
      if (puntaje <= 60) return { texto: 'Función manual normal', recomendaciones: ['Total independencia en actividades complejas de la vida diaria'] };
      if (puntaje <= 120) return { texto: 'Función manual levemente reducida', recomendaciones: ['Entrenamiento específico en la tarea más lenta (ej. caligrafía vs uso de cuchara)'] };
      if (puntaje <= 240) return { texto: 'Función manual moderadamente reducida', recomendaciones: ['Indicar ayudas técnicas (ej. teclado adaptado, rebordes en el plato)', 'Terapia orientada a la tarea (Task-specific training)'] };
      return { texto: 'Función manual severamente reducida', recomendaciones: ['Incapacidad funcional de la extremidad', 'Asistencia de terceros para supervivencia y ABVD'] };
    }
  },
  {
    id: 'copm',
    nombre: 'Canadian Occupational Performance Measure (COPM)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Medida del desempeño ocupacional',
    preguntas: [
      { id: 'desempeno', text: 'Puntuación de desempeño (1-10)', type: 'number', min: 1, max: 10 },
      { id: 'satisfaccion', text: 'Puntuación de satisfacción (1-10)', type: 'number', min: 1, max: 10 }
    ],
    calcularPuntaje: (r) => Math.round(((Number(r.desempeno) || 0) + (Number(r.satisfaccion) || 0)) / 2),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin datos', recomendaciones: [] };
      if (puntaje >= 8) return { texto: 'Desempeño excelente', recomendaciones: ['Paciente percibe alta autoeficacia', 'Considerar alta terapéutica de TO'] };
      if (puntaje >= 6) return { texto: 'Desempeño bueno', recomendaciones: ['Afinar detalles en las ocupaciones prioritarias del paciente', 'Reevaluar en 1 mes'] };
      if (puntaje >= 4) return { texto: 'Desempeño moderado', recomendaciones: ['Rediseñar plan de intervención centrado en el cliente', 'Explorar barreras ambientales y personales', 'Ajustar expectativas reales'] };
      return { texto: 'Desempeño limitado - Requiere intervención', recomendaciones: ['Alta frustración y baja participación', 'Cambiar el enfoque a adaptaciones del entorno en lugar de recuperación motora pura', 'Soporte psicológico'] };
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

  // ==========================================
  // EMERGENCIAS
  // ==========================================
  {
    id: 'glasgow',
    nombre: 'Escala de Glasgow',
    categoria: 'emergencias',
    descripcion: 'Evaluación del nivel de conciencia',
    preguntas: [
      { id: 'apertura_ocular', text: 'Apertura ocular', type: 'select', options: [{ label: 'Espontánea', value: 4 }, { label: 'A la voz', value: 3 }, { label: 'Al dolor', value: 2 }, { label: 'Ninguna', value: 1 }] },
      { id: 'respuesta_verbal', text: 'Respuesta verbal', type: 'select', options: [{ label: 'Orientado', value: 5 }, { label: 'Confuso', value: 4 }, { label: 'Palabras inapropiadas', value: 3 }, { label: 'Sonidos incomprensibles', value: 2 }, { label: 'Ninguna', value: 1 }] },
      { id: 'respuesta_motora', text: 'Respuesta motora', type: 'select', options: [{ label: 'Obedece órdenes', value: 6 }, { label: 'Localiza dolor', value: 5 }, { label: 'Retira al dolor', value: 4 }, { label: 'Flexión anormal', value: 3 }, { label: 'Extensión anormal', value: 2 }, { label: 'Ninguna', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 15) return { texto: 'Alerta y orientado', recomendaciones: ['Observación rutinaria', 'Evaluación neurológica seriada si hay mecanismo de trauma'] };
      if (puntaje >= 13) return { texto: 'TEC leve', recomendaciones: ['Control estricto de signos vitales', 'Considerar TAC cerebral según factores de riesgo (ej. uso de anticoagulantes, vómitos)', 'Mantener en observación 24h'] };
      if (puntaje >= 9) return { texto: 'TEC moderado', recomendaciones: ['TAC cerebral urgente', 'Evaluación por neurocirugía', 'Monitorización neurológica continua', 'Prevenir hipoxia e hipotensión'] };
      if (puntaje >= 6) return { texto: 'TEC grave', recomendaciones: ['Asegurar vía aérea (Intubación inmediata si GCS < 9)', 'Ventilación mecánica normocápnica', 'Derivación urgente a centro neuroquirúrgico', 'Cabecera a 30° y medidas de neuroprotección'] };
      return { texto: 'TEC muy grave / Coma profundo', recomendaciones: ['Intubación y soporte vital avanzado inmediato', 'Traslado crítico', 'Altísima probabilidad de mortalidad o morbilidad severa'] };
    }
  },
  {
    id: 'rts',
    nombre: 'Revised Trauma Score (RTS)',
    categoria: 'emergencias',
    descripcion: 'Evaluación fisiológica del trauma',
    preguntas: [
      { id: 'glasgow', text: 'Glasgow Coma Score', type: 'select', options: [{ label: '13-15', value: 4 }, { label: '9-12', value: 3 }, { label: '6-8', value: 2 }, { label: '4-5', value: 1 }, { label: '3', value: 0 }] },
      { id: 'presion_sistolica', text: 'Presión arterial sistólica', type: 'select', options: [{ label: '>89 mmHg', value: 4 }, { label: '76-89 mmHg', value: 3 }, { label: '50-75 mmHg', value: 2 }, { label: '1-49 mmHg', value: 1 }, { label: '0 mmHg', value: 0 }] },
      { id: 'frecuencia_respiratoria', text: 'Frecuencia respiratoria', type: 'select', options: [{ label: '10-29 rpm', value: 4 }, { label: '>29 rpm', value: 3 }, { label: '6-9 rpm', value: 2 }, { label: '1-5 rpm', value: 1 }, { label: '0 rpm', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 11) return { texto: 'Trauma leve - Supervivencia >96%', recomendaciones: ['Traslado a urgencias locales', 'Reevaluación ABCDE periódica'] };
      if (puntaje >= 8) return { texto: 'Trauma moderado', recomendaciones: ['Requiere centro de trauma nivel II o III', 'Manejo activo de la vía aérea o fluidoterapia profiláctica'] };
      if (puntaje >= 5) return { texto: 'Trauma severo', recomendaciones: ['Traslado inmediato a Centro de Trauma Nivel I', 'Alerta al equipo de cirugía y banco de sangre (Código Trauma)', 'Protocolo de transfusión masiva si hay shock'] };
      return { texto: 'Trauma crítico', recomendaciones: ['Soporte vital avanzado máximo en escena/traslado', 'Altísima mortalidad (>80%)'] };
    }
  },
  {
    id: 'start_triage',
    nombre: 'START Triage',
    categoria: 'emergencias',
    descripcion: 'Sistema de triage para múltiples víctimas adultos',
    preguntas: [
      { id: 'camina', text: '¿Puede caminar?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'respiracion', text: 'Respiración', type: 'select', options: [{ label: 'Ausente (aún con vía aérea abierta)', value: 0 }, { label: 'Presente, > 30 rpm', value: 2 }, { label: 'Presente, < 30 rpm', value: 1 }] },
      { id: 'perfusion', text: 'Perfusión', type: 'select', options: [{ label: '> 2 seg o sin pulso', value: 2 }, { label: '< 2 seg o pulso radial', value: 1 }] },
      { id: 'estado_mental', text: 'Estado Mental', type: 'select', options: [{ label: 'No obedece', value: 2 }, { label: 'Obedece órdenes', value: 1 }] }
    ],
    calcularPuntaje: (r) => {
      if (r.camina === 1) return 1; 
      if (r.respiracion === 0) return 4;
      if (r.respiracion === 2) return 3;
      if (r.perfusion === 2) return 3;
      if (r.estado_mental === 2) return 3;
      if (r.estado_mental === 1) return 2;
      return 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 1) return { texto: 'Prioridad 3 (VERDE) - Menor', recomendaciones: ['Trasladar a zona de concentración de víctimas menores', 'Reevaluar clínicamente en 1-2 horas'] };
      if (puntaje === 2) return { texto: 'Prioridad 2 (AMARILLO) - Diferida', recomendaciones: ['Traslado secundario', 'Lesiones graves pero estables (ej. fracturas sin shock)', 'No requiere intervención vital inmediata'] };
      if (puntaje === 3) return { texto: 'Prioridad 1 (ROJO) - Inmediata', recomendaciones: ['Evacuación y tratamiento INMEDIATO', 'Aplicar torniquete si hay sangrado exanguinante', 'Manejo avanzado de la vía aérea si amerita'] };
      if (puntaje === 4) return { texto: 'Prioridad 0 (NEGRO) - Fallecido / Expectante', recomendaciones: ['No aplicar RCP en incidentes de múltiples víctimas', 'Dejar en el lugar', 'Atender a los pacientes rojos (Prioridad 1)'] };
      return { texto: 'Triage incompleto', recomendaciones: ['Completar algoritmo RPM (Respiración, Perfusión, Mental)'] };
    }
  },
  {
    id: 'jumpstart',
    nombre: 'JumpSTART',
    categoria: 'emergencias',
    descripcion: 'Triage pediátrico para múltiples víctimas (1-8 años)',
    preguntas: [
      { id: 'camina', text: '¿Puede caminar?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'respiracion', text: 'Respiración', type: 'select', options: [{ label: 'Presente: <15 o >45 rpm', value: 3 }, { label: 'Presente: 15-45 rpm', value: 1 }, { label: 'Ausente: Se recupera tras abrir vía aérea', value: 3 }, { label: 'Ausente: Tras 5 ventilaciones sigue ausente', value: 4 }, { label: 'Ausente: Tras 5 ventilaciones recupera', value: 3 }] },
      { id: 'pulso', text: 'Pulso periférico palpable', type: 'select', options: [{ label: 'Ausente', value: 3 }, { label: 'Presente', value: 1 }] },
      { id: 'avpu', text: 'Estado Mental (AVPU)', type: 'select', options: [{ label: 'Responde inapropiadamente (P) o Inconsciente (U)', value: 3 }, { label: 'Alerta/Voz/Dolor apropiado', value: 2 }] }
    ],
    calcularPuntaje: (r) => {
      if (r.camina === 1) return 1;
      if (r.respiracion === 4) return 4;
      if (r.respiracion === 3) return 3;
      if (r.pulso === 3) return 3;
      if (r.avpu === 3) return 3;
      if (r.avpu === 2) return 2;
      return 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 1) return { texto: 'Prioridad 3 (VERDE) - Menor', recomendaciones: ['Evacuar con acompañante si es posible', 'Reevaluación periódica'] };
      if (puntaje === 2) return { texto: 'Prioridad 2 (AMARILLO) - Diferida', recomendaciones: ['Traslado a centro de trauma pediátrico cuando haya recursos', 'Monitorización contínua'] };
      if (puntaje === 3) return { texto: 'Prioridad 1 (ROJO) - Inmediata', recomendaciones: ['Prioridad máxima de traslado pediátrico', 'Control de hemorragias', 'Soporte vital avanzado pediátrico (PALS)'] };
      if (puntaje === 4) return { texto: 'Prioridad 0 (NEGRO) - Fallecido', recomendaciones: ['Manejo expectante en escenario de víctimas múltiples masivas', 'Apoyo psicológico a la familia posteriormente'] };
      return { texto: 'Triage incompleto', recomendaciones: [] };
    }
  },
  {
    id: 'crams',
    nombre: 'CRAMS',
    categoria: 'emergencias',
    descripcion: 'Evaluación prehospitalaria del trauma',
    preguntas: [
      { id: 'circulacion', text: 'Circulación', type: 'select', options: [{ label: 'Normal PA>100', value: 2 }, { label: 'Retardado PA 85-100', value: 1 }, { label: 'Sin llenado PA<85', value: 0 }] },
      { id: 'respiracion', text: 'Respiración', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Anormal', value: 1 }, { label: 'Ausente', value: 0 }] },
      { id: 'abdomen', text: 'Abdomen', type: 'select', options: [{ label: 'Sin dolor', value: 2 }, { label: 'Dolor', value: 1 }, { label: 'Rígido', value: 0 }] },
      { id: 'motor', text: 'Respuesta motora', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Responde al dolor', value: 1 }, { label: 'Sin respuesta', value: 0 }] },
      { id: 'habla', text: 'Habla', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Confusa', value: 1 }, { label: 'Sin habla', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 9) return { texto: 'Trauma menor', recomendaciones: ['Atención en centro de urgencias de baja o mediana complejidad'] };
      if (puntaje >= 7) return { texto: 'Trauma moderado', recomendaciones: ['Traslado a hospital general', 'Imágenes (TAC/Radiografías) y observación'] };
      if (puntaje >= 5) return { texto: 'Trauma severo', recomendaciones: ['Traslado a Centro de Trauma mayor', 'Cirugía de control de daños probable'] };
      return { texto: 'Trauma crítico', recomendaciones: ['Activar Código Trauma prehospitalario', 'Manejo agresivo del shock (sangre 1:1:1, ácido tranexámico)', 'Asegurar vía aérea'] };
    }
  },
  {
    id: 'qsofa',
    nombre: 'qSOFA',
    categoria: 'emergencias',
    descripcion: 'Detección rápida de sepsis en áreas no-UCI',
    preguntas: [
      { id: 'fr', text: 'Frecuencia respiratoria ≥22 rpm', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'conciencia', text: 'Alteración del estado mental (Glasgow < 15)', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'pa', text: 'Presión arterial sistólica ≤100 mmHg', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 2) return { texto: 'Alto riesgo de Sepsis (qSOFA Positivo)', recomendaciones: ['Activar protocolo Sepsis Six de inmediato', 'Medir Lactato venoso/arterial', 'Tomar hemocultivos ANTES de dar antibióticos', 'Administrar antibióticos de amplio espectro IV', 'Bolo de cristaloides 30ml/kg si hay hipotensión', 'Derivar a UCI/UTI'] };
      return { texto: 'Bajo riesgo (qSOFA Negativo)', recomendaciones: ['Continuar monitorización si hay sospecha de infección', 'Considerar calcular score NEWS2 o SOFA completo si la sospecha persiste'] };
    }
  },
  {
    id: 'news2',
    nombre: 'NEWS2',
    categoria: 'emergencias',
    descripcion: 'National Early Warning Score 2 para detección de deterioro clínico',
    preguntas: [
      { id: 'fr', text: 'Frecuencia respiratoria', type: 'select', options: [{ label: '12-20', value: 0 }, { label: '9-11', value: 1 }, { label: '21-24', value: 2 }, { label: '<9 o >24', value: 3 }] },
      { id: 'sat', text: 'Saturación', type: 'select', options: [{ label: '≥96%', value: 0 }, { label: '94-95%', value: 1 }, { label: '92-93%', value: 2 }, { label: '≤91%', value: 3 }] },
      { id: 'pa', text: 'Presión sistólica', type: 'select', options: [{ label: '111-219', value: 0 }, { label: '101-110', value: 1 }, { label: '91-100', value: 2 }, { label: '≤90 o ≥220', value: 3 }] },
      { id: 'fc', text: 'Frecuencia cardíaca', type: 'select', options: [{ label: '51-90', value: 0 }, { label: '41-50 o 91-110', value: 1 }, { label: '111-130', value: 2 }, { label: '≤40 o ≥131', value: 3 }] },
      { id: 'conciencia', text: 'Nivel de conciencia', type: 'select', options: [{ label: 'Alerta', value: 0 }, { label: 'Voz/Dolor/No responde (ACVPU)', value: 3 }] },
      { id: 'temp', text: 'Temperatura', type: 'select', options: [{ label: '36.1-38.0', value: 0 }, { label: '35.1-36.0 o 38.1-39.0', value: 1 }, { label: '≤35.0 o ≥39.1', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Riesgo Clínico Bajo', recomendaciones: ['Monitorización de signos vitales cada 12 horas'] };
      if (puntaje <= 4) return { texto: 'Riesgo Medio-Bajo', recomendaciones: ['Aumentar frecuencia de monitoreo a cada 4-6 horas', 'Notificar al enfermero/a a cargo para evaluación médica programada'] };
      if (puntaje <= 6) return { texto: 'Riesgo Medio', recomendaciones: ['Evaluación médica URGENTE (en menos de 1 hora)', 'Monitorización estricta cada 1 hora', 'Preparar oxígeno y fluidoterapia inicial'] };
      return { texto: 'Riesgo Alto - Respuesta Rápida (>6 pts)', recomendaciones: ['Activar Equipo de Respuesta Rápida (MET/RRT) o médico intensivista inmediatamente', 'Monitorización continua', 'Traslado inminente a unidad de cuidados críticos (UCI/UTI)'] };
    }
  },
  {
    id: 'cincinnati',
    nombre: 'Escala Cincinnati para ACV',
    categoria: 'emergencias',
    descripcion: 'Detección prehospitalaria de accidente cerebrovascular',
    preguntas: [
      { id: 'facial', text: 'Asimetría facial', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'Anormal', value: 1 }] },
      { id: 'brazos', text: 'Debilidad brazos', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'Anormal', value: 1 }] },
      { id: 'habla', text: 'Alteración habla', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'Anormal', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 1) return { texto: 'Alta probabilidad de ACV (72%)', recomendaciones: ['Activar Código ACV prehospitalario ("Time is Brain")', 'Determinar hora exacta de inicio de síntomas (Last Known Well)', 'Medir Hemoglucotest para descartar hipoglicemia', 'Traslado rápido a centro con disponibilidad de TAC y Trombólisis'] };
      return { texto: 'Baja probabilidad de ACV clásico', recomendaciones: ['Evaluar síntomas no motores (vértigo severo, ataxia, ACV de fosa posterior)', 'Buscar otras causas neurológicas o metabólicas'] };
    }
  },
  {
    id: 'fast_ed',
    nombre: 'FAST-ED',
    categoria: 'emergencias',
    descripcion: 'Detección de ACV de gran vaso (LVO)',
    preguntas: [
      { id: 'asimetria', text: 'Asimetría facial', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Presente', value: 1 }] },
      { id: 'brazo', text: 'Debilidad de brazo', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Severa', value: 2 }] },
      { id: 'habla', text: 'Alteración del habla', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Severa', value: 2 }] },
      { id: 'mirada', text: 'Desviación de la mirada', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Presente', value: 2 }] },
      { id: 'negligencia', text: 'Negligencia/inatención visual o táctil', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Presente', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 4) return { texto: 'Alta prob. Oclusión de Gran Vaso (LVO)', recomendaciones: ['By-pass a centro Primario: Trasladar directamente a Centro Comprensivo de ACV (capacidad de Trombectomía Mecánica)', 'Notificar Código ACV Severo', 'Mantener presión arterial (NO tratar HTA salvo >220/120)'] };
      return { texto: 'Probabilidad moderada/baja de LVO', recomendaciones: ['Posible ACV de vaso pequeño o ataque isquémico transitorio', 'Traslado a centro primario de ACV para trombolisis sistémica (Alteplasa/Tenecteplasa)', 'Medir glucosa y establecer hora cero'] };
    }
  },
  {
    id: 'race',
    nombre: 'RACE',
    categoria: 'emergencias',
    descripcion: 'Rapid Arterial Occlusion Evaluation',
    preguntas: [
      { id: 'facial', text: 'Parálisis facial', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Mod/Sev', value: 2 }] },
      { id: 'brazo', text: 'Paresia de brazo', type: 'select', options: [{ label: 'Ausente/Leve', value: 0 }, { label: 'Mod', value: 1 }, { label: 'Sev', value: 2 }] },
      { id: 'pierna', text: 'Paresia de pierna', type: 'select', options: [{ label: 'Ausente/Leve', value: 0 }, { label: 'Mod', value: 1 }, { label: 'Sev', value: 2 }] },
      { id: 'mirada', text: 'Desviación mirada', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Presente', value: 1 }] },
      { id: 'afasia', text: 'Afasia o agnosia', type: 'select', options: [{ label: 'Realiza 2 tareas', value: 0 }, { label: 'Realiza 1', value: 1 }, { label: 'No realiza', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 5) return { texto: 'Alta sospecha oclusión gran vaso (LVO)', recomendaciones: ['Derivación urgente a centro con Neurorradiología Intervencionista (Trombectomía)', 'Activar Código ACV y pre-notificar escala RACE al equipo receptor', 'Evitar administrar aspirina o anticoagulantes empíricos'] };
      return { texto: 'Sospecha moderada/baja de oclusión de gran vaso', recomendaciones: ['Puede ser manejado en Centro Primario de Stroke', 'Trombolisis intravenosa es el tratamiento de elección probable', 'Estricto control de vía aérea si hay vómitos o compromiso de conciencia'] };
    }
  },
  {
    id: 'flacc',
    nombre: 'Escala FLACC de dolor pediátrico',
    categoria: 'emergencias',
    descripcion: 'Evaluación de dolor en niños de 2 meses a 7 años (o con discapacidad cognitiva)',
    preguntas: [
      { id: 'cara', text: 'Cara', type: 'select', options: [{ label: 'Sin expresión', value: 0 }, { label: 'Muecas', value: 1 }, { label: 'Temblor mentón/Mandíbula apretada', value: 2 }] },
      { id: 'piernas', text: 'Piernas', type: 'select', options: [{ label: 'Normal/Relajadas', value: 0 }, { label: 'Inquietas', value: 1 }, { label: 'Patadas/Encogidas', value: 2 }] },
      { id: 'actividad', text: 'Actividad', type: 'select', options: [{ label: 'Tranquilo/Posición normal', value: 0 }, { label: 'Se retuerce/Tenso', value: 1 }, { label: 'Rígido/Arqueado', value: 2 }] },
      { id: 'llanto', text: 'Llanto', type: 'select', options: [{ label: 'Sin llanto (despierto o dormido)', value: 0 }, { label: 'Quejas/Gemidos', value: 1 }, { label: 'Grito constante/Llanto incontrolable', value: 2 }] },
      { id: 'consuelo', text: 'Consuelo', type: 'select', options: [{ label: 'Relajado', value: 0 }, { label: 'Se tranquiliza con tacto/palabras', value: 1 }, { label: 'Difícil consolar', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Confort / Sin dolor', recomendaciones: ['Mantener lactancia/apego si aplica', 'Evitar intervenciones dolorosas innecesarias'] };
      if (puntaje <= 3) return { texto: 'Dolor o incomodidad leve', recomendaciones: ['Paracetamol o Ibuprofeno dosis pediátrica', 'Medidas no farmacológicas (distracción, chupete, brazos de los padres)'] };
      if (puntaje <= 6) return { texto: 'Dolor moderado', recomendaciones: ['Opioides débiles o Ketorolaco IV/IM', 'Reevaluación de la causa subyacente', 'Monitorización clínica continua'] };
      return { texto: 'Dolor severo', recomendaciones: ['Manejo con opioides potentes (Fentanilo intranasal/Morfina IV)', 'Abordaje urgente de la patología base (ej. fractura, abdomen agudo)', 'Prevención de shock neurogénico/vasovagal'] };
    }
  },
  {
    id: 'mallampati',
    nombre: 'Escala Mallampati Modificada',
    categoria: 'emergencias',
    descripcion: 'Predicción anatómica de vía aérea difícil',
    preguntas: [
      { id: 'clase', text: 'Visualización de estructuras faríngeas', type: 'select', options: [{ label: 'Clase I (Total: pilares, úvula, paladar blando)', value: 1 }, { label: 'Clase II (Úvula parcial, paladar blando)', value: 2 }, { label: 'Clase III (Solo base de úvula y paladar blando)', value: 3 }, { label: 'Clase IV (Solo paladar duro visible)', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.clase || 0,
    interpretar: (puntaje) => {
      if (puntaje <= 2) return { texto: 'Clase I/II: Intubación probablemente fácil', recomendaciones: ['Preparar laringoscopio Macintosh 3 o 4', 'Asegurar buena posición de olfateo (Sniffing position)'] };
      if (puntaje === 3) return { texto: 'Clase III: Intubación moderadamente difícil', recomendaciones: ['Uso de videolaringoscopio de primera línea', 'Tener a mano bougie y máscaras laríngeas de rescate', 'Considerar intubación con paciente despierto (fibroscopio) si no hay urgencia'] };
      return { texto: 'Clase IV: Intubación difícil', recomendaciones: ['¡ALERTA DE VÍA AÉREA DIFÍCIL!', 'Llamar a operador más experimentado (Anestesista / Intensivista)', 'Preparar carro de Vía Aérea Difícil (cricotiroidotomía lista)', 'Evitar relajantes musculares si no se asegura la ventilación con mascarilla (No Cannot Intubate, Cannot Ventilate)'] };
    }
  },
  {
    id: 'silverman',
    nombre: 'Escala de Silverman Anderson',
    categoria: 'emergencias',
    descripcion: 'Evaluación de dificultad respiratoria en recién nacidos',
    preguntas: [
      { id: 'torax', text: 'Movimiento toracoabdominal', type: 'select', options: [{ label: 'Rítmico/Sincrónico', value: 0 }, { label: 'Retraso inspiratorio / Tórax inmovil', value: 1 }, { label: 'Bamboleo (Tórax deprime, abdomen protruye)', value: 2 }] },
      { id: 'tiraje', text: 'Tiraje intercostal', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Discreto/Leve', value: 1 }, { label: 'Intenso/Marcado', value: 2 }] },
      { id: 'xifoides', text: 'Retracción xifoidea', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Discreta', value: 1 }, { label: 'Intensa', value: 2 }] },
      { id: 'aleteo', text: 'Aleteo nasal', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Discreto', value: 1 }, { label: 'Intenso', value: 2 }] },
      { id: 'quejido', text: 'Quejido espiratorio', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Audible solo con estetoscopio', value: 1 }, { label: 'Audible a distancia', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return { texto: 'Sin dificultad respiratoria', recomendaciones: ['Alojamiento conjunto materno', 'Mantener termorregulación y lactancia'] };
      if (puntaje <= 3) return { texto: 'Dificultad respiratoria leve', recomendaciones: ['Vigilancia clínica, oxigenoterapia por halo o naricera', 'Mantener saturación SpO2 preductal >90%', 'Considerar Rx Tórax si persiste'] };
      if (puntaje <= 6) return { texto: 'Dificultad respiratoria moderada', recomendaciones: ['Ingreso a UCIN (Unidad de Cuidados Intensivos Neonatales)', 'Inicio temprano de CPAP nasal', 'Establecer accesos vasculares'] };
      return { texto: 'Dificultad respiratoria severa', recomendaciones: ['Intubación endotraqueal y ventilación mecánica invasiva inmediata', 'Administración de surfactante si hay sospecha de Enfermedad de Membrana Hialina', 'Monitorización invasiva en UCI Neonatal'] };
    }
  },

  // ==========================================
  // ENFERMERÍA
  // ==========================================
  {
    id: 'braden',
    nombre: 'Escala de Braden',
    categoria: 'enfermeria',
    descripcion: 'Valoración del riesgo de desarrollar Úlceras por Presión (UPP).',
    preguntas: [
      { id: 'percepcion', text: '1. Percepción Sensorial', type: 'select', options: [{ label: '1 - Completamente limitada', value: 1 }, { label: '2 - Muy limitada', value: 2 }, { label: '3 - Ligeramente limitada', value: 3 }, { label: '4 - Sin limitaciones', value: 4 }] },
      { id: 'humedad', text: '2. Exposición a la Humedad', type: 'select', options: [{ label: '1 - Constantemente húmeda', value: 1 }, { label: '2 - A menudo húmeda', value: 2 }, { label: '3 - Ocasionalmente húmeda', value: 3 }, { label: '4 - Raramente húmeda', value: 4 }] },
      { id: 'actividad', text: '3. Actividad', type: 'select', options: [{ label: '1 - Encamado', value: 1 }, { label: '2 - En silla', value: 2 }, { label: '3 - Deambula ocasionalmente', value: 3 }, { label: '4 - Deambula frecuentemente', value: 4 }] },
      { id: 'movilidad', text: '4. Movilidad', type: 'select', options: [{ label: '1 - Completamente inmóvil', value: 1 }, { label: '2 - Muy limitada', value: 2 }, { label: '3 - Ligeramente limitada', value: 3 }, { label: '4 - Sin limitaciones', value: 4 }] },
      { id: 'nutricion', text: '5. Nutrición', type: 'select', options: [{ label: '1 - Muy pobre', value: 1 }, { label: '2 - Probablemente inadecuada', value: 2 }, { label: '3 - Adecuada', value: 3 }, { label: '4 - Excelente', value: 4 }] },
      { id: 'roce', text: '6. Roce y Peligro de Lesiones', type: 'select', options: [{ label: '1 - Problema (requiere asistencia máx)', value: 1 }, { label: '2 - Problema potencial', value: 2 }, { label: '3 - Sin problema aparente', value: 3 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 12) return { texto: 'Alto Riesgo de UPP', recomendaciones: ['Cambios posturales rigurosos cada 2 horas (reloj rotatorio)', 'Uso obligatorio de colchón antiescaras dinámico', 'Protección estricta de talones, sacro y trocánteres con apósitos hidrocelulares', 'Manejo proactivo de humedad (barreras de zinc o película protectora)', 'Suplementación hiperproteica (evaluar por nutricionista)'] };
      if (p <= 14) return { texto: 'Riesgo Moderado de UPP', recomendaciones: ['Cambios posturales cada 3-4 horas', 'Colchón de espuma de alta densidad viscoelástica', 'Revisión de la piel una vez por turno', 'Evitar arrastre en transferencias, usar sábanas de movimiento'] };
      if (p <= 16) return { texto: 'Bajo Riesgo de UPP', recomendaciones: ['Estimular movilización activa o deambulación precoz', 'Hidratación de la piel con cremas ricas en ácidos grasos hiperoxigenados (AGHO)', 'Protección básica en zonas de apoyo'] };
      return { texto: 'Sin Riesgo (17-23 pts)', recomendaciones: ['Fomentar independencia', 'Reevaluar si hay cambios en la condición clínica'] };
    }
  },
  {
    id: 'norton',
    nombre: 'Escala de Norton',
    categoria: 'enfermeria',
    descripcion: 'Valoración rápida del riesgo de Úlceras por Presión (UPP).',
    preguntas: [
      { id: 'fisico', text: 'Estado físico general', type: 'select', options: [{ label: '4 - Bueno', value: 4 }, { label: '3 - Mediano/Regular', value: 3 }, { label: '2 - Pobre', value: 2 }, { label: '1 - Muy Malo', value: 1 }] },
      { id: 'mental', text: 'Estado mental', type: 'select', options: [{ label: '4 - Alerta', value: 4 }, { label: '3 - Apático', value: 3 }, { label: '2 - Confuso', value: 2 }, { label: '1 - Estuporoso/Comatoso', value: 1 }] },
      { id: 'actividad', text: 'Activity', type: 'select', options: [{ label: '4 - Ambulante', value: 4 }, { label: '3 - Camina con ayuda', value: 3 }, { label: '2 - Sentado', value: 2 }, { label: '1 - Encamado', value: 1 }] },
      { id: 'movilidad', text: 'Movilidad', type: 'select', options: [{ label: '4 - Total', value: 4 }, { label: '3 - Disminuida', value: 3 }, { label: '2 - Muy Limitada', value: 2 }, { label: '1 - Inmóvil', value: 1 }] },
      { id: 'incontinencia', text: 'Incontinencia', type: 'select', options: [{ label: '4 - Ninguna', value: 4 }, { label: '3 - Ocasional', value: 3 }, { label: '2 - Urinaria o Fecal', value: 2 }, { label: '1 - Urinaria y Fecal', value: 1 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 11) return { texto: 'Riesgo Muy Alto de UPP', recomendaciones: ['Instaurar protocolo de prevención máxima (SEMP)', 'Manejo estricto de incontinencia', 'Protección de prominencias óseas'] };
      if (p <= 14) return { texto: 'Riesgo Evidente de UPP', recomendaciones: ['Cambios posturales programados', 'Evitar masajes sobre prominencias enrojecidas', 'Optimizar estado nutricional'] };
      return { texto: 'Riesgo Mínimo o Nulo (15-20 pts)', recomendaciones: ['Promover higiene, hidratación y deambulación', 'Reevaluación semanal'] };
    }
  },
  {
    id: 'morse',
    nombre: 'Escala de Morse',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del riesgo de caídas en pacientes hospitalizados.',
    preguntas: [
      { id: 'caidas_previas', text: '1. Historial de caídas recientes', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí', value: 25 }] },
      { id: 'diagnostico', text: '2. Diagnóstico secundario', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí', value: 15 }] },
      { id: 'ayuda', text: '3. Ayuda para deambular', type: 'select', options: [{ label: 'Ninguna / silla de ruedas', value: 0 }, { label: 'Bastón / muleta', value: 15 }, { label: 'Se apoya en muebles', value: 30 }] },
      { id: 'via_venosa', text: '4. Vía venosa periférica', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí', value: 20 }] },
      { id: 'marcha', text: '5. Marcha', type: 'select', options: [{ label: 'Normal / reposo', value: 0 }, { label: 'Débil', value: 10 }, { label: 'Alterada', value: 20 }] },
      { id: 'consciencia', text: '6. Estado mental', type: 'select', options: [{ label: 'Consciente de limitaciones', value: 0 }, { label: 'Olvida sus limitaciones', value: 15 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 45) return { texto: 'Riesgo Alto de Caída', recomendaciones: ['Instalar pulsera de identificación', 'Barandas elevadas', 'Asistencia obligatoria para deambular'] };
      if (p >= 25) return { texto: 'Riesgo Medio de Caída', recomendaciones: ['Iluminación nocturna', 'Calzado antideslizante', 'Supervisión en la unidad'] };
      return { texto: 'Riesgo Bajo de Caída', recomendaciones: ['Timbre a mano', 'Educación preventiva básica'] };
    }
  },
  {
    id: 'downton',
    nombre: 'Escala de Downton',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del riesgo de caídas.',
    preguntas: [
      { id: 'caidas', text: 'Caídas previas', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí', value: 1 }] },
      { id: 'medicamentos', text: 'Medicamentos (Tranquilizantes, diuréticos...)', type: 'select', options: [{ label: 'Ninguno', value: 0 }, { label: 'Toma 1 o más', value: 1 }] },
      { id: 'sensorial', text: 'Déficit sensorial', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí', value: 1 }] },
      { id: 'mental', text: 'Estado mental', type: 'select', options: [{ label: 'Orientado', value: 0 }, { label: 'Confuso / Agitado', value: 1 }] },
      { id: 'marcha', text: 'Marcha', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'Insegura / Imposible', value: 1 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 3) return { texto: 'Alto Riesgo de Caída (≥3 pts)', recomendaciones: ['Acompañamiento permanente', 'Revisar medicación', 'Corrección de déficit sensorial'] };
      return { texto: 'Bajo Riesgo de Caída', recomendaciones: ['Protocolo estándar de seguridad'] };
    }
  },
  {
    id: 'ramsay',
    nombre: 'Escala de Ramsay',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del nivel de sedación del paciente.',
    preguntas: [
      {
        id: 'nivel', text: 'Seleccione el nivel clínico observado:', type: 'select', options: [
          { label: '1 - Despierto, ansioso, agitado.', value: 1 },
          { label: '2 - Despierto, cooperador, tranquilo.', value: 2 },
          { label: '3 - Dormido, responde a órdenes.', value: 3 },
          { label: '4 - Dormido, respuesta rápida a estímulo.', value: 4 },
          { label: '5 - Dormido, respuesta perezosa a estímulo.', value: 5 },
          { label: '6 - Dormido, no responde a estímulos.', value: 6 }
        ]
      }
    ],
    calcularPuntaje: (r) => r.nivel || 0,
    interpretar: (p) => {
      if (p === 1) return { texto: 'Agitación / Ansiedad', recomendaciones: ['Tratar causa subyacente', 'Titular analgésicos/sedantes'] };
      if (p === 2 || p === 3) return { texto: 'Sedación Consciente / Óptima', recomendaciones: ['Ideal para destete ventilatorio', 'Test de despertar diario'] };
      if (p === 4 || p === 5) return { texto: 'Sedación Profunda', recomendaciones: ['Disminuir tasa de sedantes si se busca extubar', 'Prevenir neumonía asociada a ventilación'] };
      if (p === 6) return { texto: 'Coma profundo', recomendaciones: ['Reducir sedación inmediatamente (salvo indicación médica específica)', 'Proteger córneas'] };
      return { texto: 'Sin datos', recomendaciones: [] };
    }
  },
  {
    id: 'vip_phlebitis',
    nombre: 'Escala VIP (Visual Infusion Phlebitis Score)',
    categoria: 'enfermeria',
    descripcion: 'Detección temprana y manejo de la flebitis asociada a catéter venoso periférico.',
    preguntas: [
      {
        id: 'signos', text: 'Observación del sitio de punción:', type: 'select', options: [
          { label: '0 - Sano, sin dolor, sin eritema', value: 0 },
          { label: '1 - Dolor leve O leve eritema', value: 1 },
          { label: '2 - Dolor CON eritema/hinchazón', value: 2 },
          { label: '3 - Dolor, eritema, induración', value: 3 },
          { label: '4 - Lo anterior + cordón venoso palpable', value: 4 },
          { label: '5 - Todos los anteriores + Fiebre', value: 5 }
        ]
      }
    ],
    calcularPuntaje: (r) => r.signos || 0,
    interpretar: (p) => {
      if (p === 0) return { texto: 'Sin signos de flebitis. Vía permeable.', recomendaciones: ['Continuar observación rutinaria cada turno'] };
      if (p === 1) return { texto: 'Posible primer signo de flebitis.', recomendaciones: ['Observar cánula intensamente', 'Vigilancia estricta'] };
      if (p === 2) return { texto: 'Etapa temprana de flebitis.', recomendaciones: ['RETIRAR cánula venosa inmediatamente', 'Reubicar acceso venoso'] };
      if (p === 3) return { texto: 'Etapa media de flebitis.', recomendaciones: ['Retirar cánula inmediatamente', 'Compresas tibias y secas'] };
      if (p >= 4) return { texto: 'Etapa avanzada de flebitis.', recomendaciones: ['Retirar cánula inmediatamente', 'Tomar cultivo de la punta del catéter', 'Notificar a médico tratante'] };
      return { texto: 'Sin datos', recomendaciones: [] };
    }
  },
  {
    id: 'campbell',
    nombre: 'Escala de Campbell',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del dolor en pacientes no comunicativos o ventilados.',
    preguntas: [
      { id: 'facial', text: 'Musculatura facial', type: 'select', options: [{ label: 'Relajada', value: 0 }, { label: 'Tensa', value: 1 }, { label: 'Muecas', value: 2 }] },
      { id: 'tranquilidad', text: 'Tranquilidad', type: 'select', options: [{ label: 'Tranquilo', value: 0 }, { label: 'Mov. ocasionales', value: 1 }, { label: 'Agitación', value: 2 }] },
      { id: 'tono', text: 'Tono muscular', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'Aumentado', value: 1 }, { label: 'Rígido', value: 2 }] },
      { id: 'ventilacion', text: 'Ventilación / Respuesta', type: 'select', options: [{ label: 'Tolerancia normal', value: 0 }, { label: 'Tose / Se queja', value: 1 }, { label: 'Lucha con ventilador', value: 2 }] },
      { id: 'consuelo', text: 'Consolabilidad', type: 'select', options: [{ label: 'No necesita', value: 0 }, { label: 'Se consuela', value: 1 }, { label: 'Difícil de consolar', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p === 0) return { texto: 'Sin dolor', recomendaciones: ['Mantener esquema de analgesia basal'] };
      if (p <= 3) return { texto: 'Dolor Leve a Moderado', recomendaciones: ['Analgesia no opioide', 'Asegurar posicionamiento confortable'] };
      if (p <= 6) return { texto: 'Dolor Moderado a Severo', recomendaciones: ['Evaluar uso de opioides menores', 'Revisar parámetros del ventilador'] };
      return { texto: 'Dolor Muy Severo', recomendaciones: ['Aumentar infusión analgésica URGENTE', 'Evaluación médica inmediata'] };
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

  // ==========================================
  // NEUROLOGÍA (10 ESCALAS COMPLETAS)
  // ==========================================
  {
    id: 'nihss',
    nombre: 'Escala NIHSS',
    categoria: 'neurologia',
    descripcion: 'Evaluación cuantitativa del déficit neurológico en el ACV agudo.',
    preguntas: [
      { id: '1a', text: '1a. Nivel de conciencia (Respuesta)', type: 'select', options: [{ label: '0 - Alerta', value: 0 }, { label: '1 - Somnoliento', value: 1 }, { label: '2 - Estuporoso', value: 2 }, { label: '3 - Coma', value: 3 }] },
      { id: '1b', text: '1b. Preguntas LOC (Mes y Edad)', type: 'select', options: [{ label: '0 - Responde ambos correctamente', value: 0 }, { label: '1 - Responde uno correctamente', value: 1 }, { label: '2 - Ninguno correcto', value: 2 }] },
      { id: '1c', text: '1c. Órdenes LOC (Abrir/Cerrar ojos y mano)', type: 'select', options: [{ label: '0 - Realiza ambos correctamente', value: 0 }, { label: '1 - Realiza uno correctamente', value: 1 }, { label: '2 - Ninguno correcto', value: 2 }] },
      { id: '2', text: '2. Mirada conjugada (Horizontal)', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Parálisis parcial de la mirada', value: 1 }, { label: '2 - Desviación forzada', value: 2 }] },
      { id: '3', text: '3. Campos visuales', type: 'select', options: [{ label: '0 - Sin pérdida de visión', value: 0 }, { label: '1 - Hemianopsia parcial', value: 1 }, { label: '2 - Hemianopsia completa', value: 2 }, { label: '3 - Hemianopsia bilateral', value: 3 }] },
      { id: '4', text: '4. Parálisis facial', type: 'select', options: [{ label: '0 - Movimiento normal', value: 0 }, { label: '1 - Paresia menor', value: 1 }, { label: '2 - Parálisis parcial (inferior)', value: 2 }, { label: '3 - Parálisis completa', value: 3 }] },
      { id: '5a', text: '5a. Motor Brazo Izquierdo (10 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 10s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '5b', text: '5b. Motor Brazo Derecho (10 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 10s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '6a', text: '6a. Motor Pierna Izquierda (5 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 5s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '6b', text: '6b. Motor Pierna Derecha (5 seg)', type: 'select', options: [{ label: '0 - Sin caída', value: 0 }, { label: '1 - Claudica antes de 5s', value: 1 }, { label: '2 - Algún esfuerzo contra gravedad', value: 2 }, { label: '3 - No esfuerzo contra gravedad', value: 3 }, { label: '4 - Sin movimiento', value: 4 }] },
      { id: '7', text: '7. Ataxia de miembros', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Presente en un miembro', value: 1 }, { label: '2 - Presente en dos miembros', value: 2 }] },
      { id: '8', text: '8. Sensibilidad', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Pérdida leve a moderada', value: 1 }, { label: '2 - Pérdida severa/total', value: 2 }] },
      { id: '9', text: '9. Lenguaje (Afasia)', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Afasia leve a moderada', value: 1 }, { label: '2 - Afasia grave', value: 2 }, { label: '3 - Mudo/Afasia global', value: 3 }] },
      { id: '10', text: '10. Disartria', type: 'select', options: [{ label: '0 - Articulación normal', value: 0 }, { label: '1 - Leve a moderada', value: 1 }, { label: '2 - Grave/Ininteligible', value: 2 }] },
      { id: '11', text: '11. Extinción e Inatención (Negligencia)', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Inatención parcial', value: 1 }, { label: '2 - Inatención total', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p === 0) return { texto: 'Sin déficit neurológico', color: 'green', recomendaciones: ['Observación clínica', 'Control de factores de riesgo'] };
      if (p <= 4) return { texto: 'ACV Leve', color: 'yellow', recomendaciones: ['Evaluar elegibilidad para trombólisis', 'Ingreso a UTAC'] };
      if (p <= 15) return { texto: 'ACV Moderado', color: 'orange', recomendaciones: ['Activación urgente de Código ACV', 'Considerar trombectomía mecánica', 'Protección de vía aérea'] };
      if (p <= 20) return { texto: 'ACV Moderadamente Grave', color: 'red', recomendaciones: ['Alto riesgo de transformación hemorrágica', 'Manejo en UCI', 'Evaluación por neurocirugía'] };
      return { texto: 'ACV Grave', color: 'red', recomendaciones: ['Pronóstico reservado', 'Soporte vital avanzado', 'Monitorizar presión intracraneana'] };
    }
  },
  {
    id: 'rankin_mod',
    nombre: 'Escala de Rankin Modificada (mRS)',
    categoria: 'neurologia',
    descripcion: 'Medida de discapacidad funcional post-ACV.',
    preguntas: [
      { id: 'g', text: 'Grado de discapacidad:', type: 'select', options: [
        { label: '0 - Sin síntomas', value: 0 },
        { label: '1 - Sin discapacidad significativa (pese a síntomas)', value: 1 },
        { label: '2 - Discapacidad leve (capaz de valerse solo)', value: 2 },
        { label: '3 - Discapacidad moderada (necesita ayuda, pero camina solo)', value: 3 },
        { label: '4 - Discapacidad moderadamente grave (necesita ayuda para caminar/aseo)', value: 4 },
        { label: '5 - Discapacidad grave (encamado, incontinente)', value: 5 },
        { label: '6 - Fallecido', value: 6 }
      ]}
    ],
    calcularPuntaje: (r) => r.g || 0,
    interpretar: (p) => {
      if (p <= 1) return { texto: 'Resultado favorable', color: 'green', recomendaciones: ['Mantener controles', 'Prevención secundaria'] };
      if (p === 2) return { texto: 'Discapacidad leve', color: 'yellow', recomendaciones: ['Kinesiología motora y Terapia Ocupacional'] };
      if (p === 3) return { texto: 'Discapacidad moderada', color: 'orange', recomendaciones: ['Rehabilitación intensiva de la marcha'] };
      if (p >= 4 && p <= 5) return { texto: 'Discapacidad grave', color: 'red', recomendaciones: ['Prevención de complicaciones por inmovilismo', 'Soporte al cuidador'] };
      return { texto: 'Fallecido', color: 'gray', recomendaciones: [] };
    }
  },
  {
    id: 'asia_medular',
    nombre: 'Escala de ASIA',
    categoria: 'neurologia',
    descripcion: 'Clasificación de la gravedad de la lesión medular.',
    preguntas: [
      { id: 'grado', text: 'Grado de deterioro medular:', type: 'select', options: [
        { label: 'A - Completa: No preservación motora ni sensitiva S4-S5', value: 1 },
        { label: 'B - Incompleta: Sensibilidad preservada, no función motora', value: 2 },
        { label: 'C - Incompleta: Función motora preservada (Fuerza < 3)', value: 3 },
        { label: 'D - Incompleta: Función motora preservada (Fuerza ≥ 3)', value: 4 },
        { label: 'E - Normal: Funciones motoras y sensitivas normales', value: 5 }
      ]}
    ],
    calcularPuntaje: (r) => r.grado || 0,
    interpretar: (p) => {
      if (p === 1) return { texto: 'Lesión Completa (ASIA A)', color: 'red', recomendaciones: ['Prevención de UPP', 'Manejo de vejiga neurogénica', 'Kinesioterapia pasiva'] };
      if (p <= 3) return { texto: 'Lesión Incompleta (ASIA B/C)', color: 'orange', recomendaciones: ['Control de sensibilidad', 'Bipedestación asistida', 'Fortalecimiento muscular'] };
      if (p === 4) return { texto: 'Lesión Incompleta Funcional (ASIA D)', color: 'yellow', recomendaciones: ['Entrenamiento de marcha con ayudas técnicas', 'Equilibrio dinámico'] };
      return { texto: 'Normal (ASIA E)', color: 'green', recomendaciones: ['Mantener actividad física', 'Seguimiento neurológico'] };
    }
  },
  {
    id: 'hunt_hess',
    nombre: 'Escala de Hunt y Hess',
    categoria: 'neurologia',
    descripcion: 'Predice la mortalidad en Hemorragia Subaracnoidea (HSA).',
    preguntas: [
      { id: 'grado', text: 'Estado clínico:', type: 'select', options: [
        { label: 'Grado 1: Asintomático o cefalea leve', value: 1 },
        { label: 'Grado 2: Cefalea moderada a grave, rigidez de nuca', value: 2 },
        { label: 'Grado 3: Somnolencia o confusión', value: 3 },
        { label: 'Grado 4: Estupor, hemiparesia moderada a grave', value: 4 },
        { label: 'Grado 5: Coma profundo, descerebración', value: 5 }
      ]}
    ],
    calcularPuntaje: (r) => r.grado || 0,
    interpretar: (p) => {
      if (p <= 2) return { texto: 'Riesgo bajo/moderado', color: 'green', recomendaciones: ['Control hemodinámico', 'Reposo absoluto', 'Analgesia'] };
      if (p === 3) return { texto: 'Riesgo significativo', color: 'orange', recomendaciones: ['Evaluación urgente por Neurocirugía', 'AngioTAC de urgencia'] };
      return { texto: 'Pronóstico reservado / Mortalidad alta', color: 'red', recomendaciones: ['Protección de vía aérea', 'Manejo de PIC', 'UCI'] };
    }
  },
  {
    id: 'fisher_mod',
    nombre: 'Escala de Fisher (Modificada)',
    categoria: 'neurologia',
    descripcion: 'Predice el riesgo de vasoespasmo según el TAC.',
    preguntas: [
      { id: 'g', text: 'Hallazgo en Tomografía:', type: 'select', options: [
        { label: 'Grado 0: Sin sangre subaracnoidea ni intraventricular', value: 0 },
        { label: 'Grado 1: Sangre fina, sin sangre intraventricular', value: 1 },
        { label: 'Grado 2: Sangre fina con sangre intraventricular', value: 2 },
        { label: 'Grado 3: Sangre gruesa, sin sangre intraventricular', value: 3 },
        { label: 'Grado 4: Sangre gruesa con sangre intraventricular', value: 4 }
      ]}
    ],
    calcularPuntaje: (r) => r.g || 0,
    interpretar: (p) => {
      if (p <= 1) return { texto: 'Riesgo muy bajo de vasoespasmo', color: 'green', recomendaciones: ['Control rutinario'] };
      if (p === 2) return { texto: 'Riesgo moderado', color: 'yellow', recomendaciones: ['Doppler transcraneal diario'] };
      return { texto: 'RIESGO ALTO (>35%)', color: 'red', recomendaciones: ['UCI', 'Nimodipino', 'Monitorización estricta de volemia'] };
    }
  },
  {
    id: 'canadian_scale',
    nombre: 'Escala Neurológica Canadiense',
    categoria: 'neurologia',
    descripcion: 'Monitoreo seriado rápido del estado neurológico.',
    preguntas: [
      { id: 'conciencia', text: 'Nivel de conciencia', type: 'select', options: [{ label: 'Alerta', value: 3 }, { label: 'Somnoliento', value: 1.5 }] },
      { id: 'orientacion', text: 'Orientación', type: 'select', options: [{ label: 'Orientado', value: 1 }, { label: 'Desorientado', value: 0 }] },
      { id: 'lenguaje', text: 'Lenguaje', type: 'select', options: [{ label: 'Normal', value: 1 }, { label: 'Afasia expresiva', value: 0.5 }, { label: 'Afasia receptiva', value: 0 }] },
      { id: 'facial', text: 'Debilidad facial', type: 'select', options: [{ label: 'Ninguna', value: 0.5 }, { label: 'Presente', value: 0 }] },
      { id: 'motor_b', text: 'Motor Brazo', type: 'select', options: [{ label: 'Normal', value: 1.5 }, { label: 'Paresia', value: 1 }, { label: 'Plejia', value: 0 }] },
      { id: 'motor_p', text: 'Motor Pierna', type: 'select', options: [{ label: 'Normal', value: 1.5 }, { label: 'Paresia', value: 1 }, { label: 'Plejia', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 8.5) return { texto: 'Déficit leve', color: 'green', recomendaciones: ['Monitoreo cada 4 horas'] };
      if (p >= 5) return { texto: 'Déficit moderado', color: 'orange', recomendaciones: ['Notificar si desciende 1 punto', 'Evaluar deglución'] };
      return { texto: 'Déficit severo', color: 'red', recomendaciones: ['UCI', 'Asegurar vía aérea'] };
    }
  },
  {
    id: 'dn4_neuropatico',
    nombre: 'Cuestionario DN4',
    categoria: 'neurologia',
    descripcion: 'Detección de dolor neuropático.',
    preguntas: [
      { id: '1', text: '¿El dolor es tipo quemazón?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '2', text: '¿Siente frío doloroso?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '3', text: '¿Siente descargas eléctricas?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '4', text: '¿Siente hormigueo?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '5', text: '¿Siente pinchazos?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '6', text: '¿Siente entumecimiento?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '7', text: '¿Siente escozor/picazón?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '8', text: 'Exploración: ¿Hipoestesia al tacto?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '9', text: 'Exploración: ¿Hipoestesia al pinchazo?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '10', text: 'Exploración: ¿Alodinia (dolor al roce)?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 4) return { texto: 'Dolor Neuropático Confirmado', color: 'red', recomendaciones: ['Evaluar neuromoduladores', 'Derivación a Unidad del Dolor'] };
      return { texto: 'Dolor Nociceptivo', color: 'green', recomendaciones: ['Analgesia convencional'] };
    }
  },
  {
    id: 'romberg_test',
    nombre: 'Test de Romberg',
    categoria: 'neurologia',
    descripcion: 'Evaluación de equilibrio y propiocepción.',
    preguntas: [
      { id: 'r', text: 'Observación clínica:', type: 'select', options: [
        { label: 'Negativo: Mantiene el equilibrio sin oscilaciones al cerrar los ojos', value: 0 },
        { label: 'Positivo: Pierde el equilibrio o presenta oscilaciones al cerrar los ojos', value: 1 }
      ]}
    ],
    calcularPuntaje: (r) => r.r || 0,
    interpretar: (p) => {
      if (p === 0) return { texto: 'Normal (Negativo)', color: 'green', recomendaciones: ['Funciones vestibulares e íntegras'] };
      return { texto: 'Alterado (Positivo)', color: 'red', recomendaciones: ['Sugerente de ataxia sensitiva o vestibular', 'Evaluar cordones posteriores'] };
    }
  },
  {
    id: 'epworth_sleep',
    nombre: 'Escala de Epworth',
    categoria: 'neurologia',
    descripcion: 'Nivel de somnolencia diurna.',
    preguntas: [
      { id: '1', text: 'Sentado leyendo', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] },
      { id: '2', text: 'Viendo TV', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] },
      { id: '3', text: 'Sentado en lugar público', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] },
      { id: '4', text: 'Copiloto en auto 1 hora', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] },
      { id: '5', text: 'Echado en la tarde', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] },
      { id: '6', text: 'Sentado charlando', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] },
      { id: '7', text: 'Sentado tras almuerzo', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] },
      { id: '8', text: 'En auto parado en tráfico', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Elevada prob.', value: 3 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 10) return { texto: 'Normal', color: 'green', recomendaciones: ['Higiene de sueño adecuada'] };
      if (p <= 14) return { texto: 'Somnolencia leve', color: 'yellow', recomendaciones: ['Revisar hábitos nocturnos'] };
      if (p <= 17) return { texto: 'Somnolencia moderada', color: 'orange', recomendaciones: ['Evaluar especialista en sueño'] };
      return { texto: 'Somnolencia grave', color: 'red', recomendaciones: ['Alta probabilidad de Apnea del Sueño', 'No conducir'] };
    }
  },
  {
    id: 'mnsi_periferica',
    nombre: 'Screening Michigan (MNSI)',
    categoria: 'neurologia',
    descripcion: 'Detección de neuropatía periférica diabética.',
    preguntas: [
      { id: '1', text: '¿Apariencia de los pies deformada?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '2', text: '¿Presencia de úlceras?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '3', text: 'Reflejo Aquiliano ausente', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: '4', text: 'Percepción de vibración disminuida', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 2) return { texto: 'Riesgo Alto de Neuropatía', color: 'red', recomendaciones: ['Podología prioritaria', 'Calzado para diabético', 'Control HbA1c'] };
      return { texto: 'Riesgo Bajo', color: 'green', recomendaciones: ['Autoexamen diario'] };
    }
  
  },
  // ==========================================
  // NUTRICIÓN
  // ==========================================
  {
    id: 'mna_short',
    nombre: 'MNA® - Versión Corta',
    categoria: 'nutricion',
    descripcion: 'Mini Nutritional Assessment. Cribado rápido de malnutrición en adultos mayores.',
    preguntas: [
      { id: 'ingesta', text: 'A. ¿Ha comido menos por falta de apetito, problemas digestivos o de masticación en los últimos 3 meses?', type: 'select', options: [{ label: '0 - Anorexia grave', value: 0 }, { label: '1 - Anorexia moderada', value: 1 }, { label: '2 - Sin anorexia', value: 2 }] },
      { id: 'perdida_peso', text: 'B. Pérdida reciente de peso (< 3 meses):', type: 'select', options: [{ label: '0 - Pérdida > 3kg', value: 0 }, { label: '1 - No lo sabe', value: 1 }, { label: '2 - Pérdida entre 1 y 3kg', value: 2 }, { label: '3 - Sin pérdida de peso', value: 3 }] },
      { id: 'movilidad', text: 'C. Movilidad:', type: 'select', options: [{ label: '0 - De la cama al sillón', value: 0 }, { label: '1 - Autonomía en el interior', value: 1 }, { label: '2 - Sale del domicilio', value: 2 }] },
      { id: 'estres', text: 'D. ¿Ha tenido una enfermedad aguda o situación de estrés psicológico en los últimos 3 meses?', type: 'select', options: [{ label: '0 - Sí', value: 0 }, { label: '2 - No', value: 2 }] },
      { id: 'neuro', text: 'E. Problemas neuropsicológicos:', type: 'select', options: [{ label: '0 - Demencia o depresión grave', value: 0 }, { label: '1 - Demencia moderada', value: 1 }, { label: '2 - Sin problemas psicológicos', value: 2 }] },
      { id: 'imc', text: 'F. Índice de Masa Corporal (IMC):', type: 'select', options: [{ label: '0 - IMC < 19', value: 0 }, { label: '1 - IMC 19 - <21', value: 1 }, { label: '2 - IMC 21 - <23', value: 2 }, { label: '3 - IMC ≥ 23', value: 3 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 12) return { texto: 'Estado nutricional normal', recomendaciones: ['Reevaluar anualmente o tras cambio clínico', 'Mantener dieta equilibrada e hidratación'] };
      if (p >= 8) return { texto: 'Riesgo de malnutrición', recomendaciones: ['Realizar evaluación profunda (MNA versión larga)', 'Seguimiento de peso mensual', 'Intervención nutricional preventiva'] };
      return { texto: 'Malnutrición evidente', recomendaciones: ['Derivación urgente a Nutricionista', 'Suplementación nutricional indicada', 'Evaluar causas médicas de la baja de peso'] };
    }
  },
  {
    id: 'must_screening',
    nombre: 'MUST (Malnutrition Universal Screening Tool)',
    categoria: 'nutricion',
    descripcion: 'Herramienta universal para detectar malnutrición en adultos.',
    preguntas: [
      { id: 'imc_score', text: 'Puntuación IMC (kg/m²):', type: 'select', options: [{ label: '> 20 (> 30 obeso)', value: 0 }, { label: '18.5 - 20', value: 1 }, { label: '< 18.5', value: 2 }] },
      { id: 'peso_score', text: 'Pérdida de peso involuntaria (3-6 meses):', type: 'select', options: [{ label: '< 5%', value: 0 }, { label: '5 - 10%', value: 1 }, { label: '> 10%', value: 2 }] },
      { id: 'aguda_score', text: 'Efecto de enfermedad aguda (ayuno > 5 días):', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Sí (Añadir 2 puntos)', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p === 0) return { texto: 'Riesgo Bajo', recomendaciones: ['Cuidado rutinario', 'Repetir cribado en pacientes hospitalizados cada semana'] };
      if (p === 1) return { texto: 'Riesgo Medio', recomendaciones: ['Observar y registrar ingesta alimentaria por 3 días', 'Repetir cribado hospitalario cada 3 días', 'Evaluar por especialista si hay deterioro'] };
      return { texto: 'Riesgo Alto', recomendaciones: ['Tratamiento nutricional inmediato', 'Derivación a Nutricionista / Soporte nutricional', 'Mejorar aporte energético y proteico'] };
    }
  },
  {
    id: 'nrs_2002',
    nombre: 'NRS-2002 (Nutritional Risk Screening)',
    categoria: 'nutricion',
    descripcion: 'Tamizaje de riesgo nutricional en pacientes hospitalizados.',
    preguntas: [
      { id: 'estado_nutricional', text: '1. Deterioro del estado nutricional:', type: 'select', options: [
        { label: '0 - Normal', value: 0 },
        { label: '1 - Leve (Pérdida peso > 5% en 3 meses o ingesta 50-75%)', value: 1 },
        { label: '2 - Moderado (Pérdida peso > 5% en 2 meses o IMC 18.5-20.5 o ingesta 25-50%)', value: 2 },
        { label: '3 - Severo (Pérdida peso > 5% en 1 mes o IMC < 18.5 o ingesta 0-25%)', value: 3 }
      ]},
      { id: 'gravedad_enfermedad', text: '2. Gravedad de la enfermedad (estrés metabólico):', type: 'select', options: [
        { label: '0 - Requerimientos normales', value: 0 },
        { label: '1 - Leve (Fractura de cadera, pacientes crónicos con complicaciones)', value: 1 },
        { label: '2 - Moderada (Cirugía mayor abdominal, ACV, neumonía grave, cáncer)', value: 2 },
        { label: '3 - Severa (TEC, trasplante médula, pacientes en UCI)', value: 3 }
      ]},
      { id: 'ajuste_edad', text: '3. Edad del paciente:', type: 'select', options: [
        { label: 'Menor de 70 años', value: 0 },
        { label: '70 años o más (+1 punto)', value: 1 }
      ]}
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 3) return { texto: 'Paciente en Riesgo Nutricional', recomendaciones: ['Iniciar plan de cuidados nutricionales de inmediato', 'Interconsulta a Nutricionista y Médico', 'Monitoreo diario de ingesta', 'Considerar soporte nutricional (enteral/parenteral)'] };
      return { texto: 'Sin Riesgo en este momento', recomendaciones: ['Reevaluar semanalmente durante la hospitalización', 'Si el paciente va a cirugía mayor, considerar protocolo preventivo'] };
    }
  },
  {
    id: 'vgs_nutricional',
    nombre: 'Valoración Global Subjetiva (VGS)',
    categoria: 'nutricion',
    descripcion: 'Diagnóstico clínico del estado nutricional basado en historia y examen físico.',
    preguntas: [
      { id: 'clasificacion', text: 'Seleccione la categoría final tras el examen clínico:', type: 'select', options: [
        { label: 'A - Bien nutrido', value: 1 },
        { label: 'B - Moderadamente malnutrido (o sospecha de malnutrición)', value: 2 },
        { label: 'C - Gravemente malnutrido', value: 3 }
      ]}
    ],
    calcularPuntaje: (r) => r.clasificacion || 0,
    interpretar: (p) => {
      if (p === 1) return { texto: 'Categoría A: Bien Nutrido', recomendaciones: ['Mantener pauta alimentaria habitual', 'Educación en alimentación saludable'] };
      if (p === 2) return { texto: 'Categoría B: Moderadamente Malnutrido', recomendaciones: ['Intervención nutricional específica', 'Suplementación de macronutrientes', 'Tratar síntomas gastrointestinales si existen', 'Control de peso quincenal'] };
      if (p === 3) return { texto: 'Categoría C: Gravemente Malnutrido', recomendaciones: ['Soporte nutricional intensivo', 'Derivación prioritaria a especialista', 'Evaluar síndrome de realimentación al iniciar soporte', 'Protección de masa muscular'] };
      return { texto: 'Sin datos', recomendaciones: [] };
    }
  },
  {
    id: 'glim_criteria',
    nombre: 'Criterios GLIM',
    categoria: 'nutricion',
    descripcion: 'Marco global para el diagnóstico de desnutrición (Fenotípicos + Etiológicos).',
    preguntas: [
      { id: 'feno', text: 'Criterio Fenotípico (Pérdida peso, IMC bajo o Masa muscular reducida):', type: 'select', options: [{ label: 'Presente', value: 1 }, { label: 'Ausente', value: 0 }] },
      { id: 'etio', text: 'Criterio Etiológico (Ingesta reducida o Inflamación/Enfermedad grave):', type: 'select', options: [{ label: 'Presente', value: 1 }, { label: 'Ausente', value: 0 }] }
    ],
    calcularPuntaje: (r) => (r.feno === 1 && r.etio === 1) ? 1 : 0,
    interpretar: (p) => {
      if (p === 1) return { texto: 'Diagnóstico de DESNUTRICIÓN confirmado', recomendaciones: ['Determinar severidad (Moderada vs Severa)', 'Intervención nutricional intensiva', 'Tratar la causa etiológica base'] };
      return { texto: 'No cumple criterios diagnósticos GLIM', recomendaciones: ['Continuar monitoreo si existe riesgo nutricional previo'] };
    }
  },
  {
    id: 'imc_cintura',
    nombre: 'IMC y Perímetro de Cintura',
    categoria: 'nutricion',
    descripcion: 'Clasificación del estado nutricional y riesgo cardiometabólico.',
    preguntas: [
      { id: 'imc_val', text: 'Ingrese el IMC (kg/m²):', type: 'number' },
      { id: 'cintura_val', text: 'Perímetro de cintura (cm):', type: 'number' },
      { id: 'sexo', text: 'Sexo:', type: 'select', options: [{ label: 'Hombre', value: 1 }, { label: 'Mujer', value: 2 }] }
    ],
    calcularPuntaje: (r) => Number(r.imc_val) || 0,
    interpretar: (p) => {
      let cat = '';
      if (p < 18.5) cat = 'Bajo Peso';
      else if (p < 25) cat = 'Normopeso';
      else if (p < 30) cat = 'Sobrepeso';
      else cat = 'Obesidad';
      return { texto: 'Estado: ' + cat, recomendaciones: ['Evaluar riesgo cardiovascular según perímetro de cintura', 'Ajustar plan alimentario según objetivo ponderal'] };
    }
  },
  {
    id: 'bristol_scale',
    nombre: 'Escala de Bristol',
    categoria: 'nutricion',
    descripcion: 'Clasificación visual de la forma y consistencia de las heces.',
    preguntas: [
      { id: 'tipo', text: 'Seleccione el tipo de consistencia (1-7):', type: 'select', options: [
        { label: 'Tipo 1-2: Estreñimiento', value: 1 },
        { label: 'Tipo 3-4: Normal / Ideal', value: 2 },
        { label: 'Tipo 5-7: Tendencia a diarrea', value: 3 }
      ]}
    ],
    calcularPuntaje: (r) => r.tipo || 0,
    interpretar: (p) => {
      if (p === 1) return { texto: 'Estreñimiento', recomendaciones: ['Aumentar ingesta de fibra (25-30g/día)', 'Incrementar consumo de agua', 'Fomentar actividad física'] };
      if (p === 2) return { texto: 'Consistencia Normal', recomendaciones: ['Mantener hábitos actuales'] };
      return { texto: 'Tránsito acelerado / Diarrea', recomendaciones: ['Evaluar malabsorción o intolerancias', 'Asegurar reposición de electrolitos', 'Considerar dieta astringente si es agudo'] };
    }
  },
  {
    id: 'strong_kids',
    nombre: 'StrongKids',
    categoria: 'nutricion',
    descripcion: 'Screening de riesgo nutricional pediátrico hospitalario.',
    preguntas: [
      { id: 'subje', text: 'Evaluación subjetiva (¿Se ve desnutrido?):', type: 'select', options: [{ label: 'Sí (1 pt)', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'enf', text: 'Enfermedad de alto riesgo o cirugía mayor:', type: 'select', options: [{ label: 'Sí (2 pts)', value: 2 }, { label: 'No', value: 0 }] },
      { id: 'ingesta', text: 'Ingesta reducida, diarrea o vómitos:', type: 'select', options: [{ label: 'Sí (1 pt)', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'perdida', text: 'Pérdida de peso o falta de crecimiento:', type: 'select', options: [{ label: 'Sí (1 pt)', value: 1 }, { label: 'No', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 4) return { texto: 'Riesgo Alto', recomendaciones: ['Consulta inmediata a Nutricionista/Pediatra', 'Soporte nutricional prescrito', 'Seguimiento diario'] };
      if (p >= 1) return { texto: 'Riesgo Moderado', recomendaciones: ['Control de peso diario', 'Suplementación si no mejora ingesta', 'Reevaluar en 3 días'] };
      return { texto: 'Riesgo Bajo', recomendaciones: ['Cuidado estándar', 'Reevaluar semanalmente'] };
    }
  },
  {
    id: 'scoff_test',
    nombre: 'Cuestionario SCOFF',
    categoria: 'nutricion',
    descripcion: 'Screening rápido de trastornos de la conducta alimentaria (TCA).',
    preguntas: [
      { id: 's', text: '¿Se siente enfermo porque se siente lleno?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'c', text: '¿Le preocupa haber perdido el control sobre cuánto come?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'o', text: '¿Ha perdido recientemente más de 6 kg en 3 meses?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'f', text: '¿Cree que está gordo a pesar de que otros dicen que está flaco?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'f2', text: '¿Diría que la comida domina su vida?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 2) return { texto: 'Probable Trastorno de Conducta Alimentaria', recomendaciones: ['Derivación urgente a Salud Mental (Psicología/Psiquiatría)', 'Evaluación médica para descartar complicaciones', 'Evitar dietas restrictivas sin supervisión'] };
      return { texto: 'Baja probabilidad de TCA', recomendaciones: ['Mantener educación en alimentación saludable'] };
    }
  },
  {
    id: 'nutric_score',
    nombre: 'NUTRIC Score',
    categoria: 'nutricion',
    descripcion: 'Riesgo nutricional para pacientes críticos en UCI.',
    preguntas: [
      { id: 'apache', text: 'APACHE II:', type: 'select', options: [{ label: '< 15', value: 0 }, { label: '15-19', value: 1 }, { label: '20-27', value: 2 }, { label: '≥ 28', value: 3 }] },
      { id: 'sofa', text: 'SOFA:', type: 'select', options: [{ label: '< 6', value: 0 }, { label: '6-9', value: 1 }, { label: '≥ 10', value: 2 }] },
      { id: 'comorb', text: 'Número de comorbilidades:', type: 'select', options: [{ label: '0-1', value: 0 }, { label: '≥ 2', value: 1 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 5) return { texto: 'Alto Riesgo Nutricional en UCI', recomendaciones: ['Inicio temprano de Nutrición Enteral', 'Ajustar aporte proteico al alza', 'Monitoreo de tolerancia gastrointestinal'] };
      return { texto: 'Bajo Riesgo Nutricional en UCI', recomendaciones: ['Monitorización rutinaria', 'Aporte nutricional estándar'] };
    }
  },
  // ==========================================
  // PSICOLOGÍA
  // ==========================================
  {
    id: 'phq_9',
    nombre: 'Cuestionario PHQ-9',
    categoria: 'psicologia',
    descripcion: 'Cuestionario sobre la salud del paciente para detectar severidad de síntomas depresivos.',
    preguntas: [
      { id: 'interes', text: '1. Poco interés o placer en hacer las cosas:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'animo', text: '2. Sentirse decaído/a, deprimido/a o sin esperanzas:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'sueno', text: '3. Dificultad para dormir o dormir demasiado:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'energia', text: '4. Sentirse cansado/a o tener poca energía:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'apetito', text: '5. Poco apetito o comer en exceso:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'falla', text: '6. Sentirse mal con usted mismo/a (sentirse fracasado):', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'concentracion', text: '7. Dificultad para concentrarse (leer, ver TV):', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'lentitud', text: '8. ¿Se mueve o habla tan lento (o tan rápido) que otros lo notan?:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'suicidio', text: '9. Pensamientos de que estaría mejor muerto/a o de lastimarse:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 4) return { texto: 'Síntomas depresivos mínimos', recomendaciones: ['No requiere intervención específica', 'Fomentar hábitos de vida saludable'] };
      if (p <= 9) return { texto: 'Depresión Leve', recomendaciones: ['Psicoeducación', 'Seguimiento clínico en 1 mes', 'Evaluar apoyo social'] };
      if (p <= 14) return { texto: 'Depresión Moderada', recomendaciones: ['Derivación a Psicología', 'Considerar inicio de farmacoterapia según criterio médico', 'Control frecuente'] };
      if (p <= 19) return { texto: 'Depresión Moderadamente Grave', recomendaciones: ['Tratamiento combinado (Fármacos + Psicoterapia)', 'Derivación prioritaria a Salud Mental'] };
      return { texto: 'Depresión Grave', recomendaciones: ['Derivación inmediata a especialista', 'Evaluación de riesgo suicida urgente', 'Soporte familiar intensivo'] };
    }
  },
  {
    id: 'gad_7',
    nombre: 'Escala GAD-7',
    categoria: 'psicologia',
    descripcion: 'Tamizaje para Trastorno de Ansiedad Generalizada.',
    preguntas: [
      { id: 'nervios', text: '1. Sentirse nervioso/a, intranquilo/a o con los nervios de punta:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'control', text: '2. No poder dejar de preocuparse o controlar la preocupación:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'exceso', text: '3. Preocuparse demasiado por diferentes cosas:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'relajacion', text: '4. Dificultad para relajarse:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'inquietud', text: '5. Estar tan inquieto/a que es difícil permanecer sentado/a:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'irritabilidad', text: '6. Sentirse fácilmente irritado/a o malhumorado/a:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] },
      { id: 'miedo', text: '7. Sentirse asustado/a como si algo terrible pudiera pasar:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Varios días', value: 1 }, { label: 'Más de la mitad de los días', value: 2 }, { label: 'Casi todos los días', value: 3 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 4) return { texto: 'Ansiedad Mínima', recomendaciones: ['Mantener técnicas de autocuidado'] };
      if (p <= 9) return { texto: 'Ansiedad Leve', recomendaciones: ['Monitorización clínica', 'Técnicas de relajación / Mindfulness'] };
      if (p <= 14) return { texto: 'Ansiedad Moderada', recomendaciones: ['Derivación a evaluación psicológica', 'Considerar terapia cognitivo-conductual'] };
      return { texto: 'Ansiedad Grave', recomendaciones: ['Derivación a especialista (Psicólogo/Psiquiatra)', 'Evaluación farmacológica indicada'] };
    }
  },
  {
    id: 'bdi_ii',
    nombre: 'Inventario de Depresión de Beck (BDI-II)',
    categoria: 'psicologia',
    descripcion: 'Evaluación clínica de la gravedad de la depresión (21 ítems).',
    preguntas: [
      { id: 'tristeza', text: '1. Tristeza:', type: 'select', options: [{ label: '0 - No me siento triste', value: 0 }, { label: '1 - Me siento triste gran parte del tiempo', value: 1 }, { label: '2 - Estoy triste todo el tiempo', value: 2 }, { label: '3 - Estoy tan triste que no puedo soportarlo', value: 3 }] },
      { id: 'pesimismo', text: '2. Pesimismo:', type: 'select', options: [{ label: '0 - No estoy desalentado respecto al futuro', value: 0 }, { label: '1 - Me siento más desalentado que lo habitual', value: 1 }, { label: '2 - No espero que las cosas mejoren', value: 2 }, { label: '3 - Siento que el futuro es desesperanzador', value: 3 }] },
      { id: 'fracaso', text: '3. Fracaso:', type: 'select', options: [{ label: '0 - No me siento un fracasado', value: 0 }, { label: '1 - He fracasado más de lo que debería', value: 1 }, { label: '2 - Al mirar atrás, veo muchos fracasos', value: 2 }, { label: '3 - Me siento un fracasado total', value: 3 }] },
      { id: 'placer', text: '4. Pérdida de Placer:', type: 'select', options: [{ label: '0 - Obtengo tanto placer como siempre', value: 0 }, { label: '1 - No disfruto tanto como antes', value: 1 }, { label: '2 - Obtengo muy poco placer de las cosas', value: 2 }, { label: '3 - No puedo obtener ningún placer', value: 3 }] },
      { id: 'culpa', text: '5. Sentimientos de Culpa:', type: 'select', options: [{ label: '0 - No me siento particularmente culpable', value: 0 }, { label: '1 - Me siento culpable por muchas cosas', value: 1 }, { label: '2 - Me siento bastante culpable la mayor parte del tiempo', value: 2 }, { label: '3 - Me siento culpable todo el tiempo', value: 3 }] },
      { id: 'suicidio_beck', text: '9. Pensamientos o Deseos Suicidas:', type: 'select', options: [{ label: '0 - No tengo ningún pensamiento de matarme', value: 0 }, { label: '1 - Tengo pensamientos, pero no lo haría', value: 1 }, { label: '2 - Me gustaría matarme', value: 2 }, { label: '3 - Me mataría si tuviera la oportunidad', value: 3 }] }
    ],
    // Nota: Por espacio hemos puesto los ítems clave. Se recomienda completar los 21 en la ficha física.
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 13) return { texto: 'Depresión mínima', recomendaciones: ['Mantener seguimiento'] };
      if (p <= 19) return { texto: 'Depresión leve', recomendaciones: ['Psicoterapia recomendada'] };
      if (p <= 28) return { texto: 'Depresión moderada', recomendaciones: ['Derivación a psiquiatría', 'Tratamiento farmacológico probable'] };
      return { texto: 'Depresión grave', recomendaciones: ['Intervención inmediata', 'Protocolo de prevención de suicidio'] };
    }
  },
  {
    id: 'audit_test',
    nombre: 'Test AUDIT (Alcohol)',
    categoria: 'psicologia',
    descripcion: 'Identificación de trastornos por consumo de alcohol.',
    preguntas: [
      { id: 'frecuencia', text: '1. ¿Con qué frecuencia consume bebidas alcohólicas?', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: '1 o menos veces al mes', value: 1 }, { label: '2 a 4 veces al mes', value: 2 }, { label: '2 a 3 veces a la semana', value: 3 }, { label: '4 o más veces a la semana', value: 4 }] },
      { id: 'cantidad', text: '2. ¿Cuántas copas suele tomar en un día de consumo normal?', type: 'select', options: [{ label: '1 o 2', value: 0 }, { label: '3 o 4', value: 1 }, { label: '5 o 6', value: 2 }, { label: '7 a 9', value: 3 }, { label: '10 o más', value: 4 }] },
      { id: 'intensivo', text: '3. ¿Con qué frecuencia toma 6 o más copas en una sola ocasión?', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Menos de una vez al mes', value: 1 }, { label: 'Mensualmente', value: 2 }, { label: 'Semanalmente', value: 3 }, { label: 'A diario o casi a diario', value: 4 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 7) return { texto: 'Consumo de bajo riesgo', recomendaciones: ['Educación sobre límites de consumo'] };
      if (p <= 15) return { texto: 'Consumo de riesgo', recomendaciones: ['Consejería breve', 'Entrega de material educativo'] };
      if (p <= 19) return { texto: 'Consumo perjudicial', recomendaciones: ['Derivación a programa de alcohol y drogas', 'Seguimiento médico'] };
      return { texto: 'Probable dependencia', recomendaciones: ['Derivación a especialista (Psiquiatría/Centros de tratamiento)', 'Manejo de síndrome de abstinencia si aplica'] };
    }
  },
  {
    id: 'dast_10',
    nombre: 'Test DAST-10 (Drogas)',
    categoria: 'psicologia',
    descripcion: 'Tamizaje del impacto del consumo de drogas (excepto alcohol y tabaco).',
    preguntas: [
      { id: 'd1', text: '1. ¿Ha utilizado drogas que no sean por necesidad médica?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'd2', text: '2. ¿Abusa de más de una droga a la vez?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'd3', text: '3. ¿Es incapaz de pasar una semana sin consumir?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'd4', text: '4. ¿Ha tenido lagunas mentales o flashbacks por consumo?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'd5', text: '5. ¿Se ha sentido alguna vez culpable por su consumo?', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p === 0) return { texto: 'Sin problemas relacionados', recomendaciones: ['Prevención primaria'] };
      if (p <= 2) return { texto: 'Riesgo Leve', recomendaciones: ['Consejería breve y seguimiento'] };
      if (p <= 5) return { texto: 'Riesgo Moderado', recomendaciones: ['Derivación a programa de rehabilitación especializado'] };
      return { texto: 'Riesgo Severo', recomendaciones: ['Intervención intensiva inmediata', 'Evaluación psiquiátrica completa'] };
    }
  },
  {
    id: 'beck_suicide',
    nombre: 'Escala de Ideación Suicida de Beck',
    categoria: 'psicologia',
    descripcion: 'Evaluación de la intensidad de los deseos, planes y comportamiento suicida.',
    preguntas: [
      { id: 's1', text: 'Deseo de vivir:', type: 'select', options: [{ label: 'Moderado/Fuerte', value: 0 }, { label: 'Débil', value: 1 }, { label: 'Ninguno', value: 2 }] },
      { id: 's2', text: 'Deseo de morir:', type: 'select', options: [{ label: 'Ninguno', value: 0 }, { label: 'Débil', value: 1 }, { label: 'Moderado/Fuerte', value: 2 }] },
      { id: 's3', text: 'Razones para vivir/morir:', type: 'select', options: [{ label: 'Vivir > Morir', value: 0 }, { label: 'Vivir = Morir', value: 1 }, { label: 'Morir > Vivir', value: 2 }] },
      { id: 's4', text: 'Intento activo de suicidio:', type: 'select', options: [{ label: 'Ninguno', value: 0 }, { label: 'Débil', value: 1 }, { label: 'Fuerte', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 4) return { texto: '⚠️ RIESGO SUICIDA ALTO', recomendaciones: ['ACTIVA PROTOCOLO DE EMERGENCIA VITAL', 'No dejar al paciente solo', 'Derivación inmediata a Urgencias Psiquiátricas', 'Informar a red de apoyo cercana'] };
      if (p >= 1) return { texto: 'Riesgo Moderado', recomendaciones: ['Derivación prioritaria a Salud Mental', 'Contrato de no agresión', 'Seguimiento por red de apoyo'] };
      return { texto: 'Sin riesgo aparente', recomendaciones: ['Mantener seguimiento por especialidad base'] };
    }
  },
  {
    id: 'mbi_burnout',
    nombre: 'Maslach Burnout Inventory (MBI)',
    categoria: 'psicologia',
    descripcion: 'Evaluación del desgaste profesional y estrés laboral.',
    preguntas: [
      { id: 'm1', text: 'Me siento emocionalmente agotado por mi trabajo:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Pocas veces', value: 1 }, { label: 'Frecuentemente', value: 2 }, { label: 'Diariamente', value: 3 }] },
      { id: 'm2', text: 'Siento que trato a algunos pacientes como objetos:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Pocas veces', value: 1 }, { label: 'Frecuentemente', value: 2 }, { label: 'Diariamente', value: 3 }] },
      { id: 'm3', text: 'Me siento con poca energía al levantarme para ir a trabajar:', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Pocas veces', value: 1 }, { label: 'Frecuentemente', value: 2 }, { label: 'Diariamente', value: 3 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 7) return { texto: 'Alto riesgo de Burnout', recomendaciones: ['Evaluar licencia médica por salud mental', 'Terapia de manejo de estrés', 'Reestructuración de carga laboral'] };
      if (p >= 4) return { texto: 'Riesgo Moderado', recomendaciones: ['Pausas saludables', 'Técnicas de autocuidado', 'Evaluar ambiente laboral'] };
      return { texto: 'Bajo riesgo', recomendaciones: ['Mantener medidas de prevención'] };
    }
  },
  {
    id: 'rosenberg_selfesteem',
    nombre: 'Escala de Autoestima de Rosenberg',
    categoria: 'psicologia',
    descripcion: 'Medición de la satisfacción y valoración personal.',
    preguntas: [
      { id: 'r1', text: 'Siento que soy una persona digna de aprecio:', type: 'select', options: [{ label: 'Muy en desacuerdo', value: 1 }, { label: 'En desacuerdo', value: 2 }, { label: 'De acuerdo', value: 3 }, { label: 'Muy de acuerdo', value: 4 }] },
      { id: 'r2', text: 'En general, estoy satisfecho conmigo mismo:', type: 'select', options: [{ label: 'Muy en desacuerdo', value: 1 }, { label: 'En desacuerdo', value: 2 }, { label: 'De acuerdo', value: 3 }, { label: 'Muy de acuerdo', value: 4 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 4) return { texto: 'Autoestima Baja', recomendaciones: ['Fortalecer autoconcepto en psicoterapia', 'Evaluar síntomas depresivos'] };
      return { texto: 'Autoestima Normal/Alta', recomendaciones: ['Mantener bienestar psicológico'] };
    }
  },
  {
    id: 'pss_10_stress',
    nombre: 'Escala de Estrés Percibido (PSS-10)',
    categoria: 'psicologia',
    descripcion: 'Mide el grado en que las situaciones de la vida son valoradas como estresantes.',
    preguntas: [
      { id: 'p1', text: '¿Con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'De vez en cuando', value: 2 }, { label: 'A menudo', value: 3 }, { label: 'Muy a menudo', value: 4 }] },
      { id: 'p2', text: '¿Con qué frecuencia se ha sentido nervioso o estresado?', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'De vez en cuando', value: 2 }, { label: 'A menudo', value: 3 }, { label: 'Muy a menudo', value: 4 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p >= 6) return { texto: 'Estrés Percibido Alto', recomendaciones: ['Técnicas de relajación diafragmática', 'Priorización de tareas', 'Higiene del sueño'] };
      return { texto: 'Estrés Percibido Bajo/Moderado', recomendaciones: ['Estrategias de afrontamiento saludables'] };
    }
  },
  {
    id: 'whoqol_bref_short',
    nombre: 'WHOQOL-BREF (Calidad de Vida)',
    categoria: 'psicologia',
    descripcion: 'Evaluación abreviada de la OMS sobre la calidad de vida.',
    preguntas: [
      { id: 'q1', text: '¿Cómo calificaría su calidad de vida?', type: 'select', options: [{ label: 'Muy mala', value: 1 }, { label: 'Mala', value: 2 }, { label: 'Lo normal', value: 3 }, { label: 'Buena', value: 4 }, { label: 'Muy buena', value: 5 }] },
      { id: 'q2', text: '¿Cuán satisfecho está con su salud?', type: 'select', options: [{ label: 'Muy insatisfecho', value: 1 }, { label: 'Insatisfecho', value: 2 }, { label: 'Lo normal', value: 3 }, { label: 'Satisfecho', value: 4 }, { label: 'Muy satisfecho', value: 5 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 4) return { texto: 'Calidad de vida percibida baja', recomendaciones: ['Evaluar factores determinantes (físicos, sociales)', 'Intervención integral'] };
      return { texto: 'Calidad de vida percibida buena', recomendaciones: ['Fomentar factores protectores'] };
    }
  }
];

export const categories = [
  { id: 'kinesiologia', nombre: 'Kinesiología', descripcion: 'Evaluación funcional y movilidad' },
  { id: 'fonoaudiologia', nombre: 'Fonoaudiología', descripcion: 'Deglución y lenguaje' },
  { id: 'cognitivas', nombre: 'Cognitivas', descripcion: 'Estado mental' },
  { id: 'terapia_ocupacional', nombre: 'Terapia Ocupacional', descripcion: 'Función manual' },
  { id: 'emergencias', nombre: 'Emergencias', descripcion: 'Trauma y Triage' },
  { id: 'enfermeria', nombre: 'Enfermería', descripcion: 'Valoración de cuidados y riesgos' },
  { id: 'psicologia', nombre: 'Psicología', descripcion: 'Salud mental y conducta' },
  { id: 'nutricion', nombre: 'Nutrición', descripcion: 'Estado nutricional' },
  { id: 'neurologia', nombre: 'Neurología', descripcion: 'Examen neurológico' }
];