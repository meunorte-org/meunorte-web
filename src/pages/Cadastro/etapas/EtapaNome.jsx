import InputDigitacao from '../../../components/InputDigitacao/InputDigitacao.jsx'
import BotaoContinuar from '../../../components/BotaoContinuar/BotaoContinuar.jsx'
import BotaoVoltar from '../../../components/BotaoVoltar/BotaoVoltar.jsx'

export default function EtapaNome({ nomeCompleto, onAlterarNome, onVoltar, onContinuar }) {
  const valido = nomeCompleto.trim().length > 0

  function enviar(event) {
    event.preventDefault()
    if (valido) onContinuar()
  }

  return (
    <form className="mn-signup-form" onSubmit={enviar}>
      <h2 tabIndex={-1}>Qual é o seu nome?</h2>
      <InputDigitacao id="nome-completo" name="full_name" rotulo="Digite seu nome completo"
        value={nomeCompleto} onChange={event => onAlterarNome(event.target.value)}
        autoComplete="name" autoCapitalize="words" enterKeyHint="next" required />
      <div className="mn-signup-actions">
        <BotaoVoltar variante="verde" onClick={onVoltar} />
        <BotaoContinuar disabled={!valido} />
      </div>
    </form>
  )
}
