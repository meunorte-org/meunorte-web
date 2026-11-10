# Cadastro: nome e data de nascimento

`App.jsx` abre `pages/Cadastro/Cadastro.jsx` pelo botão cadastro da apresentação.
Cadastro-Transição é a animação de entrada da própria página: textos entram pela esquerda;
depois o painel sobe e o cabeçalho ocupa sua posição final. Não há uma rota intermediária.

## Estrutura para continuar

- `Cadastro.jsx`: guarda os dados e coordena as etapas. Manter este componente montado ao avançar.
- `CampoCadastro`: painel e barra compartilhados. Trocar somente seus filhos e a propriedade `etapa`.
- `etapas/EtapaNome.jsx`: formulário da etapa 1, com input nativo, autocomplete e botão voltar.
- `etapas/EtapaData.jsx`: etapa 2, com seletor nativo de data, validação de calendário e bloqueio de datas futuras.
- `InputData`: mostra a data em DD/MM/AAAA; seu input nativo guarda YYYY-MM-DD.
- `InputDigitacao`: aparência padrão e rótulo flutuante ao focar/preencher.
- `BotaoContinuar`: reutiliza a base dos botões existentes; as setas verdes são exports originais do Figma.

A barra tem sete divisões conforme o desenho (incluindo a conclusão); `totalEtapas` pode ser ajustado.
A largura preenchida tem transição para os próximos passos.

## Dados e Supabase

Os campos têm `name="full_name"` e `name="birth_date"`. Os valores permanecem no estado
React de `Cadastro.jsx`, inclusive ao voltar para o nome e avançar novamente para a data.
`concluirEtapaNome` normaliza espaços e abre a etapa 2, sem desmontar cabeçalho, painel ou barra.
`concluirEtapaData` entrega `{ full_name, birth_date }` ao callback `onEtapaConcluida`.
Esse callback é o ponto explícito para conectar a próxima etapa. O App ainda não o conecta:
apenas as duas primeiras telas foram solicitadas, então Continuar da data não avança para a etapa 3.
Datas são strings YYYY-MM-DD, prontas para uma coluna DATE, sem conversão UTC que altere o dia.
Não foi definida restrição de idade; não são aceitas datas impossíveis ou futuras.
Não há criação de conta, requisição ao Supabase nem mensagem de sucesso de cadastro nestas etapas.

Ao implementar o último passo, centralizar o envio em um serviço de autenticação separado:
`supabase.auth.signUp({ email, password, options: { data: { full_name } } })`.
Esse exemplo é o contrato previsto, não uma integração já executável. Confirmar os campos de
perfil e políticas com a equipe responsável. Nunca salvar senha em localStorage, logs ou tabela de perfil.
