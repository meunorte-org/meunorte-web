# Pendências de integração e aceite

Revisão: 16/11/2026. A interface interna está implementada; esta lista impede confundir funcionamento local com integração remota. Não houve aplicação de SQL ou publicação nesta etapa.

## Prioridade 1 — contratos e banco da equipe

| Módulo / arquivos | Estado e dependência | Evidência para encerrar |
|---|---|---|
| Auth — src/services/auth.js, src/lib/supabaseClient.js | Integração existente real; não modificada nesta etapa | Regressão com conta autorizada: entrar, sair, confirmar, recuperar, renovar/expirar sessão. O ciclo de e-mail não foi repetido nesta rodada |
| Perfil — src/services/perfil/perfilService.js e localAdapter.js | Bio/tags/preferências/objetivos/favoritos/resultados locais. Faltam tabelas, RLS e adaptador transacional com revisão | Requisição remota, linha persistida, outro dispositivo e isolamento entre duas contas; conflito entre abas sem perda silenciosa |
| Fotos — mesmo serviço; editor no Perfil | IndexedDB local. Faltam bucket privado, regras, adaptador de Blob e limpeza reconciliável | Enviar/substituir/remover, falha parcial, arquivo de outra conta negado; URL temporária não vira referência definitiva |
| Áreas — src/data/areasCatalogo.js, src/services/areasService.js | Conteúdo editorial real no código; favoritos locais | IDs preservados e uma única lista de favoritos remota compartilhada com Perfil |
| Resultado — src/domain/testeVocacional.js, perfilService.salvarResultado | Regra real versão 1; último resultado local | Persistir versão/pontos/evidências/data, empate e insuficiente. Escolher último vs histórico, sem quarta coleção no Perfil |
| Faculdades — src/services/faculdadesService.js | Fonte padrão vazia e pendente, sem mocks de produção | Instituições, cursos e ofertas N:N com fontes verificadas; busca parcial/sinônimos/case/acentos, filtro, detalhe, erro e cancelamento |

Modelo e passos detalhados: [INTEGRACAO_SUPABASE.md](INTEGRACAO_SUPABASE.md). Validar esquema existente antes da migração. Datas originais de objetivos legados podem ser desconhecidas; não inventá-las. Definir importação voluntária do perfil local e conflitos. Sincronização em tempo real/invalidação entre abas não foi implementada; planejar separadamente se necessária. A ordenação de tags está disponível no serviço, sem novo controle visual específico nesta etapa.

O catálogo ainda precisa de curadoria: nomes oficiais, endereços, tipos, imagens autorizadas, cursos, sinônimos, modalidades, turnos, ingresso e fontes/data. Não inferir bolsas, financiamento ou mensalidades. Paginação exige contrato e interface adicionais; o serviço permite adaptador remoto, mas não existe botão de próxima página pronto.

## Prioridade 2 — IA do integrante

| Entrega necessária | Ponto de ligação | Aceite |
|---|---|---|
| Transporte e endpoint autenticado | criarAssistenteService em src/services/ai/assistenteService.js; composição de AssistenteIA | DTO documentado, usuário validado no servidor, erros tratados, nenhuma chave privada em VITE |
| Mapeamento de resposta final | Transporte retorna resposta.id/texto | Resposta real do backend existente, sem texto de demonstração; protocolo de streaming demanda extensão explícita |
| Cancelamento/limites/repetição | signal e contrato de conversa/mensagem | Servidor trata repetição/idempotência, limite de uso e encerramento; cancelar cliente não garante interrupção do custo no provedor |
| Política de histórico | Atualmente somente memória da aba | Decidir retenção/consentimento/exclusão e isolamento antes de salvar conversas remotas |

A interface, arrasto, acessibilidade, sugestões, espera, erro, tentativa e cancelamento já existem. O padrão informa indisponibilidade e não chama modelo nem fabrica resposta. Testes de erro/sucesso usaram transporte simulado descartável, removido da aplicação. Guia: [INTEGRACAO_IA.md](INTEGRACAO_IA.md).

## Prioridade 3 — validação em dispositivos e conteúdo

- Testar em iPhone físico: teclado real, barras do navegador, arrasto com dedo, rotação e retorno do chat. As verificações desta etapa usaram navegador e alturas reduzidas, não hardware iOS.
- Testar zoom de texto, leitor de tela e teclado assistivo. Teclado comum, foco, Escape e retorno foram verificados; isso não equivale a auditoria completa de acessibilidade.
- Revalidar PDFs e editais periodicamente. No acervo anterior há uma variante superampliada 2024 caderno 12 dia 2 sem link disponível (404 na curadoria); a interface já explica a ausência. Não inventar URL alternativa.
- Integrar conteúdo definitivo dos guias e atualizar anos novos quando publicados, mantendo fontes oficiais.
- Build mantém aviso de chunk inicial acima de 500 kB. A navegação interna já é lazy; otimização adicional é futura e não foi misturada à autenticação.
- Conferir URLs de retorno e variáveis no painel antes de publicar. Esta entrega não alterou Vercel, domínio, SMTP, templates ou políticas remotas.

## Ordem sugerida de entrega

1. Revisar contratos e modelo com a equipe, em branch própria; preparar migrações de desenvolvimento e políticas.
2. Conectar Perfil/Storage e provar propriedade, concorrência e persistência remota.
3. Publicar catálogo curado, conectar favoritos e resultado sem duplicar estado.
4. Integrante conecta o transporte da IA existente, testa autenticação e falhas.
5. Regressão em dispositivos reais e revisão de PR; publicação só pelo fluxo acordado da equipe.

`npm run lint`, `npm test` e `npm run build` são verificações locais. Nenhuma delas prova RLS remoto, entrega de e-mail, funcionamento de provedor de IA ou implantação. Não marcar esses itens como concluídos sem a evidência indicada.
