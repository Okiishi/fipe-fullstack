// backend/src/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Importa o Helmet para segurança
const compression = require("compression"); // Importa o Compression para otimização
const rateLimit = require("express-rate-limit"); // Importa o Rate Limit para segurança
const compression = require("compression");

const authRoutes = require("./routes/auth");
const fipeRoutes = require("./routes/fipe");

const app = express();

// --- Configuração dos Middlewares ---

// 1. Helmet: Adiciona vários cabeçalhos HTTP de segurança para proteger a aplicação
app.use(helmet());

// 2. Compression: Comprime as respostas para melhorar a performance
app.use(compression());

// 3. CORS: Habilita a comunicação entre front-end e back-end
app.use(cors());

// 4. JSON Parser: Habilita o parsing de JSON no corpo das requisições
app.use(express.json());

// --- Configuração do Rate Limiter para a rota de login ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 10, // Limita cada IP a 10 requisições de login por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas tentativas de login a partir deste IP, por favor, tente novamente após 15 minutos.",
  },
});

// --- Definição das Rotas ---

// Aplica o Rate Limiter apenas nas rotas de autenticação para prevenir ataques de força bruta
app.use("/api/auth", loginLimiter, authRoutes);

// As outras rotas não precisam do mesmo limitador
app.use("/api/fipe", fipeRoutes);

// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
