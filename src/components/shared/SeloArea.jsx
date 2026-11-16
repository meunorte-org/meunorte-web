import atlas from '../../assets/selos/selos-oficiais.png'
import { RECORTES_SELOS } from '../../data/ilustracoesAreas.js'
export default function SeloArea({ id, className = '' }) {
  const r = RECORTES_SELOS[id]
  if (!r) return null
  return <span aria-hidden="true" className={`mn-area-seal ${className}`} style={{ aspectRatio: `${r[0]}/${r[1]}` }}><img src={atlas} alt="" loading="lazy" style={{ width: `${r[2]}%`, height: `${r[3]}%`, left: `${r[4]}%`, top: `${r[5]}%` }} /></span>
}
