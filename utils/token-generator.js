const jwt = require('jsonwebtoken')
const secret = require('../config').secret

async function generateToken(user_id) {
  return new Promise((resolve, reject) => {
    try{
      const token = jwt.sign({user_id}, secret, {expiresIn: "1h"})
      resolve(token)
    } catch(err) {
      reject(err)
    }
  })
}

module.exports = generateToken