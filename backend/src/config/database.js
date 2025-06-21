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
  }
);

module.exports = sequelize;
