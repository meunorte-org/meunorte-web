import test from 'node:test'
import assert from 'node:assert/strict'
import { ocupacao, perfilVazio, tagsAutomaticas, tagsVisiveis, contar } from '../src/domain/perfil.js'
import { criarPerfilService } from '../src/services/perfil/perfilService.js'
import { criarAdaptadorLocal } from '../src/services/perfil/localAdapter.js'
const usuario = { id: 'usuario-a', user_metadata: { full_name: 'Pessoa Teste', birth_date: '2000-11-16', education_level: 'medio_cursando' } }
function preparar() {
  const dados = new Map(), blobs = new Map()
  const adapter = criarAdaptadorLocal({ getItem: id => dados.get(id) ?? null, setItem: (id, valor) => dados.set(id, valor) })
  const fotos = { salvar: async (u, id, blob) => blobs.set(`${u}:${id}`, blob), carregar: async (u, id) => blobs.get(`${u}:${id}`), excluir: async (u, id) => blobs.delete(`${u}:${id}`) }
  return { servico: criarPerfilService(adapter, fotos), dados }
}
test('ocupações respeitam códigos existentes, EJA identificada e situações não previstas', () => {
  for (const codigo of ['fundamental', 'medio_cursando', 'eja_fundamental', 'eja_medio']) assert.equal(ocupacao(codigo), 'Estudante')
  assert.equal(ocupacao('superior_cursando'), 'Universitário(a)')
  for (const codigo of ['medio_concluido', 'superior_concluido', 'outra_situacao', 'eja', null]) assert.equal(ocupacao(codigo), null)
})
test('idade considera aniversário e não inventa tag de afinidade', () => {
  const p = perfilVazio()
  assert.equal(tagsAutomaticas(usuario, p, '2026-11-15').find(t => t.id === 'idade').texto, '25 anos')
  assert.equal(tagsAutomaticas(usuario, p, '2026-11-16').find(t => t.id === 'idade').texto, '26 anos')
  assert.equal(tagsAutomaticas(usuario, p).some(t => t.id === 'afinidade'), false)
  assert.equal(tagsAutomaticas({ user_metadata: {} }, p).length, 0)
})
test('alteração externa de dados automáticos nunca exibe mais de seis tags', () => {
  const p = perfilVazio()
  p.tags = Array.from({ length: 6 }, (_, i) => ({ id: `${i}`, texto: `tag ${i}`, cor: 'lima' }))
  assert.equal(tagsVisiveis(usuario, p).length, 6)
  assert.equal(p.tags.length, 6)
})
test('tags validam limite total, duplicatas, caracteres e não alteram dados do Auth', async () => {
  const { servico } = preparar()
  for (let i = 0; i < 4; i++) await servico.salvarTag(usuario, { texto: `tag ${i}`, cor: 'lima' })
  await assert.rejects(servico.salvarTag(usuario, { texto: 'sétima', cor: 'lima' }), /até 6/)
  await assert.rejects(servico.salvarTag(usuario, { texto: ' TAG 0 ', cor: 'menta' }), /Já existe/)
  await assert.rejects(servico.salvarTag(usuario, { texto: ' ', cor: 'lima' }), /Preencha/)
  await assert.rejects(servico.salvarTag(usuario, { texto: 'a'.repeat(21), cor: 'lima' }), /20/)
  await assert.rejects(servico.salvarTag(usuario, { texto: 'nome', cor: 'invalida' }), /cor/)
  await servico.atualizarVisibilidade(usuario, { idade: false })
  await servico.salvarTag(usuario, { texto: 'mais uma', cor: 'coral' })
  await assert.rejects(servico.atualizarVisibilidade(usuario, { idade: true }), /até 6/)
  assert.equal(usuario.user_metadata.birth_date, '2000-11-16')
})
test('bio e objetivos têm CRUD, limites e isolamento por usuário', async () => {
  const { servico } = preparar()
  await servico.atualizarBio(usuario, ' Minha apresentação ')
  await assert.rejects(servico.atualizarBio(usuario, 'a'.repeat(161)), /160/)
  let p = await servico.salvarObjetivo(usuario, { titulo: '', texto: 'Estudar para o ENEM' })
  const id = p.objetivos[0].id
  p = await servico.salvarObjetivo(usuario, { id, titulo: 'Meu plano', texto: 'Pesquisar bolsas' })
  assert.equal(p.objetivos.length, 1)
  assert.equal(p.objetivos[0].texto, 'Pesquisar bolsas')
  p = await servico.excluirObjetivo(usuario, id)
  assert.equal(p.objetivos.length, 0)
  assert.equal((await servico.obterPerfil({ ...usuario, id: 'usuario-b' })).bio, '')
  assert.equal((await servico.obterPerfil(usuario)).bio, 'Minha apresentação')
  assert.equal(contar('🧭'), 1)
})
test('favoritos são compartilhados pelo serviço e podem ser removidos', async () => {
  const { servico } = preparar()
  const area = { id: 'tecnologia', nome: 'Tecnologia' }
  await servico.alternarFavorito(usuario, 'areas', area)
  assert.deepEqual(await servico.listarAreasFavoritas(usuario), [area])
  await servico.alternarFavorito(usuario, 'areas', area)
  assert.deepEqual(await servico.listarAreasFavoritas(usuario), [])
  await servico.alternarFavorito(usuario, 'faculdades', { id: 'instituicao', nome: 'Instituição teste' })
  assert.equal((await servico.listarFaculdadesSalvas(usuario)).length, 1)
})
test('avatar oficial e foto usam IDs persistentes, nunca URL temporária', async () => {
  const { servico, dados } = preparar()
  await assert.rejects(servico.selecionarAvatar(usuario, 'desconhecido'))
  await servico.selecionarAvatar(usuario, 'tecnologia')
  const blob = new Blob(['imagem-de-teste'], { type: 'image/webp' })
  const p = await servico.salvarFoto(usuario, blob)
  assert.equal(p.avatar.tipo, 'foto')
  assert.equal(await servico.carregarFoto(usuario, p.avatar.id), blob)
  assert.equal([...dados.values()].some(v => v.includes('blob:')), false)
})
test('falha de persistência é informada em vez de simular salvamento', async () => {
  const adapter = criarAdaptadorLocal({ getItem: () => null, setItem: () => { throw new Error('quota') } })
  await assert.rejects(criarPerfilService(adapter).atualizarBio(usuario, 'bio'), /Não foi possível salvar/)
})
