import { useCallback, useEffect, useRef, useState } from 'react'
import { perfilService } from '../services/perfil/perfilService.js'
export default function usePerfil(usuario, service = perfilService) {
  const [estado, setEstado] = useState({ perfil: null, erro: '', carregando: true })
  const atual = useRef(usuario.id)
  const bloqueio = useRef(false)
  const carregar = useCallback(() => {
    const id = usuario.id
    return service.obterPerfil(usuario).then(perfil => {
      if (atual.current === id) setEstado({ perfil, erro: '', carregando: false })
    }).catch(e => { if (atual.current === id) setEstado({ perfil: null, erro: e.message, carregando: false }) })
  }, [usuario, service])
  useEffect(() => { atual.current = usuario.id; carregar(); return () => { atual.current = null } }, [usuario.id, carregar])
  async function executar(operacao, ...args) {
    if (bloqueio.current) throw new Error('Aguarde a alteração atual terminar.')
    bloqueio.current = true
    const id = usuario.id
    try {
      const perfil = await service[operacao](usuario, ...args)
      if (atual.current === id) setEstado({ perfil, erro: '', carregando: false })
      return perfil
    } finally { bloqueio.current = false }
  }
  return { ...estado, executar, carregar }
}
