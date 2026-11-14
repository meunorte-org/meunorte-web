import './InputDigitacao.css'

export default function InputDigitacao({ id, rotulo, erro, children, animarErro = false, 'aria-describedby': descricao, ...props }) {
  const descritoPor = [descricao, erro ? `${id}-erro` : null].filter(Boolean).join(' ') || undefined
  return (
    <div className="mn-input-group">
      <div className="mn-input">
        <input {...props} id={id} placeholder=" " aria-invalid={Boolean(erro)}
          aria-describedby={descritoPor} />
        <label htmlFor={id}>{rotulo}</label>
        {children}
      </div>
      {animarErro ? (
        <div className={`mn-input-feedback ${erro ? 'mn-input-feedback--visible' : ''}`}>
          <div className="mn-input-feedback__content">
            <p className="mn-input-error" id={`${id}-erro`} role={erro ? 'alert' : undefined}>{erro}</p>
          </div>
        </div>
      ) : erro && <p className="mn-input-error" id={`${id}-erro`} role="alert">{erro}</p>}
    </div>
  )
}
