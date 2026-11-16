import { contextoDaTela } from '../../domain/assistente.js'
const TEXTOS = {
  nao_configurado: 'O Nô ainda está sendo conectado à IA da equipe. Sua pergunta não foi enviada.',
  conexao: 'Não conseguimos conectar ao Nô. Confira sua conexão e tente novamente.',
  indisponivel: 'O serviço do Nô está indisponível no momento. Tente novamente mais tarde.',
  tempo_limite: 'A resposta demorou mais do que o esperado. Você pode tentar novamente.',
  resposta_invalida: 'Não foi possível receber uma resposta válida. Tente novamente.',
  cancelada: 'Solicitação cancelada. Sua mensagem não recebeu uma resposta.',
  entrada_invalida: 'Escreva uma pergunta de até 2.000 caracteres para continuar.',
}
export class ErroIA extends Error { constructor(codigo) { super(TEXTOS[codigo] ?? TEXTOS.indisponivel); this.name = 'ErroIA'; this.codigo = codigo in TEXTOS ? codigo : 'indisponivel' } }
/** Contrato da UI, não o protocolo já escolhido pelo integrante.
 * transporte({conversaId,mensagens:[{id,papel,texto}],contexto?,signal})
 * -> Promise<{conversaId?,resposta:{id,texto}}>. Resposta final JSON, sem streaming.
 * Injetar transporte real neste módulo; padrão sem rede nem respostas simuladas.
 */
export function criarAssistenteService({ transporte, timeoutMs = 25000 } = {}) {
  return {
    configurado: typeof transporte === 'function',
    async enviarMensagem({ conversaId, mensagens, contexto, signal }) {
      if (signal?.aborted) throw new ErroIA('cancelada')
      if (!Array.isArray(mensagens) || !mensagens.length || mensagens.length > 20) throw new ErroIA('entrada_invalida')
      const historico = mensagens.map(m => {
        if (typeof m.id !== 'string' || !m.id.trim() || m.id.length > 100) throw new ErroIA('entrada_invalida')
        if (!['usuario', 'assistente'].includes(m.papel) || typeof m.texto !== 'string' || !m.texto.trim() || m.texto.length > (m.papel === 'usuario' ? 2000 : 16000)) throw new ErroIA('entrada_invalida')
        return { id: String(m.id).slice(0, 100), papel: m.papel, texto: m.texto }
      })
      if (historico.at(-1).papel !== 'usuario') throw new ErroIA('entrada_invalida')
      if (!transporte) throw new ErroIA('nao_configurado')
      const controle = new AbortController()
      const cancelado = () => controle.abort(new ErroIA('cancelada'))
      signal?.addEventListener('abort', cancelado, { once: true })
      const timer = setTimeout(() => controle.abort(new ErroIA('tempo_limite')), timeoutMs)
      let rejeitarAbort
      const abortado = new Promise((_, reject) => { rejeitarAbort = () => reject(controle.signal.reason); controle.signal.addEventListener('abort', rejeitarAbort, { once: true }) })
      try {
        const entrada = { conversaId: typeof conversaId === 'string' ? conversaId.slice(0, 100) : null, mensagens: historico, signal: controle.signal }
        if (contexto) entrada.contexto = contextoDaTela({ secao: contexto.secao, item: contexto.areaId ?? contexto.assunto ?? contexto.instituicaoId ?? (contexto.tela === 'teste-vocacional' ? 'teste' : null) })
        const r = await Promise.race([Promise.resolve().then(() => { if (controle.signal.aborted) throw controle.signal.reason; return transporte(entrada) }), abortado])
        if (!r?.resposta || typeof r.resposta.id !== 'string' || !r.resposta.id.trim() || r.resposta.id.length > 100 || typeof r.resposta.texto !== 'string' || !r.resposta.texto.trim() || r.resposta.texto.length > 16000) throw new ErroIA('resposta_invalida')
        if (historico.some(m => m.id === r.resposta.id)) throw new ErroIA('resposta_invalida')
        return { conversaId: typeof r.conversaId === 'string' ? r.conversaId.slice(0, 100) : entrada.conversaId, resposta: { id: r.resposta.id, texto: r.resposta.texto } }
      } catch (e) {
        if (e instanceof ErroIA) throw e
        if (signal?.aborted || e?.name === 'AbortError') throw new ErroIA('cancelada')
        throw new ErroIA(e instanceof TypeError ? 'conexao' : 'indisponivel')
      } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancelado); controle.signal.removeEventListener('abort', rejeitarAbort) }
    },
  }
}
export const assistenteService = criarAssistenteService()
