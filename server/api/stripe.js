const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
const Customer_Emails = require("../models/Customer_Emails");
const Orders = require("../models/Orders");
const { or } = require("sequelize");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

//Route is base/stripe/

router
  .route("/create-checkout-session")
  .post(lib.postLimiter, async (req, res) => {
    try {
      const line_items = req.body.data;

      const stripeLineItems = line_items.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.product_name,
            },
            unit_amount: (product.sale_price * 100).toFixed(0),
          },
          quantity: product.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["US", "CA"] },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 1040, currency: "usd" },
              display_name: "USPS Standard Shipping",
              delivery_estimate: {
                minimum: { unit: "week", value: 4 },
                maximum: { unit: "week", value: 6 },
              },
            },
          },
        ],
        payment_method_types: ["card", "cashapp", "us_bank_account"],
        mode: "payment",
        line_items: stripeLineItems,
        success_url: `${process.env.CLIENT_URL}/order-complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
      });
      res.status(200).json(session.url);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

router.route("/handleSuccess").post(async (req, res) => {
  const sessionID = req.body.data.session_id;

  const currentUser = lib.getCurrentUser(req, res);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionID);

    //stripe annoyingly converts booleans to string
    if (session.payment_status === "paid") {
      const { name, email } = session.customer_details;
      const { line1, line2, city, state, postal_code, country } =
        session.shipping_details.address;

      const { amount_total } = session.shipping_cost;

      const userEmail = await Customer_Emails.findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          email: email,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      });

      const order = await Orders.create({
        order_status: 1,
        ordered_by: currentUser ? currentUser.id : null,
        shipping_address: line1,
        shipping_address_2: line2 ? line2 : null,
        shipping_city: city,
        shipping_zip: postal_code,
        shipping_state: state,
        shipping_country: country,
        shipping_cost: amount_total,
        ship_to: name,
        stripe_checkout_id: sessionID,
        customer_email: userEmail[0].dataValues.email_id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log(order);

      res.send("Order has been placed successfully!");
    } else {
      res.status(400).send("Payment was not successful.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred.");
  }
});

module.exports = router; //Exports our routes
