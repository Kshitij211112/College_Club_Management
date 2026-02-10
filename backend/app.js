const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const certificateRoutes = require("./routes/certificateroute");
const templateRoutes = require("./routes/templateRoute");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/generated", express.static("generated"));
app.use("/templates", express.static("templates"));

// MongoDB connectionn
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/certificates", certificateRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/emails", require("./routes/emailRoute"));

app.listen(5050, () => console.log("Server running on port 5050"));
