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
const { sequelize } = require("../database");
const { QueryTypes } = require("sequelize");

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

router.route("/design/:id").get(lib.authenticateToken, async (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);
  try {
    const design = await Designs.findByPk(req.params.id);
    return res.status(200).json(design);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.route("/design/:id").put(lib.authenticateToken, async (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);
  try {
    const design = await Designs.findByPk(req.params.id);
    const { name, desc, images } = req.body.updatedDesign;

    design.update({
      design_name: name,
      design_desc: desc,
      design_images: images,
      updatedAt: Date.now(),
    });
    return res.status(200).json(design);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.route("/new").post(lib.authenticateToken, async (req, res) => {
  if (!req.currentUser.is_admin) return res.sendStatus(401);
  try {
    const { name, desc, images } = req.body.newDesign;

    await Designs.create({
      design_name: name,
      design_desc: desc,
      design_images: images,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      created_by: req.currentUser.id,
      live: 0,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error!");
  }
  res.status(200).send("Design created!");
});
//For uploading files
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

router.route("/active").get(async (req, res) => {
  try {
    const designs = await sequelize.query(
      `SELECT DISTINCT design_id,
      design_name,
      design_images,
      Sum(products.inventory)  AS totalInventory,
      Min(products.sale_price) AS low,
      Max(products.sale_price) AS high
FROM   ${process.env.DB_NAME}.designs AS designs
INNER JOIN ${process.env.DB_NAME}.products AS products
     ON products.parent_design = designs.design_id
WHERE  live = 1
GROUP  BY design_id;`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json(designs);
  } catch (err) {
    return res.status(500);
  }
});

router.route("/viewProduct/:id").get(async (req, res) => {
  try {
    const designs = await sequelize.query(
      `SELECT DISTINCT design_id, design_desc, design_name, design_images, category.desc as styles, category.category_id, sum(inventory)as inventory FROM ${process.env.DB_NAME}.designs

      INNER JOIN ${process.env.DB_NAME}.products as products ON products.parent_design = design_id
      INNER JOIN ${process.env.DB_NAME}.categories as category ON category.category_id = products.product_category

      WHERE design_id = ${req.params.id}

      GROUP BY design_id, design_desc, design_name, design_images, category.category_id, category.desc;`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json(designs);
  } catch (err) {
    return res.status(500);
  }
});

module.exports = router; //Exports our routes
