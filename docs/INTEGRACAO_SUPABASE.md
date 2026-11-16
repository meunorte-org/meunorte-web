# Integração Supabase — aplicação interna

Revisão: 16/11/2026. **Modelo proposto, não aplicado.** Esta etapa não executou SQL, criou bucket, alterou políticas ou inspecionou o esquema remoto. A equipe deve inventariar o projeto antes de criar migrações. Não presumir que uma tabela abaixo já exista.

## Estado atual e fontes de verdade

O Auth já é real, centralizado em `src/lib/supabaseClient.js`, `src/services/auth.js` e no contexto de autenticação. Cadastro, login, recuperação e confirmação usam esse cliente. A área interna exige sessão e usuário confirmado; isso não substitui RLS.

`full_name`, `birth_date` e `education_level` vêm de `user_metadata`. Não criar uma segunda idade: ela é calculada da data. Não copiar senhas, hashes ou tokens para tabelas do aplicativo. Metadados editáveis pelo usuário não concedem função administrativa. Consulte [usuários do Auth](https://supabase.com/docs/guides/auth/users).

Perfil, objetivos, preferências, favoritos e último resultado são locais: `src/services/perfil/localAdapter.js`, chave `meunorte:perfil:v1:<uid>`. Fotos ficam no IndexedDB `meunorte-perfil-local`, store `fotos`, chave `<uid>:<fotoId>`. Não há sincronização entre dispositivos. `versao: 1` é versão de formato, não revisão concorrente.

O único arquivo de migração de autenticação identificado nesta entrega é `supabase/migrations/202611150001_email_ja_cadastrado.sql`. Sua presença não prova a instalação atual no servidor. O RPC `email_ja_cadastrado` depende da configuração existente e informa existência de conta confirmada; não reutilizá-lo para consultar dados de perfil. Catálogo de faculdades ainda retorna `status: 'pendente'` e lista vazia.

## Convenções do modelo proposto

Nomes SQL em snake_case; DTOs atuais em camelCase. UUID de proprietário sempre deriva do JWT validado. `created_at`/`updated_at` são timestamptz controlados no servidor. Campos marcados `?` aceitam NULL, demais são obrigatórios. IDs de catálogo devem ser estáveis. Todas as referências a `auth.users` usam UUID, com decisão explícita de exclusão em cascata para dados pessoais. Catálogo não deve ser apagado em cascata pela exclusão de usuário.

### 1. profiles

| Campo/tipo | Chave/regra | Origem e uso |
|---|---|---|
| id uuid | PK, FK auth.users.id | Usuário autenticado |
| bio text | default '', até 160 caracteres | Editor da bio |
| avatar_kind text? | oficial ou foto; NULL sem avatar | Editor de avatar |
| avatar_id text? | FK knowledge_areas.id, apenas oficial | ID de avatar do catálogo atual |
| photo_id uuid? | apenas foto | ID opaco do objeto |
| photo_path text? | apenas foto; caminho do próprio usuário | Storage privado |
| revision bigint | default 0, incremento atômico | Controle de concorrência proposto |
| created_at / updated_at timestamptz | servidor | Auditoria técnica |

CHECK deve exigir combinação coerente: oficial tem avatar_id e nenhum photo_id/path; foto tem photo_id/path e nenhum avatar_id; sem avatar todos NULL. Não persistir URL assinada. Nome, nascimento e escolaridade continuam na fonte de cadastro atual; migrá-los para profiles exigiria decisão única de fonte e alteração coordenada, fora desta implementação.

### 2. custom_tags

| Campo/tipo | Chave/regra | Origem |
|---|---|---|
| id uuid | PK | Tag personalizada |
| user_id uuid | FK auth.users.id, index | Proprietário |
| texto text | 1..20 caracteres após trim | Editor de tag |
| normalized_text text | UNIQUE(user_id, normalized_text) | Normalização sem acentos e case, igual a normalizarTag |
| cor text | lima, azul, lilas, menta, coral ou amarelo | CORES_TAG em src/domain/perfil.js |
| position integer | >= 0; ordenar por position,id | Ordem do array atual |
| created_at / updated_at timestamptz | servidor | Datas |

Validar também colisão com tags automáticas visíveis e limite total de seis no serviço transacional. Idade, ocupação e afinidade não são tags personalizadas duplicadas na tabela.

### 3. user_preferences

`user_id uuid PK FK auth.users.id`; `show_occupation boolean default true`, `show_age boolean default true`, `show_affinity boolean default true`; `created_at/updated_at timestamptz`. Origem: `perfil.visibilidade.{ocupacao,idade,afinidade}`. A preferência controla exibição, não autorização para acessar dados de outro usuário.

### 4. user_goals

`id uuid PK`; `user_id uuid FK auth.users.id` indexado; `title text` até 60, default ''; `body text` obrigatório 1..600 após trim; `position integer >= 0`; `created_at timestamptz`; `updated_at timestamptz`. Origem: objetivos `{id,titulo,texto,usuarioId,criadoEm,atualizadoEm}`. Criação atual registra datas ISO; objetivos locais antigos podem ter `criadoEm: null`. Na importação não inventar a data original: registrar data de importação separadamente ou permitir NULL legado documentado. A ordenação não deve alterar a data original.

### 5. knowledge_areas

`id text PK` com os dez IDs exatos de `src/data/areasCatalogo.js`; `name text`, `description text`, `color text`, `avatar_asset text`, `published boolean default false`, `updated_at timestamptz`. Conteúdo editorial inicial vem do catálogo existente, sem renomear IDs ou recolorir avatares. Referência de asset é identificador/caminho conhecido, não HTML executável. Cursos são entidades próprias, não um único texto concatenado. Edição restrita à equipe.

### 6. user_favorite_areas

`user_id uuid FK auth.users.id`, `area_id text FK knowledge_areas.id`, `created_at timestamptz`; PK composta `(user_id,area_id)`. Origem: `areasFavoritas`. O DTO `{id,nome}` é montado por join; nome não é fonte de verdade duplicada.

### 7. courses

`id uuid PK`; `name text` obrigatório; `area_id text FK knowledge_areas.id`; `synonyms text[] default '{}'`; `description text?`; `published boolean`; `updated_at timestamptz`. Origem: contrato Curso `{id,nome,areaId,sinonimos,descricao?}` em `src/services/faculdadesService.js`. Área principal N:1 nesta versão. Se um curso precisar de várias áreas, criar relação própria em migração futura, sem copiar o curso.

### 8. institutions

`id uuid PK`; `name text`; `type text CHECK IN ('publica','privada')`; `city text`; `state char(2)`; `address text?`; `description text?`; `image_path text?`; `website text?`; `additional_information text?`; `links jsonb default '[]'`; `source text`; `verified_at timestamptz`; `published boolean default false`; `created_at/updated_at timestamptz`. Origem: contrato Instituicao em `src/services/faculdadesService.js`. Escopo inicial: Vitória da Conquista, BA. Links têm `{nome,url}` e URLs HTTP(S) validadas; preferir HTTPS. Dados e imagens devem ter fonte e uso autorizado, sem instituições fictícias em produção.

### 9. institution_courses (ofertas)

`id uuid PK`; `institution_id uuid FK institutions.id`; `course_id uuid FK courses.id`; índices em ambos; `modality text`; `shift text?`; `admission_methods jsonb default '[]'`; `monthly_fee numeric(12,2)? CHECK >= 0`; `scholarships jsonb?`; `financing jsonb?`; `source text`; `verified_at timestamptz`; `published boolean`; `created_at/updated_at timestamptz`. Origem: Oferta `{id,instituicaoId,cursoId,modalidade,turno?,ingressos:[],mensalidade?,bolsas?,financiamentos?,fonte,verificadoEm}`.

É a relação N:N: uma faculdade oferece vários cursos e o mesmo curso existe em várias faculdades. Modalidade/turno/campus podem distinguir ofertas; a equipe deve definir campus e a chave única antes de impor UNIQUE(institution_id,course_id), que impediria ofertas legítimas. Definir vocabulários de modalidade/turno/ingresso com a curadoria. Ausência de valor/benefício significa desconhecido, nunca mensalidade zero, bolsa ou adesão presumida.

### 10. user_favorite_institutions

`user_id uuid FK auth.users.id`; `institution_id uuid FK institutions.id`; `created_at timestamptz`; PK `(user_id,institution_id)`. Origem: `faculdadesSalvas`. Usa o mesmo serviço de favoritos do Perfil; não criar lista independente na página de faculdades.

### 11. vocational_results

`id uuid PK`; `user_id uuid FK auth.users.id` indexado; `version integer` (atual 1); `scores jsonb`; `evidence jsonb`; `principal_area_id text? FK knowledge_areas.id`; `principal_areas text[]`; `secondary_areas text[]`; `informative_answers integer CHECK BETWEEN 0 AND 10`; `sufficient boolean`; `completed_at timestamptz`; `created_at timestamptz`. Origem: `resultadoAfinidade.{versao,pontos,evidencias,areaPrincipal,principais,secundarias,informativas,suficiente,concluidoEm}` em `src/domain/testeVocacional.js` e `perfilService.salvarResultado`.

Validar IDs contidos em arrays/JSON contra knowledge_areas no servidor (FK simples não valida itens de array). Pontos e evidências devem corresponder à versão da matriz. Não aceitar pontuação como prova de identidade ou elegibilidade. O app atual usa somente o último resultado; escolher uma linha por usuário com UNIQUE(user_id) ou criar histórico e consulta determinística do último por completed_at,id. Histórico não está implementado na interface. Não criar quarta coleção no Perfil. Empate não escolhe área arbitrária; afinidade vem de areaPrincipal, que pode ser NULL.

## Relações

| Relação | Cardinalidade |
|---|---|
| auth.users → profiles / user_preferences | 1:0..1 cada |
| auth.users → tags / objetivos / resultados | 1:N (ou último resultado 1:1 conforme decisão acima) |
| usuários ↔ áreas | N:N por user_favorite_areas |
| usuários ↔ instituições | N:N por user_favorite_institutions |
| área → cursos | 1:N |
| instituições ↔ cursos | N:N por institution_courses |
| área → resultado principal | 1:N, referência opcional |

## Operações e substituição dos adaptadores

| Arquivo real | Operações e integração |
|---|---|
| src/services/perfil/perfilService.js | obterPerfil; atualizarBio; atualizarVisibilidade; salvarTag/excluirTag/ordenarTags; listarObjetivos/salvarObjetivo/excluirObjetivo/ordenarObjetivos; selecionarAvatar/removerAvatar/salvarFoto/carregarFoto; salvarResultado; alternarFavorito; listarAreasFavoritas/listarFaculdadesSalvas |
| src/services/perfil/localAdapter.js | carregar(uid), salvar(uid,perfil); fotos.salvar(uid,id,blob), carregar(uid,id), excluir(uid,id) |
| src/hooks/usePerfil.js | Carrega e atualiza estado da interface pelo serviço; preservar estados de espera/erro |
| src/services/areasService.js | Consulta áreas e encaminha favoritos ao serviço de Perfil |
| src/services/faculdadesService.js | criarFaculdadesService(adapter,favoritos), pesquisar, consultar, listarCursos, consultarOfertas, alternarFavorito, listarFavoritos |
| src/pages/internal/Perfil/Perfil.jsx | Consumidor dos editores e ordenação de objetivos |
| src/pages/internal/Faculdades/Faculdades.jsx | Busca/filtro/detalhe; cancela solicitações na troca de tela |
| src/domain/testeVocacional.js | Regra versionada, preservá-la na persistência |

O serviço atual lê um snapshot, clona, altera e salva. Substituir apenas localStorage por vários INSERTs independentes perderia atomicidade e poderia sobrescrever outra aba. O adaptador remoto deve carregar agregado e salvar em transação com `expected_revision` (compare-and-swap), ou a equipe deve implementar operações semânticas equivalentes no serviço. Não transmitir uma função JavaScript de mutação para o banco. Conflito deve recarregar e informar o usuário; não sobrescrever silenciosamente. Proprietário e limites são validados no servidor. Salvamento de tags, preferências e resultado deve ser consistente na mesma transação quando houver dependência.

### Catálogo remoto

Pode implementar `carregar()` retornando `{instituicoes,cursos,ofertas,status}` ou delegar `pesquisar(filtros)`, `consultar(id,opcoes)`, `listarCursos()` e `consultarOfertas(instituicaoId,cursoId)` já previstos na fábrica. `pesquisar` recebe `{busca,tipo,signal}` e devolve `{status,instituicoes:[...com ofertas e curso associado]}`; consultar recebe `{signal}` em opções e devolve instituição ou NULL. Replicar o DTO atual, sem trocar seus nomes por colunas SQL na UI.

Pesquisar no servidor por nome/sinônimos de curso, incluindo acentos/case/termos parciais, limitando cidade e tipo. A implementação local usa `normalizarBusca` e ofertas N:N. Em escala, usar consulta/indexação apropriada e projeção dos campos necessários. Paginação ainda exige extensão explícita de contrato (cursor, limite, próxima página) e interface de carregamento; não está pronta só porque existe um adaptador. AbortSignal deve chegar à consulta. Erro é diferente de resultado vazio e de integração pendente. Não usar dados locais como fallback silencioso após erro remoto.

### Sequência por módulo e prova de integração

1. Inventariar tabelas, políticas, buckets e URLs do projeto de desenvolvimento; versionar migração revisada sem executar em produção nesta etapa.
2. Criar catálogo de áreas/cursos/instituições/ofertas com dados curados e políticas de leitura. Testar busca com sinônimos, acentos, vazio, erro e cancelamento.
3. Criar Perfil/preferências/tags/objetivos e políticas por proprietário. Implementar agregado transacional e revisão; trocar o adaptador em um único ponto de composição. Testar criar/editar/remover/ordenar, limites e duas abas.
4. Integrar Storage e editor de imagem, incluindo remover, substituir, falha parcial e órfãos.
5. Integrar favoritos das duas seções ao mesmo repositório. Confirmar duplicação impossível e atualização no Perfil.
6. Persistir resultado versionado, incluindo insuficiente e empate, sem quebrar PNG e afinidade automática.
7. Definir importação **opcional e explícita** do conteúdo local da conta atual, com revisão de conflitos; nunca varrer dados locais de outros usuários ou enviar automaticamente tudo do navegador.
8. Confirmar no painel/requisição real e em outro dispositivo que o dado foi salvo remotamente. Uma atualização da mesma aba não prova persistência Supabase. Só então retirar o adaptador local padrão daquele módulo.

## RLS — proposta para revisão, não executada

Habilitar RLS em todas as tabelas expostas. Frontend e chave publicável não são a barreira de autorização. [Guia oficial de RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Exemplo ilustrativo para profiles (nomes/políticas devem ser reconciliados com o esquema real):

```sql
alter table public.profiles enable row level security;
create policy profiles_read_own on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy profiles_insert_own on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy profiles_delete_own on public.profiles for delete to authenticated
  using ((select auth.uid()) = id);
```

Para tags/preferências/objetivos/favoritos/resultados, aplicar a mesma regra usando user_id em SELECT/INSERT/UPDATE/DELETE conforme operações necessárias; FKs não substituem essas políticas. Nenhum usuário pode trocar proprietário. Para catálogo publicado, definir leitura pública ou autenticada conforme produto; escrita somente por fluxo confiável da equipe. Não conceder escrita geral, desabilitar RLS ou usar user_metadata como papel administrativo. RPC security definer exige revisão de permissões, validação de proprietário e search_path seguro; não copiar o RPC público de existência de e-mail como padrão de autorização.

## Storage de fotos — proposta

Bucket privado `profile-photos`, objeto `<auth.uid()>/<fotoId>` com ID novo por troca, `upsert: false`. Aceitar JPEG, PNG e WebP, limite 8 MB também no bucket/servidor; validar conteúdo de imagem além da extensão quando houver processamento. Assets oficiais continuam no repositório. [Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals) e [controle de acesso](https://supabase.com/docs/guides/storage/security/access-control).

As políticas de storage.objects para SELECT, INSERT e DELETE devem exigir `bucket_id = 'profile-photos'` e `(storage.foldername(name))[1] = (select auth.uid())::text`, restritas a authenticated. INSERT usa WITH CHECK, SELECT/DELETE usam USING. Não é necessário UPDATE ao criar sempre nova chave. Revisar permissões já existentes para evitar regra permissiva que contorne a restrição. Não mexer diretamente no conteúdo da tabela de metadados do Storage para enviar/excluir arquivos.

Adaptador: salvar faz upload; carregar devolve Blob por download autenticado (ou resolve URL temporária na apresentação); excluir remove o objeto. Persistir somente caminho e ID. URLs assinadas expiram, portanto não salvá-las como foto definitiva. [Downloads privados](https://supabase.com/docs/guides/storage/serving/downloads).

Sequência: enviar novo objeto → salvar metadado do Perfil com revisão → remover anterior. Se metadado falhar, remover novo. O serviço atual já tenta rollback e limpeza da foto anterior, mas limpeza antiga é best-effort: o adaptador remoto precisa registrar falhas e reconciliar órfãos, sem apagar fotos ainda referenciadas.

## Credenciais e validação final

Somente URL e chave publicável no React; secret/service_role e senha do banco ficam fora do cliente. [Tipos de chave](https://supabase.com/docs/guides/getting-started/api-keys). A autenticação do endpoint da IA é outro contrato, detalhado em INTEGRACAO_IA.md.

Testar em desenvolvimento com duas contas reais autorizadas e cliente sem sessão: A não pode ler/alterar/excluir linhas ou arquivos de B, inclusive adivinhando IDs; anônimo não acessa dados pessoais; catálogo não permite escrita indevida. Conferir limites, repetição de favorito, perda de rede, expiração de sessão, conflito de revisão, upload interrompido e limpeza. Verificar login/cadastro/confirmação/recuperação sem regressão. Não considerar concluído apenas porque a UI funciona com armazenamento local.
