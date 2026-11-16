# MeuNorte — navegação interna

Guia da interface existente, revisado em 16/11/2026. Consulte também [Supabase](docs/INTEGRACAO_SUPABASE.md), [IA](docs/INTEGRACAO_IA.md) e [pendências](docs/PENDENCIAS_INTEGRACAO.md). O README principal foi preservado.

## Objetivo e situação atual

O espaço interno ajuda estudantes a organizar interesses, explorar dez áreas, realizar uma atividade vocacional, pesquisar possibilidades de graduação em Vitória da Conquista e conhecer formas de ingresso.

**Autenticação real não significa persistência interna concluída.** O cadastro/login utilizam Supabase Auth. Bio, tags, foto, objetivos, favoritos e último resultado ainda usam o adaptador local. O catálogo institucional real está pendente. A interface do Nô está implementada, mas seu transporte de IA padrão está desconfigurado: não envia perguntas nem inventa respostas.

## Tecnologias reais

- React 19, React DOM 19 e JavaScript com módulos ES.
- Vite 8 e plugin React; CSS próprio, Readex Pro e Futura Display locais.
- `@supabase/supabase-js` 2, com cliente único.
- ESLint 10, regras de React Hooks e testes nativos `node:test`.
- History API para navegação; Pointer Events, Visual Viewport e IndexedDB para comportamentos do navegador.

Não há React Router, SDK de modelos de IA, biblioteca de Markdown ou biblioteca de arraste. Não é necessário adicioná-los para integrar os serviços atuais.

## Executar localmente

No clone existente de `https://github.com/meunorte-org/meunorte-web`, use um Node compatível com as dependências; esta entrega foi validada com Node 24.

```bash
npm ci
```

Copie `.env.example` para `.env.local` e preencha somente as configurações públicas do projeto autorizado:

```dotenv
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PREENCHER
VITE_EMAIL_CHECK_ENABLED=false
```

A última opção deve ser `true` apenas quando a função de consulta de e-mail estiver instalada e validada no ambiente utilizado. Os valores acima são exemplos, não credenciais válidas. `.env.local` é ignorado pelo Git. Nenhuma chave secreta, senha de banco ou token de provedor de IA pertence a variáveis `VITE_`.

```bash
npm run dev
npm run lint
npm test
npm run test:auth
npm run build
npm run preview
```

O Vite normalmente usa `http://localhost:5173`. Se outra porta for utilizada, os retornos de autenticação precisam corresponder ao endereço efetivamente autorizado no painel. Nunca desative confirmação ou proteção para testar. O domínio principal do produto é `https://meunorteapp.com.br`; esta entrega não alterou sua configuração nem publicou código.

## Organização final

```text
src/
  App.jsx                         Proteção, fluxos externos e entrada interna
  lib/                            Cliente Supabase e retorno de recuperação
  contexts/                       AuthContext e AuthProvider
  layouts/                        ExternalLayout e InternalLayout
  pages/
    external/
      Apresentacao/ BoasVindas/ Cadastro/ Login/
      ConfirmacaoEmail/ NovaSenha/ DocumentosLegais/
    internal/
      InternalApp.jsx             Composição, estado do teste e presença do chat
      Perfil/                     Editores, coletânea, foto e avatares
      Areas/                      Catálogo e detalhes
      TesteVocacional/            Perguntas, resultado e exportação
      Faculdades/                 Pesquisa e detalhes
      Ingressos/                  Cinco guias; Enem/AcervoAno.jsx
      AssistenteIA/
        AssistenteIA.jsx          Coordena o botão e a conversa
        AssistenteIA.css
        components/
          ConversaNo.jsx          Janela, mensagens, formulário e opções
          TextoMensagem.jsx       Texto, listas e links seguros
      legacy/InternaRascunho/      Referência histórica, sem rota ativa
  components/                     Design System externo e compartilhados
    shared/                       Ícones, selo, modal e controles internos
  hooks/                          Rotas, Perfil, Nô, conversa e fluxos externos
  domain/                         Validações de cadastro, Perfil, teste e assistente
  services/
    auth.js                       Supabase Auth real
    perfil/                       Serviço e adaptadores locais de Perfil/fotos
    ai/assistenteService.js        Fronteira da IA do integrante
    areasService.js               Curadoria local das áreas
    faculdadesService.js          Fronteira do catálogo institucional
    exportarResultado.js          PNG com assets e fontes locais
    compartilharImagem.js         Compartilhamento ou download
  data/                           Conteúdo editorial, cursos, matriz, acervo e sugestões
  assets/                         Fontes, imagens, personagens, avatares e selos oficiais
  styles/                         Responsividade e estilos internos
```

O seletor antigo `SecaoInicial.jsx` também permanece como referência, sem uso nas abas implementadas. Não reative o rascunho como destino de autenticação. A recuperação de senha faz parte de Login; a redefinição fica em NovaSenha.

## Navegação e proteção

`AuthProvider` restaura a sessão e valida o usuário pelo serviço existente. `App.jsx` exige usuário autenticado/confirmado para renderizar `InternalApp`, carregado sob demanda. Sem sessão válida, a rota interna apresenta a necessidade de entrar. A chave por `usuario.id` evita reaproveitar o estado de uma conta em outra.

`useRotaApp.js` lê e atualiza a URL usando `pushState`, `replaceState` e `popstate`. Não há dependência de uma rota física nova no servidor.

| Tela | Exemplo de parâmetros |
|---|---|
| Perfil | `?area=interna&secao=perfil` |
| Áreas | `?area=interna&secao=areas` |
| Detalhe de área | `?area=interna&secao=areas&item=tecnologia` |
| Teste | `?area=interna&secao=areas&item=teste` |
| Faculdades filtradas | `?area=interna&secao=faculdades&busca=Psicologia&tipo=privada` |
| Detalhe institucional | `?area=interna&secao=faculdades&item=ID` |
| Guia | `?area=interna&secao=ingressos&item=sisu` |
| Acervo anual | `?area=interna&secao=ingressos&item=enem%2F2025` |
| Nô aberto sobre a mesma tela | acrescente `&no=1` |

`InternalLayout` mantém a navbar, reserva sua altura, cuida de foco e limita o conteúdo a 28rem. Os botões de retorno passam a seção e os parâmetros ao mesmo hook. Pesquisa e filtro são mantidos ao voltar dos detalhes e durante as trocas de aba.

O Nô acrescenta uma entrada de histórico preservando os parâmetros da página. Fechar usa essa entrada para voltar; em um link direto com `no=1`, remove somente esse parâmetro por substituição. A tela de origem não é desmontada. A conversa usa um portal com fundo inerte e restaura rolagem/foco ao fechar. O botão voltar do navegador também fecha a conversa aberta pela interface.

## Funcionalidades e contratos

### Perfil

Nome, nascimento e escolaridade vêm do Auth. Idade e ocupação são derivadas; não existe coluna de idade. Bio tem limite de 160 caracteres; tags personalizadas têm texto de até 20 e uma das seis cores permitidas. O máximo visível é seis, contando as automáticas. Preferências controlam ocupação, idade e afinidade.

Foto é enquadrada em canvas de 512 × 512 e salva localmente como blob. Avatares oficiais usam IDs estáveis. Selecionar outra imagem ou remover a escolha atual atualiza o Perfil; a limpeza do arquivo anterior é uma operação separada. Storage definitivo ainda não existe nessa integração.

Objetivos têm título opcional de até 60, texto obrigatório de até 600, ID, proprietário e datas. Registros novos recebem datas; objetivos legados sem criação conhecida preservam `criadoEm: null` ao editar. A ordem é a posição no array. As setas alteram a ordem, com foco restaurado no objetivo movido. Tags também têm operação de ordenação no serviço, mas não um novo editor visual de ordem.

A coletânea mantém apenas Áreas favoritas, Faculdades salvas e Meus objetivos.

### Áreas e teste

`areasCatalogo.js`, `conteudoAreas.js` e `ilustracoesAreas.js` separam identidade, conteúdo e assets. Os cursos atuais são exemplos editoriais aguardando a lista definitiva; não representam ofertas confirmadas na cidade.

`perguntasVocacionais.js` contém dez perguntas. `domain/testeVocacional.js` documenta a matriz v1: três oportunidades de um ponto para cada área, neutra zero, mínimo de quatro escolhas informativas e dois pontos na líder. Empates mostram todas as líderes; secundárias precisam de dois pontos e de pelo menos metade do topo. Sem porcentagens, aleatoriedade ou diagnóstico psicológico.

A afinidade única alimenta a tag, respeitando sua visibilidade. Se a nova tag duplicar uma personalizada ou exceder seis, a afinidade é armazenada com exibição desativada até ajuste. Resultado insuficiente/empatado não escolhe área arbitrária. O último resultado é local; não há histórico remoto. Perguntas em andamento ficam em memória, inclusive ao abrir o Nô, mas reiniciam ao recarregar a página.

A exportação gera PNG real de 1080 × 1350, inclusive para empates, com personagens, selos e fontes oficiais. O botão de compartilhar recebe um arquivo já preparado para preservar o gesto de usuário exigido por navegadores móveis.

### Faculdades

`criarFaculdadesService(adapter)` aceita fonte agregada por `carregar()` ou consultas específicas `pesquisar`, `consultar`, `listarCursos` e `consultarOfertas`. A fonte padrão está vazia e marcada como pendente. A UI já trata carregamento, erro, vazio, filtros, detalhes e favoritos. Não existem instituições ou mensalidades simuladas no catálogo publicado.

O filtro local considera cidade, tipo e cursos relacionados por ofertas N:N. O adaptador remoto deve aplicar a mesma regra, incluindo Vitória da Conquista. Não basta retornar instituições pelo nome parecido. Consultas recebem `signal` e são abortadas quando a tela/pesquisa muda. Detalhes e listagem usam o mesmo serviço de favoritos do Perfil.

### Ingressos

`ingressos.js` e `acervoEnem.js` contêm textos introdutórios, fontes e documentos oficiais. São conteúdo editorial local, não tabelas integradas. O acervo possui 196 URLs únicas da aplicação regular impressa entre 2020 e 2025. Outras aplicações são acessadas nas páginas oficiais anuais. Não gerar URLs por convenção: conferir cada arquivo e atualizar a data de revisão.

### Nô

A posição é normalizada entre limites do viewport e salva por usuário em uma preferência local opcional. O botão admite mouse/toque, usa limiar de 8px para arraste e não abre o chat ao soltar um arraste. Setas movem; Shift amplia o passo; Home restaura. As opções do chat também restauram a posição. Após aproximadamente três segundos sem interação, a opacidade cai para 66%; foco, hover e toque reativam o botão.

A conversa mantém mensagens e rascunho apenas em memória deste acesso. Tem sugestões, texto multilinha, limites, prevenção de duplicação, cancelamento, timeout, erro e repetição da mesma tentativa. A resposta é renderizada como texto/elementos React, sem HTML arbitrário; links aceitam somente HTTP/HTTPS sem credenciais embutidas.

Não há IA independente ou resposta padrão de mentira: o transporte do integrante ainda precisa ser conectado. Veja [o contrato completo](docs/INTEGRACAO_IA.md).

## Classificação das integrações

| Módulo | Classificação | Fonte real atual |
|---|---|---|
| Cadastro, login, confirmação, recuperação e nome | Real e integrada no código | Supabase Auth, `services/auth.js` |
| Consulta de e-mail existente | Integração condicional | RPC `email_ja_cadastrado`, habilitada por configuração |
| Bio, tags, objetivos, preferências, favoritos e resultado | Local/provisória | `perfil/localAdapter.js`, localStorage por usuário |
| Foto pessoal | Local/provisória | IndexedDB; URL de visualização transitória |
| Avatares, selos e personagens | Assets locais oficiais | `src/assets` |
| Áreas, matriz e conteúdo de ingresso | Local/editorial | `src/data` e domínio; não são respostas simuladas |
| Faculdades reais | Pendente | Fonte padrão vazia; depende do catálogo da equipe |
| Posição do Nô | Preferência local intencional | localStorage, normalizada e por usuário |
| Conversa do Nô | Interface pronta; IA pendente | Memória e adaptador sem transporte |
| Respostas demonstrativas | Mockadas somente nos testes | Fixtures de testes; não entram no serviço padrão |

Não foi feito inventário remoto de tabelas públicas nesta etapa. Não deduza que uma tabela existe porque aparece como proposta em um guia.

## Testes, revisão e trabalho em equipe

1. Crie uma branch, por exemplo `git switch -c feat/integracao-perfil`.
2. Escolha um módulo e mantenha seu contrato/retorno. Atualize o adaptador antes de editar layouts.
3. Use ambiente de desenvolvimento autorizado. Não execute SQL de proposta em produção.
4. Execute lint, testes e build; faça a rodada de UI e de isolamento entre duas contas.
5. Abra um Pull Request com problema, alteração, validação, captura de tela quando houver mudança visual e pendências. Aguarde revisão; não publique diretamente em `main`.

Na Etapa 3 passaram 59 testes, lint e build. Foram verificadas a navegação do assistente e 16 combinações de estado/tamanho, de 320 a 1024px, com paisagem e alturas reduzidas. O aviso de chunk inicial acima de 500kB já existia e permanece. Não houve teste em iPhone físico ou zoom real de texto; login/logout e envio de e-mails com conta real também não foram executados nesta rodada. Os testes de Auth exercitam o serviço com simulações; a proteção sem sessão foi conferida na aplicação real. As integrações de IA e banco ainda exigem homologação com serviços reais.

Os arquivos de QA de navegador foram temporários e removidos da entrega. Não publique rotas de teste com usuário ou respostas simuladas.
