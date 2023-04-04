const Sequelize = require("sequelize");
const db = require("../database");

const Colors = db.sequelize.define("colors", {
  color_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  color_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Colors;
