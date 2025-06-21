// backend/src/middleware/auth.js
const logger = require("../config/logger");
const jwt = require("jsonwebtoken");

// É crucial armazenar seu segredo em uma variável de ambiente em um projeto real.
const JWT_SECRET = process.env.JWT_SECRET || "seu_super_segredo";

function authMiddleware(req, res, next) {
  // O token é geralmente enviado no cabeçalho 'Authorization' como 'Bearer TOKEN'
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn(
      `Acesso negado à rota ${req.originalUrl}: Nenhum token fornecido.`
    );
    return res
      .status(401)
      .json({ message: "Acesso negado. Nenhum token fornecido." });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Erro no token." });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token mal formatado." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn(
        `Tentativa de acesso com token inválido à rota ${req.originalUrl}. Erro: ${err.message}`
      );
      return res.status(401).json({ message: "Token inválido." });
    }

    // Adiciona o ID do usuário decodificado ao objeto de requisição
    req.userId = decoded.id;
    return next();
  });
}

module.exports = authMiddleware;
