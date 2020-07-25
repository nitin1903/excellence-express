var express = require('express');
const {validationResult} = require('express-validator')
const passport = require('passport')

const User = require('../models/user')
const Address = require('../models/address')
const validate = require('../middleware/validate-data')

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

router.post('/login',passport.authenticate('local'), async (req, res) => {
  return res.json(req.user)
})

router.post('/address', validate.addressValidation, async (req, res) => {
  if(req.isAuthenticated())
  {
    const addressData = req.body
    try{
      const result = await Address.addAddress(addressData, req.user.id)
      return res.status(200).json(result)
    } catch (err){
    return res.status(500).json({error: "internal server error"})
    }
  }
  return res.status(401).json({message: 'unauthenticated'})
})

router.get('/get', async (req, res) => {
  if(req.isAuthenticated())
  {
    const user = req.user
    try{
      const addresses = await Address.getByUserId(user.id)
      user.addresses = JSON.parse(addresses) || []
      return res.status(200).json(user)
    } catch(err){
      console.log('in catch of get \n\n')
      return res.status(500).json({error: "internal server error"})
    }
  }
  return res.status(401).json({message: 'unauthenticated'})
})

router.put('/delete', async (req, res) => {
  if(req.isAuthenticated()){
    try{
      await User.delete(req.user.id)      
      return res.status(200).json({message: "user deleted"})
    } catch(err) {
      console.log(err)
      return res.status(500).json({error: "internal server error"})
    }
  }
  return res.status(401).json({message: 'unauthenticated'})
})

module.exports = router;
