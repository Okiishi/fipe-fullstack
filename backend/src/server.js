// backend/src/server.js

// --- Importações de Módulos ---
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// --- Importações do Projeto ---
const sequelize = require("./config/database");
const User = require("./models/User");
const Vehicle = require("./models/Vehicle"); // 1. Importa o modelo Vehicle
const authRoutes = require("./routes/auth");
const fipeRoutes = require("./routes/fipe");
const logger = require("./config/logger"); // Adicionado para consistência

// --- Inicialização do App e Definição da Porta ---
const app = express();
const PORT = process.env.PORT || 3001; // Padronizado para 3001

// --- Configuração dos Middlewares ---
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configuração do Rate Limiter ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas requisições a partir deste IP, por favor, tente novamente após 15 minutos.",
  },
});

// --- Definição das Rotas ---
app.use("/api", apiLimiter); // Aplica o rate limiter a todas as rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/fipe", fipeRoutes);

// --- Associações entre Modelos ---
// 2. Define que um Usuário pode ter vários Veículos e que um Veículo pertence a um Usuário.
// Isso é crucial para o Sequelize criar a chave estrangeira 'userId'.
User.hasMany(Vehicle, { foreignKey: "userId", as: "vehicles" });
Vehicle.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Lógica de Inicialização do Servidor ---

// Função principal para iniciar o servidor
const startServer = async () => {
  try {
    // Sincroniza todos os modelos com o banco de dados.
    // O { alter: true } modifica as tabelas para corresponderem aos modelos (ex: adiciona a coluna userId).
    await sequelize.sync({ alter: true });
    logger.info("Banco de dados sincronizado com sucesso.");

    // Inicia o servidor para escutar por requisições
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error(
      "FALHA AO INICIAR: Não foi possível conectar ao banco de dados ou sincronizar.",
      error
    );
  }
};

// Inicia todo o processo
startServer();
