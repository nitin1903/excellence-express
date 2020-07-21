var express = require('express');
var router = express.Router();

const crypto = require('crypto')
const User = require('../models/user')

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

async function validateToken(req, res, next) {
  const token = req.get('authorization').split(' ')[1]
  console.log(`token ${token}`)
  if(token == null)
      return res.sendStatus(403)
  res.locals.accessToken = token
  try{
      let result = await User.findOne({_id: token})

      if(result == null){
          return res.sendStatus(403)
      }
      res.locals.result = result
      next()
  } catch(err) {
      console.log(err)
      return res.sendStatus(500)
  }
}


router.post('/register', validateData, async (req, res) => {
  const user = req.body
  const u = new User({
      user_name: user.user_name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: crypto.createHash('md5', user.password).digest('hex')
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
  const password = crypto.createHash('md5', req.body.password).digest('hex')
  console.log(`password: ${password}`)
  try{
      let result = await User.findOne({user_name})
      console.log(`login result ${result}`)
      if(result == null) {
          return res.sendStatus(500)
      }
      console.log(`result password: ${result.password}`)
      if(result.password == password) {
          res.status(200)
          return res.json({"access_token" : result._id})
          
      }
      return res.sendStatus(403)
  } catch(err) {
      console.log(err)
      return res.sendStatus(500)
  }
  
})

router.get('/get', validateToken, (req, res) => {
  res.status(200)
  res.json(res.locals.result)
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

module.exports = router;
