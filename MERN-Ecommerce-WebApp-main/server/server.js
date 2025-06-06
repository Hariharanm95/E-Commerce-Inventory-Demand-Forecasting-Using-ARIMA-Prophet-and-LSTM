require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/connect");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const fs = require("fs");
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


//IMPORTING ROUTES
const userRoutes = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const forecastRoutes = require('./routes/forecastRoutes'); // Import the forecast routes


console.log("Mongo URI:", process.env.MONGO_URI);

connectDB(process.env.MONGO_URI);

app.use('/uploads', express.static('uploads'));

//MIDDLEWARE
app.use(cors(corsOptions));
app.use(express.json());

// ROUTES
app.use("/api/v1/", authRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/cart", cartRoutes);
app.use('/api/v1/forecast', forecastRoutes); // Use the forecast routes


const PORT = process.env.PORT || 5000;

//SERVE STATIC ASSETS IF IN PRODUCTION
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

//CONNECTING TO THE DATABASE
mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`server running on port ${PORT}...`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
