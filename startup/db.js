const mongoose = require("mongoose");
const { Role } = require("../models/Role");

module.exports = function () {
  // Initial Function for initialize Roles
  function initial() {
    Role.estimatedDocumentCount(async (err, count) => {
      if (!err && count === 0) {
        const userRole = await new Role({ name: "user" }).save();
        if (userRole) {
          console.log("added 'user' to roles collection");
        }

        const moderatorRole = await new Role({ name: "moderator" }).save();
        if (moderatorRole) {
          console.log("added 'moderator' to roles collection");
        }

        const adminRole = await new Role({ name: "admin" }).save();
        if (adminRole) {
          console.log("added 'admin' to roles collection");
        }
      } else {
        console.log("Roles Exist in Database!");
      }
    });
  }

  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database Connected Successfully.");
      initial();
    })
    .catch(() => {
      console.log("Error Connecting to Database!");
    });
};
