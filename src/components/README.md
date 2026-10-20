# Componentes do MeuNorte

Esta pasta guarda as peças da interface, como botões, cards, menus e cabeçalhos.

Uma página pode usar vários componentes. Um mesmo componente pode aparecer em diferentes páginas.

Antes de criar uma peça nova, confira se alguém da equipe já criou algo que pode ser reutilizado.

## Como organizar

Crie uma pasta para cada componente. Dentro dela, coloque o código React e, quando necessário, o CSS.

Exemplo:

```text
components/
├── README.md
└── Button/
    ├── Button.jsx
    └── Button.css
```

Use nomes que expliquem a função do componente. As pastas e os arquivos React começam com letra maiúscula, como `Button`, `Header` e `CourseCard`.

## Exemplo: um botão reutilizável

Este exemplo é uma referência para aprender. Os componentes reais devem seguir o visual do Figma.

Arquivo `src/components/Button/Button.jsx`:

```jsx
import './Button.css'

function Button({ children, onClick, type = 'button' }) {
  return (
    <button
      className="mn-button"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
```

O que cada parte faz:

- `import './Button.css'`: carrega os estilos do botão.
- `children`: recebe o conteúdo colocado entre `<Button>` e `</Button>`.
- `onClick`: recebe a função que será executada ao clicar.
- `type`: define o comportamento do botão. O padrão é `button`, para evitar o envio acidental de um formulário.
- `export default Button`: permite usar o componente em outros arquivos.

Essas informações recebidas pelo componente são chamadas de **props**. Elas permitem reutilizar a mesma peça com conteúdos e comportamentos diferentes.

Arquivo `src/components/Button/Button.css`:

```css
.mn-button {
  padding: 12px 20px;
  border: 0;
  border-radius: 8px;
  background-color: #2457d6;
  color: #ffffff;
  font: inherit;
  cursor: pointer;
}

.mn-button:hover {
  background-color: #1941a5;
}

.mn-button:focus-visible {
  outline: 3px solid #111111;
  outline-offset: 3px;
}
```

As cores e medidas acima são ilustrativas. No projeto, elas devem seguir o Figma e os padrões compartilhados da equipe.

Os estilos usam a classe `.mn-button` para evitar alterar todos os botões do site.

## Como usar em uma página

Considerando uma página em `src/pages/Home/Home.jsx`:

```jsx
import Button from '../../components/Button/Button.jsx'

function Home() {
  function handleStart() {
    alert('Você clicou em começar!')
  }

  return (
    <main>
      <h1>Encontre seu próximo passo</h1>

      <Button onClick={handleStart}>
        Começar
      </Button>
    </main>
  )
}

export default Home
```

Nesse exemplo:

1. A página importa o componente.
2. O texto “Começar” é recebido pelo botão como `children`.
3. O clique executa a função `handleStart`.

O alerta serve apenas para demonstrar o clique. A ação real será implementada conforme a tela.

Criar o componente não faz com que ele apareça automaticamente: ele precisa ser importado e utilizado em uma página ou em outro componente que esteja sendo exibido.

## Como trabalhar a partir do Figma

1. Confira a tela e identifique as peças que serão necessárias.
2. Veja se alguma delas já existe nesta pasta.
3. Combine com os colegas antes de alterar um componente compartilhado.
4. Crie ou adapte o componente seguindo o Figma.
5. Confira o resultado no navegador, incluindo o uso pelo teclado e em telas menores.

Não é necessário transformar cada texto ou elemento em um componente separado. Comece pelas peças reutilizáveis ou por partes que tenham uma responsabilidade clara.

## O que fica em outras pastas

- Telas completas ficam em `src/pages`.
- Imagens ficam em `src/assets/images`.
- Fontes ficam em `src/assets/fonts`.
- Estilos compartilhados ficam em `src/styles`.

## Atenção aos exemplos deste guia

Os exemplos só funcionarão depois que os arquivos correspondentes forem criados. Este README explica a organização; ele não cria componentes nem páginas.