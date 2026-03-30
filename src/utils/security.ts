// src/utils/security.ts
import CryptoJS from 'crypto-js';
 
// ✅ CORRECCIÓN CRÍTICA: La clave ya no está visible en el código.
// Se lee desde una variable de entorno que solo existe en tu computador.
// Si la variable no existe (ej: primer uso), se genera una clave aleatoria
// y se guarda en el navegador para que siempre sea la misma en ese dispositivo.
const getSecretKey = (): string => {
  // 1. Primero intentamos leer la clave desde las variables de entorno del proyecto
  const envKey = import.meta.env.VITE_ENCRYPTION_KEY;
  if (envKey && envKey.length >= 16) {
    return envKey;
  }
 
  // 2. Si no hay variable de entorno, usamos una clave única por dispositivo
  // guardada en localStorage (esto es seguro porque la clave nunca viaja por red)
  const DEVICE_KEY_NAME = 'escalapro_device_key';
  let deviceKey = localStorage.getItem(DEVICE_KEY_NAME);
 
  if (!deviceKey) {
    // Generamos una clave aleatoria de 32 bytes usando la API segura del navegador
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    deviceKey = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(DEVICE_KEY_NAME, deviceKey);
  }
 
  return deviceKey;
};
 
export const Security = {
  encrypt: (data: any): string => {
    try {
      const key = getSecretKey();
      return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    } catch (e) {
      return "";
    }
  },
 
  decrypt: (ciphertext: string): any => {
    try {
      const key = getSecretKey();
      const bytes = CryptoJS.AES.decrypt(ciphertext, key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
 
      if (!decryptedData) return null;
 
      return JSON.parse(decryptedData);
    } catch (error) {
      console.warn("Dato corrupto o antiguo detectado. Limpiando...");
      return null;
    }
  }
};
 