# Guia prático — Supabase, Faculdades e dados do estudante

**Para os três integrantes de banco/integração e as duas pessoas de Administração.** Comece pelo [README principal](../README.md). Este roteiro descreve o trabalho a realizar; nenhuma tabela, função ou política foi criada por esta revisão dos documentos.

O objetivo é ligar os serviços existentes ao Supabase sem refazer as telas. A primeira entrega deve ser uma faculdade real completa aparecendo no site. Depois, ampliar o catálogo e concluir os dados pessoais.

**Por onde começar:** Integração 1 lê as etapas 1, 2 e 5; Integração 2 lê 3, 4 e 6; Integração 3 começa na 7 e confere a 8. Administração pode ir direto à etapa 3. Todos usam a lista final da etapa 9. Não é preciso executar tudo de uma vez.

## 1. Divisão do trabalho e primeira conferência

| Responsável | Trabalho principal | Como entrega aos colegas |
|---|---|---|
| Integração 1 | Projeto Supabase, tabelas, relações, regras de acesso e arquivos privados | Estrutura revisada e nomes dos campos definidos |
| Integração 2 | Receber a pesquisa de Administração, importar catálogo e conectar Faculdades | Busca, card e detalhe com dados reais |
| Integração 3 | Perfil, objetivos, favoritos, fotos, resultado e testes conjuntos | Salvamento online e isolamento entre usuários |
| Administração 1 | Dados institucionais e imagens autorizadas | Aba Instituições revisada |
| Administração 2 | Cursos e ofertas reais | Abas Cursos e Ofertas revisadas |

Administração revisa o material em dupla. Integração 2 é o contato delas com o banco. Integração 1 ajuda 2 e 3 com as permissões e estruturas; não precisa editar simultaneamente os arquivos dos colegas.

**Antes de criar:** Integração 1 abre o projeto Supabase autorizado e confere Table Editor, Authentication e Storage. Registra o que já existe, o que falta e qual ambiente será usado para testes. O repositório não confirma o estado atual do painel. Se existir tabela equivalente, aproveitar/mapeá-la em vez de duplicar.

Cada pessoa usa seu próprio acesso autorizado. Não distribuir senhas compartilhadas ou chaves administrativas à Administração. Mudanças revisadas do banco devem ser registradas em `supabase/migrations`, além de aplicadas no ambiente correto.

### Como ler o roteiro

- Tabela parece uma planilha; linha é um cadastro e coluna é uma informação.
- ID é o código estável da linha. PK identifica a linha; FK aponta para outra tabela.
- `text`: texto; `boolean`: true/false; `uuid`: código único; `integer`: inteiro; `numeric`: decimal; `timestamptz`: data/hora.
- `text[]`: lista de textos; `jsonb`: objeto ou lista de informações.
- Opcional significa que pode ficar NULL no banco. Não escrever a palavra “NULL” como texto.
- `published`: revisado e liberado para aparecer. Não concede permissão de edição ao estudante.

Quando o quadro usar barra, como created_at / updated_at, crie duas colunas, uma com cada nome. Nos dados pessoais, datas técnicas são preenchidas no servidor com now(); a data de conclusão do teste representa a conclusão, não qualquer edição.

As próximas tabelas são a proposta deste guia. Se a equipe já usa nomes diferentes, adaptar a tradução no serviço. Os exemplos de código dependem destes nomes.

## 2. Criar/conferir as quatro tabelas do catálogo

**Integração 1:** no Table Editor, use o esquema `public`, habilite RLS e crie somente o que faltar. Para IDs uuid, configurar PK e geração automática por `gen_random_uuid()`. Configurar as FKs indicadas. Também é possível criar por migração SQL revisada; manter uma única estrutura oficial.

### 2.1 knowledge_areas — referência das áreas

| Coluna | Tipo/regra | Conteúdo |
|---|---|---|
| id | text, PK | Código existente no React |
| name | text, obrigatório | Nome da área |
| published | boolean, default false | true após revisão |

Copiar IDs/nomes de `src/data/areasCatalogo.js`: tecnologia, exatas, saude, ambiente, agro, humanas, direito, artes, negocios, educacao. Não trocar esses IDs por UUID. Avatares, selos, cores e descrições continuam nos arquivos atuais; esta tabela serve para as relações do banco.

### 2.2 institutions — instituições/unidades

Uma linha por instituição/unidade identificável, evitando cadastrar a mesma unidade duas vezes.

| Coluna | Tipo/regra | Preenchimento |
|---|---|---|
| id | uuid, PK automática | Banco |
| name | text, obrigatório | Nome oficial, Administração 1 |
| type | text, obrigatório: publica ou privada | Administração 1 |
| city / state | text, obrigatórios | Vitória da Conquista / BA no escopo atual |
| address | text, opcional | Endereço confirmado |
| description | text, opcional | Apresentação curta e revisada |
| image_url | text, opcional | URL da imagem autorizada, definida por Integração 2 |
| website | text, opcional | Site oficial |
| additional_information | text, opcional | Outras informações confirmadas |
| links | jsonb, default [] | Lista de objetos com nome e url |
| source | text, obrigatório antes de publicar | Link que comprova o cadastro |
| verified_at | timestamptz, obrigatório antes de publicar | Data/hora da conferência |
| published | boolean, default false | Liberado por Integração 2 após revisar |
| created_at / updated_at | timestamptz, default now() | Datas técnicas; atualizar updated_at nas edições |

Criar regra para type aceitar somente publica/privada. Se houver mais de um campus, distinguir nome/unidade e endereço. Neste modelo inicial, a própria linha da instituição/unidade identifica a localização; uma tabela de campi separada exige decisão coordenada futura.

### 2.3 courses — cursos do catálogo real

| Coluna | Tipo/regra | Conteúdo |
|---|---|---|
| id | uuid, PK automática | ID estável do curso |
| name | text, obrigatório | Nome oficial |
| area_id | text, FK → knowledge_areas.id | Área principal validada pela equipe |
| synonyms | text[], default {} | Alternativas de busca, por exemplo ADS |
| description | text, opcional | Explicação breve |
| published | boolean, default false | Liberar após revisão |
| updated_at | timestamptz, default now() | Atualizar ao editar |

Um curso não deve ser repetido para cada faculdade. A próxima tabela faz essa ligação. As tags de `src/data/conteudoAreas.js` são informativas: não comprovam oferta na cidade. Não importar todas como ofertas reais nem confundir IDs locais como tecnologia-1 com os UUIDs desta tabela.

### 2.4 institution_courses — ofertas confirmadas

Aqui se registra “a instituição X oferece o curso Y”. Sem essa linha, pesquisar o curso não encontra aquela instituição.

| Coluna | Tipo/regra | Conteúdo |
|---|---|---|
| id | uuid, PK automática | ID da oferta |
| institution_id | uuid, FK → institutions.id | ID da instituição cadastrada |
| course_id | uuid, FK → courses.id | ID do curso cadastrado |
| modality | text, obrigatório antes de publicar | Modalidade confirmada e padronizada |
| shift | text, opcional | Turno confirmado |
| admission_methods | text[], default {} | Códigos confirmados: enem, sisu, prouni, fies, vestibulares |
| monthly_fee | numeric(12,2), opcional, >= 0 | Valor confirmado; NULL quando desconhecido |
| scholarships | text, opcional | Condições de bolsas, em texto curto |
| financing | text, opcional | Condições de financiamento, em texto curto |
| source | text, obrigatório antes de publicar | Link oficial que comprova a oferta |
| verified_at | timestamptz, obrigatório antes de publicar | Data/hora da conferência |
| published | boolean, default false | Liberação após revisão |
| created_at / updated_at | timestamptz, default now() | Datas técnicas |

Criar índices nas duas FKs. Revisar duplicatas pela combinação instituição + curso + modalidade + turno, tratando turno desconhecido consistentemente. Não usar somente UNIQUE(institution_id,course_id), pois pode haver modalidades/turnos diferentes. Se precisar de campus separado, combinar a mudança antes de importar.

**Para combinar com o React:** bolsas e financiamentos devem chegar como texto, não objetos. Mensalidade desconhecida chega como null, não zero. Modalidades podem ser padronizadas como Presencial, EAD e Semipresencial, conforme a pesquisa. O turno pode ser armazenado, mas não é exibido separadamente na tela atual; um novo campo no banco não cria sozinho um novo elemento visual.

## 3. Administração: pesquisar e entregar uma planilha de trabalho

As duas pessoas de Administração não precisam programar, editar o React ou ter chave administrativa. Usem uma planilha compartilhada com três abas. Ela serve para coleta/revisão; **Integração 2 recebe e insere os dados no banco**. Não existe uma nova tela administrativa pronta dentro do MeuNorte.

### Aba Instituições — Administração 1

Uma linha por instituição/unidade. Criar estas colunas:

`codigo_coleta`, `nome`, `tipo`, `cidade`, `uf`, `endereco`, `apresentacao`, `site_oficial`, `fonte_instituicao`, `data_verificacao`, `imagem_ou_link`, `permissao_imagem`, `observacoes`, `status_coleta`, `revisado_por`, `institution_id`.

O codigo_coleta pode ser I001: é só uma etiqueta da pesquisa. institution_id fica vazio até Integração 2 devolver o UUID do banco. Nome/endereço precisam distinguir unidades quando necessário.

### Aba Cursos — Administração 2

Uma linha por curso, sem repetir por faculdade:

`codigo_curso_coleta`, `nome_oficial`, `area_sugerida`, `sinonimos_de_busca`, `fonte_curso`, `data_verificacao`, `observacoes`, `status_coleta`, `revisado_por`, `course_id`.

ADS pode ser sinônimo de Análise e Desenvolvimento de Sistemas. Não tratar automaticamente um curso geral e uma licenciatura específica como iguais. Integração 2 valida a área com os IDs existentes e devolve o course_id final.

### Aba Ofertas — Administração 2, revisão de Administração 1

Uma linha por oferta confirmada:

`codigo_coleta_instituicao`, `codigo_curso_coleta`, `modalidade`, `turno`, `formas_ingresso_confirmadas`, `mensalidade_confirmada`, `bolsas_confirmadas`, `financiamentos_confirmados`, `fonte_oferta`, `data_verificacao`, `observacoes`, `status_coleta`, `revisado_por`, `institution_id`, `course_id`.

Os códigos de coleta permitem cruzar a pesquisa antes de haver IDs finais. Depois, Integração 2 preenche as duas últimas colunas com os UUIDs correspondentes.

### Pesquisa, revisão e entrega

1. Dividam as instituições para evitar trabalho repetido. Comecem por uma completa.
2. Priorizem páginas oficiais da instituição, do curso, de ingresso e editais. Guardem o link exato que comprova cada informação.
3. Aceitar ENEM não comprova participação em Sisu, Prouni ou Fies. Conferir cada condição separadamente.
4. Informação desconhecida fica marcada nas observações, sem adivinhar valor, turno ou bolsa. No banco, ela fica vazia.
5. Escrevam apresentação curta e fiel; evitem copiar texto promocional extenso. Imagem precisa de fonte e uso autorizado.
6. Usem status_coleta: “em pesquisa”, “aguardando confirmação”, “revisado”. São rótulos da planilha, não valores para type/published do banco.
7. Troquem a revisão: a outra pessoa confere unidade, curso, links e condições.
8. Entreguem a Integração 2 o link da planilha e quais linhas estão revisadas. Correções posteriores preservam os IDs.

Exemplo apenas para entender a relação, **não para publicar:** Instituição Exemplo ocupa uma linha em Instituições; Curso Exemplo, uma em Cursos; a ligação dos dois, uma em Ofertas. Não cadastrar dados fictícios no catálogo publicado.

## 4. Integração 2: inserir a pesquisa no banco

1. Receba linhas revisadas e confira fontes/campos obrigatórios.
2. Preencha knowledge_areas, depois institutions e courses. Mantenha published = false durante a revisão.
3. Copie os IDs gerados para a planilha. Confira qual UUID corresponde a cada código de coleta.
4. Preencha institution_courses usando os UUIDs, não nomes de faculdade nem etiquetas I001.
5. Confira modalidade, valores, datas e códigos de ingresso: usar sisu, não SISU.
6. Faça a primeira rodada com uma instituição/curso/oferta reais no ambiente de desenvolvimento.
7. Libere published = true no curso, na instituição e na oferta revisados. As três partes precisam estar prontas.
8. Depois de provar a ligação no site, amplie o catálogo em pequenos lotes.

Para poucas linhas, use **Table Editor → tabela → Insert**. Para lote revisado, preparar CSV com colunas correspondentes às do banco e usar **Import Data from CSV**, conforme o painel. [Importação oficial](https://supabase.com/docs/guides/database/import-data).

Não importar a planilha de pesquisa inteira sem adaptação: ela tem colunas de controle que não existem no banco. Integração 2 traduz os nomes e resolve IDs. Para text[]/jsonb, conferir o formato do importador numa linha antes do lote; se necessário, preencher pelo editor ou script revisado. Mensalidade é número sem “R$”; informação desconhecida fica NULL.

Atualização usa o ID existente, sem recadastrar a linha como nova. Importar pelo painel administrativo não comprova o acesso de um usuário comum.

## 5. Integração 1: regras de acesso

Configurar antes da conexão. Neste roteiro, o catálogo publicado é lido por usuários autenticados; somente a equipe autorizada edita pelo painel. Não abrir escrita geral para quem fez login.

| Grupo | Leitura | Escrita pelo site |
|---|---|---|
| knowledge_areas, institutions, courses, institution_courses | authenticated; published = true | Não permitir a usuário comum |
| profiles | Apenas id igual ao usuário | Apenas sua própria linha |
| Outras tabelas pessoais da etapa 7 | Apenas user_id igual ao usuário | Apenas suas próprias linhas |

Nas políticas de RLS da tabela, escolher operação/papel e condição. Catálogo: `published = true`, papel authenticated. Perfil: `(select auth.uid()) = id`. Outras tabelas pessoais: `(select auth.uid()) = user_id`.

INSERT deve validar a linha nova (WITH CHECK). UPDATE verifica a existente (USING) e a nova, impedindo trocar o dono. SELECT/DELETE usam USING. RLS sem política pode retornar lista vazia: não desligar a proteção para corrigir. [Guia de RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Além da política por linha, conferir as permissões da própria tabela. Se a criação automática de permissões estiver desligada, a política sozinha não libera a consulta. Após todas as tabelas existirem e a RLS estar habilitada, Integração 1 pode revisar estes privilégios mínimos em uma migração, sem conceder escrita de catálogo:

```sql
grant usage on schema public to authenticated;
grant select on public.knowledge_areas, public.institutions,
  public.courses, public.institution_courses to authenticated;
grant select, insert, update, delete on public.profiles,
  public.user_preferences, public.custom_tags, public.user_goals,
  public.user_favorite_areas, public.user_favorite_institutions,
  public.vocational_results to authenticated;
```

Esses privilégios não substituem RLS nem anulam permissões antigas; revisar regras existentes e acesso de anon/usuário comum. Uma função de salvamento também precisa de permissão de execução restrita e revisão própria.

Registrar políticas em migração e testar pedidos diretos. Não usar nome, e-mail digitado ou user_metadata editável para conceder administração. O dono confiável vem da sessão validada.

## 6. Integração 2: ligar as consultas aos cards

O ponto é `src/services/faculdadesService.js`. Seu export final ainda usa fonte pendente. Tabelas preenchidas não alteram esse export automaticamente.

### Tradução do banco para a tela

| Colunas do banco | Nomes que o React espera |
|---|---|
| name / type / city | nome / tipo / cidade |
| address / description / image_url / website | endereco / descricao / imagem / site |
| additional_information / links / source / verified_at | informacoesAdicionais / links / fonte / verificadoEm |
| courses.name / area_id / synonyms | nome / areaId / sinonimos |
| institution_id / course_id / modality / shift | instituicaoId / cursoId / modalidade / turno |
| admission_methods / monthly_fee / scholarships / financing | ingressos / mensalidade / bolsas / financiamentos |

A fábrica existente associa listas de instituições, cursos e ofertas. Preservar IDs e formatos, sem mudar o JSX para entender nomes SQL.

### Exemplo inicial para implementar, não instalado nesta revisão

Depende das tabelas/políticas acima. Serve ao primeiro catálogo pequeno e encaminha o cancelamento da tela. No arquivo faculdadesService.js, adicionar o import junto aos atuais; manter pesquisarCatalogo/criarFaculdadesService; inserir estas funções e substituir somente o export final, sem duplicá-lo:

```javascript
import { supabase } from '../lib/supabaseClient.js'

async function carregarCatalogoOnline(signal) {
  if (!supabase) throw new Error('Confira a configuração do Supabase.')
  const consultar = async tabela => {
    let pedido = supabase.from(tabela).select('*')
      .eq('published', true).order('id').range(0, 999)
    if (signal) pedido = pedido.abortSignal(signal)
    const { data, error } = await pedido
    if (error) throw error
    if (data.length >= 1000) throw new Error('Implementar paginação do catálogo.')
    return data
  }
  const [instituicoes, cursos, ofertas] = await Promise.all([
    consultar('institutions'), consultar('courses'), consultar('institution_courses'),
  ])
  const idsInstituicoes = new Set(instituicoes.map(i => i.id))
  const idsCursos = new Set(cursos.map(c => c.id))
  return {
    status: 'disponivel',
    instituicoes: instituicoes.map(i => ({
      id: i.id, nome: i.name, tipo: i.type, cidade: i.city,
      endereco: i.address, descricao: i.description, imagem: i.image_url,
      site: i.website, informacoesAdicionais: i.additional_information,
      links: i.links ?? [], fonte: i.source, verificadoEm: i.verified_at,
    })),
    cursos: cursos.map(c => ({
      id: c.id, nome: c.name, areaId: c.area_id,
      sinonimos: c.synonyms ?? [], descricao: c.description,
    })),
    ofertas: ofertas.filter(o => idsInstituicoes.has(o.institution_id)
      && idsCursos.has(o.course_id)).map(o => ({
      id: o.id, instituicaoId: o.institution_id, cursoId: o.course_id,
      modalidade: o.modality, turno: o.shift, ingressos: o.admission_methods ?? [],
      mensalidade: o.monthly_fee == null ? null : Number(o.monthly_fee),
      bolsas: o.scholarships, financiamentos: o.financing,
      fonte: o.source, verificadoEm: o.verified_at,
    })),
  }
}
const adaptadorOnline = {
  carregar: () => carregarCatalogoOnline(),
  async pesquisar({ signal, ...filtros } = {}) {
    const c = await carregarCatalogoOnline(signal)
    return { status: c.status, instituicoes: pesquisarCatalogo(c, filtros) }
  },
  async consultar(id, { signal } = {}) {
    return pesquisarCatalogo(await carregarCatalogoOnline(signal))
      .find(i => i.id === id) ?? null
  },
}
export const faculdadesService = criarFaculdadesService(adaptadorOnline)
```

Conferir o limite de linhas da API do projeto: o exemplo pressupõe ao menos 1000 e recusa catálogo que atinja esse limite, sem mostrar resultado cortado. Com limite menor, ajustar/detectar corte. Em catálogo maior, implementar consulta filtrada no servidor, só campos necessários e paginação; não aumentar o limite indefinidamente. A interface ainda não tem paginação pronta.

Esse caminho reutiliza busca atual por trecho, acentos e sinônimos, filtro de tipo e Vitória da Conquista. Padronizar cidade na base. Erro deve continuar como erro, sem virar catálogo fictício/local. Status disponivel indica consulta concluída, não garante resultado.

**Primeiro teste:** usuário comum confirmado pesquisa o curso cadastrado, vê o card, abre o detalhe e confere nome, cidade, tipo, curso, modalidade, ingresso e site. Depois testar busca parcial/sinônimo/acentos, filtros, nenhum resultado, rede indisponível e troca rápida de tela. Favoritos online ainda dependem da etapa 7.

**Imagens:** Integração 2 recebe imagem/fonte/autorização da Administração. Pode usar bucket público separado `institution-assets`, somente para imagens institucionais autorizadas, com escrita restrita à equipe. Guardar a URL em image_url. Não usar o bucket privado de fotos pessoais. Sem imagem, o card já mostra ícone.

## 7. Integração 3 e 1: dados pessoais online

O Auth já fornece auth.users.id. Nome, nascimento e escolaridade continuam em user_metadata: full_name, birth_date, education_level. Não criar tabela de senhas ou duplicar idade; o código calcula a idade. Não trocar a fonte dos dados do cadastro sem migração combinada. Códigos escolares: `src/data/opcoesEstudo.js`.

### Tabelas a preparar

Aplicar RLS por dono e índices em user_id nas listas. Usar datas técnicas no servidor. Dados pessoais podem ter ON DELETE CASCADE na FK da conta, com exclusão de arquivos tratada separadamente; este guia não cria fluxo de exclusão de conta no cliente.

| Tabela | Colunas/regras propostas | Atende |
|---|---|---|
| profiles | id uuid PK FK auth.users.id; bio text default '' até 160; avatar_kind text opcional oficial/foto; avatar_id text FK knowledge_areas.id opcional; photo_id uuid e photo_path text opcionais; revision bigint default 0; created_at/updated_at timestamptz default now() | Bio/avatar/foto |
| user_preferences | user_id uuid PK FK auth.users.id; show_occupation, show_age, show_affinity boolean default true; created_at/updated_at timestamptz | Mostrar/ocultar tags automáticas |
| custom_tags | id uuid PK; user_id uuid FK auth.users.id; texto text 1..20; normalized_text text; cor text; position integer >= 0; created_at/updated_at timestamptz | Tags e ordem |
| user_goals | id uuid PK; user_id uuid FK auth.users.id; title text até 60 default ''; body text 1..600; position integer >= 0; created_at/updated_at timestamptz | Objetivos e ordem |
| user_favorite_areas | user_id uuid FK auth.users.id; area_id text FK knowledge_areas.id; created_at timestamptz; PK (user_id,area_id) | Áreas salvas |
| user_favorite_institutions | user_id uuid FK auth.users.id; institution_id uuid FK institutions.id; created_at timestamptz; PK (user_id,institution_id) | Faculdades salvas |
| vocational_results | user_id uuid PK FK auth.users.id; version integer; scores/evidence jsonb; principal_area_id text FK knowledge_areas.id opcional; principal_areas/secondary_areas text[]; informative_answers integer 0..10; sufficient boolean; completed_at/updated_at timestamptz | Último resultado do teste |

Primeira versão: uma linha de resultado por usuário, substituída ao concluir novamente. Histórico é futuro; não criar quarta coleção na interface.

**Regras que o salvamento precisa conferir:**

- Tags: cores lima, azul, lilas, menta, coral, amarelo. UNIQUE(user_id,normalized_text), normalizando acentos/maiúsculas. Limite de seis incluindo automáticas visíveis, não somente as linhas personalizadas.
- Avatar: oficial usa só avatar_id; foto usa photo_id/path; removido deixa todos vazios. URL temporária não é referência definitiva.
- Objetivos: dono validado; criação preservada ao editar. Datas antigas desconhecidas não devem ser inventadas: registrar importação separada ou permitir NULL legado documentado.
- Favoritos: nome vem do catálogo ao carregar; não criar lista independente na seção Faculdades.
- Resultado: versão atual 1; scores/evidence correspondem a pontos/evidencias. Validar IDs das áreas também dentro de arrays/JSON. Área principal pode ser NULL em empate/insuficiência; preservar `src/domain/testeVocacional.js`.
- updated_at é atualizado no servidor em cada edição; não confiar apenas no relógio do navegador.

### Onde ligar ao serviço existente

Em `src/services/perfil/perfilService.js`, o export final usa `criarPerfilService(criarAdaptadorLocal())`. Deve passar a receber adaptador online e repositório de fotos. Arquivo sugerido para criar: `src/services/perfil/supabaseAdapter.js`; **ele ainda não existe**.

| Função a implementar | Responsabilidade |
|---|---|
| carregar(uid) | Consultar dados próprios e montar o mesmo objeto Perfil |
| salvar(uid, perfil) | Salvar alterações, exclusões e ordem, devolvendo Perfil atualizado |
| fotos.salvar(uid,id,blob) | Enviar imagem privada do dono |
| fotos.carregar(uid,id) | Devolver Blob para a visualização existente |
| fotos.excluir(uid,id) | Remover arquivo do dono |

Formato de retorno, com dados meramente ilustrativos:

```javascript
{
  versao: 1, bio: '',
  tags: [{ id: 'uuid', texto: 'Exemplo', cor: 'lima' }],
  visibilidade: { ocupacao: true, idade: true, afinidade: true },
  avatar: null, // ou {tipo:'oficial',id:'tecnologia'} ou {tipo:'foto',id:'uuid'}
  objetivos: [{ id: 'uuid', titulo: '', texto: 'Meu objetivo',
    usuarioId: 'uuid-do-usuario', criadoEm: 'data-ISO', atualizadoEm: 'data-ISO' }],
  areasFavoritas: [{ id: 'tecnologia', nome: 'Tecnologia' }],
  faculdadesSalvas: [{ id: 'uuid', nome: 'Nome oficial' }],
  areaAfinidade: null,
  // resultadoAfinidade, quando existir:
  // {versao,pontos,evidencias,informativas,suficiente,
  //  principais,secundarias,areaPrincipal,concluidoEm}
}
```

Sem itens, devolver arrays vazios. Preferences viram visibilidade; objetivos traduzem title/body/position e datas; favoritos obtêm nomes por relação; areaAfinidade vem da área principal do resultado. Não incluir foto em base64 no Perfil.

### Como evitar gravação pela metade ou perda entre abas

O serviço atual lê o Perfil, muda uma parte e salva o conjunto. Dez gravações independentes podem falhar pela metade; outra aba pode sobrescrever dado novo com versão antiga.

Integração 1 e 3 devem preparar uma operação de banco que salve o conjunto em transação: tudo válido é salvo, ou nada é alterado. Uma função SQL chamada via supabase.rpc é uma opção. Nome sugerido e ainda inexistente: salvar_meu_perfil.

Ela deve identificar dono por auth.uid(), rejeitar UID diferente, bloquear a linha e comparar revision carregada com revision atual. Validar limites/IDs/propriedade, aplicar inclusões/edições/exclusões/ordem e incrementar revisão na mesma transação. Conflito deve pedir para recarregar, sem sobrescrever silenciosamente. Tratar criação inicial para usuário novo sem duplicatas.

O adaptador pode carregar uma propriedade técnica adicional `_revision`; o serviço atual clona o objeto e a preserva. Conferir a ida/volta dessa extensão em teste antes de usar. `versao: 1` é formato do Perfil, não contador de edição. Não enviar função JavaScript para o SQL.

Se usar security definer, revisar dono explicitamente, search_path seguro e execução restrita a authenticated. Não copiar RPC público de existência de e-mail como padrão de autorização. Revisar juntos essa transação antes de substituir o adaptador.

Validar nesta ordem: bio → preferências/tags → objetivos/ordem → favoritos → resultado → foto. Preservar as operações atuais, inclusive remover/ordenar. SELECT funcionando não basta para declarar toda a integração pronta.

### Foto pessoal: armazenamento privado

Integração 1 cria/confere bucket privado `profile-photos`, JPEG/PNG/WebP, limite 8 MB. Integração 3 usa `<uid>/<fotoId>`, com ID novo por troca. Avatares oficiais continuam nos assets.

Políticas para authenticated exigem bucket correto e primeira pasta igual ao próprio usuário. SELECT/DELETE usam essa condição; INSERT confere o novo caminho. Sem UPDATE se não sobrescrever arquivos. [Controle de acesso do Storage](https://supabase.com/docs/guides/storage/security/access-control).

Sequência: enviar nova foto → salvar referência no Perfil → remover anterior. Se Perfil falhar, remover nova. Registrar/repetir falhas de limpeza sem apagar arquivo ainda usado. Baixar autenticado ou gerar URL temporária apenas para exibição; persistir somente ID/caminho.

### Dados locais existentes

Não enviar automaticamente tudo do localStorage. Oferecer importação consciente da conta atual e revisar conflitos; nunca misturar outros usuários. Se importar foto local, também enviá-la ao Storage. Testar em outro aparelho para comprovar persistência online.

### Apoio à IA Python

A IA é um serviço Python separado da interface React. Integração 1 ajuda a validar os tokens Supabase e a leitura autorizada do catálogo; Integração 2 fornece as tabelas/campos revisados; Integração 3 testa o fluxo. Não é necessário portar a IA para uma Edge Function ou duplicar o banco. A nova configuração pública de endereço da API será adicionada na implementação, seguindo o [guia de IA](INTEGRACAO_IA.md).

## 8. Contas, e-mail e publicação

**Integração 3 conduz, Integração 1 revisa.** Auth já funciona em `src/services/auth.js`, `src/contexts` e no cliente único. Não editar tabelas internas do Auth para recriar cadastro.

Conferir **Authentication → URL Configuration**:

- Site URL: https://meunorteapp.com.br/
- Confirmação: https://meunorteapp.com.br/?auth=confirmacao
- Recuperação: https://meunorteapp.com.br/?auth=recuperacao
- Desenvolvimento: os equivalentes em http://localhost:5173/.

Cadastrar retornos exatos para www/domínio/porta realmente usados. Não desligar confirmação ou trocar template de e-mail para contornar erro. Conferir SMTP/remetente existente e testar com contas autorizadas. [Retornos](https://supabase.com/docs/guides/auth/redirect-urls) e [SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

O RPC de consulta antecipada de e-mail está em `supabase/migrations/202611150001_email_ja_cadastrado.sql`; conferir antes de executar novamente. VITE_EMAIL_CHECK_ENABLED só deve ser true onde a função foi instalada/validada. A consulta não substitui unicidade do Auth e permite inferir existência de conta, portanto precisa de controle de uso. Preservar o comportamento aprovado.

Na Vercel, conferir variáveis públicas e o projeto usado pelo ambiente. .env.local não configura a hospedagem. Se mudar variável de build, gerar nova publicação pelo fluxo combinado. Nenhuma chave privada no React/VITE_.

## 9. Lista de aceite

Outro colega deve conseguir repetir os testes, além de quem implementou.

- [ ] Instituição/curso/oferta reais da pesquisa aparecem no card e detalhe.
- [ ] Sinônimos, acentos, trechos, filtros, limpar e nenhum resultado funcionam.
- [ ] Erro de rede aparece como erro; não como dado inventado ou sucesso vazio.
- [ ] Usuário comum não escreve no catálogo, inclusive por pedido direto.
- [ ] Perfil, tags, objetivos, ordem, preferências, favoritos e resultado aparecem em outro aparelho.
- [ ] Favorito removido atualiza Perfil e Faculdades sem listas concorrentes.
- [ ] Contas A/B não leem/editam/excluem dados/arquivos uma da outra; sem sessão também não acessa dados pessoais.
- [ ] Duas abas não sobrescrevem sem aviso; falha intermediária não salva metade do Perfil.
- [ ] Foto envia/troca/remove; falha não deixa referência quebrada.
- [ ] Teste mantém empate/insuficiência e regra atual.
- [ ] Cadastro, confirmação, login, recuperação e saída continuam funcionando.
- [ ] Lint, testes e build passam; também houve conferência em celular real.

| Sintoma | Conferir primeiro |
|---|---|
| Continua “Estamos preparando esse caminho” | Export ainda pendente? Código conectado foi publicado? |
| Banco tem linhas, site não mostra | Sessão, RLS, published das três partes e cidade |
| Busca não encontra faculdade pelo curso | Oferta aponta para IDs certos? Curso/oferta publicados? |
| Outro aparelho não vê o salvamento | Adaptador ainda é local? Requisição chegou ao banco? |
| 401/403 | Sessão/permissões; não colocar service_role no navegador |
| Bolsas quebra a tela | Objeto chegou onde a tela espera texto? |
| Favoritos divergem entre telas | As duas usam o mesmo perfilService remoto? |
| Link de e-mail vai para lugar errado | Domínio/porta e retorno exato autorizado |

Entregar: responsáveis, migrações revisadas, adaptadores trocados, lote importado com fontes e evidência dos testes. Dados incompletos continuam identificados; não declarar catálogo completo sem curadoria.
