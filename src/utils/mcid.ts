// Minimum Clinically Important Difference (MCID) por escala
// Referencia: valores validados en literatura científica para cada instrumento

interface McidData {
  valor: number;
  unidad: string;
  referencia: string;
}

const MCID_MAP: Record<string, McidData> = {
  // Neurología / Funcionalidad
  'berg':             { valor: 7,    unidad: 'pts', referencia: 'Donoghue & Stokes, 2009' },
  'barthel':          { valor: 14,   unidad: 'pts', referencia: 'Hsueh et al., 2002' },
  'nihss':            { valor: 4,    unidad: 'pts', referencia: 'Mukand et al., 2003' },
  'fugl_meyer':       { valor: 10,   unidad: 'pts', referencia: 'Page et al., 2012' },
  'fugel_meyer':      { valor: 10,   unidad: 'pts', referencia: 'Page et al., 2012' },
  'rankin':           { valor: 1,    unidad: 'pts', referencia: 'Lai et al., 2002' },
  'edss':             { valor: 1,    unidad: 'pts', referencia: 'Learmonth et al., 2013' },
  'fim':              { valor: 22,   unidad: 'pts', referencia: 'Beninato et al., 2006' },
  'wee_fim':          { valor: 6,    unidad: 'pts', referencia: 'Ottenbacher et al., 2000' },
  'rivermead':        { valor: 2,    unidad: 'pts', referencia: 'Hsueh et al., 2008' },
  'moca':             { valor: 2,    unidad: 'pts', referencia: 'Damian et al., 2011' },
  'minimental':       { valor: 3,    unidad: 'pts', referencia: 'Schmitt & McCord, 2003' },

  // Marcha y Equilibrio
  'tug':              { valor: 3.5,  unidad: 'seg', referencia: 'Donoghue et al., 2008' },
  'tinetti':          { valor: 3,    unidad: 'pts', referencia: 'Faber et al., 2006' },
  'p6m':              { valor: 30,   unidad: 'mts', referencia: 'Holland et al., 2014' },
  'sppb':             { valor: 1,    unidad: 'pts', referencia: 'Perera et al., 2006' },

  // Traumatología / Ortopedia
  'dash':             { valor: 10,   unidad: 'pts', referencia: 'Schmitt & Di Fabio, 2004' },
  'harris_hip':       { valor: 7,    unidad: 'pts', referencia: 'Mahomed et al., 2001' },
  'oxford_hip':       { valor: 5,    unidad: 'pts', referencia: 'Murray et al., 2007' },
  'oxford_knee':      { valor: 5,    unidad: 'pts', referencia: 'Beard et al., 2015' },
  'lysholm':          { valor: 8,    unidad: 'pts', referencia: 'Briggs et al., 2009' },
  'womac':            { valor: 10,   unidad: '%',   referencia: 'Ehrich et al., 2000' },
  'koos':             { valor: 8,    unidad: 'pts', referencia: 'Roos & Lohmander, 2003' },
  'hoos':             { valor: 8,    unidad: 'pts', referencia: 'Klassbo et al., 2003' },
  'dinamometria':     { valor: 5,    unidad: 'kg',  referencia: 'Bohannon, 2006' },

  // Dolor
  'eva':              { valor: 1.5,  unidad: 'pts', referencia: 'Farrar et al., 2001' },
  'dn4':              { valor: 1,    unidad: 'pts', referencia: 'Bennett et al., 2007' },

  // Cardiorrespiratorio
  'mmrc':             { valor: 1,    unidad: 'grd', referencia: 'Mahler & Wells, 1988' },
  'borg':             { valor: 1,    unidad: 'pts', referencia: 'Wilson & Jones, 1991' },
  'nyha':             { valor: 1,    unidad: 'cls', referencia: 'Green et al., 2000' },

  // Psicología
  'phq9':             { valor: 5,    unidad: 'pts', referencia: 'Löwe et al., 2004' },
  'phq_9':            { valor: 5,    unidad: 'pts', referencia: 'Löwe et al., 2004' },
  'gad7':             { valor: 4,    unidad: 'pts', referencia: 'Löwe et al., 2008' },
  'gad_7':            { valor: 4,    unidad: 'pts', referencia: 'Löwe et al., 2008' },
  'hamilton_depresion': { valor: 7,  unidad: 'pts', referencia: 'Leucht et al., 2013' },

  // Geriatría / Nutrición
  'mna':              { valor: 3,    unidad: 'pts', referencia: 'Vellas et al., 2006' },
  'lawton_brody':     { valor: 1,    unidad: 'pts', referencia: 'Cromwell et al., 2003' },

  // Fonoaudiología
  'vhi':              { valor: 18,   unidad: 'pts', referencia: 'Jacobson et al., 1997' },
  'eat10':            { valor: 3,    unidad: 'pts', referencia: 'Belafsky et al., 2008' },
};

export interface McidResult {
  mcid: number;
  unidad: string;
  referencia: string;
  esSuficiente: boolean;
  diferencia: number;
}

/**
 * Evalúa si el cambio en puntaje supera el MCID de una escala.
 * Busca por ID exacto primero, luego por coincidencia parcial en el nombre.
 */
export const evaluarMCID = (
  escalaId: string,
  nombreEscala: string,
  diferenciaPuntos: number
): McidResult | null => {
  const id = escalaId.toLowerCase();
  const nombre = nombreEscala.toLowerCase();

  let data = MCID_MAP[id];

  if (!data) {
    const key = Object.keys(MCID_MAP).find(k => nombre.includes(k) || id.includes(k));
    if (key) data = MCID_MAP[key];
  }

  if (!data) return null;

  const diferencia = Math.abs(diferenciaPuntos);
  return {
    mcid: data.valor,
    unidad: data.unidad,
    referencia: data.referencia,
    esSuficiente: diferencia >= data.valor,
    diferencia,
  };
};
