import CryptoJS from 'crypto-js';

// En una app real, esto vendría de un archivo .env
// Por ahora, usaremos una clave interna de EscalaPro
const SECRET_KEY = 'escalapro-secret-key-2026';

export const Security = {
  // Cifra un objeto o string
  encrypt: (data: any): string => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);
    return ciphertext.toString();
  },

  // Descifra y devuelve el dato original
  decrypt: (ciphertext: string): any => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Error al descifrar datos:", error);
      return null;
    }
  }
};