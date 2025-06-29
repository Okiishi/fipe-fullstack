const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const JWT_SECRET = process.env.JWT_SECRET || "seu_super_segredo";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(
      `Acesso negado à rota ${req.originalUrl}: Token ausente ou mal formatado.`
    );
    return res.status(401).json({
      message: "Acesso negado. Token não fornecido ou mal formatado.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded.user;

    next();
  } catch (err) {
    logger.warn(
      `Tentativa de acesso com token inválido à rota ${req.originalUrl}. Erro: ${err.message}`
    );
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

module.exports = authMiddleware;
