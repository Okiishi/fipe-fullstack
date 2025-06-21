// backend/src/models/Vehicle.js

const pool = require("../config/database");

/**
 * Classe de modelo para interagir com a tabela 'vehicles' no banco de dados.
 */
class Vehicle {
  /**
   * Insere um novo veículo no banco de dados.
   * Os dados do veículo vêm da API FIPE.
   * @param {object} vehicleData - Objeto contendo os dados do veículo.
   * @returns {Promise<object>} O veículo que foi inserido.
   */
  static async insert(vehicleData) {
    const { Modelo, Marca, AnoModelo, Combustivel, Valor } = vehicleData;

    // Validação simples para garantir que os campos essenciais existem
    if (!Modelo || !Marca || !AnoModelo || !Valor) {
      throw new Error("Dados do veículo incompletos para inserção.");
    }

    const query = `
      INSERT INTO vehicles(modelo, marca, ano_modelo, combustivel, valor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [Modelo, Marca, AnoModelo, Combustivel, Valor];

    try {
      const { rows } = await pool.query(query, values);
      console.log("Veículo inserido com sucesso:", rows[0]);
      return rows[0];
    } catch (error) {
      console.error("Erro ao inserir veículo no banco de dados:", error);
      throw error;
    }
  }

  /**
   * Busca veículos no banco de dados com base em critérios de pesquisa.
   * A busca é case-insensitive e parcial (usando ILIKE).
   * @param {object} criteria - Objeto com os critérios de busca (ex: { marca: 'Ford' }).
   * @returns {Promise<Array<object>>} Uma lista de veículos que correspondem aos critérios.
   */
  static async search(criteria) {
    let baseQuery = "SELECT * FROM vehicles WHERE 1=1";
    const values = [];
    let paramIndex = 1;

    // Constrói a query dinamicamente com base nos critérios fornecidos
    Object.keys(criteria).forEach((key) => {
      if (criteria[key]) {
        baseQuery += ` AND ${key} ILIKE $${paramIndex}`;
        values.push(`%${criteria[key]}%`);
        paramIndex++;
      }
    });

    try {
      const { rows } = await pool.query(baseQuery, values);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      throw error;
    }
  }
}

module.exports = Vehicle;
