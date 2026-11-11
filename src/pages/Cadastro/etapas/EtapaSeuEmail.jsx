import { useState } from 'react'
import InputDigitacao from '../../../components/InputDigitacao/InputDigitacao.jsx'
import BotaoContinuar from '../../../components/BotaoContinuar/BotaoContinuar.jsx'
import BotaoVoltar from '../../../components/BotaoVoltar/BotaoVoltar.jsx'
import { emailValido } from '../dadosCadastro.js'

export default function EtapaSeuEmail({ email, onAlterarEmail, onVoltar, onContinuar }) {
  const [tocou, setTocou] = useState(false)
  const valido = emailValido(email)
  const erro = tocou && !valido
    ? (email.trim() ? 'Digite um e-mail válido, como nome@exemplo.com.' : 'Informe seu e-mail para continuar.')
    : ''

  function sairDoCampo() {
    onAlterarEmail(email.trim())
    setTocou(true)
  }

  function enviar(event) {
    event.preventDefault()
    setTocou(true)
    if (valido) onContinuar()
  }

  return (
    <form className="mn-signup-form mn-signup-form--email" onSubmit={enviar}>
      <h2 tabIndex={-1}>Qual é o seu e-mail?</h2>
      <InputDigitacao id="cadastro-email" name="email" type="email" rotulo="Digite seu e-mail"
        value={email} onChange={event => onAlterarEmail(event.target.value)} onBlur={sairDoCampo}
        autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false}
        enterKeyHint="next" required erro={erro} aria-describedby="cadastro-email-ajuda" />
      <p id="cadastro-email-ajuda" className="mn-signup-email-help">
        Você receberá um <strong>link de verificação</strong> por esse e-mail para criar sua conta.
      </p>
      <div className="mn-signup-actions">
        <BotaoVoltar variante="verde" onClick={onVoltar} />
        <BotaoContinuar disabled={!valido} />
      </div>
    </form>
  )
}
