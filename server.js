const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", express.static(path.join(__dirname, "public")));
// Setup and require Routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// Connection and Inialize Database
require("./startup/db")();
require("./startup/prod")(app);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    console.log("Sending file to index");
    if (err) {
      res.status(500).send(err);
    }
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running in PORT : ${PORT} `);
});
