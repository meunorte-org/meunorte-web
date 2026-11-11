// Valores estáveis para education_level. Confirmar estes códigos com a equipe do Supabase.
export const OPCOES_ESTUDO = [
  { valor: 'fundamental', texto: 'ensino fundamental' },
  { valor: 'medio_cursando', texto: 'ensino médio (cursando)' },
  { valor: 'medio_concluido', texto: 'ensino médio concluído' },
  { valor: 'superior_cursando', texto: 'ensino superior (cursando)' },
  { valor: 'superior_concluido', texto: 'ensino superior concluído' },
  { valor: 'outra_situacao', texto: 'outra situação' },
]

export function estudoValido(valor) {
  return OPCOES_ESTUDO.some(opcao => opcao.valor === valor)
}
