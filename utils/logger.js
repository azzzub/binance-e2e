const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      ({ timestamp, level, message, ...metadata }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message} ${JSON.stringify(
          metadata
        )}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: "./out/test.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "error",
    }),
  ],
});

module.exports = logger;
