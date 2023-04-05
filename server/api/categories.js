const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
const Categories = require("../models/Categories");

//Route is base/categories/

router.route("/all").get(async (req, res) => {
  try {
    const categories = await Categories.findAll();
    res.status(200).json(categories);
  } catch (err) {
    return res.status(500);
  }
});

module.exports = router; //Exports our routes
