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

app.get("*", (req, res) => {
  res.sendFile(
    path.join("https://hms-oman.onrender.com/", "build", "index.html")
  );
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.type("txt").send("404 Page");
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running in PORT : ${PORT} `);
});
