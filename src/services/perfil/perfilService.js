import { criarAdaptadorLocal, fotosLocais } from './localAdapter.js'
import { CORES_TAG, validarTags, validarTexto } from '../../domain/perfil.js'
import { AREAS_CATALOGO as AREAS } from '../../data/areasCatalogo.js'

/** Contrato Perfil (v1): bio, tags[{id,texto,cor}], visibilidade, avatar
 * {tipo:'oficial',id}|{tipo:'foto',id}, objetivos[{id,titulo,texto}],
 * areasFavoritas[{id,nome}], faculdadesSalvas[{id,nome}], areaAfinidade.
 * O usuário e seus metadados vêm do Auth real; este serviço nunca armazena tokens.
 * Para integrar tabelas: substituir carregar/salvar e o repositório de blobs.
 */
export function criarPerfilService(adapter, fotos = fotosLocais) {
  const obterPerfil = usuario => adapter.carregar(usuario.id)
  async function alterar(usuario, mutacao) {
    const anterior = await obterPerfil(usuario)
    const proximo = mutacao(structuredClone(anterior))
    validarTags(usuario, proximo)
    return adapter.salvar(usuario.id, proximo)
  }
  return {
    obterPerfil,
    atualizarBio: (u, bio) => alterar(u, p => ({ ...p, bio: validarTexto(bio, 160, 'sua bio') })),
    atualizarVisibilidade: (u, visibilidade) => alterar(u, p => ({ ...p, visibilidade: { ...p.visibilidade, ...visibilidade } })),
    salvarTag: (u, tag) => alterar(u, p => {
      const texto = validarTexto(tag.texto, 20, 'o texto da tag', true)
      if (!Object.hasOwn(CORES_TAG, tag.cor)) throw new Error('Escolha uma das cores disponíveis.')
      const item = { id: tag.id ?? crypto.randomUUID(), texto, cor: tag.cor }
      p.tags = tag.id ? p.tags.map(t => t.id === tag.id ? item : t) : [...p.tags, item]
      return p
    }),
    excluirTag: (u, id) => alterar(u, p => ({ ...p, tags: p.tags.filter(tag => tag.id !== id) })),
    salvarObjetivo: (u, objetivo) => alterar(u, p => {
      const item = { id: objetivo.id ?? crypto.randomUUID(), titulo: validarTexto(objetivo.titulo, 60, 'o título'), texto: validarTexto(objetivo.texto, 600, 'seu objetivo', true) }
      p.objetivos = objetivo.id ? p.objetivos.map(o => o.id === objetivo.id ? item : o) : [...p.objetivos, item]
      return p
    }),
    excluirObjetivo: (u, id) => alterar(u, p => ({ ...p, objetivos: p.objetivos.filter(o => o.id !== id) })),
    async selecionarAvatar(u, id) {
      if (!AREAS.some(a => a.id === id)) throw new Error('Escolha um avatar disponível.')
      const anterior = await obterPerfil(u)
      const perfil = await alterar(u, p => ({ ...p, avatar: { tipo: 'oficial', id } }))
      if (anterior.avatar?.tipo === 'foto') await fotos.excluir(u.id, anterior.avatar.id).catch(() => {})
      return perfil
    },
    async salvarFoto(u, blob) {
      if (!(blob instanceof Blob) || !blob.type.startsWith('image/') || blob.size > 8 * 1024 * 1024) throw new Error('Selecione uma imagem de até 8 MB.')
      const id = crypto.randomUUID()
      const anterior = await obterPerfil(u)
      await fotos.salvar(u.id, id, blob)
      try {
        const perfil = await alterar(u, p => ({ ...p, avatar: { tipo: 'foto', id } }))
        if (anterior.avatar?.tipo === 'foto') await fotos.excluir(u.id, anterior.avatar.id).catch(() => {})
        return perfil
      }
      catch (erro) { await fotos.excluir(u.id, id).catch(() => {}); throw erro }
    },
    carregarFoto: (u, id) => fotos.carregar(u.id, id),
    listarAreasFavoritas: async u => (await obterPerfil(u)).areasFavoritas,
    listarFaculdadesSalvas: async u => (await obterPerfil(u)).faculdadesSalvas,
    alternarFavorito: (u, tipo, item) => alterar(u, p => {
      const chave = tipo === 'areas' ? 'areasFavoritas' : tipo === 'faculdades' ? 'faculdadesSalvas' : null
      if (!chave || !item.id || !item.nome) throw new Error('Não foi possível identificar este favorito.')
      p[chave] = p[chave].some(f => f.id === item.id) ? p[chave].filter(f => f.id !== item.id) : [...p[chave], { id: item.id, nome: item.nome }]
      return p
    }),
  }
}
export const perfilService = criarPerfilService(criarAdaptadorLocal())
