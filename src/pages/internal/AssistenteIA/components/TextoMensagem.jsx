import { Fragment } from 'react'
import { linkSeguro } from '../../../../domain/assistente.js'
function Inline({ texto }) {
  const partes = texto.split(/(\[[^\]\n]+\]\([^\s)]+\)|https?:\/\/[^\s<>]+|\*\*[^*\n]+\*\*)/g)
  return partes.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/), url = linkSeguro(m?.[2] ?? p.replace(/[.,;!?]+$/, ''))
    return url ? <Fragment key={i}><a href={url} target="_blank" rel="noopener noreferrer" title="Abre em nova aba">{m?.[1] ?? p.replace(/[.,;!?]+$/, '')}</a>{!m && p.match(/[.,;!?]+$/)?.[0]}</Fragment> : <Fragment key={i}>{p}</Fragment>
  })
}
export default function TextoMensagem({ texto }) {
  return texto.split(/\n\s*\n/).map((bloco, i) => {
    const linhas = bloco.split('\n')
    if (linhas.every(l => /^\s*(?:[-*]|\d+\.)\s+/.test(l))) return <ul key={i}>{linhas.map((l, j) => <li key={j}><Inline texto={l.replace(/^\s*(?:[-*]|\d+\.)\s+/, '')} /></li>)}</ul>
    return <p key={i}>{linhas.map((l, j) => <Fragment key={j}>{j > 0 && <br />}<Inline texto={l} /></Fragment>)}</p>
  })
}
