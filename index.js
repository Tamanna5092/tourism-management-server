const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

const corsOption = {
  origin: [
    "http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
  ],
  credential: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));
app.use(express.json())
