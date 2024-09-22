const { Sequelize } = require("sequelize");
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
  shoppingBagId: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
