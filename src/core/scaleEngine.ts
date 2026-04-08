// src/core/scaleEngine.ts

import { Scale, InterpretacionAvanzada } from '../data/scalesData';
import { evaluarAlertasClinicas, ClinicalAlert } from '../utils/clinicalAlerts';

export type { ClinicalAlert };

export interface ScaleResult {
  puntaje: number | null; 
  interpretacion: string;
  detalleCompleto: string | InterpretacionAvanzada;
  escala: string;
  categoria: string;
  error: boolean;
  alerta: ClinicalAlert | null;
}

export const calcularEscala = (
  scale: Scale,
  respuestas: Record<string, any>
): ScaleResult => {
  try {
    const camposInvalidos = obtenerPreguntasFaltantes(scale, respuestas);
    
    if (camposInvalidos.length > 0) {
      throw new Error(`Falla de integridad: ${camposInvalidos.length} campos fuera de rango o vacíos.`);
    }

    const puntaje = scale.calcularPuntaje(respuestas);
    const interpretacionRaw = scale.interpretar(puntaje, respuestas);

    const textoInterpretacion = typeof interpretacionRaw === 'string' 
      ? interpretacionRaw 
      : interpretacionRaw.texto;

    const alerta = evaluarAlertasClinicas(scale.id, puntaje, respuestas);

    return {
      puntaje,
      interpretacion: textoInterpretacion,
      detalleCompleto: interpretacionRaw,
      escala: scale.nombre,
      categoria: scale.categoria,
      error: false,
      alerta,
    };
  } catch (err) {
    console.error(`🚨 Error Crítico en Engine [${scale.id}]:`, err);
    
    return {
      puntaje: null,
      interpretacion: "Cálculo no disponible",
      detalleCompleto: "Error: Datos biológicamente incompatibles o incompletos.",
      escala: scale.nombre,
      categoria: scale.categoria,
      error: true,
      alerta: null,
    };
  }
};

export const obtenerPreguntasFaltantes = (
  scale: Scale,
  respuestas: Record<string, any>
): string[] => {
  return scale.preguntas
    .filter(pregunta => {
      if (pregunta.type === 'text') return false;

      const respuesta = respuestas[pregunta.id];

      if (respuesta === undefined || respuesta === null || respuesta === "") return true;

      if (pregunta.type === 'number') {
        const valorNum = Number(respuesta);
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

export const validarRespuestas = (
  scale: Scale,
  respuestas: Record<string, any>
): boolean => {
  return obtenerPreguntasFaltantes(scale, respuestas).length === 0;
};

export const formatearPuntaje = (puntaje: number | null): string => {
  if (puntaje === null) return "--";
  if (Number.isInteger(puntaje)) return puntaje.toString();
  return puntaje.toFixed(2).replace('.', ',');
};