const { Sequelize, STRING } = require("sequelize");
const sequelize = require("../utils/pgsql-database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  resetToken: {
    type: Sequelize.STRING,
  },
  resetTokenExpiration: {
    type: Sequelize.DATE,
  },
  shoppingBagId: {
    type: Sequelize.STRING,
  },
  password: Sequelize.STRING,
});

module.exports = User;
