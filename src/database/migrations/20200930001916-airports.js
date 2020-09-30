module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('airports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      iata: {
        type: Sequelize.CHAR(3),
        allowNull: false,
        unique: true,
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
