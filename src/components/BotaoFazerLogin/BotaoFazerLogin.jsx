import BotaoBoasVindas from '../BotaoBoasVindas/BotaoBoasVindas.jsx'

export default function BotaoFazerLogin({ children = 'fazer login', ...props }) {
  return (
    <BotaoBoasVindas {...props} variante="login">
      {children}
    </BotaoBoasVindas>
  )
}
