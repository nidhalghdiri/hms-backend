const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Setup and require Routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// Connection and Inialize Database
require("./startup/db")();
require("./startup/prod")(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running in PORT : ${PORT} `);
});
