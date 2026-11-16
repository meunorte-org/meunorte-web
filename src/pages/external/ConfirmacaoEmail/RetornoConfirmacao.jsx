import { useCallback, useEffect, useState } from 'react'
import { servicoAuth } from '../../../services/auth.js'
import { retornoAuthInicial } from '../../../lib/supabaseClient.js'
import ConfirmacaoEmail from './ConfirmacaoEmail.jsx'
import ConfirmacaoSucesso from './ConfirmacaoSucesso.jsx'

let verificacao

function verificarUmaVez() {
  if (retornoAuthInicial.erro) return Promise.reject(new Error('Este link está inválido ou expirou. Solicite um novo link de confirmação.'))
  verificacao ??= servicoAuth.verificarConfirmacao()
  return verificacao
}

export default function RetornoConfirmacao({ onAbrirInterna, conteudoInterno }) {
  const [resultado, setResultado] = useState({ estado: 'verificando', mensagem: 'Aguarde enquanto verificamos seu link de confirmação.', email: '' })

  useEffect(() => {
    let ativo = true
    verificarUmaVez().then(({ email }) => {
      if (ativo) setResultado({ estado: 'confirmado', email, mensagem: 'Seu e-mail foi confirmado. Sua conta está pronta para as próximas etapas do MeuNorte.' })
    }).catch(erro => {
      if (ativo) setResultado({ estado: 'erro', email: '', mensagem: erro.mensagemPublica ?? 'Este link está inválido ou expirou. Solicite um novo link de confirmação.' })
    }).finally(() => {
      // Tokens nunca ficam no endereço após a verificação.
      if (ativo) window.history.replaceState(null, '', `${window.location.pathname}${retornoAuthInicial.areaInterna ? '?area=interna' : '?auth=confirmacao'}`)
    })
    return () => { ativo = false }
  }, [])

  function voltar() {
    window.location.assign(window.location.pathname)
  }

  const abrirAreaInterna = useCallback(() => {
    onAbrirInterna()
  }, [onAbrirInterna])

  if (resultado.estado === 'erro') return <div className="mn-app"><ConfirmacaoEmail estadoRetorno="erro" mensagemRetorno={resultado.mensagem} onVoltar={voltar} /></div>

  const confirmado = resultado.estado === 'confirmado'

  return (
    <div className="mn-app mn-auth-flow">
      {confirmado && <div aria-hidden="true" inert>{conteudoInterno}</div>}
      <ConfirmacaoSucesso confirmado={confirmado} onConcluir={abrirAreaInterna} />
    </div>
  )
}
