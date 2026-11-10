import BotaoBoasVindas from '../BotaoBoasVindas/BotaoBoasVindas.jsx'
import seta from '../../assets/icons/seta-continuar.svg'

export default function BotaoContinuar(props) {
  return (
    <BotaoBoasVindas {...props} variante="cadastro" type="submit">
      <span>continuar</span>
      <span className="mn-welcome-button__arrow" aria-hidden="true"><img src={seta} alt="" /></span>
    </BotaoBoasVindas>
  )
}
