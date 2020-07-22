var express = require('express');
var router = express.Router();

const crypto = require('crypto')
const User = require('../models/user')
const AccessToken = require('../models/access-token')
const Address = require('../models/address')

async function validateData(req, res, next){
  const user = req.body
  const a = await isUniqueUserName(user.user_name)
  const b = await isEmailUnique(user.email)
  const c = await passworMatch(user.password, user.confPassword)
  if(!a || !b || !c) {
       return res.sendStatus(400)
  }
  
  next()
}

async function isUniqueUserName(user_name) {
  let result = await User.findOne({user_name})
  if(result == null) {
      return true
  }
  console.log("username not unique")
  return false
  //return (result == null)
}

async function isEmailUnique(email) {
  let result = await User.findOne({email})
  if(result == null) {
      return true
  }
  console.log("email not unique")
  return false
 // return (result == null)
}

function passworMatch(password, confPassword) {
  if(password == confPassword){
      return true
  }
  console.log("password does not match")
  return false
  //return password === confPasword
}

// end of validateData middleware

function validateAddress(req, res, next) {
  if(req.body.pin_code.length > 6){
    return res.sendStatus(401)
  }
  req.body.pin_code = Number(req.body.pin_code)

  if(req.body.phone_number.length > 10) {
    return res.sendStatus(401)
  }
  req.body.phone_number.length = Number(req.body.phone_number.length)
  next()
}

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

function generateToken() {
  const d = new Date
  return crypto.createHash('md5').update(d.getTime().toString()).digest('hex')
}

async function saveToken(token, id) {
  const d = new Date()
  d.setHours(d.getHours() + 1)
  const accessToken = new AccessToken({
    user_id : id,
    access_token : token,
    expiry : d
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
  const user = req.body
  const u = new User({
      user_name: user.user_name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: crypto.createHash('md5').update(user.password).digest('hex')
  })
  try{
      let result = await u.save()
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
  console.log(`password: ${password}`)
  try{
      let result = await User.findOne({user_name})
      console.log(`login result ${result}`)
      if(result == null) {
          return res.sendStatus(500)
      }
      console.log(`result password: ${result.password}`)
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
  } catch(err){}
  return res.sendStatus(500)
})

router.put('/delete', validateToken, async (req, res) => {
  try{
      let result = await User.deleteOne({_id: res.locals.accessToken})
      console.log(`delete result ${result}`)
      return res.sendStatus(200)
  } catch(err) {
      console.log(err)
      return res.sendStatus(500)
  }
})

router.post('/address', validateToken, validateAddress, async (req, res) => {
  const ad = new Address({
    user_id : res.locals.result.user_id,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pin_code: req.body.pin_code,
    phone_number: req.body.phone_number
  })

  try{
    let result = await ad.save()
    console.log(result)
    let result2 = await User.findOneAndUpdate({_id: result.user_id},
      {"$push": {addresses: result._id}})
    return res.sendStatus(200)
  } catch(err) {
    console.log(err)
    return res.sendStatus(500)
  }
})


module.exports = router;
