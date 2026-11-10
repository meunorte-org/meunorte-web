import BotaoComecar from '../../components/BotaoComecar/BotaoComecar.jsx'
import BotaoVoltar from '../../components/BotaoVoltar/BotaoVoltar.jsx'
import ilustracao from '../../assets/images/apresentacao.png'
import './Apresentacao.css'

export default function Apresentacao({ onVoltar, onCadastro }) {
  return (
    <main className="mn-presentation" aria-labelledby="presentation-title">
      <div className="mn-presentation__content">
        <h1 tabIndex={-1} id="presentation-title" className="mn-presentation__title">Descubra seu caminho</h1>
        <img className="mn-presentation__image" src={ilustracao}
          alt="Estudante com uma bússola descobrindo caminhos para o ensino superior" />
        <p className="mn-presentation__description">
          Uma jornada personalizada para conectar seus interesses <strong>ao seu futuro.</strong>
        </p>
        <div className="mn-presentation__actions">
          <BotaoVoltar onClick={onVoltar} />
          <BotaoComecar onClick={onCadastro}>cadastro</BotaoComecar>
        </div>
      </div>
    </main>
  )
}

