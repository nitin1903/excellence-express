const {DataTypes} = require('sequelize')
const sequelize = require('../dbconnection')
const User = require('./user')

const Address = sequelize.define('Address', {
  id : {
    type : DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id : {
    type : DataTypes.INTEGER,
    references : {
      model : User,
        key : 'id'
    }
  },
  address : {
    type : DataTypes.STRING,
    allowNull: false
  },
  city : {
    type : DataTypes.STRING,
    allowNull: false
  },
  state : {
    type : DataTypes.STRING,
    allowNull: false
  },
  pin_code : {
    type : DataTypes.STRING,
    allowNull : false
  },
  phone_number : {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
    tableName: 'addresses',
    timestamps: false
})

Address.addAddress = async function(addressData, id){
  try{
    const result = await Address.create({
      address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      pin_code: addressData.pin_code,
      phone_number: addressData.phone_number,
      user_id: id
    })
    return result
  } catch (err){
    throw err
  }
}

Address.getByUserId = async function(id){
  try{
    let addresses = await this.findAll({
      where : {
        user_id : id
      }
    })
    addresses = JSON.stringify(addresses, null, 2)
    return addresses
  } catch(err){
    throw err
  }
}

module.exports = Address