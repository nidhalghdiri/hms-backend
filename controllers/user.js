const { validateUsername } = require("../helpers/validation");
const { User, validateUser } = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const { Role } = require("../models/Role");

exports.register = async (req, res) => {
  try {
    // Validate Data Structure
    const { error } = validateUser(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { first_name, last_name, email, password, gender, roles } = req.body;

    // Validate Existance of Email
    const check = await User.findOne({ email }).exec();
    if (check) {
      return res.status(400).send({
        message: "البريد الإلكتروني موجود.",
      });
    }

    // Crypt Passowrd
    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(password, salt);

    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);

    // Save Data to Database
    const user = await new User({
      first_name,
      last_name,
      email,
      username: newUsername,
      password: cryptedPassword,
      gender,
    }).save();

    if (!user) {
      return res.status(500).send({ message: "User Cannot Registered" });
    }
    // Check if User has roles
    if (roles) {
      const userRoles = await Role.find({ name: { $in: roles } });
      if (!userRoles) {
        return res
          .status(500)
          .send({ message: "User Roles Cannot Registered" });
      }
      user.roles = userRoles.map((role) => role._id);
      const userWithRoles = await user.save();
      if (!userWithRoles) {
        return res
          .status(500)
          .send({ message: "Somthing Wrong when Setting Roles to user" });
      }

      //Generate Token
      const token = generateToken({ id: user._id.toString() });

      // Send Success Response
      return res.header("x-auth-token", token).status(200).send({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        gender: gender,
        roles: roles,
        message: "تم تسجيل المستخدم بنجاح.",
      });
    } else {
      const userRole = await Role.findOne({ name: "user" });
      if (!userRole) {
        return res.status(500).send({ message: "Cannot Fetch User Role" });
      }
      user.roles = [userRole._id];
      const userWithDefaultRole = await user.save();
      if (!userWithDefaultRole) {
        return res
          .status(500)
          .send({ message: "Cannot set default role to user" });
      }
      //Generate Token
      const token = generateToken({ id: user._id.toString() });
      return res.header("x-auth-token", token).status(200).send({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        gender: gender,
        roles: roles,
        message: "تم تسجيل المستخدم بنجاح.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "هناك مشكلة في الإتصال بقاعدة البيانات!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send({ message: "جميع الخانات إجبارية" });
    }
    // Check User Exist or Not
    const user = await User.findOne({ email }).populate("roles", "-__v");
    if (!user) {
      return res.status(400).send({
        message: "البريد الإلكتروني غير صحيح.",
      });
    }
    // Check Password Validation
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res
        .status(400)
        .send({ message: "البريد الإلكتروني أو كلمة المرور غير صالحة." });
    }

    // Generate Token
    const token = generateToken({ id: user._id.toString() });

    // Fetch Roles of user
    var authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    // Send Success response
    res.header("x-auth-token", token).send({
      id: user._id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      roles: authorities,
      message: "تم الدخول بنجاح. الرجاء الإنتظار",
    });
  } catch (error) {
    res.status(500).json({ message: "هناك مشكلة في الإتصال بقاعدة البيانات!" });
  }
};
