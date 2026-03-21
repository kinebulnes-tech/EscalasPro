// src/utils/validators.ts
import { identityConfigs, normalizeID } from './patientIdentity';
import { feedback } from './feedback';

/**
 * VALIDADOR MAESTRO: Valida según el país seleccionado.
 * Esta es la función que el PatientModal está buscando.
 */
export const validateIdentification = (id: string, countryCode: string): boolean => {
  const cleanId = normalizeID(id);
  if (!cleanId) return false;

  const config = identityConfigs[countryCode];
  if (!config) return true; // Por seguridad, si no hay config, permitimos pasar

  let isValid = false;

  switch (config.validationType) {
    case 'CHILEAN_RUT':
      isValid = validateRUT(cleanId);
      break;
    case 'NUMERIC_ONLY':
      // Argentina/Colombia: 7 a 10 dígitos numéricos
      isValid = /^\d{7,10}$/.test(cleanId);
      break;
    case 'NUMERIC_STRICT_8':
      // Perú: Exactamente 8 dígitos
      isValid = /^\d{8}$/.test(cleanId);
      break;
    case 'ALPHANUMERIC_STRICT_18':
      // México (CURP): 18 caracteres alfanuméricos
      isValid = /^[A-Z0-9]{18}$/.test(cleanId);
      break;
    case 'ALPHANUMERIC_FREE':
      isValid = cleanId.length >= 5;
      break;
    default:
      isValid = true;
  }

  // Si no es válido, activamos el feedback sensorial que ya tenemos configurado
  if (!isValid) {
    feedback.warning();
  }

  return isValid;
};

/**
 * FORMATEADOR DINÁMICO: Entrega el ID con el formato visual del país.
 */
export const formatIdentification = (id: string, countryCode: string): string => {
  const clean = normalizeID(id);
  
  // Si es Chile, aplicamos tu formato original XXXXXXXX-X
  if (countryCode === 'CL' && clean.length > 1) {
    return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
  }
  
  // Para otros países, devolvemos el ID limpio en mayúsculas
  return clean;
};

/**
 * Tu algoritmo original de RUT Chileno (Módulo 11)
 */
export const validateRUT = (rut: string): boolean => {
  const cleanRUT = normalizeID(rut);
  
  if (cleanRUT.length < 8) return false;

  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    suma += parseInt(body[i]) * multiplo;
    multiplo = (multiplo === 7) ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal = (dvEsperado === 11) ? "0" : (dvEsperado === 10) ? "K" : dvEsperado.toString();

  return dv === dvFinal;
};

/**
 * Formateador de RUT original (Mantenido por compatibilidad)
 */
export const formatRUT = (rut: string): string => {
  const clean = normalizeID(rut);
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body}-${dv}`;
};