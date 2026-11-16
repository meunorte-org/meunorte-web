const personas = import.meta.glob('../assets/personas/*.png', { eager: true, query: '?url', import: 'default' })
export const personaDaArea = id => personas[`../assets/personas/${id}.png`]
// Recortes definidos pelo próprio Figma. O atlas permanece íntegro, sem redesenho dos selos.
export const RECORTES_SELOS = {
  exatas: [302, 340, 535.1, 316.86, -112.91, -62.11],
  saude: [321, 340, 503.43, 316.86, -200, -62.11],
  ambiente: [309, 340, 522.98, 316.86, -311.33, -62.11],
  agro: [321, 340, 503.43, 316.86, -396.88, -62.11],
  educacao: [321, 342, 503.43, 315.01, -396.88, -164.08],
  negocios: [314, 342, 514.65, 315.01, -305.1, -164.08],
  artes: [302, 342, 535.1, 315.01, -216.56, -164.08],
  direito: [305, 342, 529.84, 315.01, -113.77, -164.08],
  humanas: [324, 342, 498.77, 315.01, -5.25, -164.08],
  tecnologia: [322, 320, 501.86, 336.67, -4.66, -70.36],
}
