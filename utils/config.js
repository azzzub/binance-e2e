const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");
const logger = require("./logger");

const loadConfig = () => {
  try {
    const configPath = path.join(__dirname, "../config/config.yaml");
    const config = yaml.load(fs.readFileSync(configPath, "utf8"));

    return config;
  } catch (error) {
    logger.error("Failed to load configuration:", error);
    throw new Error("Failed to load configuration:", error);
  }
};

module.exports = {
  loadConfig,
};
