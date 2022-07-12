const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: true,
  },
  sellerEmail: {
    type: String,
    required: true,
  },
  sellerMobile: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  subtype: {
    type: String,
    required: true,
  },
  rent: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Property = mongoose.model("PROPERTY", propertySchema);

module.exports = Property;
