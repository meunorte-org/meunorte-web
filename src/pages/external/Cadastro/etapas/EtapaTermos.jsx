import { useRef, useState } from 'react'
import BotaoCriarConta from '../../../../components/BotaoCriarConta/BotaoCriarConta.jsx'
import BotaoCancelarCadastro from '../../../../components/BotaoCancelarCadastro/BotaoCancelarCadastro.jsx'

export default function EtapaTermos({ onCancelar, onCriarConta }) {
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const envioRef = useRef(false)

  async function criarConta(event) {
    event.preventDefault()
    if (envioRef.current) return
    if (!onCriarConta) {
      setMensagem('A criação de contas estará disponível em breve. Nenhum dado foi enviado.')
      return
    }
    envioRef.current = true
    setEnviando(true)
    setMensagem('')
    try {
      await onCriarConta()
    } catch (erro) {
      setMensagem(erro.mensagemPublica ?? 'Não foi possível criar sua conta. Tente novamente.')
    } finally {
      envioRef.current = false
      setEnviando(false)
    }
  }

  return (
    <form className="mn-signup-form mn-signup-form--consent" onSubmit={criarConta} aria-busy={enviando}>
      <h2 tabIndex={-1}>Tudo pronto para começar!</h2>
      <p className="mn-signup-consent-text">
        Ao criar sua conta, você concorda com os{' '}
        <a className="mn-signup-document" href="#termos-de-uso" aria-disabled={enviando} onClick={event => { if (enviando) event.preventDefault() }}>Termos de Uso</a>
        {' '}e declara estar ciente da{' '}
        <a className="mn-signup-document" href="#politica-de-privacidade" aria-disabled={enviando} onClick={event => { if (enviando) event.preventDefault() }}>Política de Privacidade.</a>
      </p>
      <div className="mn-signup-consent-actions">
        <BotaoCriarConta type="submit" disabled={enviando} aria-busy={enviando} />
        <BotaoCancelarCadastro onClick={onCancelar} disabled={enviando} />
      </div>
      <p className="mn-signup-consent-status" role="status">{enviando ? 'Criando sua conta…' : mensagem}</p>
    </form>
  )
}
