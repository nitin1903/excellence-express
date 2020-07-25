const { check } = require("express-validator");

function validateuserData() {
  const emailValidation = check("email").isEmail();
  const userNameValiadtion = check("user_name").notEmpty();
  const firstNameValidation = check("first_name").notEmpty();
  const lastNameValidation = check("last_name").notEmpty();
  const passwordValidation = check("password").isLength({ min: 5 });
  const confPasswordValidation = check("confPassword").custom(
    (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }
  );

  return [
    emailValidation,
    userNameValiadtion,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    confPasswordValidation,
  ];
}

function validateAdderssData() {
  const addressValidation = check("address").notEmpty();
  const cityValidation = check("address").notEmpty();
  const stateValidation = check("address").notEmpty();
  const pinCodeValidation = check("pin_code").notEmpty();
  const phoneNumberValidation = check("phone_number").notEmpty();

  return [
    addressValidation,
    cityValidation,
    stateValidation,
    pinCodeValidation,
    phoneNumberValidation,
  ];
}

module.exports.userDataValidation = validateuserData();
module.exports.addressValidation = validateAdderssData();
