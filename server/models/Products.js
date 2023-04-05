const Sequelize = require("sequelize");
const db = require("../database");
const Designs = require("./Designs");

const Products = db.sequelize.define("products", {
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  product_desc: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  product_category: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  product_size: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  product_color: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  parent_design: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  unit_price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  sale_price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  inventory: {
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
});

module.exports = Products;
