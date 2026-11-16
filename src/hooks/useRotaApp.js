import { useCallback, useEffect, useState } from 'react'
const SECOES = ['perfil', 'areas', 'faculdades', 'ingressos']
function lerRota() {
  const p = new URLSearchParams(window.location.search)
  return { interna: p.get('area') === 'interna', secao: SECOES.includes(p.get('secao')) ? p.get('secao') : 'perfil', item: p.get('item'), login: p.get('login') === '1' }
}
export default function useRotaApp() {
  const [rota, setRota] = useState(lerRota)
  useEffect(() => {
    const atualizar = () => setRota(lerRota())
    window.addEventListener('popstate', atualizar)
    return () => window.removeEventListener('popstate', atualizar)
  }, [])
  const navegar = useCallback((secao, { substituir = false, item = null, login = false } = {}) => {
    const p = new URLSearchParams()
    if (secao) { p.set('area', 'interna'); p.set('secao', SECOES.includes(secao) ? secao : 'perfil'); if (item) p.set('item', item) }
    else if (login) p.set('login', '1')
    const url = `${window.location.pathname}${p.size ? `?${p}` : ''}`
    window.history[substituir ? 'replaceState' : 'pushState'](null, '', url)
    setRota(lerRota())
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  return { rota, navegar }
}
