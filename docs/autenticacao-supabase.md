# Autenticação do MeuNorte

O cadastro existente usa o Supabase Auth. A confirmação validada executa a animação de sucesso e abre uma tela interna provisória chamada Rascunho. A tela de login e a recuperação de senha ainda dependem das próximas etapas de interface. O conteúdo da navegação interna permanece a cargo da equipe.

## Configuração local

Copie `.env.example` para `.env.local` e preencha a URL do projeto de São Paulo e a chave publicável. O ambiente local já foi configurado nesta máquina. Reinicie o Vite após mudar os valores.

Nunca coloque senha do banco, chave secret ou service_role em variáveis VITE_. Somente URL e chave publicável são utilizadas no React.

## Configuração no painel do Supabase

Em Authentication, mantenha cadastro por e-mail e confirmação de e-mail habilitados. Em URL Configuration:

- Site URL: `https://meunorte-org.github.io/meunorte-web/` enquanto este for o endereço publicado.
- Redirect URLs: `https://meunorte-org.github.io/meunorte-web/?auth=confirmacao` e `http://localhost:5173/?auth=confirmacao`.
- Se usar outro endereço local, de teste ou Vercel, inclua o retorno exato correspondente. Não use curingas amplos em produção.

O retorno usa query string para funcionar no GitHub Pages sem uma rota física nova. O SDK recebe a sessão pelo fluxo implicit e depois o aplicativo confirma o usuário remotamente. Links com erro, sem sessão ou de usuário não confirmado não mostram sucesso. Os parâmetros de autenticação são retirados do endereço após a verificação.

Após a validação, a sequência visual segue os estados Confirmação Animação 1, 2 e 3 do Figma: centralização do envelope, fechamento, mensagem e saída para a esquerda. Não existe uma rota pública de prévia que contorne a autenticação. O destino é `?area=interna`; ao atualizar ou abrir esse endereço diretamente, a sessão e o usuário são validados novamente. Sair da conta encerra a sessão local e retorna ao início. O erro de confirmação mantém o tratamento existente e não executa a animação de sucesso.

O serviço padrão de e-mail do Supabase tem restrições de destinatários e envio. Ele não equivale a um serviço público de produção. Configure um remetente SMTP próprio antes de liberar o cadastro geral. Não teste com endereços de terceiros sem autorização.

## Publicação

O `.env.local` não é versionado. No repositório GitHub, em Settings → Secrets and variables → Actions → Variables, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. O fluxo de publicação interrompe o build se faltarem essas variáveis, para não publicar um cadastro desconectado.

Se a publicação migrar para a Vercel, configure as mesmas variáveis nesse projeto, confirme a base do Vite e atualize os endereços de retorno no Supabase.

## Contrato com a equipe do banco

O serviço `src/services/auth.js` utiliza `auth.signUp` e `auth.resend` de `@supabase/supabase-js`. A senha é enviada apenas para a autenticação; não é copiada para os metadados nem para tabelas da aplicação.

Os dados iniciais ficam em `auth.users.raw_user_meta_data`, com os nomes:

- `full_name`: nome informado.
- `birth_date`: data no formato YYYY-MM-DD.
- `education_level`: fundamental, medio_cursando, medio_concluido, superior_cursando, superior_concluido ou outra_situacao.

A chave para relacionar os registros da aplicação é `auth.users.id`. Ainda não foi criada uma tabela pública de perfis nem aplicado SQL remoto. A equipe poderá criar `profiles` e relacionar favoritos e resultados vocacionais a esse identificador, com as permissões necessárias. Metadados editáveis pelo próprio usuário nunca devem definir papéis administrativos ou autorizações.

Um futuro trigger para perfis precisa ser testado: uma falha nele pode impedir a criação de contas. Não copie senhas ou hashes para `profiles`. Não edite diretamente as tabelas gerenciadas pelo Auth para implementar o cadastro.

## Verificação

### E-mail já cadastrado

A etapa de e-mail tem estado de consulta, erro animado e bloqueio de avanço. Para ativar a consulta real, execute a migration `supabase/migrations/202611150001_email_ja_cadastrado.sql` no SQL Editor do projeto. Depois, defina `VITE_EMAIL_CHECK_ENABLED=true` no ambiente local e na variável correspondente de publicação.

A consulta retorna apenas verdadeiro ou falso para contas confirmadas. Não dá acesso às linhas de `auth.users`, não envia senha e não exige chave administrativa no navegador. Por decisão de experiência do produto, ela permite inferir se um e-mail tem conta confirmada; isso deve ser considerado antes da publicação geral. Em produção, avalie limites de requisições e proteção contra consultas automatizadas.

Contas ainda pendentes de confirmação podem continuar o fluxo normal do Supabase, evitando prender quem perdeu o primeiro link. O Auth continua responsável pela unicidade das contas, inclusive se houver dois cadastros simultâneos. A verificação na etapa do e-mail é um aviso antecipado, não substitui essa proteção do servidor.

Até instalar e verificar a função, a opção permanece desligada para preservar o cadastro que já funciona. Falha de consulta com a opção ativada mostra erro e não trata o endereço como livre. Respostas atrasadas para um e-mail anterior são ignoradas pela interface.

Execute `npm run test:auth`, `npm run lint` e `npm run build`. Os testes de serviço usam respostas controladas e não criam contas nem enviam mensagens. A validação inicial do projeto foi somente uma leitura de `/auth/v1/settings` com chave publicável.

O teste real de ponta a ponta ainda precisa ser feito com um e-mail autorizado, incluindo criação, recebimento, abertura do link, reenvio e retorno no endereço publicado. O login e a recuperação de senha ainda não estão implementados na interface.

Referências: https://supabase.com/docs/reference/javascript/auth-signup · https://supabase.com/docs/reference/javascript/auth-resend · https://supabase.com/docs/guides/auth/redirect-urls · https://supabase.com/docs/guides/auth/auth-smtp
