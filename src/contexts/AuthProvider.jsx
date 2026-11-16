import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { servicoAuth } from '../services/auth.js'
import { AuthContext } from './AuthContext.js'

export default function AuthProvider({ children }) {
  const [estado, setEstado] = useState({ usuario: null, carregando: Boolean(supabase), erro: '' })
  const [restaurando, setRestaurando] = useState(Boolean(supabase))
  const sequencia = useRef(0)
  const atualizar = useCallback(async () => {
    const numero = ++sequencia.current
    try {
      if (!supabase) return
      const sessao = await supabase.auth.getSession()
      if (sessao.error) throw sessao.error
      if (!sessao.data.session) { if (numero === sequencia.current) setEstado({ usuario: null, carregando: false, erro: '' }); return }
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      if (numero === sequencia.current) setEstado({ usuario: data.user?.email_confirmed_at ? data.user : null, carregando: false, erro: '' })
    } catch { if (numero === sequencia.current) setEstado({ usuario: null, carregando: false, erro: 'Não foi possível verificar sua sessão. Confira sua conexão.' }) }
    finally { if (numero === sequencia.current) setRestaurando(false) }
  }, [])
  useEffect(() => {
    const controle = sequencia
    let ativo = true
    let timer
    const assinatura = supabase?.auth.onAuthStateChange((evento, sessao) => {
      if (evento === 'SIGNED_OUT') {
        sequencia.current++
        setRestaurando(false)
        setEstado({ usuario: null, carregando: false, erro: '' })
      } else if (['INITIAL_SESSION', 'SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED', 'PASSWORD_RECOVERY'].includes(evento)) {
        if (['SIGNED_IN', 'PASSWORD_RECOVERY'].includes(evento)) setEstado(anterior => anterior.usuario?.id === sessao?.user?.id ? anterior : { usuario: null, carregando: true, erro: '' })
        clearTimeout(timer)
        timer = setTimeout(() => { if (ativo) atualizar() }, 0)
      }
    })
    return () => { ativo = false; controle.current++; clearTimeout(timer); assinatura?.data.subscription.unsubscribe() }
  }, [atualizar])
  async function atualizarNome(nome) {
    await servicoAuth.atualizarNome(nome)
    await atualizar()
  }
  return <AuthContext.Provider value={{ ...estado, restaurando, atualizar, atualizarNome, sair: servicoAuth.sair }}>{children}</AuthContext.Provider>
}
