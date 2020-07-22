const mongoose = require('mongoose')
const Schema = mongoose.Schema
const users = require('./user')
const accessTokenSchema = Schema({
    user_id : {type: mongoose.Types.ObjectId, required: true, ref: users},
    access_token: {type: String, required: true, unique: true},
    expiry: {type: Date, required: true}
})

accessTokenSchema.statics.addToken = async function(token, userId) {
    const date = new Date()
    date.setHours(date.getHours() + 1)
    const Token = new AccessToken({
        user_id: userId,
        access_token: token,
        expiry: date
    })

    await Token.save()
}

AccessToken = module.exports = mongoose.model('access_token', accessTokenSchema)