const Sequelize = require("sequelize");
const db = require("../database");

const Designs = db.sequelize.define("designs", {
  design_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  design_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  design_desc: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  created_by: {
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
  design_images: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  live: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  keywords: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Designs;
