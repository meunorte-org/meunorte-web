import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icone from './Icone.jsx'
export default function ModalPerfil({ titulo, onFechar, onFechado, fechando = false, ocupado = false, children }) {
  const modal = useRef(null)
  useEffect(() => {
    if (!fechando) return
    const timer = setTimeout(onFechado, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240)
    return () => clearTimeout(timer)
  }, [fechando, onFechado])
  useEffect(() => {
    const anterior = document.activeElement
    const y = window.scrollY
    const nomes = ['position', 'top', 'width', 'overflow']
    const estilos = nomes.map(nome => [nome, document.body.style[nome]])
    Object.assign(document.body.style, { position: 'fixed', top: `${-y}px`, width: '100%', overflow: 'hidden' })
    function ajustar() {
      modal.current?.style.setProperty('--mn-modal-height', `${window.visualViewport?.height ?? window.innerHeight}px`)
      modal.current?.style.setProperty('--mn-modal-top', `${window.visualViewport?.offsetTop ?? 0}px`)
    }
    ajustar()
    window.visualViewport?.addEventListener('resize', ajustar)
    window.visualViewport?.addEventListener('scroll', ajustar)
    window.addEventListener('resize', ajustar)
    modal.current.focus({ preventScroll: true })
    return () => {
      window.visualViewport?.removeEventListener('resize', ajustar)
      window.visualViewport?.removeEventListener('scroll', ajustar)
      window.removeEventListener('resize', ajustar)
      for (const [nome, valor] of estilos) document.body.style[nome] = valor
      window.scrollTo({ top: y, behavior: 'instant' })
      anterior?.focus({ preventScroll: true })
    }
  }, [])
  function teclado(e) {
    if (e.key === 'Escape' && !ocupado) { e.preventDefault(); onFechar() }
    if (e.key !== 'Tab') return
    const campos = [...modal.current.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]')].filter(el => el.getClientRects().length)
    const primeiro = campos[0], ultimo = campos.at(-1)
    if (!primeiro) { e.preventDefault(); return }
    if (e.shiftKey && [primeiro, modal.current].includes(document.activeElement)) { e.preventDefault(); ultimo.focus() }
    else if (!e.shiftKey && [ultimo, modal.current].includes(document.activeElement)) { e.preventDefault(); primeiro.focus() }
  }
  return createPortal(<div className="mn-internal mn-profile-modal" ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onKeyDown={teclado} onClick={e => { if (e.target === e.currentTarget && !ocupado) onFechar() }}>
    <section className={`mn-profile-modal__panel ${fechando ? 'mn-profile-modal__panel--closing' : ''}`} aria-busy={ocupado} inert={fechando}
      onAnimationEnd={e => { if (e.target === e.currentTarget && e.animationName === 'mn-modal-exit') onFechado() }}>
      <header><h2 id="profile-modal-title">{titulo}</h2><button className="mn-i-icon-button" type="button" aria-label="Fechar" onClick={onFechar} disabled={ocupado}><Icone nome="fechar" /></button></header>
      {children}
    </section>
  </div>, document.body)
}
