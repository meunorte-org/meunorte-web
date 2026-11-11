import { useEffect, useRef, useState } from 'react'
import { OPCOES_ESTUDO } from '../../data/opcoesEstudo.js'
import seletor from '../../assets/icons/seletor-data.svg'
import seletorAberto from '../../assets/icons/seletor-estudos-aberto.svg'
import './InputEstadoEstudo.css'

export default function InputEstadoEstudo({ id, value, onChange }) {
  const [aberto, setAberto] = useState(false)
  const [indiceAtivo, setIndiceAtivo] = useState(0)
  const campoRef = useRef(null)
  const botaoRef = useRef(null)
  const listaRef = useRef(null)
  const buscaRef = useRef({ texto: '', instante: 0 })
  const escolha = OPCOES_ESTUDO.find(opcao => opcao.valor === value)
  const selecionado = aberto || Boolean(escolha)

  useEffect(() => {
    if (!aberto) return
    function clicarFora(event) {
      if (!campoRef.current?.contains(event.target)) setAberto(false)
    }
    document.addEventListener('pointerdown', clicarFora)
    return () => document.removeEventListener('pointerdown', clicarFora)
  }, [aberto])

  useEffect(() => {
    if (aberto) listaRef.current?.children[indiceAtivo]?.scrollIntoView({ block: 'nearest' })
  }, [aberto, indiceAtivo])

  function abrir(indice = Math.max(0, OPCOES_ESTUDO.findIndex(opcao => opcao.valor === value))) {
    setIndiceAtivo(indice)
    setAberto(true)
    buscaRef.current = { texto: '', instante: 0 }
  }

  function escolher(indice) {
    onChange(OPCOES_ESTUDO[indice].valor)
    setAberto(false)
    botaoRef.current?.focus({ preventScroll: true })
  }

  function aoTeclar(event) {
    const { key } = event
    if (key === 'Tab') { setAberto(false); return }
    if (key === 'Escape') { event.preventDefault(); setAberto(false); return }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (aberto) escolher(indiceAtivo)
      else abrir()
      return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault()
      if (key === 'Home') { abrir(0); return }
      if (key === 'End') { abrir(OPCOES_ESTUDO.length - 1); return }
      if (!aberto) { abrir(); return }
      setIndiceAtivo(indice => (indice + (key === 'ArrowDown' ? 1 : -1) + OPCOES_ESTUDO.length) % OPCOES_ESTUDO.length)
      return
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const instante = Date.now()
      const texto = (instante - buscaRef.current.instante < 700 ? buscaRef.current.texto : '') + key
      buscaRef.current = { texto, instante }
      const simplificar = frase => frase.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      const indice = OPCOES_ESTUDO.findIndex(opcao => simplificar(opcao.texto).startsWith(simplificar(texto)))
      if (indice >= 0) { event.preventDefault(); setIndiceAtivo(indice); setAberto(true) }
    }
  }

  return (
    <div ref={campoRef} className={`mn-study-select ${aberto ? 'mn-study-select--open' : ''} ${selecionado ? 'mn-study-select--selected' : ''}`}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setAberto(false) }}>
      <input type="hidden" name="education_level" value={value} />
      <button ref={botaoRef} id={id} type="button" role="combobox" className="mn-study-select__control"
        aria-label="Situação atual de estudos" aria-required="true" aria-expanded={aberto}
        aria-haspopup="listbox" aria-controls={`${id}-opcoes`}
        aria-activedescendant={aberto ? `${id}-opcao-${indiceAtivo}` : undefined}
        onClick={() => aberto ? setAberto(false) : abrir()} onKeyDown={aoTeclar}>
        <span className="mn-study-select__label">Selecione sua situação atual</span>
        <span className="mn-study-select__value">{escolha?.texto ?? ''}</span>
        <span className="mn-study-select__selector" aria-hidden="true">
          <img className="mn-study-select__arrow-down" src={seletor} alt="" />
          <img className="mn-study-select__arrow-up" src={seletorAberto} alt="" />
        </span>
      </button>
      <ul ref={listaRef} id={`${id}-opcoes`} role="listbox" aria-label="Situação atual de estudos"
        className="mn-study-select__options" aria-hidden={!aberto} inert={!aberto}>
        {OPCOES_ESTUDO.map((opcao, indice) => (
          <li key={opcao.valor} id={`${id}-opcao-${indice}`} role="option" tabIndex={-1} aria-selected={value === opcao.valor}
            className={indice === indiceAtivo ? 'mn-study-select__option--active' : ''}
            onPointerDown={event => { if (event.pointerType === 'mouse') event.preventDefault() }}
            onPointerMove={() => setIndiceAtivo(indice)} onClick={() => escolher(indice)}>
            {opcao.texto}
          </li>
        ))}
      </ul>
    </div>
  )
}
