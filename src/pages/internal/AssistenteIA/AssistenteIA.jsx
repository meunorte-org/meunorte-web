import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../../contexts/AuthContext.js'
import useNoFlutuante from '../../../hooks/useNoFlutuante.js'
import useConversaIA from '../../../hooks/useConversaIA.js'
import { contextoDaTela, rotuloContexto } from '../../../domain/assistente.js'
import no from '../../../assets/images/mascote-no-estatico.svg'
import ConversaNo from './components/ConversaNo.jsx'
import './AssistenteIA.css'
export default function AssistenteIA({ rota, abrir, fechar, presente, onFechado, bloqueado, service }) {
  const { usuario } = useAuth()
  const contexto = useMemo(() => contextoDaTela(rota), [rota])
  const conversa = useConversaIA(contexto, service)
  const { botao: botaoRef, safe: safeRef, repouso, eventos, restaurar } = useNoFlutuante(usuario.id, abrir)
  const { cancelar } = conversa
  useEffect(() => {
    if (rota.assistente || !presente) return
    cancelar()
    const timer = setTimeout(onFechado, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220)
    return () => clearTimeout(timer)
  }, [rota.assistente, presente, onFechado, cancelar])
  return <>
    {createPortal(<div className="mn-internal mn-no-widget" inert={presente || bloqueado}><span ref={safeRef} className="mn-no-safe" aria-hidden="true" /><button ref={botaoRef} hidden={presente || bloqueado} className={`mn-no-float ${repouso ? 'mn-no-float--repouso' : ''}`} aria-label="Conversar com o Nô" aria-describedby="no-instrucoes" title="Conversar com o Nô. Arraste para mover. No teclado, use setas; Home restaura a posição." {...eventos}><img src={no} alt="" draggable="false" /><span aria-hidden="true">Nô</span></button><span className="mn-visually-hidden" id="no-instrucoes">Arraste para mover. Pelo teclado, use as setas para reposicionar e Home para restaurar. Enter abre a conversa.</span></div>, document.body)}
    {presente && !bloqueado && <ConversaNo conversa={conversa} contexto={rotuloContexto(contexto)} fechar={fechar} fechando={!rota.assistente} restaurarPosicao={restaurar} botaoRetorno={botaoRef} />}
  </>
}
