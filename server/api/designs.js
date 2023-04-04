const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
const Designs = require("../models/Designs");
const Products = require("../models/Products");

//Route is base/designs/

router.route("/all").get(lib.authenticateToken, async (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);

  try {
    const designs = await Designs.findAll({
      include: [
        {
          model: Products,
        },
      ],
    });
    return res.status(200).json(designs);
  } catch (err) {
    return res.status(500);
  }
});

router.route("/design/:id").get(lib.authenticateToken, (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);
  res.status(200).json(req.currentUser);
});

module.exports = router; //Exports our routes
