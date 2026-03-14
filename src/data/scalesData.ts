export interface Question {
  id: string;
  text: string;
  type: 'select' | 'number' | 'radio' | 'checkbox' | 'plugin';
  componente?: 'CRONOMETRO' | 'TEMPORIZADOR';
  options?: Array<{ label: string; value: number }>;
  min?: number;
  max?: number;
}

// NUEVA INTERFAZ: Define la estructura de las recomendaciones
export interface InterpretacionAvanzada {
  texto: string;
  recomendaciones: string[];
}

export interface Scale {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  preguntas: Question[];
  calcularPuntaje: (respuestas: Record<string, number>) => number;
  // ACTUALIZACIÓN: Ahora acepta texto simple o el nuevo formato avanzado
  interpretar: (puntaje: number) => string | InterpretacionAvanzada;
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
    id: 'presion_manual',
    nombre: 'Escala de Presión Manual (Dinamometría)',
    categoria: 'kinesiologia',
    descripcion: 'Mide la fuerza muscular de miembros superiores en kg con dinamómetro.',
    preguntas: [
      { id: 'fuerza_kg', text: 'Ingrese la fuerza máxima obtenida en kilogramos (kg)', type: 'number' }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.fuerza_kg) || 0,
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
      if (puntaje === 0) return 'Sin datos ingresados';
      if (puntaje <= 3) return 'Niveles 1-3: Ingesta no oral. Riesgo severo (Dependencia de vía alternativa).';
      if (puntaje <= 6) return 'Niveles 4-6: Ingesta oral y alternativa combinada. Riesgo moderado.';
      if (puntaje <= 9) return 'Niveles 7-9: Ingesta oral exclusiva con modificaciones/precauciones. Riesgo leve.';
      return 'Nivel 10: Ingesta normal sin restricciones.';
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
      if (puntaje === 0) return 'Sin datos o sin sobrecarga aparente';
      if (puntaje <= 46) return 'Ausencia de sobrecarga (0-46 pts)';
      if (puntaje <= 55) return 'Sobrecarga leve o ligera (47-55 pts)';
      return 'Sobrecarga intensa (56-88 pts) - Requiere intervención de apoyo';
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
      { id: 'tiempo', text: 'Inicie el cronómetro al despegar de la silla y deténgalo al volver a sentarse:', type: 'plugin', componente: 'CRONOMETRO' }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.tiempo) || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Prueba no realizada o sin datos';
      if (puntaje <= 10) return '< 10 seg: Movilidad normal. Bajo riesgo.';
      if (puntaje <= 20) return '11-20 seg: Movilidad aceptable. Fragilidad leve.';
      if (puntaje <= 30) return '> 20 seg: Limitación funcional significativa. Mayor riesgo de caídas.';
      return 'Alto riesgo de caídas - Requiere evaluación detallada';
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
      { id: 'tiempo', text: 'Registre el tiempo al recorrer los 10 metros:', type: 'plugin', componente: 'CRONOMETRO' }
    ],
    calcularPuntaje: (respuestas) => {
      const tiempo = Number(respuestas.tiempo) || 0;
      if (tiempo === 0) return 0;
      return Math.round((10 / tiempo) * 100) / 100;
    },
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin datos';
      if (puntaje >= 1.0) return 'Velocidad normal - Marcha comunitaria independiente (> 1.0 m/s)';
      if (puntaje >= 0.8) return 'Velocidad limitada - Marcha comunitaria limitada (0.8 - 0.99 m/s)';
      if (puntaje >= 0.4) return 'Velocidad reducida - Marcha domiciliaria, riesgo de caídas (0.4 - 0.79 m/s)';
      return 'Velocidad muy reducida - Dependencia, alto riesgo (< 0.4 m/s)';
    }
  },
  {
    id: 'berg',
    nombre: 'Escala de Equilibrio de Berg',
    categoria: 'kinesiologia',
    descripcion: 'Evaluación del equilibrio funcional en adultos mayores',
    preguntas: [
      { id: 'cronometro', text: 'Apoyo visual: Para ítems que requieren tiempo (Ej. 2 minutos sin apoyo)', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'sedente_bipedo', text: 'Sedente a bipedestación', type: 'select', options: [{ label: 'Capaz sin usar las manos', value: 4 }, { label: 'Independiente usando las manos', value: 3 }, { label: 'Varios intentos', value: 2 }, { label: 'Mínima ayuda', value: 1 }, { label: 'Ayuda moderada/máxima', value: 0 }] },
      { id: 'bipedo_sin_apoyo', text: 'Bipedestación sin apoyo', type: 'select', options: [{ label: '2 minutos seguro', value: 4 }, { label: '2 minutos con supervisión', value: 3 }, { label: '30 segundos sin apoyo', value: 2 }, { label: 'Varios intentos para 30s', value: 1 }, { label: 'Incapaz 30s', value: 0 }] },
      { id: 'sentado_sin_apoyo', text: 'Sedente sin apoyo', type: 'select', options: [{ label: '2 minutos seguro', value: 4 }, { label: '2 minutos supervisión', value: 3 }, { label: '30 segundos', value: 2 }, { label: '10 segundos', value: 1 }, { label: 'Incapaz 10s', value: 0 }] },
      { id: 'bipedo_sedente', text: 'Bipedestación a sedente', type: 'select', options: [{ label: 'Seguro uso mínimo manos', value: 4 }, { label: 'Controla con manos', value: 3 }, { label: 'Usa piernas contra silla', value: 2 }, { label: 'Descenso descontrolado', value: 1 }, { label: 'Necesita ayuda', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => {
      // Ignorar el ID 'cronometro' para no sumar sus segundos al puntaje total
      return Object.entries(respuestas).reduce((sum, [key, val]) => key === 'cronometro' ? sum : sum + Number(val), 0);
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
      { id: 'anticipatorio', text: 'Control postural anticipatorio', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] },
      { id: 'reactivo', text: 'Ajustes posturales reactivos', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] },
      { id: 'sensorial', text: 'Orientación sensorial', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] },
      { id: 'dinamico', text: 'Estabilidad en marcha', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Moderado', value: 1 }, { label: 'Severo', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'fuerza', text: 'Fuerza muscular observada', type: 'select', options: [{ label: '5 - Fuerza normal', value: 5 }, { label: '4 - Movimiento contra gravedad y resistencia', value: 4 }, { label: '3 - Movimiento contra gravedad', value: 3 }, { label: '2 - Movimiento con gravedad eliminada', value: 2 }, { label: '1 - Contracción visible sin movimiento', value: 1 }, { label: '0 - Sin contracción', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.fuerza || 0,
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
      { id: 'hombro_codo', text: 'Función de hombro/codo/antebrazo', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'muneca', text: 'Función de muñeca', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'mano', text: 'Función de mano', type: 'select', options: [{ label: 'Realiza completamente', value: 2 }, { label: 'Realiza parcialmente', value: 1 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'coordinacion', text: 'Coordinación/velocidad', type: 'select', options: [{ label: 'Normal', value: 2 }, { label: 'Ligeramente anormal', value: 1 }, { label: 'Marcadamente anormal', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'rodar_debil', text: 'Rodar hacia el lado débil', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'rodar_sano', text: 'Rodar hacia el lado sano', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'sentarse', text: 'Sentarse desde posición supina', type: 'select', options: [{ label: 'Realiza solo', value: 25 }, { label: 'Realiza con ayuda', value: 12 }, { label: 'No puede realizar', value: 0 }] },
      { id: 'equilibrio_sentado', text: 'Equilibrio sentado', type: 'select', options: [{ label: 'Se mantiene 30 segundos', value: 25 }, { label: 'Se mantiene menos tiempo', value: 12 }, { label: 'No se mantiene', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'intensidad', text: 'Intensidad del dolor (0 = sin dolor, 10 = dolor máximo)', type: 'number', min: 0, max: 10 }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.intensidad) || 0,
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
      { id: 'dolor', text: 'Nivel de dolor del 0 al 10', type: 'number', min: 0, max: 10 }
    ],
    calcularPuntaje: (respuestas) => Number(respuestas.dolor) || 0,
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
      { id: 'sensorial', text: 'Componente sensorial del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] },
      { id: 'afectivo', text: 'Componente afectivo del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] },
      { id: 'evaluativo', text: 'Componente evaluativo del dolor', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Moderado', value: 2 }, { label: 'Severo', value: 3 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'espasticidad', text: 'Grado de espasticidad', type: 'select', options: [{ label: '0 - Sin aumento del tono', value: 0 }, { label: '1 - Leve aumento', value: 1 }, { label: '1+ - Leve con resistencia mínima', value: 1.5 }, { label: '2 - Aumento marcado', value: 2 }, { label: '3 - Aumento considerable', value: 3 }, { label: '4 - Rígido', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.espasticidad || 0,
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin espasticidad';
      if (puntaje <= 1.5) return 'Espasticidad leve';
      if (puntaje === 2) return 'Espasticidad moderada';
      if (puntaje === 3) return 'Espasticidad considerable';
      return 'Espasticidad severa - Rigidez';
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
      { id: 'nectar_5ml', text: 'Deglución néctar 5ml - Seguridad', type: 'select', options: [{ label: 'Sin alteraciones', value: 0 }, { label: 'Tos/cambio voz', value: 1 }] },
      { id: 'nectar_10ml', text: 'Deglución néctar 10ml - Seguridad', type: 'select', options: [{ label: 'Sin alteraciones', value: 0 }, { label: 'Tos/cambio voz', value: 1 }] },
      { id: 'nectar_20ml', text: 'Deglución néctar 20ml - Seguridad', type: 'select', options: [{ label: 'Sin alteraciones', value: 0 }, { label: 'Tos/cambio voz', value: 1 }] },
      { id: 'eficacia', text: 'Eficacia de la deglución', type: 'select', options: [{ label: 'Sin residuos', value: 0 }, { label: 'Deglución fraccionada', value: 1 }, { label: 'Residuo oral', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'vigilancia', text: 'Vigilancia', type: 'select', options: [{ label: 'Alerta >15 min', value: 1 }, { label: 'No cumple', value: 0 }] },
      { id: 'tos_voluntaria', text: 'Tos voluntaria o aclaramiento', type: 'select', options: [{ label: 'Presente', value: 1 }, { label: 'Ausente', value: 0 }] },
      { id: 'deglutir_saliva', text: 'Deglutir saliva', type: 'select', options: [{ label: 'Exitoso', value: 1 }, { label: 'No exitoso', value: 0 }] },
      { id: 'deglucion_semiliquido', text: 'Deglución semilíquido', type: 'select', options: [{ label: 'Sin problemas', value: 1 }, { label: 'Con problemas', value: 0 }] },
      { id: 'deglucion_liquido', text: 'Deglución líquido', type: 'select', options: [{ label: 'Sin problemas', value: 1 }, { label: 'Con problemas', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'nivel', text: 'Nivel de función de deglución', type: 'select', options: [{ label: 'Nivel 7 - Normal', value: 7 }, { label: 'Nivel 6 - Modificada', value: 6 }, { label: 'Nivel 5 - Supervisión leve', value: 5 }, { label: 'Nivel 4 - Intermitente', value: 4 }, { label: 'Nivel 3 - Total mod.', value: 3 }, { label: 'Nivel 2 - Total severa', value: 2 }, { label: 'Nivel 1 - No oral', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.nivel || 0,
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
      { id: 'nivel', text: 'Nivel de ingesta oral', type: 'select', options: [{ label: 'Nivel 7 - Total sin restricción', value: 7 }, { label: 'Nivel 6 - Total sin compensación', value: 6 }, { label: 'Nivel 5 - Total con compensación', value: 5 }, { label: 'Nivel 4 - Única consistencia', value: 4 }, { label: 'Nivel 3 - Tubo + oral consistente', value: 3 }, { label: 'Nivel 2 - Tubo + oral mínima', value: 2 }, { label: 'Nivel 1 - Nada oral', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.nivel || 0,
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
      { id: 'fluencia', text: 'Fluencia del habla', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] },
      { id: 'comprension_auditiva', text: 'Comprensión auditiva', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] },
      { id: 'repeticion', text: 'Repetición', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] },
      { id: 'denominacion', text: 'Denominación', type: 'select', options: [{ label: 'Normal', value: 5 }, { label: 'Leve', value: 4 }, { label: 'Moderada', value: 3 }, { label: 'Severa', value: 2 }, { label: 'Mínima/ausente', value: 1 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'parte1', text: 'Parte 1 - Comandos simples', type: 'number', min: 0, max: 10 },
      { id: 'parte2', text: 'Parte 2 - Comandos con dos elementos', type: 'number', min: 0, max: 10 },
      { id: 'parte3', text: 'Parte 3 - Comandos con modificadores', type: 'number', min: 0, max: 10 },
      { id: 'parte4', text: 'Parte 4 - Comandos complejos', type: 'number', min: 0, max: 10 }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'comunicacion_social', text: 'Comunicación social', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] },
      { id: 'comunicacion_basica', text: 'Necesidades básicas', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] },
      { id: 'lectura', text: 'Lectura/escritura/conceptos', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] },
      { id: 'planificacion', text: 'Planificación diaria', type: 'select', options: [{ label: 'Independiente', value: 7 }, { label: 'Ayuda mínima', value: 6 }, { label: 'Ayuda moderada', value: 5 }, { label: 'Ayuda máxima', value: 4 }, { label: 'No funcional', value: 3 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'g_grado', text: 'G - Grado general', type: 'select', options: [{ label: '0 - Normal', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderado', value: 2 }, { label: '3 - Severo', value: 3 }] },
      { id: 'r_rugosidad', text: 'R - Rugosidad', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderada', value: 2 }, { label: '3 - Severa', value: 3 }] },
      { id: 'b_soplo', text: 'B - Soplo', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderado', value: 2 }, { label: '3 - Severo', value: 3 }] },
      { id: 'a_astenia', text: 'A - Astenia', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderada', value: 2 }, { label: '3 - Severa', value: 3 }] },
      { id: 's_tension', text: 'S - Tensión', type: 'select', options: [{ label: '0 - Ausente', value: 0 }, { label: '1 - Leve', value: 1 }, { label: '2 - Moderada', value: 2 }, { label: '3 - Severa', value: 3 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
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
      { id: 'funcional1', text: 'Mi voz dificulta que me oigan', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] },
      { id: 'funcional2', text: 'Me quedo sin aire', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] },
      { id: 'emocional1', text: 'Me siento tenso al hablar', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] },
      { id: 'fisica1', text: 'Mi voz varía en el día', type: 'select', options: [{ label: 'Nunca', value: 0 }, { label: 'Casi nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Casi siempre', value: 3 }, { label: 'Siempre', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje <= 14) return 'Discapacidad vocal mínima';
      if (puntaje <= 28) return 'Discapacidad vocal leve';
      if (puntaje <= 50) return 'Discapacidad vocal moderada';
      return 'Discapacidad vocal severa';
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
      { id: 'circulo', text: 'Dibuja círculo cerrado', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'numeros', text: 'Coloca correctamente los 12 números', type: 'select', options: [{ label: 'Todos', value: 2 }, { label: 'Parcial', value: 1 }, { label: 'Incorrectos', value: 0 }] },
      { id: 'agujas', text: 'Coloca las agujas en la hora indicada', type: 'select', options: [{ label: 'Correctas', value: 2 }, { label: 'Parcial', value: 1 }, { label: 'Incorrectas', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje >= 4) return 'Normal - Sin alteraciones visuoespaciales';
      if (puntaje >= 2) return 'Alteración leve';
      return 'Alteración moderada a severa - Sugiere deterioro cognitivo';
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
      if (puntaje === 0) return 'Sin datos';
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
      { id: 'bloques_dominante', text: 'Bloques mano dominante', type: 'number', min: 0, max: 150 },
      { id: 'bloques_no_dominante', text: 'Bloques mano no dominante', type: 'number', min: 0, max: 150 }
    ],
    calcularPuntaje: (r) => Math.round(((Number(r.bloques_dominante) || 0) + (Number(r.bloques_no_dominante) || 0)) / 2),
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin datos';
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
      { id: 'escritura', text: 'Tiempo escritura:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'girar_cartas', text: 'Tiempo girar cartas:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'objetos_pequenos', text: 'Tiempo manipular objetos:', type: 'plugin', componente: 'CRONOMETRO' },
      { id: 'alimentacion', text: 'Tiempo simular alimentación:', type: 'plugin', componente: 'CRONOMETRO' }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin datos';
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
      { id: 'desempeno', text: 'Puntuación de desempeño (1-10)', type: 'number', min: 1, max: 10 },
      { id: 'satisfaccion', text: 'Puntuación de satisfacción (1-10)', type: 'number', min: 1, max: 10 }
    ],
    calcularPuntaje: (r) => Math.round(((Number(r.desempeno) || 0) + (Number(r.satisfaccion) || 0)) / 2),
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin datos';
      if (puntaje >= 8) return 'Desempeño excelente';
      if (puntaje >= 6) return 'Desempeño bueno';
      if (puntaje >= 4) return 'Desempeño moderado';
      return 'Desempeño limitado - Requiere intervención';
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
      if (puntaje === 15) return 'Alerta y orientado';
      if (puntaje >= 13) return 'TEC leve';
      if (puntaje >= 9) return 'TEC moderado';
      if (puntaje >= 6) return 'TEC grave';
      return 'TEC muy grave';
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
      if (puntaje >= 11) return 'Trauma leve - Supervivencia alta';
      if (puntaje >= 8) return 'Trauma moderado';
      if (puntaje >= 5) return 'Trauma severo';
      return 'Trauma crítico';
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
      if (puntaje === 1) return 'Prioridad 3 (VERDE) - Menor';
      if (puntaje === 2) return 'Prioridad 2 (AMARILLO) - Diferida';
      if (puntaje === 3) return 'Prioridad 1 (ROJO) - Inmediata';
      if (puntaje === 4) return 'Prioridad 0 (NEGRO) - Fallecido';
      return 'Triage incompleto';
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
      if (puntaje === 1) return 'Prioridad 3 (VERDE)';
      if (puntaje === 2) return 'Prioridad 2 (AMARILLO)';
      if (puntaje === 3) return 'Prioridad 1 (ROJO)';
      if (puntaje === 4) return 'Prioridad 0 (NEGRO)';
      return 'Triage incompleto';
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
      if (puntaje >= 9) return 'Trauma menor';
      if (puntaje >= 7) return 'Trauma moderado';
      if (puntaje >= 5) return 'Trauma severo';
      return 'Trauma crítico';
    }
  },
  {
    id: 'qsofa',
    nombre: 'qSOFA',
    categoria: 'emergencias',
    descripcion: 'Detección rápida de sepsis',
    preguntas: [
      { id: 'fr', text: 'Frecuencia respiratoria ≥22 rpm', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'conciencia', text: 'Alteración del estado mental', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] },
      { id: 'pa', text: 'Presión arterial sistólica ≤100 mmHg', type: 'select', options: [{ label: 'Sí', value: 1 }, { label: 'No', value: 0 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => puntaje >= 2 ? 'Alto riesgo de sepsis' : 'Bajo riesgo'
  },
  {
    id: 'news2',
    nombre: 'NEWS2',
    categoria: 'emergencias',
    descripcion: 'National Early Warning Score 2',
    preguntas: [
      { id: 'fr', text: 'Frecuencia respiratoria', type: 'select', options: [{ label: '12-20', value: 0 }, { label: '9-11', value: 1 }, { label: '21-24', value: 2 }, { label: '<9 o >24', value: 3 }] },
      { id: 'sat', text: 'Saturación', type: 'select', options: [{ label: '≥96%', value: 0 }, { label: '94-95%', value: 1 }, { label: '92-93%', value: 2 }, { label: '≤91%', value: 3 }] },
      { id: 'pa', text: 'Presión sistólica', type: 'select', options: [{ label: '111-219', value: 0 }, { label: '101-110', value: 1 }, { label: '91-100', value: 2 }, { label: '≤90 o ≥220', value: 3 }] },
      { id: 'fc', text: 'Frecuencia cardíaca', type: 'select', options: [{ label: '51-90', value: 0 }, { label: '41-50 o 91-110', value: 1 }, { label: '111-130', value: 2 }, { label: '≤40 o ≥131', value: 3 }] },
      { id: 'conciencia', text: 'Nivel de conciencia', type: 'select', options: [{ label: 'Alerta', value: 0 }, { label: 'Voz/Dolor/No responde', value: 3 }] },
      { id: 'temp', text: 'Temperatura', type: 'select', options: [{ label: '36.1-38.0', value: 0 }, { label: '35.1-36.0 o 38.1-39.0', value: 1 }, { label: '≤35.0 o ≥39.1', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Riesgo Bajo';
      if (puntaje <= 4) return 'Riesgo Medio-Bajo';
      if (puntaje <= 6) return 'Riesgo Medio';
      return 'Riesgo Alto - Respuesta Rápida';
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
    interpretar: (puntaje) => puntaje >= 1 ? 'Alta probabilidad de ACV' : 'Baja probabilidad'
  },
  {
    id: 'fast_ed',
    nombre: 'FAST-ED',
    categoria: 'emergencias',
    descripcion: 'Detección de ACV de gran vaso',
    preguntas: [
      { id: 'asimetria', text: 'Asimetría facial', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Presente', value: 1 }] },
      { id: 'brazo', text: 'Debilidad de brazo', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Severa', value: 2 }] },
      { id: 'habla', text: 'Alteración del habla', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Leve', value: 1 }, { label: 'Severa', value: 2 }] },
      { id: 'mirada', text: 'Desviación de la mirada', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Presente', value: 2 }] },
      { id: 'negligencia', text: 'Negligencia/inatención', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Presente', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => puntaje >= 4 ? 'Alta prob. oclusión gran vaso' : 'Probabilidad moderada/baja'
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
    interpretar: (puntaje) => puntaje >= 5 ? 'Alta sospecha oclusión gran vaso' : 'Sospecha moderada/baja'
  },
  {
    id: 'flacc',
    nombre: 'Escala FLACC de dolor pediátrico',
    categoria: 'emergencias',
    descripcion: 'Evaluación de dolor en niños no verbales',
    preguntas: [
      { id: 'cara', text: 'Cara', type: 'select', options: [{ label: 'Sin expresión', value: 0 }, { label: 'Muecas', value: 1 }, { label: 'Temblor mentón', value: 2 }] },
      { id: 'piernas', text: 'Piernas', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'Inquieto', value: 1 }, { label: 'Patadas', value: 2 }] },
      { id: 'actividad', text: 'Actividad', type: 'select', options: [{ label: 'Tranquilo', value: 0 }, { label: 'Se retuerce', value: 1 }, { label: 'Rígido', value: 2 }] },
      { id: 'llanto', text: 'Llanto', type: 'select', options: [{ label: 'Sin llanto', value: 0 }, { label: 'Quejas', value: 1 }, { label: 'Grito', value: 2 }] },
      { id: 'consuelo', text: 'Consuelo', type: 'select', options: [{ label: 'Relajado', value: 0 }, { label: 'Se tranquiliza al tacto', value: 1 }, { label: 'Difícil consolar', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin dolor';
      if (puntaje <= 3) return 'Dolor leve';
      if (puntaje <= 6) return 'Dolor moderado';
      return 'Dolor severo';
    }
  },
  {
    id: 'mallampati',
    nombre: 'Escala Mallampati',
    categoria: 'emergencias',
    descripcion: 'Predicción de vía aérea difícil',
    preguntas: [
      { id: 'clase', text: 'Visualización', type: 'select', options: [{ label: 'Clase I (Total)', value: 1 }, { label: 'Clase II', value: 2 }, { label: 'Clase III', value: 3 }, { label: 'Clase IV (Solo paladar duro)', value: 4 }] }
    ],
    calcularPuntaje: (respuestas) => respuestas.clase || 0,
    interpretar: (puntaje) => {
      if (puntaje <= 2) return 'Intubación fácil/sin dificultad';
      if (puntaje === 3) return 'Intubación moderadamente difícil';
      return 'Intubación difícil - Equipo especial';
    }
  },
  {
    id: 'silverman',
    nombre: 'Silverman Anderson',
    categoria: 'emergencias',
    descripcion: 'Evaluación de dificultad respiratoria neonatal',
    preguntas: [
      { id: 'torax', text: 'Movimiento toracoabdominal', type: 'select', options: [{ label: 'Rítmico', value: 0 }, { label: 'Retraso inspiratorio', value: 1 }, { label: 'Bamboleo', value: 2 }] },
      { id: 'tiraje', text: 'Tiraje intercostal', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Discreto', value: 1 }, { label: 'Intenso', value: 2 }] },
      { id: 'xifoides', text: 'Retracción xifoidea', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Discreta', value: 1 }, { label: 'Intensa', value: 2 }] },
      { id: 'aleteo', text: 'Aleteo nasal', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Discreto', value: 1 }, { label: 'Intenso', value: 2 }] },
      { id: 'quejido', text: 'Quejido espiratorio', type: 'select', options: [{ label: 'Ausente', value: 0 }, { label: 'Audible estetoscopio', value: 1 }, { label: 'Audible sin estetoscopio', value: 2 }] }
    ],
    calcularPuntaje: (respuestas) => Object.values(respuestas).reduce((sum, val) => sum + val, 0),
    interpretar: (puntaje) => {
      if (puntaje === 0) return 'Sin dificultad respiratoria';
      if (puntaje <= 3) return 'Dificultad leve';
      if (puntaje <= 6) return 'Dificultad moderada';
      return 'Dificultad severa';
    }
  },

  // ==========================================
  // ENFERMERÍA (NUEVAS)
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
      if (p <= 12) return 'Alto Riesgo de UPP - Requiere prevención estricta';
      if (p <= 14) return 'Riesgo Moderado de UPP';
      if (p <= 16) return 'Bajo Riesgo de UPP';
      return 'Sin Riesgo (17-23 pts)';
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
      { id: 'actividad', text: 'Actividad', type: 'select', options: [{ label: '4 - Ambulante', value: 4 }, { label: '3 - Camina con ayuda', value: 3 }, { label: '2 - Sentado', value: 2 }, { label: '1 - Encamado', value: 1 }] },
      { id: 'movilidad', text: 'Movilidad', type: 'select', options: [{ label: '4 - Total', value: 4 }, { label: '3 - Disminuida', value: 3 }, { label: '2 - Muy Limitada', value: 2 }, { label: '1 - Inmóvil', value: 1 }] },
      { id: 'incontinencia', text: 'Incontinencia', type: 'select', options: [{ label: '4 - Ninguna', value: 4 }, { label: '3 - Ocasional', value: 3 }, { label: '2 - Urinaria o Fecal', value: 2 }, { label: '1 - Urinaria y Fecal', value: 1 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p <= 11) return 'Riesgo Muy Alto de UPP';
      if (p <= 14) return 'Riesgo Evidente de UPP';
      return 'Riesgo Mínimo o Nulo (15-20 pts)';
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
      if (p >= 45) return 'Riesgo Alto de Caída - Medidas estrictas';
      if (p >= 25) return 'Riesgo Medio de Caída';
      return 'Riesgo Bajo de Caída';
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
    interpretar: (p) => p >= 3 ? 'Alto Riesgo de Caída (≥3 pts)' : 'Bajo Riesgo de Caída'
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
      if (p === 1) return 'Agitación / Ansiedad';
      if (p === 2 || p === 3) return 'Sedación Consciente';
      if (p === 4 || p === 5) return 'Sedación Profunda';
      if (p === 6) return 'Coma';
      return 'Sin datos';
    }
  },
  {
    id: 'vip_phlebitis',
    nombre: 'Escala VIP (Flebitis)',
    categoria: 'enfermeria',
    descripcion: 'Visual Infusion Phlebitis Score.',
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
      if (p === 0) return 'Vía permeable.';
      if (p === 1) return 'Posible flebitis. Observar.';
      if (p === 2) return 'Flebitis temprana. REUBICAR.';
      if (p === 3) return 'Flebitis media. REUBICAR y tratar.';
      if (p >= 4) return 'Tromboflebitis. RETIRAR y tratar.';
      return 'Sin datos';
    }
  },
  {
    id: 'campbell',
    nombre: 'Escala de Campbell',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del dolor en pacientes no comunicativos.',
    preguntas: [
      { id: 'facial', text: 'Musculatura facial', type: 'select', options: [{ label: 'Relajada', value: 0 }, { label: 'Tensa', value: 1 }, { label: 'Muecas', value: 2 }] },
      { id: 'tranquilidad', text: 'Tranquilidad', type: 'select', options: [{ label: 'Tranquilo', value: 0 }, { label: 'Mov. ocasionales', value: 1 }, { label: 'Agitación', value: 2 }] },
      { id: 'tono', text: 'Tono muscular', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'Aumentado', value: 1 }, { label: 'Rígido', value: 2 }] },
      { id: 'ventilacion', text: 'Ventilación / Respuesta', type: 'select', options: [{ label: 'Tolerancia normal', value: 0 }, { label: 'Tose / Se queja', value: 1 }, { label: 'Lucha con ventilador', value: 2 }] },
      { id: 'consuelo', text: 'Consolabilidad', type: 'select', options: [{ label: 'No necesita', value: 0 }, { label: 'Se consuela', value: 1 }, { label: 'Difícil de consolar', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p === 0) return 'Sin dolor';
      if (p <= 3) return 'Dolor Leve';
      if (p <= 6) return 'Dolor Moderado - Analgesia';
      return 'Dolor Severo - Analgesia URGENTE';
    }
  },
  {
    id: 'malinas',
    nombre: 'Escala de Malinas',
    categoria: 'enfermeria',
    descripcion: 'Evaluación del riesgo de parto inminente.',
    preguntas: [
      { id: 'paridad', text: 'Nº partos anteriores', type: 'select', options: [{ label: 'Ninguno', value: 0 }, { label: '1 a 2', value: 1 }, { label: '3 o más', value: 2 }] },
      { id: 'tiempo', text: 'Duración trabajo de parto', type: 'select', options: [{ label: '< 3 horas', value: 0 }, { label: '3 a 5 horas', value: 1 }, { label: '> 5 horas', value: 2 }] },
      { id: 'duracion', text: 'Duración contracción', type: 'select', options: [{ label: '< 1 minuto', value: 0 }, { label: '~ 1 minuto', value: 1 }, { label: '> 1 minuto', value: 2 }] },
      { id: 'intervalo', text: 'Intervalo contracciones', type: 'select', options: [{ label: '> 5 min', value: 0 }, { label: '3 a 5 min', value: 1 }, { label: '< 3 min', value: 2 }] },
      { id: 'bolsa', text: 'Rotura de membranas', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Reciente (<1h)', value: 1 }, { label: '> 1 hora', value: 2 }] }
    ],
    calcularPuntaje: (r) => Object.values(r).reduce((sum, val) => sum + val, 0),
    interpretar: (p) => {
      if (p < 5) return 'Posible traslado hospitalario.';
      if (p <= 6) return 'Peligro inminente - Evaluar traslado.';
      return 'Parto Inminente (≥7) - NO TRASLADAR.';
    }
  }
];

export const categories = [
  { id: 'kinesiologia', nombre: 'Kinesiología', descripcion: 'Evaluación funcional y movilidad' },
  { id: 'fonoaudiologia', nombre: 'Fonoaudiología', descripcion: 'Deglución y lenguaje' },
  { id: 'cognitivas', nombre: 'Cognitivas', descripcion: 'Estado mental' },
  { id: 'terapia_ocupacional', nombre: 'Terapia Ocupacional', descripcion: 'Función manual' },
  { id: 'emergencias', nombre: 'Emergencias', descripcion: 'Trauma y Triage' },
  { id: 'enfermeria', nombre: 'Enfermería', descripcion: 'Valoración de cuidados y riesgos' }
];