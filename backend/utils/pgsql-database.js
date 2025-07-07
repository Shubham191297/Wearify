const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.POSTGRES_DB || "wearify",
  username: process.env.POSTGRES_USER || "sthapliyal",
  password: process.env.POSTGRES_PASSWORD || "1319",
  host: process.env.CLUSTER_POSTGRES_HOST || "localhost",
  port: 5432,
  ssl: true,
});

module.exports = sequelize;
