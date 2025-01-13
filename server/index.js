const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const userRouter = require("./src/routes/userRouter");
const adminRouter = require("./src/routes/adminRouter");

// setting up app
const app = express();
const PORT = 4000;
app.use(helmet());
app.use(cors());
// app.use(cors({ origin: ["https://your-frontend.com"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1d" }));

// connect to mongoDB
if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to mongoDB"))
  .catch((error) => {
    console.error("mongoDb connection error", error);
    process.exit(1);
  });
// routes
app.get("/", (req, res) => {
  res.send("server is live"); 
});
// user router
app.use("/user", userRouter);
// admin router
app.use("/admin", adminRouter);
// 404 handler for unknown routes
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
// centralised error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.status || 500;
  const errorMessage = err.message || "internal server error";
  res.status(statusCode).json({
    message: errorMessage,
    success: false,
    error: true,
  });
});

// start the server
app.listen(PORT, () => {
  console.log("server started");
});
