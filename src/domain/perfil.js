import { calcularIdade } from './cadastro.js'
import { AREAS_CATALOGO as AREAS } from '../data/areasCatalogo.js'

export const CORES_TAG = { lima: '#ccf02a', azul: '#dae0ff', lilas: '#e8dafa', menta: '#c5f0dd', coral: '#ffd9cd', amarelo: '#ffe7a7' }
export const contar = texto => Array.from(texto ?? '').length
export const normalizarTag = texto => texto.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
export function ocupacao(codigo) {
  if (['fundamental', 'medio_cursando', 'eja_fundamental', 'eja_medio'].includes(codigo)) return 'Estudante'
  if (codigo === 'superior_cursando') return 'Universitário(a)'
  return null
}
export function tagsAutomaticas(usuario, perfil, hoje) {
  const meta = usuario.user_metadata ?? {}
  const idade = meta.birth_date ? calcularIdade(meta.birth_date, hoje) : null
  const area = AREAS.find(item => item.id === perfil.areaAfinidade)
  return [
    { id: 'ocupacao', texto: ocupacao(meta.education_level) },
    { id: 'idade', texto: idade === null ? null : `${idade} anos` },
    { id: 'afinidade', texto: area?.nome ?? null },
  ].filter(tag => tag.texto).map(tag => ({ ...tag, cor: 'lima', automatica: true }))
}
export function tagsDoPerfil(usuario, perfil) {
  return [...tagsAutomaticas(usuario, perfil).filter(tag => perfil.visibilidade[tag.id] !== false), ...perfil.tags]
}
export function tagsVisiveis(usuario, perfil) { return tagsDoPerfil(usuario, perfil).slice(0, 6) }
export function validarTags(usuario, perfil) {
  const tags = tagsDoPerfil(usuario, perfil)
  const nomes = tags.map(tag => normalizarTag(tag.texto))
  if (new Set(nomes).size !== nomes.length) throw new Error('Já existe uma tag com esse texto.')
  if (tags.length > 6) throw new Error('Você pode mostrar até 6 tags. Oculte ou remova uma para continuar.')
}
export function validarTexto(texto, limite, campo, obrigatorio = false) {
  if (typeof texto !== 'string') throw new Error(`Confira ${campo} e tente novamente.`)
  const limpo = texto.trim()
  if (obrigatorio && !limpo) throw new Error(`Preencha ${campo}.`)
  if (contar(limpo) > limite) throw new Error(`Use até ${limite} caracteres em ${campo}.`)
  return limpo
}
export function perfilVazio() {
  return { versao: 1, bio: '', tags: [], visibilidade: { ocupacao: true, idade: true, afinidade: true }, avatar: null, objetivos: [], areasFavoritas: [], faculdadesSalvas: [], areaAfinidade: null }
}
