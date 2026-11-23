/*import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext.js'
import usePerfil from '../../../hooks/usePerfil.js'
import { perfilService } from '../../../services/perfil/perfilService.js'
import { tagsDoPerfil, tagsVisiveis, CORES_TAG } from '../../../domain/perfil.js'
import { AREAS } from '../../../data/areas.js'
import Icone from '../../../components/shared/Icone.jsx'
import ModalPerfil from '../../../components/shared/ModalPerfil.jsx'
import EditorAvatar from './components/EditorAvatar.jsx'
import { EditorBio, EditorTag, EditorObjetivo, EditorVisibilidade, EditorInformacoes } from './components/Editores.jsx'
import Coletanea from './components/Coletanea.jsx'
import './Perfil.css'

const TITULOS = { configuracoes: 'Seu perfil, do seu jeito', foto: 'Sua foto de perfil', bio: 'Sobre você', tag: 'Personalizar tag', tags: 'Suas tags', visibilidade: 'O que você quer mostrar?', objetivo: 'Meus objetivos', informacoes: 'Suas informações', excluirTag: 'Excluir tag?', excluirObjetivo: 'Excluir objetivo?' }
export default function Perfil({ navegar, onSair, onModalChange }) {
  const { usuario, atualizarNome } = useAuth()
  const { perfil, carregando, erro, executar, carregar } = usePerfil(usuario)
  const [painel, setPainel] = useState(null)
  const [painelFechando, setPainelFechando] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [erroModal, setErroModal] = useState('')
  const [aviso, setAviso] = useState('')
  const [fotoAtual, setFotoAtual] = useState({ id: null, url: '', erro: '' })
  const configuracoesRef = useRef(null)
  useEffect(() => () => onModalChange(false), [onModalChange])
  useEffect(() => { if (!aviso) return; const timer = setTimeout(() => setAviso(''), 5000); return () => clearTimeout(timer) }, [aviso])
  const fotoId = perfil?.avatar?.tipo === 'foto' ? perfil.avatar.id : null
  useEffect(() => {
    let ativo = true, temporaria
    if (fotoId) perfilService.carregarFoto(usuario, fotoId).then(blob => {
      if (!ativo) return
      if (!blob) { setFotoAtual({ id: fotoId, url: '', erro: 'Escolha sua foto novamente neste navegador.' }); return }
      temporaria = URL.createObjectURL(blob); setFotoAtual({ id: fotoId, url: temporaria, erro: '' })
    }).catch(() => { if (ativo) setFotoAtual({ id: fotoId, url: '', erro: 'Não foi possível carregar sua foto.' }) })
    return () => { ativo = false; if (temporaria) URL.revokeObjectURL(temporaria) }
  }, [fotoId, usuario])

  function abrir(proximo) { onModalChange(true); setPainelFechando(false); setErroModal(''); setPainel(proximo) }
  function fechar() {
    if (ocupado) return
    setPainelFechando(true)
  }
  function concluirFechamento() {
    onModalChange(false); setPainel(null); setPainelFechando(false); setErroModal('')
    requestAnimationFrame(() => configuracoesRef.current?.focus({ preventScroll: true }))
  }
  async function salvar(operacao, ...args) {
    if (ocupado) return
    setOcupado(true); setErroModal('')
    try { await executar(operacao, ...args); setPainelFechando(true); setAviso('Alteração salva neste navegador.') }
    catch (e) { setErroModal(e.message ?? 'Não foi possível salvar. Tente novamente.') }
    finally { setOcupado(false) }
  }
  async function salvarNome(nome) {
    if (ocupado) return
    setOcupado(true); setErroModal('')
    try { await atualizarNome(nome); setPainelFechando(true); setAviso('Nome atualizado na sua conta.') }
    catch (e) { setErroModal(e.mensagemPublica ?? e.message) }
    finally { setOcupado(false) }
  }
  async function removerFavorito(tipo, item) {
    try { await executar('alternarFavorito', tipo, item); setAviso('Favorito removido.') }
    catch (e) { setAviso(e.message) }
  }
  async function moverObjetivo(indice, direcao) {
    const ids = perfil.objetivos.map(o => o.id), destino = indice + direcao
    if (destino < 0 || destino >= ids.length) return
    ;[ids[indice], ids[destino]] = [ids[destino], ids[indice]]
    try { await executar('ordenarObjetivos', ids); setAviso('Ordem dos objetivos salva neste navegador.'); requestAnimationFrame(() => document.querySelector(`[data-objetivo-id="${CSS.escape(ids[destino])}"]`)?.focus({ preventScroll: true })) }
    catch (e) { setAviso(e.message) }
  }
  async function sair() {
    if (ocupado) return
    setOcupado(true); setErroModal('')
    try { await onSair() }
    catch (e) { setErroModal(e.mensagemPublica ?? 'Não foi possível sair. Tente novamente.'); setOcupado(false) }
  }
  if (carregando) return <p role="status" className="mn-i-loading">Preparando seu perfil…</p>
  if (erro || !perfil) return <section className="mn-i-loading"><h1>Vamos tentar novamente?</h1><p role="alert">{erro || 'Não foi possível abrir seu perfil.'}</p><button className="mn-i-button" onClick={carregar}>tentar novamente</button></section>
  const nome = typeof usuario.user_metadata?.full_name === 'string' ? usuario.user_metadata.full_name.trim() : ''
  const primeiro = nome.split(/\s+/)[0]
  const tags = tagsVisiveis(usuario, perfil)
  const avatar = perfil.avatar?.tipo === 'oficial' ? AREAS.find(a => a.id === perfil.avatar.id)?.avatar : fotoAtual.id === fotoId ? fotoAtual.url : ''
  const erroFoto = fotoAtual.id === fotoId ? fotoAtual.erro : ''
  const editorProps = { perfil, usuario, ocupado, salvar, cancelar: fechar }
  return <>
    <section className="mn-profile-header" aria-labelledby="profile-title">
      <div className="mn-profile-toolbar"><span className="mn-i-eyebrow">MEU ESPAÇO</span><button ref={configuracoesRef} className="mn-i-icon-button" aria-label="Configurações do perfil" onClick={() => abrir({ tipo: 'configuracoes' })}><Icone nome="ajustes" /></button></div>
      <button className="mn-profile-avatar" aria-label="Alterar foto ou avatar" onClick={() => abrir({ tipo: 'foto' })}>{avatar ? <img src={avatar} alt="Sua foto de perfil" /> : <span>{primeiro ? Array.from(primeiro)[0].toLocaleUpperCase('pt-BR') : <Icone nome="perfil" tamanho={56} />}</span>}<span className="mn-profile-avatar__edit"><Icone nome="editar" tamanho={18} /></span></button>
      {erroFoto && <p className="mn-i-help">{erroFoto}</p>}
      <h1 id="profile-title">{primeiro ? `Olá, ${primeiro}!` : 'Olá, que bom ter você aqui!'}</h1>
      <div className="mn-profile-tags" aria-label="Tags do perfil">{tags.map(tag => tag.automatica ? <span className="mn-i-tag" key={tag.id}>{tag.texto}</span> : <button key={tag.id} className="mn-profile-tag-button" onClick={() => abrir({ tipo: 'tag', item: tag })} aria-label={`Editar tag ${tag.texto}`}><span className="mn-i-tag" style={{ background: CORES_TAG[tag.cor] ?? CORES_TAG.lima }}>{tag.texto}</span></button>)}<button className="mn-profile-tag-button" aria-label="Adicionar tag" onClick={() => tags.length >= 6 ? setAviso('Você já tem 6 tags. Remova ou oculte uma para adicionar outra.') : abrir({ tipo: 'tag' })}><span className="mn-i-tag mn-i-tag--add">+</span></button></div>
      {tagsDoPerfil(usuario, perfil).length > 6 && <button className="mn-i-text-button" onClick={() => abrir({ tipo: 'tags' })}>Algumas tags estão ocultas. Gerenciar limite de seis.</button>}
      <button className={`mn-profile-bio ${!perfil.bio ? 'mn-profile-bio--empty' : ''}`} onClick={() => abrir({ tipo: 'bio' })} aria-label="Editar biografia">{perfil.bio || 'O que faz você ser você? Adicione uma pequena apresentação.'}<Icone nome="editar" tamanho={16} /></button>
    </section>
    <Coletanea perfil={perfil} navegar={navegar} abrir={abrir} removerFavorito={removerFavorito} moverObjetivo={moverObjetivo} />
    <p className="mn-profile-local-note">Sua bio, tags, foto e coletânea ficam neste navegador por enquanto.</p>
    <p className="mn-profile-feedback" role="status" aria-live="polite">{aviso}</p>
    {painel && <ModalPerfil key={`${painel.tipo}:${painel.item?.id ?? ''}`} titulo={TITULOS[painel.tipo]} ocupado={ocupado} onFechar={fechar} fechando={painelFechando} onFechado={concluirFechamento}>
      {erroModal && <p className="mn-i-error" role="alert">{erroModal}</p>}
      {painel.tipo === 'configuracoes' && <div className="mn-profile-settings"><p>Pequenos detalhes deixam este espaço com a sua cara.</p>{[
        ['foto', 'Alterar foto ou avatar', 'foto'], ['informacoes', 'Informações pessoais', 'perfil'], ['bio', 'Editar biografia', 'editar'], ['tags', 'Gerenciar tags', 'mais'], ['visibilidade', 'Visibilidade das tags', 'ajustes'],
      ].map(([tipo, texto, icone]) => <button key={tipo} onClick={() => abrir({ tipo })}><Icone nome={icone} /><span>{texto}</span><span aria-hidden="true">→</span></button>)}<button className="mn-i-danger" disabled={ocupado} onClick={sair}><Icone nome="sair" />Sair da conta</button></div>}
      {painel.tipo === 'foto' && <EditorAvatar {...editorProps} />}
      {painel.tipo === 'bio' && <EditorBio {...editorProps} />}
      {painel.tipo === 'visibilidade' && <EditorVisibilidade {...editorProps} />}
      {painel.tipo === 'informacoes' && <EditorInformacoes {...editorProps} salvarNome={salvarNome} />}
      {painel.tipo === 'tag' && <EditorTag {...editorProps} tag={painel.item} excluir={painel.item ? () => abrir({ tipo: 'excluirTag', item: painel.item }) : undefined} />}
      {painel.tipo === 'objetivo' && <EditorObjetivo {...editorProps} objetivo={painel.item} excluir={painel.item ? () => abrir({ tipo: 'excluirObjetivo', item: painel.item }) : undefined} />}
      {painel.tipo === 'tags' && <div className="mn-profile-settings"><p>Toque numa tag para editar. As automáticas podem ser ocultadas nas preferências.</p>{perfil.tags.map(tag => <button key={tag.id} onClick={() => abrir({ tipo: 'tag', item: tag })}>{tag.texto}<Icone nome="editar" tamanho={20} /></button>)}{!perfil.tags.length && <p>Você ainda não criou tags personalizadas.</p>}<button onClick={() => abrir({ tipo: 'tag' })}><Icone nome="mais" />Criar tag</button><button onClick={() => abrir({ tipo: 'visibilidade' })}>Gerenciar tags automáticas →</button></div>}
      {['excluirTag', 'excluirObjetivo'].includes(painel.tipo) && <div><p>Deseja excluir {painel.tipo === 'excluirTag' ? `a tag “${painel.item.texto}”` : 'este objetivo'}?</p><p className="mn-i-help">Você poderá criar outro quando quiser.</p><div className="mn-i-form-actions"><button className="mn-i-button" disabled={ocupado} onClick={() => salvar(painel.tipo === 'excluirTag' ? 'excluirTag' : 'excluirObjetivo', painel.item.id)}>{ocupado ? 'excluindo…' : 'excluir'}</button><button className="mn-i-text-button" onClick={fechar} disabled={ocupado}>cancelar</button></div></div>}
    </ModalPerfil>}
  </>
}*/

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext.js'
import usePerfil from '../../../hooks/usePerfil.js'
import { perfilService } from '../../../services/perfil/perfilService.js'
import { tagsDoPerfil, tagsVisiveis, CORES_TAG } from '../../../domain/perfil.js'
import { AREAS } from '../../../data/areas.js'
import Icone from '../../../components/shared/Icone.jsx'
import ModalPerfil from '../../../components/shared/ModalPerfil.jsx'
import EditorAvatar from './components/EditorAvatar.jsx'
import { EditorBio, EditorTag, EditorObjetivo, EditorVisibilidade, EditorInformacoes } from './components/Editores.jsx'
import Coletanea from './components/Coletanea.jsx'
import './Perfil.css'

const TITULOS = { configuracoes: 'Seu perfil, do seu jeito', foto: 'Sua foto de perfil', bio: 'Sobre você', tag: 'Personalizar tag', tags: 'Suas tags', visibilidade: 'O que você quer mostrar?', objetivo: 'Meus objetivos', informacoes: 'Suas informações', excluirTag: 'Excluir tag?', excluirObjetivo: 'Excluir objetivo?' }
export default function Perfil({ navegar, onSair, onModalChange }) {
  const { usuario, atualizarNome } = useAuth()
  const { perfil, carregando, erro, executar, carregar } = usePerfil(usuario)
  const [painel, setPainel] = useState(null)
  const [painelFechando, setPainelFechando] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [erroModal, setErroModal] = useState('')
  const [aviso, setAviso] = useState('')
  const [fotoAtual, setFotoAtual] = useState({ id: null, url: '', erro: '' })
  const configuracoesRef = useRef(null)
  useEffect(() => () => onModalChange(false), [onModalChange])
  useEffect(() => { if (!aviso) return; const timer = setTimeout(() => setAviso(''), 5000); return () => clearTimeout(timer) }, [aviso])
  const fotoId = perfil?.avatar?.tipo === 'foto' ? perfil.avatar.id : null
  useEffect(() => {
    let ativo = true, temporaria
    if (fotoId) perfilService.carregarFoto(usuario, fotoId).then(blob => {
      if (!ativo) return
      if (!blob) { setFotoAtual({ id: fotoId, url: '', erro: 'Escolha sua foto novamente neste navegador.' }); return }
      temporaria = URL.createObjectURL(blob); setFotoAtual({ id: fotoId, url: temporaria, erro: '' })
    }).catch(() => { if (ativo) setFotoAtual({ id: fotoId, url: '', erro: 'Não foi possível carregar sua foto.' }) })
    return () => { ativo = false; if (temporaria) URL.revokeObjectURL(temporaria) }
  }, [fotoId, usuario])

  function abrir(proximo) { onModalChange(true); setPainelFechando(false); setErroModal(''); setPainel(proximo) }
  function fechar() {
    if (ocupado) return
    setPainelFechando(true)
  }
  function concluirFechamento() {
    onModalChange(false); setPainel(null); setPainelFechando(false); setErroModal('')
    requestAnimationFrame(() => configuracoesRef.current?.focus({ preventScroll: true }))
  }
  async function salvar(operacao, ...args) {
    if (ocupado) return
    setOcupado(true); setErroModal('')
    try { await executar(operacao, ...args); setPainelFechando(true); setAviso('Alteração salva na sua conta.') }
    catch (e) { setErroModal(e.message ?? 'Não foi possível salvar. Tente novamente.') }
    finally { setOcupado(false) }
  }
  async function salvarNome(nome) {
    if (ocupado) return
    setOcupado(true); setErroModal('')
    try { await atualizarNome(nome); setPainelFechando(true); setAviso('Nome atualizado na sua conta.') }
    catch (e) { setErroModal(e.mensagemPublica ?? e.message) }
    finally { setOcupado(false) }
  }
  async function removerFavorito(tipo, item) {
    try { await executar('alternarFavorito', tipo, item); setAviso('Favorito removido.') }
    catch (e) { setAviso(e.message) }
  }
  async function moverObjetivo(indice, direcao) {
    const ids = perfil.objetivos.map(o => o.id), destino = indice + direcao
    if (destino < 0 || destino >= ids.length) return
    ;[ids[indice], ids[destino]] = [ids[destino], ids[indice]]
    try { await executar('ordenarObjetivos', ids); setAviso('Ordem dos objetivos salva na sua conta.'); requestAnimationFrame(() => document.querySelector(`[data-objetivo-id="${CSS.escape(ids[destino])}"]`)?.focus({ preventScroll: true })) }
    catch (e) { setAviso(e.message) }
  }
  async function sair() {
    if (ocupado) return
    setOcupado(true); setErroModal('')
    try { await onSair() }
    catch (e) { setErroModal(e.mensagemPublica ?? 'Não foi possível sair. Tente novamente.'); setOcupado(false) }
  }
  if (carregando) return <p role="status" className="mn-i-loading">Preparando seu perfil…</p>
  if (erro || !perfil) return <section className="mn-i-loading"><h1>Vamos tentar novamente?</h1><p role="alert">{erro || 'Não foi possível abrir seu perfil.'}</p><button className="mn-i-button" onClick={carregar}>tentar novamente</button></section>
  const nome = typeof usuario.user_metadata?.full_name === 'string' ? usuario.user_metadata.full_name.trim() : ''
  const primeiro = nome.split(/\s+/)[0]
  const tags = tagsVisiveis(usuario, perfil)
  const avatar = perfil.avatar?.tipo === 'oficial' ? AREAS.find(a => a.id === perfil.avatar.id)?.avatar : fotoAtual.id === fotoId ? fotoAtual.url : ''
  const erroFoto = fotoAtual.id === fotoId ? fotoAtual.erro : ''
  const editorProps = { perfil, usuario, ocupado, salvar, cancelar: fechar }
  return <>
    <section className="mn-profile-header" aria-labelledby="profile-title">
      <div className="mn-profile-toolbar"><span className="mn-i-eyebrow">MEU ESPAÇO</span><button ref={configuracoesRef} className="mn-i-icon-button" aria-label="Configurações do perfil" onClick={() => abrir({ tipo: 'configuracoes' })}><Icone nome="ajustes" /></button></div>
      <button className="mn-profile-avatar" aria-label="Alterar foto ou avatar" onClick={() => abrir({ tipo: 'foto' })}>{avatar ? <img src={avatar} alt="Sua foto de perfil" /> : <span>{primeiro ? Array.from(primeiro)[0].toLocaleUpperCase('pt-BR') : <Icone nome="perfil" tamanho={56} />}</span>}<span className="mn-profile-avatar__edit"><Icone nome="editar" tamanho={18} /></span></button>
      {erroFoto && <p className="mn-i-help">{erroFoto}</p>}
      <h1 id="profile-title">{primeiro ? `Olá, ${primeiro}!` : 'Olá, que bom ter você aqui!'}</h1>
      <div className="mn-profile-tags" aria-label="Tags do perfil">{tags.map(tag => tag.automatica ? <span className="mn-i-tag" key={tag.id}>{tag.texto}</span> : <button key={tag.id} className="mn-profile-tag-button" onClick={() => abrir({ tipo: 'tag', item: tag })} aria-label={`Editar tag ${tag.texto}`}><span className="mn-i-tag" style={{ background: CORES_TAG[tag.cor] ?? CORES_TAG.lima }}>{tag.texto}</span></button>)}<button className="mn-profile-tag-button" aria-label="Adicionar tag" onClick={() => tags.length >= 6 ? setAviso('Você já tem 6 tags. Remova ou oculte uma para adicionar outra.') : abrir({ tipo: 'tag' })}><span className="mn-i-tag mn-i-tag--add">+</span></button></div>
      {tagsDoPerfil(usuario, perfil).length > 6 && <button className="mn-i-text-button" onClick={() => abrir({ tipo: 'tags' })}>Algumas tags estão ocultas. Gerenciar limite de seis.</button>}
      <button className={`mn-profile-bio ${!perfil.bio ? 'mn-profile-bio--empty' : ''}`} onClick={() => abrir({ tipo: 'bio' })} aria-label="Editar biografia">{perfil.bio || 'O que faz você ser você? Adicione uma pequena apresentação.'}<Icone nome="editar" tamanho={16} /></button>
    </section>
    <Coletanea perfil={perfil} navegar={navegar} abrir={abrir} removerFavorito={removerFavorito} moverObjetivo={moverObjetivo} />
    <p className="mn-profile-local-note">Sua bio, tags, foto e coletânea são salvas na sua conta e podem ser acessadas em outros dispositivos.</p>
    <p className="mn-profile-feedback" role="status" aria-live="polite">{aviso}</p>
    {painel && <ModalPerfil key={`${painel.tipo}:${painel.item?.id ?? ''}`} titulo={TITULOS[painel.tipo]} ocupado={ocupado} onFechar={fechar} fechando={painelFechando} onFechado={concluirFechamento}>
      {erroModal && <p className="mn-i-error" role="alert">{erroModal}</p>}
      {painel.tipo === 'configuracoes' && <div className="mn-profile-settings"><p>Pequenos detalhes deixam este espaço com a sua cara.</p>{[
        ['foto', 'Alterar foto ou avatar', 'foto'], ['informacoes', 'Informações pessoais', 'perfil'], ['bio', 'Editar biografia', 'editar'], ['tags', 'Gerenciar tags', 'mais'], ['visibilidade', 'Visibilidade das tags', 'ajustes'],
      ].map(([tipo, texto, icone]) => <button key={tipo} onClick={() => abrir({ tipo })}><Icone nome={icone} /><span>{texto}</span><span aria-hidden="true">→</span></button>)}<button className="mn-i-danger" disabled={ocupado} onClick={sair}><Icone nome="sair" />Sair da conta</button></div>}
      {painel.tipo === 'foto' && <EditorAvatar {...editorProps} />}
      {painel.tipo === 'bio' && <EditorBio {...editorProps} />}
      {painel.tipo === 'visibilidade' && <EditorVisibilidade {...editorProps} />}
      {painel.tipo === 'informacoes' && <EditorInformacoes {...editorProps} salvarNome={salvarNome} />}
      {painel.tipo === 'tag' && <EditorTag {...editorProps} tag={painel.item} excluir={painel.item ? () => abrir({ tipo: 'excluirTag', item: painel.item }) : undefined} />}
      {painel.tipo === 'objetivo' && <EditorObjetivo {...editorProps} objetivo={painel.item} excluir={painel.item ? () => abrir({ tipo: 'excluirObjetivo', item: painel.item }) : undefined} />}
      {painel.tipo === 'tags' && <div className="mn-profile-settings"><p>Toque numa tag para editar. As automáticas podem ser ocultadas nas preferências.</p>{perfil.tags.map(tag => <button key={tag.id} onClick={() => abrir({ tipo: 'tag', item: tag })}>{tag.texto}<Icone nome="editar" tamanho={20} /></button>)}{!perfil.tags.length && <p>Você ainda não criou tags personalizadas.</p>}<button onClick={() => abrir({ tipo: 'tag' })}><Icone nome="mais" />Criar tag</button><button onClick={() => abrir({ tipo: 'visibilidade' })}>Gerenciar tags automáticas →</button></div>}
      {['excluirTag', 'excluirObjetivo'].includes(painel.tipo) && <div><p>Deseja excluir {painel.tipo === 'excluirTag' ? `a tag “${painel.item.texto}”` : 'este objetivo'}?</p><p className="mn-i-help">Você poderá criar outro quando quiser.</p><div className="mn-i-form-actions"><button className="mn-i-button" disabled={ocupado} onClick={() => salvar(painel.tipo === 'excluirTag' ? 'excluirTag' : 'excluirObjetivo', painel.item.id)}>{ocupado ? 'excluindo…' : 'excluir'}</button><button className="mn-i-text-button" onClick={fechar} disabled={ocupado}>cancelar</button></div></div>}
    </ModalPerfil>}
  </>
}

