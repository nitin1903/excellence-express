const mongoose = require('mongoose')
const Schema = mongoose.Schema
const users = require('./user')
const addressSchema = new Schema({
    user_id : {type: mongoose.Types.ObjectId, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pin_code: {type: Number, required: true},
    phone_number: {type: Number, required: true}
})

module.exports = mongoose.model('address', addressSchema)