const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["https://raccount-network.vercel.app", "http://localhost:3000"],
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

const { authMiddleware } = require("./middleware");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const { userRouter, postRouter } = require("./routes");
const PORT = process.env.PORT || 5000;

// jwt
app.get("*", authMiddleware.checkUser);
app.get("/jwtid", authMiddleware.requireAuth, (req, res) => {
  res.status(200).json(res.locals.user._id);
});

// routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.listen(PORT, () => {
  console.log(
    `Listening on Social-Media-back on PORT ${process.env.PORT} || 5000`
  );
});
