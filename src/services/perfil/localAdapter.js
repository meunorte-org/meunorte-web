import { perfilVazio } from '../../domain/perfil.js'

// Adaptador PROVISÓRIO: dados separados por usuário, apenas neste navegador.
// Contrato substituível por tabelas protegidas com RLS e Supabase Storage.
export function criarAdaptadorLocal(storage) {
  function chave(id) { if (!id) throw new Error('Entre na sua conta para continuar.'); return `meunorte:perfil:v1:${id}` }
  return {
    async carregar(id) {
      try {
        const dado = JSON.parse((storage ?? globalThis.localStorage).getItem(chave(id)) ?? 'null')
        const base = perfilVazio()
        if (!dado || dado.versao !== 1) return base
        if (typeof dado.bio !== 'string' || ['tags', 'objetivos', 'areasFavoritas', 'faculdadesSalvas'].some(campo => !Array.isArray(dado[campo]))) throw new Error('Formato inválido')
        return { ...base, ...dado, visibilidade: { ...base.visibilidade, ...dado.visibilidade } }
      } catch { throw new Error('Não foi possível carregar o perfil deste navegador. Tente novamente.') }
    },
    async salvar(id, perfil) {
      try { (storage ?? globalThis.localStorage).setItem(chave(id), JSON.stringify(perfil)); return perfil }
      catch { throw new Error('Não foi possível salvar neste navegador. Verifique o espaço disponível e tente novamente.') }
    },
  }
}

function abrirBanco() {
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open('meunorte-perfil-local', 1)
    pedido.onupgradeneeded = () => pedido.result.createObjectStore('fotos')
    pedido.onsuccess = () => resolve(pedido.result)
    pedido.onerror = () => reject(new Error('Não foi possível acessar as fotos neste navegador.'))
  })
}
async function fotoLocal(modo, chave, blob) {
  const db = await abrirBanco()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('fotos', modo === 'ler' ? 'readonly' : 'readwrite')
      const store = tx.objectStore('fotos')
      const pedido = modo === 'ler' ? store.get(chave) : modo === 'salvar' ? store.put(blob, chave) : store.delete(chave)
      tx.oncomplete = () => resolve(pedido.result ?? null)
      tx.onerror = tx.onabort = () => reject(new Error('Não foi possível salvar a foto. Tente uma imagem menor.'))
    })
  } finally { db.close() }
}
export const fotosLocais = {
  carregar: (usuarioId, fotoId) => fotoLocal('ler', `${usuarioId}:${fotoId}`),
  salvar: (usuarioId, fotoId, blob) => fotoLocal('salvar', `${usuarioId}:${fotoId}`, blob),
  excluir: (usuarioId, fotoId) => fotoLocal('excluir', `${usuarioId}:${fotoId}`),
}
