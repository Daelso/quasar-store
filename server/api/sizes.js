const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
const Sizes = require("../models/Sizes");

//Route is base/sizes/

router.route("/all").get(async (req, res) => {
  try {
    const sizes = await Sizes.findAll();
    res.status(200).json(sizes);
  } catch (err) {
    return res.status(500);
  }
});

module.exports = router; //Exports our routes
