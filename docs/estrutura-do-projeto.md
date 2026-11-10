# Organização do projeto MeuNorte

Este guia explica onde cada parte do código deve ficar. A estrutura é um ponto de partida e pode evoluir conforme as necessidades da equipe.

## Tecnologias utilizadas

- **React:** constrói a interface usando componentes.
- **JavaScript:** define o comportamento da interface.
- **CSS:** define a aparência, incluindo cores, fontes, tamanhos e espaçamentos.
- **Vite:** executa o projeto durante o desenvolvimento e gera os arquivos para publicação.
- **Git e GitHub:** registram as mudanças e permitem o trabalho em equipe.

O Figma será a referência visual das telas. A integração com o Supabase será preparada em uma etapa posterior.

## Estrutura de pastas

```text
meunorte-web/
├── docs/                  Documentação da equipe
├── public/                Arquivos acessados diretamente por endereço
├── src/
│   ├── assets/
│   │   ├── fonts/         Arquivos de fontes
│   │   └── images/        Imagens e ilustrações
│   ├── components/        Peças reutilizáveis da interface
│   ├── pages/             Telas completas
│   ├── styles/            Estilos compartilhados
│   ├── App.jsx            Organização principal da interface
│   ├── App.css            Estilos da estrutura principal
│   ├── index.css          Estilos básicos e globais
│   └── main.jsx           Inicialização do React
├── .gitignore             Define arquivos que ficam fora do Git
├── index.html             Página em que o React é carregado
├── package.json           Dependências e comandos do projeto
├── package-lock.json      Registro das versões das dependências
└── README.md              Apresentação e instruções iniciais
```

A pasta `node_modules` contém as bibliotecas instaladas. Ela é gerada pelo npm, não deve ser editada manualmente e não deve ser enviada ao GitHub.


## Pastas

| Pasta | Para que serve |
|---|---|
| `docs/` | Guarda este guia da estrutura do projeto. |
| `public/` | Arquivos acessados diretamente por endereço, como o ícone da aba do navegador. |
| `src/` | Código da interface do MeuNorte. |
| `src/components/` | Peças reutilizáveis: botões, cards, menus e cabeçalhos. |
| `src/pages/` | Telas completas, montadas com componentes. |
| `src/styles/` | Estilos compartilhados, como cores e fontes do projeto. |
| `src/assets/` | Recursos utilizados pela interface. |
| `src/assets/images/` | Imagens, logos e ilustrações. |
| `src/assets/fonts/` | Arquivos das fontes utilizadas no projeto. |
| `node_modules/` | Bibliotecas instaladas pelo npm. Não editar nem enviar ao GitHub. |
| `dist/` | Versão gerada para publicação pelo comando de build. Não editar nem enviar ao GitHub. |

## Arquivos principais

| Arquivo | Para que serve |
|---|---|
| `src/main.jsx` | Inicia o React e carrega o `App`. |
| `src/App.jsx` | Organiza a interface principal e a exibição das páginas. |
| `src/App.css` | Estilos da estrutura principal do app. |
| `src/index.css` | Estilos gerais e carregamento dos estilos compartilhados. |
| `index.html` | Página HTML em que o React é carregado. |
| `package.json` | Nome do projeto, bibliotecas necessárias e comandos disponíveis. |
| `package-lock.json` | Registra as versões das bibliotecas para instalações consistentes. Deve acompanhar as mudanças de dependências no GitHub. |
| `vite.config.js` | Configurações do Vite. |
| `eslint.config.js` | Regras para identificar possíveis problemas no código. |
| `.gitignore` | Define quais arquivos e pastas ficam fora do Git. |
| `README.md` | Apresentação do projeto e instruções para começar. |

## Como as partes se conectam

`main.jsx` inicia o `App.jsx`, que exibe as páginas. As páginas utilizam componentes, estilos e imagens.

Criar uma página ou componente não faz com que ele apareça automaticamente: é necessário importá-lo e utilizá-lo na interface.

## Como vamos trabalhar

1. As telas são preparadas no Figma.
2. A equipe combina quem vai desenvolver cada tela.
3. Os integrantes montam as páginas e reutilizam os componentes.
4. O resultado é conferido com o Figma.
5. Uma pessoa prepara o Supabase em paralelo, alinhando os dados necessários com a equipe.

Enquanto o banco não estiver integrado, as telas podem utilizar dados fictícios.

A integração com o Supabase será organizada posteriormente. Senhas e chaves secretas não devem ser colocadas no código da interface nem enviadas ao GitHub.

## Orientações iniciais

- Consulte o README da pasta antes de começar.
- Avise antes de alterar arquivos ou componentes compartilhados.
- Combine com a equipe antes de instalar bibliotecas.
- Atualize a documentação quando a organização mudar.