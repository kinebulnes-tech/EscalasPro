import { Scale } from '../data/scalesData';

export interface ScaleResult {
  puntaje: number;
  interpretacion: string;
  escala: string;
  categoria: string;
}

export const calcularEscala = (
  scale: Scale,
  respuestas: Record<string, number>
): ScaleResult => {
  const puntaje = scale.calcularPuntaje(respuestas);
  const interpretacion = scale.interpretar(puntaje);

  return {
    puntaje,
    interpretacion,
    escala: scale.nombre,
    categoria: scale.categoria
  };
};

export const validarRespuestas = (
  scale: Scale,
  respuestas: Record<string, number>
): boolean => {
  return scale.preguntas.every(pregunta => {
    const respuesta = respuestas[pregunta.id];

    if (respuesta === undefined || respuesta === null) {
      return false;
    }

    if (pregunta.type === 'number') {
      const min = pregunta.min ?? -Infinity;
      const max = pregunta.max ?? Infinity;
      return respuesta >= min && respuesta <= max;
    }

    return true;
  });
};

export const formatearPuntaje = (puntaje: number): string => {
  return Number.isInteger(puntaje) ? puntaje.toString() : puntaje.toFixed(2);
};
