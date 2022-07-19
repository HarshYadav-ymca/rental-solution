const mongoose = require("mongoose");
// const password = encodeURIComponent("Priyanshu@123");

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connection succesful");
  })
  .catch((err) => {
    console.log(err);
  });
