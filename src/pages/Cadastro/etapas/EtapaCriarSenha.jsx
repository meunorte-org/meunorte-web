import { useRef, useState } from 'react'
import InputSenha from '../../../components/InputSenha/InputSenha.jsx'
import RegrasSenha from '../../../components/RegrasSenha/RegrasSenha.jsx'
import BotaoContinuar from '../../../components/BotaoContinuar/BotaoContinuar.jsx'
import BotaoVoltar from '../../../components/BotaoVoltar/BotaoVoltar.jsx'
import { senhaValida, senhasConferem } from '../dadosCadastro.js'

export default function EtapaCriarSenha({ senha, confirmacaoSenha, onAlterarSenha, onAlterarConfirmacao, onVoltar, onContinuar }) {
  const [verificouConfirmacao, setVerificouConfirmacao] = useState(false)
  const erroAvisadoRef = useRef(false)
  const cumpriuRegra = senhaValida(senha)
  const valido = senhasConferem(senha, confirmacaoSenha)
  const diferentes = Boolean(confirmacaoSenha) && senha !== confirmacaoSenha
  const erroConfirmacao = verificouConfirmacao && diferentes ? 'As senhas não coincidem. Digite a mesma senha nos dois campos.' : ''

  function verificarConfirmacao() {
    setVerificouConfirmacao(true)
    if (diferentes && !erroAvisadoRef.current) {
      // Vibração única e curta por divergência; não interrompe aparelhos sem suporte.
      try { navigator.vibrate?.(35) } catch { /* Feedback visual continua disponível. */ }
      erroAvisadoRef.current = true
    }
    if (!diferentes) erroAvisadoRef.current = false
  }

  function alterarSenha(valor) {
    if (valor === confirmacaoSenha || !confirmacaoSenha) erroAvisadoRef.current = false
    onAlterarSenha(valor)
  }

  function alterarConfirmacao(valor) {
    if (valor === senha || !valor) erroAvisadoRef.current = false
    onAlterarConfirmacao(valor)
  }

  function enviar(event) {
    event.preventDefault()
    verificarConfirmacao()
    if (valido) onContinuar()
  }

  return (
    <form className="mn-signup-form mn-signup-form--password" onSubmit={enviar}>
      <h2 tabIndex={-1}>Agora crie sua senha!</h2>
      <InputSenha id="cadastro-senha" name="password" rotulo="Digite sua senha" value={senha}
        onAlterar={alterarSenha} onBlur={() => { if (verificouConfirmacao) verificarConfirmacao() }} descricao="cadastro-senha-regra" />
      <RegrasSenha id="cadastro-senha-regra" cumpriu={cumpriuRegra} />
      <div className="mn-signup-confirmation">
        <InputSenha id="cadastro-confirmacao" name="password_confirmation" rotulo="Confirmar senha" value={confirmacaoSenha}
          onAlterar={alterarConfirmacao} onBlur={verificarConfirmacao} erro={erroConfirmacao} confirmar />
      </div>
      <div className="mn-signup-actions">
        <BotaoVoltar variante="verde" onClick={onVoltar} />
        <BotaoContinuar disabled={!valido} />
      </div>
    </form>
  )
}
