// src/utils/validators.ts

/**
 * Valida un RUT chileno usando el algoritmo de Módulo 11.
 * Retorna true si es válido, false si es incorrecto.
 */
export const validateRUT = (rut: string): boolean => {
  // 1. Limpiar el texto: quitar puntos, guiones y espacios
  const cleanRUT = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  
  // Mínimo 8 caracteres (7 de cuerpo + 1 verificador)
  if (cleanRUT.length < 8) return false;

  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1);

  // 2. Cálculo del Módulo 11
  let suma = 0;
  let multiplo = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    suma += parseInt(body[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal = "";
  
  if (dvEsperado === 11) dvFinal = "0";
  else if (dvEsperado === 10) dvFinal = "K";
  else dvFinal = dvEsperado.toString();

  return dv === dvFinal;
};

/**
 * Toma un RUT sucio y lo entrega formateado: XXXXXXXX-X
 * Ejemplo: "12.345.678-k" -> "12345678-K"
 */
export const formatRUT = (rut: string): string => {
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return clean;
  
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  return `${body}-${dv}`;
};