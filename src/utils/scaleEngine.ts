import { Scale, InterpretacionAvanzada } from '../data/scalesData';

// ✅ MEJORA: Puntaje puede ser null para evitar falsos "ceros" en errores
export interface ScaleResult {
  puntaje: number | null; 
  interpretacion: string;
  detalleCompleto: string | InterpretacionAvanzada;
  escala: string;
  categoria: string;
  error?: boolean; // Bandera para que la UI sepa si el cálculo es válido
}

/**
 * Calcula el resultado de una escala con blindaje clínico.
 */
export const calcularEscala = (
  scale: Scale,
  respuestas: Record<string, number>
): ScaleResult => {
  try {
    // 1. Verificamos integridad antes de calcular
    if (!validarRespuestas(scale, respuestas)) {
      throw new Error("Datos incompletos");
    }

    const puntaje = scale.calcularPuntaje(respuestas);
    
    // CRÍTICO: Pasamos 'respuestas' al intérprete
    const interpretacionRaw = scale.interpretar(puntaje, respuestas);

    const textoInterpretacion = typeof interpretacionRaw === 'string' 
      ? interpretacionRaw 
      : interpretacionRaw.texto;

    return {
      puntaje,
      interpretacion: textoInterpretacion,
      detalleCompleto: interpretacionRaw,
      escala: scale.nombre,
      categoria: scale.categoria,
      error: false
    };
  } catch (error) {
    // ✅ MEJORA: En caso de error, devolvemos null para proteger al paciente
    console.error(`🚨 Error crítico en motor (${scale.id}):`, error);
    return {
      puntaje: null,
      interpretacion: "Cálculo pendiente",
      detalleCompleto: "Por favor, complete todos los campos obligatorios.",
      escala: scale.nombre,
      categoria: scale.categoria,
      error: true
    };
  }
};

/**
 * ✅ NUEVA FUNCIÓN: Identifica exactamente qué preguntas faltan.
 * Esto es vital para resaltar los campos en rojo en el formulario.
 */
export const obtenerPreguntasFaltantes = (
  scale: Scale,
  respuestas: Record<string, number>
): string[] => {
  return scale.preguntas
    .filter(pregunta => {
      const respuesta = respuestas[pregunta.id];

      // Verifica si falta la respuesta
      if (respuesta === undefined || respuesta === null) return true;

      // Validación de rangos para tipos numéricos
      if (pregunta.type === 'number') {
        const min = pregunta.min ?? -Infinity;
        const max = pregunta.max ?? Infinity;
        return respuesta < min || respuesta > max;
      }
      return false;
    })
    .map(p => p.id);
};

/**
 * Valida la integridad de los datos.
 */
export const validarRespuestas = (
  scale: Scale,
  respuestas: Record<string, number>
): boolean => {
  return obtenerPreguntasFaltantes(scale, respuestas).length === 0;
};

/**
 * ✅ MEJORA: Formateo consistente.
 * Si el puntaje es null (error), muestra un guion doble.
 */
export const formatearPuntaje = (puntaje: number | null): string => {
  if (puntaje === null) return "--";
  
  if (Number.isInteger(puntaje)) return puntaje.toString();
  
  // Para escalas con decimales, forzamos formato profesional con coma
  return puntaje.toFixed(2).replace('.', ',');
};