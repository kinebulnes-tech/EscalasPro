// src/utils/validators.ts
import { identityConfigs, normalizeID } from './patientIdentity';
import { feedback } from './feedback';

// ✅ NUEVO: Mensajes de error claros por país y tipo de documento
const getMensajeError = (countryCode: string, validationType: string): string => {
  switch (validationType) {
    case 'CHILEAN_RUT':
      return 'RUT inválido. Verifica el dígito verificador (ej: 12.345.678-9)';
    case 'NUMERIC_ONLY':
      return 'DNI inválido. Debe tener entre 7 y 10 dígitos numéricos';
    case 'NUMERIC_STRICT_8':
      return 'DNI inválido. Debe tener exactamente 8 dígitos';
    case 'ALPHANUMERIC_STRICT_18':
      return 'CURP inválido. Debe tener exactamente 18 caracteres alfanuméricos';
    case 'ALPHANUMERIC_FREE':
      return 'Identificación inválida. Debe tener al menos 5 caracteres';
    default:
      return 'Identificación inválida';
  }
};

/**
 * VALIDADOR MAESTRO: Valida según el país seleccionado.
 * ✅ MEJORA: Ahora retorna un objeto con isValid + mensaje de error,
 * en lugar de solo true/false. Así el formulario puede mostrar
 * exactamente qué está mal sin que el profesional tenga que adivinar.
 */
export const validateIdentificationWithMessage = (
  id: string,
  countryCode: string
): { isValid: boolean; mensaje: string } => {
  const cleanId = normalizeID(id);

  if (!cleanId) {
    return { isValid: false, mensaje: 'El campo de identificación no puede estar vacío' };
  }

  const config = identityConfigs[countryCode];
  if (!config) {
    return { isValid: true, mensaje: '' };
  }

  let isValid = false;

  switch (config.validationType) {
    case 'CHILEAN_RUT':
      isValid = validateRUT(cleanId);
      break;
    case 'NUMERIC_ONLY':
      isValid = /^\d{7,10}$/.test(cleanId);
      break;
    case 'NUMERIC_STRICT_8':
      isValid = /^\d{8}$/.test(cleanId);
      break;
    case 'ALPHANUMERIC_STRICT_18':
      isValid = /^[A-Z0-9]{18}$/.test(cleanId);
      break;
    case 'ALPHANUMERIC_FREE':
      isValid = cleanId.length >= 5;
      break;
    default:
      isValid = true;
  }

  if (!isValid) {
    feedback.warning();
    return {
      isValid: false,
      mensaje: getMensajeError(countryCode, config.validationType)
    };
  }

  return { isValid: true, mensaje: '' };
};

/**
 * ✅ MANTENIDA por compatibilidad con el código existente.
 * El PatientModal puede seguir usando esta función sin cambios.
 * Internamente usa la nueva función con mensaje.
 */
export const validateIdentification = (id: string, countryCode: string): boolean => {
  return validateIdentificationWithMessage(id, countryCode).isValid;
};

/**
 * FORMATEADOR DINÁMICO: Entrega el ID con el formato visual del país.
 */
export const formatIdentification = (id: string, countryCode: string): string => {
  const clean = normalizeID(id);
  if (countryCode === 'CL' && clean.length > 1) {
    return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
  }
  return clean;
};

/**
 * Algoritmo de RUT Chileno (Módulo 11)
 * ✅ MEJORA: Ahora también valida que el cuerpo del RUT sea numérico
 * para evitar falsos positivos con IDs internacionales.
 */
export const validateRUT = (rut: string): boolean => {
  const cleanRUT = normalizeID(rut);

  if (cleanRUT.length < 8) return false;

  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();

  // ✅ NUEVO: Verificamos que el cuerpo sea solo números
  if (!/^\d+$/.test(body)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    suma += parseInt(body[i]) * multiplo;
    multiplo = (multiplo === 7) ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = (dvEsperado === 11) ? "0" : (dvEsperado === 10) ? "K" : dvEsperado.toString();

  return dv === dvFinal;
};

/**
 * Formateador de RUT (Mantenido por compatibilidad)
 */
export const formatRUT = (rut: string): string => {
  const clean = normalizeID(rut);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body}-${dv}`;
};