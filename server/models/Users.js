const Sequelize = require("sequelize");
const db = require("../database");

const Users = db.sequelize.define("users", {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  terms_accepted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  activated: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  is_admin: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Users;
