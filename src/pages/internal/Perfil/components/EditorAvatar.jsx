import { useEffect, useRef, useState } from 'react'
import { AREAS } from '../../../../data/areas.js'
import { AcoesEditor } from './Editores.jsx'

export default function EditorAvatar({ perfil, salvar, cancelar, ocupado }) {
  const [avatarId, setAvatarId] = useState(perfil.avatar?.tipo === 'oficial' ? perfil.avatar.id : null)
  const [arquivo, setArquivo] = useState(null)
  const [url, setUrl] = useState('')
  const [erro, setErro] = useState('')
  const [dimensoes, setDimensoes] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const imagem = useRef(null)
  useEffect(() => {
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [url])
  function selecionar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setErro('Escolha uma imagem JPG, PNG ou WebP de até 8 MB.'); e.target.value = ''; return
    }
    setErro(''); setArquivo(file); setUrl(URL.createObjectURL(file)); setDimensoes(null); setZoom(1); setX(0); setY(0)
  }
  const escala = dimensoes ? Math.max(220 / dimensoes.w, 220 / dimensoes.h) * zoom : 1
  const largura = (dimensoes?.w ?? 220) * escala, altura = (dimensoes?.h ?? 220) * escala
  const dx = (220 - largura) / 2 + x / 100 * (largura - 220) / 2
  const dy = (220 - altura) / 2 + y / 100 * (altura - 220) / 2
  async function confirmar(e) {
    e.preventDefault()
    if (!arquivo) { if (avatarId) salvar('selecionarAvatar', avatarId); return }
    if (!dimensoes || ocupado) return
    try {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 512
      const ctx = canvas.getContext('2d')
      ctx.drawImage(imagem.current, dx * 512 / 220, dy * 512 / 220, largura * 512 / 220, altura * 512 / 220)
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .9))
      if (!blob) throw new Error('Não foi possível preparar esta foto.')
      salvar('salvarFoto', blob)
    } catch { setErro('Não foi possível preparar a foto. Tente outra imagem.') }
  }
  return <form onSubmit={confirmar}>
    <p>Escolha um avatar oficial ou use uma foto sua.</p>
    <label className="mn-i-button mn-i-button--secondary mn-photo-upload">escolher foto do dispositivo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={selecionar} disabled={ocupado} /></label>
      {arquivo && <div className="mn-photo-editor"><h3>Ajuste o enquadramento</h3><div className="mn-photo-crop">{url && <img ref={imagem} src={url} alt="Prévia do enquadramento" style={{ width: largura, height: altura, left: dx, top: dy }} onLoad={e => { setDimensoes({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight }); setErro('') }} onError={() => { setErro('Não foi possível abrir esta imagem.'); setDimensoes(null) }} />}</div>
      <label htmlFor="foto-zoom">Aproximar<input id="foto-zoom" type="range" min="1" max="3" step=".01" value={zoom} onChange={e => setZoom(Number(e.target.value))} /></label>
      <label htmlFor="foto-horizontal">Mover na horizontal<input id="foto-horizontal" type="range" min="-100" max="100" value={x} onChange={e => setX(Number(e.target.value))} /></label>
      <label htmlFor="foto-vertical">Mover na vertical<input id="foto-vertical" type="range" min="-100" max="100" value={y} onChange={e => setY(Number(e.target.value))} /></label>
      <button type="button" className="mn-i-text-button" onClick={() => { setArquivo(null); setUrl('') }}>escolher um avatar</button>
    </div>}
    {!arquivo && <fieldset><legend>Avatares das áreas</legend><div className="mn-avatar-grid">{AREAS.map(area => <label key={area.id} className={avatarId === area.id ? 'mn-avatar-option--selected' : ''}><input type="radio" name="avatar" checked={avatarId === area.id} onChange={() => setAvatarId(area.id)} /><img src={area.avatar} alt="" loading="lazy" decoding="async" /><span>{area.nome}</span></label>)}</div></fieldset>}
    {erro && <p className="mn-i-error" role="alert">{erro}</p>}
    <p className="mn-i-help">A imagem escolhida fica salva apenas neste navegador, por enquanto.</p>
    <AcoesEditor ocupado={ocupado} salvarDesabilitado={arquivo ? !dimensoes : !avatarId} onCancelar={cancelar} />
  </form>
}
