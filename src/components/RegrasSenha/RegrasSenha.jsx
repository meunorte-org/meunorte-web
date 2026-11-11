import pendente from '../../assets/icons/senha-regra-pendente.svg'
import cumprida from '../../assets/icons/senha-regra-cumprida.svg'
import './RegrasSenha.css'

export default function RegrasSenha({ cumpriu, id }) {
  return (
    <div id={id} className={`mn-password-rule ${cumpriu ? 'mn-password-rule--fulfilled' : ''}`} role="status"
      aria-label={cumpriu ? 'Requisito de pelo menos 8 caracteres atendido.' : 'A senha deve ter pelo menos 8 caracteres.'}>
      <span className="mn-password-rule__check" aria-hidden="true"><img src={cumpriu ? cumprida : pendente} alt="" /></span>
      <span>use pelo menos 8 caracteres.</span>
    </div>
  )
}
