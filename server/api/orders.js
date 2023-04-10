const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
const { sequelize } = require("../database");

const { QueryTypes } = require("sequelize");

//Route is base/orders/

router.route("/order/:id").get(async (req, res) => {
  try {
    const items = await sequelize.query(
      `SELECT order_id, order_status, line_id, products.product_name, sizes.size_name, color_name, categories.desc, quantity, orders.createdAt, sale_price, shipping_address, shipping_address_2, shipping_city, shipping_state, shipping_cost, shipping_zip, ship_to FROM ${process.env.DB_NAME}.orders

      INNER JOIN ${process.env.DB_NAME}.order_items ON parent_order = order_id
      INNER JOIN ${process.env.DB_NAME}.products ON products.product_id = order_items.product_id
      INNER JOIN ${process.env.DB_NAME}.colors ON colors.color_id = products.product_color

      INNER JOIN ${process.env.DB_NAME}.categories ON ${process.env.DB_NAME}.products.product_category = category_id
      INNER JOIN ${process.env.DB_NAME}.sizes ON products.product_size = size_id

      WHERE order_id = ${req.params.id}

      ORDER BY line_id
      `,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router
  .route("/all")
  .get([lib.authenticateToken, lib.getLimiter], async (req, res) => {
    if (!req.currentUser.is_admin) return res.sendStatus(401);

    try {
      const items = await sequelize.query(
        `SELECT order_id,
        order_status,
        orders.createdat,
        Sum(sale_price) AS item_cost,
        stripe_checkout_id,
        shipping_cost
 FROM   ${process.env.DB_NAME}.orders
        INNER JOIN ${process.env.DB_NAME}.order_items
                ON parent_order = order_id
        INNER JOIN ${process.env.DB_NAME}.products
                ON products.product_id = order_items.product_id
        INNER JOIN ${process.env.DB_NAME}.users AS user
                ON user.user_id = ordered_by
        INNER JOIN ${process.env.DB_NAME}.customer_emails AS customer
                ON customer.email = user.email
 GROUP  BY order_id,
           createdat,
           order_status,
           stripe_checkout_id

       ORDER BY order_id desc
      `,
        { type: QueryTypes.SELECT }
      );
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

router
  .route("/my")
  .get([lib.authenticateToken, lib.getLimiter], async (req, res) => {
    try {
      const items = await sequelize.query(
        `SELECT order_id,
        order_status,
        orders.createdat,
        Sum(sale_price) AS item_cost,
        stripe_checkout_id,
        shipping_cost
 FROM   ${process.env.DB_NAME}.orders
        INNER JOIN ${process.env.DB_NAME}.order_items
                ON parent_order = order_id
        INNER JOIN ${process.env.DB_NAME}.products
                ON products.product_id = order_items.product_id
        INNER JOIN ${process.env.DB_NAME}.users AS user
                ON user.user_id = ordered_by
        INNER JOIN ${process.env.DB_NAME}.customer_emails AS customer
                ON customer.email = user.email
 WHERE  ordered_by = ${req.currentUser.id}
         OR customer.email = user.email
 GROUP  BY order_id,
           createdat,
           order_status,
           stripe_checkout_id

       ORDER BY order_id desc
      `,
        { type: QueryTypes.SELECT }
      );
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

module.exports = router; //Exports our routes
