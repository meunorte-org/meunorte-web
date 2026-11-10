# Padrão de implementação MeuNorte

- Produto mobile-first: celulares e tablets, preservando a identidade e a ordem do Figma.
- Consultar src/styles/responsive.css antes de criar telas. Reutilizar seus tokens e os contêineres mn-mobile-screen e mn-mobile-content.
- Figma 390 × 844 é referência visual, não largura/altura obrigatória do dispositivo.
- Conteúdo centralizado com largura máxima de 28rem. Não esticar interfaces de celular pela largura inteira do tablet.
- Usar fluxo normal, flex/grid, larguras fluidas, tipografia limitada por clamp e imagens proporcionais. Nunca escalar a página inteira com transform/zoom.
- Alturas de tela são mínimas. Permitir rolagem vertical em telas baixas, na horizontal e com texto ampliado. Não cortar conteúdo para caber na tela.
- Controles têm área de toque mínima de 48 × 48 CSS px; botões principais mantêm aproximadamente 63px de altura. Preservar foco visível e semântica nativa.
- Evitar texto cortado, controles sobrepostos e rolagem horizontal. Não bloquear zoom. Considerar safe areas.
- Animações não devem alterar o fluxo nem impedir navegação após terminar. Preservar o comportamento aprovado da entrada.
- Validar telas novas e alterações em 320, 390, 430, 768 e 1024px, incluindo orientação horizontal e zoom/texto ampliado.
- Implementar apenas a tela/etapa solicitada. O cadastro foi removido a pedido do usuário: aguardar orientação passo a passo antes de recriá-lo.
