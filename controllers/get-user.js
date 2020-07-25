const Address = require("../models/address");

const getUserController = async (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    try {
      const addresses = await Address.getByUserId(user.id);
      user.addresses = JSON.parse(addresses) || [];
      return res.status(200).json(user);
    } catch (err) {
      console.log("in catch of get \n\n");
      return res.status(500).json({ error: "internal server error" });
    }
  }
  return res.status(401).json({ message: "unauthenticated" });
};

module.exports = getUserController;
