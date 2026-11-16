import { AREAS_CATALOGO } from '../data/areasCatalogo.js'
import { CONTEUDO_AREAS } from '../data/conteudoAreas.js'
export const areasService = {
  listar: () => AREAS_CATALOGO.map(a => ({ ...a, ...CONTEUDO_AREAS[a.id] })),
  consultar(id) { return this.listar().find(a => a.id === id) ?? null },
}
