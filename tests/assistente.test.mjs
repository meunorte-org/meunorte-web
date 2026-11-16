import test from 'node:test'
import assert from 'node:assert/strict'
import { contextoDaTela, eArraste, limitarPosicao, normalizarPosicao, projetarPosicao, posicaoValida, linkSeguro } from '../src/domain/assistente.js'
import { criarAssistenteService } from '../src/services/ai/assistenteService.js'
import { criarPerfilService } from '../src/services/perfil/perfilService.js'
import { criarAdaptadorLocal } from '../src/services/perfil/localAdapter.js'
import { criarFaculdadesService } from '../src/services/faculdadesService.js'
const entrada = () => ({ conversaId: null, mensagens: [{ id: 'm1', papel: 'usuario', texto: 'Como funciona o SISU?' }] })
test('oito pixels distinguem arraste de pequenos movimentos de toque', () => {
  assert.equal(eArraste({ x: 10, y: 10 }, { x: 15, y: 15 }), false)
  assert.equal(eArraste({ x: 10, y: 10 }, { x: 18, y: 10 }), true)
})
test('posição normalizada permanece acessível entre viewports e limites reduzidos', () => {
  const b = { minX: 12, maxX: 314, minY: 20, maxY: 650 }, p = { x: 250, y: 300 }
  const n = normalizarPosicao(p, b)
  assert.ok(posicaoValida(n)); assert.deepEqual(projetarPosicao(n, b), p)
  assert.deepEqual(limitarPosicao({ x: -900, y: 2000 }, b), { x: 12, y: 650 })
  assert.deepEqual(projetarPosicao(n, { minX: 12, maxX: 12, minY: 20, maxY: 20 }), { x: 12, y: 20 })
  assert.equal(posicaoValida({ x: Infinity, y: 0 }), false)
})
test('contexto usa lista positiva e não inclui dados privados ou URL', () => {
  assert.deepEqual(contextoDaTela({ secao: 'areas', item: 'tecnologia', email: 'privado', busca: 'dados pessoais' }), { secao: 'areas', areaId: 'tecnologia' })
  assert.deepEqual(contextoDaTela({ secao: 'perfil', item: 'usuario-privado' }), { secao: 'perfil' })
  assert.deepEqual(contextoDaTela({ secao: 'faculdades', item: 'pessoa@email.com' }), { secao: 'faculdades' })
})
test('links não executam scripts, dados, arquivos ou credenciais embutidas', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///c:/secret', '/relativo', 'https://senha:privada@example.com']) assert.equal(linkSeguro(url), null)
  assert.equal(linkSeguro('https://www.gov.br/inep'), 'https://www.gov.br/inep')
})
test('padrão do assistente é indisponível, sem rede ou resposta falsa', async () => {
  const s = criarAssistenteService(); assert.equal(s.configurado, false)
  await assert.rejects(s.enviarMensagem(entrada()), { codigo: 'nao_configurado' })
})
test('adaptador recebe somente DTO autorizado e retorna resposta final', async () => {
  let recebido
  const s = criarAssistenteService({ transporte: async p => { recebido = p; return { conversaId: 'c1', resposta: { id: 'r1', texto: 'Resposta exclusiva de teste.', segredo: 'remover' }, token: 'remover' } } })
  const p = entrada(); p.mensagens[0].password = 'não transmitir'; p.contexto = { secao: 'areas', areaId: 'tecnologia', email: 'não transmitir' }
  const r = await s.enviarMensagem(p)
  assert.deepEqual(recebido.mensagens, [{ id: 'm1', papel: 'usuario', texto: 'Como funciona o SISU?' }]); assert.deepEqual(recebido.contexto, { secao: 'areas', areaId: 'tecnologia' })
  assert.deepEqual(r, { conversaId: 'c1', resposta: { id: 'r1', texto: 'Resposta exclusiva de teste.' } })
})
test('mensagens vazias, enormes e respostas inesperadas são rejeitadas', async () => {
  const s = criarAssistenteService({ transporte: async () => ({ resposta: { id: 'r1', texto: '' } }) })
  for (const texto of ['', ' ', 'x'.repeat(2001)]) await assert.rejects(s.enviarMensagem({ ...entrada(), mensagens: [{ id: 'm1', papel: 'usuario', texto }] }), { codigo: 'entrada_invalida' })
  await assert.rejects(s.enviarMensagem(entrada()), { codigo: 'resposta_invalida' })
  await assert.rejects(criarAssistenteService({ transporte: async () => ({ resposta: { id: 'm1', texto: 'Duplicada' } }) }).enviarMensagem(entrada()), { codigo: 'resposta_invalida' })
})
test('timeout encerra a espera mesmo quando transporte ignora sinal', async () => {
  const s = criarAssistenteService({ timeoutMs: 12, transporte: () => new Promise(() => {}) })
  await assert.rejects(s.enviarMensagem(entrada()), { codigo: 'tempo_limite' })
})
test('cancelamento antes e durante requisição é explícito', async () => {
  const c = new AbortController(), s = criarAssistenteService({ transporte: () => new Promise(() => {}) })
  const p = s.enviarMensagem({ ...entrada(), signal: c.signal }); c.abort()
  await assert.rejects(p, { codigo: 'cancelada' }); await assert.rejects(s.enviarMensagem({ ...entrada(), signal: c.signal }), { codigo: 'cancelada' })
})
test('falhas são traduzidas sem expor mensagens internas do backend', async () => {
  for (const erro of [new Error('segredo-backend'), new TypeError('segredo-rede')]) { try { await criarAssistenteService({ transporte: async () => { throw erro } }).enviarMensagem(entrada()); assert.fail() } catch (e) { assert.ok(['conexao', 'indisponivel'].includes(e.codigo)); assert.equal(e.message.includes('segredo'), false) } }
})
function perfil() { const mapa = new Map(), blobs = new Map(); return criarPerfilService(criarAdaptadorLocal({ getItem: k => mapa.get(k), setItem: (k, v) => mapa.set(k, v) }), { salvar: async (u, id, b) => blobs.set(id, b), carregar: async (u, id) => blobs.get(id), excluir: async (u, id) => blobs.delete(id) }) }
test('objetivos têm proprietário, datas, ordenação e validação de IDs', async () => {
  const s = perfil(), u = { id: 'a' }, outro = { id: 'b' }
  await s.salvarObjetivo(u, { titulo: 'Primeiro', texto: 'Planejar' }); await s.salvarObjetivo(u, { titulo: '', texto: 'Estudar' })
  const itens = await s.listarObjetivos(u); assert.equal(itens[0].usuarioId, u.id); assert.ok(itens[0].criadoEm); assert.ok(itens[0].atualizadoEm)
  const ordem = itens.map(o => o.id).reverse(); assert.deepEqual((await s.ordenarObjetivos(u, ordem)).objetivos.map(o => o.id), ordem)
  await assert.rejects(s.ordenarObjetivos(u, [ordem[0], ordem[0]]), /ordem/)
  await assert.rejects(s.salvarObjetivo(outro, { ...itens[0], texto: 'Alteração indevida' }), /não foi encontrado/)
  assert.deepEqual(await s.listarObjetivos(outro), [])
})
test('remoção de avatar/foto e ordenação de tags preservam isolamento', async () => {
  const s = perfil(), u = { id: 'a' }
  await s.salvarTag(u, { texto: 'Primeira', cor: 'lima' }); const p = await s.salvarTag(u, { texto: 'Segunda', cor: 'menta' }); const ids = p.tags.map(t => t.id).reverse()
  assert.deepEqual((await s.ordenarTags(u, ids)).tags.map(t => t.id), ids)
  await assert.rejects(s.salvarTag({ id: 'b' }, { ...p.tags[0], texto: 'Outra' }), /não foi encontrada/)
  await s.salvarFoto(u, new Blob(['foto'], { type: 'image/webp' })); assert.equal((await s.removerAvatar(u)).avatar, null)
  await assert.rejects(s.salvarFoto(u, new Blob(['svg'], { type: 'image/svg+xml' })), /JPEG/)
})
test('catálogo pode delegar consultas remotas sem alterar contrato da tela', async () => {
  let filtros
  const s = criarFaculdadesService({ pesquisar: async f => { filtros = f; return { status: 'disponivel', instituicoes: [] } }, consultar: async id => ({ id }), listarCursos: async () => [], consultarOfertas: async () => [] })
  const c = new AbortController(); assert.deepEqual(await s.pesquisar({ busca: 'psico', tipo: 'privada', signal: c.signal }), { status: 'disponivel', instituicoes: [] }); assert.equal(filtros.signal, c.signal); assert.equal((await s.consultar('i')).id, 'i')
})
