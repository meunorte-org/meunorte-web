import { useRef, useState } from 'react'
import InputDigitacao from '../InputDigitacao/InputDigitacao.jsx'
import visivelVerde from '../../assets/icons/senha-visivel.svg'
import ocultadaVerde from '../../assets/icons/senha-ocultada.svg'
import visivelErro from '../../assets/icons/senha-visivel-erro.svg'
import ocultadaErro from '../../assets/icons/senha-ocultada-erro.svg'
import alerta from '../../assets/icons/senha-alerta.svg'
import './InputSenha.css'

export default function InputSenha({ id, name, rotulo, value, onAlterar, onBlur, erro, descricao, confirmar = false, animarErro = confirmar, autoComplete = 'new-password', minLength = 8, enterKeyHint = 'next', rotuloErro = 'Senhas diferentes', iconeOculto, disabled = false }) {
  const [visivel, setVisivel] = useState(false)
  const mascaraRef = useRef(null)
  const icone = erro ? (visivel ? visivelErro : ocultadaErro) : (visivel ? visivelVerde : (iconeOculto ?? ocultadaVerde))
  const nomeCampo = confirmar ? 'confirmação de senha' : 'senha'
  const mensagem = erro ? (
    <>
      <span className="mn-password-alert" aria-hidden="true"><img src={alerta} alt="" /><span>!</span></span>
      <span>{erro}</span>
    </>
  ) : undefined

  return (
    <div className={`mn-password-group ${!visivel ? 'mn-password-group--masked' : ''} ${erro ? 'mn-password-group--error' : ''}`}>
      <InputDigitacao id={id} name={name} type={visivel ? 'text' : 'password'}
        animarErro={animarErro} rotulo={erro ? rotuloErro : rotulo} value={value} erro={mensagem} disabled={disabled}
        onChange={event => onAlterar(event.target.value)} onInput={event => onAlterar(event.currentTarget.value)} onBlur={onBlur}
        onScroll={event => { if (mascaraRef.current) mascaraRef.current.scrollLeft = event.currentTarget.scrollLeft }}
        autoComplete={autoComplete} autoCapitalize="none" autoCorrect="off" spellCheck={false}
        enterKeyHint={enterKeyHint} minLength={minLength} required aria-describedby={descricao}>
        {!visivel && <span ref={mascaraRef} className="mn-password-mask" aria-hidden="true"><span>{'*'.repeat(Array.from(value).length)}</span></span>}
        <button type="button" className="mn-password-toggle" aria-label={`${visivel ? 'Ocultar' : 'Mostrar'} ${nomeCampo}`}
          aria-pressed={visivel} aria-controls={id} onMouseDown={event => event.preventDefault()}
          onClick={() => setVisivel(atual => !atual)}>
          <span className={`mn-password-toggle__icon ${visivel ? 'mn-password-toggle__icon--visible' : ''}`} aria-hidden="true"><img src={icone} alt="" /></span>
        </button>
      </InputDigitacao>
    </div>
  )
}
