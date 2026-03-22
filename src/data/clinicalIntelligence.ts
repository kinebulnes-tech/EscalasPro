// src/data/clinicalIntelligence.ts

export const clinicalMapping: Record<string, string[]> = {
  // --- NEUROLOGÍA ADULTO ---
  "acv": ["barthel", "rankin", "nihss", "berg", "tug", "fugel_meyer"],
  "stroke": ["barthel", "rankin", "nihss", "berg", "tug"],
  "cerebrovascular": ["barthel", "rankin", "nihss", "berg", "tug"],
  "parkinson": ["hoehn_yahr", "updrs", "berg", "tug", "tinetti"],
  "esclerosis": ["edss", "ms qol"],
  "lesion medular": ["asia", "scim", "ashworth"],
  "espasticidad": ["ashworth", "tardieu"],

  // --- GERIATRÍA / ADULTO MAYOR ---
  "adulto mayor": ["tinetti", "berg", "tug", "sarcf", "minimental", "pfeiffer"],
  "anciano": ["tinetti", "berg", "tug", "sarcf", "minimental"],
  "caida": ["tinetti", "berg", "tug", "downton", "fof"],
  "sarcopenia": ["dinamometria", "sarcf", "mrc_sumscore", "sp PB"],
  "fragilidad": ["frail", "sarcf", "dinamometria"],
  "dependencia": ["barthel", "lawton_brody"],

  // --- TRAUMATOLOGÍA Y DOLOR ---
  "fuerza": ["dinamometria", "mrc", "mrc_sumscore"],
  "cadera": ["harris_hip", "oxford_hip", "tug"],
  "rodilla": ["womac", "lysholm", "tegner", "koos"],
  "hombro": ["dash", "constant_murley", "spadi"],
  "tobillo": ["aofas", "fadi"],
  "columna": ["oswestry", "roland_morris"],
  "dolor": ["eva", "lanss", "dn4", "tampa"],

  // --- RESPIRATORIO ---
  "epoc": ["mrc_disnea", "borg", "p6m", "cat_epoc"],
  "asma": ["act", "acq"],
  "disnea": ["mrc_disnea", "borg"],
  "fibrosis": ["p6m", "cpt"],
  "ventilacion": ["weaning_index", "tobin"],

  // --- PACIENTE CRÍTICO (UCI) ---
  "uci": ["rass", "cam_icu", "mrc_sumscore", "fss_icu", "cpot"],
  "critico": ["rass", "cam_icu", "mrc_sumscore", "fss_icu"],
  "sedacion": ["rass", "sas"],
  "delirium": ["cam_icu", "icdsc"],
  "movilidad uci": ["fss_icu", "ims", "pfas"],

  // --- PISO PÉLVICO ---
  "piso pelvico": ["iciq_sf", "i iq 7", "pelvic_organ_prolapse"],
  "incontinencia": ["iciq_sf", "bladdery_diary"],
  "prolapso": ["pop_q"],

  // --- PEDIATRÍA ---
  "pediatria": ["apgar", "gmfcs", "alberta", "wee_fim"],
  "desarrollo": ["alberta", "tepsi", "eddp"],
  "motor": ["gmfm", "peabody"],

  // --- SALUD OCUPACIONAL / DERMATO ---
  "ergonomia": ["reba", "rula", "rosas"],
  "quemados": ["vancouver", "lund_browder"],
  "cicatriz": ["vancouver", "posas"]
};

/**
 * Motor de Búsqueda Semántica con Normalización
 */
export const getSuggestedScales = (query: string): string[] => {
  if (!query || query.length < 3) return [];

  // Normalización: minúsculas, sin tildes, sin espacios extra
  const q = query.toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const suggestedIds = new Set<string>();

  Object.entries(clinicalMapping).forEach(([keyword, ids]) => {
    const normalizedKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Coincidencia bidireccional
    if (q.includes(normalizedKeyword) || normalizedKeyword.includes(q)) {
      ids.forEach(id => suggestedIds.add(id));
    }
  });

  return Array.from(suggestedIds);
};