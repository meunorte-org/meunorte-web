import { createClient } from '@supabase/supabase-js'
import { acompanharRecuperacao } from './acompanharRecuperacao.js'

const ambiente = import.meta.env ?? {}
const url = ambiente.VITE_SUPABASE_URL?.trim()
const chave = ambiente.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

// Capturar antes de o SDK consumir e limpar os parâmetros de autenticação.
const parametros = new URLSearchParams(globalThis.location?.search ?? '')
const fragmento = new URLSearchParams(globalThis.location?.hash?.slice(1) ?? '')
export const retornoAuthInicial = {
  ativo: parametros.get('auth') === 'confirmacao',
  areaInterna: parametros.get('area') === 'interna',
  recuperacao: parametros.get('auth') === 'recuperacao' || fragmento.get('type') === 'recovery',
  login: parametros.get('login') === '1',
  erro: parametros.has('error') || fragmento.has('error') || fragmento.has('error_code'),
}

// Somente a chave publicável pode chegar ao navegador.
export const supabase = url && chave?.startsWith('sb_publishable_')
  ? createClient(url, chave, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' },
  })
  : null

export const contextoRecuperacao = acompanharRecuperacao(supabase?.auth, retornoAuthInicial)
