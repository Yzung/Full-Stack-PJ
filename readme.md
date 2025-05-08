# Sistema de Gestão de Usuários

Este projeto é um sistema simples para gestão de usuários. Ele permite criar, listar, editar e deletar usuários através de uma API RESTful e de uma interface web.

## Estrutura do Projeto

O projeto está dividido entre o **Backend** e o **Frontend**.

### 1. Backend

- **Tecnologias utilizadas**: Node.js, Express, Prisma, SQLite (ou MySQL, dependendo da configuração)
  
- **Estrutura de pastas**:
  - `src/`
    - `controller/`: Controladores que gerenciam a lógica de negócios.
      - `userController.js`: Controlador de usuários com métodos para listar, buscar, criar, editar e deletar usuários.
    - `middleware/`: Middleware para autenticação e manipulação de erros.
      - `userAuth.js`: Middleware de autenticação de usuários (não implementado).
      - `errorHandler.js`: Middleware de captura e resposta de erros (não implementado).
    - `route/`: Definição das rotas.
      - `userRoute.js`: Roteamento de endpoints para manipulação de usuários.
  - `index.js`: Arquivo principal do servidor, onde as rotas são registradas e o servidor é inicializado.

### 2. Frontend

- **Tecnologias utilizadas**: HTML, CSS, JavaScript
  
- **Estrutura de pastas**:
  - `assets/`
    - `css/`: Arquivos de estilo para as páginas.
      - `createUser.css`: Estilo para a página de criação de usuários.
      - `listUser.css`: Estilo para a página de listagem de usuários.
    - `js/`: Scripts para as páginas de frontend.
      - `createUser.js`: Script para a página de criação de usuários (realiza requisição POST para adicionar usuários).
      - `listUser.js`: Script para a página de listagem de usuários (realiza requisições GET, PUT e DELETE).
  - `Pages/`
    - `createUser.html`: Página para cadastro de usuários.
    - `listUser.html`: Página para visualização e edição de usuários cadastrados.
    - `index.html`: Página inicial (geralmente a tela de boas-vindas ou acesso ao sistema).

---

## Funcionalidades

### Backend

1. **Listar todos os usuários**:
   - **Rota**: `GET /users`
   - **Descrição**: Retorna uma lista de todos os usuários cadastrados.
   - **Resposta**: Lista de objetos JSON representando os usuários.

2. **Buscar usuário por ID**:
   - **Rota**: `GET /users/:id`
   - **Descrição**: Retorna um usuário específico com base no ID fornecido.
   - **Resposta**: Objeto JSON do usuário ou mensagem de erro 404 se o usuário não for encontrado.

3. **Criar um novo usuário**:
   - **Rota**: `POST /users`
   - **Descrição**: Cria um novo usuário no sistema.
   - **Requisição**: Envia um JSON com os campos `nome`, `sobrenome` e `senha`.
   - **Resposta**: Objeto JSON com os dados do novo usuário.

4. **Atualizar dados de um usuário**:
   - **Rota**: `PUT /users/:id`
   - **Descrição**: Atualiza as informações de um usuário existente.
   - **Requisição**: Envia um JSON com os dados atualizados.
   - **Resposta**: Objeto JSON com os dados atualizados do usuário.

5. **Deletar um usuário**:
   - **Rota**: `DELETE /users/:id`
   - **Descrição**: Deleta um usuário específico com base no ID fornecido.
   - **Resposta**: Status 204 (Sem conteúdo) em caso de sucesso.

### Frontend

1. **Cadastro de Usuário**:
   - **Página**: `createUser.html`
   - **Descrição**: Permite ao usuário cadastrar um novo usuário no sistema.
   - **Funcionalidade**: Ao preencher o formulário e clicar em "Cadastrar", os dados são enviados para o backend via requisição POST.
   - **Estilos**: Utiliza `createUser.css` para uma interface visualmente agradável.

2. **Listagem de Usuários**:
   - **Página**: `listUser.html`
   - **Descrição**: Exibe uma tabela com todos os usuários cadastrados.
   - **Funcionalidade**: 
     - Exibe os dados dos usuários (ID, nome, sobrenome, data de cadastro).
     - Permite editar ou deletar os usuários.
   - **Estilos**: Utiliza `listUser.css` para a tabela e botões de ação.

---
