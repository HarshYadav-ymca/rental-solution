const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/authenticate");
require("../db/conn");

const User = require("../model/userSchema");
const router = express.Router();

// router.get("/", (req, res) => {
//   console.log(req.url);
//   res.send("HEllo World from router");
// });

router.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(422).json({ error: "Plz fill the field property" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }

    const user = new User({ name, email, mobile, password });

    await user.save();

    res.status(201).json({ message: "user registerd successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  let token;
  const { email, password } = req.body;
  // console.log(email, password);

  if (!email || !password) {
    res.status(422).json({ error: "Plz fill all the fields" });
  }
  try {
    const userLogin = await User.findOne({ email: email });
    if (!userLogin) {
      console.log("invalid email");

      return res.status(422).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);
    token = await userLogin.generateAuthToken();
    // console.log(typeof token);
    // console.log(isMatch);
    res.cookie("JWT", token);
    // console.log(res.cookie);
    // console.log(isMatch, "asas");
    if (isMatch) {
      // console.log(token);
      res.status(201).json({ message: "Logged in successfully" });
    } else {
      console.log("invalid password");
      res.status(422).json({ error: "Invallid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", authenticate, (req, res) => {
  console.log(req.rootUser.name);
  res.send(req.rootUser);
});

router.get("/logout", (req, res) => {
  console.log("Logging out");
  res.clearCookie("JWT", { path: "/" });
  res.status(200).send("User logout");
});

module.exports = router;
