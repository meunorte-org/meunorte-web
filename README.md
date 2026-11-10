# meunorte-web
Plataforma web de orientação ao ensino superior.


## Design no Figma

As interfaces do MeuNorte são planejadas no **Figma** e implementadas em **React**. O Figma é a referência visual para a equipe, reunindo as telas, componentes, estilos e protótipos do projeto.

🔗 **[Acessar o projeto no Figma](INSERIR_LINK_DO_FIGMA)**

### 📂 Organização do Figma

O arquivo está dividido em duas páginas principais:

**1. Design System**

Reúne os elementos visuais reutilizáveis do MeuNorte:

- **Fundamentos:** cores, fontes, espaçamentos e estilos visuais.
- **Componentes:** botões, campos, cards, elementos de navegação e mascote, incluindo suas variantes.

Os componentes são criados e mantidos nessa página. Nas telas, utilizamos instâncias desses componentes para preservar a consistência visual.

**2. Screens e Protótipos**

Contém as telas completas do MeuNorte, seus fluxos e interações.

As telas são organizadas conforme o status:

- ✅ **Prontas para desenvolvimento:** telas finalizadas e liberadas para implementação no React.
- 🚧 **Em desenvolvimento:** telas ainda em construção ou revisão, que não devem ser consideradas finais.

### 💻 Como implementar as telas

1. Acesse o Figma pelo link acima.
2. Entre em **Screens e Protótipos** e escolha uma tela da seção **Prontas para desenvolvimento**.
3. Selecione os elementos para consultar suas dimensões, cores, espaçamentos e configurações de Auto Layout.
4. Consulte o **Design System** para conhecer os componentes e suas variantes.
5. Desenvolva a interface em React, reutilizando os componentes de código existentes no projeto.
6. Compare o resultado no navegador com o Figma e adapte a interface aos diferentes tamanhos de tela.

**Importante:** o Figma serve como referência para a implementação. Botões, campos e outros elementos de interface devem ser desenvolvidos como componentes React, e não simplesmente exportados como imagens.

Ícones, ilustrações e outros recursos gráficos poderão ser exportados do Figma em formatos adequados, como SVG e PNG.



## 🧭 Animações interativas com Rive

O MeuNorte utilizará o **Rive** para desenvolver as animações do mascote Nó e outros elementos visuais interativos.

O Figma mostrará a aparência e o posicionamento desses elementos nas telas, mas as animações utilizadas no site serão produzidas no Rive.

### Como as animações serão integradas

**1. Criação no Rive**

As animações serão desenvolvidas no Rive, incluindo movimentos, expressões e comportamentos interativos do mascote.

**2. Exportação**

Depois de finalizadas, as animações serão exportadas no formato `.riv`, próprio para execução nos aplicativos e sites que utilizam o Rive.

**3. Disponibilização no GitHub**

Os arquivos exportados serão adicionados ao repositório do MeuNorte, preferencialmente em:

`public/assets/rive/`

Exemplo: `public/assets/rive/mascote-no.riv`

**4. Integração com React**

Os desenvolvedores utilizarão a biblioteca oficial do Rive para React para carregar os arquivos `.riv` e exibir as animações na interface.

O mascote poderá ser implementado como um componente reutilizável, por exemplo, `MascoteNo.jsx`.

### Como funcionarão as interações?

Além das animações automáticas, o mascote poderá reagir às ações dos usuários, como:

- Movimentar os olhos ou piscar.
- Reagir ao clique em determinados botões.
- Apresentar expressões durante a navegação.
- Executar animações específicas durante o cadastro.
- Movimentar o ponteiro conforme a orientação do dispositivo, quando compatível e autorizado.

Esses comportamentos serão configurados no Rive e conectados aos eventos do React por meio das **State Machines e dos recursos de interação do Rive**.

Os desenvolvedores não precisarão recriar as animações em código. Sua responsabilidade será integrar os arquivos exportados e conectar os comportamentos às funcionalidades do site.

**Observação:** o desenho e a demonstração do mascote no Figma não substituem sua animação oficial no Rive.

Documentação: [Rive para React](https://rive.app/docs/runtimes/react/react)


## Integração com Supabase

O React cuida da interface. O Supabase fornece o banco de dados, o cadastro e o login.

Exemplo de funcionamento:

```text
Pessoa abre a tela de cursos
        ↓
React solicita os cursos
        ↓
Supabase verifica as permissões e retorna os dados
        ↓
React mostra os cursos na tela
```

### Responsável pelo Supabase

Estude e prepare estes pontos, nesta ordem:

1. **Banco de dados:** tabelas, colunas, tipos de dados, chaves e relações.
2. **Supabase Auth:** cadastro, login, logout e identificação do usuário conectado.
3. **Permissões — RLS:** regras para controlar quais dados cada usuário pode consultar ou alterar.
4. **Biblioteca JavaScript:** como consultar, adicionar, atualizar e remover dados pelo código.
5. **Migrations:** arquivos SQL que registram mudanças na estrutura do banco e permitem reproduzi-las.

Estrutura inicial proposta:

| Recurso | Responsabilidade |
|---|---|
| Supabase Auth | Gerenciar contas e senhas. |
| `profiles` | Guardar informações adicionais de cada usuário. |
| `courses` | Guardar o catálogo de cursos. |
| `favorites` | Relacionar usuários aos cursos favoritados. |

Antes de criar campos, combine com a equipe quais informações as telas precisam.

Regras esperadas:

- Cada usuário acessa e altera apenas seu próprio perfil.
- Cada usuário gerencia apenas seus próprios favoritos.
- O mesmo curso não pode ser favoritado duas vezes pelo mesmo usuário.
- A equipe define quem pode consultar e quem pode editar o catálogo.
- As regras devem ser testadas com usuários diferentes, não apenas pelo painel administrativo.

Não crie uma tabela própria de senhas. Utilize o Supabase Auth.

### Responsáveis pelo React

Precisam aprender a:

- Chamar funções que conversam com o Supabase.
- Usar `async/await` para aguardar respostas.
- Mostrar carregamento, sucesso e erro.
- Trabalhar com o usuário conectado.
- Utilizar os campos e nomes combinados com o responsável pelo banco.

### Organização do código

Quando começarmos a integração, criaremos:

```text
src/
├── lib/
│   └── supabaseClient.js
├── services/
│   └── courses.js
└── pages/
    └── Courses/
        └── Courses.jsx
```

- `lib`: configuração compartilhada da conexão.
- `services`: funções que buscam e salvam dados.
- `pages`: utiliza essas funções para apresentar os resultados.

### Exemplo: buscar cursos

Este exemplo depende de uma tabela `courses` com as colunas `id` e `name`, além de permissão de leitura configurada. É uma referência; adapte aos nomes definidos pela equipe.

**1. Instalar a biblioteca na pasta do projeto:**

```powershell
npm.cmd install @supabase/supabase-js
```

**2. Criar `.env.local` na raiz:**

```dotenv
VITE_SUPABASE_URL=URL_DO_PROJETO
VITE_SUPABASE_PUBLISHABLE_KEY=CHAVE_PUBLICA_DO_PROJETO
```

Os valores são obtidos no painel do Supabase, na opção de conexão do projeto.

Confirme que `.env.local` está ignorado pelo Git. Um `.env.example`, com esses nomes e valores vazios, pode ser enviado para orientar os colegas.

Reinicie o Vite depois de alterar essas configurações.

**3. Configurar `src/lib/supabaseClient.js`:**

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
```

Esse arquivo cria a conexão que será reutilizada.

**4. Criar `src/services/courses.js`:**

```js
import { supabase } from '../lib/supabaseClient'

export async function buscarCursos() {
  const { data, error } = await supabase
    .from('courses')
    .select('id, name')
    .order('name')

  if (error) throw error

  return data
}
```

Essa função consulta os cursos. Se a consulta falhar, informa o erro ao código que a chamou.

**5. Utilizar em `src/pages/Courses/Courses.jsx`:**

```jsx
import { useEffect, useState } from 'react'
import { buscarCursos } from '../../services/courses'

export default function Courses() {
  const [cursos, setCursos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativa = true

    async function carregar() {
      try {
        const dados = await buscarCursos()
        if (ativa) setCursos(dados)
      } catch {
        if (ativa) setErro('Não foi possível carregar os cursos.')
      } finally {
        if (ativa) setCarregando(false)
      }
    }

    carregar()

    return () => {
      ativa = false
    }
  }, [])

  if (carregando) return <p>Carregando cursos...</p>
  if (erro) return <p role="alert">{erro}</p>
  if (cursos.length === 0) return <p>Nenhum curso encontrado.</p>

  return (
    <ul>
      {cursos.map((curso) => (
        <li key={curso.id}>{curso.name}</li>
      ))}
    </ul>
  )
}
```

A página solicita os dados ao abrir e mostra carregamento, erro ou a lista. A variável `ativa` evita atualizar a página depois que ela sair da tela.

Para visualizar essa página, será necessário incluí-la no `App.jsx` ou na navegação do projeto.

### Cuidados com as chaves

No React, utilize somente a chave **publishable**, própria para o navegador.

Variáveis com prefixo `VITE_` ficam acessíveis no navegador. O arquivo `.env.local` não transforma esses valores em segredos.

Nunca coloque chaves **secret**, **service_role** ou a senha do banco no React. A proteção dos dados depende das permissões e políticas RLS.

### Material de estudo

- [Primeira integração com React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Cadastro e login com React](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Permissões com RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Chaves públicas e secretas](https://supabase.com/docs/guides/getting-started/api-keys)
- [Migrations do banco](https://supabase.com/docs/guides/deployment/database-migrations)