import './CampoCadastro.css'
import voltar from '../../assets/icons/recuperacao-voltar.svg'

// Permanece montado entre etapas; apenas children e etapa mudam.
export default function CampoCadastro({ children, etapa, totalEtapas = 7, bloqueado = false, onConclusao, onVoltar, voltarBloqueado = false }) {
  return (
    <section className="mn-signup-panel" inert={bloqueado} aria-label="Preenchimento do cadastro">
      {onVoltar && <button type="button" className="mn-signup-panel__back" onClick={onVoltar} disabled={voltarBloqueado} aria-label="Voltar para criar senha"><img src={voltar} alt="" width="50" height="50" /></button>}
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
