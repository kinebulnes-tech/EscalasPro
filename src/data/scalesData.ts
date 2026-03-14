export interface Question {
  id: string;
  text: string;
  type: 'select' | 'number' | 'radio' | 'checkbox' | 'plugin';
  componente?: 'CRONOMETRO' | 'TEMPORIZADOR';
  options?: Array<{ label: string; value: number }>;
  min?: number;
  max?: number;
}

export interface Scale {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  preguntas: Question[];
  calcularPuntaje: (respuestas: Record<string, number>) => number;
  interpretar: (puntaje: number) => string;
}

export const scales: Scale[] = [
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
      if (puntaje === 100) return 'Independiente total';
      if (puntaje >= 60) return 'Dependencia leve';
      if (puntaje >= 40) return 'Dependencia moderada';
      if (puntaje >= 20) return 'Dependencia severa';
      return 'Dependencia total';
    }
  },
 {
  id: 'tug',
  nombre: 'Timed Up and Go (TUG)',
  categoria: 'kinesiologia',
  descripcion: 'Evaluación de movilidad y riesgo de caídas con cronómetro integrado.',
  preguntas: [
    { 
      id: 'tiempo', 
      text: 'Inicie al despegar de la silla y detenga al volver a sentarse:', 
      type: 'plugin', // Gatillo para activar el componente especial
      componente: 'CRONOMETRO' 
    }
  ],
  calcularPuntaje: (r) => Number(r.tiempo) || 0,
  interpretar: (p) => {
    if (p === 0) return 'Prueba no realizada';
    if (p <= 10) return `${p} seg: Movilidad normal (Bajo riesgo)`;
    if (p <= 20) return `${p} seg: Movilidad aceptable (Fragilidad leve)`;
    return `${p} seg: Riesgo de caídas elevado`;
  }
},
  {
    id: 'presion_manual',
    nombre: 'Escala de Presión Manual (Dinamometría)',
    categoria: 'kinesiologia',
    descripcion: 'Mide la fuerza muscular de miembros superiores en kg con dinamómetro.',
    preguntas: [{ id: 'fuerza_kg', text: 'Fuerza máxima obtenida en kilogramos (kg)', type: 'number' }],
    calcularPuntaje: (r) => Number(r.fuerza_kg) || 0,
    interpretar: (p) => {
      if (p === 0) return 'Sin datos';
      if (p < 16) return 'Fuerza baja - Riesgo de sarcopenia (Mujeres <16kg)';
      if (p < 27) return 'Fuerza baja - Riesgo sarcopenia (Hombres <27kg)';
      return 'Fuerza muscular normal';
    }
  },
  {
    id: 'fils',
    nombre: 'Escala FILS (Food Intake Level Scale)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de la severidad de la disfagia y capacidad de ingesta de alimentos.',
    preguntas: [{
      id: 'nivel_ingesta', text: 'Nivel de ingesta', type: 'select', options: [
        { label: 'Nivel 1: Nada por boca. Alt. exclusiva.', value: 1 }, { label: 'Nivel 2: Nada por boca. Solo terapia.', value: 2 },
        { label: 'Nivel 3: Alt. limitada + alternativa.', value: 3 }, { label: 'Nivel 4: Combinada. No principal vía.', value: 4 },
        { label: 'Nivel 5: Combinada. Oral 1-2 veces.', value: 5 }, { label: 'Nivel 6: Combinada. Oral 3 veces.', value: 6 },
        { label: 'Nivel 7: Vía oral exclusiva. Limitación texturas.', value: 7 }, { label: 'Nivel 8: Vía oral exclusiva. Texturas normales.', value: 8 },
        { label: 'Nivel 9: Vía oral exclusiva. Sin restricciones.', value: 9 }, { label: 'Nivel 10: Vía oral normal.', value: 10 }
      ]
    }],
    calcularPuntaje: (r) => Number(r.nivel_ingesta) || 0,
    interpretar: (p) => p <= 3 ? 'Ingesta no oral. Riesgo severo.' : p <= 6 ? 'Ingesta combinada. Riesgo moderado.' : p <= 9 ? 'Vía oral exclusiva. Riesgo leve.' : 'Ingesta normal.'
  },
  {
    id: 'sit_to_stand',
    nombre: 'Test Sit to Stand (1 minuto)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación funcional de fuerza de miembros inferiores usando cronómetro.',
    preguntas: [
      { id: 'control_tiempo', text: 'Use el cronómetro para controlar el minuto exacto:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'repeticiones', text: 'Número de repeticiones completadas en 1 minuto', type: 'number' }
    ],
    calcularPuntaje: (r) => Number(r.repeticiones) || 0,
    interpretar: (p) => p < 15 ? 'Bajo rendimiento - Riesgo de fragilidad' : 'Rendimiento funcional normal'
  },
  {
    id: 'zarit',
    nombre: 'Escala de Zarit (Sobrecarga del Cuidador)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación del nivel de sobrecarga subjetiva del cuidador principal.',
    preguntas: Array.from({ length: 22 }, (_, i) => ({
      id: `z${i + 1}`, text: `Pregunta ${i + 1}`, type: 'select', options: [
        { label: 'Nunca (0)', value: 0 }, { label: 'Casi nunca (1)', value: 1 }, { label: 'A veces (2)', value: 2 }, { label: 'Bastantes veces (3)', value: 3 }, { label: 'Casi siempre (4)', value: 4 }
      ]
    })),
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + Number(val), 0),
    interpretar: (p) => p <= 46 ? 'Ausencia de sobrecarga' : p <= 55 ? 'Sobrecarga leve' : 'Sobrecarga intensa'
  },
  {
    id: 'fim',
    nombre: 'Medida de Independencia Funcional (FIM)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de independencia funcional en actividades de la vida diaria',
    preguntas: [
      { id: 'alimentacion', text: 'Alimentación', type: 'select', options: [{ label: 'Independencia (7)', value: 7 }, { label: 'Modificada (6)', value: 6 }, { label: 'Supervisión (5)', value: 5 }, { label: 'Asist. Mínima (4)', value: 4 }, { label: 'Asist. Mod (3)', value: 3 }, { label: 'Asist. Máx (2)', value: 2 }, { label: 'Total (1)', value: 1 }] },
      { id: 'aseo', text: 'Aseo personal', type: 'select', options: [{ label: '7', value: 7 }, { label: '1', value: 1 }] },
      { id: 'bano', text: 'Baño', type: 'select', options: [{ label: '7', value: 7 }, { label: '1', value: 1 }] },
      { id: 'vestido_sup', text: 'Vestido superior', type: 'select', options: [{ label: '7', value: 7 }, { label: '1', value: 1 }] },
      { id: 'vestido_inf', text: 'Vestido inferior', type: 'select', options: [{ label: '7', value: 7 }, { label: '1', value: 1 }] },
      { id: 'wc', text: 'Uso del inodoro', type: 'select', options: [{ label: '7', value: 7 }, { label: '1', value: 1 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => p >= 36 ? 'Independencia' : p >= 24 ? 'Supervisión' : 'Asistencia moderada/máxima'
  },
  {
    id: 'lawton',
    nombre: 'Escala Lawton Brody IADL',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de actividades instrumentales de la vida diaria',
    preguntas: [
      { id: 'tel', text: 'Teléfono', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'compras', text: 'Compras', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'comida', text: 'Comida', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'hogar', text: 'Hogar', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'lavado', text: 'Lavado', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'transporte', text: 'Transporte', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'medicacion', text: 'Medicación', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] },
      { id: 'finanzas', text: 'Finanzas', type: 'select', options: [{ label: 'Independiente', value: 1 }, { label: 'Incapaz', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => p === 8 ? 'Independiente total' : p >= 5 ? 'Dep. leve' : p >= 3 ? 'Dep. moderada' : 'Dep. severa'
  },
  {
    id: 'six_minute_walk',
    nombre: 'Test de Caminata de 6 Minutos',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de capacidad funcional cardiopulmonar con monitoreo de tiempo.',
    preguntas: [
      { id: 'tiempo_control', text: 'Control del tiempo (Meta: 6 min):', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'distancia', text: 'Distancia recorrida (metros)', type: 'number' }
    ],
    calcularPuntaje: (r) => Number(r.distancia) || 0,
    interpretar: (p) => p >= 400 ? 'Buena capacidad funcional' : p >= 300 ? 'Capacidad moderada' : 'Capacidad limitada'
  },
  {
    id: 'ten_meter_walk',
    nombre: 'Test de Marcha de 10 Metros',
    categoria: 'kinesiologia',
    descripcion: 'Cálculo de velocidad de marcha (m/s) con cronómetro.',
    preguntas: [{ id: 'tiempo', text: 'Registre el tiempo de los 10 metros:', type: 'plugin', componente: 'CRONOMETRO' }],
    calcularPuntaje: (r) => {
      const t = Number(r.tiempo) || 0;
      return t === 0 ? 0 : Math.round((10 / t) * 100) / 100;
    },
    interpretar: (v) => v >= 1.0 ? `${v} m/s: Marcha independiente` : v >= 0.8 ? `${v} m/s: Marcha limitada` : 'Riesgo de caída'
  },
  {
    id: 'berg',
    nombre: 'Escala de Equilibrio de Berg',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del equilibrio. Ítems de tiempo usan cronómetro.',
    preguntas: [
      { id: 'p1', text: 'Sedente a bipedestación', type: 'select', options: [{ label: '4 - Independiente', value: 4 }, { label: '0 - Incapaz', value: 0 }] },
      { id: 'p2_timer', text: 'Bipedestación sin apoyo (Meta: 2 min)', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'p2', text: 'Puntaje Item 2:', type: 'select', options: [{ label: '4 - 2 min con seguridad', value: 4 }, { label: '0 - Incapaz', value: 0 }] }
    ],
    calcularPuntaje: (r) => (Number(r.p1) || 0) + (Number(r.p2) || 0),
    interpretar: (p) => p >= 45 ? 'Bajo riesgo' : 'Riesgo elevado'
  },
  {
    id: 'minibestest',
    nombre: 'MiniBESTest',
    categoria: 'kinesiologia',
    descripcion: 'Equilibrio en 4 sistemas',
    preguntas: [
      { id: 'ant', text: 'Postural anticipatorio', type: 'select', options: [{ label: 'Normal (2)', value: 2 }, { label: 'Mod (1)', value: 1 }, { label: 'Sev (0)', value: 0 }] },
      { id: 'reac', text: 'Ajustes reactivos', type: 'select', options: [{ label: 'Normal (2)', value: 2 }, { label: 'Mod (1)', value: 1 }, { label: 'Sev (0)', value: 0 }] },
      { id: 'sens', text: 'Sensorial', type: 'select', options: [{ label: 'Normal (2)', value: 2 }, { label: 'Mod (1)', value: 1 }, { label: 'Sev (0)', value: 0 }] },
      { id: 'din', text: 'Dinámico', type: 'select', options: [{ label: 'Normal (2)', value: 2 }, { label: 'Mod (1)', value: 1 }, { label: 'Sev (0)', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 7 ? 'Bajo riesgo' : 'Alto riesgo'
  },
  {
    id: 'tinetti',
    nombre: 'Escala de Tinetti POMA',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del equilibrio y marcha',
    preguntas: [
      { id: 'e_sent', text: 'Eq. Sentado', type: 'select', options: [{ label: '1', value: 1 }, { label: '0', value: 0 }] },
      { id: 'lev', text: 'Levantarse', type: 'select', options: [{ label: '2', value: 2 }, { label: '0', value: 0 }] },
      { id: 'int', text: 'Intentos', type: 'select', options: [{ label: '1', value: 1 }, { label: '0', value: 0 }] },
      { id: 'e_inm', text: 'Eq. Inmediato', type: 'select', options: [{ label: '1', value: 1 }, { label: '0', value: 0 }] },
      { id: 'e_pie', text: 'Eq. de pie', type: 'select', options: [{ label: '2', value: 2 }, { label: '0', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 25 ? 'Bajo riesgo' : p >= 19 ? 'Riesgo mod' : 'Alto riesgo'
  },
  {
    id: 'mrc',
    nombre: 'Escala de Fuerza Muscular MRC',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación Medical Research Council',
    preguntas: [{ id: 'f', text: 'Fuerza', type: 'select', options: [{ label: '5-Normal', value: 5 }, { label: '3-Gravedad', value: 3 }, { label: '0-Sin contracción', value: 0 }] }],
    calcularPuntaje: (r) => r.f || 0,
    interpretar: (p) => p === 5 ? 'Normal' : 'Debilidad detectada'
  },
  {
    id: 'fugl_meyer',
    nombre: 'Fugl Meyer Assessment',
    categoria: 'kinesiologia',
    descripcion: 'Recuperación post-ACV',
    preguntas: [
      { id: 'h', text: 'Hombro/Codo', type: 'select', options: [{ label: '2', value: 2 }, { label: '0', value: 0 }] },
      { id: 'm', text: 'Muñeca', type: 'select', options: [{ label: '2', value: 2 }, { label: '0', value: 0 }] },
      { id: 'ma', text: 'Mano', type: 'select', options: [{ label: '2', value: 2 }, { label: '0', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 5 ? 'Buena recuperación' : 'Recuperación pobre'
  },
  {
    id: 'trunk_control',
    nombre: 'Trunk Control Test',
    categoria: 'kinesiologia',
    descripcion: 'Control de tronco',
    preguntas: [
      { id: 'rd', text: 'Rodar débil', type: 'select', options: [{ label: '25', value: 25 }, { label: '0', value: 0 }] },
      { id: 'rs', text: 'Rodar sano', type: 'select', options: [{ label: '25', value: 25 }, { label: '0', value: 0 }] },
      { id: 's', text: 'Sentarse', type: 'select', options: [{ label: '25', value: 25 }, { label: '0', value: 0 }] },
      { id: 'e', text: 'Equilibrio', type: 'select', options: [{ label: '25', value: 25 }, { label: '0', value: 0 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p === 100 ? 'Normal' : 'Alterado'
  },
  {
    id: 'eva',
    nombre: 'Escala Visual Analógica (EVA)',
    categoria: 'kinesiologia',
    descripcion: 'Dolor del 0 al 10',
    preguntas: [{ id: 'i', text: 'Intensidad', type: 'number', min: 0, max: 10 }],
    calcularPuntaje: (r) => Number(r.i) || 0,
    interpretar: (p) => p === 0 ? 'Sin dolor' : p <= 3 ? 'Leve' : p <= 6 ? 'Mod' : 'Sev'
  },
  {
    id: 'ashworth',
    nombre: 'Escala de Ashworth Modificada',
    categoria: 'kinesiologia',
    descripcion: 'Espasticidad muscular',
    preguntas: [{ id: 'e', text: 'Grado', type: 'select', options: [{ label: '0', value: 0 }, { label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }] }],
    calcularPuntaje: (r) => r.e || 0,
    interpretar: (p) => p === 0 ? 'Normal' : 'Espasticidad detectada'
  },
  {
    id: 'eat10',
    nombre: 'EAT-10',
    categoria: 'fonoaudiologia',
    descripcion: 'Problemas de deglución',
    preguntas: Array.from({ length: 10 }, (_, i) => ({ id: `p${i + 1}`, text: `Pregunta ${i + 1}`, type: 'select', options: [{ label: '0', value: 0 }, { label: '4', value: 4 }] })),
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p <= 2 ? 'Normal' : 'Disfagia probable'
  },
  {
    id: 'mecv_v',
    nombre: 'MECV-V',
    categoria: 'fonoaudiologia',
    descripcion: 'Exploración Volumen-Viscosidad',
    preguntas: [{ id: 'n5', text: '5ml nectar', type: 'select', options: [{ label: 'OK', value: 0 }, { label: 'Tos', value: 1 }] }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p === 0 ? 'Segura' : 'Insegura'
  },
  {
    id: 'guss',
    nombre: 'GUSS',
    categoria: 'fonoaudiologia',
    descripcion: 'Screening Disfagia',
    preguntas: [{ id: 'vig', text: 'Vigilancia', type: 'select', options: [{ label: 'OK', value: 1 }, { label: 'No', value: 0 }] }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p === 5 ? 'Normal' : 'Riesgo disfagia'
  },
  {
    id: 'boston',
    nombre: 'Examen de Afasia de Boston',
    categoria: 'fonoaudiologia',
    descripcion: 'Lenguaje',
    preguntas: [{ id: 'f', text: 'Fluencia', type: 'select', options: [{ label: '5-Normal', value: 5 }, { label: '1-Mínima', value: 1 }] }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 18 ? 'Leve/Normal' : 'Afasia moderada/severa'
  },
  {
    id: 'moca',
    nombre: 'MoCA',
    categoria: 'cognitivas',
    descripcion: 'Montreal Cognitive Assessment',
    preguntas: [{ id: 'v', text: 'Visuoespacial', type: 'number', min: 0, max: 5 }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 26 ? 'Normal' : 'Deterioro'
  },
  {
    id: 'mmse',
    nombre: 'Mini Mental (MMSE)',
    categoria: 'cognitivas',
    descripcion: 'Estado mental',
    preguntas: [{ id: 'o', text: 'Orientación', type: 'number', min: 0, max: 10 }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 27 ? 'Normal' : 'Deterioro'
  },
  {
    id: 'glasgow',
    nombre: 'Escala de Glasgow',
    categoria: 'emergencias',
    descripcion: 'Nivel de conciencia',
    preguntas: [
      { id: 'o', text: 'Ocular', type: 'select', options: [{ label: '4-Esp', value: 4 }, { label: '1-Ning', value: 1 }] },
      { id: 'v', text: 'Verbal', type: 'select', options: [{ label: '5-Ori', value: 5 }, { label: '1-Ning', value: 1 }] },
      { id: 'm', text: 'Motor', type: 'select', options: [{ label: '6-Obed', value: 6 }, { label: '1-Ning', value: 1 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p === 15 ? 'Alerta' : p <= 8 ? 'Grave' : 'Moderado'
  },
  {
    id: 'rts',
    nombre: 'Revised Trauma Score (RTS)',
    categoria: 'emergencias',
    descripcion: 'Trauma fisiológico',
    preguntas: [{ id: 'g', text: 'GCS', type: 'select', options: [{ label: '13-15', value: 4 }, { label: '3', value: 0 }] }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 11 ? 'Leve' : 'Grave'
  },
  {
    id: 'fast_ed',
    nombre: 'FAST-ED',
    categoria: 'emergencias',
    descripcion: 'Detección ACV gran vaso',
    preguntas: [{ id: 'a', text: 'Asimetría', type: 'select', options: [{ label: '1', value: 1 }, { label: '0', value: 0 }] }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p >= 4 ? 'Alta Prob' : 'Baja Prob'
  },
  {
    id: 'silverman',
    nombre: 'Silverman Anderson',
    categoria: 'emergencias',
    descripcion: 'Dificultad neonatal',
    preguntas: [{ id: 't', text: 'Tiraje', type: 'select', options: [{ label: '0-Aus', value: 0 }, { label: '2-Int', value: 2 }] }],
    calcularPuntaje: (r) => Object.values(r).reduce((s, v) => s + v, 0),
    interpretar: (p) => p === 0 ? 'Normal' : 'Dificultad respiratoria'
  },
  {
    id: 'nine_hole_peg',
    nombre: 'Nine Hole Peg Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de destreza manual fina con cronómetro.',
    preguntas: [
      { id: 't_dom', text: 'Tiempo mano dominante:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 't_no_dom', text: 'Tiempo mano no dominante:', type: 'plugin', componente: 'CRONOMETRO' }
    ],
    calcularPuntaje: (r) => Math.round(((Number(r.t_dom) || 0) + (Number(r.t_no_dom) || 0)) / 2),
    interpretar: (p) => p <= 20 ? 'Normal' : 'Reducida'
  },
  {
    id: 'jebsen',
    nombre: 'Jebsen Taylor Hand Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Función manual',
    preguntas: [{ id: 'e', text: 'Escritura', type: 'number' }],
    calcularPuntaje: (r) => Number(r.e) || 0,
    interpretar: (p) => p <= 60 ? 'Normal' : 'Lenta'
  }
];

export const categories = [
  { id: 'kinesiologia', nombre: 'Kinesiología', descripcion: 'Evaluación funcional y movilidad' },
  { id: 'fonoaudiologia', nombre: 'Fonoaudiología', descripcion: 'Deglución y lenguaje' },
  { id: 'cognitivas', nombre: 'Cognitivas', descripcion: 'Estado mental' },
  { id: 'terapia_ocupacional', nombre: 'Terapia Ocupacional', descripcion: 'Función manual' },
  { id: 'emergencias', nombre: 'Emergencias', descripcion: 'Trauma y Triage' }
];