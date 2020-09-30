module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('airports', {
      iata: {
        type: Sequelize.CHAR(3),
        primaryKey: true,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      state: {
        type: Sequelize.CHAR(2),
        allowNull: false,
      },

      lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      lon: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('airports');
  },
};
