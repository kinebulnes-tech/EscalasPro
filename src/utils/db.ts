// src/utils/db.ts
import { openDB, IDBPDatabase } from 'idb';
import { Security } from './security';
import { normalizeID } from './patientIdentity'; 

const DB_NAME = 'EscalaPro_DB';
const DB_VERSION = 2; 

class ClinicalDB {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('pacientes')) {
          const store = db.createObjectStore('pacientes', { keyPath: 'id' });
          // Creamos un índice por fecha para poder buscar los más recientes rápido
          store.createIndex('by-date', 'updatedAt');
        }

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

  async upsertPaciente(paciente: any) {
    const db = await this.dbPromise;
    const cleanId = normalizeID(paciente.id || paciente.rut); 

    return db.put('pacientes', {
      id: cleanId, 
      country: paciente.country || 'CL',
      dataEncrypted: Security.encrypt(paciente),
      updatedAt: Date.now() // Esta fecha es la que usaremos para el orden
    });
  }

  // ✅ NUEVA FUNCIÓN: Obtiene los últimos 5 pacientes registrados
  async getPacientesRecientes() {
    const db = await this.dbPromise;
    const tx = db.transaction('pacientes', 'readonly');
    const store = tx.objectStore('pacientes');
    
    // Obtenemos todos y los ordenamos por fecha de forma manual para asegurar compatibilidad
    const todos = await store.getAll();
    
    return todos
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)) // De más nuevo a más viejo
      .slice(0, 5) // Solo los primeros 5
      .map(p => ({
        ...Security.decrypt(p.dataEncrypted),
        id: p.id,
        country: p.country,
        updatedAt: p.updatedAt
      }));
  }

  async guardarEvaluacion(patientId: string, escalaId: string, resultado: any) {
    const db = await this.dbPromise;
    const cleanId = normalizeID(patientId);

    // Actualizamos la fecha del paciente para que suba en la lista de recientes
    const tx = db.transaction(['pacientes', 'evaluaciones'], 'readwrite');
    const pStore = tx.objectStore('pacientes');
    const eStore = tx.objectStore('evaluaciones');

    const pData = await pStore.get(cleanId);
    if (pData) {
      pData.updatedAt = Date.now();
      await pStore.put(pData);
    }

    return eStore.add({
      patientId: cleanId,
      escalaId,
      dataEncrypted: Security.encrypt(resultado),
      fecha: Date.now()
    });
  }

  async getHistorial(patientId: string) {
    const db = await this.dbPromise;
    const cleanId = normalizeID(patientId);
    
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