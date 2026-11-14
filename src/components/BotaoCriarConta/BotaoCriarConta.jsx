import BotaoBoasVindas from '../BotaoBoasVindas/BotaoBoasVindas.jsx'
import seta from '../../assets/icons/seta-criar-conta.svg'

export default function BotaoCriarConta(props) {
  return (
    <BotaoBoasVindas {...props} variante="criar-conta">
      <span>concordar e criar conta</span>
      <span className="mn-signup-consent-arrow" aria-hidden="true"><img src={seta} alt="" /></span>
    </BotaoBoasVindas>
  )
}
