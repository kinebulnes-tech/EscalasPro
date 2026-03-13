export interface Question {
  id: string;
  text: string;
  type: 'select' | 'number' | 'radio' | 'checkbox';
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
      {
        id: 'comer',
        text: 'Comer',
        type: 'select',
        options: [
          { label: 'Independiente', value: 10 },
          { label: 'Necesita ayuda', value: 5 },
          { label: 'Dependiente', value: 0 }
        ]
      },
      {
        id: 'banarse',
        text: 'Bañarse',
        type: 'select',
        options: [
          { label: 'Independiente', value: 5 },
          { label: 'Dependiente', value: 0 }
        ]
      },
      {
        id: 'vestirse',
        text: 'Vestirse',
        type: 'select',
        options: [
          { label: 'Independiente', value: 10 },
          { label: 'Necesita ayuda', value: 5 },
          { label: 'Dependiente', value: 0 }
        ]
      },
      {
        id: 'arreglarse',
        text: 'Arreglarse',
        type: 'select',
        options: [
          { label: 'Independiente', value: 5 },
          { label: 'Dependiente', value: 0 }
        ]
      },
      {
        id: 'deposiciones',
        text: 'Deposiciones',
        type: 'select',
        options: [
          { label: 'Continente', value: 10 },
          { label: 'Accidente ocasional', value: 5 },
          { label: 'Incontinente', value: 0 }
        ]
      },
      {
        id: 'miccion',
        text: 'Micción',
        type: 'select',
        options: [
          { label: 'Continente', value: 10 },
          { label: 'Accidente ocasional', value: 5 },
          { label: 'Incontinente', value: 0 }
        ]
      },
      {
        id: 'retrete',
        text: 'Usar el retrete',
        type: 'select',
        options: [
          { label: 'Independiente', value: 10 },
          { label: 'Necesita ayuda', value: 5 },
          { label: 'Dependiente', value: 0 }
        ]
      },
      {
        id: 'trasladarse',
        text: 'Trasladarse sillón/cama',
        type: 'select',
        options: [
          { label: 'Independiente', value: 15 },
          { label: 'Mínima ayuda', value: 10 },
          { label: 'Gran ayuda', value: 5 },
          { label: 'Dependiente', value: 0 }
        ]
      },
      {
        id: 'deambular',
        text: 'Deambular',
        type: 'select',
        options: [
          { label: 'Independiente', value: 15 },
          { label: 'Necesita ayuda', value: 10 },
          { label: 'Independiente en silla de ruedas', value: 5 },
          { label: 'Inmóvil', value: 0 }
        ]
      },
      {
        id: 'escalones',
        text: 'Subir y bajar escaleras',
        type: 'select',
        options: [
          { label: 'Independiente', value: 10 },
          { label: 'Necesita ayuda', value: 5 },
          { label: 'Dependiente', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 100) return 'Independiente total';
      if (puntaje >= 60) return 'Dependencia leve';
      if (puntaje >= 40) return 'Dependencia moderada';
      if (puntaje >= 20) return 'Dependencia severa';
      return 'Dependencia total';
    }
  },
  {
    id: 'presion_manual',
    nombre: 'Escala de Presión Manual (Dinamometría)',
    categoria: 'kinesiologia',
    descripcion: 'Mide la fuerza muscular de miembros superiores en kg con dinamómetro.',
    preguntas: [
      {
        id: 'fuerza_kg',
        text: 'Ingrese la fuerza máxima obtenida en kilogramos (kg)',
        type: 'number'
      }
    ],
    calcularPuntaje: (respuestas) => {
      // Como es ingreso directo numérico, retornamos el valor ingresado
      return Number(respuestas.fuerza_kg) || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin datos ingresados';
      if (puntaje < 16) return 'Fuerza baja - Riesgo de sarcopenia en mujeres (Corte EWGSOP2 < 16kg)';
      if (puntaje < 27) return 'Fuerza baja - Riesgo de sarcopenia en hombres (Corte EWGSOP2 < 27kg) / Rango normal para mujeres';
      return 'Fuerza muscular dentro de parámetros funcionales normales';
    }
  },
  {
    id: 'fils',
    nombre: 'Escala FILS (Food Intake Level Scale)',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de la severidad de la disfagia y capacidad de ingesta de alimentos.',
    preguntas: [
      {
        id: 'nivel_ingesta',
        text: 'Nivel de ingesta',
        type: 'select',
        options: [
          { label: '1. Nada por boca. Alimentación alternativa exclusiva.', value: 1 },
          { label: '2. Deglución solo posible en terapia.', value: 2 },
          { label: '3. Alimentación oral limitada + alternativa.', value: 3 },
          { label: '4. Alimentación oral exclusiva de recreación.', value: 4 },
          { label: '5. Alimentación oral exclusiva (1-2 comidas modificadas).', value: 5 },
          { label: '6. Alimentación oral exclusiva (3 comidas modificadas).', value: 6 },
          { label: '7. Dieta regular pero con limitaciones en texturas.', value: 7 },
          { label: '8. Dieta regular + texturas normales (requiere atención extra).', value: 8 },
          { label: '9. Dieta regular sin restricciones, pero con adaptaciones menores.', value: 9 },
          { label: '10. Dieta completamente normal.', value: 10 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.nivel_ingesta || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje <= 3) return 'Ingesta no oral - Riesgo severo (Niveles 1-3)';
      if (puntaje <= 6) return 'Ingesta oral y alternativa combinada - Riesgo moderado (Niveles 4-6)';
      if (puntaje <= 9) return 'Ingesta oral exclusiva con modificaciones - Riesgo leve (Niveles 7-9)';
      if (puntaje === 10) return 'Ingesta normal sin restricciones';
      return 'Sin datos';
    }
  },
  {
    id: 'sit_to_stand',
    nombre: 'Test Sit to Stand (1 minuto)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación funcional de fuerza y resistencia de miembros inferiores.',
    preguntas: [
      {
        id: 'repeticiones',
        text: 'Número de repeticiones completadas en 1 minuto',
        type: 'number'
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Number(respuestas.repeticiones) || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Prueba no realizada o 0 repeticiones';
      if (puntaje < 15) return 'Bajo rendimiento - Alto riesgo de caídas y fragilidad';
      if (puntaje >= 15 && puntaje <= 30) return 'Rendimiento moderado/promedio';
      return 'Alto rendimiento funcional';
    }
  },
  {
    id: 'zarit',
    nombre: 'Escala de Zarit (Sobrecarga del Cuidador)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación del nivel de sobrecarga subjetiva del cuidador principal.',
    preguntas: [
      ...Array.from({ length: 22 }, (_, i) => ({
        id: `z${i + 1}`,
        text: `Pregunta ${i + 1}: ${
          ['¿Siente que su familiar pide más ayuda de la que realmente necesita?',
           '¿Siente que debido al tiempo que dedica a su familiar ya no dispone de tiempo suficiente para usted?',
           '¿Se siente tenso cuando tiene que cuidar a su familiar y atender además otras responsabilidades?',
           '¿Se siente avergonzado por el comportamiento de su familiar?',
           '¿Se siente enfadado cuando está cerca de su familiar?',
           '¿Cree que la situación actual afecta de manera negativa a su relación con amigos y otros miembros de su familia?',
           '¿Siente temor por el futuro que le espera a su familiar?',
           '¿Siente que su familiar depende de usted?',
           '¿Se siente agobiado por la responsabilidad de cuidar a su familiar?',
           '¿Siente que su salud se ha resentido por cuidar a su familiar?',
           '¿Siente que no tiene la intimidad que desearía debido a su familiar?',
           '¿Siente que su vida social se ha resentido por cuidar a su familiar?',
           '¿Se siente incómodo para invitar amigos a casa a causa de su familiar?',
           '¿Cree que su familiar espera que usted le cuide como si fuera la única persona con la que puede contar?',
           '¿Cree que no dispone de dinero suficiente para cuidar a su familiar además de sus otros gastos?',
           '¿Siente que será incapaz de cuidar a su familiar por mucho más tiempo?',
           '¿Siente que ha perdido el control de su vida desde que la enfermedad de su familiar se manifestó?',
           '¿Desearía poder dejar el cuidado de su familiar a otra persona?',
           '¿Se siente indeciso sobre qué hacer con su familiar?',
           '¿Cree que debería hacer más por su familiar?',
           '¿Cree que podría cuidar mejor a su familiar?',
           'En general, ¿se siente muy sobrecargado por tener que cuidar a su familiar?'][i]
        }`,
        type: 'select',
        options: [
          { label: 'Nunca (0)', value: 0 },
          { label: 'Casi nunca (1)', value: 1 },
          { label: 'A veces (2)', value: 2 },
          { label: 'Bastantes veces (3)', value: 3 },
          { label: 'Casi siempre (4)', value: 4 }
        ]
      }))
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + Number(val), 0);
    },
    interpretar: (puntaje) => {
      if (puntaje <= 46) return 'No hay sobrecarga';
      if (puntaje <= 55) return 'Sobrecarga leve';
      return 'Sobrecarga intensa';
    }
  },
  {
    id: 'fim',
    nombre: 'Medida de Independencia Funcional (FIM)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de independencia funcional en actividades de la vida diaria',
    preguntas: [
      {
        id: 'alimentacion',
        text: 'Alimentación',
        type: 'select',
        options: [
          { label: 'Independencia completa', value: 7 },
          { label: 'Independencia modificada', value: 6 },
          { label: 'Supervisión', value: 5 },
          { label: 'Asistencia mínima', value: 4 },
          { label: 'Asistencia moderada', value: 3 },
          { label: 'Asistencia máxima', value: 2 },
          { label: 'Dependencia total', value: 1 }
        ]
      },
      {
        id: 'aseo',
        text: 'Aseo personal',
        type: 'select',
        options: [
          { label: 'Independencia completa', value: 7 },
          { label: 'Independencia modificada', value: 6 },
          { label: 'Supervisión', value: 5 },
          { label: 'Asistencia mínima', value: 4 },
          { label: 'Asistencia moderada', value: 3 },
          { label: 'Asistencia máxima', value: 2 },
          { label: 'Dependencia total', value: 1 }
        ]
      },
      {
        id: 'bano',
        text: 'Baño',
        type: 'select',
        options: [
          { label: 'Independencia completa', value: 7 },
          { label: 'Independencia modificada', value: 6 },
          { label: 'Supervisión', value: 5 },
          { label: 'Asistencia mínima', value: 4 },
          { label: 'Asistencia moderada', value: 3 },
          { label: 'Asistencia máxima', value: 2 },
          { label: 'Dependencia total', value: 1 }
        ]
      },
      {
        id: 'vestido_superior',
        text: 'Vestido mitad superior',
        type: 'select',
        options: [
          { label: 'Independencia completa', value: 7 },
          { label: 'Independencia modificada', value: 6 },
          { label: 'Supervisión', value: 5 },
          { label: 'Asistencia mínima', value: 4 },
          { label: 'Asistencia moderada', value: 3 },
          { label: 'Asistencia máxima', value: 2 },
          { label: 'Dependencia total', value: 1 }
        ]
      },
      {
        id: 'vestido_inferior',
        text: 'Vestido mitad inferior',
        type: 'select',
        options: [
          { label: 'Independencia completa', value: 7 },
          { label: 'Independencia modificada', value: 6 },
          { label: 'Supervisión', value: 5 },
          { label: 'Asistencia mínima', value: 4 },
          { label: 'Asistencia moderada', value: 3 },
          { label: 'Asistencia máxima', value: 2 },
          { label: 'Dependencia total', value: 1 }
        ]
      },
      {
        id: 'wc',
        text: 'Uso del inodoro',
        type: 'select',
        options: [
          { label: 'Independencia completa', value: 7 },
          { label: 'Independencia modificada', value: 6 },
          { label: 'Supervisión', value: 5 },
          { label: 'Asistencia mínima', value: 4 },
          { label: 'Asistencia moderada', value: 3 },
          { label: 'Asistencia máxima', value: 2 },
          { label: 'Dependencia total', value: 1 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      const maxPuntaje = 42;
      if (puntaje >= 36) return 'Independencia completa o modificada';
      if (puntaje >= 24) return 'Supervisión o asistencia mínima';
      if (puntaje >= 12) return 'Asistencia moderada a máxima';
      return 'Dependencia total o casi total';
    }
  },
  {
    id: 'lawton',
    nombre: 'Escala Lawton Brody IADL',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de actividades instrumentales de la vida diaria',
    preguntas: [
      {
        id: 'telefono',
        text: 'Capacidad para usar el teléfono',
        type: 'select',
        options: [
          { label: 'Utiliza el teléfono por iniciativa propia', value: 1 },
          { label: 'Es capaz de marcar números conocidos', value: 1 },
          { label: 'Es capaz de contestar pero no de marcar', value: 1 },
          { label: 'No es capaz de usar el teléfono', value: 0 }
        ]
      },
      {
        id: 'compras',
        text: 'Hacer compras',
        type: 'select',
        options: [
          { label: 'Realiza todas las compras necesarias independientemente', value: 1 },
          { label: 'Realiza independientemente pequeñas compras', value: 0 },
          { label: 'Necesita ir acompañado para hacer cualquier compra', value: 0 },
          { label: 'Totalmente incapaz de comprar', value: 0 }
        ]
      },
      {
        id: 'comida',
        text: 'Preparación de la comida',
        type: 'select',
        options: [
          { label: 'Organiza, prepara y sirve las comidas por sí solo', value: 1 },
          { label: 'Prepara adecuadamente las comidas si se le proporcionan los ingredientes', value: 0 },
          { label: 'Prepara, calienta y sirve las comidas, pero no sigue una dieta adecuada', value: 0 },
          { label: 'Necesita que le preparen y sirvan las comidas', value: 0 }
        ]
      },
      {
        id: 'hogar',
        text: 'Cuidado de la casa',
        type: 'select',
        options: [
          { label: 'Mantiene la casa solo o con ayuda ocasional', value: 1 },
          { label: 'Realiza tareas ligeras como lavar platos', value: 1 },
          { label: 'Realiza tareas ligeras pero no puede mantener un nivel de limpieza', value: 1 },
          { label: 'Necesita ayuda en todas las labores de la casa', value: 0 }
        ]
      },
      {
        id: 'lavado',
        text: 'Lavado de ropa',
        type: 'select',
        options: [
          { label: 'Lava por sí solo toda su ropa', value: 1 },
          { label: 'Lava por sí solo pequeñas prendas', value: 1 },
          { label: 'Todo el lavado de ropa debe ser realizado por otro', value: 0 }
        ]
      },
      {
        id: 'transporte',
        text: 'Uso de medios de transporte',
        type: 'select',
        options: [
          { label: 'Viaja solo en transporte público o conduce su propio coche', value: 1 },
          { label: 'Es capaz de tomar un taxi, pero no usa otro medio de transporte', value: 1 },
          { label: 'Viaja en transporte público cuando va acompañado por otra persona', value: 1 },
          { label: 'Utiliza el taxi o el automóvil solo con ayuda de otros', value: 0 }
        ]
      },
      {
        id: 'medicacion',
        text: 'Responsabilidad respecto a su medicación',
        type: 'select',
        options: [
          { label: 'Es capaz de tomar su medicación a la hora y dosis correcta', value: 1 },
          { label: 'Toma su medicación si la dosis le es preparada previamente', value: 0 },
          { label: 'No es capaz de administrarse su medicación', value: 0 }
        ]
      },
      {
        id: 'finanzas',
        text: 'Manejo de sus asuntos económicos',
        type: 'select',
        options: [
          { label: 'Se encarga de sus asuntos económicos por sí solo', value: 1 },
          { label: 'Realiza las compras de cada día, pero necesita ayuda en grandes compras', value: 1 },
          { label: 'Incapaz de manejar dinero', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 8) return 'Independiente total';
      if (puntaje >= 5) return 'Dependencia leve';
      if (puntaje >= 3) return 'Dependencia moderada';
      return 'Dependencia severa';
    }
  },
  {
    id: 'tug',
    nombre: 'Timed Up and Go (TUG)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de movilidad, equilibrio y riesgo de caídas',
    preguntas: [
      {
        id: 'tiempo',
        text: 'Tiempo en segundos para levantarse, caminar 3 metros, dar vuelta, regresar y sentarse',
        type: 'number',
        min: 0,
        max: 300
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.tiempo || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Prueba no realizada o sin datos';
      if (puntaje <= 10) return '< 10 seg: Movilidad y equilibrio normal. Independiente y sin problemas de movilidad en la vida diaria.';
      if (puntaje <= 20) return '11-20 seg: Movilidad aceptable para personas frágiles o con limitaciones leves.';
      if (puntaje <= 30) return '> 20 seg: Indica limitaciones funcionales significativas, mayor fragilidad y riesgo de caídas.';
      return 'Alto riesgo de caídas - Requiere evaluación detallada';
    }
  },
  {
    id: 'six_minute_walk',
    nombre: 'Test de Caminata de 6 Minutos',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de capacidad funcional cardiopulmonar',
    preguntas: [
      {
        id: 'distancia',
        text: 'Distancia recorrida en 6 minutos (metros)',
        type: 'number',
        min: 0,
        max: 1000
      },
      {
        id: 'edad',
        text: 'Edad del paciente',
        type: 'number',
        min: 18,
        max: 120
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.distancia || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje >= 500) return 'Capacidad funcional excelente';
      if (puntaje >= 400) return 'Capacidad funcional buena';
      if (puntaje >= 300) return 'Capacidad funcional moderada';
      if (puntaje >= 150) return 'Capacidad funcional limitada';
      return 'Capacidad funcional severamente limitada';
    }
  },
  {
    id: 'ten_meter_walk',
    nombre: 'Test de Marcha de 10 Metros',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de velocidad de marcha',
    preguntas: [
      {
        id: 'tiempo',
        text: 'Tiempo en segundos para recorrer 10 metros',
        type: 'number',
        min: 0,
        max: 300
      }
    ],
    calcularPuntaje: (respuestas) => {
      const tiempo = respuestas.tiempo || 0;
      if (tiempo === 0) return 0;
      return Math.round((10 / tiempo) * 100) / 100;
    },
    interpretar: (puntaje) => {
      if (puntaje >= 1.2) return 'Velocidad normal - Marcha comunitaria';
      if (puntaje >= 0.8) return 'Velocidad limitada - Marcha comunitaria limitada';
      if (puntaje >= 0.4) return 'Velocidad reducida - Marcha domiciliaria';
      return 'Velocidad muy reducida - Dependencia de asistencia';
    }
  },
  {
    id: 'berg',
    nombre: 'Escala de Equilibrio de Berg',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del equilibrio funcional en adultos mayores',
    preguntas: [
      {
        id: 'sedente_bipedo',
        text: 'Sedente a bipedestación',
        type: 'select',
        options: [
          { label: 'Capaz de levantarse sin usar las manos', value: 4 },
          { label: 'Capaz de levantarse independiente usando las manos', value: 3 },
          { label: 'Capaz de levantarse usando las manos después de varios intentos', value: 2 },
          { label: 'Necesita mínima ayuda para levantarse o estabilizarse', value: 1 },
          { label: 'Necesita ayuda moderada o máxima para levantarse', value: 0 }
        ]
      },
      {
        id: 'bipedo_sin_apoyo',
        text: 'Bipedestación sin apoyo',
        type: 'select',
        options: [
          { label: 'Capaz de permanecer de pie 2 minutos', value: 4 },
          { label: 'Capaz de permanecer de pie 2 minutos con supervisión', value: 3 },
          { label: 'Capaz de permanecer de pie 30 segundos sin apoyo', value: 2 },
          { label: 'Necesita varios intentos para permanecer 30 segundos sin apoyo', value: 1 },
          { label: 'Incapaz de permanecer de pie 30 segundos sin ayuda', value: 0 }
        ]
      },
      {
        id: 'sentado_sin_apoyo',
        text: 'Sedente sin apoyo',
        type: 'select',
        options: [
          { label: 'Capaz de sentarse 2 minutos', value: 4 },
          { label: 'Capaz de sentarse 2 minutos bajo supervisión', value: 3 },
          { label: 'Capaz de sentarse 30 segundos', value: 2 },
          { label: 'Capaz de sentarse 10 segundos', value: 1 },
          { label: 'Incapaz de sentarse sin apoyo 10 segundos', value: 0 }
        ]
      },
      {
        id: 'bipedo_sedente',
        text: 'Bipedestación a sedente',
        type: 'select',
        options: [
          { label: 'Se sienta con seguridad con uso mínimo de las manos', value: 4 },
          { label: 'Controla el descenso usando las manos', value: 3 },
          { label: 'Usa la parte posterior de las piernas contra la silla para controlar el descenso', value: 2 },
          { label: 'Se sienta independiente pero tiene descenso descontrolado', value: 1 },
          { label: 'Necesita ayuda para sentarse', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 45) return 'Bajo riesgo de caídas - Independiente';
      if (puntaje >= 36) return 'Riesgo moderado de caídas';
      if (puntaje >= 21) return 'Alto riesgo de caídas - Requiere asistencia';
      return 'Muy alto riesgo de caídas - Requiere ayuda permanente';
    }
  },
  {
    id: 'minibestest',
    nombre: 'MiniBESTest',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación breve del equilibrio en 4 sistemas de control',
    preguntas: [
      {
        id: 'anticipatorio',
        text: 'Control postural anticipatorio',
        type: 'select',
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Moderado', value: 1 },
          { label: 'Severo', value: 0 }
        ]
      },
      {
        id: 'reactivo',
        text: 'Ajustes posturales reactivos',
        type: 'select',
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Moderado', value: 1 },
          { label: 'Severo', value: 0 }
        ]
      },
      {
        id: 'sensorial',
        text: 'Orientación sensorial',
        type: 'select',
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Moderado', value: 1 },
          { label: 'Severo', value: 0 }
        ]
      },
      {
        id: 'dinamico',
        text: 'Estabilidad en marcha',
        type: 'select',
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Moderado', value: 1 },
          { label: 'Severo', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 7) return 'Bajo riesgo de caídas';
      if (puntaje >= 5) return 'Riesgo moderado de caídas';
      return 'Alto riesgo de caídas';
    }
  },
  {
    id: 'tinetti',
    nombre: 'Escala de Tinetti POMA',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del equilibrio y marcha',
    preguntas: [
      {
        id: 'equilibrio_sentado',
        text: 'Equilibrio sentado',
        type: 'select',
        options: [
          { label: 'Estable', value: 1 },
          { label: 'Inestable', value: 0 }
        ]
      },
      {
        id: 'levantarse',
        text: 'Levantarse',
        type: 'select',
        options: [
          { label: 'Capaz sin usar las manos', value: 2 },
          { label: 'Capaz usando las manos', value: 1 },
          { label: 'Incapaz', value: 0 }
        ]
      },
      {
        id: 'intentos_levantarse',
        text: 'Intentos de levantarse',
        type: 'select',
        options: [
          { label: 'Capaz al primer intento', value: 1 },
          { label: 'Necesita más de un intento', value: 0 }
        ]
      },
      {
        id: 'equilibrio_inmediato',
        text: 'Equilibrio inmediato de pie (primeros 5 segundos)',
        type: 'select',
        options: [
          { label: 'Estable', value: 1 },
          { label: 'Inestable', value: 0 }
        ]
      },
      {
        id: 'equilibrio_pie',
        text: 'Equilibrio de pie',
        type: 'select',
        options: [
          { label: 'Estable', value: 2 },
          { label: 'Inestable pero se mantiene', value: 1 },
          { label: 'Inestable', value: 0 }
        ]
      },
      {
        id: 'inicio_marcha',
        text: 'Inicio de la marcha',
        type: 'select',
        options: [
          { label: 'Comienza a caminar inmediatamente', value: 1 },
          { label: 'Comienza a caminar tras varios intentos', value: 0 }
        ]
      },
      {
        id: 'longitud_paso',
        text: 'Longitud y altura del paso',
        type: 'select',
        options: [
          { label: 'Adecuada', value: 1 },
          { label: 'Inadecuada', value: 0 }
        ]
      },
      {
        id: 'simetria_paso',
        text: 'Simetría del paso',
        type: 'select',
        options: [
          { label: 'Simétrico', value: 1 },
          { label: 'Asimétrico', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 25) return 'Bajo riesgo de caídas';
      if (puntaje >= 19) return 'Riesgo moderado de caídas';
      return 'Alto riesgo de caídas';
    }
  },
  {
    id: 'mrc',
    nombre: 'Escala de Fuerza Muscular MRC',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de fuerza muscular según Medical Research Council',
    preguntas: [
      {
        id: 'fuerza',
        text: 'Fuerza muscular observada',
        type: 'select',
        options: [
          { label: '5 - Fuerza normal', value: 5 },
          { label: '4 - Movimiento contra gravedad y resistencia', value: 4 },
          { label: '3 - Movimiento contra gravedad', value: 3 },
          { label: '2 - Movimiento con gravedad eliminada', value: 2 },
          { label: '1 - Contracción visible sin movimiento', value: 1 },
          { label: '0 - Sin contracción', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.fuerza || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 5) return 'Fuerza muscular normal';
      if (puntaje === 4) return 'Fuerza buena - Movimiento contra gravedad y resistencia';
      if (puntaje === 3) return 'Fuerza aceptable - Movimiento contra gravedad completo';
      if (puntaje === 2) return 'Fuerza pobre - Movimiento solo con gravedad eliminada';
      if (puntaje === 1) return 'Fuerza vestigial - Contracción palpable sin movimiento';
      return 'Sin contracción muscular';
    }
  },
  {
    id: 'fugl_meyer',
    nombre: 'Fugl Meyer Assessment',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de recuperación motora post-ACV',
    preguntas: [
      {
        id: 'hombro_codo',
        text: 'Función de hombro/codo/antebrazo',
        type: 'select',
        options: [
          { label: 'Realiza completamente', value: 2 },
          { label: 'Realiza parcialmente', value: 1 },
          { label: 'No puede realizar', value: 0 }
        ]
      },
      {
        id: 'muneca',
        text: 'Función de muñeca',
        type: 'select',
        options: [
          { label: 'Realiza completamente', value: 2 },
          { label: 'Realiza parcialmente', value: 1 },
          { label: 'No puede realizar', value: 0 }
        ]
      },
      {
        id: 'mano',
        text: 'Función de mano',
        type: 'select',
        options: [
          { label: 'Realiza completamente', value: 2 },
          { label: 'Realiza parcialmente', value: 1 },
          { label: 'No puede realizar', value: 0 }
        ]
      },
      {
        id: 'coordinacion',
        text: 'Coordinación/velocidad',
        type: 'select',
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Ligeramente anormal', value: 1 },
          { label: 'Marcadamente anormal', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 7) return 'Recuperación motora excelente';
      if (puntaje >= 5) return 'Recuperación motora buena';
      if (puntaje >= 3) return 'Recuperación motora moderada';
      return 'Recuperación motora pobre';
    }
  },
  {
    id: 'trunk_control',
    nombre: 'Trunk Control Test',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del control de tronco',
    preguntas: [
      {
        id: 'rodar_debil',
        text: 'Rodar hacia el lado débil',
        type: 'select',
        options: [
          { label: 'Realiza solo', value: 25 },
          { label: 'Realiza con ayuda', value: 12 },
          { label: 'No puede realizar', value: 0 }
        ]
      },
      {
        id: 'rodar_sano',
        text: 'Rodar hacia el lado sano',
        type: 'select',
        options: [
          { label: 'Realiza solo', value: 25 },
          { label: 'Realiza con ayuda', value: 12 },
          { label: 'No puede realizar', value: 0 }
        ]
      },
      {
        id: 'sentarse',
        text: 'Sentarse desde posición supina',
        type: 'select',
        options: [
          { label: 'Realiza solo', value: 25 },
          { label: 'Realiza con ayuda', value: 12 },
          { label: 'No puede realizar', value: 0 }
        ]
      },
      {
        id: 'equilibrio_sentado',
        text: 'Equilibrio sentado',
        type: 'select',
        options: [
          { label: 'Se mantiene 30 segundos', value: 25 },
          { label: 'Se mantiene menos tiempo', value: 12 },
          { label: 'No se mantiene', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 100) return 'Control de tronco normal';
      if (puntaje >= 50) return 'Control de tronco moderado';
      return 'Control de tronco severamente alterado';
    }
  },
  {
    id: 'eva',
    nombre: 'Escala Visual Analógica del Dolor (EVA)',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación subjetiva de la intensidad del dolor',
    preguntas: [
      {
        id: 'intensidad',
        text: 'Intensidad del dolor (0 = sin dolor, 10 = dolor máximo)',
        type: 'number',
        min: 0,
        max: 10
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.intensidad || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin dolor';
      if (puntaje <= 3) return 'Dolor leve';
      if (puntaje <= 6) return 'Dolor moderado';
      return 'Dolor severo';
    }
  },
  {
    id: 'escala_numerica_dolor',
    nombre: 'Escala Numérica del Dolor',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación numérica de la intensidad del dolor',
    preguntas: [
      {
        id: 'dolor',
        text: 'Nivel de dolor del 0 al 10',
        type: 'number',
        min: 0,
        max: 10
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.dolor || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin dolor';
      if (puntaje <= 3) return 'Dolor leve';
      if (puntaje <= 6) return 'Dolor moderado';
      if (puntaje <= 8) return 'Dolor severo';
      return 'Dolor insoportable';
    }
  },
  {
    id: 'mcgill',
    nombre: 'Cuestionario McGill del Dolor',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación multidimensional del dolor',
    preguntas: [
      {
        id: 'sensorial',
        text: 'Componente sensorial del dolor',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Moderado', value: 2 },
          { label: 'Severo', value: 3 }
        ]
      },
      {
        id: 'afectivo',
        text: 'Componente afectivo del dolor',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Moderado', value: 2 },
          { label: 'Severo', value: 3 }
        ]
      },
      {
        id: 'evaluativo',
        text: 'Componente evaluativo del dolor',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Moderado', value: 2 },
          { label: 'Severo', value: 3 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin dolor';
      if (puntaje <= 3) return 'Dolor leve';
      if (puntaje <= 6) return 'Dolor moderado';
      return 'Dolor severo';
    }
  },
  {
    id: 'ashworth',
    nombre: 'Escala de Ashworth Modificada',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación de espasticidad muscular',
    preguntas: [
      {
        id: 'espasticidad',
        text: 'Grado de espasticidad',
        type: 'select',
        options: [
          { label: '0 - Sin aumento del tono muscular', value: 0 },
          { label: '1 - Leve aumento del tono', value: 1 },
          { label: '1+ - Leve aumento del tono con resistencia mínima', value: 1.5 },
          { label: '2 - Aumento marcado del tono', value: 2 },
          { label: '3 - Aumento considerable del tono', value: 3 },
          { label: '4 - Parte afectada rígida', value: 4 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.espasticidad || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin espasticidad';
      if (puntaje <= 1.5) return 'Espasticidad leve';
      if (puntaje === 2) return 'Espasticidad moderada';
      if (puntaje === 3) return 'Espasticidad considerable';
      return 'Espasticidad severa - Rigidez';
    }
  },
  {
    id: 'eat10',
    nombre: 'EAT-10',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de problemas de deglución',
    preguntas: [
      {
        id: 'problema_peso',
        text: 'Mi problema de deglución me ha hecho perder peso',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_salir',
        text: 'Mi problema de deglución interfiere con mi capacidad de salir a comer',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_liquidos',
        text: 'Tragar líquidos me requiere un esfuerzo extra',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_solidos',
        text: 'Tragar sólidos me requiere un esfuerzo extra',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_pastillas',
        text: 'Tragar pastillas me requiere un esfuerzo extra',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_doloroso',
        text: 'Tragar es doloroso',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_placer',
        text: 'El placer de comer se ve afectado por mi problema de deglución',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_garganta',
        text: 'Cuando trago, la comida se pega en mi garganta',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_tos',
        text: 'Toso cuando como',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      },
      {
        id: 'problema_estresante',
        text: 'Tragar es estresante',
        type: 'select',
        options: [
          { label: 'Sin problema', value: 0 },
          { label: 'Problema leve', value: 1 },
          { label: 'Problema moderado', value: 2 },
          { label: 'Problema considerable', value: 3 },
          { label: 'Problema severo', value: 4 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje <= 2) return 'Sin disfagia - Función de deglución normal';
      if (puntaje <= 15) return 'Disfagia leve';
      if (puntaje <= 25) return 'Disfagia moderada';
      return 'Disfagia severa - Requiere evaluación urgente';
    }
  },
  {
    id: 'mecv_v',
    nombre: 'MECV-V',
    categoria: 'fonoaudiologia',
    descripcion: 'Método de Exploración Clínica Volumen-Viscosidad',
    preguntas: [
      {
        id: 'nectar_5ml',
        text: 'Deglución néctar 5ml - Seguridad',
        type: 'select',
        options: [
          { label: 'Sin alteraciones', value: 0 },
          { label: 'Tos/cambio voz', value: 1 }
        ]
      },
      {
        id: 'nectar_10ml',
        text: 'Deglución néctar 10ml - Seguridad',
        type: 'select',
        options: [
          { label: 'Sin alteraciones', value: 0 },
          { label: 'Tos/cambio voz', value: 1 }
        ]
      },
      {
        id: 'nectar_20ml',
        text: 'Deglución néctar 20ml - Seguridad',
        type: 'select',
        options: [
          { label: 'Sin alteraciones', value: 0 },
          { label: 'Tos/cambio voz', value: 1 }
        ]
      },
      {
        id: 'eficacia',
        text: 'Eficacia de la deglución',
        type: 'select',
        options: [
          { label: 'Sin residuos', value: 0 },
          { label: 'Deglución fraccionada', value: 1 },
          { label: 'Residuo oral', value: 2 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Deglución segura y eficaz';
      if (puntaje <= 2) return 'Alteración leve de la deglución';
      if (puntaje <= 4) return 'Alteración moderada - Ajustar viscosidad';
      return 'Alteración severa - Riesgo de aspiración';
    }
  },
  {
    id: 'guss',
    nombre: 'GUSS',
    categoria: 'fonoaudiologia',
    descripcion: 'Gugging Swallowing Screen',
    preguntas: [
      {
        id: 'vigilancia',
        text: 'Vigilancia',
        type: 'select',
        options: [
          { label: 'Alerta >15 min', value: 1 },
          { label: 'No cumple', value: 0 }
        ]
      },
      {
        id: 'tos_voluntaria',
        text: 'Tos voluntaria o aclaramiento',
        type: 'select',
        options: [
          { label: 'Presente', value: 1 },
          { label: 'Ausente', value: 0 }
        ]
      },
      {
        id: 'deglutir_saliva',
        text: 'Deglutir saliva',
        type: 'select',
        options: [
          { label: 'Exitoso', value: 1 },
          { label: 'No exitoso', value: 0 }
        ]
      },
      {
        id: 'deglucion_semiliquido',
        text: 'Deglución semilíquido',
        type: 'select',
        options: [
          { label: 'Sin problemas', value: 1 },
          { label: 'Con problemas', value: 0 }
        ]
      },
      {
        id: 'deglucion_liquido',
        text: 'Deglución líquido',
        type: 'select',
        options: [
          { label: 'Sin problemas', value: 1 },
          { label: 'Con problemas', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 4) return 'Bajo riesgo de disfagia - Dieta normal con precauciones';
      if (puntaje === 3) return 'Riesgo leve - Dieta blanda con supervisión';
      if (puntaje === 2) return 'Riesgo moderado - Dieta modificada';
      return 'Alto riesgo de disfagia - Vía oral no recomendada';
    }
  },
  {
    id: 'doss',
    nombre: 'DOSS',
    categoria: 'fonoaudiologia',
    descripcion: 'Dysphagia Outcome and Severity Scale',
    preguntas: [
      {
        id: 'nivel',
        text: 'Nivel de función de deglución',
        type: 'select',
        options: [
          { label: 'Nivel 7 - Normal en todas las situaciones', value: 7 },
          { label: 'Nivel 6 - Independencia funcional, modificada', value: 6 },
          { label: 'Nivel 5 - Supervisión leve o intermitente', value: 5 },
          { label: 'Nivel 4 - Supervisión intermitente con restricciones', value: 4 },
          { label: 'Nivel 3 - Supervisión total con restricciones moderadas', value: 3 },
          { label: 'Nivel 2 - Supervisión total, severas restricciones', value: 2 },
          { label: 'Nivel 1 - Vía oral no recomendada', value: 1 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.nivel || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 7) return 'Normal - Sin restricciones dietéticas';
      if (puntaje === 6) return 'Independencia funcional modificada - Estrategias compensatorias';
      if (puntaje === 5) return 'Supervisión leve - Puede necesitar señales';
      if (puntaje === 4) return 'Supervisión intermitente - Una o más restricciones';
      if (puntaje === 3) return 'Supervisión total - Múltiples restricciones';
      if (puntaje === 2) return 'Supervisión total - Severas restricciones';
      return 'Nutrición no oral - Vía oral no segura';
    }
  },
  {
    id: 'fois',
    nombre: 'FOIS',
    categoria: 'fonoaudiologia',
    descripcion: 'Functional Oral Intake Scale',
    preguntas: [
      {
        id: 'nivel',
        text: 'Nivel de ingesta oral funcional',
        type: 'select',
        options: [
          { label: 'Nivel 7 - Dieta total sin restricciones', value: 7 },
          { label: 'Nivel 6 - Dieta total con múltiples consistencias sin compensaciones', value: 6 },
          { label: 'Nivel 5 - Dieta total con múltiples consistencias requiere compensaciones', value: 5 },
          { label: 'Nivel 4 - Dieta total con una sola consistencia', value: 4 },
          { label: 'Nivel 3 - Dependencia de alimentación por tubo con ingesta oral consistente', value: 3 },
          { label: 'Nivel 2 - Dependencia de alimentación por tubo con ingesta oral mínima', value: 2 },
          { label: 'Nivel 1 - Nada por vía oral', value: 1 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.nivel || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 7) return 'Total vía oral sin restricciones';
      if (puntaje === 6) return 'Total vía oral sin compensaciones especiales';
      if (puntaje === 5) return 'Total vía oral con compensaciones';
      if (puntaje === 4) return 'Vía oral con una consistencia';
      if (puntaje === 3) return 'Alimentación por tubo con ingesta oral consistente';
      if (puntaje === 2) return 'Alimentación por tubo con ingesta oral mínima';
      return 'Nada por vía oral';
    }
  },
  {
    id: 'boston_afasia',
    nombre: 'Examen de Afasia de Boston',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación comprensiva de las capacidades del lenguaje',
    preguntas: [
      {
        id: 'fluencia',
        text: 'Fluencia del habla',
        type: 'select',
        options: [
          { label: 'Normal', value: 5 },
          { label: 'Leve reducción', value: 4 },
          { label: 'Moderada reducción', value: 3 },
          { label: 'Severa reducción', value: 2 },
          { label: 'Mínima o ausente', value: 1 }
        ]
      },
      {
        id: 'comprension_auditiva',
        text: 'Comprensión auditiva',
        type: 'select',
        options: [
          { label: 'Normal', value: 5 },
          { label: 'Leve alteración', value: 4 },
          { label: 'Moderada alteración', value: 3 },
          { label: 'Severa alteración', value: 2 },
          { label: 'Mínima o ausente', value: 1 }
        ]
      },
      {
        id: 'repeticion',
        text: 'Repetición',
        type: 'select',
        options: [
          { label: 'Normal', value: 5 },
          { label: 'Leve alteración', value: 4 },
          { label: 'Moderada alteración', value: 3 },
          { label: 'Severa alteración', value: 2 },
          { label: 'Mínima o ausente', value: 1 }
        ]
      },
      {
        id: 'denominacion',
        text: 'Denominación',
        type: 'select',
        options: [
          { label: 'Normal', value: 5 },
          { label: 'Leve alteración', value: 4 },
          { label: 'Moderada alteración', value: 3 },
          { label: 'Severa alteración', value: 2 },
          { label: 'Mínima o ausente', value: 1 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 18) return 'Afasia leve o función del lenguaje normal';
      if (puntaje >= 14) return 'Afasia moderada';
      if (puntaje >= 10) return 'Afasia moderadamente severa';
      return 'Afasia severa';
    }
  },
  {
    id: 'token_test',
    nombre: 'Token Test',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación de comprensión auditiva verbal',
    preguntas: [
      {
        id: 'parte1',
        text: 'Parte 1 - Comandos simples',
        type: 'number',
        min: 0,
        max: 10
      },
      {
        id: 'parte2',
        text: 'Parte 2 - Comandos con dos elementos',
        type: 'number',
        min: 0,
        max: 10
      },
      {
        id: 'parte3',
        text: 'Parte 3 - Comandos con modificadores',
        type: 'number',
        min: 0,
        max: 10
      },
      {
        id: 'parte4',
        text: 'Parte 4 - Comandos complejos',
        type: 'number',
        min: 0,
        max: 10
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 36) return 'Comprensión auditiva normal';
      if (puntaje >= 29) return 'Alteración leve de comprensión';
      if (puntaje >= 20) return 'Alteración moderada de comprensión';
      return 'Alteración severa de comprensión auditiva';
    }
  },
  {
    id: 'asha_facs',
    nombre: 'ASHA FACS',
    categoria: 'fonoaudiologia',
    descripcion: 'Functional Assessment of Communication Skills',
    preguntas: [
      {
        id: 'comunicacion_social',
        text: 'Comunicación social',
        type: 'select',
        options: [
          { label: 'Independiente', value: 7 },
          { label: 'Necesita ayuda mínima', value: 6 },
          { label: 'Necesita ayuda moderada', value: 5 },
          { label: 'Necesita ayuda máxima', value: 4 },
          { label: 'No funcional', value: 3 }
        ]
      },
      {
        id: 'comunicacion_basica',
        text: 'Necesidades básicas',
        type: 'select',
        options: [
          { label: 'Independiente', value: 7 },
          { label: 'Necesita ayuda mínima', value: 6 },
          { label: 'Necesita ayuda moderada', value: 5 },
          { label: 'Necesita ayuda máxima', value: 4 },
          { label: 'No funcional', value: 3 }
        ]
      },
      {
        id: 'lectura',
        text: 'Lectura/escritura/conceptos numéricos',
        type: 'select',
        options: [
          { label: 'Independiente', value: 7 },
          { label: 'Necesita ayuda mínima', value: 6 },
          { label: 'Necesita ayuda moderada', value: 5 },
          { label: 'Necesita ayuda máxima', value: 4 },
          { label: 'No funcional', value: 3 }
        ]
      },
      {
        id: 'planificacion',
        text: 'Planificación diaria',
        type: 'select',
        options: [
          { label: 'Independiente', value: 7 },
          { label: 'Necesita ayuda mínima', value: 6 },
          { label: 'Necesita ayuda moderada', value: 5 },
          { label: 'Necesita ayuda máxima', value: 4 },
          { label: 'No funcional', value: 3 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 24) return 'Comunicación funcional independiente';
      if (puntaje >= 20) return 'Comunicación funcional con ayuda mínima';
      if (puntaje >= 16) return 'Comunicación funcional con ayuda moderada';
      return 'Comunicación funcionalmente limitada';
    }
  },
  {
    id: 'grbas',
    nombre: 'GRBAS',
    categoria: 'fonoaudiologia',
    descripcion: 'Evaluación perceptual de la voz',
    preguntas: [
      {
        id: 'g_grado',
        text: 'G - Grado general de disfonía',
        type: 'select',
        options: [
          { label: '0 - Normal', value: 0 },
          { label: '1 - Leve', value: 1 },
          { label: '2 - Moderado', value: 2 },
          { label: '3 - Severo', value: 3 }
        ]
      },
      {
        id: 'r_rugosidad',
        text: 'R - Rugosidad',
        type: 'select',
        options: [
          { label: '0 - Ausente', value: 0 },
          { label: '1 - Leve', value: 1 },
          { label: '2 - Moderada', value: 2 },
          { label: '3 - Severa', value: 3 }
        ]
      },
      {
        id: 'b_soplo',
        text: 'B - Soplo',
        type: 'select',
        options: [
          { label: '0 - Ausente', value: 0 },
          { label: '1 - Leve', value: 1 },
          { label: '2 - Moderado', value: 2 },
          { label: '3 - Severo', value: 3 }
        ]
      },
      {
        id: 'a_astenia',
        text: 'A - Astenia',
        type: 'select',
        options: [
          { label: '0 - Ausente', value: 0 },
          { label: '1 - Leve', value: 1 },
          { label: '2 - Moderada', value: 2 },
          { label: '3 - Severa', value: 3 }
        ]
      },
      {
        id: 's_tension',
        text: 'S - Tensión',
        type: 'select',
        options: [
          { label: '0 - Ausente', value: 0 },
          { label: '1 - Leve', value: 1 },
          { label: '2 - Moderada', value: 2 },
          { label: '3 - Severa', value: 3 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Voz normal';
      if (puntaje <= 4) return 'Disfonía leve';
      if (puntaje <= 8) return 'Disfonía moderada';
      return 'Disfonía severa';
    }
  },
  {
    id: 'vhi',
    nombre: 'Voice Handicap Index (VHI)',
    categoria: 'fonoaudiologia',
    descripcion: 'Índice de Discapacidad Vocal',
    preguntas: [
      {
        id: 'funcional1',
        text: 'Mi voz dificulta que la gente me oiga',
        type: 'select',
        options: [
          { label: 'Nunca', value: 0 },
          { label: 'Casi nunca', value: 1 },
          { label: 'A veces', value: 2 },
          { label: 'Casi siempre', value: 3 },
          { label: 'Siempre', value: 4 }
        ]
      },
      {
        id: 'funcional2',
        text: 'Me quedo sin aire cuando hablo',
        type: 'select',
        options: [
          { label: 'Nunca', value: 0 },
          { label: 'Casi nunca', value: 1 },
          { label: 'A veces', value: 2 },
          { label: 'Casi siempre', value: 3 },
          { label: 'Siempre', value: 4 }
        ]
      },
      {
        id: 'emocional1',
        text: 'Me siento tenso cuando hablo con otros',
        type: 'select',
        options: [
          { label: 'Nunca', value: 0 },
          { label: 'Casi nunca', value: 1 },
          { label: 'A veces', value: 2 },
          { label: 'Casi siempre', value: 3 },
          { label: 'Siempre', value: 4 }
        ]
      },
      {
        id: 'fisica1',
        text: 'Mi voz varía a lo largo del día',
        type: 'select',
        options: [
          { label: 'Nunca', value: 0 },
          { label: 'Casi nunca', value: 1 },
          { label: 'A veces', value: 2 },
          { label: 'Casi siempre', value: 3 },
          { label: 'Siempre', value: 4 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje <= 14) return 'Discapacidad vocal mínima';
      if (puntaje <= 28) return 'Discapacidad vocal leve';
      if (puntaje <= 50) return 'Discapacidad vocal moderada';
      return 'Discapacidad vocal severa';
    }
  },
  {
    id: 'moca',
    nombre: 'MoCA',
    categoria: 'cognitivas',
    descripcion: 'Montreal Cognitive Assessment',
    preguntas: [
      {
        id: 'visuoespacial',
        text: 'Habilidades visuoespaciales/ejecutivas',
        type: 'number',
        min: 0,
        max: 5
      },
      {
        id: 'denominacion',
        text: 'Denominación',
        type: 'number',
        min: 0,
        max: 3
      },
      {
        id: 'memoria',
        text: 'Memoria',
        type: 'number',
        min: 0,
        max: 5
      },
      {
        id: 'atencion',
        text: 'Atención',
        type: 'number',
        min: 0,
        max: 6
      },
      {
        id: 'lenguaje',
        text: 'Lenguaje',
        type: 'number',
        min: 0,
        max: 3
      },
      {
        id: 'abstraccion',
        text: 'Abstracción',
        type: 'number',
        min: 0,
        max: 2
      },
      {
        id: 'recuerdo',
        text: 'Recuerdo diferido',
        type: 'number',
        min: 0,
        max: 5
      },
      {
        id: 'orientacion',
        text: 'Orientación',
        type: 'number',
        min: 0,
        max: 6
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 26) return 'Cognición normal';
      if (puntaje >= 18) return 'Deterioro cognitivo leve';
      return 'Deterioro cognitivo moderado a severo';
    }
  },
  {
    id: 'mmse',
    nombre: 'Mini Mental State Examination (MMSE)',
    categoria: 'cognitivas',
    descripcion: 'Evaluación breve del estado mental',
    preguntas: [
      {
        id: 'orientacion_temporal',
        text: 'Orientación temporal',
        type: 'number',
        min: 0,
        max: 5
      },
      {
        id: 'orientacion_espacial',
        text: 'Orientación espacial',
        type: 'number',
        min: 0,
        max: 5
      },
      {
        id: 'registro',
        text: 'Registro de palabras',
        type: 'number',
        min: 0,
        max: 3
      },
      {
        id: 'atencion_calculo',
        text: 'Atención y cálculo',
        type: 'number',
        min: 0,
        max: 5
      },
      {
        id: 'recuerdo',
        text: 'Recuerdo',
        type: 'number',
        min: 0,
        max: 3
      },
      {
        id: 'lenguaje',
        text: 'Lenguaje',
        type: 'number',
        min: 0,
        max: 8
      },
      {
        id: 'construccion',
        text: 'Construcción',
        type: 'number',
        min: 0,
        max: 1
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 27) return 'Cognición normal';
      if (puntaje >= 24) return 'Sin deterioro cognitivo';
      if (puntaje >= 20) return 'Deterioro cognitivo leve';
      if (puntaje >= 10) return 'Deterioro cognitivo moderado';
      return 'Deterioro cognitivo severo';
    }
  },
  {
    id: 'clock_test',
    nombre: 'Test del Reloj',
    categoria: 'cognitivas',
    descripcion: 'Evaluación de funciones ejecutivas y visuoespaciales',
    preguntas: [
      {
        id: 'circulo',
        text: 'Dibuja círculo cerrado',
        type: 'select',
        options: [
          { label: 'Sí', value: 1 },
          { label: 'No', value: 0 }
        ]
      },
      {
        id: 'numeros',
        text: 'Coloca correctamente los 12 números',
        type: 'select',
        options: [
          { label: 'Todos correctos', value: 2 },
          { label: 'Parcialmente correctos', value: 1 },
          { label: 'Incorrectos', value: 0 }
        ]
      },
      {
        id: 'agujas',
        text: 'Coloca las agujas en la hora indicada',
        type: 'select',
        options: [
          { label: 'Correctas', value: 2 },
          { label: 'Parcialmente correctas', value: 1 },
          { label: 'Incorrectas', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 4) return 'Normal - Sin alteraciones visuoespaciales';
      if (puntaje >= 2) return 'Alteración leve';
      return 'Alteración moderada a severa - Sugiere deterioro cognitivo';
    }
  },
  {
    id: 'nine_hole_peg',
    nombre: 'Nine Hole Peg Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de destreza manual fina',
    preguntas: [
      {
        id: 'tiempo_dominante',
        text: 'Tiempo mano dominante (segundos)',
        type: 'number',
        min: 0,
        max: 300
      },
      {
        id: 'tiempo_no_dominante',
        text: 'Tiempo mano no dominante (segundos)',
        type: 'number',
        min: 0,
        max: 300
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Math.round((respuestas.tiempo_dominante + respuestas.tiempo_no_dominante) / 2);
    },
    interpretar: (puntaje) => {
      if (puntaje <= 20) return 'Destreza manual normal';
      if (puntaje <= 30) return 'Destreza manual levemente reducida';
      if (puntaje <= 50) return 'Destreza manual moderadamente reducida';
      return 'Destreza manual severamente reducida';
    }
  },
  {
    id: 'box_block',
    nombre: 'Box and Block Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de destreza manual gruesa',
    preguntas: [
      {
        id: 'bloques_dominante',
        text: 'Número de bloques transferidos con mano dominante',
        type: 'number',
        min: 0,
        max: 150
      },
      {
        id: 'bloques_no_dominante',
        text: 'Número de bloques transferidos con mano no dominante',
        type: 'number',
        min: 0,
        max: 150
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Math.round((respuestas.bloques_dominante + respuestas.bloques_no_dominante) / 2);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 75) return 'Función manual excelente';
      if (puntaje >= 60) return 'Función manual buena';
      if (puntaje >= 45) return 'Función manual moderada';
      if (puntaje >= 30) return 'Función manual limitada';
      return 'Función manual severamente limitada';
    }
  },
  {
    id: 'jebsen_taylor',
    nombre: 'Jebsen Taylor Hand Function Test',
    categoria: 'terapia_ocupacional',
    descripcion: 'Evaluación de función manual en tareas específicas',
    preguntas: [
      {
        id: 'escritura',
        text: 'Tiempo para escribir oración (segundos)',
        type: 'number',
        min: 0,
        max: 300
      },
      {
        id: 'girar_cartas',
        text: 'Tiempo para girar cartas (segundos)',
        type: 'number',
        min: 0,
        max: 300
      },
      {
        id: 'objetos_pequenos',
        text: 'Tiempo para manipular objetos pequeños (segundos)',
        type: 'number',
        min: 0,
        max: 300
      },
      {
        id: 'alimentacion',
        text: 'Tiempo para simular alimentación (segundos)',
        type: 'number',
        min: 0,
        max: 300
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje <= 60) return 'Función manual normal';
      if (puntaje <= 120) return 'Función manual levemente reducida';
      if (puntaje <= 240) return 'Función manual moderadamente reducida';
      return 'Función manual severamente reducida';
    }
  },
  {
    id: 'copm',
    nombre: 'Canadian Occupational Performance Measure (COPM)',
    categoria: 'terapia_ocupacional',
    descripcion: 'Medida del desempeño ocupacional',
    preguntas: [
      {
        id: 'desempeno',
        text: 'Puntuación de desempeño (1-10)',
        type: 'number',
        min: 1,
        max: 10
      },
      {
        id: 'satisfaccion',
        text: 'Puntuación de satisfacción (1-10)',
        type: 'number',
        min: 1,
        max: 10
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Math.round((respuestas.desempeno + respuestas.satisfaccion) / 2);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 8) return 'Desempeño ocupacional excelente';
      if (puntaje >= 6) return 'Desempeño ocupacional bueno';
      if (puntaje >= 4) return 'Desempeño ocupacional moderado';
      return 'Desempeño ocupacional limitado - Requiere intervención';
    }
  },
  {
    id: 'glasgow',
    nombre: 'Escala de Glasgow',
    categoria: 'emergencias',
    descripcion: 'Evaluación del nivel de conciencia',
    preguntas: [
      {
        id: 'apertura_ocular',
        text: 'Apertura ocular',
        type: 'select',
        options: [
          { label: 'Espontánea', value: 4 },
          { label: 'A la voz', value: 3 },
          { label: 'Al dolor', value: 2 },
          { label: 'Ninguna', value: 1 }
        ]
      },
      {
        id: 'respuesta_verbal',
        text: 'Respuesta verbal',
        type: 'select',
        options: [
          { label: 'Orientado', value: 5 },
          { label: 'Confuso', value: 4 },
          { label: 'Palabras inapropiadas', value: 3 },
          { label: 'Sonidos incomprensibles', value: 2 },
          { label: 'Ninguna', value: 1 }
        ]
      },
      {
        id: 'respuesta_motora',
        text: 'Respuesta motora',
        type: 'select',
        options: [
          { label: 'Obedece órdenes', value: 6 },
          { label: 'Localiza el dolor', value: 5 },
          { label: 'Retira al dolor', value: 4 },
          { label: 'Flexión anormal', value: 3 },
          { label: 'Extensión anormal', value: 2 },
          { label: 'Ninguna', value: 1 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 15) return 'Alerta y orientado - TEC leve o sin TEC';
      if (puntaje >= 13) return 'TEC leve';
      if (puntaje >= 9) return 'TEC moderado';
      if (puntaje >= 6) return 'TEC grave';
      return 'TEC muy grave - Mal pronóstico';
    }
  },
  {
    id: 'rts',
    nombre: 'Revised Trauma Score (RTS)',
    categoria: 'emergencias',
    descripcion: 'Evaluación fisiológica del trauma',
    preguntas: [
      {
        id: 'glasgow',
        text: 'Glasgow Coma Score',
        type: 'select',
        options: [
          { label: '13-15', value: 4 },
          { label: '9-12', value: 3 },
          { label: '6-8', value: 2 },
          { label: '4-5', value: 1 },
          { label: '3', value: 0 }
        ]
      },
      {
        id: 'presion_sistolica',
        text: 'Presión arterial sistólica',
        type: 'select',
        options: [
          { label: '>89 mmHg', value: 4 },
          { label: '76-89 mmHg', value: 3 },
          { label: '50-75 mmHg', value: 2 },
          { label: '1-49 mmHg', value: 1 },
          { label: '0 mmHg', value: 0 }
        ]
      },
      {
        id: 'frecuencia_respiratoria',
        text: 'Frecuencia respiratoria',
        type: 'select',
        options: [
          { label: '10-29 rpm', value: 4 },
          { label: '>29 rpm', value: 3 },
          { label: '6-9 rpm', value: 2 },
          { label: '1-5 rpm', value: 1 },
          { label: '0 rpm', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 11) return 'Trauma leve - Alta probabilidad de supervivencia';
      if (puntaje >= 8) return 'Trauma moderado - Requiere monitorización';
      if (puntaje >= 5) return 'Trauma severo - Riesgo moderado';
      return 'Trauma crítico - Alta mortalidad';
    }
  },
  {
    id: 'start_triage',
    nombre: 'START Triage',
    categoria: 'emergencias',
    descripcion: 'Sistema de triage para múltiples víctimas',
    preguntas: [
      {
        id: 'camina',
        text: 'Capacidad de caminar',
        type: 'select',
        options: [
          { label: 'Sí - Heridas menores', value: 1 },
          { label: 'No', value: 0 }
        ]
      },
      {
        id: 'respiracion',
        text: 'Respiración',
        type: 'select',
        options: [
          { label: 'Presente y <30 rpm', value: 2 },
          { label: 'Presente y >30 rpm', value: 3 },
          { label: 'Ausente inicialmente, presente tras abrir vía aérea', value: 3 },
          { label: 'Ausente tras abrir vía aérea', value: 4 }
        ]
      },
      {
        id: 'perfusion',
        text: 'Perfusión (llenado capilar)',
        type: 'select',
        options: [
          { label: '<2 segundos', value: 2 },
          { label: '>2 segundos', value: 3 }
        ]
      },
      {
        id: 'estado_mental',
        text: 'Estado mental',
        type: 'select',
        options: [
          { label: 'Obedece órdenes', value: 2 },
          { label: 'No obedece órdenes', value: 3 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      if (respuestas.camina === 1) return 1;
      if (respuestas.respiracion === 4) return 4;
      if (respuestas.respiracion === 3) return 3;
      if (respuestas.perfusion === 3) return 3;
      if (respuestas.estado_mental === 3) return 3;
      return 2;
    },
    interpretar: (puntaje) => {
      if (puntaje === 1) return 'VERDE - Heridas menores, puede esperar';
      if (puntaje === 2) return 'AMARILLO - Requiere atención, no inmediata';
      if (puntaje === 3) return 'ROJO - Atención inmediata, salvable';
      return 'NEGRO - Fallecido o muerte inminente';
    }
  },
  {
    id: 'jumpstart',
    nombre: 'JumpSTART',
    categoria: 'emergencias',
    descripcion: 'Triage pediátrico para múltiples víctimas',
    preguntas: [
      {
        id: 'camina',
        text: 'Capacidad de caminar',
        type: 'select',
        options: [
          { label: 'Sí', value: 1 },
          { label: 'No', value: 0 }
        ]
      },
      {
        id: 'respiracion',
        text: 'Respiración',
        type: 'select',
        options: [
          { label: 'Espontánea 15-45 rpm', value: 2 },
          { label: 'Espontánea <15 o >45 rpm', value: 3 },
          { label: 'Presente tras 5 ventilaciones', value: 3 },
          { label: 'Ausente tras 5 ventilaciones', value: 4 }
        ]
      },
      {
        id: 'pulso',
        text: 'Pulso palpable',
        type: 'select',
        options: [
          { label: 'Presente', value: 2 },
          { label: 'Ausente', value: 3 }
        ]
      },
      {
        id: 'avpu',
        text: 'Estado mental (AVPU)',
        type: 'select',
        options: [
          { label: 'A o V (alerta o responde a voz)', value: 2 },
          { label: 'P o U (responde a dolor o no responde)', value: 3 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      if (respuestas.camina === 1) return 1;
      if (respuestas.respiracion === 4) return 4;
      if (respuestas.respiracion === 3) return 3;
      if (respuestas.pulso === 3) return 3;
      if (respuestas.avpu === 3) return 3;
      return 2;
    },
    interpretar: (puntaje) => {
      if (puntaje === 1) return 'VERDE - Heridas menores';
      if (puntaje === 2) return 'AMARILLO - Requiere atención diferida';
      if (puntaje === 3) return 'ROJO - Atención inmediata';
      return 'NEGRO - Fallecido';
    }
  },
  {
    id: 'crams',
    nombre: 'CRAMS',
    categoria: 'emergencias',
    descripcion: 'Evaluación prehospitalaria del trauma',
    preguntas: [
      {
        id: 'circulacion',
        text: 'Circulación',
        type: 'select',
        options: [
          { label: 'Llenado capilar normal y PA >100', value: 2 },
          { label: 'Llenado capilar retardado o PA 85-100', value: 1 },
          { label: 'Sin llenado capilar o PA <85', value: 0 }
        ]
      },
      {
        id: 'respiracion',
        text: 'Respiración',
        type: 'select',
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Anormal (laboriosa, superficial)', value: 1 },
          { label: 'Ausente', value: 0 }
        ]
      },
      {
        id: 'abdomen',
        text: 'Abdomen',
        type: 'select',
        options: [
          { label: 'Sin dolor', value: 2 },
          { label: 'Dolor a la palpación', value: 1 },
          { label: 'Rígido o penetrante', value: 0 }
        ]
      },
      {
        id: 'motor',
        text: 'Respuesta motora',
        type: 'select',
        options: [
          { label: 'Normal (obedece órdenes)', value: 2 },
          { label: 'Responde solo al dolor', value: 1 },
          { label: 'Sin respuesta', value: 0 }
        ]
      },
      {
        id: 'habla',
        text: 'Habla',
        type: 'select',
        options: [
          { label: 'Normal', value: 2 },
          { label: 'Confusa o inapropiada', value: 1 },
          { label: 'Sin habla', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 9) return 'Trauma menor - Buen pronóstico';
      if (puntaje >= 7) return 'Trauma moderado - Requiere monitorización';
      if (puntaje >= 5) return 'Trauma severo - Alto riesgo';
      return 'Trauma crítico - Muy alto riesgo';
    }
  },
  {
    id: 'qsofa',
    nombre: 'qSOFA',
    categoria: 'emergencias',
    descripcion: 'Detección rápida de sepsis',
    preguntas: [
      {
        id: 'frecuencia_respiratoria',
        text: 'Frecuencia respiratoria ≥22 rpm',
        type: 'select',
        options: [
          { label: 'Sí', value: 1 },
          { label: 'No', value: 0 }
        ]
      },
      {
        id: 'alteracion_conciencia',
        text: 'Alteración del estado de conciencia',
        type: 'select',
        options: [
          { label: 'Sí', value: 1 },
          { label: 'No', value: 0 }
        ]
      },
      {
        id: 'presion_arterial',
        text: 'Presión arterial sistólica ≤100 mmHg',
        type: 'select',
        options: [
          { label: 'Sí', value: 1 },
          { label: 'No', value: 0 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 2) return 'Alto riesgo de sepsis - Requiere evaluación urgente y monitorización';
      return 'Bajo riesgo de sepsis - Continuar vigilancia';
    }
  },
  {
    id: 'news2',
    nombre: 'NEWS2',
    categoria: 'emergencias',
    descripcion: 'National Early Warning Score 2',
    preguntas: [
      {
        id: 'frecuencia_respiratoria',
        text: 'Frecuencia respiratoria',
        type: 'select',
        options: [
          { label: '12-20 rpm', value: 0 },
          { label: '9-11 rpm', value: 1 },
          { label: '21-24 rpm', value: 2 },
          { label: '<9 o >24 rpm', value: 3 }
        ]
      },
      {
        id: 'saturacion',
        text: 'Saturación de oxígeno',
        type: 'select',
        options: [
          { label: '≥96%', value: 0 },
          { label: '94-95%', value: 1 },
          { label: '92-93%', value: 2 },
          { label: '≤91%', value: 3 }
        ]
      },
      {
        id: 'presion_sistolica',
        text: 'Presión arterial sistólica',
        type: 'select',
        options: [
          { label: '111-219 mmHg', value: 0 },
          { label: '101-110 mmHg', value: 1 },
          { label: '91-100 mmHg', value: 2 },
          { label: '≤90 o ≥220 mmHg', value: 3 }
        ]
      },
      {
        id: 'frecuencia_cardiaca',
        text: 'Frecuencia cardíaca',
        type: 'select',
        options: [
          { label: '51-90 lpm', value: 0 },
          { label: '41-50 o 91-110 lpm', value: 1 },
          { label: '111-130 lpm', value: 2 },
          { label: '≤40 o ≥131 lpm', value: 3 }
        ]
      },
      {
        id: 'conciencia',
        text: 'Nivel de conciencia',
        type: 'select',
        options: [
          { label: 'Alerta', value: 0 },
          { label: 'Responde a voz, dolor o no responde', value: 3 }
        ]
      },
      {
        id: 'temperatura',
        text: 'Temperatura',
        type: 'select',
        options: [
          { label: '36.1-38.0°C', value: 0 },
          { label: '35.1-36.0 o 38.1-39.0°C', value: 1 },
          { label: '≤35.0 o ≥39.1°C', value: 2 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Bajo riesgo - Cuidado clínico rutinario';
      if (puntaje <= 4) return 'Bajo-Medio riesgo - Aumentar frecuencia de monitorización';
      if (puntaje <= 6) return 'Medio riesgo - Revisión urgente por clínico';
      return 'Alto riesgo - Evaluación inmediata por equipo de respuesta rápida';
    }
  },
  {
    id: 'cincinnati',
    nombre: 'Escala Cincinnati para ACV',
    categoria: 'emergencias',
    descripcion: 'Detección prehospitalaria de accidente cerebrovascular',
    preguntas: [
      {
        id: 'asimetria_facial',
        text: 'Asimetría facial (sonreír)',
        type: 'select',
        options: [
          { label: 'Normal - ambos lados se mueven igual', value: 0 },
          { label: 'Anormal - un lado no se mueve', value: 1 }
        ]
      },
      {
        id: 'debilidad_brazos',
        text: 'Debilidad en brazos (extender con ojos cerrados)',
        type: 'select',
        options: [
          { label: 'Normal - ambos brazos se mueven igual', value: 0 },
          { label: 'Anormal - un brazo cae', value: 1 }
        ]
      },
      {
        id: 'alteracion_habla',
        text: 'Alteración del habla',
        type: 'select',
        options: [
          { label: 'Normal - palabras correctas', value: 0 },
          { label: 'Anormal - arrastra palabras o no puede hablar', value: 1 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Bajo riesgo de ACV';
      if (puntaje === 1) return 'Probabilidad de ACV - Activar código ACV';
      return 'Alta probabilidad de ACV - Activar código ACV urgente';
    }
  },
  {
    id: 'fast_ed',
    nombre: 'FAST-ED',
    categoria: 'emergencias',
    descripcion: 'Detección de ACV de gran vaso',
    preguntas: [
      {
        id: 'asimetria_facial',
        text: 'Asimetría facial',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Presente', value: 1 }
        ]
      },
      {
        id: 'debilidad_brazo',
        text: 'Debilidad de brazo',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Severa', value: 2 }
        ]
      },
      {
        id: 'alteracion_habla',
        text: 'Alteración del habla',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Severa', value: 2 }
        ]
      },
      {
        id: 'desviacion_mirada',
        text: 'Desviación de la mirada',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Presente', value: 2 }
        ]
      },
      {
        id: 'negligencia',
        text: 'Negligencia/inatención',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Presente', value: 2 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 4) return 'Alta probabilidad de oclusión de gran vaso - Considerar centro trombectomía';
      if (puntaje >= 2) return 'Probabilidad moderada de ACV - Evaluación neurológica urgente';
      return 'Baja probabilidad de oclusión de gran vaso';
    }
  },
  {
    id: 'race',
    nombre: 'RACE',
    categoria: 'emergencias',
    descripcion: 'Rapid Arterial Occlusion Evaluation',
    preguntas: [
      {
        id: 'facial',
        text: 'Parálisis facial',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Leve', value: 1 },
          { label: 'Moderada a severa', value: 2 }
        ]
      },
      {
        id: 'brazo',
        text: 'Paresia de brazo',
        type: 'select',
        options: [
          { label: 'Ausente o leve', value: 0 },
          { label: 'Moderada', value: 1 },
          { label: 'Severa', value: 2 }
        ]
      },
      {
        id: 'pierna',
        text: 'Paresia de pierna',
        type: 'select',
        options: [
          { label: 'Ausente o leve', value: 0 },
          { label: 'Moderada', value: 1 },
          { label: 'Severa', value: 2 }
        ]
      },
      {
        id: 'mirada',
        text: 'Desviación de la mirada',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Presente', value: 1 }
        ]
      },
      {
        id: 'afasia_agnosia',
        text: 'Afasia o agnosia',
        type: 'select',
        options: [
          { label: 'Realiza ambas tareas correctamente', value: 0 },
          { label: 'Realiza una tarea correctamente', value: 1 },
          { label: 'No realiza ninguna tarea', value: 2 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje >= 5) return 'Alta sospecha de oclusión de gran vaso - Trasladar a centro trombectomía';
      if (puntaje >= 2) return 'Sospecha moderada - Evaluación neurológica urgente';
      return 'Baja probabilidad de oclusión de gran vaso';
    }
  },
  {
    id: 'flacc',
    nombre: 'Escala FLACC de dolor pediátrico',
    categoria: 'emergencias',
    descripcion: 'Evaluación de dolor en niños no verbales',
    preguntas: [
      {
        id: 'cara',
        text: 'Cara',
        type: 'select',
        options: [
          { label: 'Sin expresión particular o sonrisa', value: 0 },
          { label: 'Muecas o ceño fruncido ocasional', value: 1 },
          { label: 'Mandíbula apretada, temblor de mentón frecuente', value: 2 }
        ]
      },
      {
        id: 'piernas',
        text: 'Piernas',
        type: 'select',
        options: [
          { label: 'Posición normal o relajada', value: 0 },
          { label: 'Inquieto, tenso', value: 1 },
          { label: 'Patadas o piernas encogidas', value: 2 }
        ]
      },
      {
        id: 'actividad',
        text: 'Actividad',
        type: 'select',
        options: [
          { label: 'Acostado tranquilo, posición normal', value: 0 },
          { label: 'Se retuerce, va y viene, tenso', value: 1 },
          { label: 'Arqueado, rígido o con sacudidas', value: 2 }
        ]
      },
      {
        id: 'llanto',
        text: 'Llanto',
        type: 'select',
        options: [
          { label: 'Sin llanto (despierto o dormido)', value: 0 },
          { label: 'Gemidos o lloriqueos, quejas ocasionales', value: 1 },
          { label: 'Llanto continuo, grito o sollozo', value: 2 }
        ]
      },
      {
        id: 'consuelo',
        text: 'Consuelo',
        type: 'select',
        options: [
          { label: 'Contenido, relajado', value: 0 },
          { label: 'Se tranquiliza al tocarlo, abrazarlo o al hablarle', value: 1 },
          { label: 'Difícil de consolar o confortar', value: 2 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin dolor - Relajado y cómodo';
      if (puntaje <= 3) return 'Dolor leve - Molestia leve';
      if (puntaje <= 6) return 'Dolor moderado - Requiere analgesia';
      return 'Dolor severo - Requiere analgesia inmediata';
    }
  },
  {
    id: 'mallampati',
    nombre: 'Escala Mallampati',
    categoria: 'emergencias',
    descripcion: 'Predicción de vía aérea difícil',
    preguntas: [
      {
        id: 'clase',
        text: 'Visualización de estructuras orofaríngeas',
        type: 'select',
        options: [
          { label: 'Clase I - Paladar blando, úvula, fauces, pilares visibles', value: 1 },
          { label: 'Clase II - Paladar blando, úvula, fauces visibles', value: 2 },
          { label: 'Clase III - Paladar blando, base de úvula visible', value: 3 },
          { label: 'Clase IV - Solo paladar duro visible', value: 4 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return respuestas.clase || 0;
    },
    interpretar: (puntaje) => {
      if (puntaje === 1) return 'Clase I - Intubación fácil';
      if (puntaje === 2) return 'Clase II - Intubación sin dificultad';
      if (puntaje === 3) return 'Clase III - Intubación moderadamente difícil';
      return 'Clase IV - Intubación difícil - Preparar equipo especializado';
    }
  },
  {
    id: 'silverman',
    nombre: 'Silverman Anderson',
    categoria: 'emergencias',
    descripcion: 'Evaluación de dificultad respiratoria neonatal',
    preguntas: [
      {
        id: 'torax_superior',
        text: 'Movimiento toracoabdominal',
        type: 'select',
        options: [
          { label: 'Rítmico y regular', value: 0 },
          { label: 'Retraso inspiratorio', value: 1 },
          { label: 'Bamboleo (tórax/abdomen)', value: 2 }
        ]
      },
      {
        id: 'tiraje_intercostal',
        text: 'Tiraje intercostal',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Discreto', value: 1 },
          { label: 'Intenso', value: 2 }
        ]
      },
      {
        id: 'retraccion_xifoidea',
        text: 'Retracción xifoidea',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Discreta', value: 1 },
          { label: 'Intensa', value: 2 }
        ]
      },
      {
        id: 'aleteo_nasal',
        text: 'Aleteo nasal',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Discreto', value: 1 },
          { label: 'Intenso', value: 2 }
        ]
      },
      {
        id: 'quejido_espiratorio',
        text: 'Quejido espiratorio',
        type: 'select',
        options: [
          { label: 'Ausente', value: 0 },
          { label: 'Audible con estetoscopio', value: 1 },
          { label: 'Audible sin estetoscopio', value: 2 }
        ]
      }
    ],
    calcularPuntaje: (respuestas) => {
      return Object.values(respuestas).reduce((sum, val) => sum + val, 0);
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin dificultad respiratoria';
      if (puntaje <= 3) return 'Dificultad respiratoria leve';
      if (puntaje <= 6) return 'Dificultad respiratoria moderada - Requiere oxígeno';
      return 'Dificultad respiratoria severa - Requiere soporte ventilatorio';
    }
  }
];

export const categories = [
  { id: 'kinesiologia', nombre: 'Kinesiología', descripcion: 'Escalas de evaluación funcional, movilidad y rehabilitación' },
  { id: 'fonoaudiologia', nombre: 'Fonoaudiología', descripcion: 'Escalas de deglución, lenguaje y comunicación' },
  { id: 'cognitivas', nombre: 'Evaluación Cognitiva', descripcion: 'Escalas de función cognitiva y deterioro' },
  { id: 'terapia_ocupacional', nombre: 'Terapia Ocupacional', descripcion: 'Escalas de función manual y desempeño ocupacional' },
  { id: 'emergencias', nombre: 'Emergencias', descripcion: 'Escalas de triage, trauma y emergencias prehospitalarias' }
];
