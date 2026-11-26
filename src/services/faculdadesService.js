/*import { perfilService } from './perfil/perfilService.js'

/** Contratos para a futura integração (sem consultas a tabelas presumidas):
 * Instituicao: {id,nome,tipo:'publica'|'privada',endereco,cidade,descricao,
 * imagem,site,informacoesAdicionais,links:[{nome,url}],fonte,verificadoEm}.
 * Curso: {id,nome,areaId,sinonimos:[],descricao?}.
 * Oferta: {id,instituicaoId,cursoId,modalidade,turno?,ingressos:[],mensalidade?,
 * bolsas?,financiamentos?,fonte,verificadoEm}. Benefícios só se confirmados.
 * O adaptador retorna {instituicoes:[],cursos:[],ofertas:[],status:'pendente'|'disponivel'}.
 * Relação N:N exclusivamente pelas ofertas. IDs estáveis, sem inferir adesões.
 */

/*
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
    async pesquisar(filtros = {}) { if (adapter.pesquisar) return adapter.pesquisar(filtros); const c = await adapter.carregar(); return { status: c.status, instituicoes: pesquisarCatalogo(c, filtros) } },
    async consultar(id, opcoes) { if (adapter.consultar) return adapter.consultar(id, opcoes); const c = await adapter.carregar(); return pesquisarCatalogo(c).find(i => i.id === id) ?? null },
    async listarCursos() { return adapter.listarCursos ? adapter.listarCursos() : (await adapter.carregar()).cursos },
    async consultarOfertas(instituicaoId, cursoId) { return adapter.consultarOfertas ? adapter.consultarOfertas(instituicaoId, cursoId) : (await adapter.carregar()).ofertas.filter(o => (!instituicaoId || o.instituicaoId === instituicaoId) && (!cursoId || o.cursoId === cursoId)) },
    alternarFavorito: (usuario, instituicao) => favoritos.alternarFavorito(usuario, 'faculdades', instituicao),
    listarFavoritos: usuario => favoritos.listarFaculdadesSalvas(usuario),
  }
}
export const faculdadesService = criarFaculdadesService()*/


import { supabase } from '../lib/supabaseClient.js'
import { perfilService } from './perfil/perfilService.js'

export const normalizarBusca = texto =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
    .replace(/\s+/g, ' ')

function exigirSupabase() {
  if (!supabase) {
    throw new Error('Supabase não está configurado.')
  }

  return supabase
}

function verificar(resultado) {
  if (resultado.error) {
    throw new Error(resultado.error.message)
  }

  return resultado.data ?? []
}

function adaptarInstituicao(i) {
  return {
    id: i.id,
    nome: i.name,
    tipo: i.type,
    cidade: i.city,
    endereco: i.address,
    descricao: i.description,
    imagem: i.image_url,
    site: i.website,
    informacoesAdicionais: i.additional_information,
    links: i.links ?? [],
    fonte: i.source,
    verificadoEm: i.verified_at,
  }
}

function adaptarCurso(c) {
  return {
    id: c.id,
    nome: c.name,
    areaId: c.area_id,
    sinonimos: c.synonyms ?? [],
    descricao: c.description,
  }
}

function adaptarOferta(o) {
  return {
    id: o.id,
    instituicaoId: o.institution_id,
    cursoId: o.course_id,
    modalidade: o.modality,
    turno: o.shift,
    ingressos: o.admission_methods ?? [],
    mensalidade: o.monthly_fee,
    bolsas: o.scholarships,
    financiamentos: o.financing,
    fonte: o.source,
    verificadoEm: o.verified_at,
  }
}

export function pesquisarCatalogo(catalogo, { busca = '', tipo = 'todas' } = {}) {
  const termo = normalizarBusca(busca)

  const cursosEncontrados = catalogo.cursos.filter(c =>
    !termo ||
    [c.nome, ...(c.sinonimos ?? [])].some(nome =>
      normalizarBusca(nome).includes(termo)
    )
  )

  const idsCursos = new Set(cursosEncontrados.map(c => c.id))

  return catalogo.instituicoes
    .filter(i =>
      normalizarBusca(i.cidade) === 'vitoria da conquista' &&
      (tipo === 'todas' || i.tipo === tipo) &&
      (!termo ||
        catalogo.ofertas.some(o =>
          o.instituicaoId === i.id && idsCursos.has(o.cursoId)
        ))
    )
    .map(i => ({
      ...i,
      ofertas: catalogo.ofertas
        .filter(o =>
          o.instituicaoId === i.id &&
          (!termo || idsCursos.has(o.cursoId))
        )
        .map(o => ({
          ...o,
          curso: catalogo.cursos.find(c => c.id === o.cursoId),
        })),
    }))
}

async function carregarCatalogo(signal) {
  const db = exigirSupabase()

  let instituicoesQuery = db
    .from('institutions')
    .select('*')
    .eq('published', true)

  let cursosQuery = db
    .from('courses')
    .select('*')
    .eq('published', true)

  let ofertasQuery = db
    .from('institution_courses')
    .select('*')
    .eq('published', true)

  if (signal) {
    instituicoesQuery = instituicoesQuery.abortSignal(signal)
    cursosQuery = cursosQuery.abortSignal(signal)
    ofertasQuery = ofertasQuery.abortSignal(signal)
  }

  const [instituicoesR, cursosR, ofertasR] = await Promise.all([
    instituicoesQuery,
    cursosQuery,
    ofertasQuery,
  ])

  return {
    instituicoes: verificar(instituicoesR).map(adaptarInstituicao),
    cursos: verificar(cursosR).map(adaptarCurso),
    ofertas: verificar(ofertasR).map(adaptarOferta),
    status: 'disponivel',
  }
}

export function criarFaculdadesService(
  favoritos = perfilService
) {
  return {
    async pesquisar(filtros = {}) {
      const catalogo = await carregarCatalogo(filtros.signal)

      return {
        status: catalogo.status,
        instituicoes: pesquisarCatalogo(catalogo, filtros),
      }
    },

    async consultar(id, opcoes = {}) {
      const catalogo = await carregarCatalogo(opcoes.signal)

      return pesquisarCatalogo(catalogo).find(i => i.id === id) ?? null
    },

    async listarCursos() {
      const catalogo = await carregarCatalogo()
      return catalogo.cursos
    },

    async consultarOfertas(instituicaoId, cursoId) {
      const catalogo = await carregarCatalogo()

      return catalogo.ofertas.filter(o =>
        (!instituicaoId || o.instituicaoId === instituicaoId) &&
        (!cursoId || o.cursoId === cursoId)
      )
    },

    alternarFavorito: (usuario, instituicao) =>
      favoritos.alternarFavorito(usuario, 'faculdades', instituicao),

    listarFavoritos: usuario =>
      favoritos.listarFaculdadesSalvas(usuario),
  }
}

export const faculdadesService = criarFaculdadesService()
