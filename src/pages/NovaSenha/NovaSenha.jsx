import { useEffect, useRef, useState } from 'react'
import { servicoAuth } from '../../services/auth.js'
import InputSenha from '../../components/InputSenha/InputSenha.jsx'
import BotaoBoasVindas from '../../components/BotaoBoasVindas/BotaoBoasVindas.jsx'
import { senhaValida, senhasConferem } from '../Cadastro/dadosCadastro.js'
import aberto from '../../assets/icons/cadeado-aberto.svg'
import fechado from '../../assets/icons/cadeado-fechado.svg'
import voltar from '../../assets/icons/recuperacao-voltar.svg'
import olho from '../../assets/icons/login-olho.svg'
import regraPendente from '../../assets/icons/senha-regra-pendente.svg'
import regraCumprida from '../../assets/icons/senha-regra-cumprida.svg'
import './NovaSenha.css'

export default function NovaSenha({ auth = servicoAuth }) {
  const [estado, setEstado] = useState('verificando')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [tocou, setTocou] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const ocupado = useRef(false)
  const montado = useRef(false)
  const titulo = useRef(null)
  const diferente = Boolean(confirmacao && tocou && senha !== confirmacao)

  useEffect(() => {
    montado.current = true
    document.title = 'Nova senha | MeuNorte'
    auth.verificarRecuperacao().then(() => {
      if (montado.current) setEstado('pronto')
    }).catch(falha => {
      if (montado.current) { setEstado('invalido'); setErro(falha.mensagemPublica ?? 'Este link é inválido ou expirou. Solicite um novo link.') }
    }).finally(() => {
      if (montado.current) window.history.replaceState(null, '', `${window.location.pathname}?auth=recuperacao`)
    })
    return () => { montado.current = false }
  }, [auth])

  useEffect(() => { if (estado !== 'verificando') titulo.current?.focus({ preventScroll: true }) }, [estado])

  function voltarLogin() { window.location.replace(`${window.location.pathname}?login=1`) }

  async function enviar(event) {
    event.preventDefault()
    setTocou(true)
    if (!senhasConferem(senha, confirmacao) || ocupado.current || estado !== 'pronto') return
    ocupado.current = true
    setEnviando(true)
    setErro('')
    try {
      await auth.atualizarSenha(senha)
      if (montado.current) { setSenha(''); setConfirmacao(''); setEstado('sucesso') }
    } catch (falha) {
      if (montado.current) setErro(falha.mensagemPublica ?? 'Não foi possível criar a nova senha. Tente novamente.')
    } finally {
      ocupado.current = false
      if (montado.current) setEnviando(false)
    }
  }

  return <main className={`mn-new-password mn-mobile-screen mn-new-password--${estado}`} aria-labelledby="new-password-title">
    <div className="mn-new-password__content mn-mobile-content">
      {estado !== 'sucesso' && estado !== 'invalido' && <button type="button" className="mn-new-password__back" aria-label="Voltar para login" onClick={voltarLogin} disabled={enviando}><img src={voltar} alt="" width="50" height="50" /></button>}
      <div className="mn-new-password__lock" aria-hidden="true">
        <img className="mn-new-password__open" src={aberto} alt="" width="87.0162" height="78.9835" />
        <img className="mn-new-password__closed" src={fechado} alt="" width="58.9033" height="78.9835" />
      </div>
      <h1 ref={titulo} tabIndex={-1} id="new-password-title">{estado === 'invalido' ? <><strong>Este link expirou,</strong>{' '}<span>solicite um novo link de recuperação.</span></> : estado === 'sucesso' ? 'senha nova criada' : 'Crie sua nova senha'}</h1>
      {estado === 'verificando' && <p role="status" className="mn-new-password__description">Verificando seu link…</p>}
      {estado === 'invalido' && <div className="mn-new-password__actions"><BotaoBoasVindas variante="nova-senha" onClick={voltarLogin}>voltar ao login</BotaoBoasVindas></div>}
      {estado === 'pronto' && <>
        <p className="mn-new-password__description">Escolha uma nova senha para acessar sua conta no <strong>MeuNorte.</strong></p>
        <form onSubmit={enviar} aria-busy={enviando}>
          <InputSenha id="nova-senha" name="password" rotulo="Digite nova senha" value={senha} onAlterar={valor => { setSenha(valor); setErro('') }} disabled={enviando} iconeOculto={olho} descricao="nova-senha-regras" />
          <div className="mn-new-password__rules" id="nova-senha-regras">
            <p className={senhaValida(senha) ? 'mn-new-password__rule--ok' : ''}><img src={senhaValida(senha) ? regraCumprida : regraPendente} alt="" />use pelo menos 8 caracteres.</p>
            <p><img src={regraPendente} alt="" />não repetir a senha anterior.</p>
          </div>
          <InputSenha id="nova-senha-confirmacao" name="password_confirmation" rotulo="Confirme sua senha" value={confirmacao} confirmar
            onAlterar={valor => { setConfirmacao(valor); setErro('') }} onBlur={() => setTocou(true)} enterKeyHint="go" disabled={enviando} iconeOculto={olho}
            erro={diferente ? <><strong>As senhas não coincidem.</strong> Digite a mesma senha nos dois campos.</> : undefined} />
          {erro && <p role="alert" className="mn-new-password__error">{erro}</p>}
          <div className="mn-new-password__actions"><BotaoBoasVindas type="submit" variante="nova-senha" disabled={!senhasConferem(senha, confirmacao) || enviando}>{enviando ? 'criando…' : 'criar senha'}</BotaoBoasVindas></div>
        </form>
      </>}
      {estado === 'sucesso' && <div className="mn-new-password__success"><BotaoBoasVindas variante="nova-senha" onClick={voltarLogin}><span>voltar</span><img src={voltar} alt="" width="50" height="50" /></BotaoBoasVindas></div>}
    </div>
  </main>
}
