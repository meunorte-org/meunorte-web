import { INGRESSOS, REVISAO_INGRESSOS } from '../../../data/ingressos.js'
import { ACERVO_ENEM } from '../../../data/acervoEnem.js'
import Icone from '../../../components/shared/Icone.jsx'
import { Voltar, LinkOficial } from '../../../components/shared/Exploracao.jsx'
import AcervoAno from './Enem/AcervoAno.jsx'
export default function Ingressos({ item, navegar }) {
  const ingresso = INGRESSOS.find(i => i.id === item)
  return <section className="mn-explore" key={item ?? 'lista'}>
    {item?.startsWith('enem/') ? <AcervoAno ano={item.split('/')[1]} navegar={navegar} /> : ingresso ? <>
      <Voltar onClick={() => navegar('ingressos')}>Formas de ingresso</Voltar>
      <header className="mn-entry-hero" style={{ '--area-color': ingresso.cor }}><Icone nome={ingresso.icone} tamanho={48} /><p className="mn-i-eyebrow">ENTENDA SEU PRÓXIMO PASSO</p><h1>{ingresso.nome}</h1><p>{ingresso.resumo}</p></header>
      <h2>O que é?</h2><p>{ingresso.oQue}</p><h2>Como funciona?</h2><p>{ingresso.como}</p>
      <article className="mn-explore-paper"><h2>Quem pode participar?</h2><p>{ingresso.participacao}</p></article>
      <h2>Um passo de cada vez</h2><ol className="mn-entry-steps">{ingresso.etapas.map(e => <li key={e}>{e}</li>)}</ol>
      {ingresso.id === 'enem' && <><h2>Estude com provas anteriores</h2><p>Abra uma pasta e encontre o caminho para os materiais oficiais de cada edição.</p><div className="mn-enem-folders">{ACERVO_ENEM.map(e => <button className="mn-enem-folder" key={e.ano} onClick={() => navegar('ingressos', { item: `enem/${e.ano}` })}><strong>{e.ano}</strong><span>Provas e gabaritos ↗</span></button>)}</div></>}
      <h2>Dúvidas que podem surgir</h2>{ingresso.duvidas.map(([q, a]) => <details className="mn-explore-accordion" key={q}><summary>{q}</summary><p>{a}</p></details>)}
      <h2>Continue nas fontes oficiais</h2>{ingresso.links.map(l => <div key={l.url}><LinkOficial href={l.url}>{l.nome}</LinkOficial></div>)}<p className="mn-i-help">Conteúdo introdutório revisado em {REVISAO_INGRESSOS.split('-').reverse().join('/')}. Regras e condições podem mudar. Confira o edital da edição em que você pretende participar. Não exibimos calendário de inscrições.</p>
    </> : item ? <><Voltar onClick={() => navegar('ingressos')}>Formas de ingresso</Voltar><h1>Caminho não encontrado</h1><p>Volte para conhecer as formas de ingresso disponíveis.</p></> : <>
      <p className="mn-i-eyebrow">DO INTERESSE AO PRIMEIRO PASSO</p><h1>Como ingressar no ensino superior?</h1><p>Conheça os caminhos para chegar à faculdade e descubra como cada processo funciona.</p><div className="mn-entry-list">{INGRESSOS.map(i => <button className="mn-entry-card" key={i.id} style={{ '--area-color': i.cor }} onClick={() => navegar('ingressos', { item: i.id })}><Icone nome={i.icone} /><div><h2>{i.nome}</h2><p>{i.resumo}</p></div><span aria-hidden="true">↗</span></button>)}</div>
      <article className="mn-explore-paper"><h2>Cada caminho tem suas regras.</h2><p>Exame, seleção, bolsa e financiamento são coisas diferentes. Conhecer cada opção ajuda você a planejar o próximo passo.</p></article>
    </>}
  </section>
}
