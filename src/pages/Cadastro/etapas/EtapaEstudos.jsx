import InputEstadoEstudo from '../../../components/InputEstadoEstudo/InputEstadoEstudo.jsx'
import BotaoContinuar from '../../../components/BotaoContinuar/BotaoContinuar.jsx'
import BotaoVoltar from '../../../components/BotaoVoltar/BotaoVoltar.jsx'
import { estudoValido } from '../../../data/opcoesEstudo.js'

export default function EtapaEstudos({ estadoEstudo, onAlterarEstudo, onVoltar, onContinuar }) {
  const valido = estudoValido(estadoEstudo)

  function enviar(event) {
    event.preventDefault()
    if (valido) onContinuar()
  }

  return (
    <form className="mn-signup-form mn-signup-form--studies" onSubmit={enviar}>
      <h2 tabIndex={-1}>Em que etapa de estudos você está?</h2>
      <InputEstadoEstudo id="estado-estudo" value={estadoEstudo} onChange={onAlterarEstudo} />
      <div className="mn-signup-actions">
        <BotaoVoltar variante="verde" onClick={onVoltar} />
        <BotaoContinuar disabled={!valido} />
      </div>
    </form>
  )
}
