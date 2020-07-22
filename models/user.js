const mongoose = require('mongoose')
const Schema = mongoose.Schema
const address = require('./address')
const userSchema = new Schema({
    user_name: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    addresses: [{type: mongoose.Types.ObjectId, ref: address}]
})

module.exports = mongoose.model('Users', userSchema)