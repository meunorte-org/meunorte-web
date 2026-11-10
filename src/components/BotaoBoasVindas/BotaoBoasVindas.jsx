import './BotaoBoasVindas.css'

export default function BotaoBoasVindas({
  children,
  variante,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={`mn-welcome-button mn-welcome-button--${variante} ${className}`.trim()}
    >
      <span className="mn-welcome-button__surface">{children}</span>
    </button>
  )
}
