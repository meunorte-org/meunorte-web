import { useState } from 'react'
import { CORES_TAG, contar, tagsAutomaticas } from '../../../../domain/perfil.js'
import { OPCOES_ESTUDO } from '../../../../data/opcoesEstudo.js'

export function AcoesEditor({ ocupado, salvarDesabilitado = false, onCancelar, excluir }) {
  return <div className="mn-i-form-actions"><button className="mn-i-button" type="submit" disabled={ocupado || salvarDesabilitado}>{ocupado ? 'salvando…' : 'salvar'}</button><button className="mn-i-text-button" type="button" onClick={onCancelar} disabled={ocupado}>cancelar</button>{excluir && <button className="mn-i-text-button mn-i-danger" type="button" onClick={excluir} disabled={ocupado}>excluir</button>}</div>
}
export function EditorBio({ perfil, salvar, cancelar, ocupado }) {
  const [bio, setBio] = useState(perfil.bio)
  return <form onSubmit={e => { e.preventDefault(); salvar('atualizarBio', bio) }}><p>Uma pequena apresentação, do seu jeito.</p><label htmlFor="perfil-bio">Sua bio</label><textarea id="perfil-bio" maxLength={160} rows={4} value={bio} onChange={e => setBio(e.target.value)} /><p className="mn-i-counter">{contar(bio)}/160 caracteres</p><AcoesEditor ocupado={ocupado} onCancelar={cancelar} /></form>
}
export function EditorTag({ tag, salvar, cancelar, ocupado, excluir }) {
  const [texto, setTexto] = useState(tag?.texto ?? '')
  const [cor, setCor] = useState(tag?.cor ?? 'lima')
  return <form onSubmit={e => { e.preventDefault(); salvar('salvarTag', { id: tag?.id, texto, cor }) }}><label htmlFor="tag-texto">Texto da tag</label><input id="tag-texto" value={texto} maxLength={20} required onChange={e => setTexto(e.target.value)} /><p className="mn-i-counter">{contar(texto)}/20 caracteres</p><fieldset><legend>Escolha uma cor</legend><div className="mn-tag-colors">{Object.entries(CORES_TAG).map(([nome, valor]) => <label key={nome} style={{ background: valor }}><input type="radio" name="cor" value={nome} checked={nome === cor} onChange={() => setCor(nome)} /><span>{nome}</span></label>)}</div></fieldset><AcoesEditor ocupado={ocupado} onCancelar={cancelar} excluir={excluir} /></form>
}
export function EditorObjetivo({ objetivo, salvar, cancelar, ocupado, excluir }) {
  const [titulo, setTitulo] = useState(objetivo?.titulo ?? '')
  const [texto, setTexto] = useState(objetivo?.texto ?? '')
  return <form onSubmit={e => { e.preventDefault(); salvar('salvarObjetivo', { id: objetivo?.id, titulo, texto }) }}><p>Guarde uma ideia ou um próximo passo. Não precisa ter tudo decidido.</p><label htmlFor="objetivo-titulo">Título (opcional)</label><input id="objetivo-titulo" value={titulo} maxLength={60} onChange={e => setTitulo(e.target.value)} /><label htmlFor="objetivo-texto">O que você quer fazer?</label><textarea id="objetivo-texto" value={texto} maxLength={600} rows={5} required onChange={e => setTexto(e.target.value)} /><p className="mn-i-counter">{contar(texto)}/600 caracteres</p><AcoesEditor ocupado={ocupado} onCancelar={cancelar} excluir={excluir} /></form>
}
export function EditorVisibilidade({ usuario, perfil, salvar, cancelar, ocupado }) {
  const [visibilidade, setVisibilidade] = useState(perfil.visibilidade)
  const automaticas = tagsAutomaticas(usuario, perfil)
  const nomes = { ocupacao: 'Ocupação', idade: 'Idade', afinidade: 'Área de afinidade' }
  return <form onSubmit={e => { e.preventDefault(); salvar('atualizarVisibilidade', visibilidade) }}><p>Escolha o que aparece no seu perfil. As informações originais são preservadas.</p>{Object.keys(nomes).map(id => <label className="mn-i-check" key={id}><input type="checkbox" checked={visibilidade[id]} onChange={e => setVisibilidade({ ...visibilidade, [id]: e.target.checked })} /><span>{nomes[id]}<small>{automaticas.find(tag => tag.id === id)?.texto ?? (id === 'afinidade' ? 'Disponível após o teste vocacional.' : 'Sem informação no cadastro.')}</small></span></label>)}<p className="mn-i-help">Até 6 tags visíveis, contando as personalizadas.</p><AcoesEditor ocupado={ocupado} onCancelar={cancelar} /></form>
}
export function EditorInformacoes({ usuario, salvarNome, cancelar, ocupado }) {
  const [nome, setNome] = useState(typeof usuario.user_metadata?.full_name === 'string' ? usuario.user_metadata.full_name : '')
  return <form onSubmit={e => { e.preventDefault(); salvarNome(nome) }}><label htmlFor="perfil-nome">Nome completo</label><input id="perfil-nome" value={nome} required maxLength={100} autoComplete="name" onChange={e => setNome(e.target.value)} /><p className="mn-i-counter">{contar(nome)}/100 caracteres</p><dl className="mn-profile-info"><dt>E-mail</dt><dd>{usuario.email}</dd><dt>Etapa de estudos</dt><dd>{OPCOES_ESTUDO.find(o => o.valor === usuario.user_metadata?.education_level)?.texto ?? 'Não informada'}</dd></dl><p className="mn-i-help">Por enquanto, o nome é a informação pessoal que você pode editar aqui. E-mail e dados do cadastro são preservados.</p><AcoesEditor ocupado={ocupado} onCancelar={cancelar} /></form>
}
