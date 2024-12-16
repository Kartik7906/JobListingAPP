const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const jobRouter = require("./routes/jobs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
// Configure dotenv for environment variables
dotenv.config();
app.use(cors());
app.use(bodyParser.json());


// Constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/user", userRouter);
app.use("/api/job", jobRouter);

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "try.html"));
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
