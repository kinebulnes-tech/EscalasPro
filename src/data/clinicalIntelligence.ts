// src/data/clinicalIntelligence.ts

export const clinicalMapping: Record<string, string[]> = {
  // NEUROLOGÍA
  "acv": ["barthel", "rankin", "nihss", "berg", "tug"],
  "strok": ["barthel", "rankin", "nihss", "berg", "tug"],
  "cerebrovascular": ["barthel", "rankin", "nihss", "berg", "tug"],
  "parkinson": ["hoehn_yahr", "updrs", "berg", "tug", "tinetti"],
  "parquinson": ["hoehn_yahr", "updrs", "berg", "tug", "tinetti"],
  "temblor": ["updrs", "hoehn_yahr"],
  
  // ADULTO MAYOR / GERIATRÍA
  "adulto mayor": ["tinetti", "berg", "tug", "sarcf", "minimental"],
  "anciano": ["tinetti", "berg", "tug", "sarcf", "minimental"],
  "caida": ["tinetti", "berg", "tug", "downton"],
  "sarcopenia": ["dinamometria", "sarcf", "mrc"],
  "fragilidad": ["frail", "sarcf", "dinamometria"],
  "fragil": ["frail", "sarcf", "dinamometria"],
  
  // MÚSCULO-ESQUELÉTICO
  "fuerza": ["dinamometria", "mrc", "mrc_sumscore"],
  "debilidad": ["mrc", "mrc_sumscore", "dinamometria"],
  "cadera": ["harris_hip", "oxford_hip", "tug"],
  "rodilla": ["womac", "lysholm", "tegner"],
  "hombro": ["dash", "constant_murley"],
  "dolor": ["eva", "lanss", "dn4"],
  
  // RESPIRATORIO
  "respiratorio": ["mrc_disnea", "borg", "p6m", "cat_epoc"],
  "epoc": ["mrc_disnea", "borg", "p6m", "cat_epoc"],
  "disnea": ["mrc_disnea", "borg"],
  "pulmon": ["mrc_disnea", "borg", "p6m"],
  "covid": ["p6m", "borg", "mrc_disnea"],
  
  // COGNITIVO / SALUD MENTAL
  "cognitivo": ["minimental", "pfeiffer", "moca"],
  "demencia": ["minimental", "pfeiffer", "moca", "yesavage"],
  "memoria": ["minimental", "moca"],
  "depresion": ["yesavage", "phq9"],
  "animo": ["yesavage", "phq9"]
};

/**
 * Función mejorada que busca coincidencias parciales e ignora mayúsculas/minúsculas
 */
export const getSuggestedScales = (query: string): string[] => {
  const q = query.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quita tildes

  const suggestedIds: string[] = [];

  Object.keys(clinicalMapping).forEach(keyword => {
    // Si la búsqueda contiene la palabra clave O la palabra clave contiene la búsqueda
    if (q.includes(keyword) || keyword.includes(q)) {
      suggestedIds.push(...clinicalMapping[keyword]);
    }
  });

  // Eliminamos duplicados
  return [...new Set(suggestedIds)];
};