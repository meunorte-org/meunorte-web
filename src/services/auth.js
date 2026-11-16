import { supabase, contextoRecuperacao } from '../lib/supabaseClient.js'

const MENSAGENS = {
  invalid_credentials: 'E-mail ou senha incorretos. Confira os dados e tente novamente.',
  email_not_confirmed: 'Confirme seu e-mail pelo link enviado antes de entrar.',
  over_email_send_rate_limit: 'Aguarde um pouco antes de solicitar outro e-mail de confirmação.',
  over_request_rate_limit: 'Foram feitas muitas tentativas. Aguarde um pouco e tente novamente.',
  email_address_not_authorized: 'O envio ainda não está liberado para este endereço. Entre em contato com a equipe MeuNorte.',
  email_address_invalid: 'Confira o endereço de e-mail e tente novamente.',
  weak_password: 'A senha não atende às regras de segurança. Volte à etapa da senha e escolha outra.',
  signup_disabled: 'O cadastro está temporariamente indisponível. Tente novamente mais tarde.',
  user_already_exists: 'Não foi possível concluir este cadastro. Se já tem uma conta, use a opção de entrar.',
}

export function erroPublico(erro, padrao = 'Não foi possível concluir a solicitação. Tente novamente.') {
  const publico = new Error(padrao)
  publico.mensagemPublica = MENSAGENS[erro?.code] ?? padrao
  return publico
}

export function urlRetornoConfirmacao(origem = window.location.origin, base = import.meta.env?.BASE_URL ?? '/') {
  const url = new URL(base, origem)
  url.searchParams.set('auth', 'confirmacao')
  return url.href
}

export function criarServicoAuth(cliente, obterRetorno = urlRetornoConfirmacao, obterContextoRecuperacao = contextoRecuperacao) {
  function auth() {
    if (!cliente) throw erroPublico(null, 'O cadastro ainda não está disponível. Entre em contato com a equipe MeuNorte.')
    return cliente.auth
  }

  async function cadastrar({ full_name, birth_date, education_level, email, password }) {
    let resposta
    try {
      resposta = await auth().signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: obterRetorno(),
          // Informações de perfil, nunca senhas, papéis administrativos ou permissões.
          data: { full_name: full_name.trim(), birth_date, education_level },
        },
      })
    } catch (erro) {
      if (erro.mensagemPublica) throw erro
      throw erroPublico(erro)
    }
    if (resposta.error) throw erroPublico(resposta.error)
    const { user, session } = resposta.data ?? {}
    // Um retorno sem erro também pode ocultar uma conta existente. Não deduzir
    // envio apenas da presença de um usuário, nem expor se ele já estava cadastrado.
    return {
      confirmationEmailSent: Boolean(user?.confirmation_sent_at && !session),
      alreadyConfirmed: Boolean(session && user?.email_confirmed_at),
      requestAccepted: true,
    }
  }

  async function reenviarConfirmacao(email) {
    let resposta
    try {
      resposta = await auth().resend({
        type: 'signup', email: email.trim().toLowerCase(),
        options: { emailRedirectTo: obterRetorno() },
      })
    } catch (erro) {
      if (erro.mensagemPublica) throw erro
      throw erroPublico(erro)
    }
    if (resposta.error) throw erroPublico(resposta.error)
    return { requestAccepted: true }
  }

  async function verificarConfirmacao() {
    try {
      const { data, error } = await auth().getSession()
      if (error || !data.session) throw erroPublico(null, 'Não foi possível confirmar este link. Ele pode ter expirado ou já ter sido utilizado.')
      // A validação remota evita tratar apenas dados salvos no navegador como confirmação.
      const usuario = await auth().getUser()
      if (usuario.error || !usuario.data.user?.email_confirmed_at) throw erroPublico(null, 'Não foi possível confirmar seu e-mail. Solicite um novo link e tente novamente.')
      return { email: usuario.data.user.email }
    } catch (erro) {
      if (erro.mensagemPublica) throw erro
      throw erroPublico(null, 'Não foi possível verificar o link agora. Confira sua conexão e tente novamente.')
    }
  }

  async function sair() {
    try {
      const { error } = await auth().signOut({ scope: 'local' })
      if (error) throw error
    } catch {
      throw erroPublico(null, 'Não foi possível sair da conta. Tente novamente.')
    }
  }

  async function emailJaCadastrado(email) {
    try {
      if (!cliente) throw new Error('Configuração ausente')
      const { data, error } = await cliente.rpc('email_ja_cadastrado', { email_consulta: email.trim().toLowerCase() })
      if (error || typeof data !== 'boolean') throw error ?? new Error('Resposta inválida')
      return data
    } catch {
      throw erroPublico(null, 'Não foi possível verificar o e-mail. Tente novamente.')
    }
  }

  async function entrar({ email, password }) {
    try {
      const { data, error } = await auth().signInWithPassword({ email: email.trim().toLowerCase(), password })
      if (error) throw erroPublico(error, 'Não foi possível entrar agora. Tente novamente.')
      if (!data?.session || !data.user?.email_confirmed_at) throw erroPublico(null, 'Confirme seu e-mail antes de entrar.')
      return { email: data.user.email }
    } catch (erro) {
      if (erro.mensagemPublica) throw erro
      throw erroPublico(null, 'Não foi possível entrar agora. Confira sua conexão e tente novamente.')
    }
  }

  async function recuperarSenha(email) {
    try {
      const url = new URL(obterRetorno())
      url.searchParams.set('auth', 'recuperacao')
      const { error } = await auth().resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: url.href })
      if (error) throw erroPublico(error, 'Não foi possível solicitar o link. Tente novamente.')
      return { requestAccepted: true }
    } catch (erro) {
      if (erro.mensagemPublica) throw erro
      throw erroPublico(null, 'Não foi possível solicitar o link. Confira sua conexão e tente novamente.')
    }
  }

  async function verificarRecuperacao() {
    try {
      const { data, error } = await auth().getSession()
      const contexto = await obterContextoRecuperacao()
      if (error || !data?.session || contexto.erro || !contexto.recuperacao || !contexto.usuarioRecuperacaoId) throw new Error('Link inválido')
      const usuario = await auth().getUser()
      if (usuario.error || usuario.data?.user?.id !== contexto.usuarioRecuperacaoId) throw new Error('Sessão inválida')
      return { email: usuario.data.user.email }
    } catch {
      throw erroPublico(null, 'Este link é inválido ou expirou. Solicite um novo link de recuperação.')
    }
  }

  async function atualizarSenha(password) {
    if (Array.from(password).length < 8) throw erroPublico(null, 'Use pelo menos 8 caracteres na nova senha.')
    await verificarRecuperacao()
    try {
      const { data, error } = await auth().updateUser({ password })
      if (error?.code === 'same_password') throw erroPublico(null, 'Escolha uma senha diferente da anterior.')
      if (error?.code === 'weak_password') throw erroPublico(null, 'A nova senha não atende às regras de segurança.')
      if (error || !data?.user) throw erroPublico(error, 'Não foi possível criar sua nova senha. Tente novamente.')
      return { passwordUpdated: true }
    } catch (erro) {
      if (erro.mensagemPublica) throw erro
      throw erroPublico(null, 'Não foi possível criar sua nova senha. Confira sua conexão e tente novamente.')
    }
  }

  async function atualizarNome(nome) {
    if (typeof nome !== 'string') throw erroPublico(null, 'Informe um nome de até 100 caracteres.')
    const full_name = nome.trim().replace(/\s+/g, ' ')
    if (!full_name || Array.from(full_name).length > 100) throw erroPublico(null, 'Informe um nome de até 100 caracteres.')
    try {
      const { data, error } = await auth().updateUser({ data: { full_name } })
      if (error || !data?.user) throw new Error('Falha ao atualizar')
      return data.user
    } catch { throw erroPublico(null, 'Não foi possível atualizar seu nome. Tente novamente.') }
  }
  return { cadastrar, reenviarConfirmacao, verificarConfirmacao, sair, emailJaCadastrado, entrar, recuperarSenha, verificarRecuperacao, atualizarSenha, atualizarNome }
}

export const servicoAuth = criarServicoAuth(supabase)
// Ativar somente depois de instalar a função SQL no projeto Supabase.
export const verificacaoEmailAtiva = import.meta.env?.VITE_EMAIL_CHECK_ENABLED === 'true'
