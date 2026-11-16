import { useCallback, useEffect, useRef, useState } from 'react'
import { assistenteService } from '../services/ai/assistenteService.js'
export default function useConversaIA(contexto, service = assistenteService) {
  const [mensagens, setMensagens] = useState([])
  const [rascunho, setRascunho] = useState('')
  const [situacao, setSituacao] = useState({ tipo: 'inicial', erro: '', codigo: '', tentativa: null })
  const [incluirContexto, setIncluirContexto] = useState(true)
  const historico = useRef([]), conversaId = useRef(null), pedido = useRef(null), sequencia = useRef(0)
  function atualizar(itens) { historico.current = itens; setMensagens(itens) }
  useEffect(() => () => { sequencia.current++; pedido.current?.abort() }, [])
  async function enviar(texto = rascunho, tentativa = null) {
    if (pedido.current || !texto.trim() || texto.length > 2000) return
    const mensagem = tentativa ?? { id: crypto.randomUUID(), papel: 'usuario', texto: texto.trim(), status: 'enviando' }
    const anteriores = historico.current.filter(m => m.id !== mensagem.id && m.status === 'enviada')
    const itens = tentativa ? historico.current.map(m => m.id === mensagem.id ? { ...m, status: 'enviando' } : m) : [...historico.current, mensagem]
    atualizar(itens); setRascunho(''); setSituacao({ tipo: 'enviando', erro: '', codigo: '', tentativa: null })
    const controle = new AbortController(), versao = ++sequencia.current
    pedido.current = controle
    try {
      const resposta = await service.enviarMensagem({ conversaId: conversaId.current, mensagens: [...anteriores, mensagem].slice(-20), contexto: incluirContexto ? contexto : undefined, signal: controle.signal })
      if (versao !== sequencia.current) return
      conversaId.current = resposta.conversaId
      atualizar([...historico.current.map(m => m.id === mensagem.id ? { ...m, status: 'enviada' } : m), { ...resposta.resposta, papel: 'assistente', status: 'enviada' }])
      setSituacao({ tipo: 'pronto', erro: '', codigo: '', tentativa: null })
    } catch (e) {
      if (versao !== sequencia.current) return
      atualizar(historico.current.map(m => m.id === mensagem.id ? { ...m, status: 'falhou', motivo: e.codigo } : m))
      setSituacao({ tipo: 'erro', erro: e.message, codigo: e.codigo ?? 'indisponivel', tentativa: mensagem })
    } finally { if (versao === sequencia.current) pedido.current = null }
  }
  const cancelar = useCallback(() => { pedido.current?.abort() }, [])
  function limpar() { sequencia.current++; pedido.current?.abort(); pedido.current = null; historico.current = []; setMensagens([]); setRascunho(''); conversaId.current = null; setSituacao({ tipo: 'inicial', erro: '', codigo: '', tentativa: null }) }
  return { mensagens, rascunho, setRascunho, situacao, enviar, cancelar, limpar, incluirContexto, setIncluirContexto, configurado: service.configurado }
}
