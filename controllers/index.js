const registerController = require("./register");
const addressController = require("./add-address");
const getUserController = require("./get-user");
const deleteUserController = require("./delete-user");

module.exports = {
  registerController,
  addressController,
  getUserController,
  deleteUserController,
};
