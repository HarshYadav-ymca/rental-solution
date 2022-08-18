const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/authenticate");
require("../db/conn");

const User = require("../model/userSchema");
const UserVerification = require("../model/userVerification");

const router = express.Router();

// email handler

const nodemailer = require("nodemailer");

// unique string

const { v4: uuidv4 } = require("uuid");

// nodemailer stuff

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to use");
    console.log(success);
  }
});
// console.log(process.env.AUTH_PASS);
// send verification email

const sendVerificationEmail = ({ _id, email }, res) => {
  const currentUrl = "http://localhost:8000/";

  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify your email",
    html: `<p>Verify your email address to complete the signup and login into your account.</p>
    <p> This link <b>expires in 6 hours</b> .</p> <p> Press <a href = ${
      currentUrl + "user/verify/" + _id + "/" + uniqueString
    }> here </a> to proceed . </p>`,
  };

  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              console.log("mail sent");
              res.status(201).json({
                message:
                  "User Registered Successfully . Go verify your email with the link provided to access all features",
              });
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Verification email failed",
              });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occured while hashing email",
      });
    });
};

router.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(422).json({ error: "Plz fill the field property" });
  } else if (!/^[a-zA-Z]*$/.test(name)) {
    return res.status(422).json({
      status: "Failed",
      message: "Invalid name",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(422).json({
      status: "Failed",
      message: "Invalid email",
    });
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
    return res.status(422).json({
      status: "Failed",
      message:
        "Invalid password \n Password should bebetween 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
    });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }

    const user = new User({ name, email, mobile, password, verified: false });

    result = await user.save();

    sendVerificationEmail(result, res);
    // res.status(201).json({ message: "User registerd successfully" });
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

router.get("/user/verify/:userId/:uniqueString", (req, res) => {
  // console.log("hsd");
  let { userId, uniqueString } = req.params;
  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        if (expiresAt < Date.now()) {
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  console.log("link expired please signup again");
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // valid record exists , so we validate the string
          // first compare the hashed unique string
          // console.log("comparing strings");

          bcrypt.compare(uniqueString, hashedUniqueString).then((result) => {
            if (result) {
              User.updateOne({ _id: userId }, { verified: true })
                .then(() => {
                  UserVerification.deleteOne({ userId })
                    .then(() => {
                      res.send("User verified successfully . Please login");
                    })
                    .catch((error) => {
                      res.send("an error occured while deleting");
                    });
                })
                .catch((error) => {
                  console.log(error);
                  res.send("An error occured while updating user record");
                });
            }
          });
        }
      } else {
        console.log("acc. record doesnt exist");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
