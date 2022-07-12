const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Plz fill all the fields" });
  }
  try {
    const userLogin = await User.findOne({ email: email });
    if (!userLogin) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);
    const token = await userLogin.generateAuthToken();
    console.log(typeof token);
    res.cookie("JWT", token, {
      expires: new Date(Date.now() + 10000000),
    });
    if (isMatch) {
      res.status(201).json({ message: "Logged in successfully" });
    } else {
      res.status(422).json({ error: "Invallid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
