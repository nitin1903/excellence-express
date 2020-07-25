const User = require("../models/user");

const deleteUserController = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      await User.delete(req.user.id);
      return res.status(200).json({ message: "user deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "internal server error" });
    }
  }
  return res.status(401).json({ message: "unauthenticated" });
};

module.exports = deleteUserController;
