import { useCallback, useEffect, useRef, useState } from 'react'
const SECOES = ['perfil', 'areas', 'faculdades', 'ingressos']
function lerRota() {
  const p = new URLSearchParams(window.location.search)
  return { interna: p.get('area') === 'interna', secao: SECOES.includes(p.get('secao')) ? p.get('secao') : 'perfil', item: p.get('item'), busca: p.get('busca') ?? '', tipo: ['publica', 'privada'].includes(p.get('tipo')) ? p.get('tipo') : 'todas', login: p.get('login') === '1' }
}
export default function useRotaApp() {
  const [rota, setRota] = useState(lerRota)
  const filtros = useRef({})
  useEffect(() => {
    const atualizar = () => setRota(lerRota())
    window.addEventListener('popstate', atualizar)
    return () => window.removeEventListener('popstate', atualizar)
  }, [])
  const navegar = useCallback((secao, { substituir = false, item = null, login = false, busca, tipo } = {}) => {
    const p = new URLSearchParams()
    if (secao) { p.set('area', 'interna'); p.set('secao', SECOES.includes(secao) ? secao : 'perfil'); if (item) p.set('item', item) }
    else if (login) p.set('login', '1')
    const atual = lerRota()
    if (atual.secao === 'faculdades') filtros.current.faculdades = { busca: atual.busca, tipo: atual.tipo }
    if (secao === 'faculdades') {
      const anterior = filtros.current.faculdades ?? {}
      const termo = busca ?? anterior.busca ?? ''
      const filtro = tipo ?? anterior.tipo ?? 'todas'
      if (termo) p.set('busca', termo)
      if (filtro !== 'todas') p.set('tipo', filtro)
    }
    const url = `${window.location.pathname}${p.size ? `?${p}` : ''}`
    window.history[substituir ? 'replaceState' : 'pushState'](null, '', url)
    setRota(lerRota())
    if (!(substituir && atual.secao === secao && atual.item === item)) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  return { rota, navegar }
}
