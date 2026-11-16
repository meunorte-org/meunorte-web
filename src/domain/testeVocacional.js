import { PERGUNTAS } from '../data/perguntasVocacionais.js'
import { AREAS_CATALOGO } from '../data/areasCatalogo.js'
/** Matriz editorial v1, exploratória, sem validação psicométrica.
 * 10 questões × 3 alternativas, cada uma vale 1 para uma área. Cada área tem
 * 3 oportunidades (máximo 3). Neutra vale 0. Não exibimos porcentagens.
 * Evidência mínima: 4 escolhas não neutras E líder com >=2 pontos.
 * Empate no topo: mostramos todos, sem escolher uma tag arbitrária.
 * Secundárias: >=2 pontos E >= metade do topo, excluindo líderes empatados.
 */
export function calcularResultado(respostas) {
  if (!Array.isArray(respostas) || respostas.length !== PERGUNTAS.length) throw new Error('Responda às dez perguntas para ver seu resultado.')
  const pontos = Object.fromEntries(AREAS_CATALOGO.map(a => [a.id, 0]))
  const evidencias = Object.fromEntries(AREAS_CATALOGO.map(a => [a.id, []]))
  let informativas = 0
  PERGUNTAS.forEach((q, i) => {
    if (respostas[i] === 'neutra') return
    const a = q.alternativas.find(a => a.id === respostas[i])
    if (!a) throw new Error('Confira as respostas antes de continuar.')
    informativas++
    Object.entries(a.pontos).forEach(([id, valor]) => { pontos[id] += valor; if (valor > 0) evidencias[id].push(a.texto) })
  })
  const maior = Math.max(...Object.values(pontos))
  const suficiente = informativas >= 4 && maior >= 2
  const principais = suficiente ? AREAS_CATALOGO.filter(a => pontos[a.id] === maior).map(a => a.id) : []
  const secundarias = suficiente ? AREAS_CATALOGO.filter(a => !principais.includes(a.id) && pontos[a.id] >= 2 && pontos[a.id] >= maior / 2).map(a => a.id) : []
  return { versao: 1, pontos, evidencias, informativas, suficiente, principais, secundarias, areaPrincipal: principais.length === 1 ? principais[0] : null }
}
