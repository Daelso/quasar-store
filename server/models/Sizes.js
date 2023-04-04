const Sequelize = require("sequelize");
const db = require("../database");

const Sizes = db.sequelize.define("sizes", {
  size_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  size_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Sizes;
