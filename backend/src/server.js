require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const sequelize = require("./config/database");
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const authRoutes = require("./routes/auth");
const fipeRoutes = require("./routes/fipe");
const logger = require("./config/logger");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Muitas requisições a partir deste IP, por favor, tente novamente após 15 minutos.",
  },
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/fipe", fipeRoutes);

User.hasMany(Vehicle, { foreignKey: "userId", as: "vehicles" });
Vehicle.belongsTo(User, { foreignKey: "userId", as: "user" });

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info("Banco de dados sincronizado com sucesso.");

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

startServer();
