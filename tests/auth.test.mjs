import test from 'node:test'
import assert from 'node:assert/strict'
import { criarServicoAuth, urlRetornoConfirmacao } from '../src/services/auth.js'

const dados = { full_name: ' Pessoa Teste ', birth_date: '2000-01-15', education_level: 'medio_concluido', email: ' PESSOA@example.com ', password: 'SenhaDeTeste123!' }
const retorno = () => 'https://meunorte-org.github.io/meunorte-web/?auth=confirmacao'

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
