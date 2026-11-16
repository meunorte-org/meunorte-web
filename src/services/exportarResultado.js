import { personaDaArea, RECORTES_SELOS } from '../data/ilustracoesAreas.js'
import atlas from '../assets/selos/selos-oficiais.png'
const imagem = src => new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('Não foi possível carregar a ilustração. Tente novamente.')); img.src = src })
function textoQuebrado(ctx, texto, x, y, largura, altura) {
  let linha = ''
  for (const palavra of texto.split(' ')) { const teste = `${linha}${palavra} `; if (ctx.measureText(teste).width > largura && linha) { ctx.fillText(linha.trim(), x, y); y += altura; linha = `${palavra} ` } else linha = teste }
  ctx.fillText(linha.trim(), x, y)
  return y
}
function desenharSelo(ctx, selos, id, x, y, largura) {
  const r = RECORTES_SELOS[id], altura = largura * r[1] / r[0]
  const iw = largura * r[2] / 100, ih = altura * r[3] / 100
  const sx = -largura * r[4] / 100 / iw * selos.width, sy = -altura * r[5] / 100 / ih * selos.height
  ctx.drawImage(selos, sx, sy, largura / iw * selos.width, altura / ih * selos.height, x, y, largura, altura)
}
export async function gerarImagemResultado(area) {
  await Promise.all([document.fonts.load('400 84px "Futura Display"'), document.fonts.load('400 38px "Readex Pro"')])
  const [personagem, selos] = await Promise.all([imagem(personaDaArea(area.id)), imagem(atlas)])
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Seu navegador não conseguiu preparar a imagem.')
  ctx.fillStyle = '#f7f6f2'; ctx.fillRect(0, 0, 1080, 1350)
  ctx.fillStyle = area.cor; ctx.fillRect(0, 0, 1080, 940)
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 375, 280, 0, Math.PI * 2); ctx.stroke()
  const escala = Math.min(650 / personagem.width, 540 / personagem.height)
  const w = personagem.width * escala, h = personagem.height * escala
  ctx.drawImage(personagem, (1080 - w) / 2, 100 + (540 - h) / 2, w, h)
  // Mesma geometria do recorte do Figma, convertida para coordenadas do atlas.
  desenharSelo(ctx, selos, area.id, 820, 550, 165)
  ctx.fillStyle = '#fff'; ctx.font = '400 28px "Readex Pro"'; ctx.fillText('MEUS INTERESSES APONTAM PARA', 64, 755)
  ctx.font = '400 76px "Futura Display"'; textoQuebrado(ctx, area.nome, 64, 840, 950, 82)
  ctx.fillStyle = '#1e1e1e'; ctx.font = '400 39px "Readex Pro"'; textoQuebrado(ctx, area.resumo, 64, 1040, 925, 56)
  ctx.fillStyle = '#334aee'; ctx.font = '400 84px "Futura Display"'; ctx.fillText('MeuNorte', 64, 1235)
  ctx.font = '400 25px "Readex Pro"'; ctx.fillText('Uma descoberta, muitas possibilidades.', 64, 1290)
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Não foi possível gerar o PNG.')), 'image/png'))
}
export async function gerarImagemEmpate(areas) {
  if (areas.length < 2 || areas.length > 5) throw new Error('Não foi possível preparar estas áreas para compartilhar.')
  await Promise.all([document.fonts.load('400 72px "Futura Display"'), document.fonts.load('400 28px "Readex Pro"')])
  const [imagens, selos] = await Promise.all([Promise.all(areas.map(a => imagem(personaDaArea(a.id)))), imagem(atlas)])
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Seu navegador não conseguiu preparar a imagem.')
  ctx.fillStyle = '#f7f6f2'; ctx.fillRect(0, 0, 1080, 1350)
  ctx.fillStyle = '#334aee'; ctx.font = '400 72px "Futura Display"'
  textoQuebrado(ctx, 'Mais de um caminho combina comigo.', 64, 110, 940, 78)
  ctx.fillStyle = '#1e1e1e'; ctx.font = '400 27px "Readex Pro"'; ctx.fillText('Interesses diferentes. Possibilidades para explorar.', 64, 230)
  areas.forEach((a, i) => {
    const x = 64 + (i % 2) * 492, y = 280 + Math.floor(i / 2) * 275
    ctx.fillStyle = a.cor; ctx.fillRect(x, y, 460, 250)
    const img = imagens[i], escala = Math.min(210 / img.width, 150 / img.height)
    ctx.drawImage(img, x + (460 - img.width * escala) / 2, y + 12, img.width * escala, img.height * escala)
    desenharSelo(ctx, selos, a.id, x + 342, y + 24, 86)
    ctx.fillStyle = '#fff'; ctx.font = '400 27px "Readex Pro"'; textoQuebrado(ctx, a.nome, x + 20, y + 193, 420, 34)
  })
  ctx.fillStyle = '#334aee'; ctx.font = '400 84px "Futura Display"'; ctx.fillText('MeuNorte', 64, 1235)
  ctx.font = '400 25px "Readex Pro"'; ctx.fillText('Uma descoberta, muitas possibilidades.', 64, 1290)
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Não foi possível gerar o PNG.')), 'image/png'))
}
export { baixarImagem, compartilharImagem } from './compartilharImagem.js'
