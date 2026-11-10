import { useState } from 'react'
import BotaoComecar from '../../components/BotaoComecar/BotaoComecar.jsx'
import BotaoFazerLogin from '../../components/BotaoFazerLogin/BotaoFazerLogin.jsx'
import MascoteNo from '../../components/MascoteNo/MascoteNo.jsx'
import './BoasVindas.css'

export default function BoasVindas({ onComecar, onLogin, animarEntrada = true }) {
  // O retorno é definido ao abrir a tela; não começa ao sair dela.
  const [animarRetorno] = useState(() => !animarEntrada)
  const classeRetorno = animarRetorno ? 'mn-welcome--return' : ''

  return (
    <main className={`mn-welcome ${animarEntrada ? '' : 'mn-welcome--static'} ${classeRetorno}`} data-retorno={animarRetorno} aria-labelledby="welcome-title">
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
