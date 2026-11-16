import { useEffect, useRef } from 'react'
import Icone from '../components/shared/Icone.jsx'
import '../styles/internal.css'
const ABAS = [{ id: 'perfil', nome: 'Perfil' }, { id: 'areas', nome: 'Áreas' }, { id: 'faculdades', nome: 'Faculdades' }, { id: 'ingressos', nome: 'Ingressos' }]
export default function InternalLayout({ secao, pagina, navegar, children, modalAberto = false, bloqueado = false, comAssistente = false }) {
  const conteudo = useRef(null)
  const shell = useRef(null)
  const navbar = useRef(null)
  useEffect(() => {
    const ajustar = () => shell.current?.style.setProperty('--mn-nav-height', `${navbar.current?.getBoundingClientRect().height ?? 80}px`)
    ajustar()
    const observador = new ResizeObserver(ajustar)
    if (navbar.current) observador.observe(navbar.current)
    return () => observador.disconnect()
  }, [])
  const modalAnterior = useRef(false)
  useEffect(() => {
    if (modalAnterior.current && !modalAberto) conteudo.current?.querySelector('[aria-label="Configurações do perfil"]')?.focus({ preventScroll: true })
    modalAnterior.current = modalAberto
  }, [modalAberto])
  useEffect(() => { document.title = `${ABAS.find(a => a.id === secao)?.nome ?? 'Perfil'} | MeuNorte`; conteudo.current?.focus({ preventScroll: true }) }, [secao, pagina])
  return <div ref={shell} className={`mn-internal mn-internal-shell ${comAssistente ? 'mn-internal-shell--com-no' : ''}`} inert={modalAberto || bloqueado}>
    <header className="mn-internal-brand"><a href={`${window.location.pathname}?area=interna&secao=perfil`} onClick={e => { if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); navegar('perfil') } }}>MeuNorte<span>sua jornada começa em você</span></a></header>
    <main ref={conteudo} tabIndex={-1} id="conteudo-interno" className="mn-internal-content" key={secao}>{children}</main>
    <nav ref={navbar} className="mn-internal-nav" aria-label="Navegação principal">
      {ABAS.map(aba => <a key={aba.id} href={`${window.location.pathname}?area=interna&secao=${aba.id}`} aria-current={secao === aba.id ? 'page' : undefined} onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey) { e.preventDefault(); navegar(aba.id) } }}><Icone nome={aba.id} /><span>{aba.nome}</span></a>)}
    </nav>
  </div>
}
