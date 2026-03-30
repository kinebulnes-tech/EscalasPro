// src/utils/biometrics.ts

/**
 * MOTOR DE BIOMETRÍA Y CRONOLOGÍA CLÍNICA - ESCALAPRO
 * Auditoría: Nivel CEO - Precisión para Pediatría y Nutrición.
 */

/**
 * Calcula el IMC (BMI) con precisión de 2 decimales.
 * Valida límites biológicos para evitar errores de ingreso.
 */
export const calcularIMC = (peso: number, tallaCm: number): number | null => {
  if (!peso || !tallaCm || tallaCm < 30 || tallaCm > 250 || peso < 1 || peso > 500) return null;
  
  const tallaMeters = tallaCm / 100;
  const imc = peso / (tallaMeters * tallaMeters);
  
  return parseFloat(imc.toFixed(2));
};

/**
 * Clasifica el IMC según estándares de la OMS.
 */
export const clasificarIMC = (imc: number): { etiqueta: string; color: string } => {
  if (imc < 18.5) return { etiqueta: 'Bajo Peso', color: 'text-blue-500 border-blue-100' };
  if (imc < 25) return { etiqueta: 'Normopeso', color: 'text-teal-500 border-teal-100' };
  if (imc < 30) return { etiqueta: 'Sobrepeso', color: 'text-amber-500 border-amber-100' };
  if (imc < 35) return { etiqueta: 'Obesidad G-I', color: 'text-orange-500 border-orange-100' };
  if (imc < 40) return { etiqueta: 'Obesidad G-II', color: 'text-red-500 border-red-100' };
  return { etiqueta: 'Obesidad G-III', color: 'text-red-700 border-red-200' };
};

/**
 * CALCULADOR DE EDAD CRONOLÓGICA EXACTA (Requisito EEDP/TEPSI)
 * ✅ CORRECCIÓN: Usamos año/mes/día por separado para evitar el bug de zona
 * horaria. new Date('YYYY-MM-DD') interpreta la fecha como UTC medianoche,
 * lo que en Chile (GMT-4) puede restar un día y alterar percentiles pediátricos.
 */
export const calcularEdadExacta = (fechaNacimiento: string) => {
  const hoy = new Date();

  // ✅ CORRECCIÓN CLAVE: Parseamos manualmente para forzar hora local
  // en lugar de dejar que JavaScript interprete como UTC
  const partes = fechaNacimiento?.split('-').map(Number);
  if (!partes || partes.length !== 3 || partes.some(isNaN)) {
    return { años: 0, meses: 0, dias: 0, totalMeses: 0, totalDias: 0, error: true };
  }

  const [anio, mes, dia] = partes;
  // Al pasar año, mes-1, día al constructor, JavaScript usa hora LOCAL (no UTC)
  const cumple = new Date(anio, mes - 1, dia);

  // Validación de seguridad
  if (isNaN(cumple.getTime()) || cumple > hoy) {
    return { años: 0, meses: 0, dias: 0, totalMeses: 0, totalDias: 0, error: true };
  }

  let años = hoy.getFullYear() - cumple.getFullYear();
  let meses = hoy.getMonth() - cumple.getMonth();
  let dias = hoy.getDate() - cumple.getDate();

  // Ajuste de meses negativos
  if (meses < 0 || (meses === 0 && dias < 0)) {
    años--;
    meses += 12;
  }

  // Ajuste de días negativos (restando un mes y sumando los días del mes anterior)
  if (dias < 0) {
    const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    meses--;
    dias += ultimoDiaMesAnterior;
    
    if (meses < 0) {
      meses = 11;
      años--;
    }
  }

  // ✅ CORRECCIÓN: totalDias también usa la fecha local (no getTime con UTC)
  // para ser consistente con el cálculo de años/meses/días de arriba
  const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const cumpleLocal = new Date(anio, mes - 1, dia);
  const diffTime = hoyLocal.getTime() - cumpleLocal.getTime();
  const totalDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalMeses = (años * 12) + meses;

  return {
    años,
    meses,
    dias,
    totalMeses,
    totalDias,
    error: false
  };
};

/**
 * Calcula la fecha de nacimiento estimada a partir de la edad (Fallback)
 */
export const estimarFechaDesdeEdad = (años: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - años);
  return d.toISOString().split('T')[0];
};
