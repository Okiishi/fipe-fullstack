# 🚗 Tabela de Veículos - Aplicação Full-Stack

Este é um projeto Full-Stack para gerenciamento de uma base de dados de veículos. Ele permite que usuários se cadastrem, façam login e mantenham sua própria lista de veículos, podendo inserir e consultar os preços dos carros cadastrados em seu banco de dados pessoal.

A aplicação é dividida em um **backend** construído com Node.js e Express, e um **frontend** moderno com React, Vite e Material UI.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **[Node.js](https://nodejs.org/)** – Ambiente de execução para o JavaScript no servidor.
- **[Express.js](https://expressjs.com/)** – Framework para a construção da API REST.
- **[Sequelize](https://sequelize.org/)** – ORM (Object-Relational Mapper) para interagir com o banco de dados.
- **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional para armazenamento dos dados.
- **[JSON Web Token (JWT)](https://jwt.io/)** – Para criação de tokens de autenticação e proteção de rotas.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)** – Para criptografia de senhas.
- **[Dotenv](https://www.npmjs.com/package/dotenv)** – Para gerenciar variáveis de ambiente.

### Frontend
- **[React](https://reactjs.org/)** – Biblioteca para construção da interface de usuário.
- **[Vite](https://vitejs.dev/)** – Ferramenta de build extremamente rápida para o frontend.
- **[Material UI](https://mui.com/)** – Biblioteca de componentes visuais para um design moderno e responsivo.
- **Context API (`useContext` + `useReducer`)** – Para gerenciamento de estado global da aplicação.
- **[Axios](https://axios-http.com/)** – Cliente HTTP para fazer requisições ao backend.

---

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Sistema completo de registro e login com tokens JWT para segurança.
- **Cadastro de Veículos**: Formulário para inserir novos veículos (marca, modelo, ano e valor) no banco de dados privado do usuário.
- **Consulta Privada de Veículos**: Mecanismo de busca que permite aos usuários consultarem **apenas os veículos que eles mesmos cadastraram**.
- **Banco de Dados Próprio**: Total independência de APIs externas; os dados são 100% gerenciados pelo usuário dentro do seu banco de dados PostgreSQL.
- **Script para Popular Dados (Seed)**: Inclui um script para inserir mais de 100 carros de exemplo no banco de dados para facilitar testes.


(Opcional) Para popular o banco com dados de exemplo, rode o script de seed:
npm run seed


