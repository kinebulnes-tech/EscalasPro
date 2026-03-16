import { Scale, InterpretacionAvanzada } from '../data/scalesData';

// Mejoramos la interfaz para que soporte tanto texto simple como interpretaciones Pro
export interface ScaleResult {
  puntaje: number;
  interpretacion: string;
  detalleCompleto: string | InterpretacionAvanzada;
  escala: string;
  categoria: string;
}

/**
 * Calcula el resultado de una escala con soporte para lógica condicional.
 * Ahora pasa 'respuestas' al intérprete para cálculos personalizados.
 */
export const calcularEscala = (
  scale: Scale,
  respuestas: Record<string, number>
): ScaleResult => {
  try {
    const puntaje = scale.calcularPuntaje(respuestas);
    
    // CRÍTICO: Pasamos 'respuestas' como segundo argumento para escalas tipo Strassmann
    const interpretacionRaw = scale.interpretar(puntaje, respuestas);

    // Normalizamos la interpretación para que siempre haya un string base
    const textoInterpretacion = typeof interpretacionRaw === 'string' 
      ? interpretacionRaw 
      : interpretacionRaw.texto;

    return {
      puntaje,
      interpretacion: textoInterpretacion,
      detalleCompleto: interpretacionRaw,
      escala: scale.nombre,
      categoria: scale.categoria
    };
  } catch (error) {
    console.error(`Error crítico en motor de cálculo (${scale.id}):`, error);
    return {
      puntaje: 0,
      interpretacion: "Error en el cálculo clínico",
      detalleCompleto: "Error interno",
      escala: scale.nombre,
      categoria: scale.categoria
    };
  }
};

/**
 * Valida la integridad de los datos antes de procesar.
 * Incluye validación de rangos numéricos para evitar errores de entrada.
 */
export const validarRespuestas = (
  scale: Scale,
  respuestas: Record<string, number>
): boolean => {
  return scale.preguntas.every(pregunta => {
    const respuesta = respuestas[pregunta.id];

    // Verifica que la pregunta haya sido respondida (soporta el valor 0)
    if (respuesta === undefined || respuesta === null) {
      return false;
    }

    // Validación de seguridad para campos numéricos (Rigor UpToDate)
    if (pregunta.type === 'number') {
      const min = pregunta.min ?? -Infinity;
      const max = pregunta.max ?? Infinity;
      return respuesta >= min && respuesta <= max;
    }

    return true;
  });
};

/**
 * Formatea el puntaje para visualización profesional.
 */
export const formatearPuntaje = (puntaje: number): string => {
  if (Number.isInteger(puntaje)) return puntaje.toString();
  
  // Para escalas con decimales (como Borg o test de 10 metros)
  return puntaje.toLocaleString('es-CL', { 
    minimumFractionDigits: 1, 
    maximumFractionDigits: 2 
  });
};