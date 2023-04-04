const express = require("express");
const cookieParser = require("cookie-parser");
const formidable = require("formidable");
require("dotenv").config();
const app = express();
const path = require("path");
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const lib = require("../lib");
const Designs = require("../models/Designs");
const fs = require("fs");
const folder = path.join(__dirname, "../../src/assets/designImages");

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

//Route is base/designs/

router.route("/all").get(lib.authenticateToken, async (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);

  try {
    const designs = await Designs.findAll();
    return res.status(200).json(designs);
  } catch (err) {
    return res.status(500);
  }
});

router.route("/design/:id").get(lib.authenticateToken, (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);
  res.status(200).json(req.currentUser);
});

router
  .route("/upload")
  .post([lib.authenticateToken, lib.postLimiter], (req, res) => {
    if (!req.currentUser.is_admin) return res.sendStatus(401);
    const form = new formidable.IncomingForm({
      multiples: true,
      keepExtensions: true,
      uploadDir: folder,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("Error parsing the files");
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }
      for (const file in files) {
        fs.rename(
          files[file].filepath,
          folder + "/" + files[file].originalFilename,
          function (err) {
            if (err) next(err);
            res.end();
          }
        );
      }

      res.status(200).send("thanks");
    });
  });

module.exports = router; //Exports our routes
