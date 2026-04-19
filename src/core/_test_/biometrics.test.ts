import { describe, it, expect } from 'vitest';
import { calcularIMC, clasificarIMC, calcularEdadExacta } from '../../utils/biometrics';

describe('📐 Cálculo de IMC', () => {
  it('Calcula IMC correctamente para adulto promedio', () => {
    const imc = calcularIMC(70, 175);
    expect(imc).toBe(22.86);
  });

  it('Retorna null para talla biológicamente imposible (< 30 cm)', () => {
    expect(calcularIMC(70, 20)).toBeNull();
  });

  it('Retorna null para peso biológicamente imposible (> 500 kg)', () => {
    expect(calcularIMC(600, 175)).toBeNull();
  });

  it('Retorna null si peso o talla es 0', () => {
    expect(calcularIMC(0, 175)).toBeNull();
    expect(calcularIMC(70, 0)).toBeNull();
  });

  it('Calcula con 2 decimales de precisión', () => {
    const imc = calcularIMC(85, 180);
    expect(imc?.toString().split('.')[1]?.length).toBeLessThanOrEqual(2);
  });
});

describe('🏷️ Clasificación IMC OMS', () => {
  it('Clasifica Bajo Peso (< 18.5)', () => {
    expect(clasificarIMC(17).etiqueta).toBe('Bajo Peso');
  });

  it('Clasifica Normopeso (18.5 – 24.9)', () => {
    expect(clasificarIMC(22).etiqueta).toBe('Normopeso');
  });

  it('Clasifica Sobrepeso (25 – 29.9)', () => {
    expect(clasificarIMC(27).etiqueta).toBe('Sobrepeso');
  });

  it('Clasifica Obesidad Grado I (30 – 34.9)', () => {
    expect(clasificarIMC(32).etiqueta).toBe('Obesidad G-I');
  });

  it('Clasifica Obesidad Grado III (≥ 40)', () => {
    expect(clasificarIMC(42).etiqueta).toBe('Obesidad G-III');
  });
});

describe('📅 Cálculo de Edad Cronológica Exacta', () => {
  const HOY = new Date();
  const formatFecha = (d: Date) => d.toISOString().split('T')[0];

  it('Calcula edad correcta para adulto', () => {
    const hace30Años = new Date(HOY.getFullYear() - 30, HOY.getMonth(), HOY.getDate());
    const resultado = calcularEdadExacta(formatFecha(hace30Años));
    expect(resultado.años).toBe(30);
    expect(resultado.meses).toBe(0);
    expect(resultado.error).toBe(false);
  });

  it('Calcula edad en meses para lactante', () => {
    const hace6Meses = new Date(HOY.getFullYear(), HOY.getMonth() - 6, HOY.getDate());
    const resultado = calcularEdadExacta(formatFecha(hace6Meses));
    expect(resultado.años).toBe(0);
    expect(resultado.meses).toBe(6);
    expect(resultado.error).toBe(false);
  });

  it('Retorna error para fecha futura', () => {
    const manana = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate() + 1);
    const resultado = calcularEdadExacta(formatFecha(manana));
    expect(resultado.error).toBe(true);
  });

  it('Retorna error para fecha con formato inválido', () => {
    const resultado = calcularEdadExacta('fecha-invalida');
    expect(resultado.error).toBe(true);
  });

  it('Retorna error para fecha undefined/vacía', () => {
    const resultado = calcularEdadExacta('');
    expect(resultado.error).toBe(true);
  });

  it('Calcula totalDias correctamente', () => {
    const hace365Dias = new Date(HOY.getFullYear() - 1, HOY.getMonth(), HOY.getDate());
    const resultado = calcularEdadExacta(formatFecha(hace365Dias));
    expect(resultado.totalDias).toBeGreaterThanOrEqual(365);
    expect(resultado.totalDias).toBeLessThanOrEqual(366);
  });

  it('Calcula totalMeses correctamente', () => {
    const hace24Meses = new Date(HOY.getFullYear() - 2, HOY.getMonth(), HOY.getDate());
    const resultado = calcularEdadExacta(formatFecha(hace24Meses));
    expect(resultado.totalMeses).toBe(24);
  });
});
