import { DOCUMENTOS_LEGAIS } from '../../data/documentosLegais.js'
import './DocumentoLegal.css'

// Substituir a entrada de leitura mantém o Voltar ligado à tela de origem.
function navegarDocumento(event) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  window.location.replace(event.currentTarget.getAttribute('href'))
}

export default function DocumentoLegal({ slug, onVoltar }) {
  const documento = DOCUMENTOS_LEGAIS[slug]
  const outro = DOCUMENTOS_LEGAIS[documento.outro]

  return (
    <main className="mn-legal" aria-labelledby="legal-title">
      <header className="mn-legal-brand">
        <div className="mn-legal-brand__content">
          <img src={`${import.meta.env.BASE_URL}meunorte-icon.png`} width="56" height="56" alt="Nô, mascote do MeuNorte" />
          <span className="mn-legal-wordmark">MeuNorte</span>
        </div>
      </header>
      <article className="mn-legal-content">
        <div className="mn-legal-tools">
          <button type="button" className="mn-legal-back" onClick={onVoltar}>← Voltar</button>
          <button type="button" className="mn-legal-print" onClick={() => window.print()}>Imprimir ou salvar em PDF</button>
        </div>
        <p className="mn-legal-eyebrow">Informações do MeuNorte</p>
        <h1 tabIndex={-1} id="legal-title">{documento.titulo}</h1>
        <p className="mn-legal-meta">Versão 0.1 · Revisão de 14 de novembro de 2026</p>
        <p className="mn-legal-intro">{documento.descricao}</p>
        <p className="mn-legal-draft"><strong>Versão em revisão.</strong> Alguns detalhes ainda estão sendo definidos e aparecem indicados no texto. A vigência será informada após a revisão final, antes da abertura dos cadastros.</p>
        <nav className="mn-legal-index" aria-label={`Índice de ${documento.titulo}`}>
          <h2>O que você encontra aqui</h2>
          <ol>{documento.secoes.map((secao, indice) => (
            <li key={secao.titulo}><a href={`#${slug}/secao-${indice + 1}`} onClick={navegarDocumento}>{secao.titulo}</a></li>
          ))}</ol>
        </nav>
        {documento.secoes.map((secao, indice) => (
          <section key={secao.titulo} id={`${slug}/secao-${indice + 1}`} className="mn-legal-section">
            <h2>{indice + 1}. {secao.titulo}</h2>
            {secao.paragrafos.map(paragrafo => <p key={paragrafo}>{paragrafo}</p>)}
            {secao.pendencia && <p className="mn-legal-pending"><strong>Em definição:</strong> {secao.pendencia}</p>}
          </section>
        ))}
        <section className="mn-legal-contact" aria-labelledby="legal-contact-title">
          <h2 id="legal-contact-title">Fale com a equipe</h2>
          <p>Dúvidas sobre o MeuNorte ou sobre seus dados?</p>
          <a href="mailto:admeunorte@gmail.com">admeunorte@gmail.com</a>
        </section>
        <nav className="mn-legal-related" aria-label="Continuar a leitura">
          <a href={`#${documento.outro}`} onClick={navegarDocumento}>Ler {outro.titulo === 'Termos de Uso' ? 'os' : 'a'} {outro.titulo} →</a>
          <button type="button" className="mn-legal-back" onClick={onVoltar}>Voltar à navegação</button>
        </nav>
        <details className="mn-legal-references">
          <summary>Referências para a revisão</summary>
          <ul>
            <li><a href="https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html" target="_blank" rel="noreferrer">Lei Geral de Proteção de Dados Pessoais</a></li>
            <li><a href="https://www.gov.br/anpd/pt-br/assuntos/eca-digital/" target="_blank" rel="noreferrer">ANPD e proteção de crianças e adolescentes</a></li>
            <li><a href="https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados" target="_blank" rel="noreferrer">ANPD e transferências internacionais de dados</a></li>
            <li><a href="https://supabase.com/docs/guides/auth/password-security" target="_blank" rel="noreferrer">Supabase e proteção das senhas</a></li>
          </ul>
        </details>
        <footer className="mn-legal-footer">MeuNorte · Equipe MeuNorte<br />Documento em revisão · Versão 0.1</footer>
      </article>
    </main>
  )
}
