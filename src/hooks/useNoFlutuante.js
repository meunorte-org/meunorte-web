import { useEffect, useRef, useState } from 'react'
import { eArraste, limitarPosicao, normalizarPosicao, posicaoValida, projetarPosicao } from '../domain/assistente.js'
export default function useNoFlutuante(usuarioId, abrir) {
  const botao = useRef(null), safe = useRef(null), limites = useRef(null), posicao = useRef(null), normalizada = useRef(null)
  const gesto = useRef(null), suprimirClick = useRef(false), timer = useRef(null), foco = useRef(false), hover = useRef(false)
  const [repouso, setRepouso] = useState(false)
  const chave = `meunorte:no:posicao:v1:${usuarioId}`
  function gravar() { try { localStorage.setItem(chave, JSON.stringify(normalizada.current)) } catch { /* A posição continua em memória se o armazenamento estiver bloqueado. */ } }
  function aplicar(p) {
    if (!limites.current || !botao.current) return
    posicao.current = limitarPosicao(p, limites.current)
    normalizada.current = normalizarPosicao(posicao.current, limites.current)
    botao.current.style.setProperty('--no-x', `${posicao.current.x}px`)
    botao.current.style.setProperty('--no-y', `${posicao.current.y}px`)
    botao.current.dataset.pronto = 'true'
  }
  function inicial() {
    if (!limites.current) return
    const b = limites.current, direita = document.querySelector('.mn-internal-brand')?.getBoundingClientRect().right ?? b.maxX + 64
    aplicar({ x: direita - 64, y: b.minY + 4 }); gravar()
  }
  function agendarRepouso() { clearTimeout(timer.current); timer.current = setTimeout(() => { if (!foco.current && !hover.current && !gesto.current) setRepouso(true) }, 3000) }
  function despertar() { clearTimeout(timer.current); setRepouso(false) }
  useEffect(() => {
    try { const p = JSON.parse(localStorage.getItem(chave)); if (posicaoValida(p)) normalizada.current = p } catch { /* Preferência opcional. */ }
    function medir() {
      const vv = window.visualViewport, estilo = getComputedStyle(safe.current)
      const margem = lado => Math.max(12, parseFloat(estilo[lado]) || 0)
      const x = vv?.offsetLeft ?? 0, y = vv?.offsetTop ?? 0, w = vv?.width ?? window.innerWidth, h = vv?.height ?? window.innerHeight
      const nav = document.querySelector('.mn-internal-nav')?.getBoundingClientRect()
      const minX = x + margem('paddingLeft'), minY = y + margem('paddingTop')
      const maxX = Math.max(minX, x + w - margem('paddingRight') - 64)
      let maxY = Math.max(minY, y + h - margem('paddingBottom') - 72)
      if (nav && nav.top > minY && nav.top < y + h && nav.bottom > y) maxY = Math.max(minY, Math.min(maxY, nav.top - 84))
      limites.current = { minX, maxX, minY, maxY }
      if (normalizada.current) { const desejada = normalizada.current; aplicar(projetarPosicao(desejada, limites.current)); normalizada.current = desejada }
      else inicial()
    }
    medir(); agendarRepouso()
    const obs = new ResizeObserver(medir), nav = document.querySelector('.mn-internal-nav')
    if (nav) obs.observe(nav)
    window.addEventListener('resize', medir); window.addEventListener('orientationchange', medir)
    window.visualViewport?.addEventListener('resize', medir); window.visualViewport?.addEventListener('scroll', medir)
    return () => { clearTimeout(timer.current); obs.disconnect(); window.removeEventListener('resize', medir); window.removeEventListener('orientationchange', medir); window.visualViewport?.removeEventListener('resize', medir); window.visualViewport?.removeEventListener('scroll', medir) }
    // Preferência e listeners pertencem ao usuário, não à aba atual.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave])
  function terminar(e) {
    if (gesto.current?.id !== e.pointerId) return
    suprimirClick.current = gesto.current.arraste || e.type === 'pointercancel'
    gesto.current = null; botao.current.dataset.arrastando = 'false'; gravar(); agendarRepouso()
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }
  return { botao, safe, repouso, restaurar: inicial, eventos: {
    onPointerDown(e) { if (!e.isPrimary || e.button !== 0) return; despertar(); suprimirClick.current = false; gesto.current = { id: e.pointerId, inicio: { x: e.clientX, y: e.clientY }, origem: { ...posicao.current }, arraste: false }; e.currentTarget.setPointerCapture(e.pointerId) },
    onPointerMove(e) { const g = gesto.current; if (!g || g.id !== e.pointerId) return; g.arraste ||= eArraste(g.inicio, { x: e.clientX, y: e.clientY }); if (g.arraste) { if (e.cancelable) e.preventDefault(); botao.current.dataset.arrastando = 'true'; aplicar({ x: g.origem.x + e.clientX - g.inicio.x, y: g.origem.y + e.clientY - g.inicio.y }) } },
    onPointerUp: terminar, onPointerCancel: terminar, onLostPointerCapture: terminar,
    onPointerEnter(e) { if (e.pointerType === 'mouse') hover.current = true; despertar() },
    onPointerLeave() { hover.current = false; agendarRepouso() },
    onFocus() { foco.current = true; despertar() }, onBlur() { foco.current = false; agendarRepouso() },
    onClick(e) { if (suprimirClick.current) { suprimirClick.current = false; e.preventDefault(); return }; despertar(); abrir() },
    onKeyDown(e) { if (['Enter', ' '].includes(e.key)) suprimirClick.current = false; if (e.key === 'Home') { e.preventDefault(); despertar(); inicial() }; const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (delta && posicao.current) { e.preventDefault(); despertar(); const passo = e.shiftKey ? 24 : 12; aplicar({ x: posicao.current.x + delta[0] * passo, y: posicao.current.y + delta[1] * passo }); gravar() } },
  } }
}
