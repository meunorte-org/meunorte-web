import { ACERVO_ENEM, ACERVO_OFICIAL } from '../../../../data/acervoEnem.js'
import { Voltar, LinkOficial } from '../../../../components/shared/Exploracao.jsx'
export default function AcervoAno({ ano, navegar }) {
  const edicao = ACERVO_ENEM.find(e => e.ano === Number(ano))
  return <>
    <Voltar onClick={() => navegar('ingressos', { item: 'enem' })}>ENEM e outras edições</Voltar>
    <p className="mn-i-eyebrow">ARQUIVO DE DESCOBERTAS</p><h1>ENEM {ano}</h1>
    {edicao ? <>
      <p>Escolha o dia e abra um caderno para acessar seus materiais. Confira a cor e a versão antes de usar o gabarito.</p>
      {edicao.materiais.length ? [1, 2].map(dia => <section key={dia} aria-label={`${dia}º dia de aplicação`}>
        <h2>{dia}º dia</h2>
        {edicao.materiais.filter(m => m.dia === dia).map(m => <details className="mn-enem-material" key={m.id}>
          <summary>Caderno {m.caderno} · {m.cor}</summary><p>{m.modalidade}</p>
          {m.documentos.map(d => <div key={`${d.url}-${d.nome}`}><LinkOficial href={d.url}>{d.nome === 'Prova' ? 'Abrir prova oficial' : d.nome === 'Gabarito' ? 'Abrir gabarito oficial' : d.nome}</LinkOficial></div>)}
        </details>)}
      </section>) : <div className="mn-explore-paper"><h2>Materiais no acervo do Inep</h2><p>Os arquivos desta edição ainda precisam ser conferidos.</p></div>}
      <p className="mn-i-help">{edicao.pendencia}</p><LinkOficial href={edicao.fonte}>Todas as versões de {ano} no Inep</LinkOficial>
      <p className="mn-i-help">Mantemos os arquivos como foram publicados, incluindo versões de atendimento especializado. Links conferidos em 16/11/2026.</p>
    </> : <><p>Edição ainda não organizada no MeuNorte.</p><LinkOficial href={ACERVO_OFICIAL}>Consultar acervo do Inep</LinkOficial></>}
  </>
}
