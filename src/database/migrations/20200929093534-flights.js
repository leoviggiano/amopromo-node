module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flights', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      lowest_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      distance: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      aircraft_model: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      aircraft_manufacturer: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      price_per_km: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      arrival_iata: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },

      departure_iata: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },

      average_speed: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      flight_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('flights');
  },
};
