const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
var cookieParser = require("cookie-parser");
dotenv.config({ path: "./config.env" });
// app.use(cors());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
require("./db/conn");

app.use(cookieParser());

// const User = require("./model/userSchema");
app.use(express.json());
app.use(fileUpload());
app.use(require("./router/auth"));
app.use(require("./router/postProperty"));

const middlware = (req, res, next) => {
  console.log("Hello from middleware");
  next();
};

app.get("/", (req, res) => {
  console.log(req.url);
  res.send("HEllo World");
});

app.get("/services", (req, res) => {
  console.log(req.url);
  res.send("HEllo from services");
});

// app.get("/login", (req, res) => {
//   console.log(req.url);
//   res.send("HEllo from login");
// });

app.get("/signup", (req, res) => {
  console.log(req.url);
  res.send("HEllo from signup");
});

app.get("/forgotpaword", (req, res) => {
  console.log(req.url);
  res.send("HEllo from forgot pasword");
});

app.get("/listyourproperty", middlware, (req, res) => {
  console.log(req.url);
  res.send("HEllo fromlist your property");
});

app.get("/Rent", middlware, (req, res) => {
  console.log(req.url);
  res.send("HEllo From rent");
});

app.listen(8000, () => {
  console.log("server is running at port 8000");
});
