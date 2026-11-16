export function baixarImagem(blob, nome) {
  const url = URL.createObjectURL(blob), a = document.createElement('a')
  a.href = url; a.download = nome; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
export async function compartilharImagem(blob, nome, { navegador = globalThis.navigator, baixar = baixarImagem } = {}) {
  const arquivo = new File([blob], nome, { type: 'image/png' })
  if (navegador?.canShare?.({ files: [arquivo] }) && navegador.share) {
    await navegador.share({ files: [arquivo], title: 'Meu caminho no MeuNorte' })
    return 'compartilhado'
  }
  baixar(blob, nome)
  return 'baixado'
}
