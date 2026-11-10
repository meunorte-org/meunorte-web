import { useEffect, useRef, useState } from 'react'
import CampoCadastro from '../../components/CampoCadastro/CampoCadastro.jsx'
import EtapaNome from './etapas/EtapaNome.jsx'
import EtapaData from './etapas/EtapaData.jsx'
import { dataNascimentoValida } from './dadosCadastro.js'
import './Cadastro.css'

export default function Cadastro({ onVoltar, onEtapaConcluida }) {
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
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
    // Dados prontos para continuar o formulário. Enviar ao Supabase só ao criar a conta.
    onEtapaConcluida?.({ full_name: nomeCompleto, birth_date: dataNascimento })
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
            {etapa === 1 ? (
              <EtapaNome nomeCompleto={nomeCompleto} onAlterarNome={setNomeCompleto}
                onVoltar={onVoltar} onContinuar={concluirEtapaNome} />
            ) : (
              <EtapaData dataNascimento={dataNascimento} onAlterarData={setDataNascimento}
                onVoltar={() => setEtapa(1)} onContinuar={concluirEtapaData} />
            )}
          </div>
        </CampoCadastro>
      </div>
    </main>
  )
}
