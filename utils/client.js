const axios = require("axios");
const logger = require("./logger");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const { loadConfig } = require("./config");

class Client {
  constructor() {
    const config = loadConfig();
    this.baseURL = config.spotTrading.host;
    this.endpoints = config.spotTrading.endpoints;
    this.apiKey = process.env.BINANCE_API_KEY;
    this.apiKeyBackup = process.env.BINANCE_API_KEY;
    this.apiSecret = this.loadApiSecret();
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  restoreApiKey() {
    this.apiKey = this.apiKeyBackup;
  }

  loadApiSecret() {
    try {
      const secretPath = path.join(__dirname, "../private.pem");
      return fs.readFileSync(secretPath, { encoding: "ascii" }).trim();
    } catch (error) {
      logger.error("Failed to load API secret from private.pem:", error);
      throw new Error("Failed to load API secret");
    }
  }

  generateSignature(queryString) {
    return crypto
      .sign(null, Buffer.from(queryString), {
        key: this.apiSecret,
      })
      .toString("base64");
  }

  async get(
    endpoint,
    params = {},
    opts = { isNegativeCase: false, isNeedSignature: false }
  ) {
    try {
      let queryParams = new URLSearchParams({
        ...params,
      }).toString();

      if (opts.isNeedSignature) {
        queryParams = queryParams + `&timestamp=${Date.now()}`;
        const signature = this.generateSignature(queryParams);
        queryParams = queryParams + `&signature=${signature}`;
      }

      const r = await axios.get(`${this.baseURL}${endpoint}?${queryParams}`, {
        headers: {
          "X-MBX-APIKEY": this.apiKey,
        },
      });

      const response = new Response({
        endpoint,
        status: r.status,
        data: r.data,
        message: "API request successful",
        params,
      });

      logger.info(response);
      return response;
    } catch (error) {
      return this.errorHandler(error, endpoint, params, opts.isNegativeCase);
    }
  }

  async post(
    endpoint,
    params = {},
    opts = { isNegativeCase: false, isNeedSignature: false }
  ) {
    try {
      let queryParams = new URLSearchParams({
        ...params,
      }).toString();

      if (opts.isNeedSignature) {
        queryParams = queryParams + `&timestamp=${Date.now()}`;
        const signature = this.generateSignature(queryParams);
        queryParams = queryParams + `&signature=${signature}`;
      }

      const r = await axios.post(`${this.baseURL}${endpoint}?${queryParams}`, {}, {
        headers: {
          "X-MBX-APIKEY": this.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const response = new Response({
        endpoint,
        status: r.status,
        data: r.data,
        message: "API request successful",
        params,
      });

      logger.info(response);
      return response;
    } catch (error) {
      return this.errorHandler(error, endpoint, params, opts.isNegativeCase);
    }
  }

  errorHandler(error, endpoint, params, isNegativeCase) {
    const response = new Response({
      endpoint,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      params,
    });

    if (isNegativeCase) {
      logger.info(response);
      return response;
    }

    logger.error(response);
    throw response;
  }
}

class Response {
  constructor({ endpoint, status, data, message, params }) {
    this.endpoint = endpoint;
    this.status = status;
    this.data = data;
    this.message = message;
    this.params = params;

    return this;
  }
}

module.exports = new Client();
