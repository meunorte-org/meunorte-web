import { useEffect, useRef, useState } from 'react'
import BoasVindas from './pages/BoasVindas/BoasVindas.jsx'
import Apresentacao from './pages/Apresentacao/Apresentacao.jsx'

import './App.css'

function App() {
  const [pagina, setPagina] = useState('boas-vindas')
  const [troca, setTroca] = useState(null)
  const [entradaConcluida, setEntradaConcluida] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function navegar(destino, direcao = 'next') {
    if (troca || destino === pagina) return
    setEntradaConcluida(true)
    setTroca({ destino, direcao })
    timer.current = setTimeout(() => {
      setPagina(destino)
      setTroca(null)
      window.scrollTo(0, 0)
      requestAnimationFrame(() => document.querySelector('.mn-app__page h1')?.focus({ preventScroll: true }))
    }, 400)
  }

  function renderizar(nome) {
    if (nome === 'apresentacao') return <Apresentacao onVoltar={() => navegar('boas-vindas', 'back')} />

    return <BoasVindas animarEntrada={!entradaConcluida} onComecar={() => navegar('apresentacao')} />
  }


  return (
    <div className={`mn-app ${troca ? `mn-app--moving mn-app--${troca.direcao}` : ''}`}>
      {(troca ? [pagina, troca.destino] : [pagina]).map(nome => (
        <div key={nome} className={nome === pagina ? 'mn-app__page' : 'mn-app__incoming'}
          aria-hidden={troca ? true : undefined} inert={troca ? true : undefined}>
          {renderizar(nome)}
        </div>
      ))}
    </div>
  )
}

export default App
