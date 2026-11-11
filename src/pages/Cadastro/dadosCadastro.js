// Datas trafegam como YYYY-MM-DD (DATE), sem horário nem conversão de fuso.
export function dataLocalISO(agora = new Date()) {
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`
}

export function dataNascimentoValida(valor, hoje = dataLocalISO()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false
  const [ano, mes, dia] = valor.split('-').map(Number)
  if (ano < 1 || mes < 1 || mes > 12 || dia < 1) return false
  const bissexto = ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)
  const diasNoMes = [31, bissexto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return dia <= diasNoMes[mes - 1] && valor <= hoje
}

export function formatarDataNascimento(valor) {
  if (!valor) return ''
  return valor.split('-').reverse().join('/')
}

export function calcularIdade(valor, hoje = dataLocalISO()) {
  if (!dataNascimentoValida(valor, hoje)) return null
  const [ano, mes, dia] = valor.split('-').map(Number)
  const [anoAtual, mesAtual, diaAtual] = hoje.split('-').map(Number)
  const aniversarioPendente = mesAtual < mes || (mesAtual === mes && diaAtual < dia)
  return anoAtual - ano - (aniversarioPendente ? 1 : 0)
}

// Formato de e-mail aceito pelo input HTML, com domínio público contendo ponto.
// A existência do endereço será confirmada pelo link enviado pelo Supabase.
export function emailValido(valor) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(valor.trim())
}

export function senhaValida(senha) {
  return Array.from(senha).length >= 8
}

export function senhasConferem(senha, confirmacao) {
  return senhaValida(senha) && senha === confirmacao
}
