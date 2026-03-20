// src/utils/db.ts
import { openDB, IDBPDatabase } from 'idb';
import { Security } from './security';

const DB_NAME = 'EscalaPro_DB';
const DB_VERSION = 1;

class ClinicalDB {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Tabla de Pacientes (RUT como llave única)
        if (!db.objectStoreNames.contains('pacientes')) {
          db.createObjectStore('pacientes', { keyPath: 'rut' });
        }
        // Tabla de Evaluaciones (Historial vinculado al RUT)
        if (!db.objectStoreNames.contains('evaluaciones')) {
          const store = db.createObjectStore('evaluaciones', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('by-rut', 'pacienteRut');
        }
      },
    });
  }

  // Método para guardar un paciente (cifrado)
  async upsertPaciente(paciente: any) {
    const db = await this.dbPromise;
    return db.put('pacientes', {
      rut: paciente.rut,
      dataEncrypted: Security.encrypt(paciente),
      createdAt: Date.now()
    });
  }

  // Método para guardar una evaluación (cifrada)
  async guardarEvaluacion(rut: string, escalaId: string, resultado: any) {
    const db = await this.dbPromise;
    return db.add('evaluaciones', {
      pacienteRut: rut,
      escalaId,
      dataEncrypted: Security.encrypt(resultado),
      fecha: Date.now()
    });
  }

  // Método para recuperar el historial
  async getHistorial(rut: string) {
    const db = await this.dbPromise;
    const index = db.transaction('evaluaciones').store.index('by-rut');
    const registros = await index.getAll(rut);
    
    return registros.map(r => ({
      ...Security.decrypt(r.dataEncrypted),
      fecha: r.fecha,
      escalaId: r.escalaId
    })).sort((a, b) => b.fecha - a.fecha);
  }
}

export const db = new ClinicalDB();