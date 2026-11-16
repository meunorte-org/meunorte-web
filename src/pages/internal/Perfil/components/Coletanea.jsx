import Icone from '../../../../components/shared/Icone.jsx'
import chevron from '../../../../assets/icons/perfil-chevron.svg'
import { AREAS } from '../../../../data/areas.js'
function Categoria({ titulo, icone, quantidade, children }) {
  return <details className="mn-collection-card"><summary><span className="mn-collection-card__icon"><Icone nome={icone} /></span><span>{titulo}<small>{quantidade ? `${quantidade} ${quantidade === 1 ? 'item' : 'itens'}` : 'Seu próximo passo cabe aqui'}</small></span><span className="mn-collection-card__chevron"><img src={chevron} alt="" /></span></summary><div className="mn-collection-card__body">{children}</div></details>
}
export default function Coletanea({ perfil, navegar, abrir, removerFavorito }) {
  return <section className="mn-collection" aria-labelledby="collection-title"><div className="mn-collection-heading"><span className="mn-i-eyebrow">GUARDE O QUE FAZ SENTIDO</span><h2 id="collection-title">Sua coletânea</h2></div>
    <Categoria titulo="Áreas favoritas" icone="areas" quantidade={perfil.areasFavoritas.length}>
      {perfil.areasFavoritas.length ? <ul>{perfil.areasFavoritas.map(area => <li key={area.id}><button className="mn-favorite-link" onClick={() => navegar('areas', { item: area.id })}><span className="mn-area-dot" style={{ background: AREAS.find(a => a.id === area.id)?.cor ?? '#334aee' }} />{area.nome}</button><button className="mn-i-text-button" onClick={() => removerFavorito('areas', area)} aria-label={`Remover ${area.nome} dos favoritos`}>remover</button></li>)}</ul> : <div className="mn-i-empty"><p>Seus interesses ainda vão ganhar muitos caminhos.</p><span>As áreas que você favoritar aparecerão aqui.</span><button className="mn-i-text-button" onClick={() => navegar('areas')}>conhecer áreas →</button></div>}
    </Categoria>
    <Categoria titulo="Faculdades salvas" icone="faculdades" quantidade={perfil.faculdadesSalvas.length}>
      {perfil.faculdadesSalvas.length ? <ul>{perfil.faculdadesSalvas.map(f => <li key={f.id}><button className="mn-favorite-link" onClick={() => navegar('faculdades', { item: f.id })}>{f.nome}</button><button className="mn-i-text-button" onClick={() => removerFavorito('faculdades', f)} aria-label={`Remover ${f.nome} das salvas`}>remover</button></li>)}</ul> : <div className="mn-i-empty"><p>Um espaço para suas próximas possibilidades.</p><span>Guarde instituições para consultar depois.</span><button className="mn-i-text-button" onClick={() => navegar('faculdades')}>explorar faculdades →</button></div>}
    </Categoria>
    <Categoria titulo="Meus objetivos" icone="objetivos" quantidade={perfil.objetivos.length}>
      {!perfil.objetivos.length && <div className="mn-i-empty"><p>Qual é o seu próximo passo?</p><span>Uma ideia de hoje pode virar um plano para amanhã.</span></div>}
      <div className="mn-goals">{perfil.objetivos.map(o => <article key={o.id}><h3>{o.titulo || 'Meu próximo passo'}</h3><p>{o.texto}</p><div><button className="mn-i-text-button" onClick={() => abrir({ tipo: 'objetivo', item: o })}>editar</button><button className="mn-i-text-button mn-i-danger" onClick={() => abrir({ tipo: 'excluirObjetivo', item: o })}>excluir</button></div></article>)}</div>
      <button className="mn-i-button mn-i-button--secondary" onClick={() => abrir({ tipo: 'objetivo' })}><Icone nome="mais" tamanho={20} />adicionar objetivo</button>
    </Categoria>
  </section>
}
