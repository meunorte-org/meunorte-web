import { useState } from 'react'
import seletor from '../../assets/icons/seletor-data.svg'
import seletorPreenchido from '../../assets/icons/seletor-data-preenchido.svg'
import { formatarDataNascimento } from '../../pages/Cadastro/dadosCadastro.js'
import './InputData.css'

export default function InputData({ id, value, onChange, max, erro, onBlur, idade = null }) {
  const [selecionado, setSelecionado] = useState(false)
  const ativo = selecionado || Boolean(value)
  const temIdade = idade !== null
  function abrirSeletor(event) {
    setSelecionado(true)
    // Mantém o seletor nativo no celular e permite abrir por toda a área no desktop.
    try { event.currentTarget.showPicker?.() } catch { /* O input continua editável sem showPicker. */ }
  }

  function sairDoCampo(event) {
    setSelecionado(false)
    onBlur?.(event)
  }

  return (
    <div className="mn-input-group">
      <div className={`mn-date-input ${ativo ? 'mn-date-input--selected' : ''}`}>
        <span className="mn-date-input__label" aria-hidden="true">Selecione a data</span>
        <span className="mn-date-input__value" aria-hidden="true">
          {value ? formatarDataNascimento(value) : '00/00/0000'}
        </span>
        <span className="mn-date-input__selector" aria-hidden="true">
          <img className="mn-date-input__selector-default" src={seletor} alt="" />
          <img className="mn-date-input__selector-filled" src={seletorPreenchido} alt="" />
        </span>
        <input id={id} type="date" name="birth_date" aria-label="Data de nascimento"
          value={value} onChange={onChange} onInput={onChange} onFocus={() => setSelecionado(true)}
          onBlur={sairDoCampo} onClick={abrirSeletor}
          min="0001-01-01" max={max} autoComplete="bday" required
          aria-invalid={Boolean(erro)} aria-describedby={erro ? `${id}-erro` : temIdade ? `${id}-idade` : undefined} />
      </div>
      <div className="mn-date-feedback" aria-live="polite" aria-atomic="true">
        {temIdade && <p key={value} className="mn-date-age" id={`${id}-idade`}>você tem {idade} {idade === 1 ? 'ano' : 'anos'}</p>}
        {erro && <p className="mn-input-error" id={`${id}-erro`} role="alert">{erro}</p>}
      </div>
    </div>
  )
}
