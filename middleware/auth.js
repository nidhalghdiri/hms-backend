const jwt = require("jsonwebtoken");
const { ROLES, Role } = require("../models/Role");
const { User } = require("../models/User");

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token." });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(500).send({ message: "Error Cannot find user" });
      return;
    }
    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles) {
      res.status(500).send({ message: "Error Cannot find Roles" });
      return;
    }

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }
    res.status(403).send({ message: "Require Admin Role!" });
    return;
  } catch (error) {
    res.status(403).send({ message: "Require Admin Role!" });
    return;
  }
};

const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(500).send({ message: "Error Cannot find user" });
      return;
    }
    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles) {
      res.status(500).send({ message: "Error Cannot find Roles" });
      return;
    }

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        next();
        return;
      }
    }
    res.status(403).send({ message: "Require Moderator Role!" });
    return;
  } catch (error) {
    res.status(403).send({ message: "Require Moderator Role2!" });
    return;
  }
};

module.exports.checkRolesExisted = checkRolesExisted;
module.exports.auth = auth;
module.exports.isAdmin = isAdmin;
module.exports.isModerator = isModerator;
