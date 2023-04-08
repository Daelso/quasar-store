const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
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
        metadata: {
          processed: false,
        },
      });
      res.status(200).json(session.url);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

router.route("/handleSuccess").post(async (req, res) => {
  const sessionID = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionID);

    if (session.payment_status === "paid" && !session.metadata.processed) {
      const { name, address, email } = session.shipping;

      // Insert the order information into the "orders" table
      const sql = `INSERT INTO orders (name, address, email) VALUES (?, ?, ?)`;
      const values = [name, JSON.stringify(address), email];

      // Set the processed flag to true in the Checkout Session metadata
      // await stripe.checkout.sessions.update(sessionID, {
      //   metadata: {
      //     processed: true,
      //   },
      // });

      res.send("Order has been placed successfully!");
    } else if (session.metadata.processed) {
      res.status(400).send("Order has already been processed.");
    } else {
      res.status(400).send("Payment was not successful.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred.");
  }
});

module.exports = router; //Exports our routes
