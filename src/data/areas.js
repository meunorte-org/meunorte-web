import tecnologia from '../assets/avatars/tecnologia.png'
import exatas from '../assets/avatars/exatas.png'
import saude from '../assets/avatars/saude.png'
import ambiente from '../assets/avatars/ambiente.png'
import agro from '../assets/avatars/agro.png'
import humanas from '../assets/avatars/humanas.png'
import direito from '../assets/avatars/direito.png'
import artes from '../assets/avatars/artes.png'
import negocios from '../assets/avatars/negocios.png'
import educacao from '../assets/avatars/educacao.png'
import { AREAS_CATALOGO } from './areasCatalogo.js'

// Ilustrações oficiais de Fotos de Perfil–Áreas, no Figma. IDs estáveis para o futuro banco.
const AVATARES = { tecnologia, exatas, saude, ambiente, agro, humanas, direito, artes, negocios, educacao }
export const AREAS = AREAS_CATALOGO.map(area => ({ ...area, avatar: AVATARES[area.id] }))
