// src/utils/patientIdentity.ts

/**
 * EscalaPro - Configuración de Identidad Internacional
 * Centraliza las reglas de validación y visualización por país.
 */

export interface CountryConfig {
  country: string;
  documentName: string;
  placeholder: string;
  validationType: 'CHILEAN_RUT' | 'NUMERIC_ONLY' | 'NUMERIC_STRICT_8' | 'ALPHANUMERIC_STRICT_18' | 'ALPHANUMERIC_FREE';
}

export const identityConfigs: Record<string, CountryConfig> = {
  CL: { 
    country: "Chile", 
    documentName: "RUT", 
    placeholder: "12.345.678-9", 
    validationType: "CHILEAN_RUT" 
  },
  AR: { 
    country: "Argentina", 
    documentName: "DNI", 
    placeholder: "12.345.678", 
    validationType: "NUMERIC_ONLY" 
  },
  PE: { 
    country: "Perú", 
    documentName: "DNI", 
    placeholder: "12345678", 
    validationType: "NUMERIC_STRICT_8" 
  },
  MX: { 
    country: "México", 
    documentName: "CURP / INE", 
    placeholder: "ABCD123456H...", 
    validationType: "ALPHANUMERIC_STRICT_18" 
  },
  INT: { 
    country: "Internacional", 
    documentName: "ID / Pasaporte", 
    placeholder: "Identificación alfanumérica", 
    validationType: "ALPHANUMERIC_FREE" 
  }
};

/**
 * País inicial de la aplicación
 */
export const DEFAULT_COUNTRY = "CL";

/**
 * Normaliza cualquier ID eliminando caracteres especiales.
 * Vital para el guardado en IndexedDB y búsquedas exactas.
 */
export const normalizeID = (id: string): string => {
  if (!id) return "";
  return id.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
};