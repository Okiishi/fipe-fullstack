// backend/src/routes/fipe.js

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize"); // Importando Op do Sequelize para consultas
const logger = require("../config/logger");

// Importando os modelos
const Vehicle = require("../models/Vehicle"); // << CORREÇÃO APLICADA AQUI

// Importando o middleware de autenticação
const authMiddleware = require("../middleware/auth");

// Aplicando o middleware de autenticação a todas as rotas deste arquivo
router.use(authMiddleware);

// --- ROTAS DE BUSCA (MODIFICADAS PARA USAR O BANCO DE DADOS) ---

/**
 * @route   GET /api/fipe/marcas/:vehicleType
 * @desc    Busca as marcas distintas do banco de dados do usuário logado
 * @access  Privado
 */
router.get("/marcas/:vehicleType", async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { userId: req.user.id }, // Filtra por usuário logado
      attributes: ["brand"],
      group: ["brand"],
      order: [["brand", "ASC"]],
    });

    // Formata os dados para corresponder ao que o frontend espera
    const formattedBrands = vehicles.map((v) => ({
      codigo: v.brand,
      nome: v.brand,
    }));

    logger.info(
      `Marcas encontradas para o usuário ${req.user.id}: ${formattedBrands.length}`
    );
    res.json(formattedBrands);
  } catch (error) {
    logger.error("Erro ao buscar marcas do BD:", {
      error: error.message,
      userId: req.user.id,
    });
    res.status(500).json({ message: "Erro ao buscar marcas." });
  }
});

/**
 * @route   GET /api/fipe/modelos/:vehicleType/:brandCode
 * @desc    Busca os modelos de uma marca do banco de dados do usuário logado
 * @access  Privado
 */
router.get("/modelos/:vehicleType/:brandCode", async (req, res) => {
  const { brandCode } = req.params;
  try {
    const vehicles = await Vehicle.findAll({
      where: {
        brand: brandCode,
        userId: req.user.id, // Filtra por usuário logado
      },
      attributes: ["model"],
      group: ["model"],
      order: [["model", "ASC"]],
    });

    // Formata os dados para corresponder ao que o frontend espera
    const formattedModels = {
      modelos: vehicles.map((v) => ({
        codigo: v.model,
        nome: v.model,
      })),
    };

    logger.info(
      `Modelos encontrados para a marca ${brandCode} do usuário ${req.user.id}: ${formattedModels.modelos.length}`
    );
    res.json(formattedModels);
  } catch (error) {
    logger.error("Erro ao buscar modelos do BD:", {
      error: error.message,
      userId: req.user.id,
      brandCode,
    });
    res.status(500).json({ message: "Erro ao buscar modelos." });
  }
});

/**
 * @route   GET /api/fipe/anos/:vehicleType/:brandCode/:modelCode
 * @desc    Busca os anos de um modelo do banco de dados do usuário logado
 * @access  Privado
 */
router.get("/anos/:vehicleType/:brandCode/:modelCode", async (req, res) => {
  const { brandCode, modelCode } = req.params;
  try {
    const vehicles = await Vehicle.findAll({
      where: {
        brand: brandCode,
        model: modelCode,
        userId: req.user.id, // Filtra por usuário logado
      },
      attributes: ["year"],
      group: ["year"],
      order: [["year", "DESC"]],
    });

    // Formata os dados para corresponder ao que o frontend espera
    const formattedYears = vehicles.map((v) => ({
      codigo: `${v.year}-1`, // Mantém o formato "ANO-1" para compatibilidade
      nome: v.year.toString(),
    }));

    logger.info(
      `Anos encontrados para o modelo ${modelCode} do usuário ${req.user.id}: ${formattedYears.length}`
    );
    res.json(formattedYears);
  } catch (error) {
    logger.error("Erro ao buscar anos do BD:", {
      error: error.message,
      userId: req.user.id,
      brandCode,
      modelCode,
    });
    res.status(500).json({ message: "Erro ao buscar anos." });
  }
});

/**
 * @route   GET /api/fipe/valor/:vehicleType/:brandCode/:modelCode/:yearCode
 * @desc    Busca o valor de um veículo específico do banco de dados do usuário logado
 * @access  Privado
 */
router.get(
  "/valor/:vehicleType/:brandCode/:modelCode/:yearCode",
  async (req, res) => {
    const { brandCode, modelCode, yearCode } = req.params;
    // Extrai o ano do yearCode (ex: "2015-1" -> "2015")
    const year = yearCode.split("-")[0];

    try {
      const vehicle = await Vehicle.findOne({
        where: {
          brand: brandCode,
          model: modelCode,
          year: year,
          userId: req.user.id, // Filtra por usuário logado
        },
      });

      if (!vehicle) {
        logger.warn(
          `Veículo não encontrado no BD para o usuário ${req.user.id}`,
          { brandCode, modelCode, year }
        );
        return res
          .status(404)
          .json({ message: "Veículo não encontrado na sua base de dados." });
      }

      // Monta a resposta no mesmo formato da API FIPE para não quebrar o frontend
      const result = {
        Valor: vehicle.value, // Nome da coluna no seu BD é 'value'
        Marca: vehicle.brand,
        Modelo: vehicle.model,
        AnoModelo: vehicle.year,
      };

      logger.info(
        `Valor consultado para o veículo ${result.Marca} ${result.Modelo} do usuário ${req.user.id}`
      );
      res.json(result);
    } catch (error) {
      logger.error("Erro ao buscar valor do BD:", {
        error: error.message,
        userId: req.user.id,
      });
      res.status(500).json({ message: "Erro ao buscar o valor do veículo." });
    }
  }
);

// --- ROTA DE INSERÇÃO (SEM ALTERAÇÕES) ---

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

      const newVehicle = await Vehicle.create({
        brand,
        model,
        year,
        value,
        userId: req.user.id, // Adiciona o ID do usuário ao criar o veículo
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
