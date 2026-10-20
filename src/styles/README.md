# Estilos compartilhados

Aqui ficam estilos usados em várias partes do MeuNorte, como cores e fontes definidas no Figma.

O CSS específico de uma página ou componente fica junto dela.

## Organização

```text
styles/
└── variables.css  → cores, fontes e medidas compartilhadas
```

## Exemplo

Em `variables.css`:

```css
:root {
  --color-primary: #2457d6;
  --color-text: #222222;
  --font-body: Arial, sans-serif;
}
```

Os valores são exemplos. Usaremos os definidos no Figma.

Para carregar esse arquivo, adicione no início de `src/index.css`:

```css
@import './styles/variables.css';
```

Depois, qualquer CSS do app pode usar:

```css
.mn-button {
  background-color: var(--color-primary);
  color: white;
  font-family: var(--font-body);
}
```

`var(...)` utiliza um valor compartilhado. Se a cor principal mudar, basta atualizar sua definição.

## Combinados

- Confira se a cor ou fonte já está definida antes de criar outra.
- Combine com a equipe antes de alterar valores compartilhados.
- Não coloque aqui estilos exclusivos de um componente ou página.

Os códigos acima são exemplos; não precisam ser criados agora.