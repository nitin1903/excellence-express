const mongoose = require('mongoose')
const Schema = mongoose.Schema
const users = require('./user')
const accessTokenSchema = Schema({
    user_id : {type: mongoose.Types.ObjectId, required: true, ref: users},
    access_token: {type: String, required: true, unique: true},
    expiry: {type: Date, required: true}
})

module.exports = mongoose.model('access_token', accessTokenSchema)