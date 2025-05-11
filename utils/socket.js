const WebSocket = require('ws');
const logger = require('./logger');
const { loadConfig } = require('./config');

const config = loadConfig();

class Socket {
  constructor(path) {
    this.baseUrl = config.websocket.host;
    this.path = path;
    this.init();
  }

  init() {
    this.ws = new WebSocket(`${this.baseUrl}${this.path}`);

    this.ws.onopen = () => {
      logger.info('ws connected');
    };

    this.ws.onclose = () => {
      logger.warn('ws closed');
    };

    this.ws.onerror = (err) => {
      logger.warn('ws error', err);
    };
  }
}

module.exports = Socket;