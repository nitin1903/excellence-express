var express = require('express');
const crypto = require('crypto')
const jwtValidate = require('express-jwt')

const secret = require('../config').secret
const User = require('../models/user')
const Address = require('../models/address')
const generateToken = require('../utils/token-generator')

var router = express.Router();

router.use(jwtValidate({secret, algorithms: ['HS256']}))
router.use((err, req, res, next) => {
  if(req.path === '/login' || req.path === '/register'){
    return next()
  }
  if(err.name === 'UnauthorizedError'){
    return res.status(401).send('invalid token..')
  }
})

router.post('/register', async (req, res) => {
  if(req.user){
    return res.status(200).json({message: "you are logged in.."})
  }
  const userData = req.body
  if(userData.password != userData.confPassword) {
    return res.status(400).json({message: "password does not match"})
  }
  try{
      let result = await User.addUser(userData)
      return res.status(200).json(result)
  } catch(err) {
      return res.status(500).json({error: "internal server error"})
  }
})

router.post('/login', async (req, res) => {
  if(req.user){
    return res.status(200).json({message: "you are logged in.."})
  }
  try{
    const user = await User.getUser(req.body)
    if(user == null){
      return res.status(400).json({message: 'invalid username and password'})
    }
    const token = await generateToken(user._id)
    res.status(200).json({token})
  } catch(err){
    return res.status(500).json({error: "internal server error"})
  }
})

router.post('/address', async (req, res) => {
  try{
    const result = await Address.addAddress(req.user.user_id, req.body)
    await User.addAddress(result.user_id, result._id)
    res.status(200).json(result)
  } catch (err){
    return res.status(500).json({error: "internal server error"})
  }
})

router.get('/get', async (req, res) => {
  try{
    const result = await User.findById(req.user.user_id).populate('addresses')
    return res.status(200).json(result)
  } catch(err){
    return res.status(500).json({error: "internal server error"})
  }
})


router.put('/delete', async (req, res) => {
  try{
    let result = await User.deleteOne({_id: req.juser.user_id})      
    return res.status(200).json({message: "user deleted"})
  } catch(err) {
    return res.status(500).json({error: "internal server error"})
  }
})

module.exports = router;
