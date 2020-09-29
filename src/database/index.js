import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Flight from '../app/models/Flight';

const models = [Flight];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
