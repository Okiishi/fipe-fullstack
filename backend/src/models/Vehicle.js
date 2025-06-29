const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vehicle = sequelize.define("Vehicle", {
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Adicionando a chave estrangeira para o usuário
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Nome da tabela de usuários
      key: "id",
    },
  },
});

module.exports = Vehicle;
