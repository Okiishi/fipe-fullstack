// backend/src/routes/fipe.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const { body, validationResult } = require("express-validator");
const logger = require("../config/logger"); // Adicionei a importação do logger que estava faltando

const Vehicle = require("../models/Vehicle");

// 1. IMPORTE O MIDDLEWARE APENAS UMA VEZ
const authMiddleware = require("../middleware/auth");

const fipeCache = new NodeCache({ stdTTL: 86400 });

// 2. APLIQUE A PROTEÇÃO AQUI PARA TODAS AS ROTAS DO ARQUIVO
// Qualquer rota definida abaixo desta linha exigirá autenticação.
router.use(authMiddleware);

// Função auxiliar para fazer requisições à API FIPE com cache
const fetchFipeData = async (url, cacheKey) => {
  const cachedData = fipeCache.get(cacheKey);
  if (cachedData) {
    console.log(`Retornando dados do cache para: ${cacheKey}`);
    return cachedData;
  }

  console.log(`Buscando dados da API FIPE para: ${cacheKey}`);
  const response = await axios.get(url);
  fipeCache.set(cacheKey, response.data);
  return response.data;
};

// --- Rotas de Busca (já protegidas pelo router.use acima) ---

router.get("/marcas/:vehicleType", async (req, res) => {
  const { vehicleType } = req.params;
  const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas`;
  const cacheKey = `marcas-${vehicleType}`;
  try {
    const data = await fetchFipeData(url, cacheKey);
    res.json(data);
  } catch (error) {
    res.status(502).json({ message: "Erro ao buscar dados da API FIPE." });
  }
});

router.get("/modelos/:vehicleType/:brandCode", async (req, res) => {
  const { vehicleType, brandCode } = req.params;
  const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos`;
  const cacheKey = `modelos-${vehicleType}-${brandCode}`;
  try {
    const data = await fetchFipeData(url, cacheKey);
    res.json(data);
  } catch (error) {
    res.status(502).json({ message: "Erro ao buscar dados da API FIPE." });
  }
});

router.get("/anos/:vehicleType/:brandCode/:modelCode", async (req, res) => {
  const { vehicleType, brandCode, modelCode } = req.params;
  const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos`;
  const cacheKey = `anos-${vehicleType}-${brandCode}-${modelCode}`;
  try {
    const data = await fetchFipeData(url, cacheKey);
    res.json(data);
  } catch (error) {
    res.status(502).json({ message: "Erro ao buscar dados da API FIPE." });
  }
});

router.get(
  "/valor/:vehicleType/:brandCode/:modelCode/:yearCode",
  async (req, res) => {
    const { vehicleType, brandCode, modelCode, yearCode } = req.params;
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`;
    const cacheKey = `valor-${vehicleType}-${brandCode}-${modelCode}-${yearCode}`;
    try {
      const data = await fetchFipeData(url, cacheKey);
      res.json(data);
    } catch (error) {
      res.status(502).json({ message: "Erro ao buscar dados da API FIPE." });
    }
  }
);

// --- Rota de Inserção (já protegida pelo router.use acima) ---

// 3. REMOVA O MIDDLEWARE DUPLICADO DAQUI
router.post(
  "/vehicles",
  [
    // As regras de validação continuam aqui
    body("brand", "A marca é obrigatória e deve ser um texto.")
      .isString()
      .notEmpty()
      .trim()
      .escape(),
    body("model", "O modelo é obrigatório e deve ser um texto.")
      .isString()
      .notEmpty()
      .trim()
      .escape(),
    body("year", "O ano é obrigatório e deve ser um número.").isInt({
      min: 1950,
      max: new Date().getFullYear() + 1,
    }),
    body("value", "O valor é obrigatório.")
      .isString()
      .notEmpty()
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Falha na validação ao inserir veículo:", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { brand, model, year, value } = req.body;

      // Nota: Verifique se seu modelo Vehicle tem o método .create (Sequelize) ou .insert (SQL puro)
      const newVehicle = await Vehicle.create({
        brand,
        model,
        year,
        value,
      });

      logger.info("Veículo inserido com sucesso:", {
        vehicleId: newVehicle.id,
        userId: req.user.id,
      });
      res.status(201).json(newVehicle);
    } catch (error) {
      logger.error("Erro ao inserir veículo no banco de dados:", {
        error: error.message,
        stack: error.stack,
        userId: req.user.id,
      });
      res.status(500).send("Erro no servidor ao tentar inserir o veículo.");
    }
  }
);

module.exports = router;
