const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");

//Route is base/admin/

router.route("/isAdmin").get(lib.authenticateToken, (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);
  res.status(200).json(req.currentUser);
});

module.exports = router; //Exports our routes
