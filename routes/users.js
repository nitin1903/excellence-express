var express = require('express');
var router = express.Router();

const crypto = require('crypto')
const User = require('../models/user')
const AccessToken = require('../models/access-token')
const Address = require('../models/address')

//user data validators

async function validateData(req, res, next){
  const user = req.body
  const uniqueUser = await isUniqueUserName(user.user_name)
  const uniqueEmail = await isEmailUnique(user.email)
  const passwordMatch = await isPassworMatch(user.password, user.confPassword)
  if(!uniqueUser || !uniqueEmail || !passworMatch) {
       return res.sendStatus(400)
  }
  
  next()
}

async function isUniqueUserName(user_name) {
  let result = await User.findOne({user_name})
  
  return (result == null)
}

async function isEmailUnique(email) {
  let result = await User.findOne({email})
  
  return (result == null)
}

function isPassworMatch(password, confPassword) {  
  return password === confPasword
}

//Address Validation
function validateAddress(req, res, next) {
  const pin_code = req.body.pin_code.length
  const phone_number = req.body.phone_number.length

  if(pin_code.length != 6 || phone_number.length != 10){
    return res.sendStatus(400)
  }

  req.body.pin_code = Number(pin_code)
  req.body.phone_number.length = Number(phone_number)
  next()
}

//Token Validation
async function validateToken(req, res, next) {
  const token = req.get('authorization').split(' ')[1]
  console.log(`token ${token}`)
  if(token == null)
      return res.sendStatus(403)
  res.locals.accessToken = token
  try{
      let result = await AccessToken.findOne({access_token: token})

      if(result == null){
          return res.sendStatus(403)
      }
      const d = new Date()
      if(d > result.expiry) {
        return res.status(403).send("token expired")
      }
      res.locals.result = result
      next()
  } catch(err) {
      console.log(err)
      return res.sendStatus(500)
  }
}

//token generation
function generateToken() {
  const date = new Date
  return crypto.createHash('md5').update(date.getTime().toString()).digest('hex')
}

async function saveToken(token, id) {
  const date = new Date()
  date.setHours(date.getHours() + 1)
  const accessToken = new AccessToken({
    user_id : id,
    access_token : token,
    expiry : date
  })

  try{
    let result = await accessToken.save()
    console.log(result)
  } catch(err) {
    console.log(err)
    throw err
  }
}

router.post('/register', validateData, async (req, res) => {
  const userData = req.body
  const user = new User({
      user_name: userData.user_name,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: crypto.createHash('md5').update(userData.password).digest('hex')
  })
  try{
      let result = await user.save()
      console.log(result)
      res.status(200)
      return res.json(result)
  } catch(err) {
      console.log(err)
      res.sendStatus(500)
  }

})

router.post('/login', async (req, res) => {
  const user_name = req.body.user_name
  const password = crypto.createHash('md5').update(req.body.password).digest('hex')
  
  try{
      let result = await User.findOne({user_name})
      
      if(result == null) {
          return res.sendStatus(500)
      }
      
      if(result.password == password) {
          const token = generateToken()
          console.log(`token is: $token`)
          saveToken(token, result._id)
          res.status(200)
          return res.json({"access_token" : token})
          
      }

      return res.sendStatus(403)
    } catch(err) {
      console.log(err)
      return res.sendStatus(500)
  }
  
})

router.get('/get', validateToken, async (req, res) => {
  try{
    const result = await User.findById(res.locals.result.user_id).populate('addresses')

    res.status(200)
    return res.json(result)
  } catch(err){
    return res.sendStatus(500)
  }
})

router.put('/delete', validateToken, async (req, res) => {
  try{
      let result = await User.deleteOne({_id: res.locals.result.user_id})
      
      return res.sendStatus(200)
  } catch(err) {
      return res.sendStatus(500)
  }
})

router.post('/address', validateToken, validateAddress, async (req, res) => {
  const address = new Address({
    user_id : res.locals.result.user_id,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pin_code: req.body.pin_code,
    phone_number: req.body.phone_number
  })

  try{
    let result = await address.save()
    let result2 = await User.findOneAndUpdate({_id: result.user_id},
      {"$push": {addresses: result._id}})
    return res.sendStatus(200)
  } catch(err) {
    console.log(err)
    return res.sendStatus(500)
  }
})


module.exports = router;
