import './TransicaoPaginas.css'

// Mantém as duas telas durante o arrasto e preserva a identidade da tela que entra.
export default function TransicaoPaginas({ pagina, troca, duracao, children }) {
  const paginasVisiveis = troca ? [pagina, troca.destino] : [pagina]
  const classes = troca ? 'mn-app mn-app--moving mn-app--' + troca.direcao : 'mn-app'

  return (
    <div className={classes} style={{ '--mn-transition-duration': duracao + 'ms' }}>
      {paginasVisiveis.map(nome => (
        <div key={nome}
          className={nome === pagina ? 'mn-app__page' : 'mn-app__incoming'}
          aria-hidden={troca ? true : undefined}
          inert={troca ? true : undefined}>
          {children(nome)}
        </div>
      ))}
    </div>
  )
}
