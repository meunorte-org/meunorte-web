import test from 'node:test'
import assert from 'node:assert/strict'
import { acompanharRecuperacao } from '../src/lib/acompanharRecuperacao.js'
import { criarServicoAuth, urlRetornoConfirmacao } from '../src/services/auth.js'

const dados = { full_name: ' Pessoa Teste ', birth_date: '2000-01-15', education_level: 'medio_concluido', email: ' PESSOA@example.com ', password: 'SenhaDeTeste123!' }
const retorno = () => 'https://meunorte-org.github.io/meunorte-web/?auth=confirmacao'

test('edição de nome modifica apenas full_name e preserva autenticação', async () => {
  let recebido
  const servico = criarServicoAuth({ auth: { updateUser: async valor => { recebido = valor; return { data: { user: { id: 'pessoa' } } } } } })
  await servico.atualizarNome(' Pessoa   Teste ')
  assert.deepEqual(recebido, { data: { full_name: 'Pessoa Teste' } })
  await assert.rejects(servico.atualizarNome(' '))
  await assert.rejects(servico.atualizarNome('a'.repeat(101)))
})

test('link válido aguarda PASSWORD_RECOVERY emitido depois de getSession', async () => {
  let notificar
  const auth = {
    onAuthStateChange: callback => { notificar = callback },
    getSession: async () => {
      setTimeout(() => notificar('PASSWORD_RECOVERY', { user: { id: 'pessoa' } }), 20)
      return { data: { session: {} } }
    },
    getUser: async () => ({ data: { user: { id: 'pessoa', email: 'pessoa@example.com' } } }),
  }
  const aguardar = acompanharRecuperacao(auth, { recuperacao: true }, 200)
  const servico = criarServicoAuth({ auth }, retorno, aguardar)
  assert.deepEqual(await servico.verificarRecuperacao(), { email: 'pessoa@example.com' })
  assert.equal((await aguardar()).usuarioRecuperacaoId, 'pessoa')
})

test('INITIAL_SESSION com sessão antiga não substitui evento de recuperação', async () => {
  let notificar
  const auth = { onAuthStateChange: callback => { notificar = callback } }
  const aguardar = acompanharRecuperacao(auth, { recuperacao: true }, 25)
  const verificacao = aguardar()
  notificar('INITIAL_SESSION', { user: { id: 'pessoa' } })
  assert.equal((await verificacao).usuarioRecuperacaoId, null)
  notificar('PASSWORD_RECOVERY', { user: { id: 'pessoa' } })
  assert.equal((await aguardar()).usuarioRecuperacaoId, 'pessoa')
  notificar('SIGNED_OUT', null)
  assert.equal((await aguardar()).usuarioRecuperacaoId, null)
})

test('recuperação envia endereço normalizado e retorno próprio, preservando subpasta', async () => {
  let recebido
  const servico = criarServicoAuth({ auth: { resetPasswordForEmail: async (...args) => { recebido = args; return {} } } }, retorno)
  assert.deepEqual(await servico.recuperarSenha(' PESSOA@example.com '), { requestAccepted: true })
  assert.deepEqual(recebido, ['pessoa@example.com', { redirectTo: 'https://meunorte-org.github.io/meunorte-web/?auth=recuperacao' }])
})

test('falha no envio de recuperação não é apresentada como link enviado', async () => {
  const servico = criarServicoAuth({ auth: { resetPasswordForEmail: async () => ({ error: { code: 'over_request_rate_limit' } }) } }, retorno)
  await assert.rejects(servico.recuperarSenha('pessoa@example.com'), erro => erro.mensagemPublica.includes('tentativas'))
})

function authRecuperacao(overrides = {}, contexto = { recuperacao: true, usuarioRecuperacaoId: 'pessoa' }) {
  return criarServicoAuth({ auth: {
    getSession: async () => ({ data: { session: {} } }),
    getUser: async () => ({ data: { user: { id: 'pessoa', email: 'pessoa@example.com' } } }),
    updateUser: async () => ({ data: { user: { id: 'pessoa' } } }),
    ...overrides,
  } }, retorno, () => contexto)
}

test('somente query ou sessão antiga não permitem redefinição', async () => {
  let atualizou = false
  for (const contexto of [{ recuperacao: true }, { recuperacao: true, usuarioRecuperacaoId: 'outro' }, { recuperacao: true, usuarioRecuperacaoId: 'pessoa', erro: true }]) {
    await assert.rejects(authRecuperacao({ updateUser: async () => { atualizou = true } }, contexto).atualizarSenha('NovaSenha123!'))
  }
  assert.equal(atualizou, false)
})

test('sessão de recuperação é validada no servidor antes de alterar senha', async () => {
  let recebido
  const servico = authRecuperacao({ updateUser: async valor => { recebido = valor; return { data: { user: { id: 'pessoa' } } } } })
  assert.deepEqual(await servico.atualizarSenha('NovaSenha123!'), { passwordUpdated: true })
  assert.deepEqual(recebido, { password: 'NovaSenha123!' })
  await assert.rejects(authRecuperacao({ getUser: async () => ({ error: {} }) }).atualizarSenha('NovaSenha123!'))
})

test('senha anterior, curta e falhas do servidor não simulam redefinição bem-sucedida', async () => {
  await assert.rejects(authRecuperacao().atualizarSenha('curta'))
  await assert.rejects(authRecuperacao({ updateUser: async () => ({ error: { code: 'same_password' } }) }).atualizarSenha('NovaSenha123!'), erro => erro.mensagemPublica.includes('diferente'))
  await assert.rejects(authRecuperacao({ updateUser: async () => { throw new Error('rede') } }).atualizarSenha('NovaSenha123!'))
})

test('login normaliza e-mail, preserva senha e exige sessão confirmada', async () => {
  let recebido
  const servico = criarServicoAuth({ auth: { signInWithPassword: async valor => {
    recebido = valor
    return { data: { session: { access_token: 'teste' }, user: { email: 'pessoa@example.com', email_confirmed_at: 'agora' } } }
  } } })
  assert.deepEqual(await servico.entrar({ email: ' PESSOA@example.com ', password: ' senha ' }), { email: 'pessoa@example.com' })
  assert.deepEqual(recebido, { email: 'pessoa@example.com', password: ' senha ' })
})

test('login incorreto mostra mensagem segura e nunca libera sucesso', async () => {
  const servico = criarServicoAuth({ auth: { signInWithPassword: async () => ({ error: { code: 'invalid_credentials', message: 'interno' } }) } })
  await assert.rejects(servico.entrar(dados), erro => erro.mensagemPublica === 'E-mail ou senha incorretos. Confira os dados e tente novamente.')
})

test('login sem sessão, não confirmado e falha de rede não liberam sucesso', async () => {
  for (const resposta of [{ data: {} }, { data: { session: {}, user: {} } }, { error: { code: 'email_not_confirmed' } }]) {
    const servico = criarServicoAuth({ auth: { signInWithPassword: async () => resposta } })
    await assert.rejects(servico.entrar(dados), erro => Boolean(erro.mensagemPublica))
  }
  const servico = criarServicoAuth({ auth: { signInWithPassword: async () => { throw new Error('rede') } } })
  await assert.rejects(servico.entrar(dados), erro => erro.mensagemPublica.includes('conexão'))
})

test('cadastro usa Auth e não coloca senha nos metadados', async () => {
  let recebido
  const servico = criarServicoAuth({ auth: { signUp: async valor => {
    recebido = valor
    return { data: { user: { confirmation_sent_at: '2026-11-14T00:00:00Z' }, session: null }, error: null }
  } } }, retorno)
  const resultado = await servico.cadastrar(dados)
  assert.equal(recebido.email, 'pessoa@example.com')
  assert.equal(recebido.password, dados.password)
  assert.equal(recebido.options.emailRedirectTo, retorno())
  assert.deepEqual(recebido.options.data, { full_name: 'Pessoa Teste', birth_date: dados.birth_date, education_level: dados.education_level })
  assert.equal(resultado.confirmationEmailSent, true)
})

test('resposta genérica não confirma envio nem revela conta existente', async () => {
  const servico = criarServicoAuth({ auth: { signUp: async () => ({ data: { user: { identities: [] }, session: null }, error: null }) } }, retorno)
  assert.deepEqual(await servico.cadastrar(dados), { confirmationEmailSent: false, alreadyConfirmed: false, requestAccepted: true })
})

test('sessão criada sem confirmação de e-mail não é apresentada como e-mail enviado', async () => {
  const servico = criarServicoAuth({ auth: { signUp: async () => ({ data: { user: { email_confirmed_at: 'agora' }, session: { user: {} } }, error: null }) } }, retorno)
  const resultado = await servico.cadastrar(dados)
  assert.equal(resultado.confirmationEmailSent, false)
  assert.equal(resultado.alreadyConfirmed, true)
})

test('erros do provedor são traduzidos e não retornados diretamente à pessoa', async () => {
  const servico = criarServicoAuth({ auth: { signUp: async () => ({ error: { code: 'over_email_send_rate_limit', message: 'detalhes internos' } }) } }, retorno)
  await assert.rejects(servico.cadastrar(dados), erro => erro.mensagemPublica.includes('Aguarde') && !erro.mensagemPublica.includes('internos'))
})

test('falha de conexão não produz sucesso', async () => {
  const servico = criarServicoAuth({ auth: { signUp: async () => { throw new TypeError('Failed to fetch') } } }, retorno)
  await assert.rejects(servico.cadastrar(dados), erro => Boolean(erro.mensagemPublica))
})

test('reenvio usa tipo signup e o mesmo retorno do cadastro', async () => {
  let recebido
  const servico = criarServicoAuth({ auth: { resend: async valor => { recebido = valor; return { error: null } } } }, retorno)
  await servico.reenviarConfirmacao(' PESSOA@example.com ')
  assert.deepEqual(recebido, { type: 'signup', email: 'pessoa@example.com', options: { emailRedirectTo: retorno() } })
})

test('retorno no GitHub Pages preserva a subpasta e não inclui dados do cadastro', () => {
  assert.equal(urlRetornoConfirmacao('https://meunorte-org.github.io', '/meunorte-web/'), retorno())
  assert.equal(urlRetornoConfirmacao('http://localhost:5173', '/'), 'http://localhost:5173/?auth=confirmacao')
})

test('link sem sessão não é tratado como confirmação', async () => {
  let validou = false
  const servico = criarServicoAuth({ auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => { validou = true },
  } })
  await assert.rejects(servico.verificarConfirmacao(), erro => Boolean(erro.mensagemPublica))
  assert.equal(validou, false)
})

test('sessão precisa de validação remota e e-mail confirmado', async () => {
  const servico = criarServicoAuth({ auth: {
    getSession: async () => ({ data: { session: {} }, error: null }),
    getUser: async () => ({ data: { user: { email: 'pessoa@example.com', email_confirmed_at: 'agora' } }, error: null }),
  } })
  assert.deepEqual(await servico.verificarConfirmacao(), { email: 'pessoa@example.com' })
})

test('sessão antiga ou usuário ainda não confirmado não libera sucesso', async () => {
  const servico = criarServicoAuth({ auth: {
    getSession: async () => ({ data: { session: {} }, error: null }),
    getUser: async () => ({ data: { user: { email: 'pessoa@example.com', email_confirmed_at: null } }, error: null }),
  } })
  await assert.rejects(servico.verificarConfirmacao(), erro => Boolean(erro.mensagemPublica))
})

test('configuração ausente não tenta enviar cadastro', async () => {
  await assert.rejects(criarServicoAuth(null, retorno).cadastrar(dados), erro => Boolean(erro.mensagemPublica))
})

test('sair encerra apenas a sessão deste navegador', async () => {
  let opcoes
  const servico = criarServicoAuth({ auth: { signOut: async valor => { opcoes = valor; return { error: null } } } })
  await servico.sair()
  assert.deepEqual(opcoes, { scope: 'local' })
})

test('consulta de e-mail usa apenas RPC e endereço normalizado', async () => {
  let recebido
  const servico = criarServicoAuth({ rpc: async (...args) => { recebido = args; return { data: true, error: null } } })
  assert.equal(await servico.emailJaCadastrado(' PESSOA@example.com '), true)
  assert.deepEqual(recebido, ['email_ja_cadastrado', { email_consulta: 'pessoa@example.com' }])
})

test('falha na consulta nunca é tratada como endereço livre', async () => {
  const servico = criarServicoAuth({ rpc: async () => ({ data: null, error: { code: 'PGRST202' } }) })
  await assert.rejects(servico.emailJaCadastrado('pessoa@example.com'), erro => erro.mensagemPublica.includes('verificar'))
})

test('resposta inesperada não libera cadastro', async () => {
  const servico = criarServicoAuth({ rpc: async () => ({ data: 'false', error: null }) })
  await assert.rejects(servico.emailJaCadastrado('pessoa@example.com'))
})
