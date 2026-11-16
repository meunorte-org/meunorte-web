import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import AuthProvider from './contexts/AuthProvider.jsx'
import { useAuth } from './contexts/AuthContext.js'
import useRotaApp from './hooks/useRotaApp.js'
import ExternalLayout from './layouts/ExternalLayout.jsx'
import EntradaInterna from './pages/internal/EntradaInterna.jsx'
import NovaSenha from './pages/external/NovaSenha/NovaSenha.jsx'
import RetornoConfirmacao from './pages/external/ConfirmacaoEmail/RetornoConfirmacao.jsx'
import { retornoAuthInicial } from './lib/supabaseClient.js'
import { documentoPeloHash } from './data/documentosLegais.js'
const InternalApp = lazy(() => import('./pages/internal/InternalApp.jsx'))

function Aplicacao() {
  const { usuario, carregando, restaurando, erro, atualizar, sair } = useAuth()
  const { rota, navegar } = useRotaApp()
  const [confirmacaoEncerrada, setConfirmacaoEncerrada] = useState(false)
  const inicializou = useRef(false)
  useEffect(() => {
    if (carregando || inicializou.current) return
    inicializou.current = true
    if (usuario && !rota.interna && !rota.login && !retornoAuthInicial.ativo && !retornoAuthInicial.recuperacao && !documentoPeloHash()) navegar('perfil', { substituir: true })
  }, [usuario, carregando, rota.interna, rota.login, navegar])
  function abrirInterna() { setConfirmacaoEncerrada(true); navegar('perfil', { substituir: true }) }
  async function encerrarSessao() { await sair(); navegar(null, { substituir: true }) }
  if (retornoAuthInicial.recuperacao) return <NovaSenha />
  if (retornoAuthInicial.ativo && !confirmacaoEncerrada) return <RetornoConfirmacao onAbrirInterna={abrirInterna} conteudoInterno={<EntradaInterna />} />
  if (rota.interna) {
    if (carregando) return <EntradaInterna />
    if (!usuario) return <div className="mn-internal mn-internal-shell"><main className="mn-mobile-content mn-i-loading"><h1>Entre para continuar</h1><p role={erro ? 'alert' : undefined}>{erro || 'Seu espaço é pessoal. Acesse sua conta para abrir o MeuNorte.'}</p>{erro && <button className="mn-i-button mn-i-button--secondary" onClick={atualizar}>tentar novamente</button>}<button className="mn-i-button" onClick={() => navegar(null, { substituir: true, login: true })}>entrar na minha conta</button></main></div>
    return <Suspense fallback={<EntradaInterna />}><InternalApp key={usuario.id} rota={rota} navegar={navegar} onSair={encerrarSessao} /></Suspense>
  }
  if (restaurando && !rota.login) return <EntradaInterna />
  return <ExternalLayout onAutenticado={abrirInterna} abrirLoginInicial={rota.login} conteudoInterno={<EntradaInterna />} />
}
export default function App() { return <AuthProvider><Aplicacao /></AuthProvider> }
