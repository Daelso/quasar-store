const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
const Products = require("../models/Products");
const { sequelize } = require("../database");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");

//Route is base/products/

router.route("/new").post(lib.authenticateToken, async (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);

  const { colors, sizes } = req.body;

  try {
    sizes.forEach((size) => {
      colors.forEach(async (color) => {
        await Products.create({
          product_name: req.body.name,
          product_desc: req.body.desc,
          product_category: req.body.category.category_id,
          product_size: size.size_id,
          product_color: color.color_id,
          parent_design: req.body.designId,
          unit_price: req.body.unitPrice,
          sale_price: req.body.salesPrice,
          inventory: req.body.inventory,
          updatedAt: Date.now(),
          createdAt: Date.now(),
        });
      });
    });
    return res.status(200).send("Products created!");
  } catch (err) {
    return res.status(500);
  }
});

router.route("/all").get(lib.getLimiter, async (req, res) => {
  try {
    const products = await Products.findAll();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500);
  }
});

router.route("/design/:id").get(lib.getLimiter, async (req, res) => {
  try {
    const products = await sequelize.query(
      `SELECT products.product_id,
    products.product_name,
    products.product_desc,
    categories.desc   AS category,
    sizes.size_name   AS size,
    colors.color_name AS color,
    products.unit_price,
    products.sale_price,
    products.inventory
FROM   ${process.env.DB_NAME}.products AS products
    INNER JOIN ${process.env.DB_NAME}.categories AS categories
            ON products.product_category = categories.category_id
    INNER JOIN ${process.env.DB_NAME}.sizes AS sizes
            ON products.product_size = sizes.size_id
    INNER JOIN ${process.env.DB_NAME}.colors AS colors
            ON products.product_color = colors.color_id
WHERE  parent_design = ${req.params.id};`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500);
  }
});

router.route("/edit/:id").put(lib.authenticateToken, async (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);

  try {
    const { color, size, category } = req.body;

    const product = await Products.findByPk(req.params.id);
    await product.update({
      product_name: req.body.name,
      product_desc: req.body.desc,
      product_category: category.category_id,
      product_size: size.size_id,
      product_color: color.color_id,
      parent_design: req.body.designId,
      unit_price: req.body.unitPrice,
      sale_price: req.body.salesPrice,
      inventory: req.body.inventory,
      updatedAt: Date.now(),
    });
    return res.status(200).send("Product Updated");
  } catch (err) {
    return res.status(500);
  }
});

router
  .route("/getSizeByStyle/:design_id/:style_id")
  .get(lib.getLimiter, async (req, res) => {
    try {
      const products = await sequelize.query(
        `SELECT DISTINCT product_size, size_name, sum(inventory) as inventory FROM ${process.env.DB_NAME}.products

      INNER JOIN ${process.env.DB_NAME}.sizes as sizes ON sizes.size_id = product_size

      WHERE parent_design = ${req.params.design_id} AND product_category = ${req.params.style_id} AND inventory > 0
      GROUP BY product_size, size_name
      ORDER BY size_name desc
      ;`,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json(products);
    } catch (err) {
      return res.status(500);
    }
  });

router
  .route("/getColorBySize/:design_id/:size_id/:style_id")
  .get(lib.getLimiter, async (req, res) => {
    try {
      const products = await sequelize.query(
        `SELECT DISTINCT product_color, color_name, sum(inventory) as inventory FROM ${process.env.DB_NAME}.products

      INNER JOIN ${process.env.DB_NAME}.colors as colors ON colors.color_id = product_color

      WHERE parent_design = ${req.params.design_id} AND product_size = ${req.params.size_id} AND product_category = ${req.params.style_id} AND inventory > 0
      GROUP BY product_color, color_name
      ;`,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json(products);
    } catch (err) {
      return res.status(500);
    }
  });

router
  .route("/getFinalProduct/:design_id/:style_id/:size_id/:color_id")
  .get(lib.getLimiter, async (req, res) => {
    try {
      const product = await sequelize.query(
        `SELECT * FROM ${process.env.DB_NAME}.products

        WHERE parent_design = ${req.params.design_id} AND product_size = ${req.params.size_id} AND product_color = ${req.params.color_id} AND product_category = ${req.params.style_id};`,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json(product);
    } catch (err) {
      return res.status(500);
    }
  });

router.route("/getCart").post(lib.getLimiter, async (req, res) => {
  try {
    const cart = req.body.data;
    const products = await sequelize.query(
      `SELECT products.product_id, product_name, product_desc, sale_price, sizes.size_name, colors.color_name, category.desc FROM ${process.env.DB_NAME}.products as products

      INNER JOIN ${process.env.DB_NAME}.sizes as sizes ON sizes.size_id = product_size
      INNER JOIN ${process.env.DB_NAME}.colors as colors ON colors.color_id = product_color
      INNER JOIN ${process.env.DB_NAME}.categories as category ON category.category_id = product_category

      WHERE product_id IN (${cart})

      ORDER BY product_id`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500);
  }
});

module.exports = router; //Exports our routes
