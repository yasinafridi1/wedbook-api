const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");

app.use(express.json());
// mongoose
//   .connect(process.env.DB_URL, {
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("database connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.use("/api/v1", authRoutes);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
