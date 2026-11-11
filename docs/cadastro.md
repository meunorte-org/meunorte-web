# Cadastro: nome, data, estudos, e-mail e senha

`App.jsx` abre `pages/Cadastro/Cadastro.jsx` pelo botão cadastro da apresentação.
Cadastro-Transição é a animação de entrada da própria página: textos entram pela esquerda;
depois o painel sobe e o cabeçalho ocupa sua posição final. Não há uma rota intermediária.

## Estrutura para continuar

- `Cadastro.jsx`: guarda os dados e coordena as etapas. Manter este componente montado ao avançar.
- `CampoCadastro`: painel e barra compartilhados. Trocar somente seus filhos e a propriedade `etapa`.
- `etapas/EtapaNome.jsx`: formulário da etapa 1, com input nativo, autocomplete e botão voltar.
- `etapas/EtapaData.jsx`: etapa 2, com seletor nativo de data, validação de calendário e bloqueio de datas futuras.
- `InputData`: mostra a data em DD/MM/AAAA; seu input nativo guarda YYYY-MM-DD.
- `etapas/EtapaEstudos.jsx`: etapa 3, com seletor de situação escolar.
- `InputEstadoEstudo`: lista ampliada, animação de abertura/fechamento e navegação por teclado.
- `data/opcoesEstudo.js`: textos do Figma e códigos estáveis usados em `education_level`.
- `etapas/EtapaSeuEmail.jsx`: etapa 4, com campo de e-mail, teclado adequado no celular e aviso sobre verificação.
- `etapas/EtapaCriarSenha.jsx`: etapa 5, com regra de 8 caracteres, confirmação e feedback de divergência ao sair do campo.
- `InputSenha`: compõe o input existente com mostrar/ocultar, asteriscos e variante de erro com ícone original.
- `RegrasSenha`: alterna entre a regra pendente e a checklist verde do Figma.
- `InputDigitacao`: aparência padrão e rótulo flutuante ao focar/preencher.
- `BotaoContinuar`: reutiliza a base dos botões existentes; as setas verdes são exports originais do Figma.

A barra tem sete divisões conforme o desenho (incluindo a conclusão); `totalEtapas` pode ser ajustado.
A largura preenchida tem transição para os próximos passos.

## Dados e Supabase

Os campos têm `name="full_name"`, `name="birth_date"`, `name="education_level"` e `name="email"`. Os valores permanecem no estado
React de `Cadastro.jsx`, inclusive ao voltar para o nome e avançar novamente para a data.
`concluirEtapaNome` normaliza espaços e abre a etapa 2, sem desmontar cabeçalho, painel ou barra.
`concluirEtapaData` abre a etapa 3; `concluirEtapaEstudos` abre a etapa 4.
`concluirEtapaEmail` remove espaços nas pontas e abre a etapa 5.
`concluirEtapaSenha` entrega `{ full_name, birth_date, education_level, email, password }`
ao callback `onEtapaConcluida`. A confirmação não integra o envio.
Esse callback é o ponto explícito para conectar a próxima etapa. O App ainda não o conecta:
apenas as cinco primeiras telas foram solicitadas, então Continuar da senha ainda não abre a etapa 6.
Datas são strings YYYY-MM-DD, prontas para uma coluna DATE, sem conversão UTC que altere o dia.
Não foi definida restrição de idade; não são aceitas datas impossíveis ou futuras.
Não há criação de conta, requisição ao Supabase nem mensagem de sucesso de cadastro nestas etapas.
O campo de e-mail verifica apenas o formato. A existência do endereço será confirmada pelo link
enviado pelo Supabase no fluxo final; nenhum link é enviado ao preencher esta etapa.

A equipe do Supabase deve confirmar os códigos de `education_level`: `fundamental`,
`medio_cursando`, `medio_concluido`, `superior_cursando`, `superior_concluido`, `outra_situacao`.
Ao voltar e avançar dentro do cadastro, a escolha permanece guardada. O seletor fecha ao
escolher, tocar novamente no campo, clicar fora, usar Escape ou sair pelo Tab.

Ao implementar o último passo, centralizar o envio em um serviço de autenticação separado:
`supabase.auth.signUp({ email, password, options: { data: { full_name } } })`.
Esse exemplo é o contrato previsto, não uma integração já executável. Confirmar os campos de
perfil e políticas com a equipe responsável. Nunca salvar senha em localStorage, logs ou tabela de perfil.

Senhas ficam somente no estado React enquanto o cadastro está montado. Não aplicar trim,
conversão de caixa ou normalização: a confirmação compara o conteúdo exato. São exigidos
pelo menos 8 caracteres Unicode; nenhuma regra extra foi adicionada. O input permanece
`type="password"` no estado ocultado, com asteriscos decorativos inacessíveis ao leitor de tela.
O controle de visibilidade é independente para cada campo. Na divergência, `navigator.vibrate(35)`
é solicitado uma vez ao sair do campo; a mensagem visual funciona também sem suporte à vibração.
Ao integrar o Supabase, enviar `password` somente para Auth e os demais dados para o perfil.
