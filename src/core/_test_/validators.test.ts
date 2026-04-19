import { describe, it, expect } from 'vitest';
import { validateRUT, validateIdentification, validateIdentificationWithMessage, formatIdentification } from '../../utils/validators';

describe('🇨🇱 Validador RUT Chileno', () => {
  // 12345678-5: DV calculado por Módulo 11 = 5 ✓
  it('Acepta RUT válido con dígito numérico', () => {
    expect(validateRUT('12345678-5')).toBe(true);
  });

  // 76354771-K: DV calculado por Módulo 11 = K ✓
  it('Acepta RUT válido con dígito K', () => {
    expect(validateRUT('76354771-K')).toBe(true);
  });

  it('Rechaza RUT con dígito verificador incorrecto', () => {
    expect(validateRUT('12345678-9')).toBe(false); // DV correcto es 5
  });

  it('Rechaza RUT con menos de 8 caracteres', () => {
    expect(validateRUT('1234567')).toBe(false);
  });

  it('Rechaza RUT con cuerpo no numérico', () => {
    expect(validateRUT('ABCDEFG-H')).toBe(false);
  });

  // 11111111-1: DV calculado por Módulo 11 = 1 ✓ (es válido matemáticamente)
  it('Acepta RUT sin guion (normalización automática)', () => {
    expect(validateRUT('111111111')).toBe(true);
  });
});

describe('🌎 Validador Internacional por País', () => {
  it('CL: valida RUT chileno correcto', () => {
    expect(validateIdentification('76354771-K', 'CL')).toBe(true);
  });

  it('CL: rechaza RUT chileno incorrecto', () => {
    expect(validateIdentification('12345678-9', 'CL')).toBe(false); // DV correcto es 5
  });

  it('AR: acepta DNI argentino numérico de 8 dígitos', () => {
    expect(validateIdentification('12345678', 'AR')).toBe(true);
  });

  it('AR: rechaza DNI argentino con letras', () => {
    expect(validateIdentification('1234567A', 'AR')).toBe(false);
  });

  it('País desconocido: pasa sin error (modo permisivo)', () => {
    expect(validateIdentification('ANYID', 'XX')).toBe(true);
  });
});

describe('💬 Validador con Mensaje de Error', () => {
  it('Retorna mensaje específico para RUT inválido', () => {
    const result = validateIdentificationWithMessage('12345678-9', 'CL'); // DV correcto es 5
    expect(result.isValid).toBe(false);
    expect(result.mensaje).toContain('RUT');
  });

  it('Retorna mensaje vacío para RUT válido', () => {
    const result = validateIdentificationWithMessage('76354771-K', 'CL');
    expect(result.isValid).toBe(true);
    expect(result.mensaje).toBe('');
  });

  it('Retorna mensaje para campo vacío', () => {
    const result = validateIdentificationWithMessage('', 'CL');
    expect(result.isValid).toBe(false);
    expect(result.mensaje.length).toBeGreaterThan(0);
  });
});

describe('🖊️ Formateador de Identificación', () => {
  it('CL: formatea RUT con guion', () => {
    const formatted = formatIdentification('165620535', 'CL');
    expect(formatted).toContain('-');
  });

  it('AR: devuelve ID sin modificación', () => {
    const formatted = formatIdentification('12345678', 'AR');
    expect(formatted).toBe('12345678');
  });
});
