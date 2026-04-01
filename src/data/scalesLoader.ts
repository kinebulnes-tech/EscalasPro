// Motor de carga dinámica por categoría
// Solo descarga el chunk cuando el usuario lo necesita

const loaders: Record<string, () => Promise<{ default: any[] }>> = {
  uci:                () => import('./scales/uci'),
  neurologia:         () => import('./scales/neurologia'),
  geriatria:          () => import('./scales/geriatria'),
  traumatologia:      () => import('./scales/traumatologiayortopedia'),
  cardiorespiratorio: () => import('./scales/cardiorespiratorio'),
  pediatria:          () => import('./scales/pediatria'),
  emergencias:        () => import('./scales/emergencias'),
  cognitivas:         () => import('./scales/cognitivas'),
  enfermeria:         () => import('./scales/enfermeria'),
  fonoaudiologia:     () => import('./scales/fonoaudiologia'),
  kinesiologia:       () => import('./scales/kinesiologia'),
  nutricion:          () => import('./scales/nutricion'),
  paliativos:         () => import('./scales/paliativos'),
  psicologia:         () => import('./scales/psicologia'),
  terapia_ocupacional: () => import('./scales/terapia_ocupacional'),
};

const cache = new Map<string, any[]>();

export async function loadScalesByCategory(categoryId: string): Promise<any[]> {
  if (cache.has(categoryId)) return cache.get(categoryId)!;

  const loader = loaders[categoryId];
  if (!loader) return [];

  const module = await loader();
  cache.set(categoryId, module.default);
  return module.default;
}

// Para búsqueda: carga todas las categorías en paralelo (solo la primera vez)
export async function loadAllScales(): Promise<any[]> {
  const all = await Promise.all(
    Object.values(loaders).map(fn => fn().then(m => m.default))
  );
  return all.flat();
}