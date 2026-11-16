import { useEffect, useState } from 'react'
import { faculdadesService } from '../../../services/faculdadesService.js'
import { useAuth } from '../../../contexts/AuthContext.js'
import usePerfil from '../../../hooks/usePerfil.js'
import Icone from '../../../components/shared/Icone.jsx'
import { EstadoDados, Favorito, LinkOficial, Voltar } from '../../../components/shared/Exploracao.jsx'
export default function Faculdades({ rota, navegar, service = faculdadesService }) {
  const { usuario } = useAuth()
  const { perfil, executar, erro: erroPerfil, carregar: recarregarPerfil } = usePerfil(usuario)
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [feedback, setFeedback] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [tentativa, setTentativa] = useState(0)
  const chave = `${rota.item ?? ''}|${rota.busca}|${rota.tipo}|${tentativa}`
  useEffect(() => {
    let ativo = true
    const pedido = rota.item ? service.consultar(rota.item) : service.pesquisar({ busca: rota.busca, tipo: rota.tipo })
    pedido.then(valor => { if (ativo) { setDados({ chave, valor }); setErro('') } }).catch(() => { if (ativo) { setDados({ chave, valor: null }); setErro('Não conseguimos consultar o catálogo. Tente novamente.') } })
    return () => { ativo = false }
  }, [chave, rota.item, rota.busca, rota.tipo, service])
  const carregando = dados?.chave !== chave
  const valor = carregando ? null : dados.valor
  async function favoritar(i) { setOcupado(true); setFeedback(''); try { await executar('alternarFavorito', 'faculdades', i); setFeedback('Sua coletânea foi atualizada neste navegador.') } catch (e) { setFeedback(e.message) } finally { setOcupado(false) } }
  const favorito = i => <Favorito nome={i.nome} ativo={perfil?.faculdadesSalvas.some(f => f.id === i.id) ?? false} ocupado={ocupado || !perfil} onClick={() => favoritar(i)} />
  const mudarFiltro = filtros => navegar('faculdades', { substituir: true, ...filtros })
  return <section className="mn-explore" key={rota.item ?? 'lista'}>
    {feedback && <p role="status" className="mn-quiz-status">{feedback}</p>}
    {erroPerfil && <div className="mn-i-error" role="alert"><p>{erroPerfil}</p><button className="mn-i-text-button" onClick={recarregarPerfil}>Tentar carregar favoritos novamente</button></div>}
    {rota.item ? <>
      <Voltar onClick={() => navegar('faculdades')}>Resultados da pesquisa</Voltar>
      <EstadoDados carregando={carregando} erro={erro} tentar={() => setTentativa(x => x + 1)} />
      {!carregando && !erro && (!valor ? <><h1>Instituição ainda não disponível</h1><p>Os detalhes dependem do catálogo que está sendo preparado pela equipe. Seus favoritos são preservados.</p></> : <>
        <div className="mn-college-identity">{valor.imagem ? <img src={valor.imagem} alt={`Logo de ${valor.nome}`} /> : <Icone nome="faculdades" tamanho={64} />}{favorito(valor)}</div><span className="mn-i-tag">{valor.tipo === 'publica' ? 'Pública' : 'Privada'}</span><h1>{valor.nome}</h1><p>{valor.cidade}</p><h2>Sobre a instituição</h2><p>{valor.descricao || 'Apresentação ainda não cadastrada.'}</p><p>{valor.endereco || 'Endereço ainda não informado.'}</p>
        <h2>Cursos disponíveis no catálogo</h2>{valor.ofertas.length ? valor.ofertas.map(o => <article className="mn-explore-paper" key={o.id}><h3>{o.curso?.nome ?? 'Curso em revisão'}</h3><p>{o.modalidade || 'Modalidade não informada'}</p><h4>Formas de ingresso confirmadas</h4>{o.ingressos?.length ? <div className="mn-chip-list">{o.ingressos.map(id => <button className="mn-i-tag mn-course-chip" key={id} onClick={() => navegar('ingressos', { item: id })}>{id.toLocaleUpperCase('pt-BR')}</button>)}</div> : <p className="mn-i-help">Nenhuma forma de ingresso confirmada nesta oferta.</p>}{o.mensalidade != null && <p>Mensalidade informada: {typeof o.mensalidade === 'number' ? o.mensalidade.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : o.mensalidade}</p>}{o.bolsas && <p>Bolsas: {o.bolsas}</p>}{o.financiamentos && <p>Financiamentos: {o.financiamentos}</p>}{o.fonte && <LinkOficial href={o.fonte}>Conferir oferta na fonte</LinkOficial>}</article>) : <p>Nenhuma oferta cadastrada.</p>}
        {valor.informacoesAdicionais && <p>{valor.informacoesAdicionais}</p>}{valor.site && <LinkOficial href={valor.site}>Site oficial da instituição</LinkOficial>}{valor.links?.map(l => <LinkOficial href={l.url} key={l.url}>{l.nome}</LinkOficial>)}<p className="mn-i-help">Confirme disponibilidade, valores e condições diretamente com a instituição. {valor.verificadoEm && `Cadastro verificado em ${valor.verificadoEm}.`}</p>
      </>)}
    </> : <>
      <p className="mn-i-eyebrow">SEU FUTURO, MAIS PERTO</p><h1>Encontre sua faculdade</h1><p>Pesquise um curso e descubra onde você pode estudá-lo em Vitória da Conquista.</p>
      <div className="mn-college-search"><label htmlFor="curso-busca">Qual curso desperta sua curiosidade?</label><input id="curso-busca" type="search" placeholder="Ex.: Psicologia" value={rota.busca} onChange={e => mudarFiltro({ busca: e.target.value })} /><fieldset><legend>Tipo de instituição</legend><div className="mn-college-filters">{[['todas', 'Todas'], ['publica', 'Públicas'], ['privada', 'Privadas']].map(([id, nome]) => <label key={id} className={rota.tipo === id ? 'selecionada' : ''}><input type="radio" name="tipo-faculdade" value={id} checked={rota.tipo === id} onChange={() => mudarFiltro({ tipo: id })} />{nome}</label>)}</div></fieldset>{(rota.busca || rota.tipo !== 'todas') && <button className="mn-i-text-button" onClick={() => mudarFiltro({ busca: '', tipo: 'todas' })}>Limpar pesquisa e filtros</button>}</div>
      <EstadoDados carregando={carregando} erro={erro} tentar={() => setTentativa(x => x + 1)} />
      {!carregando && !erro && <><p className="mn-i-help" role="status">{valor?.instituicoes.length ?? 0} instituições encontradas</p>{valor?.instituicoes.length ? valor.instituicoes.map(i => <article className="mn-college-card" key={i.id}><div className="mn-college-identity">{i.imagem ? <img src={i.imagem} alt={`Logo de ${i.nome}`} loading="lazy" /> : <Icone nome="faculdades" tamanho={40} />}{favorito(i)}</div><span className="mn-i-tag">{i.tipo === 'publica' ? 'Pública' : 'Privada'}</span><button className="mn-college-open" onClick={() => navegar('faculdades', { item: i.id })}><h2>{i.nome}</h2><p>{i.cidade}</p><p>{i.ofertas.map(o => o.curso?.nome).filter(Boolean).join(' · ') || 'Ofertas ainda não cadastradas'}</p><span>Conhecer instituição ↗</span></button></article>) : <div className="mn-college-empty"><Icone nome="faculdades" tamanho={56} /><h2>{valor?.status === 'pendente' ? 'Estamos preparando esse caminho.' : 'Ainda não encontramos esse curso.'}</h2><p>{valor?.status === 'pendente' ? 'O catálogo de instituições e cursos de Vitória da Conquista está em preparação. Sua pesquisa e os filtros estão prontos para receber os dados verificados da equipe.' : 'Tente outro nome ou limpe os filtros. A ausência no catálogo não significa que o curso não exista na cidade.'}</p>{rota.busca && <p className="mn-i-help">Pesquisa: “{rota.busca}”</p>}</div>}</>}
      <p className="mn-i-help">{valor?.status === 'pendente' ? 'As ofertas e a sincronização com o Supabase ainda serão integradas. Nenhuma disponibilidade é presumida.' : 'Favoritos salvos neste navegador. Confirme as condições e ofertas nas fontes oficiais.'}</p>
    </>}
  </section>
}
