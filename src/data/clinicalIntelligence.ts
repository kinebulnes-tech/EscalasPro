// src/data/clinicalIntelligence.ts

export const clinicalMapping: Record<string, string[]> = {

  // --- NEUROLOGÍA ADULTO ---
  "acv":                ["barthel", "rankin", "nihss", "berg", "tug", "fugel_meyer", "ashworth", "tardieu", "brunnstrom", "minimental", "moca", "hamilton_ansiedad", "phq9"],
  "stroke":             ["barthel", "rankin", "nihss", "berg", "tug", "fugel_meyer", "ashworth", "tardieu", "brunnstrom", "minimental", "moca"],
  "cerebrovascular":    ["barthel", "rankin", "nihss", "berg", "tug", "fugel_meyer", "ashworth", "minimental"],
  "hemiplegia":         ["nihss", "rankin", "barthel", "fugel_meyer", "brunnstrom", "ashworth", "berg"],
  "hemiplejia":         ["nihss", "rankin", "barthel", "fugel_meyer", "brunnstrom", "ashworth", "berg"],
  "parkinson":          ["hoehn_yahr", "updrs", "berg", "tug", "tinetti", "minimental", "moca", "hamilton_ansiedad"],
  "alzheimer":          ["minimental", "moca", "pfeiffer", "barthel", "lawton_brody", "gds", "cornell"],
  "demencia":           ["minimental", "moca", "pfeiffer", "barthel", "lawton_brody", "gds", "cornell", "cdr"],
  "deterioro cognitivo":["minimental", "moca", "pfeiffer", "gds", "cdr", "cornell"],
  "cognitivo":          ["minimental", "moca", "pfeiffer", "gds", "cdr"],
  "memoria":            ["minimental", "moca", "pfeiffer", "gds"],
  "esclerosis multiple":["edss", "msnq", "berg", "tug", "ashworth", "phq9"],
  "esclerosis":         ["edss", "msnq", "berg", "tug", "ashworth"],
  "lesion medular":     ["asia", "scim", "ashworth", "tardieu", "mrc_sumscore", "barthel"],
  "paraplejia":         ["asia", "scim", "ashworth", "barthel", "mrc_sumscore"],
  "tetraplejia":        ["asia", "scim", "ashworth", "barthel", "mrc_sumscore"],
  "espasticidad":       ["ashworth", "tardieu", "penn"],
  "ataxia":             ["berg", "tug", "tinetti", "sara"],
  "equilibrio":         ["berg", "tug", "tinetti", "minibes"],
  "marcha":             ["tug", "tinetti", "berg", "fac", "p6m", "dynamic_gait"],
  "traumatismo craneal":["gcs", "rankin", "barthel", "rivermead"],
  "tec":                ["gcs", "rankin", "barthel", "rivermead", "nihss"],
  "epilepsia":          ["minimental", "phq9", "hamilton_ansiedad"],
  "nervio periferico":  ["mrc", "dash", "boston"],
  "neuropatia":         ["dn4", "lanss", "mrc", "dinamometria"],

  // --- GERIATRÍA / ADULTO MAYOR ---
  "adulto mayor":       ["tinetti", "berg", "tug", "sarcf", "minimental", "pfeiffer", "barthel", "lawton_brody", "gds", "downton", "mna"],
  "anciano":            ["tinetti", "berg", "tug", "sarcf", "minimental", "pfeiffer", "barthel", "gds"],
  "geriatria":          ["tinetti", "berg", "tug", "sarcf", "minimental", "barthel", "lawton_brody", "gds", "mna", "downton"],
  "caida":              ["tinetti", "berg", "tug", "downton", "fof", "stratify"],
  "riesgo caida":       ["tinetti", "berg", "tug", "downton", "fof", "stratify", "morse"],
  "sarcopenia":         ["dinamometria", "sarcf", "mrc_sumscore", "sppb"],
  "fragilidad":         ["frail", "sarcf", "dinamometria", "sppb", "mna"],
  "dependencia":        ["barthel", "lawton_brody", "wee_fim", "fim"],
  "funcionalidad":      ["barthel", "lawton_brody", "fim", "wee_fim", "sppb"],
  "nutricion":          ["mna", "must", "nrs2002", "snaq"],
  "desnutricion":       ["mna", "must", "nrs2002"],
  "ulcera":             ["braden", "norton", "waterlow"],
  "ulcera por presion": ["braden", "norton", "waterlow"],
  "escara":             ["braden", "norton", "waterlow"],

  // --- TRAUMATOLOGÍA Y ORTOPEDIA ---
  "fuerza":             ["dinamometria", "mrc", "mrc_sumscore", "handheld"],
  "cadera":             ["harris_hip", "oxford_hip", "tug", "hoos"],
  "protesis cadera":    ["harris_hip", "oxford_hip", "hoos", "tug"],
  "rodilla":            ["womac", "lysholm", "tegner", "koos", "oxford_knee"],
  "protesis rodilla":   ["womac", "oxford_knee", "koos", "tug"],
  "ligamento":          ["lysholm", "tegner", "ikdc", "koos"],
  "lca":                ["lysholm", "tegner", "ikdc", "koos"],
  "hombro":             ["dash", "constant_murley", "spadi", "ases"],
  "manguito rotador":   ["constant_murley", "spadi", "ases", "dash"],
  "codo":               ["dash", "prtee", "meps"],
  "muneca":             ["dash", "prwe", "boston"],
  "mano":               ["dash", "boston", "dinamometria", "pinch"],
  "tunel carpiano":     ["boston", "dash"],
  "tobillo":            ["aofas", "fadi", "faam"],
  "pie":                ["aofas", "fadi", "manchester_oxford"],
  "columna":            ["oswestry", "roland_morris", "ndi", "eva"],
  "lumbar":             ["oswestry", "roland_morris", "eva", "tampa"],
  "cervical":           ["ndi", "eva", "dash", "tampa"],
  "dolor":              ["eva", "lanss", "dn4", "tampa", "brief_pain"],
  "dolor cronico":      ["eva", "dn4", "lanss", "tampa", "phq9", "hamilton_ansiedad"],
  "dolor neuropatico":  ["dn4", "lanss", "eva", "npsi"],
  "fibromialgia":       ["fiq", "eva", "phq9", "pittsburgh"],
  "artritis":           ["das28", "haq", "womac", "eva"],
  "artritis reumatoide":["das28", "haq", "eva", "dash"],

  // --- RESPIRATORIO ---
  "epoc":               ["mrc_disnea", "borg", "p6m", "cat_epoc", "bode", "mmrc"],
  "asma":               ["act", "acq", "borg", "mrc_disnea"],
  "disnea":             ["mrc_disnea", "mmrc", "borg", "p6m"],
  "fibrosis pulmonar":  ["p6m", "mrc_disnea", "borg", "ucsd"],
  "rehabilitacion respiratoria": ["p6m", "borg", "mrc_disnea", "cat_epoc", "sgrq"],
  "ventilacion":        ["weaning_index", "tobin", "rsbi"],
  "weaning":            ["weaning_index", "tobin", "rsbi", "mrc_sumscore"],
  "covid":              ["p6m", "borg", "mrc_disnea", "barthel", "phq9", "hamilton_ansiedad"],
  "post covid":         ["p6m", "borg", "mrc_disnea", "barthel", "phq9", "pittsburgh"],

  // --- PACIENTE CRÍTICO (UCI) ---
  "uci":                ["rass", "cam_icu", "mrc_sumscore", "fss_icu", "cpot", "apache_ii", "sofa", "saps"],
  "critico":            ["rass", "cam_icu", "mrc_sumscore", "fss_icu", "apache_ii", "sofa"],
  "sedacion":           ["rass", "sas", "bps"],
  "delirium":           ["cam_icu", "icdsc", "rass"],
  "agitacion":          ["rass", "sas", "bps"],
  "movilidad uci":      ["fss_icu", "ims", "pfas", "mrc_sumscore"],
  "sepsis":             ["sofa", "apache_ii", "saps", "news2"],
  "shock":              ["sofa", "apache_ii", "rass", "cpot"],
  "politrauma":         ["gcs", "iss", "rts", "apache_ii", "sofa"],
  "trauma":             ["gcs", "iss", "rts", "apache_ii"],
  "quemados":           ["vancouver", "lund_browder", "baux", "flacc"],

  // --- SALUD MENTAL ---
  "depresion":          ["phq9", "beck", "hamilton_depresion", "gds", "edinburgh"],
  "ansiedad":           ["gad7", "hamilton_ansiedad", "beck_ansiedad", "stai"],
  "estres":             ["pss", "dass21", "gad7"],
  "burnout":            ["maslach", "pss", "phq9"],
  "salud mental":       ["phq9", "gad7", "dass21", "pss", "pittsburgh"],
  "sueño":              ["pittsburgh", "epworth", "isi"],
  "insomnio":           ["isi", "pittsburgh", "epworth"],
  "somnolencia":        ["epworth", "pittsburgh"],
  "psicosis":           ["panss", "bprs"],
  "esquizofrenia":      ["panss", "bprs", "gaf"],
  "trastorno bipolar":  ["ymrs", "hamilton_depresion", "phq9"],
  "suicidio":           ["phq9", "columbia", "sad_persons"],
  "ideacion suicida":   ["phq9", "columbia", "sad_persons"],
  "autismo":            ["ados", "cars", "abc"],
  "tdah":               ["conners", "snap", "adhd_rs"],
  "postnatal":          ["edinburgh", "phq9"],
  "depresion postparto":["edinburgh", "phq9", "hamilton_depresion"],

  // --- FONOAUDIOLOGÍA ---
  "disfagia":           ["volume_viscosity", "eat10", "doss", "guss"],
  "deglucion":          ["volume_viscosity", "eat10", "doss", "guss"],
  "voz":                ["vhi", "rbh", "cape_v"],
  "disfonía":           ["vhi", "rbh", "grbas"],
  "lenguaje":           ["boston_afasia", "western_afasia"],
  "afasia":             ["nihss", "boston_afasia", "western_afasia", "rankin"],
  "tartamudez":         ["oases", "ssocs"],

  // --- PISO PÉLVICO ---
  "piso pelvico":       ["iciq_sf", "iiq7", "pelvic_organ_prolapse", "pfdi", "pisq"],
  "incontinencia":      ["iciq_sf", "iiq7", "bladder_diary", "pad_test"],
  "incontinencia urinaria": ["iciq_sf", "iiq7", "bladder_diary"],
  "prolapso":           ["pop_q", "pfdi", "pfiq"],
  "disfuncion sexual":  ["pisq", "iief", "fsfi"],

  // --- PEDIATRÍA ---
  "pediatria":          ["apgar", "gmfcs", "alberta", "wee_fim", "pews", "flacc"],
  "neonato":            ["apgar", "flacc", "nips", "crib"],
  "desarrollo":         ["alberta", "tepsi", "eddp", "bayley", "denver"],
  "motor grueso":       ["gmfm", "gmfcs", "peabody"],
  "paralisis cerebral": ["gmfcs", "gmfm", "ashworth", "macs", "cfcs"],
  "prematuro":          ["apgar", "crib", "nips", "alberta"],
  "dolor pediatrico":   ["flacc", "nips", "faces_wong"],
  "escolar":            ["tepsi", "conners", "snap"],

  // --- ONCOLOGÍA Y CUIDADOS PALIATIVOS ---
  "cancer":             ["karnofsky", "ecog", "esas", "eva", "mna", "phq9"],
  "oncologia":          ["karnofsky", "ecog", "esas", "barthel", "phq9"],
  "cuidados paliativos":["karnofsky", "ecog", "esas", "pfeiffer", "phq9", "pittsburgh"],
  "fatiga":             ["facit", "esas", "borg", "phq9"],
  "calidad de vida":    ["whoqol", "sf36", "eq5d", "esas"],

  // --- CARDIOVASCULAR ---
  "cardiovascular":     ["nyha", "borg", "p6m", "hamilton_ansiedad", "phq9"],
  "insuficiencia cardiaca": ["nyha", "borg", "p6m", "mlhfq"],
  "cardiopatia":        ["nyha", "borg", "p6m", "mlhfq", "phq9"],
  "rehabilitacion cardiaca": ["nyha", "borg", "p6m", "duke"],

  // --- ERGONOMÍA Y SALUD OCUPACIONAL ---
  "ergonomia":          ["reba", "rula", "rosas", "ocra"],
  "trabajo":            ["reba", "rula", "dash", "oswestry"],
  "laboral":            ["reba", "rula", "dash", "oswestry", "pss"],

  // --- CICATRIZ Y PIEL ---
  "cicatriz":           ["vancouver", "posas", "uss"],
  "quemadura":          ["vancouver", "lund_browder", "baux", "flacc"],

};

/**
 * Motor de Búsqueda Semántica Mejorado
 * - Coincidencia parcial bidireccional
 * - Tokenización por palabras para consultas compuestas
 * - Normalización de tildes y mayúsculas
 */
export const getSuggestedScales = (query: string): string[] => {
  if (!query || query.length < 3) return [];

  const normalize = (str: string) =>
    str.toLowerCase().trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const q = normalize(query);
  const tokens = q.split(/\s+/).filter(t => t.length >= 3);
  const suggestedIds = new Set<string>();

  Object.entries(clinicalMapping).forEach(([keyword, ids]) => {
    const nk = normalize(keyword);

    // Coincidencia exacta o parcial de la query completa
    const matchFull = q.includes(nk) || nk.includes(q);

    // Coincidencia por tokens individuales (ej: "acv severo" → matchea "acv")
    const matchToken = tokens.some(token => nk.includes(token) || token.includes(nk));

    if (matchFull || matchToken) {
      ids.forEach(id => suggestedIds.add(id));
    }
  });

  return Array.from(suggestedIds);
};