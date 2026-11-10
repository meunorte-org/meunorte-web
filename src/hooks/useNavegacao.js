import { useEffect, useRef, useState } from 'react'

export const DURACAO_TRANSICAO = 400

export default function useNavegacao() {
  const [pagina, setPagina] = useState('boas-vindas')
  const [troca, setTroca] = useState(null)
  const [entradaConcluida, setEntradaConcluida] = useState(false)
  const timer = useRef(null)
  const foco = useRef(null)

  useEffect(() => () => {
    clearTimeout(timer.current)
    cancelAnimationFrame(foco.current)
  }, [])

  function navegar(destino, direcao = 'next') {
    if (timer.current !== null || destino === pagina) return

    setEntradaConcluida(true)
    setTroca({ destino, direcao })

    timer.current = setTimeout(() => {
      setPagina(destino)
      setTroca(null)
      timer.current = null
      window.scrollTo(0, 0)
      foco.current = requestAnimationFrame(() => {
        document.querySelector('.mn-app__page h1')?.focus({ preventScroll: true })
      })
    }, DURACAO_TRANSICAO)
  }

  return { pagina, troca, entradaConcluida, navegar }
}
