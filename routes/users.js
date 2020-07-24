var express = require('express');
const {validationResult} = require('express-validator')
const passport = require('passport')

const User = require('../models/user')
const Address = require('../models/address')
//const validate = require('../middleware/validate-data')
const generateToken = require('../utils/token-generator')
const verifyToken = require('../middleware/validate-jwt')

var router = express.Router();

router.post('/register', validate.userDataValidation, async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  const userData = req.body
  try{
    const user = await User.addUser(userData)
    res.status(200).json(user)
  } catch(err) {
    res.status(500).json({message: 'internal server error'})
  }
})

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async(err, user, info) => {
    if(err){
      return res.status(500).json({message: 'internal server error'})
    }
    if(!user){
      return res.status(401).json({message: 'invalid username or password'})
    }
    try{
      const token = await generateToken(user.id)
      return res.status(200).json({token})
    } catch(err) {
      return res.status(500).json({message: 'internal server error'})
    }
  })(req, res, next)
})

router.post('/address', verifyToken, validate.addressValidation, async (req, res) => {
  const addressData = req.body
  try{
    const result = await Address.addAddress(addressData, req.user.id)
    res.status(200).json(result)
  } catch (err){
    return res.status(500).json({error: "internal server error"})
  }
})

router.get('/get', verifyToken, async (req, res) => {
  const user = req.user
  try{
    const addresses = await Address.getByUserId(user.id)
    user.addresses = JSON.parse(addresses) || []
    return res.status(200).json(user)
  } catch(err){
    return res.status(500).json({error: "internal server error"})
  }
})

router.put('/delete', verifyToken, async (req, res) => {
  try{
    await User.delete(req.user.id)      
    return res.status(200).json({message: "user deleted"})
  } catch(err) {
    console.log(err)
    return res.status(500).json({error: "internal server error"})
  }
})

module.exports = router;
