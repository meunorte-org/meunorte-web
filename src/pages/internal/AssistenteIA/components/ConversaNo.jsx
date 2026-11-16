import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import no from '../../../../assets/images/mascote-no-estatico.svg'
import Icone from '../../../../components/shared/Icone.jsx'
import { PERGUNTAS_NO } from '../../../../data/perguntasNo.js'
import TextoMensagem from './TextoMensagem.jsx'
export default function ConversaNo({ conversa, contexto, fechar, fechando, restaurarPosicao, botaoRetorno }) {
  const modal = useRef(null), lista = useRef(null), campo = useRef(null), seguir = useRef(true)
  const { mensagens, rascunho, setRascunho, situacao, enviar, cancelar, limpar, incluirContexto, setIncluirContexto, configurado } = conversa
  const carregando = situacao.tipo === 'enviando'
  useEffect(() => {
    const retorno = botaoRetorno.current
    const y = window.scrollY, nomes = ['position', 'top', 'width', 'overflow'], estilos = nomes.map(n => [n, document.body.style[n]])
    Object.assign(document.body.style, { position: 'fixed', top: `${-y}px`, width: '100%', overflow: 'hidden' })
    function ajustar() { const vv = window.visualViewport; modal.current?.style.setProperty('--no-altura', `${vv?.height ?? window.innerHeight}px`); modal.current?.style.setProperty('--no-topo', `${vv?.offsetTop ?? 0}px`); modal.current?.style.setProperty('--no-esquerda', `${vv?.offsetLeft ?? 0}px`); modal.current?.style.setProperty('--no-largura', `${vv?.width ?? window.innerWidth}px`) }
    ajustar(); modal.current.focus({ preventScroll: true })
    window.addEventListener('resize', ajustar); window.visualViewport?.addEventListener('resize', ajustar); window.visualViewport?.addEventListener('scroll', ajustar)
    return () => { window.removeEventListener('resize', ajustar); window.visualViewport?.removeEventListener('resize', ajustar); window.visualViewport?.removeEventListener('scroll', ajustar); for (const [n, v] of estilos) document.body.style[n] = v; window.scrollTo({ top: y, behavior: 'instant' }); requestAnimationFrame(() => retorno?.focus({ preventScroll: true })) }
  }, [botaoRetorno])
  useLayoutEffect(() => { if (campo.current) { campo.current.style.height = 'auto'; campo.current.style.height = `${Math.min(140, Math.max(48, campo.current.scrollHeight))}px` } }, [rascunho])
  useEffect(() => { if (mensagens.length && seguir.current && lista.current) lista.current.scrollTop = lista.current.scrollHeight }, [mensagens, situacao.tipo])
  function submeter(e) { e.preventDefault(); seguir.current = true; enviar() }
  function teclado(e) {
    if (e.key === 'Escape' && !fechando) { e.preventDefault(); fechar(); return }
    if (e.key !== 'Tab') return
    const itens = [...modal.current.querySelectorAll('button:not(:disabled), textarea:not(:disabled), input:not(:disabled), a[href], summary')].filter(n => n.getClientRects().length)
    const primeiro = itens[0], ultimo = itens.at(-1)
    if (!primeiro) { e.preventDefault(); return }
    if (e.shiftKey && [primeiro, modal.current].includes(document.activeElement)) { e.preventDefault(); ultimo.focus() }
    else if (!e.shiftKey && [ultimo, modal.current].includes(document.activeElement)) { e.preventDefault(); primeiro.focus() }
  }
  return createPortal(<div className="mn-internal mn-no-chat" role="dialog" aria-modal="true" aria-labelledby="no-titulo" ref={modal} tabIndex={-1} onKeyDown={teclado}>
    <section className={`mn-no-panel ${fechando ? 'mn-no-panel--saindo' : ''}`} inert={fechando}>
      <header className="mn-no-header"><button className="mn-i-icon-button" aria-label="Voltar à página anterior" onClick={fechar}><Icone nome="voltar" /></button><img src={no} alt="" /><div><h1 id="no-titulo">Converse com o Nô</h1><span>Seu companheiro de descobertas</span></div><details className="mn-no-options"><summary aria-label="Opções da conversa"><Icone nome="ajustes" /></summary><div><label><input type="checkbox" checked={incluirContexto} onChange={e => setIncluirContexto(e.target.checked)} />Usar a seção atual como contexto</label><p>{contexto}. Não inclui dados do seu Perfil ou respostas do teste.</p><button className="mn-i-text-button" onClick={restaurarPosicao}>Restaurar posição do Nô</button><button className="mn-i-text-button" disabled={carregando || (!mensagens.length && !rascunho)} onClick={limpar}>Limpar conversa deste acesso</button></div></details></header>
      <div className="mn-no-history" ref={lista} onScroll={() => { const el = lista.current; seguir.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100 }}>
        {!configurado && <p className="mn-no-unavailable">O Nô ainda está sendo conectado à IA da equipe. Por enquanto, nenhuma pergunta é enviada.</p>}
        {!mensagens.length && <section className="mn-no-welcome"><img src={no} alt="Nô, mascote do MeuNorte" /><p className="mn-i-eyebrow">UM NORTE PARA SUAS DÚVIDAS</p><h2>Como posso te ajudar?</h2><p>Estou aqui para te ajudar a explorar cursos, faculdades e caminhos para o ensino superior.</p><div className="mn-no-suggestions">{PERGUNTAS_NO.slice(0, 3).map(p => <button key={p} onClick={() => { setRascunho(p); campo.current?.focus() }}>{p}<span aria-hidden="true">↗</span></button>)}</div><details className="mn-no-more"><summary>Outras perguntas para começar</summary><div className="mn-no-suggestions">{PERGUNTAS_NO.slice(3).map(p => <button key={p} onClick={() => { setRascunho(p); campo.current?.focus() }}>{p}</button>)}</div></details></section>}
        <div className="mn-no-messages" role="log" aria-label="Mensagens da conversa" aria-live="polite" aria-relevant="additions text">{mensagens.map(m => <article className={`mn-no-message mn-no-message--${m.papel}`} key={`${m.papel}:${m.id}`}><span>{m.papel === 'usuario' ? 'Você' : 'Nô'}</span><TextoMensagem texto={m.texto} />{m.status === 'falhou' && <small>{m.motivo === 'nao_configurado' ? 'Não enviada' : 'Sem resposta confirmada'}</small>}</article>)}</div>
        {carregando && <p role="status" className="mn-no-loading">Aguardando resposta do Nô… <button className="mn-i-text-button" onClick={cancelar}>Cancelar envio</button></p>}
        {situacao.tipo === 'erro' && <div className="mn-no-error" role="alert"><p>{situacao.erro}</p>{situacao.codigo !== 'nao_configurado' && <button className="mn-i-text-button" onClick={() => { seguir.current = true; enviar(situacao.tentativa.texto, situacao.tentativa) }}>Tentar novamente</button>}</div>}
      </div>
      <form className="mn-no-composer" onSubmit={submeter}><label className="mn-visually-hidden" htmlFor="no-mensagem">Sua pergunta para o Nô</label><div><textarea ref={campo} id="no-mensagem" placeholder="Escreva sua pergunta…" value={rascunho} onChange={e => setRascunho(e.target.value)} maxLength={2000} rows={1} enterKeyHint="send" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (!carregando) { seguir.current = true; enviar() } } }} /><button className="mn-i-icon-button" type="submit" disabled={carregando || !rascunho.trim()} aria-label="Enviar mensagem"><span aria-hidden="true">↑</span></button></div><p>{rascunho.length > 1600 ? `${rascunho.length}/2.000 · ` : ''}Respostas podem conter erros. Confira as fontes oficiais.</p><span className="mn-visually-hidden" role="status">{carregando ? 'Enviando pergunta.' : situacao.tipo === 'pronto' ? 'Resposta recebida.' : ''}</span></form>
    </section>
  </div>, document.body)
}
