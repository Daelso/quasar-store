const Sequelize = require("sequelize");
const db = require("../database");

const Orders = db.sequelize.define("orders", {
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  order_total: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  order_status: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ordered_by: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  shipping_address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shipping_city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shipping_zip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ship_to: {
    type: Sequelize.STRING,
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

module.exports = Orders;
