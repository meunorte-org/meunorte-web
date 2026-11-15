// O SDK emite PASSWORD_RECOVERY em uma tarefa posterior à resolução de getSession.
// Aguardar esse evento, sem executar métodos do SDK dentro do seu callback.
export function acompanharRecuperacao(auth, retorno, limiteMs = 5000) {
  let usuarioRecuperacaoId = null
  const aguardando = new Set()
  const contexto = () => ({ ...retorno, usuarioRecuperacaoId })
  auth?.onAuthStateChange((evento, sessao) => {
    if (evento === 'PASSWORD_RECOVERY') usuarioRecuperacaoId = sessao?.user?.id ?? null
    else if (evento === 'SIGNED_OUT') usuarioRecuperacaoId = null
    else return
    for (const concluir of aguardando) concluir(contexto())
    aguardando.clear()
  })
  return async function aguardarRecuperacao() {
    if (!auth || retorno.erro || !retorno.recuperacao || usuarioRecuperacaoId) return contexto()
    return new Promise(resolve => {
      const concluir = valor => {
        clearTimeout(timer)
        aguardando.delete(concluir)
        resolve(valor)
      }
      const timer = setTimeout(() => concluir(contexto()), limiteMs)
      aguardando.add(concluir)
    })
  }
}
