const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres", // Informa ao Sequelize que estamos usando PostgreSQL
    port: process.env.DB_PORT,
    logging: false, // Opcional: desativa os logs de query do Sequelize no console
    pool: {
      // Adicione esta seção
      max: 5, // Máximo de 5 conexões
      min: 0, // Mínimo de 0 conexões
      acquire: 30000, // Tempo máximo (ms) para tentar obter uma conexão
      idle: 10000, // Tempo máximo (ms) que uma conexão pode ficar ociosa
    },
  }
);

module.exports = sequelize;
