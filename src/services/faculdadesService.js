import { perfilService } from './perfil/perfilService.js'
/** Contratos para a futura integração (sem consultas a tabelas presumidas):
 * Instituicao: {id,nome,tipo:'publica'|'privada',endereco,cidade,descricao,
 * imagem,site,informacoesAdicionais,links:[{nome,url}],fonte,verificadoEm}.
 * Curso: {id,nome,areaId,sinonimos:[],descricao?}.
 * Oferta: {id,instituicaoId,cursoId,modalidade,ingressos:[],mensalidade?,
 * bolsas?,financiamentos?,fonte,verificadoEm}. Benefícios só se confirmados.
 * O adaptador retorna {instituicoes:[],cursos:[],ofertas:[],status:'pendente'|'disponivel'}.
 * Relação N:N exclusivamente pelas ofertas. IDs estáveis, sem inferir adesões.
 */
export const normalizarBusca = texto => String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g, ' ')
export function pesquisarCatalogo(catalogo, { busca = '', tipo = 'todas' } = {}) {
  const termo = normalizarBusca(busca)
  const cursos = catalogo.cursos.filter(c => !termo || [c.nome, ...(c.sinonimos ?? [])].some(n => normalizarBusca(n).includes(termo)))
  const ids = new Set(cursos.map(c => c.id))
  return catalogo.instituicoes.filter(i => normalizarBusca(i.cidade) === 'vitoria da conquista' && (tipo === 'todas' || i.tipo === tipo) && (!termo || catalogo.ofertas.some(o => o.instituicaoId === i.id && ids.has(o.cursoId))))
    .map(i => ({ ...i, ofertas: catalogo.ofertas.filter(o => o.instituicaoId === i.id && (!termo || ids.has(o.cursoId))).map(o => ({ ...o, curso: catalogo.cursos.find(c => c.id === o.cursoId) })) }))
}
// Fonte provisória intencionalmente vazia: nenhuma instituição/oferta inventada.
const adaptadorPendente = { async carregar() { return { instituicoes: [], cursos: [], ofertas: [], status: 'pendente' } } }
export function criarFaculdadesService(adapter = adaptadorPendente, favoritos = perfilService) {
  return {
    async pesquisar(filtros) { const c = await adapter.carregar(); return { status: c.status, instituicoes: pesquisarCatalogo(c, filtros) } },
    async consultar(id) { const c = await adapter.carregar(); return pesquisarCatalogo(c).find(i => i.id === id) ?? null },
    async listarCursos() { return (await adapter.carregar()).cursos },
    async consultarOfertas(instituicaoId, cursoId) { return (await adapter.carregar()).ofertas.filter(o => (!instituicaoId || o.instituicaoId === instituicaoId) && (!cursoId || o.cursoId === cursoId)) },
    alternarFavorito: (usuario, instituicao) => favoritos.alternarFavorito(usuario, 'faculdades', instituicao),
    listarFavoritos: usuario => favoritos.listarFaculdadesSalvas(usuario),
  }
}
export const faculdadesService = criarFaculdadesService()
