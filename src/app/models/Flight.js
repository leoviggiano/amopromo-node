import Sequelize, { Model } from 'sequelize';

class Flight extends Model {
  static init(sequelize) {
    super.init(
      {
        url: Sequelize.STRING,
        lowest_price: Sequelize.DOUBLE({ decimals: 2 }),
        distance: Sequelize.FLOAT,
        aircraft_model: Sequelize.STRING,
        aircraft_manufacturer: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Flight;
