const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  database: "wearify",
  user: "sthapliyal",
  password: "1319",
  host: "localhost",
  port: 5432,
  ssl: true,
});

module.exports = sequelize;
