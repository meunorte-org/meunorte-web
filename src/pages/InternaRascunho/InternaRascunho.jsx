import { useEffect, useRef, useState } from 'react'
import './InternaRascunho.css'

export default function InternaRascunho({ bloqueado = false, onSair }) {
  const [saindo, setSaindo] = useState(false)
  const [erro, setErro] = useState('')
  const titulo = useRef(null)
  const ocupado = useRef(false)

  useEffect(() => {
    if (!bloqueado) {
      document.title = 'Rascunho | MeuNorte'
      titulo.current?.focus({ preventScroll: true })
    }
  }, [bloqueado])

  async function sair() {
    if (!onSair || ocupado.current) return
    ocupado.current = true
    setSaindo(true)
    setErro('')
    try {
      await onSair()
    } catch (falha) {
      setErro(falha.mensagemPublica ?? 'Não foi possível sair da conta. Tente novamente.')
    } finally {
      ocupado.current = false
      setSaindo(false)
    }
  }

  return (
    <main className="mn-internal-draft mn-mobile-screen" aria-labelledby="internal-draft-title" inert={bloqueado}>
      <div className="mn-internal-draft__content mn-mobile-content">
        <p className="mn-internal-draft__brand">MeuNorte</p>
        <h1 ref={titulo} id="internal-draft-title" tabIndex={-1}>Rascunho</h1>
        <p>Área interna do MeuNorte.</p>
        <p>Esta tela será construída pela equipe.</p>
        <button type="button" onClick={sair} disabled={bloqueado || saindo || !onSair}>{saindo ? 'Saindo…' : 'Sair da conta'}</button>
        <p role="status">{erro}</p>
      </div>
    </main>
  )
}
