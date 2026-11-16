import { useEffect, useRef, useState } from 'react'
import { PERGUNTAS } from '../../../data/perguntasVocacionais.js'
import { areasService } from '../../../services/areasService.js'
import { personaDaArea } from '../../../data/ilustracoesAreas.js'
import { gerarImagemResultado, gerarImagemEmpate, baixarImagem, compartilharImagem } from '../../../services/exportarResultado.js'
import { Voltar } from '../../../components/shared/Exploracao.jsx'
import SeloArea from '../../../components/shared/SeloArea.jsx'
import Icone from '../../../components/shared/Icone.jsx'
import { useAuth } from '../../../contexts/AuthContext.js'
import usePerfil from '../../../hooks/usePerfil.js'
export default function TesteVocacional({ navegar, estado, setEstado }) {
  const { usuario } = useAuth()
  const { executar } = usePerfil(usuario)
  const [ocupado, setOcupado] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const titulo = useRef(null)
  const [blobPreparado, setBlobPreparado] = useState(null)
  const { fase, indice, respostas, resultado } = estado
  useEffect(() => { titulo.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }) }, [fase, indice])
  const definir = dados => setEstado(anterior => ({ ...anterior, ...dados }))
  async function terminar() {
    setOcupado(true); setMensagem(''); setBlobPreparado(null)
    try { const perfil = await executar('salvarResultado', respostas); definir({ fase: 'resultado', resultado: perfil.resultadoAfinidade }); window.scrollTo({ top: 0, behavior: 'instant' }) }
    catch (e) { setMensagem(e.message) } finally { setOcupado(false) }
  }
  async function preparar(area) {
    setOcupado(true); setMensagem('')
    try { const blob = area ? await gerarImagemResultado(area) : await gerarImagemEmpate(resultado.principais.map(id => areasService.consultar(id))); setBlobPreparado({ id: area?.id ?? 'empate', blob }); setMensagem('Imagem pronta! Escolha baixar ou compartilhar.'); definir({ imagem: area?.id ?? 'empate' }) }
    catch (e) { setMensagem(e.message) } finally { setOcupado(false) }
  }
  async function exportar(area, compartilhar) {
    const preparado = blobPreparado
    if (preparado?.id !== (area?.id ?? 'empate')) return preparar(area)
    try { const nome = `meunorte-${area?.id ?? 'empate'}.png`; const acao = compartilhar ? await compartilharImagem(preparado.blob, nome) : (baixarImagem(preparado.blob, nome), 'baixado'); setMensagem(acao === 'baixado' ? 'PNG preparado para salvar no dispositivo.' : 'Resultado compartilhado.') }
    catch (e) { if (e.name !== 'AbortError') setMensagem('Não foi possível compartilhar. Você pode baixar o PNG.') }
  }
  const reiniciar = () => { setBlobPreparado(null); setMensagem(''); setEstado({ fase: 'perguntas', indice: 0, respostas: [], resultado: null, imagem: null }) }
  const area = resultado?.areaPrincipal ? areasService.consultar(resultado.areaPrincipal) : null
  return <section className="mn-explore mn-quiz">
    <Voltar onClick={() => navegar('areas')}>Explorar áreas</Voltar>
    {mensagem && <p className="mn-quiz-status" role="status">{mensagem}</p>}
    {fase === 'intro' ? <><div className="mn-quiz-intro-art"><SeloArea id="artes" /><SeloArea id="tecnologia" /><SeloArea id="ambiente" /></div><p className="mn-i-eyebrow">UMA PAUSA PARA SE CONHECER</p><h1 ref={titulo} tabIndex={-1}>Seu próximo caminho começa com uma pergunta.</h1><p>São 10 situações para explorar seus interesses. Não há resposta certa e você pode voltar para mudar uma escolha.</p><div className="mn-explore-paper"><h2>Do seu jeito</h2><p>Escolha o que mais desperta sua curiosidade. Se nada combinar, tudo bem: existe uma opção neutra.</p><p className="mn-i-help">É uma atividade de autoconhecimento, não uma avaliação psicológica ou um diagnóstico de carreira.</p></div><button className="mn-i-button" onClick={() => definir({ fase: 'perguntas' })}>Vamos começar ↗</button></> : fase === 'perguntas' ? <>
      <div className="mn-quiz-progress"><span>Pergunta {indice + 1} de {PERGUNTAS.length}</span><progress aria-label="Progresso do teste" max={PERGUNTAS.length} value={indice + 1} /></div>
      <form onSubmit={e => { e.preventDefault(); if (!respostas[indice] || ocupado) return; if (indice === PERGUNTAS.length - 1) terminar(); else definir({ indice: indice + 1 }) }}>
        <h1 ref={titulo} tabIndex={-1} className="mn-quiz-question" key={indice}>{PERGUNTAS[indice].texto}</h1>
        <fieldset className="mn-quiz-options" key={PERGUNTAS[indice].id}><legend className="mn-visually-hidden">Escolha uma alternativa</legend>{[...PERGUNTAS[indice].alternativas, { id: 'neutra', texto: 'Nenhuma dessas opções me interessa.' }].map((a, i) => <label key={a.id} className={respostas[indice] === a.id ? 'selecionada' : ''}><input type="radio" name="resposta" value={a.id} checked={respostas[indice] === a.id} disabled={ocupado} onChange={() => { const novas = [...respostas]; novas[indice] = a.id; definir({ respostas: novas }) }} /><span aria-hidden="true">{i === 3 ? '—' : String.fromCharCode(65 + i)}</span>{a.texto}</label>)}</fieldset>
        <div className="mn-quiz-actions"><button className="mn-i-text-button" type="button" disabled={ocupado} onClick={() => definir(indice ? { indice: indice - 1 } : { fase: 'intro' })}>Voltar</button><button className="mn-i-button" disabled={!respostas[indice] || ocupado}>{ocupado ? 'Reunindo suas escolhas…' : indice === 9 ? 'Descobrir caminhos' : 'Continuar →'}</button></div>
      </form>
    </> : <>
      <header className="mn-result-hero" style={{ '--area-color': area?.cor ?? '#334aee' }}>{area ? <><p className="mn-i-eyebrow">SUAS ESCOLHAS ABREM POSSIBILIDADES</p><img src={personaDaArea(area.id)} alt={`Personagem oficial de ${area.nome}`} /><SeloArea id={area.id} /><h1 ref={titulo} tabIndex={-1}>Seu caminho encontra {area.nome}!</h1></> : <><div className="mn-quiz-intro-art mn-quiz-intro-art--resultado">{resultado?.suficiente ? resultado.principais.map(id => <SeloArea id={id} key={id} />) : <Icone nome="areas" tamanho={72} />}</div><h1 ref={titulo} tabIndex={-1}>{resultado?.suficiente ? 'Mais de um caminho chamou sua atenção!' : 'Seu caminho ainda está em descoberta.'}</h1></>}</header>
      <p className="mn-explore-intro">{area ? `Pelas suas escolhas, você parece se interessar por possibilidades de ${area.nome}. Estas situações despertaram sua curiosidade:` : resultado?.suficiente ? 'Estas áreas ficaram empatadas nas suas escolhas. Explore cada uma, sem precisar decidir agora.' : 'Suas respostas ainda não trouxeram informação suficiente para destacar uma área. Você pode explorar o catálogo ou tentar novamente, no seu tempo.'}</p>
      {area && <><ul className="mn-interest-list">{resultado.evidencias?.[area.id]?.map(texto => <li key={texto}>{texto}</li>)}</ul><h2>Nesse caminho, vale explorar…</h2><div className="mn-chip-list">{area.interesses.map(x => <span className="mn-i-tag" key={x}>{x}</span>)}</div><button className="mn-i-button" onClick={() => navegar('areas', { item: area.id })}>Explorar {area.nome} ↗</button></>}
      {!area && resultado?.principais.map(id => { const a = areasService.consultar(id); return <button className="mn-result-related" key={id} onClick={() => navegar('areas', { item: id })}><SeloArea id={id} /><span>{a.nome}</span><span aria-hidden="true">↗</span></button> })}
      {!!resultado?.secundarias.length && <><h2>Outros interesses que apareceram</h2>{resultado.secundarias.map(id => <button className="mn-result-related" key={id} onClick={() => navegar('areas', { item: id })}><SeloArea id={id} />{areasService.consultar(id).nome}<span aria-hidden="true">↗</span></button>)}</>}
      <details className="mn-explore-accordion"><summary>Como chegamos a esse resultado?</summary><p>Cada escolha soma um ponto para a área relacionada. Todas as áreas aparecem três vezes. Respostas neutras não pontuam. Só destacamos afinidades com pelo menos quatro escolhas não neutras e dois pontos na área líder. Empates são apresentados juntos.</p><p>Este é um exercício exploratório, sem validação psicológica. Não avalia habilidades nem determina uma profissão.</p></details>
      {resultado?.suficiente && <article className="mn-explore-paper"><h2>Leve essa descoberta com você</h2><p>Uma imagem com a identidade {area ? 'da sua área' : 'das áreas empatadas'}, sem seus dados pessoais.</p>{blobPreparado?.id === (area?.id ?? 'empate') ? <div className="mn-chip-list"><button className="mn-i-button" onClick={() => exportar(area, false)}>Baixar PNG</button><button className="mn-i-button mn-i-button--secondary" onClick={() => exportar(area, true)}>Compartilhar</button></div> : <button className="mn-i-button" disabled={ocupado} onClick={() => preparar(area)}>{ocupado ? 'Preparando imagem…' : 'Salvar ou compartilhar'}</button>}</article>}
      <button className="mn-i-text-button" onClick={reiniciar}>Refazer o teste</button><p className="mn-i-help">Resultado salvo neste navegador. A tag de afinidade respeita os ajustes e o limite de tags do seu Perfil. Empates não escolhem uma área principal automaticamente.</p>
    </>}
  </section>
}
