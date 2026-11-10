import BoasVindas from './pages/BoasVindas/BoasVindas.jsx'
import Apresentacao from './pages/Apresentacao/Apresentacao.jsx'
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import TransicaoPaginas from './components/TransicaoPaginas/TransicaoPaginas.jsx'
import useNavegacao, { DURACAO_TRANSICAO } from './hooks/useNavegacao.js'
import './App.css'

function App() {
  const { pagina, troca, entradaConcluida, navegar } = useNavegacao()

  function exibirPagina(nome) {
    if (nome === 'cadastro') {
      return <Cadastro onVoltar={() => navegar('apresentacao', 'back')} />
    }
    if (nome === 'apresentacao') {
      return <Apresentacao onVoltar={() => navegar('boas-vindas', 'back')} onCadastro={() => navegar('cadastro')} />
    }

    return (
      <BoasVindas
        animarEntrada={!entradaConcluida}
        onComecar={() => navegar('apresentacao')}
      />
    )
  }

  return (
    <TransicaoPaginas pagina={pagina} troca={troca} duracao={DURACAO_TRANSICAO}>
      {exibirPagina}
    </TransicaoPaginas>
  )
}

export default App
