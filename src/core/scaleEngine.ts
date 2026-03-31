// src/core/scaleEngine.ts

/**
 * ARCHIVO: scaleEngine.ts (Motor de Cálculo Clínico - Versión Blindada)
 * UBICACIÓN: src/core/
 * DESCRIPCIÓN: Cerebro lógico del sistema con validación estricta de rangos biológicos.
 */

import { Scale, InterpretacionAvanzada } from '../data/scalesData';

export interface ScaleResult {
  puntaje: number | null; 
  interpretacion: string;
  detalleCompleto: string | InterpretacionAvanzada;
  escala: string;
  categoria: string;
  error: boolean;
}

/**
 * Ejecuta el cálculo e interpretación con blindaje de datos.
 */
export const calcularEscala = (
  scale: Scale,
  respuestas: Record<string, any>
): ScaleResult => {
  try {
    // 1. Bloqueo de seguridad: Verificamos integridad y rangos biológicos
    const camposInvalidos = obtenerPreguntasFaltantes(scale, respuestas);
    
    if (camposInvalidos.length > 0) {
      throw new Error(`Falla de integridad: ${camposInvalidos.length} campos fuera de rango o vacíos.`);
    }

    // 2. Cálculo matemático
    const puntaje = scale.calcularPuntaje(respuestas);
    
    // 3. Interpretación clínica
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
    console.error(`🚨 Error Crítico en Engine [${scale.id}]:`, err);
    
    return {
      puntaje: null,
      interpretacion: "Cálculo no disponible",
      detalleCompleto: "Error: Datos biológicamente incompatibles o incompletos.",
      escala: scale.nombre,
      categoria: scale.categoria,
      error: true
    };
  }
};

/**
 * VALIDADOR CRÍTICO: Identifica campos vacíos O valores biológicamente imposibles.
 */
export const obtenerPreguntasFaltantes = (
  scale: Scale,
  respuestas: Record<string, any>
): string[] => {
  return scale.preguntas
    .filter(pregunta => {
      // ✅ FIX: Preguntas informativas no requieren respuesta
      if (pregunta.type === 'text') return false;

      const respuesta = respuestas[pregunta.id];

      // Caso 1: Campo no respondido
      if (respuesta === undefined || respuesta === null || respuesta === "") return true;

      // Caso 2: Validación de rangos (Sanity Check nivel CEO)
      if (pregunta.type === 'number') {
        const valorNum = Number(respuesta);
        
        // Límites: Prioridad a los de la escala, si no, límites biológicos extremos
        const min = pregunta.min ?? 0; 
        const max = pregunta.max ?? 1000;

        if (isNaN(valorNum) || valorNum < min || valorNum > max) {
          console.warn(`🛑 Bloqueo por valor imposible: ${pregunta.id} = ${valorNum}`);
          return true;
        }
      }
      
      return false;
    })
    .map(p => p.id);
};

/**
 * Determina si el formulario es apto para procesarse.
 */
export const validarRespuestas = (
  scale: Scale,
  respuestas: Record<string, any>
): boolean => {
  return obtenerPreguntasFaltantes(scale, respuestas).length === 0;
};

/**
 * Formateador de puntajes con estándar médico.
 */
export const formatearPuntaje = (puntaje: number | null): string => {
  if (puntaje === null) return "--";
  if (Number.isInteger(puntaje)) return puntaje.toString();
  return puntaje.toFixed(2).replace('.', ',');
};