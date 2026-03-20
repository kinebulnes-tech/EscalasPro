// src/core/scaleEngine.ts

/**
 * ARCHIVO: scaleEngine.ts (Motor de Cálculo Clínico)
 * UBICACIÓN: src/core/
 * DESCRIPCIÓN: Este archivo es el "cerebro" puro del sistema. 
 * No debe importar nada de React ni de la interfaz de usuario.
 */

import { Scale, InterpretacionAvanzada } from '../data/scalesData';

/**
 * Estructura del resultado final de cualquier evaluación.
 * El uso de 'null' en puntaje es una medida de seguridad clínica.
 */
export interface ScaleResult {
  puntaje: number | null; 
  interpretacion: string;
  detalleCompleto: string | InterpretacionAvanzada;
  escala: string;
  categoria: string;
  error: boolean;
}

/**
 * Función principal: Ejecuta el cálculo y la interpretación.
 * Blindada para evitar que errores de datos produzcan resultados falsos.
 */
export const calcularEscala = (
  scale: Scale,
  respuestas: Record<string, any>
): ScaleResult => {
  try {
    // 1. Verificamos que no falten campos obligatorios o haya valores fuera de rango
    const camposFaltantes = obtenerPreguntasFaltantes(scale, respuestas);
    
    if (camposFaltantes.length > 0) {
      throw new Error(`Integridad de datos fallida: faltan ${camposFaltantes.length} campos.`);
    }

    // 2. Ejecutamos la fórmula matemática definida en la data
    const puntaje = scale.calcularPuntaje(respuestas);
    
    // 3. Obtenemos la interpretación clínica basada en el puntaje
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
  } catch (err) {
    // En software médico, ante la duda, devolvemos 'null' y bandera de error.
    // Nunca debemos inventar un puntaje (ej: devolver 0) si el cálculo falla.
    console.error(`🚨 Error en ScaleEngine [${scale.id}]:`, err);
    
    return {
      puntaje: null,
      interpretacion: "Cálculo no disponible",
      detalleCompleto: "Error interno en la validación de la escala.",
      escala: scale.nombre,
      categoria: scale.categoria,
      error: true
    };
  }
};

/**
 * Validador de consistencia: 
 * Revisa si todas las preguntas tienen una respuesta válida y dentro de los límites.
 */
export const obtenerPreguntasFaltantes = (
  scale: Scale,
  respuestas: Record<string, any>
): string[] => {
  return scale.preguntas
    .filter(pregunta => {
      const respuesta = respuestas[pregunta.id];

      // Caso 1: La pregunta no ha sido respondida
      if (respuesta === undefined || respuesta === null || respuesta === "") return true;

      // Caso 2: Validación de rangos para campos numéricos (evita errores de ingreso)
      if (pregunta.type === 'number') {
        const valorNum = Number(respuesta);
        const min = pregunta.min ?? -Infinity;
        const max = pregunta.max ?? Infinity;
        return isNaN(valorNum) || valorNum < min || valorNum > max;
      }
      
      return false;
    })
    .map(p => p.id);
};

/**
 * Valida si el formulario está listo para ser procesado.
 */
export const validarRespuestas = (
  scale: Scale,
  respuestas: Record<string, any>
): boolean => {
  return obtenerPreguntasFaltantes(scale, respuestas).length === 0;
};

/**
 * Formateador universal de puntajes clínicos.
 * Maneja decimales con coma (estándar médico hispano) y estados de error.
 */
export const formatearPuntaje = (puntaje: number | null): string => {
  if (puntaje === null) return "--";
  
  if (Number.isInteger(puntaje)) return puntaje.toString();
  
  // Para escalas con decimales (ej: Murray), forzamos 2 decimales y coma.
  return puntaje.toFixed(2).replace('.', ',');
};