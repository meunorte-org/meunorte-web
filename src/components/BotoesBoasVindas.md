# Botões de boas-vindas

Referência: Figma, Design System → Botões → Botão- Começar / Botão- Fazer Login.

```jsx
import BotaoComecar from './BotaoComecar/BotaoComecar.jsx'
import BotaoFazerLogin from './BotaoFazerLogin/BotaoFazerLogin.jsx'

<BotaoComecar onClick={handleComecar} />
<BotaoFazerLogin onClick={handleLogin} />
```

Aceitam propriedades nativas de button, como onClick, disabled, type e aria-label,
além de className e children para personalizar o texto. O padrão é type="button".
Os estados pressionados seguem o Figma; disabled bloqueia a interação e usa 60%
de opacidade. A navegação deve ser fornecida pela página usando onClick.
