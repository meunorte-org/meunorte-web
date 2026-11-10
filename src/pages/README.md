# Páginas

Aqui ficam as telas completas do MeuNorte, seguindo o Figma.

Cada página reúne componentes, textos e imagens.

## Organização

Cada página fica em sua própria pasta:

```text
pages/
└── Home/
    ├── Home.jsx  → conteúdo da tela
    └── Home.css  → aparência da tela
```

Use nomes com inicial maiúscula, como `Home` e `Login`.

## Exemplo de página

Em `Home/Home.jsx`:

```jsx
import './Home.css'

function Home() {
  return (
    <main className="home-page">
      <h1>Bem-vindo ao MeuNorte</h1>
      <p>Encontre seu caminho para o ensino superior.</p>
    </main>
  )
}

export default Home
```

O CSS fica em `Home.css`, usando a classe `.home-page`.

## Como exibir

Para mostrar essa página inicialmente, o `App.jsx` pode usar:

```jsx
import Home from './pages/Home/Home.jsx'

function App() {
  return <Home />
}

export default App
```

Depois configuraremos a navegação entre as páginas.

## Combinados

- Combine com a equipe qual tela você vai desenvolver.
- Siga a tela correspondente no Figma.
- Reutilize as peças de `src/components`.
- Use dados fictícios enquanto a integração com o banco não estiver pronta.
- Avise antes de alterar o `App.jsx`, pois ele é compartilhado.

Os códigos acima são exemplos; não precisam ser criados agora.