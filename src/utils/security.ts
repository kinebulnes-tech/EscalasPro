// src/utils/security.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'escalapro-secret-key-2026';

export const Security = {
  encrypt: (data: any): string => {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch (e) {
      return "";
    }
  },

  decrypt: (ciphertext: string): any => {
    try {
      // ✅ MEJORA: Si el dato no parece cifrado (no empieza con el patrón de AES)
      // o si falla el descifrado, devolvemos null en lugar de romper la app.
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedData) return null; // Si no hay datos, es que falló el descifrado
      
      return JSON.parse(decryptedData);
    } catch (error) {
      // Si falla porque el dato era "viejo" (texto plano), limpiamos y retornamos null
      console.warn("Dato corrupto o antiguo detectado. Limpiando...");
      return null; 
    }
  }
};