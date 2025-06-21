// backend/src/routes/auth.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const logger = require("../config/logger");

const JWT_SECRET = process.env.JWT_SECRET || "seu_super_segredo";

// Rota de Login: POST /api/auth/login
router.post(
  "/login",
  // Validação dos campos de entrada
  body("username", "Nome de usuário é obrigatório").notEmpty(),
  body("password", "Senha é obrigatória").notEmpty(),
  async (req, res) => {
    // Retorna erros de validação, se houver
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findByUsername(username);
      if (!user) {
        logger.warn(
          `Tentativa de login falhou: Usuário não encontrado - ${username}`
        );
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const isPasswordMatch = await User.comparePassword(
        password,
        user.password_hash
      );
      if (!isPasswordMatch) {
        logger.warn(
          `Tentativa de login falhou: Senha inválida para o usuário - ${username}`
        );
        return res.status(401).json({ message: "Senha inválida." });
      }

      // ...
      logger.info(`Usuário ${username} logado com sucesso.`);
      res.status(200).json({ auth: true, token: token });
    } catch (error) {
      logger.error(
        `Erro no servidor durante o login para o usuário ${username}: ${error.message}`
      );
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
);

module.exports = router;
