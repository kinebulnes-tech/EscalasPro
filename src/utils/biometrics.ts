// src/utils/biometrics.ts

/**
 * Calcula el IMC (BMI)
 * Fórmula: peso (kg) / talla² (m)
 */
export const calcularIMC = (peso: number, tallaCm: number): number | null => {
  if (!peso || !tallaCm || tallaCm <= 0) return null;
  
  const tallaMeters = tallaCm / 100;
  const imc = peso / (tallaMeters * tallaMeters);
  
  // Retornamos con 2 decimales
  return parseFloat(imc.toFixed(2));
};

/**
 * Clasifica el IMC según criterios estándar de la OMS
 */
export const clasificarIMC = (imc: number): { etiqueta: string; color: string } => {
  if (imc < 18.5) return { etiqueta: 'Bajo Peso', color: 'text-blue-500 border-blue-100' };
  if (imc < 25) return { etiqueta: 'Normopeso', color: 'text-teal-500 border-teal-100' };
  if (imc < 30) return { etiqueta: 'Sobrepeso', color: 'text-amber-500 border-amber-100' };
  if (imc < 35) return { etiqueta: 'Obesidad G-I', color: 'text-orange-500 border-orange-100' };
  if (imc < 40) return { etiqueta: 'Obesidad G-II', color: 'text-red-500 border-red-100' };
  return { etiqueta: 'Obesidad G-III', color: 'text-red-700 border-red-200' };
};