import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import BotaoReenviarLink from '../../components/BotaoReenviarLink/BotaoReenviarLink.jsx'
import BotaoAlterarEmail from '../../components/BotaoAlterarEmail/BotaoAlterarEmail.jsx'
import BotaoBoasVindas from '../../components/BotaoBoasVindas/BotaoBoasVindas.jsx'
import envelope from '../../assets/icons/email-confirmacao.svg'
import voltar from '../../assets/icons/voltar-confirmacao.svg'
import './ConfirmacaoEmail.css'

export default function ConfirmacaoEmail({ email = '', enviado = false, solicitacaoRecebida = false, bloqueado = false, onVoltar, onAlterarEmail, onReenviarLink, estadoRetorno = null, mensagemRetorno = '' }) {
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [restante, setRestante] = useState(() => solicitacaoRecebida ? 60 : 0)
  const ocupado = useRef(false)
  const montado = useRef(false)
  const emailRef = useRef(null)

  useLayoutEffect(() => {
    const campo = emailRef.current
    const texto = campo?.querySelector('span')
    if (!texto) return
    let ativo = true

    function ajustarEmail() {
      if (!ativo) return
      texto.style.fontSize = ''
      const estilo = window.getComputedStyle(campo)
      const disponivel = campo.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight)
      const largura = texto.getBoundingClientRect().width
      if (disponivel > 0 && largura > disponivel) {
        const tamanho = parseFloat(window.getComputedStyle(texto).fontSize)
        texto.style.fontSize = `${Math.floor(tamanho * (disponivel - .5) / largura * 100) / 100}px`
      }
    }

    ajustarEmail()
    const observer = new ResizeObserver(ajustarEmail)
    observer.observe(campo)
    document.fonts.ready.then(ajustarEmail)
    document.fonts.addEventListener('loadingdone', ajustarEmail)
    return () => {
      ativo = false
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', ajustarEmail)
    }
  }, [email])

  useEffect(() => {
    montado.current = true
    return () => { montado.current = false }
  }, [])

  useEffect(() => {
    if (!bloqueado) document.getElementById('email-confirmation-title')?.focus({ preventScroll: true })
  }, [bloqueado, estadoRetorno])

  useEffect(() => {
    if (restante <= 0) return
    const timer = window.setTimeout(() => setRestante(atual => atual - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [restante])

  async function reenviar() {
    if (ocupado.current || restante > 0 || bloqueado) return
    if (!onReenviarLink || (!enviado && !solicitacaoRecebida)) {
      setMensagem('O envio de e-mails ainda não está disponível. Nenhum link foi enviado.')
      return
    }
    ocupado.current = true
    setEnviando(true)
    setMensagem('')
    try {
      const resultado = await onReenviarLink(email)
      if (resultado?.error) throw resultado.error
      if (!montado.current) return
      setMensagem('Solicitação recebida. Se houver uma confirmação pendente, confira sua caixa de entrada e a pasta de spam.')
      setRestante(60)
    } catch (erro) {
      if (montado.current) setMensagem(erro.mensagemPublica ?? 'Não foi possível reenviar o link. Tente novamente.')
    } finally {
      ocupado.current = false
      if (montado.current) setEnviando(false)
    }
  }

  const desabilitado = bloqueado || enviando
  const emRetorno = estadoRetorno !== null
  const titulo = estadoRetorno === 'verificando' ? 'Verificando seu e-mail'
    : estadoRetorno === 'confirmado' ? 'E-mail confirmado!'
    : estadoRetorno === 'erro' ? 'Link não confirmado'
    : 'Verifique seu e-mail'

  return (
    <main className="mn-email-confirmation mn-mobile-screen" aria-labelledby="email-confirmation-title" aria-busy={estadoRetorno === 'verificando'} inert={bloqueado}>
      <div className="mn-email-confirmation__content mn-mobile-content">
        <button type="button" className="mn-email-confirmation__back" aria-label={emRetorno ? 'Voltar ao MeuNorte' : 'Voltar ao resumo do cadastro'} onClick={onVoltar} disabled={desabilitado}>
          <img src={voltar} width="50" height="50" alt="" />
        </button>
        <img className="mn-email-confirmation__envelope" src={envelope} width="97" height="87" alt="" />
        <h1 id="email-confirmation-title" tabIndex={-1}>{titulo}</h1>
        {!emRetorno && <p className="mn-email-confirmation__lead">{enviado ? 'Enviamos um link de confirmação para:' : solicitacaoRecebida ? 'Solicitação recebida para:' : 'O link de confirmação será enviado para:'}</p>}
        {email && <p ref={emailRef} className="mn-email-confirmation__email"><span>{email}</span></p>}
        <p className="mn-email-confirmation__help" role={emRetorno ? 'status' : undefined}>{emRetorno ? mensagemRetorno : 'Confira sua caixa de entrada e clique no link para ativar sua conta.'}</p>
        <div className="mn-email-confirmation__actions">
          {emRetorno ? <BotaoBoasVindas variante="alterar-email" onClick={onVoltar}>voltar ao início</BotaoBoasVindas> : <>
            <BotaoReenviarLink onClick={reenviar} disabled={desabilitado || restante > 0} aria-busy={enviando} aria-describedby="email-confirmation-status" />
            <BotaoAlterarEmail onClick={onAlterarEmail} disabled={desabilitado} />
          </>}
        </div>
        {!emRetorno && !enviado && !solicitacaoRecebida && <p className="mn-email-confirmation__preview">Prévia do cadastro: nenhum e-mail foi enviado.</p>}
        {!emRetorno && solicitacaoRecebida && !enviado && <p className="mn-email-confirmation__preview">Se o endereço puder ser cadastrado, você receberá um link de confirmação.</p>}
        <p className="mn-email-confirmation__status" id="email-confirmation-status" role="status">{enviando ? 'Reenviando o link…' : mensagem}</p>
        {restante > 0 && <p className="mn-email-confirmation__cooldown">Você poderá reenviar em {restante}s.</p>}
      </div>
    </main>
  )
}
