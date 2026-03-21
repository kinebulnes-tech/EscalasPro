// src/utils/db.ts
import { openDB, IDBPDatabase } from 'idb';
import { Security } from './security';
import { normalizeID } from './patientIdentity'; // Importamos el normalizador internacional

const DB_NAME = 'EscalaPro_DB';
const DB_VERSION = 2; // Subimos versión por cambio de estructura (rut -> id)

class ClinicalDB {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Tabla de Pacientes: Ahora usamos 'id' como llave universal
        if (!db.objectStoreNames.contains('pacientes')) {
          db.createObjectStore('pacientes', { keyPath: 'id' });
        } else if (oldVersion < 2) {
          // Si ya existía, podrías manejar migraciones aquí si fuera necesario
        }

        // Tabla de Evaluaciones: Vinculada al 'patientId' internacional
        if (!db.objectStoreNames.contains('evaluaciones')) {
          const store = db.createObjectStore('evaluaciones', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('by-patientId', 'patientId');
        }
      },
    });
  }

  // Método para guardar un paciente (cifrado y normalizado)
  async upsertPaciente(paciente: any) {
    const db = await this.dbPromise;
    // Limpiamos el ID (RUT, DNI, etc) antes de que sea la llave primaria
    const cleanId = normalizeID(paciente.id || paciente.rut); 

    return db.put('pacientes', {
      id: cleanId, 
      country: paciente.country || 'CL', // Guardamos el país para la máscara de UI
      dataEncrypted: Security.encrypt(paciente),
      updatedAt: Date.now()
    });
  }

  // Método para guardar una evaluación (cifrada)
  async guardarEvaluacion(patientId: string, escalaId: string, resultado: any) {
    const db = await this.dbPromise;
    const cleanId = normalizeID(patientId);

    return db.add('evaluaciones', {
      patientId: cleanId,
      escalaId,
      dataEncrypted: Security.encrypt(resultado),
      fecha: Date.now()
    });
  }

  // Método para recuperar el historial por ID internacional normalizado
  async getHistorial(patientId: string) {
    const db = await this.dbPromise;
    const cleanId = normalizeID(patientId);
    
    // Accedemos mediante el nuevo índice universal
    const transaction = db.transaction('evaluaciones', 'readonly');
    const index = transaction.store.index('by-patientId');
    const registros = await index.getAll(cleanId);
    
    return registros.map(r => ({
      ...Security.decrypt(r.dataEncrypted),
      fecha: r.fecha,
      escalaId: r.escalaId
    })).sort((a, b) => b.fecha - a.fecha);
  }
}

export const db = new ClinicalDB();