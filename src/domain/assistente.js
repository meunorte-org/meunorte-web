import { AREAS_CATALOGO } from '../data/areasCatalogo.js'
export const LIMIAR_ARRASTE = 8
export const limitar = (n, min, max) => Math.min(Math.max(n, min), Math.max(min, max))
export function limitarPosicao(p, b) { return { x: limitar(p.x, b.minX, b.maxX), y: limitar(p.y, b.minY, b.maxY) } }
export function normalizarPosicao(p, b) { return { x: limitar((p.x - b.minX) / Math.max(1, b.maxX - b.minX), 0, 1), y: limitar((p.y - b.minY) / Math.max(1, b.maxY - b.minY), 0, 1) } }
export function projetarPosicao(p, b) { return limitarPosicao({ x: b.minX + p.x * (b.maxX - b.minX), y: b.minY + p.y * (b.maxY - b.minY) }, b) }
export function eArraste(inicio, atual) { return Math.hypot(atual.x - inicio.x, atual.y - inicio.y) >= LIMIAR_ARRASTE }
export function posicaoValida(p) { return p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1 }
// Lista positiva: nenhuma URL completa, busca, nome, e-mail, resposta do teste ou perfil.
export function contextoDaTela(rota) {
  const secao = ['perfil', 'areas', 'faculdades', 'ingressos'].includes(rota?.secao) ? rota.secao : 'perfil'
  const contexto = { secao }
  if (secao === 'areas' && AREAS_CATALOGO.some(a => a.id === rota.item)) contexto.areaId = rota.item
  if (secao === 'areas' && rota.item === 'teste') contexto.tela = 'teste-vocacional'
  if (secao === 'ingressos' && /^(enem|sisu|prouni|fies|vestibulares)(\/20\d{2})?$/.test(rota.item ?? '')) contexto.assunto = rota.item
  if (secao === 'faculdades' && /^[a-zA-Z0-9_-]{1,100}$/.test(rota.item ?? '')) contexto.instituicaoId = rota.item
  return contexto
}
export function rotuloContexto(contexto) {
  if (contexto.areaId) return `Áreas · ${AREAS_CATALOGO.find(a => a.id === contexto.areaId)?.nome}`
  if (contexto.assunto) return contexto.assunto.toLocaleUpperCase('pt-BR').replace('/', ' · ')
  return { perfil: 'Perfil', areas: 'Áreas', faculdades: 'Faculdades', ingressos: 'Ingressos' }[contexto.secao]
}
export function linkSeguro(valor) {
  try { const url = new URL(valor); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null } catch { return null }
}
