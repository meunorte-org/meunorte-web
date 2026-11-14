import { useEffect, useRef, useState } from 'react'
import { DOCUMENTOS_LEGAIS, documentoPeloHash } from '../data/documentosLegais.js'

export default function useDocumentosLegais() {
  const [documento, setDocumento] = useState(documentoPeloHash)
  const documentoAnterior = useRef(documento)
  const retorno = useRef(null)

  useEffect(() => {
    function atualizar() {
      const proximo = documentoPeloHash()
      if (proximo && !documentoAnterior.current) {
        retorno.current = { y: window.scrollY, foco: document.activeElement }
      }
      documentoAnterior.current = proximo
      setDocumento(proximo)
    }
    window.addEventListener('hashchange', atualizar)
    return () => window.removeEventListener('hashchange', atualizar)
  }, [])

  useEffect(() => {
    document.title = documento ? `${DOCUMENTOS_LEGAIS[documento].titulo} | MeuNorte` : 'MeuNorte'
    const frame = requestAnimationFrame(() => {
      if (documento) {
        const alvo = document.getElementById(window.location.hash.slice(1))
        if (alvo) alvo.scrollIntoView()
        else window.scrollTo(0, 0)
        document.querySelector('.mn-legal h1')?.focus({ preventScroll: true })
      } else if (retorno.current) {
        window.scrollTo(0, retorno.current.y)
        retorno.current.foco?.focus({ preventScroll: true })
        retorno.current = null
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [documento])

  function fecharDocumento() {
    if (retorno.current) window.history.back()
    else window.location.replace('#')
  }

  return { documento, fecharDocumento }
}
