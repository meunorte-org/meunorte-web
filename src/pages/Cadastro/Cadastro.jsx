import { useEffect, useRef, useState } from 'react'
import CampoCadastro from '../../components/CampoCadastro/CampoCadastro.jsx'
import EtapaNome from './etapas/EtapaNome.jsx'
import EtapaData from './etapas/EtapaData.jsx'
import EtapaEstudos from './etapas/EtapaEstudos.jsx'
import EtapaSeuEmail from './etapas/EtapaSeuEmail.jsx'
import EtapaCriarSenha from './etapas/EtapaCriarSenha.jsx'
import EtapaTermos from './etapas/EtapaTermos.jsx'
import ConfirmacaoEmail from '../ConfirmacaoEmail/ConfirmacaoEmail.jsx'
import { estudoValido } from '../../data/opcoesEstudo.js'
import { dataNascimentoValida, emailValido, senhasConferem } from './dadosCadastro.js'
import './Cadastro.css'

const DURACAO_REVELACAO = 500
const DURACAO_BARRA = 500
const PAUSA_APOS_BARRA = 500

export default function Cadastro({ onVoltar, onEtapaConcluida, onReenviarLink }) {
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [estadoEstudo, setEstadoEstudo] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const [etapa, setEtapa] = useState(1)
  const conteudoRef = useRef(null)
  const etapaAnterior = useRef(1)
  const [entradaConcluida, setEntradaConcluida] = useState(false)
  const [concluindo, setConcluindo] = useState(false)
  const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false)
  const [movimento, setMovimento] = useState(null)
  const [emailConfirmacao, setEmailConfirmacao] = useState('')
  const [linkEnviado, setLinkEnviado] = useState(false)
  const [solicitacaoRecebida, setSolicitacaoRecebida] = useState(false)
  const montado = useRef(false)
  const timers = useRef(new Set())
  const processando = useRef(false)
  const resolverBarra = useRef(null)
  const resolverMovimento = useRef(null)
  const restaurarFoco = useRef(false)

  useEffect(() => {
    montado.current = true
    const ativos = timers.current
    return () => {
      montado.current = false
      ativos.forEach(timer => window.clearTimeout(timer))
      ativos.clear()
      resolverBarra.current = null
      resolverMovimento.current = null
    }
  }, [])

  function esperar(duracao) {
    return new Promise(resolve => {
      const timer = window.setTimeout(() => {
        timers.current.delete(timer)
        resolve()
      }, duracao)
      timers.current.add(timer)
    })
  }

  function aguardarAnimacao(referencia, duracao) {
    return new Promise(resolve => {
      // O evento visual encerra a fase. O limite evita travar se o navegador
      // suspender animações numa aba em segundo plano.
      const finalizar = () => {
        window.clearTimeout(timer)
        timers.current.delete(timer)
        referencia.current = null
        resolve()
      }
      const timer = window.setTimeout(finalizar, duracao + 250)
      timers.current.add(timer)
      referencia.current = finalizar
    })
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setEntradaConcluida(true), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (etapaAnterior.current !== etapa) {
      conteudoRef.current?.querySelector('h2')?.focus({ preventScroll: true })
      etapaAnterior.current = etapa
    }
  }, [etapa])

  useEffect(() => {
    if (!confirmacaoVisivel && !movimento && restaurarFoco.current) {
      restaurarFoco.current = false
      conteudoRef.current?.querySelector('h2')?.focus({ preventScroll: true })
    }
  }, [confirmacaoVisivel, movimento])

  function concluirEtapaNome() {
    const nome = nomeCompleto.trim().replace(/\s+/g, ' ')
    setNomeCompleto(nome)
    if (nome) setEtapa(2)
  }

  function concluirEtapaData() {
    if (!dataNascimentoValida(dataNascimento)) return
    setEtapa(3)
  }

  function concluirEtapaEstudos() {
    if (!estudoValido(estadoEstudo)) return
    setEtapa(4)
  }

  function concluirEtapaEmail() {
    const emailNormalizado = email.trim()
    if (!emailValido(emailNormalizado)) return
    setEmail(emailNormalizado)
    setEtapa(5)
  }

  function concluirEtapaSenha() {
    if (!senhasConferem(senha, confirmacaoSenha)) return
    setEtapa(6)
  }

  async function criarConta() {
    if (processando.current) return
    processando.current = true
    setConcluindo(true)
    try {
      // Sem integração, apenas a prévia visual é exibida; não há envio simulado.
      const barra = aguardarAnimacao(resolverBarra, DURACAO_BARRA)
      let envioConfirmado = false
      let pedidoRecebido = false
      if (onEtapaConcluida) {
        const resultado = await onEtapaConcluida({ full_name: nomeCompleto, birth_date: dataNascimento, education_level: estadoEstudo, email, password: senha })
        if (resultado?.error) throw resultado.error
        // O adaptador futuro deve informar explicitamente o resultado do envio.
        envioConfirmado = resultado?.confirmationEmailSent === true
        pedidoRecebido = resultado?.requestAccepted === true
      }
      await barra
      if (!montado.current) return
      // A barra fica completamente preenchida por 500ms antes da subida.
      await esperar(PAUSA_APOS_BARRA)
      if (!montado.current) return
      setEmailConfirmacao(email)
      setLinkEnviado(envioConfirmado)
      setSolicitacaoRecebida(pedidoRecebido)
      setConfirmacaoVisivel(true)
      setMovimento('enter')
      window.scrollTo(0, 0)
      await aguardarAnimacao(resolverMovimento, DURACAO_REVELACAO)
      if (!montado.current) return
      setMovimento(null)
    } finally {
      resolverBarra.current?.()
      processando.current = false
      if (montado.current) setConcluindo(false)
    }
  }

  async function voltarDaConfirmacao(destino) {
    if (processando.current) return
    processando.current = true
    setEtapa(destino)
    setMovimento('exit')
    window.scrollTo(0, 0)
    await aguardarAnimacao(resolverMovimento, DURACAO_REVELACAO)
    if (!montado.current) return
    restaurarFoco.current = true
    setConfirmacaoVisivel(false)
    setMovimento(null)
    processando.current = false
  }

  function exibirEtapa() {
    if (etapa === 6) {
      return <EtapaTermos onCancelar={onVoltar} onCriarConta={criarConta} />
    }
    if (etapa === 1) {
      return <EtapaNome nomeCompleto={nomeCompleto} onAlterarNome={setNomeCompleto}
        onVoltar={onVoltar} onContinuar={concluirEtapaNome} />
    }
    if (etapa === 2) {
      return <EtapaData dataNascimento={dataNascimento} onAlterarData={setDataNascimento}
        onVoltar={() => setEtapa(1)} onContinuar={concluirEtapaData} />
    }
    if (etapa === 3) {
      return <EtapaEstudos estadoEstudo={estadoEstudo} onAlterarEstudo={setEstadoEstudo}
        onVoltar={() => setEtapa(2)} onContinuar={concluirEtapaEstudos} />
    }
    if (etapa === 4) {
      return <EtapaSeuEmail email={email} onAlterarEmail={setEmail}
        onVoltar={() => setEtapa(3)} onContinuar={concluirEtapaEmail} />
    }
    return <EtapaCriarSenha senha={senha} confirmacaoSenha={confirmacaoSenha}
      onAlterarSenha={setSenha} onAlterarConfirmacao={setConfirmacaoSenha}
      onVoltar={() => setEtapa(4)} onContinuar={concluirEtapaSenha} />
  }

  return (
    <div className={`mn-registration-flow ${concluindo ? 'mn-registration-flow--completing' : ''}`} style={{ '--mn-confirmation-duration': `${DURACAO_REVELACAO}ms` }}>
    <main className="mn-signup mn-mobile-screen" hidden={confirmacaoVisivel && !movimento} inert={confirmacaoVisivel}>
      <div className="mn-signup__content mn-mobile-content">
        <header className="mn-signup-header">
          <h1 tabIndex={-1}>Criar conta</h1>
          <p>Faça parte da comunidade <strong>MeuNorte</strong>.</p>
        </header>
        <CampoCadastro etapa={entradaConcluida ? (concluindo ? 7 : etapa) : 0} bloqueado={!entradaConcluida || confirmacaoVisivel}
          onConclusao={() => resolverBarra.current?.()}>
          <div key={etapa} ref={conteudoRef} className="mn-signup-step mn-signup-step--enter">
            {exibirEtapa()}
          </div>
        </CampoCadastro>
      </div>
    </main>
    {confirmacaoVisivel && (
      <div className={`mn-registration-confirmation ${movimento ? `mn-registration-confirmation--${movimento}` : ''}`}
        onAnimationEnd={event => {
          if (event.target === event.currentTarget && event.animationName.startsWith('mn-confirmation-')) resolverMovimento.current?.()
        }}>
        <ConfirmacaoEmail email={emailConfirmacao} enviado={linkEnviado} solicitacaoRecebida={solicitacaoRecebida} bloqueado={Boolean(movimento)}
          onVoltar={() => voltarDaConfirmacao(6)} onAlterarEmail={() => voltarDaConfirmacao(4)} onReenviarLink={onReenviarLink} />
      </div>
    )}
    </div>
  )
}
