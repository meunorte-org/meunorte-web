# Integração da IA com a interface do Nô

Revisão: 16/11/2026. Este documento descreve a fronteira implementada. Não pressupõe provedor, modelo, endpoint, linguagem de backend ou formato interno já escolhido pelo integrante.

## 1. Arquivos e responsabilidades

| Arquivo | Responsabilidade |
|---|---|
| `src/pages/internal/AssistenteIA/AssistenteIA.jsx` | Coordena botão, conversa e presença/saída |
| `src/hooks/useNoFlutuante.js` | Pointer Events, limite de 8px, posição, repouso e teclado |
| `src/domain/assistente.js` | Geometria pura, contexto permitido e URLs seguras |
| `src/pages/internal/AssistenteIA/components/ConversaNo.jsx` | Portal, viewport, foco, mensagens, sugestões e formulário |
| `src/pages/internal/AssistenteIA/components/TextoMensagem.jsx` | Texto, parágrafos, listas, negrito e links; sem HTML arbitrário |
| `src/hooks/useConversaIA.js` | Rascunho, histórico em memória, exclusão mútua de envio, erro/retry/cancelamento |
| `src/services/ai/assistenteService.js` | Validação de entrada/saída, normalização de erros e timeout |
| `src/data/perguntasNo.js` | Seis sugestões editáveis; clicar preenche o campo |
| `src/hooks/useRotaApp.js` | Abertura por `no=1`, histórico e retorno à tela original |

A tela de origem permanece montada e inerte. No celular, o chat ocupa o viewport visível; em telas maiores, usa um painel central. O corpo é bloqueado enquanto o histórico de mensagens rola em seu próprio contêiner. Visual Viewport ajusta o espaço disponível; a alça/teclado não expõem a página inferior. Isso foi verificado em alturas reduzidas, não em iPhone físico.

## 2. Onde conectar o serviço existente do integrante

O export padrão está no final de `src/services/ai/assistenteService.js`:

```javascript
export const assistenteService = criarAssistenteService()
```

Sem `transporte`, `configurado` é `false`. Uma tentativa produz o erro público `nao_configurado` antes de qualquer rede. Não há respostas substitutas ou temporizador para aparentar uma IA funcionando.

Crie o adaptador do código real do integrante e injete-o nessa fábrica. Exemplo de composição futura, não de um arquivo/backend já existente:

```javascript
// O caminho é ilustrativo: criar após receber a implementação real.
import { transporteDoIntegrante } from './transporteDoIntegrante.js'
export const assistenteService = criarAssistenteService({
  transporte: transporteDoIntegrante,
  timeoutMs: 25000,
})
```

Não substituir o hook por chamadas de provedor dentro do JSX. Não implementar um segundo chatbot, modelo ou mecanismo local de respostas para preencher essa lacuna.

## 3. Contrato de entrada

O transporte recebe:

```javascript
{
  conversaId: null, // ou ID opaco da conversa, string de até 100
  mensagens: [
    { id: 'id-da-mensagem', papel: 'usuario', texto: 'Como funciona o SISU?' },
  ],
  contexto: { secao: 'ingressos', assunto: 'sisu' }, // opcional
  signal: AbortSignal,
}
```

- A interface envia até 20 mensagens relevantes; a última é do usuário.
- Papéis válidos: `usuario` e `assistente`. O adaptador mapeia esses nomes ao protocolo real do integrante.
- IDs são strings não vazias de até 100. Texto do usuário: até 2.000; resposta: até 16.000, conforme a validação JavaScript atual.
- Somente mensagens com sucesso confirmado compõem o histórico anterior. A tentativa atual é acrescentada; falhas anteriores não são reenviadas automaticamente.
- Campos extras dos objetos de mensagem não atravessam o serviço. Não são enviados objetos de usuário, tokens, fotos, biografia, objetivos, notas ou respostas do teste.
- `signal` é controle local: não serializar no JSON. Encaminhá-lo à requisição real e propagar cancelamento no backend quando possível.

`conversaId` começa nulo; se o backend retornar um ID, será usado nas mensagens seguintes. O backend precisa conferir a propriedade dessa conversa. Um ID recebido do navegador não autoriza acesso a conversas de outra pessoa.

## 4. Contrato de saída

```javascript
{
  conversaId: 'id-opaco-opcional',
  resposta: {
    id: 'id-unico-da-resposta',
    texto: 'Resposta final produzida pelo serviço real do integrante.',
  },
}
```

Texto e ID da resposta são obrigatórios. ID não pode repetir um ID do histórico enviado. Resposta vazia, grande demais ou em formato diferente gera `resposta_invalida`. Campos extras não são repassados à interface.

O contrato atual recebe a resposta final completa. Não implementa streaming/SSE. Se o integrante já usa streaming, o adaptador pode acumular os trechos e devolver o formato final, ou a equipe poderá evoluir explicitamente o hook e esse contrato para incrementos. Não finja streaming com animação de texto inventado.

## 5. Estados e comportamento

| Estado/erro | Interface e regra |
|---|---|
| Inicial | Recepção, mascote e sugestões; envio vazio bloqueado |
| Enviando | Um pedido por vez, botão desabilitado, status e cancelar |
| Pronto | Mensagem real acrescentada, sem fabricar conteúdo |
| `nao_configurado` | Pergunta marcada como não enviada; explica a conexão pendente |
| `conexao` | Mensagem pública de conexão e opção de repetir |
| `indisponivel` | Falha de serviço traduzida, sem stack trace ou erro interno |
| `tempo_limite` | Limite padrão de 25s; interrompe espera mesmo se o transporte ignorar o sinal |
| `resposta_invalida` | Retorno não aceito; não mostra sucesso parcial |
| `cancelada` | Encerramento explícito, sem resposta confirmada |

Repetir reutiliza a mesma mensagem do usuário e não cria outra bolha duplicada. Cancelar/fechar aborta o pedido em andamento; uma resposta tardia não deve ser aplicada. Cancelamento do frontend não garante cancelamento de processamento/custo no provedor — o backend do integrante também precisa tratar o sinal ou a operação de cancelamento correspondente.

O status “Sem resposta confirmada” é usado para falha, cancelamento e timeout: não promete que a mensagem nunca chegou ao servidor. A declaração “Não enviada” fica restrita à ausência do transporte, antes da rede.

O histórico e o rascunho permanecem ao fechar o chat e trocar abas durante o mesmo acesso. Recarregar, limpar a conversa ou desmontar a conta remove esse estado em memória. Não há tabela ou gravação em localStorage de mensagens. A preferência de posição é separada e local, por usuário.

## 6. Contexto e renderização

O usuário pode desativar o contexto nas opções. `contextoDaTela` aceita somente:

- `secao`: Perfil, Áreas, Faculdades ou Ingressos, usando IDs internos;
- `areaId`: uma das dez áreas conhecidas;
- `tela: 'teste-vocacional'`: indica apenas a tela, nunca as respostas;
- `assunto`: um guia de ingresso conhecido ou ano de ENEM;
- `instituicaoId`: identificador público válido da instituição consultada.

A URL inteira, termo de busca, nome, nascimento, e-mail, foto, bio e objetivos não fazem parte do contexto automático. O serviço aplica a lista positiva novamente antes de chamar o transporte. Contexto é uma dica, não uma fonte de autorização ou um resultado vocacional.

A resposta pode conter parágrafos, quebras, listas simples, negrito e links Markdown/HTTP. Não há execução de HTML; `<script>` aparece como texto. URLs com protocolos como `javascript:`, `data:` e `file:` ou credenciais embutidas não viram links. O backend ainda deve verificar a qualidade e a procedência das fontes acadêmicas.

## 7. Segurança do transporte real

Credenciais do provedor ficam exclusivamente no backend, função serverless ou Edge Function definido pela equipe, nunca em `VITE_`, bundle, query string ou mensagens. O navegador usa a sessão já existente; não crie outro sistema de login.

O endpoint deve autenticar o usuário no servidor, validar propriedade de conversa, impor limites de tamanho/taxa e normalizar erros. Não confiar em `usuarioId` enviado pelo cliente nem em `user_metadata` para privilégios. Se usar Supabase Functions, conferir o mecanismo vigente de validação de usuário: uma chave publicável não é o JWT da pessoa. O contrato de autenticação do endpoint precisa ser acordado antes da conexão. [Headers de autenticação](https://supabase.com/docs/guides/functions/auth-headers), [proteção de Functions](https://supabase.com/docs/guides/functions/auth) e [chaves de API](https://supabase.com/docs/guides/getting-started/api-keys).

Não registre perguntas, conteúdo sensível, tokens ou respostas integrais em logs por conveniência. Defina tratamento e retenção caso o integrante já persista conversas. Essa política não está implementada por esta interface.

## 8. Integração passo a passo

1. Receber o código/contrato real do integrante: autenticação, endpoint, payload, resposta, timeout, cancelamento e eventual streaming.
2. Implementar uma função de transporte que converta o DTO acima ao protocolo dele e normalize a resposta final. Essa função é a única parte específica da implementação de IA.
3. Usar backend protegido para acesso ao provedor; manter somente configurações não secretas no frontend, se forem necessárias. Não há nova variável de ambiente de IA na entrega atual.
4. Instanciar `criarAssistenteService({ transporte })` no módulo de serviço. Não alterar as páginas de Perfil/Áreas para fornecer dados privados ao Nô.
5. Homologar em ambiente de desenvolvimento com duas contas e catálogo verificado. Não deixar um transporte de teste como padrão.
6. Confirmar que o aviso de conexão pendente desapareceu porque há transporte real, e que as respostas vieram efetivamente dele.
7. Validar ausência de segredos no bundle e de acesso cruzado por `conversaId`; depois abrir PR para revisão.

## 9. Testes

`tests/assistente.test.mjs` cobre geometria, limiar, contexto, links, ausência de configuração, DTOs, erros, resposta inválida, cancelamento e timeout. Os testes usam transporte injetado; não chamam um modelo nem são prova de que o backend do integrante já funciona.

No navegador, foram conferidos abertura/fechamento, histórico, retorno com a mesma rolagem e filtro, arraste sem clique, posição após recarregar, setas/Home, sugestões, envio duplicado, erro/retry, timeout, cancelamento ao fechar e links seguros. Respostas de teste foram explicitamente demonstrativas e ficaram em páginas temporárias removidas da entrega.

Após integrar de verdade, repetir os fluxos com API autenticada: usuário inválido, sessão expirada, duas contas, backend indisponível, resposta longa, sinal abortado e erro do provedor. Conferir teclado e compartilhamento de viewport em Safari/iPhone físico, além de zoom real e leitor de tela. Não substituir essa rodada por mocks.
