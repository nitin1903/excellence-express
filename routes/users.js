var express = require('express');
const passport = require('passport')

const validate = require('../middleware/validate-data')
const controllers = require('../controllers')

var router = express.Router();

router.post('/register', validate.userDataValidation, controllers.registerController)

router.post('/login',passport.authenticate('local'), async (req, res) => {
  return res.status(200).json(req.user)
})

router.post('/address', validate.addressValidation, controllers.addressController)

router.get('/get', controllers.getUserController)

router.put('/delete', controllers.deleteUserController)

module.exports = router;
