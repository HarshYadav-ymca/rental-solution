const mongoose = require("mongoose");
const password = encodeURIComponent("Priyanshu@123");

const DB = `mongodb+srv://realestate:${password}@cluster0.9vtac.mongodb.net/realestate?retryWrites=true&w=majority`;

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
