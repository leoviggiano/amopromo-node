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
        type: Sequelize.DOUBLE({ decimals: 2 }),
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('flights');
  },
};
