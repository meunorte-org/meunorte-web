import { useEffect, useRef, useState } from 'react'
import mascoteSvg from '../../assets/images/mascote-no.svg?raw'
import { orientationSample, shortestAngle } from './orientation.mjs'
import './MascoteNo.css'
import BotaoAtivarBussola from '../BotaoAtivarBussola/BotaoAtivarBussola.jsx'

// SVG local do Figma: somente a camada Ponteiro recebe o movimento.
export default function MascoteNo({ animarEntrada = true }) {
  const root = useRef(null)
  const mounted = useRef(false)
  const [phase, setPhase] = useState('splash')

  useEffect(() => {
    mounted.current = true
    const timer = setTimeout(() => {
      if (!window.isSecureContext || typeof window.DeviceOrientationEvent === 'undefined') {
        setPhase('unavailable')
      } else {
        setPhase(typeof window.DeviceOrientationEvent.requestPermission === 'function'
          ? 'permission' : 'listening')
      }
    }, animarEntrada ? 4200 : 0)
    return () => {
      mounted.current = false
      clearTimeout(timer)
    }
  }, [animarEntrada])

  useEffect(() => {
    if (phase !== 'listening') return
    const pointer = root.current?.querySelector('[id="Ponteiro"]')
    if (!pointer) return
    let previous = null
    let initialTilt = null
    let headingTravel = 0
    let current = animarEntrada ? -180 : 0
    let target = current
    let origin = current
    let frame = null
    let lastTime = null
    let received = false
    pointer.style.animation = 'none'
    pointer.style.transform = `rotate(${current}deg)`

    function draw(time) {
      const dt = lastTime === null ? 16 : Math.min(time - lastTime, 64)
      lastTime = time
      current += (target - current) * (1 - Math.exp(-dt / 110))
      pointer.style.transform = `rotate(${current}deg)`
      if (Math.abs(target - current) > .05) frame = requestAnimationFrame(draw)
      else { frame = null; lastTime = null }
    }

    function receive(event) {
      if (document.hidden) return
      const sample = orientationSample(event, window.screen.orientation?.angle ?? window.orientation ?? 0)
      if (!sample) return
      received = true
      if (initialTilt === null) {
        initialTilt = sample.tilt
        previous = sample.heading
        origin = current
      } else if (sample.heading !== null && previous !== null) {
        headingTravel -= shortestAngle(sample.heading - previous)
      }
      previous = sample.heading
      target = origin + headingTravel + Math.max(-65, Math.min(65, sample.tilt - initialTilt))
      if (frame === null) frame = requestAnimationFrame(draw)
    }

    function recalibrate() {
      initialTilt = null
      previous = null
      headingTravel = 0
      target = current
    }
    function visibilityChanged() {
      recalibrate()
      if (document.hidden && frame !== null) {
        cancelAnimationFrame(frame)
        frame = null
        lastTime = null
      }
    }

    const timeout = setTimeout(() => {
      if (!received && mounted.current) setPhase('unavailable')
    }, 6000)
    window.addEventListener('deviceorientation', receive, { passive: true })
    window.addEventListener('orientationchange', recalibrate)
    window.screen.orientation?.addEventListener('change', recalibrate)
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      clearTimeout(timeout)
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('deviceorientation', receive)
      window.removeEventListener('orientationchange', recalibrate)
      window.screen.orientation?.removeEventListener('change', recalibrate)
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [phase, animarEntrada])

  async function activate() {
    try {
      const result = await window.DeviceOrientationEvent.requestPermission()
      return result === 'granted' ? 'listening' : 'denied'
    } catch {
      return 'denied'
    }
  }

  return (
    <>
      <div ref={root} className="mn-mascot" role="img"
        aria-label="Nô, o mascote do MeuNorte"
        dangerouslySetInnerHTML={{ __html: mascoteSvg }} />
      {phase === 'permission' && (
        <BotaoAtivarBussola onActivate={activate} onFinish={setPhase} />
      )}
      {phase === 'denied' && <p className="mn-mascot-notice" role="status">
        Movimento não autorizado. Você pode continuar normalmente.
      </p>}
    </>
  )
}

