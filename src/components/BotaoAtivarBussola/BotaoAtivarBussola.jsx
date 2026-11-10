import { useEffect, useRef, useState } from 'react'
import './BotaoAtivarBussola.css'

export default function BotaoAtivarBussola({ onActivate, onFinish }) {
  const [leaving, setLeaving] = useState(false)
  const alive = useRef(false)
  const timer = useRef(null)
  const busy = useRef(false)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      clearTimeout(timer.current)
    }
  }, [])

  async function activate() {
    if (busy.current) return
    busy.current = true
    // A permissão é solicitada diretamente no toque, antes de qualquer espera.
    const permission = Promise.resolve(onActivate()).catch(() => 'denied')
    setLeaving(true)
    const animation = new Promise(resolve => {
      timer.current = setTimeout(resolve, 420)
    })
    const [result] = await Promise.all([permission, animation])
    if (alive.current) onFinish(result)
  }

  return (
    <button type="button"
      className={`mn-compass-glass ${leaving ? 'mn-compass-glass--leaving' : ''}`}
      disabled={leaving} onClick={activate}
      aria-label="Ativar movimento do MeuNô"
      aria-busy={leaving}>
      <span className="mn-compass-glass__surface">
        <span className="mn-compass-glass__text">ativar movimento<br />do MeuNô</span>
      </span>
    </button>
  )
}


