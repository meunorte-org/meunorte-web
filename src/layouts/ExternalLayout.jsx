import BoasVindas from '../pages/external/BoasVindas/BoasVindas.jsx'
import Apresentacao from '../pages/external/Apresentacao/Apresentacao.jsx'
import Cadastro from '../pages/external/Cadastro/Cadastro.jsx'
import TransicaoPaginas from '../components/TransicaoPaginas/TransicaoPaginas.jsx'
import useNavegacao, { DURACAO_TRANSICAO } from '../hooks/useNavegacao.js'
import useDocumentosLegais from '../hooks/useDocumentosLegais.js'
import DocumentoLegal from '../pages/external/DocumentosLegais/DocumentoLegal.jsx'
import { servicoAuth, verificacaoEmailAtiva } from '../services/auth.js'
import '../App.css'

function ExternalLayout({ onAutenticado, abrirLoginInicial = false, conteudoInterno }) {
  const { pagina, troca, entradaConcluida, navegar } = useNavegacao()
  const { documento, fecharDocumento } = useDocumentosLegais()


  function exibirPagina(nome) {
    if (nome === 'cadastro') {
      return <Cadastro onVoltar={() => navegar('apresentacao', 'back')} onCancelar={() => navegar('boas-vindas', 'back')}
        onEtapaConcluida={servicoAuth.cadastrar} onReenviarLink={servicoAuth.reenviarConfirmacao}
        onVerificarEmail={verificacaoEmailAtiva ? servicoAuth.emailJaCadastrado : undefined} />
    }
    if (nome === 'apresentacao') {
      return <Apresentacao onVoltar={() => navegar('boas-vindas', 'back')} onCadastro={() => navegar('cadastro')} />
    }

    return (
      <BoasVindas
        animarEntrada={!entradaConcluida && !abrirLoginInicial}
        abrirLoginInicial={abrirLoginInicial}
        onRecuperarSenha={servicoAuth.recuperarSenha}
        onComecar={() => navegar('apresentacao')}
        onEntrar={servicoAuth.entrar}
        onAutenticado={onAutenticado}
        conteudoInterno={conteudoInterno}
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

export default ExternalLayout
