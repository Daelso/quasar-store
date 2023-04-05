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
    INNER JOIN shop.categories AS categories
            ON products.product_category = categories.category_id
    INNER JOIN shop.sizes AS sizes
            ON products.product_size = sizes.size_id
    INNER JOIN shop.colors AS colors
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

module.exports = router; //Exports our routes
