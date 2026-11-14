import { useCallback, useEffect, useRef } from 'react'
import aberto from '../../assets/icons/email-confirmacao.svg'
import fechado from '../../assets/icons/email-confirmado.svg'
import './ConfirmacaoSucesso.css'

// Protótipo: mover 650; aguardar 200; fechar 200; aguardar 300;
// revelar texto 400; manter 700; sair para a esquerda 900.
const DURACAO_TOTAL = 3350

export default function ConfirmacaoSucesso({ confirmado, onConcluir }) {
  const concluiu = useRef(false)

  const finalizar = useCallback(() => {
    if (!confirmado || concluiu.current) return
    concluiu.current = true
    onConcluir()
  }, [confirmado, onConcluir])

  useEffect(() => {
    if (!confirmado) return
    document.title = 'Conta criada | MeuNorte'
    // O evento da saída é o caminho principal; o limite evita prender a pessoa
    // numa aba cujo navegador tenha suspendido as animações.
    const timer = window.setTimeout(finalizar, DURACAO_TOTAL + 250)
    return () => window.clearTimeout(timer)
  }, [confirmado, finalizar])

  return (
    <main className={`mn-confirmed mn-mobile-screen ${confirmado ? 'mn-confirmed--verified' : ''}`} aria-labelledby="confirmation-success-title"
      onAnimationEnd={event => {
        if (event.target === event.currentTarget && event.animationName.startsWith('mn-confirmed-exit')) finalizar()
      }}>
      <div className="mn-confirmed__content mn-mobile-content">
        <div className="mn-confirmed__symbol" aria-hidden="true">
          <img className="mn-confirmed__open" src={aberto} width="97" height="87" alt="" />
          <img className="mn-confirmed__closed" src={fechado} width="97" height="74" alt="" />
        </div>
        <h1 id="confirmation-success-title" className="mn-confirmed__message" tabIndex={-1} aria-hidden={!confirmado}
          onAnimationEnd={event => {
            if (event.animationName.startsWith('mn-confirmed-message')) event.currentTarget.focus({ preventScroll: true })
          }}>
          Parabéns!<br />conta criada
        </h1>
        <p className="mn-confirmed__status" role="status">{confirmado ? 'E-mail confirmado. Sua conta está pronta. Abrindo o MeuNorte.' : 'Verificando seu link de confirmação…'}</p>
      </div>
    </main>
  )
}
