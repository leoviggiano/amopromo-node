import Sequelize, { Model } from 'sequelize';

class Airport extends Model {
  static init(sequelize) {
    super.init(
      {
        iata: Sequelize.CHAR(3),
        city: Sequelize.STRING,
        state: Sequelize.CHAR(2),
        lat: Sequelize.FLOAT,
        lon: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Airport;
