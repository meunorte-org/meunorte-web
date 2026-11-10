import seta from '../../assets/icons/seta-voltar.svg'
import setaVerde from '../../assets/icons/seta-voltar-verde.svg'
import './BotaoVoltar.css'

export default function BotaoVoltar({ onClick, variante = 'padrao' }) {
  return (
    <button className={`mn-back mn-back--${variante}`} type="button" onClick={onClick} aria-label="Voltar">
      <span className="mn-back__surface">
        <span className="mn-back__icon" aria-hidden="true">
          <img src={variante === 'verde' ? setaVerde : seta} alt="" />
        </span>
      </span>
    </button>
  )
}
