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
  } catch (err) {
    return res.status(500);
  }
});

module.exports = router; //Exports our routes
