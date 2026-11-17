# MeuNorte — guia de continuidade da equipe

O MeuNorte ajuda estudantes a conhecer áreas do conhecimento, explorar cursos e faculdades, entender formas de ingresso e organizar seus interesses. As telas em React já foram construídas. A próxima etapa é ligar essas telas aos dados online e à IA do Nô.

**Comecem por este arquivo. Depois, cada pessoa segue o guia da sua responsabilidade.** Não é necessário entender todas as partes do sistema para começar uma tarefa.

[Site MeuNorte](https://meunorteapp.com.br) · [Design no Figma](https://www.figma.com/design/cbmTsPE2jQKLwjXGpFrXIF/Produto--MeuNorte?node-id=1-2) · [Repositório GitHub](https://github.com/meunorte-org/meunorte-web)

## 1. O que estamos tentando fazer funcionar

Pensem em uma estudante que pesquisa Psicologia:

1. Ela entra na conta que já criou.
2. Escreve “Psicologia” na seção Faculdades.
3. O site consulta o banco e mostra os cards das instituições que realmente oferecem esse curso em Vitória da Conquista.
4. Ao abrir um card, vê os cursos, as condições conhecidas e os links oficiais.
5. Salva uma faculdade e encontra o mesmo favorito ao entrar pelo computador.
6. Abre o Nô, faz uma pergunta e recebe uma resposta da IA real, sem informações inventadas sobre as instituições.

**As telas que apresentam esse caminho já existem. Falta completar as conexões e fornecer os dados verificados.** Preencher uma tabela, sozinho, não faz o React começar a consultá-la. A equipe de integração precisa fazer essa ligação.

**O integrante já criou um código Python que consulta a API da OpenAI.** Vamos aproveitar esse código: React envia a pergunta ao serviço Python; Python chama a OpenAI e devolve a resposta ao Nô. Não é necessário reescrever a IA ou hospedar o modelo da OpenAI. Falta conectar esse serviço à interface, validar o usuário e usar o catálogo real quando a pergunta precisar de informações de faculdades. O guia de IA explica essas etapas.

## 2. As peças do projeto, em linguagem simples

| Nome encontrado no projeto | O que significa na prática |
|---|---|
| React / interface | A parte que o estudante vê e usa: telas, cards, botões, campos e animações |
| Supabase Auth | A parte que já cuida das contas, do login e das senhas |
| Banco de dados | O local online onde ficam as informações que precisam continuar existindo entre acessos e aparelhos |
| Tabela / linha / coluna | Uma tabela parece uma planilha; cada linha representa um cadastro e cada coluna guarda uma informação |
| ID | Um código estável que identifica um cadastro, mesmo que seu nome mude |
| Relação entre tabelas | A ligação por ID: uma oferta aponta para uma faculdade e para um curso |
| Service / serviço | Arquivo que a tela chama para buscar ou salvar algo. Fica em `src/services` |
| Adaptador | A peça que liga esse serviço ao lugar onde os dados estão. Hoje alguns usam o navegador; os novos vão usar o Supabase |
| RLS / política de acesso | Regra do banco que decide quais linhas cada usuário pode ler ou alterar |
| Storage / bucket | Armazenamento de arquivos e sua pasta principal, usados para fotos e imagens |
| Backend / servidor | Código executado fora do navegador, usado para validar acesso e conversar com a IA sem expor chaves privadas |
| Endpoint / API | Um endereço que recebe um pedido do site e devolve uma resposta |
| Contrato | O formato combinado de envio e resposta. Se a tela espera `nome`, a integração precisa entregar `nome`, mesmo que a coluna do banco se chame `name` |

**Exemplo da relação:** não basta cadastrar uma faculdade e cadastrar Psicologia em outra tabela. É preciso cadastrar também a oferta que informa “esta faculdade oferece este curso”. É essa ligação que permite encontrar a instituição na pesquisa.

## 3. O que já está pronto e o que ainda falta

| Parte | Já existe no código | Falta concluir |
|---|---|---|
| Contas e acesso | Cadastro, confirmação por e-mail, login, recuperação e saída com Supabase Auth | Revalidar os fluxos no ambiente usado pela equipe; preservar a configuração existente |
| Faculdades | Cards, busca por curso, filtros, detalhes, estados de espera/erro e botão de favorito | Criar/conferir as tabelas, preencher dados reais e conectar as consultas |
| Perfil e objetivos | Bio, tags, preferências, objetivos e ordenação | Fazer o salvamento online com proteção por usuário |
| Favoritos | Áreas e faculdades usam a mesma base local do Perfil | Salvar na conta online e recuperar em outro dispositivo |
| Foto pessoal | Envio, troca e remoção no navegador | Conectar armazenamento privado online |
| Teste vocacional | Perguntas, cálculo exploratório, resultado e imagem para compartilhar | Guardar resultado e data online; manter a regra atual |
| Áreas e cursos relacionados | Dez áreas e tags informativas, com conteúdo no projeto | Manter curadoria; as tags não comprovam oferta em nenhuma faculdade |
| Formas de ingresso | Guias e acervo com links | Revisar informações e links periodicamente |
| Nô | Botão com arrasto, conversa, sugestões, espera, erro e cancelamento | Conectar ao serviço real da IA do integrante |

Hoje, dados pessoais internos ainda ficam **apenas no navegador**, separados por usuário. Isso permite usar a interface, mas não traz os dados ao entrar por outro aparelho. Limpar os dados do navegador pode apagá-los. As fotos pessoais também são locais.

A fonte padrão de faculdades está vazia. A IA padrão está desconectada e informa isso; não há respostas falsas para simular funcionamento. Esta documentação descreve o código, não confirma quais tabelas já existem no painel nem qual versão está publicada.

## 4. Divisão sugerida para as seis pessoas

Preencham os nomes uma vez no acompanhamento da equipe e mantenham esses responsáveis até a integração ser validada.

| Pessoa | Foco principal | Entrega para os colegas |
|---|---|---|
| **Integração 1 — Banco e proteção** | Conferir projeto, criar tabelas/relações, regras de acesso e armazenamento | Estrutura revisada, nomes dos campos e acesso de teste funcionando |
| **Integração 2 — Faculdades e dados de Administração** | Receber a pesquisa, revisar/importar os cadastros e conectar busca/cards/detalhes | Uma faculdade real aparecendo corretamente no site; depois ampliar o catálogo |
| **Integração 3 — Dados pessoais e validação** | Conectar Perfil, objetivos, favoritos, fotos e resultado; organizar os testes conjuntos | Alterações que acompanham a conta em outro aparelho, sem misturar usuários |
| **IA — Nô** | Conectar o serviço Python existente à conversa e validar segurança/qualidade | Perguntas e respostas reais dentro da interface atual |
| **Administração 1 — Pesquisa institucional** | Nome, tipo, endereço, apresentação, site, imagem autorizada e fontes das faculdades | Aba “Instituições” preenchida e conferida |
| **Administração 2 — Pesquisa de cursos e ofertas** | Cursos, sinônimos de busca, modalidade, turno, ingresso e condições confirmadas | Abas “Cursos” e “Ofertas” preenchidas e conferidas |

As duas pessoas de Administração revisam o material uma da outra. **Integração 2 é o ponto de contato delas com o banco.** Elas não precisam programar nem receber uma chave administrativa para pesquisar. A equipe técnica confere, identifica os cadastros e faz a importação controlada.

Integração 1 e 3 ajudam a pessoa da IA com a sessão do usuário e as permissões; não precisam criar uma segunda IA. Evitem duas pessoas editando o mesmo arquivo ao mesmo tempo: combinem o responsável antes.

## 5. Há somente dois guias de trabalho na pasta docs

| Abra este documento | Para fazer o quê? |
|---|---|
| **[Guia prático Supabase e Faculdades](docs/INTEGRACAO_SUPABASE.md)** | Dividir o trabalho dos três integrantes; criar as tabelas; orientar Administração; importar o catálogo; conectar cards e dados pessoais; testar e publicar |
| **[Guia prático de IA do Nô](docs/INTEGRACAO_IA.md)** | Preparar o serviço seguro, ligar a conversa à IA existente, usar dados reais de faculdades quando necessário e testar respostas/falhas |

Os conteúdos de estrutura, autenticação e pendências foram reunidos aqui e nesses dois guias. Não é necessário procurar instruções em vários READMEs. O PDF antigo, em `docs/arquivo`, é somente histórico; os guias atuais são a referência de continuidade.

## 6. Ordem prática para avançar sem esperar tudo ficar pronto

**Primeira entrega conjunta: uma instituição real completa no site.** Escolham uma instituição da pesquisa, um curso real e uma oferta confirmada. Cadastrem, conectem, pesquisem e abram o card. Isso prova que a ligação funciona antes de importar dezenas de linhas.

Enquanto isso:

- Integração 1 prepara o banco e a proteção, começando pelo catálogo.
- Integração 2 e Administração organizam os dados e preparam a leitura pelas telas.
- Integração 3 confere contas e prepara os dados pessoais, começando por bio e um favorito.
- A pessoa da IA prepara a conexão do Nô sem depender de todo o catálogo ficar pronto.

Depois ampliem o catálogo e completem os dados pessoais. Se a IA precisar responder sobre faculdades específicas, use a mesma base revisada do site. Por último, façam a revisão conjunta de acesso, dados, dispositivos e publicação.

Registrem cada tarefa com quatro informações simples: **responsável, o que será entregue, de quem depende e como será testada**. Uma tarefa só termina quando alguém consegue repetir seu teste.

## 7. O que preservar no React

Integração envolve escrever código nas peças de conexão; isso é diferente de refazer as telas. Nesta revisão dos documentos, nenhuma funcionalidade do React foi alterada.

| Onde fica | Para que consultar |
|---|---|
| `src/lib/supabaseClient.js` | Conexão única já usada pelo site; reutilizar |
| `src/services/auth.js` e `src/contexts` | Contas e sessão existentes; não criar outro login |
| `src/services/faculdadesService.js` | Ponto para ligar catálogo, busca e detalhe ao banco |
| `src/services/perfil` | Ponto para trocar salvamento local por online, incluindo fotos |
| `src/services/ai/assistenteService.js` | Ponto para ligar o transporte da IA |
| `src/pages/external` | Boas-vindas, apresentação, cadastro, login, recuperação e documentos legais |
| `src/pages/internal` | Perfil, Áreas, Teste, Faculdades, Ingressos e AssistenteIA |
| `src/data` e `src/domain` | Conteúdo e regras existentes: IDs das áreas, cursos relacionados, teste e validações |
| `src/styles` e `src/assets` | Identidade visual, responsividade e arquivos oficiais |

Mantenham os nomes e formatos que as telas recebem. Não alterem o visual para contornar um dado entregue no formato errado. Não repitam favoritos em listas independentes. Preservem os IDs das dez áreas e a regra do teste.

Rive foi uma possibilidade planejada para animações do mascote, mas não está integrado. Não é uma dependência para concluir banco ou IA. As animações atuais já funcionam por código.

## 8. Como abrir o projeto no computador

O projeto usa React, JavaScript e Vite. Precisa de Node.js e npm; a versão de Node usada na validação anterior foi a 24.

1. Obtenham acesso individual ao repositório e ao ambiente de trabalho autorizado pela equipe.
2. Abram a pasta do projeto no editor e o terminal dessa pasta.
3. Executem `npm ci` para instalar as dependências do projeto.
4. Copiem `.env.example` para `.env.local`.
5. Preencham a URL e a chave **publicável** do projeto Supabase combinado com a equipe.
6. Executem `npm run dev` e abram o endereço mostrado, normalmente `http://localhost:5173`.

```dotenv
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PREENCHER
VITE_EMAIL_CHECK_ENABLED=false
```

Esses valores são exemplos. Mantenham a opção de consulta de e-mail igual à configuração validada no ambiente; ela só deve ser ativada quando a função correspondente estiver instalada. Reiniciem o servidor local após mudar `.env.local`.

**Não compartilhem senhas de conta nem coloquem chaves privadas no React.** Uma variável começando com `VITE_` pode chegar ao navegador; ela não é um cofre. Senha do banco, chave `secret`/`service_role` e chave privada da IA ficam fora do código do cliente. `.env.local` não deve ir para o GitHub.

## 9. Como conferir e entregar

Trabalhem em branches, que são linhas separadas de alteração, e peçam revisão por Pull Request antes de juntar o trabalho principal. Registrem mudanças do banco em arquivos dentro de `supabase/migrations`, após revisar o esquema existente. Não apliquem instruções de teste diretamente no ambiente de usuários reais.

Para verificar código e geração do site:

```bash
npm run lint
npm test
npm run build
```

Esses comandos ajudam a encontrar problemas, mas **não substituem o teste real**. Comprovem também:

- Uma instituição pesquisada pela Administração aparece no card e no detalhe com dados corretos.
- Busca e filtros funcionam, inclusive sem resultados e com falha de rede.
- Um favorito e uma edição de Perfil aparecem em outro dispositivo.
- Uma conta não consegue ler ou alterar os dados de outra.
- O Nô responde pela IA real; erros e sessão encerrada são tratados.
- Cadastro, confirmação, recuperação e saída continuam funcionando.
- Celular, teclado, rotação e texto ampliado não escondem os controles.

Antes de publicar na Vercel, confiram as variáveis do ambiente e os links de retorno de e-mail no Supabase. O arquivo local não configura a hospedagem automaticamente. Os dois guias terminam com uma lista de aceite: usem-na na revisão conjunta.
