import Sequelize, { Model } from 'sequelize';

class Flight extends Model {
  static init(sequelize) {
    super.init(
      {
        url: Sequelize.STRING,
        lowest_price: Sequelize.DOUBLE({ decimals: 2 }),
        price_per_km: Sequelize.DOUBLE({ decimals: 2 }),
        distance: Sequelize.FLOAT,
        aircraft_model: Sequelize.STRING,
        aircraft_manufacturer: Sequelize.STRING,
        arrival_iata: Sequelize.CHAR(3),
        departure_iata: Sequelize.CHAR(3),
        average_speed: Sequelize.FLOAT,
        flight_duration: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
  }
}

export default Flight;
