require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
