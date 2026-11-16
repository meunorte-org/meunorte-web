import { useEffect, useRef, useState } from 'react'
import InputDigitacao from '../../../../components/InputDigitacao/InputDigitacao.jsx'
import BotaoContinuar from '../../../../components/BotaoContinuar/BotaoContinuar.jsx'
import BotaoVoltar from '../../../../components/BotaoVoltar/BotaoVoltar.jsx'
import alerta from '../../../../assets/icons/senha-alerta.svg'
import { emailValido } from '../../../../domain/cadastro.js'
import './EtapaSeuEmail.css'

const normalizar = valor => valor.trim().toLowerCase()

export default function EtapaSeuEmail({ email, onAlterarEmail, onVoltar, onContinuar, onVerificarEmail }) {
  const [tocou, setTocou] = useState(false)
  const [consulta, setConsulta] = useState({ email: '', estado: 'ocioso' })
  const atual = useRef(email)
  const ativo = useRef(false)
  const sequencia = useRef(0)
  const pendente = useRef(null)
  const enviando = useRef(false)
  const valido = emailValido(email)
  const corresponde = consulta.email === normalizar(email)
  const usado = corresponde && consulta.estado === 'usado'
  const verificando = corresponde && consulta.estado === 'verificando'
  const falhou = corresponde && consulta.estado === 'falhou'
  const erroFormato = tocou && !valido ? (email.trim() ? 'Digite um e-mail válido, como nome@exemplo.com.' : 'Informe seu e-mail para continuar.') : ''
  const temErro = usado || falhou || Boolean(erroFormato)

  useEffect(() => {
    ativo.current = true
    return () => { ativo.current = false; sequencia.current += 1 }
  }, [])

  function verificar(valor) {
    if (!onVerificarEmail) return Promise.resolve(false)
    const endereco = normalizar(valor)
    if (pendente.current?.email === endereco) return pendente.current.promessa
    const numero = ++sequencia.current
    setConsulta({ email: endereco, estado: 'verificando' })
    const promessa = Promise.resolve().then(() => onVerificarEmail(endereco)).then(existe => {
      if (typeof existe !== 'boolean') throw new Error('Resposta inválida')
      if (ativo.current && numero === sequencia.current) setConsulta({ email: endereco, estado: existe ? 'usado' : 'livre' })
      return existe
    }).catch(() => {
      if (ativo.current && numero === sequencia.current) setConsulta({ email: endereco, estado: 'falhou' })
      return null
    }).finally(() => {
      if (pendente.current?.promessa === promessa) pendente.current = null
    })
    pendente.current = { email: endereco, promessa }
    return promessa
  }

  function alterar(valor) {
    atual.current = valor
    sequencia.current += 1
    pendente.current = null
    setConsulta({ email: '', estado: 'ocioso' })
    setTocou(false)
    onAlterarEmail(valor)
  }

  function sairDoCampo() {
    const valor = email.trim()
    atual.current = valor
    onAlterarEmail(valor)
    setTocou(true)
    if (emailValido(valor)) void verificar(valor)
  }

  async function enviar(event) {
    event.preventDefault()
    setTocou(true)
    if (!valido || usado || enviando.current) return
    enviando.current = true
    const endereco = normalizar(email)
    const existe = await verificar(email)
    enviando.current = false
    if (ativo.current && existe === false && normalizar(atual.current) === endereco) onContinuar()
  }

  const mensagem = usado ? <><strong>E-mail já cadastrado.</strong> Entre na sua conta.</>
    : falhou ? 'Não foi possível verificar o e-mail. Tente novamente.' : erroFormato
  const erro = temErro ? <>
    <span className="mn-email-alert" aria-hidden="true"><img src={alerta} alt="" /><span>!</span></span>
    <span>{mensagem}</span>
  </> : null

  return (
    <form className="mn-signup-form mn-signup-form--email" onSubmit={enviar} aria-busy={verificando}>
      <h2 tabIndex={-1}>Qual é o seu e-mail?</h2>
      <div className={`mn-email-group ${temErro ? 'mn-email-group--error' : ''}`}>
        <InputDigitacao id="cadastro-email" name="email" type="email" rotulo={usado ? 'E-mail já usado' : 'Digite seu e-mail'}
          value={email} onChange={event => alterar(event.target.value)} onBlur={sairDoCampo}
          autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false}
          enterKeyHint="next" maxLength={254} required erro={erro} animarErro aria-describedby={temErro ? undefined : 'cadastro-email-ajuda'} />
      </div>
      {!temErro && <p id="cadastro-email-ajuda" className="mn-signup-email-help">Você receberá um <strong>link de verificação</strong> por esse e-mail para criar sua conta.</p>}
      <p className="mn-email-check-status" role="status">{verificando ? 'Verificando e-mail…' : ''}</p>
      <div className="mn-signup-actions">
        <BotaoVoltar variante="verde" onClick={onVoltar} />
        <BotaoContinuar disabled={!valido || usado || verificando} />
      </div>
    </form>
  )
}
