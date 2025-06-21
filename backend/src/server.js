// backend/src/server.js

// --- Importações de Módulos ---
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Importações do projeto
const sequelize = require("./config/database"); // Importa a instância correta do Sequelize
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const fipeRoutes = require("./routes/fipe");

// --- Inicialização do App e Definição da Porta ---
const app = express();
const PORT = process.env.PORT || 5000; // Usa a porta do .env ou 5000 como padrão

// --- Configuração dos Middlewares ---
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// --- Configuração do Rate Limiter ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas tentativas de login a partir deste IP, por favor, tente novamente após 15 minutos.",
  },
});

// --- Definição das Rotas ---
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/fipe", fipeRoutes);

// --- Lógica de Inicialização do Servidor ---

// Função temporária para criar um usuário admin
const createAdminUser = async () => {
  try {
    // Procura pelo usuário
    const existingUser = await User.findOne({
      where: { email: "admin@admin.com" },
    });

    // Se não existir, cria um novo
    if (!existingUser) {
      await User.create({
        email: "admin@admin.com",
        password: "password", // O modelo vai criptografar isso automaticamente
      });
      console.log(">>> Usuário admin de teste criado com sucesso!");
    } else {
      console.log(">>> Usuário admin de teste já existe.");
    }
  } catch (error) {
    console.error(">>> Erro ao tentar criar o usuário admin:", error);
  }
};

// Função principal para iniciar o servidor
const startServer = async () => {
  try {
    // Sincroniza todos os modelos com o banco de dados.
    // Isso cria as tabelas "Users" e "Vehicles" se elas não existirem.
    await sequelize.sync({ alter: true }); // Usar {force: true} deleta e recria as tabelas. Use com cuidado.
    console.log(">>> Banco de dados sincronizado com sucesso.");

    // Roda a função para garantir que o usuário admin exista
    await createAdminUser();

    // Inicia o servidor para escutar por requisições
    app.listen(PORT, () => {
      console.log(`>>> Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(
      ">>> FALHA AO INICIAR: Não foi possível conectar ao banco de dados ou sincronizar.",
      error
    );
  }
};

// Inicia todo o processo
startServer();
