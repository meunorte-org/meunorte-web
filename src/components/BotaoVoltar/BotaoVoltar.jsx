import seta from '../../assets/icons/seta-voltar.svg'
import './BotaoVoltar.css'

export default function BotaoVoltar({ onClick }) {
  return (
    <button className="mn-back" type="button" onClick={onClick} aria-label="Voltar">
      <span className="mn-back__surface">
        <span className="mn-back__icon" aria-hidden="true">
          <img src={seta} alt="" />
        </span>
      </span>
    </button>
  )
}
