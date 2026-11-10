import BotaoComecar from '../../components/BotaoComecar/BotaoComecar.jsx'
import BotaoFazerLogin from '../../components/BotaoFazerLogin/BotaoFazerLogin.jsx'
import MascoteNo from '../../components/MascoteNo/MascoteNo.jsx'
import './BoasVindas.css'

export default function BoasVindas({ onComecar, onLogin, animarEntrada = true }) {
  return (
    <main className={`mn-welcome ${animarEntrada ? '' : 'mn-welcome--static'}`} aria-labelledby="welcome-title">
      <div className="mn-welcome__content">
        <div className="mn-welcome__mascot">
          <MascoteNo animarEntrada={animarEntrada} />
        </div>
        <h1 tabIndex={-1} id="welcome-title" className="mn-welcome__title">MeuNorte</h1>
        <p className="mn-welcome__description">
          Encontre seu caminho para o ensino superior.
        </p>
        <div className="mn-welcome__actions">
          <BotaoComecar onClick={onComecar} />
          <div className="mn-welcome__login">
            <p>Já tenho uma conta.</p>
            <BotaoFazerLogin onClick={onLogin} />
          </div>
        </div>
      </div>
    </main>
  )
}




