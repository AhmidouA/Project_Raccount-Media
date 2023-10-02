const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@social-media-bd.5a8ncgl.mongodb.net/`)
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.error("Not Connected to mongoDb", err));
