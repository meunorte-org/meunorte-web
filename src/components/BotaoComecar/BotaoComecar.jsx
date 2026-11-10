import BotaoBoasVindas from '../BotaoBoasVindas/BotaoBoasVindas.jsx'
import seta from '../../assets/icons/seta-comecar.svg'

export default function BotaoComecar({ children = 'começar', ...props }) {
  return (
    <BotaoBoasVindas {...props} variante="comecar">
      <span>{children}</span>
      <span className="mn-welcome-button__arrow" aria-hidden="true">
        <img src={seta} alt="" />
      </span>
    </BotaoBoasVindas>
  )
}
