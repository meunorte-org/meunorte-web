import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularResultado } from '../src/domain/testeVocacional.js'
import { PERGUNTAS } from '../src/data/perguntasVocacionais.js'
import { AREAS_CATALOGO } from '../src/data/areasCatalogo.js'
import { areasService } from '../src/services/areasService.js'
import { pesquisarCatalogo, criarFaculdadesService } from '../src/services/faculdadesService.js'
import { criarPerfilService } from '../src/services/perfil/perfilService.js'
import { criarAdaptadorLocal } from '../src/services/perfil/localAdapter.js'
import { tagsVisiveis } from '../src/domain/perfil.js'
import { ACERVO_ENEM } from '../src/data/acervoEnem.js'
import { compartilharImagem } from '../src/services/compartilharImagem.js'
const usuario = { id: 'teste-etapa2', user_metadata: {} }
const neutras = () => PERGUNTAS.map(() => 'neutra')
function escolhasPara(...areas) { return PERGUNTAS.map(q => q.alternativas.find(a => areas.some(id => a.pontos[id]))?.id ?? 'neutra') }
function perfilPreparado() { const mapa = new Map(); return criarPerfilService(criarAdaptadorLocal({ getItem: id => mapa.get(id) ?? null, setItem: (id, valor) => mapa.set(id, valor) })) }
test('matriz oferece as mesmas três oportunidades e peso total às dez áreas', () => {
  const maximos = Object.fromEntries(AREAS_CATALOGO.map(a => [a.id, 0]))
  for (const q of PERGUNTAS) { assert.equal(q.alternativas.length, 3); for (const a of q.alternativas) for (const [id, peso] of Object.entries(a.pontos)) { assert.ok(id in maximos); assert.equal(peso, 1); maximos[id] += peso } }
  assert.deepEqual(Object.values(maximos), Array(10).fill(3))
})
test('neutras e respostas insuficientes não inventam afinidade', () => {
  assert.equal(calcularResultado(neutras()).suficiente, false)
  const r = escolhasPara('tecnologia')
  assert.equal(calcularResultado(r).informativas, 3)
  assert.equal(calcularResultado(r).areaPrincipal, null)
  assert.throws(() => calcularResultado(['a0']), /dez/)
  assert.throws(() => calcularResultado(Array(10).fill('inexistente')), /Confira/)
})
test('empate é explícito e nunca escolhe uma área pelo índice', () => {
  const respostas = escolhasPara('tecnologia', 'exatas')
  const r = calcularResultado(respostas)
  assert.deepEqual(r.principais, ['tecnologia', 'exatas'])
  assert.equal(r.areaPrincipal, null)
  assert.deepEqual(r, calcularResultado(respostas))
})
test('liderança e área secundária vêm das escolhas reais, sem porcentagens', () => {
  const respostas = escolhasPara('tecnologia', 'exatas')
  const ultima = PERGUNTAS.findLastIndex(q => q.alternativas.find(a => a.id === respostas[PERGUNTAS.indexOf(q)])?.pontos.exatas)
  respostas[ultima] = 'neutra'
  const r = calcularResultado(respostas)
  assert.equal(r.areaPrincipal, 'tecnologia')
  assert.deepEqual(r.secundarias, ['exatas'])
  assert.equal(r.pontos.tecnologia, 3)
  assert.equal(r.pontos.exatas, 2)
  assert.equal(r.evidencias.tecnologia.length, 3)
  assert.ok(r.evidencias.tecnologia.every(texto => PERGUNTAS.some(q => q.alternativas.some(a => a.texto === texto && a.pontos.tecnologia))))
})
test('resultado alimenta Perfil e preserva visibilidade sem exceder seis tags', async () => {
  const s = perfilPreparado()
  for (let i = 0; i < 6; i++) await s.salvarTag(usuario, { texto: `Interesse ${i}`, cor: 'lima' })
  const respostas = escolhasPara('tecnologia', 'exatas'); respostas[1] = 'neutra'
  const p = await s.salvarResultado(usuario, respostas)
  assert.equal(p.areaAfinidade, 'tecnologia')
  assert.equal(p.visibilidade.afinidade, false)
  assert.equal(tagsVisiveis(usuario, p).length, 6)
  assert.equal((await s.obterPerfil({ id: 'outro' })).areaAfinidade, null)
  const n = await s.salvarResultado(usuario, neutras())
  assert.equal(n.areaAfinidade, null)
})
test('dez detalhes e cursos ilustrativos estão fora dos componentes', () => {
  assert.equal(areasService.listar().length, 10)
  for (const a of areasService.listar()) { assert.ok(a.apresentacao && a.atuacao && a.atividades); assert.equal(a.interesses.length, 3); assert.ok(a.cursos.every(c => c.provisorio && c.id && c.nome)) }
  assert.equal(areasService.consultar('ausente'), null)
})
// Fixtures exclusivas de teste: não entram no catálogo exibido à pessoa.
const catalogo = {
  status: 'disponivel', instituicoes: [{ id: 'a', nome: 'Fixture A', tipo: 'publica', cidade: 'Vitória da Conquista' }, { id: 'b', nome: 'Fixture B', tipo: 'privada', cidade: 'Vitória da Conquista' }],
  cursos: [{ id: 'p', nome: 'Psicologia', sinonimos: ['Estudos da mente'] }, { id: 's', nome: 'Sistemas de Informação', sinonimos: ['SI'] }],
  ofertas: [{ id: 'ap', instituicaoId: 'a', cursoId: 'p' }, { id: 'bp', instituicaoId: 'b', cursoId: 'p' }, { id: 'bs', instituicaoId: 'b', cursoId: 's' }],
}
test('pesquisa de cursos combina trechos, acentos, sinônimos e tipo com relação N:N', () => {
  assert.equal(pesquisarCatalogo(catalogo, { busca: 'PSICO' }).length, 2)
  assert.deepEqual(pesquisarCatalogo(catalogo, { busca: ' MENTE ', tipo: 'privada' }).map(i => i.id), ['b'])
  assert.equal(pesquisarCatalogo(catalogo, { busca: 'informacao' })[0].ofertas[0].curso.nome, 'Sistemas de Informação')
  assert.equal(pesquisarCatalogo(catalogo, { busca: 'Sistemas', tipo: 'publica' }).length, 0)
  assert.equal(pesquisarCatalogo(catalogo, { busca: 'inexistente' }).length, 0)
  assert.equal(pesquisarCatalogo({ ...catalogo, instituicoes: [{ ...catalogo.instituicoes[0], cidade: 'Outra cidade' }] }).length, 0)
})
test('fonte pendente não fornece instituições fictícias; erros não viram sucesso', async () => {
  assert.deepEqual(await criarFaculdadesService().pesquisar({}), { status: 'pendente', instituicoes: [] })
  await assert.rejects(criarFaculdadesService({ carregar: async () => { throw new Error('offline') } }).pesquisar({}), /offline/)
})
test('serviço consulta ofertas N:N e reutiliza favoritos do Perfil', async () => {
  const perfil = perfilPreparado()
  const s = criarFaculdadesService({ carregar: async () => structuredClone(catalogo) }, perfil)
  assert.equal((await s.consultar('b')).ofertas.length, 2)
  assert.equal((await s.consultarOfertas(null, 'p')).length, 2)
  await s.alternarFavorito(usuario, catalogo.instituicoes[1])
  assert.equal((await perfil.listarFaculdadesSalvas(usuario))[0].id, 'b')
  await perfil.alternarFavorito(usuario, 'faculdades', catalogo.instituicoes[1])
  assert.deepEqual(await s.listarFavoritos(usuario), [])
})
test('acervo inicial contém anos configuráveis e documentos oficiais distintos por dia', () => {
  assert.deepEqual(ACERVO_ENEM.map(e => e.ano), [2025, 2024, 2023, 2022, 2021, 2020])
  for (const e of ACERVO_ENEM) for (const m of e.materiais) { assert.ok([1, 2].includes(m.dia)); assert.ok(m.documentos.length); for (const link of m.documentos.map(d => d.url)) { assert.equal(new URL(link).hostname, 'download.inep.gov.br'); assert.ok(link.endsWith('.pdf')) } }
})
test('compartilhamento nativo recebe PNG real sem dados pessoais', async () => {
  let recebido
  const blob = new Blob(['png-de-teste'], { type: 'image/png' })
  const r = await compartilharImagem(blob, 'resultado.png', { navegador: { canShare: ({ files }) => files[0].type === 'image/png', share: async dados => { recebido = dados } }, baixar: () => assert.fail('Não deve baixar quando compartilha') })
  assert.equal(r, 'compartilhado'); assert.equal(recebido.files[0].name, 'resultado.png'); assert.equal(await recebido.files[0].text(), 'png-de-teste')
  assert.deepEqual(Object.keys(recebido).sort(), ['files', 'title'])
})
test('sem compartilhamento de arquivos, há download; cancelar não dispara download inesperado', async () => {
  let baixado = 0
  const blob = new Blob(['png'], { type: 'image/png' })
  assert.equal(await compartilharImagem(blob, 'resultado.png', { navegador: {}, baixar: () => baixado++ }), 'baixado')
  assert.equal(baixado, 1)
  await assert.rejects(compartilharImagem(blob, 'resultado.png', { navegador: { canShare: () => true, share: async () => { throw new DOMException('Cancelado', 'AbortError') } }, baixar: () => baixado++ }), { name: 'AbortError' })
  assert.equal(baixado, 1)
})
