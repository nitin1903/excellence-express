const User = require("../models/user");
const { validationResult } = require("express-validator");

const registerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userData = req.body;
  try {
    const user = await User.addUser(userData);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = registerController;
