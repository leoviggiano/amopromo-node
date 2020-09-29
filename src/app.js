import express from 'express';
import routes from './routes';
//  require('dotenv/config');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Converter automaticamente toda requisição para formato JSON
    this.server.use(express.json());
  }

  routes() {
    // Utilização das rotas no arquivo routes
    this.server.use(routes);
  }
}

export default new App().server;
