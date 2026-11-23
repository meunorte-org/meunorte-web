import { supabase } from '../../lib/supabaseClient.js'
import { perfilVazio } from '../../domain/perfil.js'

const BUCKET = 'profile-photos'
function exigirSupabase() {
  if (!supabase) throw new Error('A conexão com o Supabase não está configurada. Confira o arquivo .env.local.')
  return supabase
}
function checar(resultado, mensagem) {
  if (resultado?.error) throw new Error(resultado.error.message || mensagem)
  return resultado?.data
}
function caminhoFoto(uid, fotoId) { return `${uid}/${fotoId}` }

export function criarAdaptadorSupabase() {
  return {
    async carregar(uid) {
      const db = exigirSupabase()
      if (!uid) throw new Error('Entre na sua conta para continuar.')
      const base = perfilVazio()
      const [perfilR, prefR, tagsR, goalsR, favAreasR, favInstitutionsR, resultR] = await Promise.all([
        db.from('profiles').select('*').eq('id', uid).maybeSingle(),
        db.from('user_preferences').select('*').eq('user_id', uid).maybeSingle(),
        db.from('custom_tags').select('*').eq('user_id', uid).order('position'),
        db.from('user_goals').select('*').eq('user_id', uid).order('position'),
        db.from('user_favorite_areas').select('area_id').eq('user_id', uid),
        db.from('user_favorite_institutions').select('institution_id').eq('user_id', uid),
        db.from('vocational_results').select('*').eq('user_id', uid).maybeSingle(),
      ])
      const perfilRow = checar(perfilR, 'Não foi possível carregar seu perfil.')
      const pref = checar(prefR, 'Não foi possível carregar suas preferências.')
      const tags = checar(tagsR, 'Não foi possível carregar suas tags.') ?? []
      const objetivos = checar(goalsR, 'Não foi possível carregar seus objetivos.') ?? []
      const areaIds = (checar(favAreasR, 'Não foi possível carregar áreas favoritas.') ?? []).map(x => x.area_id)
      const institutionIds = (checar(favInstitutionsR, 'Não foi possível carregar faculdades favoritas.') ?? []).map(x => x.institution_id)
      const resultado = checar(resultR, 'Não foi possível carregar seu teste vocacional.')
      if (!perfilRow) throw new Error('Seu perfil ainda não foi criado. Saia e entre novamente ou peça ajuda à equipe.')

      const [areasNamesR, institutionsR] = await Promise.all([
        areaIds.length ? db.from('knowledge_areas').select('id,name').in('id', areaIds) : Promise.resolve({ data: [], error: null }),
        institutionIds.length ? db.from('institutions').select('id,name').in('id', institutionIds) : Promise.resolve({ data: [], error: null }),
      ])
      const areasNames = checar(areasNamesR, 'Não foi possível carregar nomes das áreas.') ?? []
      const institutions = checar(institutionsR, 'Não foi possível carregar nomes das faculdades.') ?? []
      const areaById = new Map(areasNames.map(a => [a.id, a.name]))
      const institutionById = new Map(institutions.map(i => [i.id, i.name]))

      return {
        ...base,
        bio: perfilRow.bio ?? '',
        avatar: perfilRow.avatar_kind === 'oficial' && perfilRow.avatar_id
          ? { tipo: 'oficial', id: perfilRow.avatar_id }
          : perfilRow.avatar_kind === 'foto' && perfilRow.photo_id
            ? { tipo: 'foto', id: perfilRow.photo_id }
            : null,
        _revision: Number(perfilRow.revision ?? 0),
        visibilidade: {
          ocupacao: pref?.show_occupation ?? true,
          idade: pref?.show_age ?? true,
          afinidade: pref?.show_affinity ?? true,
        },
        tags: tags.map(t => ({ id: t.id, texto: t.texto, cor: t.cor })),
        objetivos: objetivos.map(o => ({ id: o.id, titulo: o.title, texto: o.body, usuarioId: o.user_id, criadoEm: o.created_at, atualizadoEm: o.updated_at })),
        areasFavoritas: areaIds.map(id => ({ id, nome: areaById.get(id) ?? id })),
        faculdadesSalvas: institutionIds.map(id => ({ id, nome: institutionById.get(id) ?? id })),
        areaAfinidade: resultado?.principal_area_id ?? null,
        resultadoAfinidade: resultado ? {
          versao: resultado.version,
          pontos: resultado.scores,
          evidencias: resultado.evidence,
          principais: resultado.principal_areas,
          secundarias: resultado.secondary_areas,
          suficiente: resultado.sufficient,
          informativas: resultado.informative_answers,
          areaPrincipal: resultado.principal_area_id,
          concluidoEm: resultado.completed_at,
        } : undefined,
      }
    },

    async salvar(uid, perfil) {
      const db = exigirSupabase()
      if (!uid) throw new Error('Entre na sua conta para continuar.')
      // Profile and preferences are updated; the Auth trigger creates these rows.
      const avatar = perfil.avatar
      const profilePayload = {
        bio: perfil.bio ?? '',
        avatar_kind: avatar?.tipo ?? null,
        avatar_id: avatar?.tipo === 'oficial' ? avatar.id : null,
        photo_id: avatar?.tipo === 'foto' ? avatar.id : null,
        photo_path: avatar?.tipo === 'foto' ? caminhoFoto(uid, avatar.id) : null,
        revision: Number(perfil._revision ?? 0) + 1,
      }
      checar(await db.from('profiles').update(profilePayload).eq('id', uid), 'Não foi possível salvar o perfil.')
      checar(await db.from('user_preferences').upsert({
        user_id: uid,
        show_occupation: perfil.visibilidade?.ocupacao !== false,
        show_age: perfil.visibilidade?.idade !== false,
        show_affinity: perfil.visibilidade?.afinidade !== false,
      }, { onConflict: 'user_id' }), 'Não foi possível salvar as preferências.')

      // Replace ordered collections. RLS scopes all rows to this signed-in user.
      checar(await db.from('custom_tags').delete().eq('user_id', uid), 'Não foi possível atualizar suas tags.')
      if (perfil.tags?.length) checar(await db.from('custom_tags').insert(perfil.tags.map((t, position) => ({
        id: t.id, user_id: uid, texto: t.texto, normalized_text: normalize(t.texto), cor: t.cor, position,
      }))), 'Não foi possível salvar suas tags.')

      checar(await db.from('user_goals').delete().eq('user_id', uid), 'Não foi possível atualizar seus objetivos.')
      if (perfil.objetivos?.length) checar(await db.from('user_goals').insert(perfil.objetivos.map((o, position) => ({
        id: o.id, user_id: uid, title: o.titulo ?? '', body: o.texto, position,
        ...(o.criadoEm ? { created_at: o.criadoEm } : {}),
      }))), 'Não foi possível salvar seus objetivos.')

      checar(await db.from('user_favorite_areas').delete().eq('user_id', uid), 'Não foi possível atualizar suas áreas favoritas.')
      if (perfil.areasFavoritas?.length) checar(await db.from('user_favorite_areas').insert(perfil.areasFavoritas.map(a => ({ user_id: uid, area_id: a.id }))), 'Não foi possível salvar áreas favoritas.')

      checar(await db.from('user_favorite_institutions').delete().eq('user_id', uid), 'Não foi possível atualizar suas faculdades favoritas.')
      if (perfil.faculdadesSalvas?.length) checar(await db.from('user_favorite_institutions').insert(perfil.faculdadesSalvas.map(f => ({ user_id: uid, institution_id: f.id }))), 'Não foi possível salvar faculdades favoritas.')

      if (perfil.resultadoAfinidade) {
        const r = perfil.resultadoAfinidade
        checar(await db.from('vocational_results').upsert({
          user_id: uid,
          version: r.versao ?? 1,
          scores: r.pontos ?? {},
          evidence: r.evidencias ?? {},
          principal_area_id: r.areaPrincipal ?? null,
          principal_areas: r.principais ?? [],
          secondary_areas: r.secundarias ?? [],
          informative_answers: r.informativas ?? 0,
          sufficient: r.suficiente ?? false,
          completed_at: r.concluidoEm ?? new Date().toISOString(),
        }, { onConflict: 'user_id' }), 'Não foi possível salvar seu resultado vocacional.')
      } else {
        checar(await db.from('vocational_results').delete().eq('user_id', uid), 'Não foi possível remover seu resultado vocacional.')
      }
      return { ...perfil, _revision: profilePayload.revision }
    },
  }
}

function normalize(texto) {
  return String(texto ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
}

export const fotosSupabase = {
  async salvar(uid, fotoId, blob) {
    const db = exigirSupabase()
    const path = caminhoFoto(uid, fotoId)
    checar(await db.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, upsert: false }), 'Não foi possível enviar sua foto.')
    return path
  },
  async carregar(uid, fotoId) {
    const db = exigirSupabase()
    const path = caminhoFoto(uid, fotoId)
    const { data, error } = await db.storage.from(BUCKET).download(path)
    if (error) throw new Error(error.message || 'Não foi possível carregar sua foto.')
    return data
  },
  async excluir(uid, fotoId) {
    const db = exigirSupabase()
    const path = caminhoFoto(uid, fotoId)
    checar(await db.storage.from(BUCKET).remove([path]), 'Não foi possível remover sua foto.')
  },
}
