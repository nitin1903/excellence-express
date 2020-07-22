var express = require('express');
const crypto = require('crypto')
var router = express.Router();

const User = require('../models/user')
const AccessToken = require('../models/access-token')
const Address = require('../models/address')
const TokenValidator = require('../middlewares/token')


function generateToken() {
  const date = new Date
  return crypto.createHash('md5').update(date.getTime().toString()).digest('hex')
}

router.post('/register', async (req, res) => {
  const userData = req.body
  if(userData.password != userData.confPassword) {
    return res.status(400).send("password does not match")
  }
  try{
      let result = await User.addUser(userData)
      res.status(200)
      return res.json(result)
  } catch(err) {
      console.log(err)
      res.sendStatus(500)
  }

})

router.post('/login', async (req, res) => {
  try{
    const user = await User.getUser(req.body)
    if(user == null){
      return res.status(400).send('username or password are incoorect')
    }
    const token = generateToken()
    await AccessToken.addToken(token, user._id)
    res.status(200).json({token})
  } catch(err){
    console.log(err)
    res.sendStatus(500)
  }
})

router.post('/address', TokenValidator, async (req, res) => {
  try{
    const result = await Address.addAddress(res.locals.result.user_id, req.body)
    await User.addAddress(result.user_id, result._id)
    res.sendStatus(200)
  } catch (err){
    console.log(err)
    res.sendStatus(500)
  }
})

router.get('/get', TokenValidator, async (req, res) => {
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

module.exports = router;
