import { useEffect, useRef, useState } from 'react'
import CampoCadastro from '../../components/CampoCadastro/CampoCadastro.jsx'
import EtapaNome from './etapas/EtapaNome.jsx'
import EtapaData from './etapas/EtapaData.jsx'
import EtapaEstudos from './etapas/EtapaEstudos.jsx'
import EtapaSeuEmail from './etapas/EtapaSeuEmail.jsx'
import EtapaCriarSenha from './etapas/EtapaCriarSenha.jsx'
import { estudoValido } from '../../data/opcoesEstudo.js'
import { dataNascimentoValida, emailValido, senhasConferem } from './dadosCadastro.js'
import './Cadastro.css'

export default function Cadastro({ onVoltar, onEtapaConcluida }) {
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
    // Dados prontos para continuar o formulário. Enviar ao Supabase só ao criar a conta.
    onEtapaConcluida?.({ full_name: nomeCompleto, birth_date: dataNascimento, education_level: estadoEstudo, email, password: senha })
  }

  function exibirEtapa() {
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
    <main className="mn-signup mn-mobile-screen">
      <div className="mn-signup__content mn-mobile-content">
        <header className="mn-signup-header">
          <h1 tabIndex={-1}>Criar conta</h1>
          <p>Faça parte da comunidade <strong>MeuNorte</strong>.</p>
        </header>
        <CampoCadastro etapa={entradaConcluida ? etapa : 0} bloqueado={!entradaConcluida}>
          <div key={etapa} ref={conteudoRef} className="mn-signup-step mn-signup-step--enter">
            {exibirEtapa()}
          </div>
        </CampoCadastro>
      </div>
    </main>
  )
}
