import './InputDigitacao.css'

export default function InputDigitacao({ id, rotulo, erro, children, 'aria-describedby': descricao, ...props }) {
  const descritoPor = [descricao, erro ? `${id}-erro` : null].filter(Boolean).join(' ') || undefined
  return (
    <div className="mn-input-group">
      <div className="mn-input">
        <input {...props} id={id} placeholder=" " aria-invalid={Boolean(erro)}
          aria-describedby={descritoPor} />
        <label htmlFor={id}>{rotulo}</label>
        {children}
      </div>
      {erro && <p className="mn-input-error" id={`${id}-erro`} role="alert">{erro}</p>}
    </div>
  )
}
