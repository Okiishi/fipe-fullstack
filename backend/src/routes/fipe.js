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
  "/vehicles",
  auth, // 1. Protege a rota, exigindo um token de autenticação válido.
  [
    // 2. Define as regras de validação para os dados recebidos.
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
    // 3. Verifica se houve erros de validação.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Falha na validação ao inserir veículo:", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // 4. Extrai os dados validados do corpo da requisição.
      const { brand, model, year, value } = req.body;

      // 5. Usa o modelo Vehicle para criar um novo registro no banco de dados.
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
      // 6. Retorna uma resposta de sucesso com os dados do veículo criado.
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
