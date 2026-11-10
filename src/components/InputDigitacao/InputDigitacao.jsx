import './InputDigitacao.css'

export default function InputDigitacao({ id, rotulo, erro, ...props }) {
  return (
    <div className="mn-input-group">
      <div className="mn-input">
        <input {...props} id={id} placeholder=" " aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined} />
        <label htmlFor={id}>{rotulo}</label>
      </div>
      {erro && <p className="mn-input-error" id={`${id}-erro`} role="alert">{erro}</p>}
    </div>
  )
}
