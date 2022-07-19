const express = require("express");

require("../db/conn");

const router = express.Router();

// const multer = require("multer");
const Property = require("../model/propertySchema");

router.post("/upload", async (req, res) => {
  x = Date.now() + `.jpg`;
  try {
    await req.files.image.mv(`../client/public/images/` + x);
    res.send(x);
  } catch (err) {
    console.log(err);
  }
});

router.post("/listProperty", async (req, res) => {
  const {
    sellerName,
    sellerEmail,
    sellerMobile,
    type,
    subtype,
    rent,
    description,
    image,
    address,
    village,
    country,
    city,
    pincode,
  } = req.body;

  if (
    !sellerName ||
    !sellerEmail ||
    !sellerMobile ||
    !type ||
    !subtype ||
    !rent ||
    !description ||
    !image ||
    !address ||
    !village ||
    !country ||
    !city ||
    !pincode
  ) {
    return res.status(422).json({ error: "Plz fill the field property" });
  }

  try {
    const property = new Property({
      sellerName,
      sellerEmail,
      sellerMobile,
      type,
      subtype,
      rent,
      description,
      image,
      address,
      village,
      country,
      city,
      pincode,
    });

    await property.save();

    res.status(201).json({ message: "Property added successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/properties", async (req, res) => {
  try {
    data = await Property.find({});
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
