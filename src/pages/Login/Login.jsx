import { useEffect, useRef, useState } from 'react'
import InputDigitacao from '../../components/InputDigitacao/InputDigitacao.jsx'
import InputSenha from '../../components/InputSenha/InputSenha.jsx'
import BotaoBoasVindas from '../../components/BotaoBoasVindas/BotaoBoasVindas.jsx'
import { emailValido } from '../Cadastro/dadosCadastro.js'
import arrasto from '../../assets/icons/login-arrasto.svg'
import seta from '../../assets/icons/login-seta.svg'
import olho from '../../assets/icons/login-olho.svg'
import './Login.css'

export default function Login({ onFechar, onEntrar, onAutenticado }) {
  const dialogo = useRef(null)
  const painel = useRef(null)
  const arrastando = useRef(null)
  const ocupado = useRef(false)
  const montado = useRef(false)
  const focoAnterior = useRef(null)
  const [fase, setFase] = useState('aberto')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [avisoRecuperacao, setAvisoRecuperacao] = useState(false)

  useEffect(() => {
    montado.current = true
    focoAnterior.current ??= document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogo.current.showModal()
    // Foca o título sem abrir o teclado antes de a pessoa escolher um campo.
    dialogo.current.querySelector('h2').focus({ preventScroll: true })
    return () => {
      montado.current = false
      document.body.style.overflow = overflow
      focoAnterior.current?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (fase === 'aberto') return
    const timer = setTimeout(fase === 'sucesso' ? onAutenticado : onFechar, fase === 'sucesso' ? 950 : 550)
    return () => clearTimeout(timer)
  }, [fase, onAutenticado, onFechar])

  function fechar() {
    if (ocupado.current || fase !== 'aberto') return
    setFase('fechando')
  }

  function iniciarArrasto(event) {
    if (ocupado.current || fase !== 'aberto') return
    event.currentTarget.setPointerCapture(event.pointerId)
    arrastando.current = { y: event.clientY, inicio: event.timeStamp, distancia: 0 }
    painel.current.classList.add('mn-login__panel--dragging')
  }

  function moverArrasto(event) {
    const gesto = arrastando.current
    if (!gesto) return
    gesto.distancia = Math.max(0, event.clientY - gesto.y)
    painel.current.style.translate = `0 ${gesto.distancia}px`
  }

  function terminarArrasto(event, cancelar = false) {
    const gesto = arrastando.current
    if (!gesto) return
    arrastando.current = null
    painel.current.classList.remove('mn-login__panel--dragging')
    const velocidade = gesto.distancia / Math.max(1, event.timeStamp - gesto.inicio)
    if (!cancelar && (gesto.distancia >= 80 || (gesto.distancia > 20 && velocidade > .5))) {
      painel.current.style.setProperty('--mn-login-drag', `${gesto.distancia}px`)
      painel.current.style.translate = ''
      fechar()
    } else painel.current.style.translate = '0 0'
  }

  async function enviar(event) {
    event.preventDefault()
    if (!emailValido(email) || !senha || ocupado.current || fase !== 'aberto') return
    ocupado.current = true
    setEnviando(true)
    setErro('')
    try {
      await onEntrar({ email, password: senha })
      if (montado.current) {
        setSenha('')
        setFase('sucesso')
      }
    } catch (falha) {
      if (montado.current) setErro(falha.mensagemPublica ?? 'Não foi possível entrar. Tente novamente.')
    } finally {
      ocupado.current = false
      if (montado.current) setEnviando(false)
    }
  }

  return (
    <dialog ref={dialogo} className={`mn-login mn-login--${fase}`} aria-labelledby="login-title"
      onCancel={event => { event.preventDefault(); fechar() }}
      onClick={event => { if (event.target === event.currentTarget) fechar() }}>
      <section ref={painel} className="mn-login__panel" aria-busy={enviando}
        onAnimationEnd={event => {
          if (event.target !== event.currentTarget) return
          if (fase === 'fechando') onFechar()
          if (fase === 'sucesso') onAutenticado()
        }}>
        <button type="button" className="mn-login__handle" aria-label="Fechar login" disabled={enviando || fase !== 'aberto'}
          onPointerDown={iniciarArrasto} onPointerMove={moverArrasto}
          onPointerUp={event => terminarArrasto(event)} onPointerCancel={event => terminarArrasto(event, true)}
          onClick={event => { if (event.detail === 0) fechar() }}>
          <img src={arrasto} alt="" width="137" height="25" draggable="false" />
        </button>
        <h2 id="login-title" tabIndex={-1}>Bem-Vindo(a) de Volta!</h2>
        <form onSubmit={enviar}>
          <InputDigitacao id="login-email" name="email" rotulo="Digite seu e-mail" type="email" autoComplete="username"
            autoCapitalize="none" spellCheck={false} maxLength={254} required disabled={enviando || fase !== 'aberto'} value={email}
            onChange={event => { setEmail(event.target.value); setErro('') }} />
          <div className="mn-login__password">
            <InputSenha id="login-password" name="password" rotulo="Digite sua senha" value={senha}
              onAlterar={valor => { setSenha(valor); setErro('') }} autoComplete="current-password" minLength={1}
              enterKeyHint="go" iconeOculto={olho} disabled={enviando || fase !== 'aberto'}
              animarErro rotuloErro="Confira seus dados" erro={erro} />
            <button type="button" className="mn-login__forgot" disabled={enviando || fase !== 'aberto'}
              onClick={() => setAvisoRecuperacao(true)}>esqueceu sua senha?</button>
          </div>
          {avisoRecuperacao && <p className="mn-login__notice" role="status">A recuperação de senha ainda está indisponível. Se precisar de ajuda, fale com <a href="mailto:admeunorte@gmail.com">admeunorte@gmail.com</a>.</p>}
          <div className="mn-login__actions">
            <BotaoBoasVindas type="submit" variante="entrar" disabled={!emailValido(email) || !senha || enviando || fase !== 'aberto'}>
              <span>{enviando ? 'entrando…' : 'entrar'}</span>
              {!enviando && <span className="mn-welcome-button__arrow" aria-hidden="true"><img src={seta} alt="" width="34.4005" height="18.62" /></span>}
            </BotaoBoasVindas>
          </div>
        </form>
      </section>
    </dialog>
  )
}
