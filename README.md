# Gather-up API

## Descrição

A **Gather-up** é uma API RESTful desenvolvida para o gerenciamento de eventos. A API permite que os usuários se cadastrem, criem e participem de eventos. Além disso, oferece funcionalidades para que os organizadores administrem eventos, como designar organizadores, excluir participantes, editar eventos, e muito mais.

## Tecnologias Utilizadas

- **Node.js** com **Express.js** (framework para criação da API)
- **PostgreSQL** (banco de dados relacional)
- **JWT** (JSON Web Tokens) para autenticação e controle de sessão

## Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias para rodar o projeto:

- `DB_USER`: Usuário do banco de dados
- `DB_PASSWORD`: Senha do banco de dados
- `DB_NAME`: Nome do banco de dados
- `DB_HOST`: Endereço do servidor do banco de dados
- `JWT_SECRET`: Chave secreta para assinar tokens JWT
- `NODE_ENV`: Ambiente da aplicação (development, production, etc.)

## Funcionalidades

### Autenticação

A API utiliza **JWT** para autenticação, protegendo as rotas sensíveis. Os usuários podem se registrar, fazer login e deletar suas contas.

**Endpoints de Autenticação:**

- **POST** `/auth/register`: Registro de um novo usuário.
- **POST** `/auth/login`: Autenticação do usuário, retornando um token JWT.
- **DELETE** `/auth/delete/{userId}`: Exclusão de um usuário específico (protegido).

### Gerenciamento de Usuários

Usuários podem atualizar suas informações pessoais, visualizar seus perfis e ver a lista de todos os usuários registrados.

**Endpoints de Usuários:**

- **GET** `/users`: Lista todos os usuários cadastrados.
- **GET** `/users/{userId}`: Recupera as informações de um usuário específico.
- **PUT** `/users/{userId}`: Atualiza as informações de um usuário específico (nome e foto de perfil).

### Gerenciamento de Eventos

Usuários autenticados podem criar, editar e deletar eventos. Ao criar um evento, o usuário é automaticamente definido como o administrador (admin) do evento. Além disso, o administrador pode:

- Designar ou remover organizadores.
- Expulsar participantes.
- Gerenciar as inscrições nos eventos.

**Endpoints de Eventos:**

- **POST** `/users/events`: Criação de um novo evento.
- **PUT** `/events/{eventId}`: Edição de um evento existente.
- **DELETE** `/events/{eventId}`: Deleção de um evento.
- **GET** `/events`: Recupera todos os eventos.
- **GET** `/events/{eventId}`: Recupera as informações de um evento específico.
- **POST** `/events/{eventId}/register`: Inscrição de um usuário em um evento.
- **POST** `/events/{eventId}/cancel-registration`: Cancelamento de inscrição de um evento.
- **PUT** `/events/{eventId}/designate-role`: Designa ou remove o papel de organizador para um participante.
- **DELETE** `/events/{eventId}/remove-user`: Remove um usuário de um evento.

## Segurança

A API utiliza autenticação baseada em **JWT** para proteger rotas sensíveis. As rotas de criação, edição e deleção de eventos, bem como a atualização de perfis de usuários, estão protegidas por tokens **JWT**, garantindo que apenas usuários autenticados e autorizados possam realizar essas ações.

Exemplo de cabeçalho de autenticação:

```http
Authorization: Bearer <seu_token_jwt>
