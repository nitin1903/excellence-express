const jwt = require('jsonwebtoken')
const secret = require('../config').secret
const User = require('../models/user')

const validator = async function(req, res, next) {
    const token = req.get('Authorization').split(' ')[1]
    if(!token){
        return res.status(401).json({message: 'no token provided'})
    }
    try{
        const decoded = await jwt.verify(token, secret)
        req.user = decoded
        const user = await User.findById(decoded.user_id)
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        return next()
    } catch(err){
        if(err.name == "JsonWebTokenError"){
            return res.status(401).json({message: err.message})
        }
        return res.status(500).json(err)
    }
}

module.exports = validator