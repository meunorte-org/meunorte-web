# MeuNorte

O MeuNorte é uma plataforma de orientação ao ensino superior. Reúne informações sobre áreas do conhecimento, um teste vocacional exploratório, faculdades e formas de ingresso, além de um espaço pessoal para o estudante.

Este README é o ponto de partida para quem vai continuar o projeto. Ele explica o estado atual, o trabalho que falta e onde encontrar as orientações detalhadas.

- **Site:** [meunorteapp.com.br](https://meunorteapp.com.br)
- **Design e protótipos:** [Produto — MeuNorte no Figma](https://www.figma.com/design/cbmTsPE2jQKLwjXGpFrXIF/Produto--MeuNorte?node-id=1-2)
- **Repositório:** [meunorte-org/meunorte-web](https://github.com/meunorte-org/meunorte-web)

## Antes de começar: o que já funciona e o que falta

**As telas já existem, mas parte dos dados internos ainda é salva somente no navegador.** Cadastro e login já usam o Supabase. Isso não significa que Perfil, favoritos, fotos e resultados também estejam salvos no banco online.

| Parte do site | Situação atual | O que falta |
|---|---|---|
| Cadastro, confirmação de e-mail, login e recuperação de senha | Conectados ao Supabase Auth, o serviço que cuida das contas | Conferir esses fluxos no ambiente usado pela equipe, incluindo os links dos e-mails |
| Perfil, bio, tags e preferências de exibição | Funcionam com salvamento local, separado por usuário | Conectar ao banco para recuperar os dados em outro aparelho |
| Foto e avatar | Seleção, troca e remoção implementadas; foto pessoal salva neste navegador | Guardar a foto em armazenamento privado online e controlar quem pode acessá-la |
| Objetivos pessoais | Criação, edição, remoção e ordenação implementadas localmente | Salvar no banco com dono, ordem e datas, sem perder alterações |
| Favoritos de áreas e faculdades | Compartilham o mesmo serviço do Perfil; salvamento local | Conectar as listas ao banco, evitando duplicatas |
| Teste vocacional | Perguntas, cálculo, resultado e imagem para compartilhar implementados | Salvar o resultado online, com sua versão e data; decidir se haverá histórico |
| Áreas do conhecimento e formas de ingresso | Conteúdo editorial e arquivos disponíveis no projeto | Revisar e manter as informações e os links atualizados |
| Faculdades e cursos oferecidos | Telas, busca e filtros preparados; fonte padrão ainda vazia | Fornecer o catálogo real e conectar as consultas ao banco |
| Assistente Nô | Botão com arrasto e tela de conversa implementados | Conectar a IA desenvolvida pelo integrante responsável |

**Salvar no navegador não é o mesmo que salvar na conta online.** Hoje, usar outro dispositivo não traz automaticamente esses dados internos. Limpar os dados do navegador também pode apagá-los. Essa é uma das principais tarefas da integração com o banco.

A situação descrita aqui corresponde ao código do repositório. A versão publicada depende da última atualização enviada e das configurações do ambiente.

## Onde encontrar as orientações

Os links abaixo abrem os documentos dentro deste repositório. No GitHub, basta clicar no nome; no computador, eles ficam na raiz do projeto e na pasta `docs`.

| Documento | Para que serve | Quem deve consultar |
|---|---|---|
| [README-APP-INTERNO.md](README-APP-INTERNO.md) | Mostra como executar o projeto, onde ficam as telas e serviços e como a navegação está organizada | Todos que vão mexer no código |
| [INTEGRACAO_SUPABASE.md](docs/INTEGRACAO_SUPABASE.md) | Detalha os dados necessários, as relações entre eles, a proteção por usuário e os pontos de conexão com o código | Responsáveis pelo banco e pela conexão das telas |
| [INTEGRACAO_IA.md](docs/INTEGRACAO_IA.md) | Explica como conectar a IA existente ao Nô, quais informações a interface envia e qual resposta espera receber | Responsável pela IA e quem fará sua integração |
| [PENDENCIAS_INTEGRACAO.md](docs/PENDENCIAS_INTEGRACAO.md) | Lista o que está pendente por módulo e como comprovar que cada integração está concluída | Toda a equipe, para organizar e acompanhar as entregas |
| [autenticacao-supabase.md](docs/autenticacao-supabase.md) | Explica o cadastro, o login, os retornos por e-mail e as configurações relacionadas à autenticação | Quem precisar revisar contas e acesso |

**Ordem sugerida de leitura:** este README → README interno → guia da sua responsabilidade → lista de pendências para conferir a entrega.

O guia do Supabase apresenta uma **proposta de organização do banco**. Ele não confirma que aquelas tabelas ou regras já existam no projeto online. Antes de aplicar qualquer mudança, a equipe precisa conferir o que já foi criado no painel.

## O que a equipe do banco precisa fazer

A base de contas já existe no Supabase Auth. O próximo trabalho é fazer os dados das telas internas acompanharem o estudante em qualquer aparelho.

### 1. Conferir o que já existe no projeto Supabase

Revisem as tabelas, as permissões e o armazenamento de arquivos antes de criar estruturas novas. Usem o [guia de integração Supabase](docs/INTEGRACAO_SUPABASE.md) para comparar o que as telas precisam com o que o banco já oferece.

Não é necessário refazer o login nem criar uma tabela de senhas. As senhas continuam sob responsabilidade do Supabase Auth.

### 2. Preparar os dados pessoais e suas permissões

Precisam ser guardados online: bio, tags, preferências, objetivos, favoritos, referência da foto e resultado vocacional. Cada informação deve estar ligada ao usuário correto.

Também precisam existir regras no próprio banco para impedir que uma pessoa leia ou altere os dados de outra. Essas regras são chamadas de **RLS** no Supabase. Esconder um botão na tela não oferece essa proteção.

Ao salvar alterações, é preciso evitar que uma aba sobrescreva sem aviso o trabalho feito em outra. O guia detalha como tratar isso. Também será necessário decidir como oferecer a transferência dos dados locais já existentes para a conta online, sem enviá-los automaticamente sem a pessoa saber.

### 3. Preparar o armazenamento das fotos

A foto pessoal precisa sair do armazenamento local e ir para uma área privada de arquivos no Supabase, chamada **Storage**. A integração deve permitir carregar, substituir e remover a foto, cuidando também de envios que falhem e de arquivos antigos que deixem de ser usados.

### 4. Montar o catálogo real de faculdades e cursos

A equipe precisa fornecer informações verificadas: instituições, cursos, localização, modalidade, turno, formas de ingresso e fontes consultadas. Bolsas, financiamentos e mensalidades só devem aparecer quando confirmados.

Uma faculdade pode oferecer vários cursos, e um mesmo curso pode existir em várias faculdades. O banco deve representar essas relações para a busca funcionar corretamente. Hoje a fonte padrão está vazia: a interface não inventa instituições para preencher a tela.

### 5. Conectar o banco às funções já usadas pelas telas

O projeto já separa as telas das funções que buscam e salvam dados. Essas funções ficam em `src/services`. A conexão deve ser feita ali, preservando os campos que as telas já utilizam, em vez de espalhar consultas pelo projeto.

O termo **adaptador**, usado nos guias, significa essa peça de conexão: hoje ela salva localmente; a nova versão vai conversar com o Supabase. O guia informa os arquivos e as operações de cada módulo.

**Como saber se terminou:** salvar algo, conferir que chegou ao banco e abrir a mesma conta em outro dispositivo. Testar também com duas contas diferentes para garantir que uma não acessa os dados da outra. Atualizar apenas a mesma aba não comprova que o banco online está funcionando.

## O que falta para a IA do Nô funcionar

A parte visual já está preparada: abrir e fechar a conversa, arrastar o Nô, escrever perguntas, usar sugestões e mostrar espera, erro ou cancelamento.

**A IA real ainda não está conectada.** No estado atual, o Nô informa essa indisponibilidade. Ele não envia a pergunta a um modelo e não cria uma resposta falsa para aparentar funcionamento.

O integrante responsável deve conectar a IA que está desenvolvendo ao ponto preparado em `src/services/ai/assistenteService.js`. Não é necessário criar outro chatbot dentro das telas.

O trabalho de integração inclui:

1. Receber as mensagens enviadas pela interface e devolvê-las no formato combinado no guia.
2. Conferir no servidor quem está fazendo a solicitação e impedir acesso à conversa de outra pessoa.
3. Tratar demora, falha, repetição de envio e cancelamento.
4. Manter as chaves privadas do serviço de IA fora do código enviado ao navegador.
5. Decidir se as conversas serão guardadas online, por quanto tempo e como poderão ser apagadas. Hoje ficam apenas na memória da aba.

A interface pode enviar, com opção de desativar, uma indicação da seção pública que o estudante está consultando. Ela não inclui automaticamente nome, e-mail, bio, objetivos ou respostas do teste vocacional. O estudante ainda pode escrever informações pessoais por conta própria; o serviço real precisa considerar isso.

O passo a passo, os formatos de mensagem e os exemplos estão em [INTEGRACAO_IA.md](docs/INTEGRACAO_IA.md).

**Como saber se terminou:** receber uma resposta real da IA pela interface e verificar também o comportamento com falha de conexão, sessão encerrada, demora e cancelamento. Uma resposta de demonstração usada em teste não comprova a integração.

## Design, mascote e animações

O [Figma](https://www.figma.com/design/cbmTsPE2jQKLwjXGpFrXIF/Produto--MeuNorte?node-id=1-2) é a referência para aparência, componentes e movimentos. Consultem as telas liberadas para desenvolvimento e reutilizem os componentes existentes no React.

As telas e animações atuais usam componentes, CSS e recursos do navegador. O Nô interno utiliza a imagem oficial do mascote; o movimento do ponteiro na tela externa tem implementação própria.

O uso de **Rive** para animações mais elaboradas foi planejado anteriormente, mas não está integrado nesta versão. Caso a equipe siga com essa proposta, ainda será necessário preparar os arquivos de animação e conectá-los ao site, preservando as interações atuais. Isso é separado da conexão da IA: animar o mascote não faz o chat responder.

## Como começar a trabalhar no projeto

Para executar no computador, é necessário ter Node.js e npm. O ambiente de desenvolvimento foi validado com Node 24. Com o repositório já no computador:

1. Abra a pasta do projeto no editor e seu terminal.
2. Execute `npm ci` para instalar as dependências previstas no projeto.
3. Copie `.env.example` para um arquivo chamado `.env.local` e preencha a URL e a chave publicável do projeto Supabase autorizado pela equipe.
4. Execute `npm run dev` e abra o endereço mostrado no terminal, normalmente `http://localhost:5173`.

A opção `VITE_EMAIL_CHECK_ENABLED` só deve ser ativada quando a função de consulta de e-mail estiver instalada e validada naquele ambiente. O [README interno](README-APP-INTERNO.md) explica as configurações com mais detalhes.

O arquivo `.env.local` não deve ser enviado ao GitHub. No código do navegador, use apenas as configurações públicas previstas. **Senha do banco, chave secreta do Supabase e chave privada da IA não pertencem ao React.** O prefixo `VITE_` não protege um segredo.

## Como dividir e conferir as entregas

Uma sequência prática para continuar é:

1. **Banco e interface:** alinhar os dados e a proteção de acesso; conectar Perfil, objetivos, fotos, favoritos e resultados.
2. **Conteúdo e catálogo:** reunir dados reais de instituições e cursos e conectar busca, filtros e detalhes.
3. **IA:** o integrante pode preparar sua conexão em paralelo, seguindo o contrato do Nô, e depois testar o fluxo completo.
4. **Revisão conjunta:** conferir tudo com contas diferentes, outro dispositivo e celulares reais antes de publicar.

Cada pessoa deve trabalhar em uma branch, ou seja, uma linha separada de alterações, e abrir um Pull Request para revisão. Evitem substituir a estrutura existente ou refazer partes já conectadas sem combinar com a equipe.

Antes de entregar uma alteração, executem:

```bash
npm run lint
npm test
npm run build
```

Esses comandos verificam problemas de código, testes automatizados e a geração dos arquivos do site. **Eles não comprovam, sozinhos, que o banco, os e-mails ou a IA estão funcionando online.** É necessário testar a função completa e registrar o resultado.

Ainda é importante conferir teclado e arrasto em iPhone físico, outros celulares, telas maiores, texto ampliado e navegação por teclado. A [lista de pendências](docs/PENDENCIAS_INTEGRACAO.md) reúne os detalhes, incluindo verificações de conteúdo e desempenho.

## Publicação e endereço do site

O projeto utiliza Vercel e o endereço principal informado é [meunorteapp.com.br](https://meunorteapp.com.br). As configurações locais não são copiadas automaticamente para a hospedagem: as variáveis necessárias também precisam estar corretas no ambiente publicado.

Quando o endereço do site mudar, confiram os endereços de retorno autorizados no Supabase. São eles que permitem que os links de confirmação e recuperação de senha voltem ao lugar correto. O [guia de autenticação](docs/autenticacao-supabase.md) orienta essa revisão.

Antes de publicar, confirmem qual projeto Supabase será usado para testes e qual será usado pelos usuários. A configuração do ambiente e a publicação devem ser combinadas com a equipe para que uma mudança não afete os dados ou o acesso de quem já utiliza o site.
