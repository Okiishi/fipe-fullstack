// backend/src/models/Vehicle.js

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Vehicle extends Model {}

Vehicle.init(
  {
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
  },
  {
    sequelize, // Passa a conexão do sequelize que foi importada
    modelName: "Vehicle",
    tableName: "vehicles", // Garante que o nome da tabela no banco seja 'vehicles'
  }
);

module.exports = Vehicle;
