const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user')
const addressSchema = new Schema({
    user_id : {type: mongoose.Types.ObjectId, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pin_code: {type: String, required: true},
    phone_number: {type: String, required: true}
})

addressSchema.statics.addAddress = async function(userId, addressData){
    address = new Address({
        user_id: userId,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        pin_code: addressData.pin_code,
        phone_number: addressData.phone_number
    })
    const result = await address.save()
    return result
    
}

const Address = module.exports = mongoose.model('address', addressSchema)

async function pinCodeValidation(value) {
    return /\d{6}/.test(value)
}

async function phoneNumberValidation(value) {
    return /\d{10}/.test(value)
}

addressSchema.path('pin_code').validate(pinCodeValidation, '{VALUE} is not valid pin code')
addressSchema.path('phone_number').validate(phoneNumberValidation, '{VALUE} is not a valid phone number')

