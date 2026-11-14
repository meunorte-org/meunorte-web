import './CampoCadastro.css'

// Permanece montado entre etapas; apenas children e etapa mudam.
export default function CampoCadastro({ children, etapa, totalEtapas = 7, bloqueado = false, onConclusao }) {
  return (
    <section className="mn-signup-panel" inert={bloqueado} aria-label="Preenchimento do cadastro">
      <div className="mn-signup-progress" role="progressbar" aria-label="Andamento do cadastro"
        aria-valuemin={0} aria-valuemax={totalEtapas} aria-valuenow={etapa}>
        <span
          style={{ width: `${Math.min(100, Math.max(0, etapa / totalEtapas * 100))}%`, '--mn-progress-start': `${Math.max(0, (etapa - 1) / totalEtapas * 100)}%` }}
          onAnimationEnd={event => { if (event.animationName === 'mn-signup-progress-complete') onConclusao?.() }}
        />
      </div>
      {children}
    </section>
  )
}
