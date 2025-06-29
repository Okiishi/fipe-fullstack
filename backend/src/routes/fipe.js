const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const logger = require("../config/logger");

const Vehicle = require("../models/Vehicle");

const authMiddleware = require("../config/auth");

router.use(authMiddleware);

router.get("/marcas/:vehicleType", async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { userId: req.user.id },
      attributes: ["brand"],
      group: ["brand"],
      order: [["brand", "ASC"]],
    });

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

router.get("/modelos/:vehicleType/:brandCode", async (req, res) => {
  const { brandCode } = req.params;
  try {
    const vehicles = await Vehicle.findAll({
      where: {
        brand: brandCode,
        userId: req.user.id,
      },
      attributes: ["model"],
      group: ["model"],
      order: [["model", "ASC"]],
    });

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

router.get("/anos/:vehicleType/:brandCode/:modelCode", async (req, res) => {
  const { brandCode, modelCode } = req.params;
  try {
    const vehicles = await Vehicle.findAll({
      where: {
        brand: brandCode,
        model: modelCode,
        userId: req.user.id,
      },
      attributes: ["year"],
      group: ["year"],
      order: [["year", "DESC"]],
    });

    const formattedYears = vehicles.map((v) => ({
      codigo: `${v.year}-1`,
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

router.get(
  "/valor/:vehicleType/:brandCode/:modelCode/:yearCode",
  async (req, res) => {
    const { brandCode, modelCode, yearCode } = req.params;

    const year = yearCode.split("-")[0];

    try {
      const vehicle = await Vehicle.findOne({
        where: {
          brand: brandCode,
          model: modelCode,
          year: year,
          userId: req.user.id,
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

      const result = {
        Valor: vehicle.value,
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

router.post(
  "/vehicles",
  [
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
        userId: req.user.id,
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
