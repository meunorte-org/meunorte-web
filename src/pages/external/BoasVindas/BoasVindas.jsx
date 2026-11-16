import { useState } from 'react'
import BotaoComecar from '../../../components/BotaoComecar/BotaoComecar.jsx'
import BotaoFazerLogin from '../../../components/BotaoFazerLogin/BotaoFazerLogin.jsx'
import MascoteNo from '../../../components/MascoteNo/MascoteNo.jsx'
import Login from '../Login/Login.jsx'
import './BoasVindas.css'

export default function BoasVindas({ onComecar, onEntrar, onAutenticado, onRecuperarSenha, conteudoInterno, abrirLoginInicial = false, animarEntrada = true, pularRetorno = false }) {
  const [loginAberto, setLoginAberto] = useState(abrirLoginInicial)
  const [saindoParaInterna, setSaindoParaInterna] = useState(false)
  // O retorno é definido ao abrir a tela; não começa ao sair dela.
  const [animarRetorno] = useState(() => !animarEntrada)
  const classeRetorno = animarRetorno && !pularRetorno ? 'mn-welcome--return' : ''

  return (
    <>
    {saindoParaInterna && <div className="mn-login-destination" aria-hidden="true" inert>{conteudoInterno}</div>}
    <main className={`mn-welcome ${animarEntrada ? '' : 'mn-welcome--static'} ${classeRetorno} ${saindoParaInterna ? 'mn-welcome--login-exit' : ''}`} data-retorno={animarRetorno} aria-labelledby="welcome-title" inert={loginAberto || saindoParaInterna}>
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
            <BotaoFazerLogin onClick={() => setLoginAberto(true)} aria-haspopup="dialog" aria-expanded={loginAberto} />
          </div>
        </div>
      </div>
    </main>
    {loginAberto && <Login onFechar={() => setLoginAberto(false)} onEntrar={onEntrar} onRecuperarSenha={onRecuperarSenha} onIniciarSaida={() => setSaindoParaInterna(true)} onAutenticado={onAutenticado} />}
    </>
  )
}
