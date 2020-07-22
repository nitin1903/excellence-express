const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema
const address = require('./address')

const userSchema = new Schema({
    user_name: {type: String, required: true, unique: true,
    },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    addresses: [{type: mongoose.Types.ObjectId, ref: address}]
})

userSchema.statics.addAddress = async function(userId, addressId) {
    await Users.findOneAndUpdate({_id: userId}, {"$push": {addresses: addressId}})
}

userSchema.statics.addUser = async function(userData) {
    userData.password = crypto.createHash('md5').update(userData.password).digest('hex')
    const result = await Users.create(userData)
    return result
}

userSchema.statics.getUser = async function(userData) {
    const result = await Users.findOne({user_name: userData.user_name})
    
    if(result == null)
        return null

    let password = crypto.createHash('md5').update(userData.password).digest('hex')
    if(result.password == password){
        return result
    }
    return null
}

const Users = module.exports = mongoose.model('Users', userSchema)

async function userNameValidator(value) {
    const result = await Users.findOne({user_name: value})
    return result == null
}

async function emailValidator(value) {
    const result = await Users.findOne({email: value})
    return result == null
}

userSchema.path('email').validate(emailValidator,
    'email `{VALUE}` is already registered')

userSchema.path('user_name').validate(userNameValidator, 
    'user name `{VALUE}` is already taken')
