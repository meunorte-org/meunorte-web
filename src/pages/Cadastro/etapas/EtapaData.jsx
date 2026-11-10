import { useState } from 'react'
import InputData from '../../../components/InputData/InputData.jsx'
import BotaoContinuar from '../../../components/BotaoContinuar/BotaoContinuar.jsx'
import BotaoVoltar from '../../../components/BotaoVoltar/BotaoVoltar.jsx'
import { calcularIdade, dataLocalISO, dataNascimentoValida } from '../dadosCadastro.js'

export default function EtapaData({ dataNascimento, onAlterarData, onVoltar, onContinuar }) {
  const [tocou, setTocou] = useState(false)
  const hoje = dataLocalISO()
  const valido = dataNascimentoValida(dataNascimento, hoje)
  const erro = tocou && dataNascimento && !valido ? 'Selecione uma data válida, que não seja futura.' : ''

  function enviar(event) {
    event.preventDefault()
    setTocou(true)
    if (valido) onContinuar()
  }

  return (
    <form className="mn-signup-form mn-signup-form--date" onSubmit={enviar}>
      <h2 tabIndex={-1}>Qual é sua data de nascimento?</h2>
      <InputData id="data-nascimento" value={dataNascimento} max={hoje} erro={erro} idade={calcularIdade(dataNascimento, hoje)}
        onChange={event => onAlterarData(event.target.value)} onBlur={() => setTocou(true)} />
      <div className="mn-signup-actions">
        <BotaoVoltar variante="verde" onClick={onVoltar} />
        <BotaoContinuar disabled={!valido} />
      </div>
    </form>
  )
}
