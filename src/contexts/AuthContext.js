import { createContext, useContext } from 'react'
export const AuthContext = createContext(null)
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('AuthProvider ausente')
  return contexto
}
