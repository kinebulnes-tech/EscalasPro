// src/data/clinicalIntelligence.ts

export const clinicalMapping: Record<string, string[]> = {
  "acv": ["barthel", "rankin", "nihss", "berg", "tug"],
  "accidente cerebrovascular": ["barthel", "rankin", "nihss", "berg", "tug"],
  "parkinson": ["hoehn_yahr", "updrs", "berg", "tug", "tinetti"],
  "adulto mayor": ["tinetti", "berg", "tug", "sp PB", "minimental"],
  "sarcopenia": ["dinamometria", "sarcf", "sp PB"],
  "fuerza": ["dinamometria", "mrc"],
  "caidas": ["tinetti", "berg", "tug"],
  "equilibrio": ["berg", "tinetti", "posturografia"],
  "marcha": ["tug", "tinetti", "velocidad_marcha"],
  "respiratorio": ["mrc_disnea", "borg", "p6m"],
  "epoc": ["mrc_disnea", "borg", "p6m", "cat_epoc"],
  "cognitivo": ["minimental", "pfeiffer", "moca"]
};

export const getSuggestedScales = (query: string): string[] => {
  const q = query.toLowerCase().trim();
  // Buscamos si alguna de nuestras "keywords" está en lo que el usuario escribió
  const key = Object.keys(clinicalMapping).find(k => q.includes(k));
  return key ? clinicalMapping[key] : [];
};