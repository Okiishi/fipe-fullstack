// backend/src/routes/fipe.js

const express = require("express");
const router = express.Router();
const axios = require("axios"); // Usaremos axios para facilitar as requisições HTTP
const NodeCache = require("node-cache");
const { body, validationResult } = require("express-validator");

const Vehicle = require("../models/Vehicle");
const authMiddleware = require("../middleware/auth");

// Configuração do cache: os dados da FIPE não mudam com frequência.
// Um TTL (time-to-live) de 1 dia (86400 segundos) é uma boa escolha.
const fipeCache = new NodeCache({ stdTTL: 86400 });

// Middleware para todas as rotas neste arquivo
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

// --- Rotas de Busca (Proxy com Cache) ---

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

// --- Rota de Inserção ---

router.post(
  "/veiculos",
  // Validação e sanitização dos campos
  body("Modelo")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("O campo Modelo é obrigatório."),
  body("Marca")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("O campo Marca é obrigatório."),
  body("AnoModelo").isInt({ min: 1900 }).withMessage("Ano do modelo inválido."),
  body("Valor")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("O campo Valor é obrigatório."),
  body("Combustivel").trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newVehicle = await Vehicle.insert(req.body);
      res.status(201).json(newVehicle);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro no servidor ao inserir o veículo." });
    }
  }
);

module.exports = router;
