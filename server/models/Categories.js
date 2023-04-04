const Sequelize = require("sequelize");
const db = require("../database");

const Categories = db.sequelize.define("categories", {
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Categories;
