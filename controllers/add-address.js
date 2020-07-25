const Address = require('../models/address')
const {validationResult} = require('express-validator')

const addressController = async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  if(req.isAuthenticated())
  {
    const addressData = req.body
    try{
      const result = await Address.addAddress(addressData, req.user.id)
      return res.status(200).json(result)
    } catch (err){
    return res.status(500).json({error: "internal server error"})
    }
  }
  return res.status(401).json({message: 'unauthenticated'})
}

module.exports = addressController