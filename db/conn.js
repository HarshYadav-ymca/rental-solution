const mongoose = require("mongoose");
// const password = encodeURIComponent("Priyanshu@123");

const DB = process.env.DATABASE;
// console.log("connecting to db");
setTimeout(() => {
  console.log("connecting to db....");
}, 1);

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
