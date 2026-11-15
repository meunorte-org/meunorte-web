import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import InputDigitacao from '../../components/InputDigitacao/InputDigitacao.jsx'
import InputSenha from '../../components/InputSenha/InputSenha.jsx'
import BotaoBoasVindas from '../../components/BotaoBoasVindas/BotaoBoasVindas.jsx'
import { emailValido } from '../Cadastro/dadosCadastro.js'
import arrasto from '../../assets/icons/login-arrasto.svg'
import seta from '../../assets/icons/login-seta.svg'
import olho from '../../assets/icons/login-olho.svg'
import voltar from '../../assets/icons/recuperacao-voltar.svg'
import './Login.css'

export default function Login({ onFechar, onEntrar, onAutenticado, onIniciarSaida, onRecuperarSenha }) {
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
  const [conteudo, setConteudo] = useState('login')
  const [trocaConteudo, setTrocaConteudo] = useState(null)
  const [linkSolicitado, setLinkSolicitado] = useState(false)
  const [aguardar, setAguardar] = useState(0)

  useEffect(() => {
    if (!trocaConteudo) return
    const timer = setTimeout(() => {
      if (trocaConteudo.etapa === 'sair') {
        setConteudo(trocaConteudo.destino)
        setTrocaConteudo({ ...trocaConteudo, etapa: 'entrar' })
      } else setTrocaConteudo(null)
    }, 200)
    return () => clearTimeout(timer)
  }, [trocaConteudo])

  useEffect(() => {
    if (!aguardar) return
    const timer = setTimeout(() => setAguardar(valor => valor - 1), 1000)
    return () => clearTimeout(timer)
  }, [aguardar])

  function trocarConteudo(destino) {
    if (ocupado.current || trocaConteudo || fase !== 'aberto') return
    dialogo.current.focus({ preventScroll: true })
    painel.current.scrollTop = 0
    setSenha('')
    setErro('')
    setTrocaConteudo({ destino, etapa: 'sair' })
  }

  useEffect(() => {
    montado.current = true
    focoAnterior.current ??= document.activeElement
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const propriedades = ['overflow', 'position', 'top', 'left', 'width']
    const estilos = propriedades.map(nome => [nome, document.body.style[nome]])
    Object.assign(document.body.style, { overflow: 'hidden', position: 'fixed', top: `${-scrollY}px`, left: `${-scrollX}px`, width: '100%' })
    const viewport = window.visualViewport
    function ajustarViewport() {
      const modal = dialogo.current
      if (!modal) return
      modal.style.setProperty('--mn-login-height', `${viewport?.height ?? window.innerHeight}px`)
      modal.style.setProperty('--mn-login-width', `${viewport?.width ?? window.innerWidth}px`)
      modal.style.setProperty('--mn-login-top', `${viewport?.offsetTop ?? 0}px`)
      modal.style.setProperty('--mn-login-left', `${viewport?.offsetLeft ?? 0}px`)
    }
    ajustarViewport()
    viewport?.addEventListener('resize', ajustarViewport)
    viewport?.addEventListener('scroll', ajustarViewport)
    window.addEventListener('resize', ajustarViewport)
    // O foco fica fora do painel animado. Focar o conteúdo durante translateY
    // permite ao iOS rolar o modal para alcançar o elemento ainda fora da tela.
    dialogo.current.focus({ preventScroll: true })
    return () => {
      montado.current = false
      viewport?.removeEventListener('resize', ajustarViewport)
      viewport?.removeEventListener('scroll', ajustarViewport)
      window.removeEventListener('resize', ajustarViewport)
      for (const [nome, valor] of estilos) document.body.style[nome] = valor
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' })
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

  function controlarTeclado(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      fechar()
    }
    if (event.key !== 'Tab') return
    const elementos = [...dialogo.current.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')]
      .filter(elemento => elemento.getClientRects().length > 0)
    const primeiro = elementos[0]
    const ultimo = elementos.at(-1)
    if (!primeiro) { event.preventDefault(); return }
    if (event.shiftKey && (document.activeElement === primeiro || document.activeElement === dialogo.current)) {
      event.preventDefault()
      ultimo.focus()
    } else if (!event.shiftKey && (document.activeElement === ultimo || document.activeElement === dialogo.current)) {
      event.preventDefault()
      primeiro.focus()
    }
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
    if (conteudo === 'recuperacao') {
      if (!emailValido(email) || ocupado.current || aguardar || trocaConteudo || fase !== 'aberto') return
      ocupado.current = true
      setEnviando(true)
      setErro('')
      try {
        await onRecuperarSenha(email)
        if (montado.current) { setLinkSolicitado(true); setAguardar(60) }
      } catch (falha) {
        if (montado.current) setErro(falha.mensagemPublica ?? 'Não foi possível solicitar o link. Tente novamente.')
      } finally {
        ocupado.current = false
        if (montado.current) setEnviando(false)
      }
      return
    }
    if (!emailValido(email) || !senha || ocupado.current || fase !== 'aberto') return
    ocupado.current = true
    setEnviando(true)
    setErro('')
    try {
      await onEntrar({ email, password: senha })
      if (montado.current) {
        setSenha('')
        onIniciarSaida?.()
        setFase('sucesso')
      }
    } catch (falha) {
      if (montado.current) setErro(falha.mensagemPublica ?? 'Não foi possível entrar. Tente novamente.')
    } finally {
      ocupado.current = false
      if (montado.current) setEnviando(false)
    }
  }

  return createPortal(
    <div ref={dialogo} className={`mn-login mn-login--${fase}`} role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="login-title"
      onKeyDown={controlarTeclado}
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
        <div className={`mn-login__content mn-login__content--${conteudo} ${trocaConteudo ? `mn-login__content--${trocaConteudo.etapa}` : ''}`} inert={Boolean(trocaConteudo)}>
        {conteudo === 'recuperacao' ? <>
          <button type="button" className="mn-login__back" aria-label="Voltar para login" disabled={enviando} onClick={() => trocarConteudo('login')}><img src={voltar} alt="" width="50" height="50" /></button>
          <h2 id="login-title" tabIndex={-1}>Esqueceu sua senha?</h2>
          <p className="mn-login__recovery-description">Informe seu e-mail para receber um link de recuperação:</p>
          <form onSubmit={enviar}>
            <InputDigitacao id="recuperacao-email" name="email" type="email" rotulo="Digite seu e-mail" value={email}
              onChange={event => { setEmail(event.target.value); setErro(''); setLinkSolicitado(false) }}
              autoComplete="email" autoCapitalize="none" maxLength={254} required disabled={enviando} erro={erro} />
            {linkSolicitado && <p role="status" className="mn-login__notice">Se houver uma conta com este e-mail, você receberá um link para criar uma nova senha. Confira também o spam.</p>}
            <div className="mn-login__actions">
              <BotaoBoasVindas type="submit" variante="entrar" className="mn-login__send-link" disabled={!emailValido(email) || enviando || aguardar > 0}>
                <span>{enviando ? 'enviando…' : aguardar ? `aguarde ${aguardar}s` : 'enviar link'}</span>
                {!enviando && !aguardar && <span className="mn-welcome-button__arrow" aria-hidden="true"><img src={seta} alt="" width="34.4005" height="18.62" /></span>}
              </BotaoBoasVindas>
            </div>
          </form>
        </> : <>
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
              onClick={() => trocarConteudo('recuperacao')}>esqueceu sua senha?</button>
          </div>
          <div className="mn-login__actions">
            <BotaoBoasVindas type="submit" variante="entrar" disabled={!emailValido(email) || !senha || enviando || fase !== 'aberto'}>
              <span>{enviando ? 'entrando…' : 'entrar'}</span>
              {!enviando && <span className="mn-welcome-button__arrow" aria-hidden="true"><img src={seta} alt="" width="34.4005" height="18.62" /></span>}
            </BotaoBoasVindas>
          </div>
        </form>
        </>}
        </div>
      </section>
    </div>, document.body
  )
}
