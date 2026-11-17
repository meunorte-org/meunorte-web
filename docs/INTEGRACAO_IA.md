# Guia prático — conectar a IA ao Nô

**Para o integrante responsável pela IA.** Leia o [README principal](../README.md). Integração 1 ajuda com o Supabase e autenticação; Integração 2 ajuda com o catálogo de faculdades; Integração 3 repete os testes com você.

**O integrante já criou um código Python que consulta a API da OpenAI.** Vamos aproveitar essa implementação. O Python funciona como a ponte entre o MeuNorte e a OpenAI; o React conversa com o serviço Python por uma API HTTP, enviando e recebendo JSON. Não é necessário reescrever a IA em JavaScript ou treinar um modelo para esta integração.

Sua entrega é fazer essa IA responder dentro da conversa do MeuNorte. Não é necessário criar outro chatbot ou redesenhar a tela. Os exemplos abaixo orientam trabalho futuro; esta documentação não conectou nem publicou um serviço.

**Por onde começar:** faça o acordo da etapa 2, confirme o formato da etapa 3 e prepare seu serviço na etapa 4. Só depois ligue o transporte da etapa 5. A consulta de faculdades é a etapa 6; a revisão conjunta está nas etapas 8 e 9.

## 1. O que já existe e o que você precisa entregar

Já existem botão do Nô com arrasto, repouso, sugestões, campo de mensagem, histórico da aba, espera, erro, repetir e cancelar. Fechar a conversa devolve a pessoa à página anterior. O padrão informa que a IA ainda está sendo conectada; não gera respostas falsas.

Você precisa entregar quatro peças:

1. **Um serviço seguro:** recebe mensagem do usuário conectado, chama sua IA e devolve uma resposta.
2. **Uma função de conexão no projeto:** envia o pedido da interface para esse serviço. Nos arquivos ela é chamada transporte.
3. **A consulta aos dados verificados quando a pergunta for sobre faculdades:** não inventar oferta, bolsa, valor ou adesão a programas.
4. **Testes reais:** mostrar resposta, falhas e proteção entre usuários sem quebrar a navegação.

Fluxo esperado:

```text
Pessoa escreve no Nô
    → serviço do site envia mensagens e a identificação da sessão
    → API Python verifica quem está pedindo
    → Python prepara as mensagens e os dados necessários
    → API da OpenAI produz a resposta
    → Python adapta a resposta ao formato combinado
    → a conversa existente mostra o texto
```

A chave privada da OpenAI fica no ambiente protegido do servidor Python. Ela nunca acompanha a mensagem enviada pelo navegador. O token Supabase identifica o estudante; a chave OpenAI permite ao Python consultar o provedor. São credenciais diferentes e não devem ser trocadas de lugar.

## 2. Primeiro acordo com os colegas

Antes de mexer nos arquivos, responda junto à equipe:

| Combinar | Quem ajuda | Resultado esperado |
|---|---|---|
| Onde a API Python já roda ou vai rodar? | Responsável pela IA | Endereço local/HTTPS, dependências e forma de iniciar |
| Como receber a sessão Supabase e conferir o usuário? | Integração 1 | Pedido sem sessão/sem usuário válido é recusado |
| Quais dados de faculdades já estão revisados? | Integração 2 | Mesma base publicada que abastece os cards |
| Quem terá as chaves e onde ficam configuradas? | IA + Integração 1 | Segredos no servidor; cada pessoa com acesso autorizado |
| Quem repetirá os testes no site? | Integração 3 | Teste de outra conta, dispositivo e falhas |

**Caminho principal: React → API Python → API da OpenAI → Python → React.** Se o integrante já usa FastAPI, Flask ou outro framework, aproveitar essa estrutura. Se hoje a IA só roda em script ou notebook, criar uma API em volta da função que já responde. FastAPI é uma opção caso ainda não haja API; não precisa migrar um backend funcional para outro framework.

Não copiar o arquivo Python para uma Supabase Edge Function esperando executá-lo ali. Para esta entrega, mantenham a execução em um ambiente que rode Python e as dependências reais da IA. Uma função intermediária só deve ser adicionada se houver necessidade combinada, não como requisito. A hospedagem do React e a da API podem ser diferentes; ambas precisam estar acessíveis e configuradas.

Antes de escolher a hospedagem, o integrante informa: versão do Python, dependências, função que já chama a OpenAI, modelo configurado, forma de iniciar e tempo de resposta. Para o caminho informado, não é necessário hospedar o modelo da OpenAI nem reservar GPU para executar esse modelo: a hospedagem precisa rodar o serviço Python. Se houver outras tarefas locais pesadas no código, avaliar suas necessidades separadamente.

Para a primeira entrega, prefira uma resposta completa por pedido e histórico apenas da aba, como a interface atual. Digitação progressiva de resposta (streaming), banco de conversas e busca por vetores não são exigências para ligar esta versão. Se sua implementação já usa isso, adapte a saída para o formato atual ou combine uma mudança futura separada.

### O que o código enviado já faz — e o que ainda falta

O trecho compartilhado usa OpenAI(), lê input() em um while True, chama client.responses.create(model="gpt-5.5", input=mensagem) e imprime resposta.output_text. A leitura de código confirma esse fluxo; esta revisão não executou chamadas, não verificou a conta e não testou acesso ao modelo informado.

| No trecho atual | Adaptação para o MeuNorte |
|---|---|
| input() recebe texto digitado no terminal | A rota Python recebe as mensagens do site por JSON |
| while True mantém um terminal aberto | O servidor atende pedidos HTTP; não usar um loop de input por estudante |
| responses.create faz a chamada à OpenAI | Preservar essa chamada dentro de uma função reutilizável |
| input=mensagem envia somente a pergunta atual | Converter o histórico autorizado do site para o formato de entrada da OpenAI |
| print(resposta.output_text) mostra no terminal | Retornar o texto dentro de resposta.id/texto, como JSON |
| Não há instruções específicas do Nô | Adicionar orientação do MeuNorte e regras para não inventar dados de faculdades |
| Não há consulta ao Supabase | Consultar catálogo revisado quando necessário, conforme etapa 6 |
| Não há sessão, controle de uso ou tratamento de erro | Implementar antes da publicação, conforme etapas 4 e 8 |

**Primeira mudança prática do integrante:** extrair a chamada à OpenAI para uma função, por exemplo gerar_resposta(mensagens). O terminal pode continuar como ferramenta de teste, mas a rota chama essa função diretamente. Não trocar input() por uma variável e supor que isso sozinho criou uma API.

O loop atual não mantém contexto de conversa: cada chamada envia apenas a mensagem da vez. Para esta interface, a opção inicial é converter as mensagens recebidas em histórico de entrada. Outra possibilidade da OpenAI usa encadeamento por ID, mas exigiria cuidar da propriedade e do estado de cada conversa. Não misturar as duas estratégias sem necessidade. [Estado de conversa](https://developers.openai.com/api/docs/guides/conversation-state).

OpenAI() lê a chave da configuração de ambiente; no servidor publicado, essa configuração precisa existir também, sem depender do Windows pessoal do integrante. O acesso Responses e a extração output_text já usados podem ser aproveitados. [SDK e configuração](https://developers.openai.com/api/docs/quickstart), [Responses em Python](https://developers.openai.com/api/reference/python/resources/responses/methods/create).

Não mudar automaticamente o modelo, a biblioteca ou o tipo de chamada. Confirmar acesso ao modelo configurado e limites da conta no ambiente autorizado. Um script que responde no terminal é a base da chamada; autenticação, API, histórico, catálogo, erros e publicação ainda são entregas de integração.

## 3. Conhecer a entrada e a saída antes de conectar

### O que a interface envia

O arquivo `src/services/ai/assistenteService.js` já valida o pedido. Seu transporte recebe algo como:

```javascript
{
  conversaId: null,
  mensagens: [
    { id: 'id-unico-da-pergunta', papel: 'usuario', texto: 'Como funciona o Sisu?' }
  ],
  contexto: { secao: 'ingressos', assunto: 'sisu' },
  signal: AbortSignal
}
```

| Campo | Significado e cuidado |
|---|---|
| conversaId | Começa null. Se seu serviço devolver um ID, o próximo pedido o inclui. Esse ID não autoriza ler conversa de outra conta |
| mensagens | Até 20 mensagens do histórico confirmado mais a pergunta atual; não presumir que todo o histórico desde o início será enviado |
| id da mensagem | Texto não vazio até 100 caracteres. Use para reconhecer repetição sem cobrar/processar duas vezes o mesmo pedido |
| papel | usuario ou assistente; converter para os nomes usados pela sua IA, se forem diferentes |
| texto | Pergunta até 2.000 caracteres; resposta até 16.000, medidos pela validação JavaScript atual |
| contexto | Opcional; só indica uma seção/item público do site |
| signal | Sinal de cancelamento do navegador; passar para a chamada de rede, não colocar dentro do JSON |

Não mandar token, chave, nome completo, foto, bio ou resultado vocacional dentro de mensagens por conveniência. O token da sessão vai no cabeçalho de autenticação, separado do conteúdo. A pessoa ainda pode escrever informações pessoais na própria pergunta; trate esse conteúdo com cuidado.

### O que o serviço precisa devolver

```json
{
  "conversaId": null,
  "resposta": {
    "id": "id-unico-da-resposta",
    "texto": "Texto final produzido pela sua IA."
  }
}
```

Não devolver só uma string ou campos como answer/message sem traduzir. `resposta.id` e `resposta.texto` são obrigatórios; ID deve ser novo, não igual ao da pergunta/histórico. Texto vazio ou maior que o limite gera erro na interface. O papel assistente é atribuído pela própria conversa.

Se seu backend hoje devolve `{ answer: '...' }`, seu transporte precisa transformar isso em `{ resposta: { id: ..., texto: ... } }`. Melhor gerar um ID estável por resposta no servidor para a repetição do mesmo pedido. Não retornar um texto fixo como substituto quando sua IA falhar.

## 4. Preparar o serviço no servidor

Reutilize sua implementação de IA. O que precisa acontecer ao receber um pedido:

1. Aceitar a operação prevista, com limite de tamanho do corpo e formato de mensagem validado novamente. Validação do navegador não basta.
2. Conferir o token da sessão Supabase no servidor e obter o usuário real, confirmado. Não confiar em usuarioId fornecido no corpo.
3. Se não houver usuário válido, devolver 401. Se a pessoa tentar usar conversa de outra conta, negar acesso.
4. Impor limite de uso por usuário e tratar repetição pelo ID da mensagem. Clique repetido ou retry não deve iniciar cobrança duplicada desnecessária. A proteção precisa resistir ao modo como seu servidor escala; um contador isolado de uma instância pode não ser suficiente.
5. Consultar somente dados necessários e autorizados quando a pergunta exigir informações reais do catálogo.
6. Chamar a função da sua IA usando a chave guardada no ambiente do servidor.
7. Devolver a resposta final no formato da etapa 3 ou um erro com status adequado. Não devolver stack trace, token ou erro interno do provedor.
8. Configurar tempo limite do trabalho compatível com a espera da interface e respeitar cancelamento quando o provedor permitir.

### Como organizar o Python existente

1. Separar a função que recebe mensagens e produz a resposta do código de terminal/notebook. Não criar outro modelo só para essa separação.
2. Criar ou aproveitar uma rota POST, por exemplo /chat, que receba o JSON da etapa 3. O nome /chat é uma proposta; usar o caminho real combinado.
3. Carregar recursos pesados de forma controlada; não baixar/carregar o modelo inteiro a cada pergunta. Não compartilhar histórico pessoal em uma variável global entre usuários.
4. Validar mensagens com o framework usado e chamar a função real da IA. Se ela usa entrada/saída diferente, fazer a conversão nessa camada.
5. Retornar o objeto resposta.id/texto; Python pode devolver um dicionário que o framework converte em JSON.
6. Registrar as dependências e a forma de iniciar o servidor no repositório da IA. Colegas devem conseguir iniciar sem depender do notebook aberto na máquina do autor.

Exemplo de **formato de retorno**, não um servidor completo. A variável texto_final deve vir da IA real:

```python
from uuid import uuid4

# Dentro da rota já autenticada, após obter a resposta real:
resultado = {
    "conversaId": None,
    "resposta": {"id": str(uuid4()), "texto": texto_final},
}
# A rota devolve resultado como JSON.
```

Na versão sem conversa persistida, conversaId pode continuar null no JSON (None em Python). Se houver repetição de um pedido, reutilizar a resposta/ID já produzidos quando possível, em vez de gerar outra cobrança. A resposta não pode exceder o limite que a interface aceita. Python e JavaScript contam alguns caracteres, como emojis, de formas diferentes; testar os limites e não cortar uma resposta importante sem tratamento.

### Conferir a sessão no Python

O React envia Authorization: Bearer com o token Supabase do usuário. O Python extrai o token e o valida no servidor, por exemplo com supabase.auth.get_user(jwt). Não usar somente get_session nem apenas decodificar o conteúdo do JWT. Conferir usuário confirmado antes de chamar a IA. [Referência Python de get_user](https://supabase.com/docs/reference/python/auth-getuser).

Não é necessário enviar a chave publicável como apikey para sua API Python, a menos que o próprio contrato dela exija. Essa chave não substitui o token da pessoa. Não chamar sign_in novamente no Python nem guardar refresh token da conta do estudante por conveniência.

Se o Python consultar dados pessoais no Supabase, precisa de cliente/credenciais por requisição com identidade adequada. Não deixar a sessão de A em um cliente global reutilizado por B. O catálogo deve seguir as mesmas regras de leitura de dados publicados e sem escrita indevida. Integração 1 ajuda a definir isso.

### Permitir a chamada pelo navegador (CORS)

Se React e API usam endereços diferentes, configurar no Python as origens realmente usadas: https://meunorteapp.com.br e http://localhost:5173 para desenvolvimento; adicionar www/preview apenas quando utilizados e autorizados. Origem inclui protocolo, domínio e porta. Permitir POST, OPTIONS e cabeçalhos Authorization e Content-Type. [CORS no FastAPI](https://fastapi.tiangolo.com/tutorial/cors/).

CORS não é autenticação. Uma pessoa pode chamar a API fora do navegador; o token deve continuar sendo validado. Não usar origem aberta como solução para um erro de acesso.

### Rodar localmente e depois hospedar

Primeiro iniciar o Python pelo comando documentado no projeto dele. Se for FastAPI com aplicação app no arquivo app.py, um comando possível é python -m uvicorn app:app --reload --port 8000; adaptar ao arquivo real. O endereço local proposto seria http://localhost:8000/chat. Flask ou servidor já existente usam seu próprio comando.

Depois escolher hospedagem compatível com o Python e suas dependências, obter endereço HTTPS, configurar segredos do servidor e testar autenticação/CORS. Não apontar o site publicado para localhost: no celular, localhost significa o próprio celular, não o computador do integrante. O site HTTPS também não deve depender de uma API HTTP sem HTTPS em produção.

## 5. Conectar sem alterar as telas do chat

Ponto principal: `src/services/ai/assistenteService.js`. No fim do arquivo está:

```javascript
export const assistenteService = criarAssistenteService()
```

Sem transporte, ele permanece desconfigurado. É esse ponto que você muda depois de o serviço real existir.

### Exemplo prático para a API Python

**Referência para implementar, não código já instalado.** Este exemplo pressupõe a API Python acessível, a rota /chat ou equivalente e o contrato da etapa 3. O Supabase continua identificando a pessoa; a resposta é produzida pelo serviço Python.

No mesmo arquivo assistenteService.js:

- Adicione o import abaixo junto aos atuais.
- Mantenha a classe ErroIA e a fábrica existentes.
- Adicione a função de transporte antes do export final.
- Substitua o export final pelo mostrado abaixo. Não deixar dois exports com o mesmo nome.

```javascript
import { supabase } from '../../lib/supabaseClient.js'

async function transporteDoNo({ conversaId, mensagens, contexto, signal }) {
  if (!supabase) throw new ErroIA('indisponivel')
  const { data, error } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (error || !token) throw new ErroIA('indisponivel')

  // Variável pública a adicionar pela equipe quando a API existir.
  const url = import.meta.env.VITE_IA_API_URL?.trim()
  if (!url) throw new ErroIA('nao_configurado')
  const resposta = await fetch(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conversaId, mensagens, contexto }),
  })
  if (!resposta.ok) {
    // Não passar o texto interno do servidor para a interface.
    throw new ErroIA('indisponivel')
  }
  try {
    return await resposta.json()
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro
    throw new ErroIA('resposta_invalida')
  }
}
export const assistenteService = criarAssistenteService({
  transporte: transporteDoNo,
  timeoutMs: 25000,
})
```

Quando for implementar, adicionar VITE_IA_API_URL ao .env.example e preencher .env.local com o endereço completo da rota, por exemplo http://localhost:8000/chat. Na hospedagem do React, configurar a mesma variável com a URL HTTPS real e gerar nova publicação. Essa variável é um endereço público, não uma senha. **Ela ainda não foi adicionada aos arquivos de configuração nesta revisão.**

Chaves e configurações privadas ficam no ambiente do Python, conforme o projeto do integrante. Não usar VITE_ para elas. Se a API já exige outro caminho/formato, adaptar o exemplo ao real.

Este transporte usa a sessão do cliente apenas para enviar o token; **o servidor continua responsável por validá-lo**. getSession no navegador não prova autorização no servidor. O exemplo traduz status HTTP para o erro público genérico existente. Se quiser uma mensagem específica para sessão expirada/limite de uso, combinar extensão dos erros do serviço e testes, sem reescrever a UI. Não mostrar sucesso em 401, 429 ou 500.

Se seu serviço usa outro formato, faça a tradução dentro do transporte antes do retorno. O serviço existente então verifica o formato final e o hook adiciona a resposta à conversa. Não fazer fetch dentro de ConversaNo.jsx nem criar outro cliente de autenticação.

### Arquivos para entender o caminho

| Arquivo atual | O que faz |
|---|---|
| src/services/ai/assistenteService.js | Valida pedido/resposta, traduz falhas e controla espera |
| src/hooks/useConversaIA.js | Mensagens, rascunho, envio único, repetir e cancelar |
| src/pages/internal/AssistenteIA/AssistenteIA.jsx | Abre/fecha e conecta botão à conversa |
| src/pages/internal/AssistenteIA/components/ConversaNo.jsx | Interface já pronta |
| src/domain/assistente.js | Contexto permitido e verificação de links |
| src/data/perguntasNo.js | Perguntas sugeridas; clicar preenche o campo |

O sinal de cancelamento chega ao transporte quando a pessoa cancela ou fecha o chat. O serviço deixa de esperar após 25 segundos, mesmo que seu transporte ignore o sinal; a chamada de rede deve respeitá-lo. Isso não garante que o provedor parou de cobrar/processar: seu servidor também precisa encerrar quando possível.

## 6. Fazer a IA usar as faculdades reais

Essa parte deve ser combinada com **Integração 2**. Usar a OpenAI não conecta automaticamente o modelo ao banco de faculdades. O Python precisa consultar os registros revisados e fornecer à chamada da OpenAI somente os dados necessários. É necessário consultar dados no servidor e fornecer o resultado à sua IA, ou montar uma resposta baseada nessa consulta.

Exemplo: “Quais faculdades oferecem Psicologia em Vitória da Conquista?”

1. Identificar o curso pedido e seus sinônimos, sem transformar texto do usuário em SQL livre.
2. Consultar courses publicados e suas ofertas em institution_courses, ligadas às institutions publicadas.
3. Restringir a cidade e incluir apenas ofertas cujas três partes estejam revisadas/publicadas.
4. Passar à IA somente os campos necessários: instituição, curso, modalidade, condições realmente cadastradas, fonte e data.
5. Pedir que responda com base nesses registros e inclua os links oficiais disponíveis, sem inventar os que faltam.
6. Se a consulta falhar, dizer que não foi possível consultar agora. Se vier vazia, explicar que não há informação confirmada no catálogo, não que o curso inexiste na cidade.

Use o mesmo banco/tabelas do [guia Supabase](INTEGRACAO_SUPABASE.md). Não manter uma lista de faculdades separada dentro do prompt, pois ela fica desatualizada. Os cursos relacionados às áreas são tags informativas e não comprovam oferta em uma faculdade.

A consulta deve usar parâmetros e permissões de leitura adequadas. Não dar à IA uma chave administrativa para executar qualquer SQL. No Python, consultar com o SDK Python ou API REST do Supabase, conforme a implementação existente. Não tentar importar src/lib/supabaseClient.js: ele é um arquivo do navegador, em outra linguagem. Use configuração própria de servidor e políticas compatíveis, sem copiar segredos para o frontend.

Não precisa adicionar uma busca vetorial para essa primeira ligação: uma consulta bem definida a cursos/ofertas já atende essa pergunta. Se sua IA já possui ferramentas de consulta, adaptar uma ferramenta de leitura ao mesmo catálogo.

**Pontos de qualidade:** aceitar ENEM não implica Sisu; bolsa ou mensalidade desconhecida não é zero nem benefício garantido. Data de conferência pode ser antiga; orientar confirmação com a instituição. Textos vindos do banco/fontes são dados de referência, não instruções que possam substituir as regras do assistente.

## 7. Contexto, privacidade e limites desta versão

A opção de contexto informa apenas seção/item público: Perfil, Áreas, Faculdades ou Ingressos; área conhecida; marcador do teste, sem respostas; ID público de instituição; guia de ingresso/ano. A pessoa pode desativar essa opção.

Não são incluídos automaticamente nome, e-mail, nascimento, foto, bio, objetivos, resultado ou respostas vocacionais. Não adicionar essas informações escondidas na integração. Se um dia houver função personalizada usando dados pessoais, definir finalidade, acesso e apresentação ao usuário antes de criar.

Histórico/rascunho ficam em memória enquanto a área interna está montada. Fechar/reabrir o chat mantém a conversa naquele acesso; recarregar ou sair da conta a perde. Para a primeira entrega, mantenha isso e evite criar banco de conversas sem necessidade. Se o backend existente já persiste mensagens, revisar com a equipe quem pode ler, retenção e exclusão antes de ativar; não afirmar que só há memória se o servidor estiver guardando tudo.

Evitar logs com conteúdo integral de perguntas, respostas ou tokens. Para diagnóstico, preferir código do erro, duração e ID técnico sem conteúdo pessoal. A resposta é exibida como texto com formatação simples e links seguros; não gerar HTML executável.

O teste vocacional existente é exploratório, não diagnóstico. O Nô pode explicar seu propósito; não mudar pontos, inventar porcentagens ou tratar uma sugestão como decisão obrigatória de carreira.

## 8. Testar por etapas, com Integração 3

| Teste | Como fazer | O que comprova |
|---|---|---|
| Primeira resposta real | Perguntar algo simples e conferir execução no serviço real | Integração efetiva, sem texto fixo de demonstração |
| Continuação | Fazer pergunta e depois pedir complemento | Histórico convertido corretamente |
| Catálogo real | Perguntar pelo curso cadastrado com Integração 2 | Resposta bate com cards e fontes |
| Sem dado / consulta falhou | Usar caso não confirmado e simular falha da consulta | Não inventa disponibilidade nem confunde erro com ausência |
| Repetição | Acionar envio rapidamente e depois retry após falha | Sem duplicar bolha/processamento desnecessário |
| Demora / cancelar | Usar serviço de teste lento, cancelar e fechar | Espera termina e resposta tardia não se aplica |
| Erro do backend | Simular 401, 429 e 500 em desenvolvimento | Mensagem pública, sem segredo ou sucesso falso |
| Sem sessão | Fazer pedido direto sem token válido | Servidor recusa |
| Duas contas | Tentar usar ID de conversa de outra conta, se houver persistência | Propriedade validada no servidor |
| Contexto desligado | Desmarcar opção e enviar | Não envia contexto automático |
| Retorno ao site | Abrir em uma seção com rolagem/filtro e fechar | Tela anterior e foco preservados |
| Celular | Teclado, rotação, rolagem e retorno em aparelho real | Integração não prejudica a interface |

Execute também npm run lint, npm test e npm run build. Os testes existentes usam transportes controlados; passar neles não prova que sua IA está conectada. Não deixar backend de demonstração ou usuário fictício como padrão publicado.

## 9. Problemas comuns e conferência final

| Sintoma | Conferir |
|---|---|
| Continua “Nô está sendo conectado” | Export ainda usa criarAssistenteService sem transporte? Publicou o código correto? |
| 401/403 | Token do usuário, projeto correto e validação no servidor; chave publicável não é JWT |
| Falha só no navegador | CORS/OPTIONS, endereço HTTPS e cabeçalhos permitidos |
| “Resposta inválida” | JSON tem resposta.id/texto? ID novo? Texto não vazio e dentro do limite? |
| Tempo limite | Serviço demorou mais de 25 s? Rede/provedor/consulta estão lentos? |
| Responde, mas inventa faculdades | Falta consulta real ou a instrução ignora as fontes cadastradas? |
| Funciona local e falha publicado | VITE_IA_API_URL aponta para HTTPS real, não localhost? Python está acessível? Conferir segredos do servidor, origem permitida e versão publicada |

- [ ] Transporte real conectado e resposta final no formato esperado.
- [ ] Backend valida sessão e propriedade; chaves privadas não chegam ao navegador.
- [ ] Erro, demora, cancelamento e repetição foram testados.
- [ ] Perguntas sobre faculdades usam dados revisados e fontes; sem consulta disponível, não inventam.
- [ ] Retenção de conversa está coerente com o comportamento informado.
- [ ] Navegação e teclado continuam funcionando; nenhum redesenho do chat foi necessário.
- [ ] Integração 3 repetiu os testes e os comandos de verificação passaram.

Entregue à equipe: endereço/nome do serviço, variáveis públicas necessárias, onde os segredos estão configurados (sem divulgar valores), formato de entrada/saída, arquivo de transporte conectado, resultados dos testes e limitações restantes. Abrir Pull Request revisável; combinar publicação com os responsáveis pelo ambiente.
