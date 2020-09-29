require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  logging: console.log,
  define: {
    timestamps: false,
    underscored: true,
    underscoredAll: true,
  },
};
