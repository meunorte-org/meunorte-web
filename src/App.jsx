import BoasVindas from './pages/BoasVindas/BoasVindas.jsx'
import Apresentacao from './pages/Apresentacao/Apresentacao.jsx'
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import TransicaoPaginas from './components/TransicaoPaginas/TransicaoPaginas.jsx'
import useNavegacao, { DURACAO_TRANSICAO } from './hooks/useNavegacao.js'
import useDocumentosLegais from './hooks/useDocumentosLegais.js'
import DocumentoLegal from './pages/DocumentosLegais/DocumentoLegal.jsx'
import { servicoAuth, verificacaoEmailAtiva } from './services/auth.js'
import { retornoAuthInicial } from './lib/supabaseClient.js'
import RetornoConfirmacao from './pages/ConfirmacaoEmail/RetornoConfirmacao.jsx'
import './App.css'

function App() {
  const { pagina, troca, entradaConcluida, navegar } = useNavegacao()
  const { documento, fecharDocumento } = useDocumentosLegais()

  if (retornoAuthInicial.ativo || retornoAuthInicial.areaInterna) return <RetornoConfirmacao />

  function exibirPagina(nome) {
    if (nome === 'cadastro') {
      return <Cadastro onVoltar={() => navegar('apresentacao', 'back')}
        onEtapaConcluida={servicoAuth.cadastrar} onReenviarLink={servicoAuth.reenviarConfirmacao}
        onVerificarEmail={verificacaoEmailAtiva ? servicoAuth.emailJaCadastrado : undefined} />
    }
    if (nome === 'apresentacao') {
      return <Apresentacao onVoltar={() => navegar('boas-vindas', 'back')} onCadastro={() => navegar('cadastro')} />
    }

    return (
      <BoasVindas
        animarEntrada={!entradaConcluida}
        onComecar={() => navegar('apresentacao')}
        onEntrar={servicoAuth.entrar}
        onAutenticado={() => window.location.assign(`${window.location.pathname}?area=interna`)}
      />
    )
  }

  return (
    <>
      <div hidden={Boolean(documento)} inert={Boolean(documento)}>
        <TransicaoPaginas pagina={pagina} troca={troca} duracao={DURACAO_TRANSICAO}>
          {exibirPagina}
        </TransicaoPaginas>
      </div>
      {documento && <DocumentoLegal slug={documento} onVoltar={fecharDocumento} />}
    </>
  )
}

export default App
