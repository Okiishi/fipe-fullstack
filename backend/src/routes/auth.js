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
  [
    body("email", "Por favor, inclua um email válido").isEmail(),
    body("password", "A senha é obrigatória").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // CORREÇÃO: A desestruturação vem PRIMEIRO
    const { email, password } = req.body;

    try {
      // DEPOIS usamos a variável 'email' para a busca
      const user = await User.findOne({ where: { email } });

      // Verificamos se o usuário existe E se a senha está correta
      // Enviamos a mesma mensagem de erro nos dois casos por segurança
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Se tudo estiver certo, criamos o payload e o token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }, // Token expira em 1 hora
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error("Erro no servidor durante o login:", error.message);
      res.status(500).send("Erro interno do servidor");
    }
  }
);

// Não esqueça do module.exports no final do arquivo
module.exports = router;
