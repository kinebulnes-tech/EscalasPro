// src/utils/clinicalAlerts.ts

export type AlertLevel = 'critica' | 'advertencia' | 'info';

export interface ClinicalAlert {
  nivel: AlertLevel;
  titulo: string;
  mensaje: string;
  accion: string;
}

interface AlertRule {
  evaluar: (puntaje: number, respuestas: Record<string, any>) => ClinicalAlert | null;
}

const ALERTAS_POR_ESCALA: Record<string, AlertRule[]> = {

  'gcs': [
    {
      evaluar: (p) => p <= 8 ? {
        nivel: 'critica',
        titulo: '⚠️ GCS CRÍTICO — Riesgo de Pérdida de Vía Aérea',
        mensaje: `GCS ${p}/15. Paciente con compromiso severo de conciencia.`,
        accion: 'Considerar intubación inmediata. Activar protocolo de vía aérea.'
      } : p <= 12 ? {
        nivel: 'advertencia',
        titulo: '⚠️ GCS Moderado — Vigilancia Estricta',
        mensaje: `GCS ${p}/15. Compromiso moderado de conciencia.`,
        accion: 'Monitorización continua. Reevaluar en 30 minutos.'
      } : null
    }
  ],

  'nihss': [
    {
      evaluar: (p) => p >= 21 ? {
        nivel: 'critica',
        titulo: '🧠 ACV Severo — Activar Código Stroke',
        mensaje: `NIHSS ${p}. Déficit neurológico severo.`,
        accion: 'Evaluar trombolisis/trombectomía urgente. Activar equipo de stroke.'
      } : p >= 16 ? {
        nivel: 'advertencia',
        titulo: '🧠 ACV Moderado-Severo',
        mensaje: `NIHSS ${p}. Déficit neurológico moderado a severo.`,
        accion: 'Monitorización UCI. Evaluar ventana terapéutica.'
      } : p >= 5 ? {
        nivel: 'info',
        titulo: 'ACV Leve-Moderado',
        mensaje: `NIHSS ${p}. Déficit neurológico presente.`,
        accion: 'Hospitalización. Iniciar rehabilitación precoz.'
      } : null
    }
  ],

  'wells_tep': [
    {
      evaluar: (p) => p >= 5 ? {
        nivel: 'critica',
        titulo: '🫁 Alta Probabilidad de TEP',
        mensaje: `Wells ${p} puntos. Probabilidad alta de tromboembolismo pulmonar.`,
        accion: 'Anticoagulación empírica. TC Angio pulmonar urgente.'
      } : p >= 2 ? {
        nivel: 'advertencia',
        titulo: '🫁 Probabilidad Intermedia de TEP',
        mensaje: `Wells ${p} puntos. No descartar TEP.`,
        accion: 'Solicitar D-Dímero. Evaluar imágenes según resultado.'
      } : null
    }
  ],

  'sofa': [
    {
      evaluar: (p) => p >= 11 ? {
        nivel: 'critica',
        titulo: '🔴 SOFA Crítico — Disfunción Multiorgánica',
        mensaje: `SOFA ${p}. Mortalidad estimada >50%.`,
        accion: 'Ingreso a UCI. Soporte orgánico intensivo. Alertar equipo médico.'
      } : p >= 7 ? {
        nivel: 'advertencia',
        titulo: '🟡 SOFA Elevado — Disfunción Orgánica',
        mensaje: `SOFA ${p}. Compromiso orgánico significativo.`,
        accion: 'Considerar UCI. Monitorización hemodinámica.'
      } : null
    }
  ],

  'apache_ii': [
    {
      evaluar: (p) => p >= 25 ? {
        nivel: 'critica',
        titulo: '🔴 APACHE II Crítico — Alta Mortalidad',
        mensaje: `APACHE II ${p}. Mortalidad estimada >50%.`,
        accion: 'Revisar metas de cuidado. Comunicar a equipo y familia.'
      } : p >= 15 ? {
        nivel: 'advertencia',
        titulo: 'APACHE II Elevado',
        mensaje: `APACHE II ${p}. Paciente de alto riesgo.`,
        accion: 'Monitorización UCI. Reevaluar plan terapéutico.'
      } : null
    }
  ],

  'mews': [
    {
      evaluar: (p) => p >= 5 ? {
        nivel: 'critica',
        titulo: '🚨 MEWS Crítico — Llamado de Emergencia',
        mensaje: `MEWS ${p}. Riesgo inminente de deterioro clínico.`,
        accion: 'Activar equipo de respuesta rápida inmediatamente.'
      } : p >= 3 ? {
        nivel: 'advertencia',
        titulo: 'MEWS Elevado — Vigilancia Aumentada',
        mensaje: `MEWS ${p}. Riesgo moderado de deterioro.`,
        accion: 'Monitorización cada 30 min. Notificar médico tratante.'
      } : null
    }
  ],

  'news2': [
    {
      evaluar: (p) => p >= 7 ? {
        nivel: 'critica',
        titulo: '🚨 NEWS2 Alto — Respuesta de Emergencia',
        mensaje: `NEWS2 ${p}. Deterioro clínico inminente.`,
        accion: 'Respuesta de emergencia inmediata. Monitorización continua.'
      } : p >= 5 ? {
        nivel: 'advertencia',
        titulo: 'NEWS2 Moderado-Alto',
        mensaje: `NEWS2 ${p}. Riesgo aumentado.`,
        accion: 'Monitorización frecuente. Reevaluar en 1 hora.'
      } : null
    }
  ],

  'pews': [
    {
      evaluar: (p) => p >= 7 ? {
        nivel: 'critica',
        titulo: '🔴 PEWS Crítico — Activar Código Azul Pediátrico',
        mensaje: `PEWS ${p}. Riesgo de paro cardiorrespiratorio.`,
        accion: 'Activar equipo de emergencia pediátrica de inmediato.'
      } : p >= 4 ? {
        nivel: 'advertencia',
        titulo: 'PEWS Elevado — Niño en Riesgo',
        mensaje: `PEWS ${p}. Deterioro potencial inminente.`,
        accion: 'Notificar médico. Monitorización continua.'
      } : null
    }
  ],

  'barthel': [
    {
      evaluar: (p) => p <= 20 ? {
        nivel: 'advertencia',
        titulo: 'Dependencia Total',
        mensaje: `Barthel ${p}/100. Paciente con dependencia total para AVD.`,
        accion: 'Derivar a trabajo social. Evaluar necesidad de cuidador formal.'
      } : p <= 60 ? {
        nivel: 'info',
        titulo: 'Dependencia Severa-Moderada',
        mensaje: `Barthel ${p}/100. Requiere asistencia significativa.`,
        accion: 'Planificar rehabilitación. Evaluar adaptaciones del hogar.'
      } : null
    }
  ],

  'eva': [
    {
      evaluar: (p) => p >= 8 ? {
        nivel: 'advertencia',
        titulo: 'Dolor Severo — Manejo Urgente',
        mensaje: `EVA ${p}/10. Dolor severo que requiere manejo inmediato.`,
        accion: 'Analgesia de rescate. Considerar opioides según protocolo.'
      } : null
    }
  ],

  'phq9': [
    {
      evaluar: (p, r) => {
        const ideacion = r['q9'] || r['pregunta9'] || r['suicidio'] || 0;
        if (Number(ideacion) >= 1) return {
          nivel: 'critica',
          titulo: '🚨 Ideación Suicida Detectada',
          mensaje: 'El paciente reporta pensamientos de hacerse daño o desear estar muerto.',
          accion: 'Evaluación de riesgo suicida inmediata. No dejar solo al paciente.'
        };
        return p >= 20 ? {
          nivel: 'advertencia',
          titulo: 'Depresión Severa',
          mensaje: `PHQ-9 ${p}. Sintomatología depresiva severa.`,
          accion: 'Derivación urgente a psiquiatría. Evaluar farmacoterapia.'
        } : p >= 15 ? {
          nivel: 'info',
          titulo: 'Depresión Moderada-Severa',
          mensaje: `PHQ-9 ${p}. Requiere intervención.`,
          accion: 'Iniciar tratamiento. Seguimiento en 2 semanas.'
        } : null;
      }
    }
  ],

  'gad7': [
    {
      evaluar: (p) => p >= 15 ? {
        nivel: 'advertencia',
        titulo: 'Ansiedad Severa',
        mensaje: `GAD-7 ${p}. Sintomatología ansiosa severa.`,
        accion: 'Derivar a psicología/psiquiatría. Evaluar tratamiento.'
      } : null
    }
  ],

  'berlin_sdra': [
    {
      evaluar: (p) => p >= 3 ? {
        nivel: 'critica',
        titulo: '🫁 SDRA Severo',
        mensaje: 'Criterios de SDRA severo cumplidos.',
        accion: 'Ventilación protectora. Considerar decúbito prono. UCI.'
      } : p >= 2 ? {
        nivel: 'advertencia',
        titulo: '🫁 SDRA Moderado',
        mensaje: 'Criterios de SDRA moderado.',
        accion: 'Monitorización respiratoria estrecha. Evaluar VM.'
      } : null
    }
  ],

  'rts': [
    {
      evaluar: (p) => p <= 4 ? {
        nivel: 'critica',
        titulo: '🚑 RTS Crítico — Trauma Severo',
        mensaje: `RTS ${p}. Alta probabilidad de mortalidad.`,
        accion: 'Activar trauma team. Traslado a centro de trauma nivel I.'
      } : null
    }
  ],

};

export function evaluarAlertasClinicas(
  escalaId: string,
  puntaje: number | null,
  respuestas: Record<string, any>
): ClinicalAlert | null {
  if (puntaje === null) return null;
  const reglas = ALERTAS_POR_ESCALA[escalaId];
  if (!reglas) return null;
  for (const regla of reglas) {
    const alerta = regla.evaluar(puntaje, respuestas);
    if (alerta) return alerta;
  }
  return null;
}