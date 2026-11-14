import BotaoBoasVindas from '../BotaoBoasVindas/BotaoBoasVindas.jsx'
import seta from '../../assets/icons/seta-cancelar-cadastro.svg'

export default function BotaoCancelarCadastro(props) {
  return (
    <BotaoBoasVindas {...props} variante="cancelar-cadastro">
      <span className="mn-signup-cancel-arrow" aria-hidden="true"><img src={seta} alt="" /></span>
      <span>cancelar o cadastro</span>
    </BotaoBoasVindas>
  )
}
