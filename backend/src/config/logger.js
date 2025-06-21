// backend/src/config/logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // Nível mínimo de log a ser registrado
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Salva logs de erro em um arquivo separado
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // Salva todos os logs a partir do nível 'info' em outro arquivo
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Se não estivermos em produção, também exibe os logs no console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
