import Icone from '../../components/shared/Icone.jsx'
const SECOES = {
  areas: { titulo: 'Áreas', subtitulo: 'Seu futuro tem muitas direções.', texto: 'Em breve, explore as áreas de conhecimento e encontre possibilidades que combinam com você.', icone: 'areas' },
  faculdades: { titulo: 'Faculdades', subtitulo: 'Um lugar para o seu próximo passo.', texto: 'Em breve, conheça instituições e organize suas escolhas. As faculdades que você salvar aparecerão na sua coletânea.', icone: 'faculdades' },
  ingressos: { titulo: 'Ingressos', subtitulo: 'Há mais de um caminho para chegar lá.', texto: 'Em breve, descubra formas de ingresso e possibilidades para começar o ensino superior.', icone: 'ingressos' },
}
export default function SecaoInicial({ secao, item, navegar }) {
  const conteudo = SECOES[secao]
  return <section className="mn-section-starter"><span className="mn-i-eyebrow">EXPLORE SEU CAMINHO</span><h1>{conteudo.titulo}</h1><div className="mn-section-starter__art"><Icone nome={conteudo.icone} tamanho={72} /></div><h2>{conteudo.subtitulo}</h2><p>{item ? 'Os detalhes deste item estarão disponíveis quando esta seção estiver pronta.' : conteudo.texto}</p><span className="mn-i-tag">Em construção</span><button className="mn-i-button mn-i-button--secondary" onClick={() => navegar('perfil')}>voltar ao perfil</button></section>
}
