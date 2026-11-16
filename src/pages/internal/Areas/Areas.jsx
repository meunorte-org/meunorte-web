import { useState } from 'react'
import { areasService } from '../../../services/areasService.js'
import { personaDaArea } from '../../../data/ilustracoesAreas.js'
import SeloArea from '../../../components/shared/SeloArea.jsx'
import { Favorito, Voltar, EstadoDados } from '../../../components/shared/Exploracao.jsx'
import { useAuth } from '../../../contexts/AuthContext.js'
import usePerfil from '../../../hooks/usePerfil.js'
const areas = areasService.listar()
export default function Areas({ item, navegar }) {
  const { usuario } = useAuth()
  const { perfil, erro: erroPerfil, carregando, executar, carregar } = usePerfil(usuario)
  const [erro, setErro] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const area = areas.find(a => a.id === item)
  async function favoritar(a) { setOcupado(true); setErro(''); try { await executar('alternarFavorito', 'areas', a) } catch (e) { setErro(e.message) } finally { setOcupado(false) } }
  const favorito = a => <Favorito nome={a.nome} ativo={perfil?.areasFavoritas.some(f => f.id === a.id) ?? false} ocupado={ocupado || !perfil} onClick={() => favoritar(a)} />
  return <section className="mn-explore" key={item ?? 'lista'}>
    {erro && <p className="mn-i-error" role="alert">{erro}</p>}
    <EstadoDados carregando={carregando} erro={erroPerfil} tentar={carregar} />
    {item && !area ? <><Voltar onClick={() => navegar('areas')}>Áreas</Voltar><h1>Área não encontrada</h1><p>Volte ao catálogo para explorar outros caminhos.</p></> : area ? <>
      <Voltar onClick={() => navegar('areas')}>Todas as áreas</Voltar>
      <header className="mn-area-hero" style={{ '--area-color': area.cor }}><SeloArea id={area.id} /><p className="mn-i-eyebrow">UM CAMINHO PARA EXPLORAR</p><h1>{area.nome}</h1><img className="mn-area-persona" src={personaDaArea(area.id)} alt={`Personagem oficial de ${area.nome}`} /><div className="mn-area-hero__bottom"><span>{area.resumo}</span>{favorito(area)}</div></header>
      <p className="mn-explore-intro">{area.apresentacao}</p>
      <h2>O que você pode descobrir</h2><div className="mn-chip-list">{area.assuntos.map(x => <span className="mn-i-tag" key={x}>{x}</span>)}</div>
      <article className="mn-explore-paper"><h3>Da curiosidade à prática</h3><p>{area.atividades}</p><h3>Possibilidades de atuação</h3><p>{area.atuacao}</p></article>
      <h2>Tem a ver com seus interesses?</h2><ul className="mn-interest-list">{area.interesses.map(x => <li key={x}>{x}</li>)}</ul>
      <h2>Cursos que você pode explorar</h2><p className="mn-i-help">Exemplos de graduação. A lista definitiva será revisada pela equipe; não indica oferta em uma instituição.</p><div className="mn-chip-list">{area.cursos.map(c => <span className="mn-i-tag mn-course-chip" key={c.id}>{c.nome}</span>)}</div>
    </> : <>
      <p className="mn-i-eyebrow">CURIOSIDADE É UM BOM COMEÇO</p><h1>Explore seus caminhos</h1><p>Conheça diferentes áreas do conhecimento e descubra possibilidades para o seu futuro.</p>
      <article className="mn-test-callout"><div className="mn-test-callout__art"><SeloArea id="tecnologia" /><SeloArea id="artes" /><SeloArea id="saude" /></div><p className="mn-i-eyebrow">UM POUCO MAIS SOBRE VOCÊ</p><h2>Que tal descobrir sua área?</h2><p>Explore seus interesses e descubra áreas que podem combinar com você.</p><button className="mn-i-button" onClick={() => navegar('areas', { item: 'teste' })}>Fazer teste vocacional <span aria-hidden="true">↗</span></button></article>
      <div className="mn-explore-section-title"><h2>Conheça as áreas do conhecimento</h2><span>10 caminhos,<br />muitas possibilidades</span></div>
      <div className="mn-area-grid">{areas.map(a => <article className="mn-area-card" key={a.id} style={{ '--area-color': a.cor }}><SeloArea id={a.id} />{favorito(a)}<button className="mn-area-card__open" onClick={() => navegar('areas', { item: a.id })}><h3>{a.nome}</h3><p>{a.resumo}</p><span>Explorar área <span aria-hidden="true">↗</span></span></button></article>)}</div>
      <p className="mn-i-help">Favoritos salvos apenas neste navegador, por enquanto.</p>
    </>}
  </section>
}
