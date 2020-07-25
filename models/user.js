const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const sequelize = require("../dbconnection");
const Address = require("./address");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

User.addHook("beforeCreate", (user, options) => {
  user.password = crypto.createHash("md5").update(user.password).digest("hex");
});

User.addUser = async function (userData) {
  try {
    const user = await this.create({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_name: userData.user_name,
      password: userData.password,
    });
    return user;
  } catch (err) {
    throw err;
  }
};

User.getUserById = async function (user_id) {
  try {
    let result = await this.findOne({
      where: {
        id: user_id,
      },
    });
    if (!result) {
      return null;
    }
    result = result.dataValues;
    return result;
  } catch (err) {
    throw err;
  }
};

User.getUser = async function (credential) {
  try {
    let result = await this.findOne({
      where: {
        user_name: credential.user_name,
      },
    });
    if (!result) {
      return null;
    }
    result = result.dataValues;
    const password = crypto
      .createHash("md5")
      .update(credential.password)
      .digest("hex");
    if (result.password == password) {
      return result;
    }
    return null;
  } catch (err) {
    throw err;
  }
};

User.delete = async function (user_id) {
  try {
    const result = await sequelize.transaction(async (t) => {
      await Address.destroy(
        {
          where: {
            user_id: user_id,
          },
        },
        { transaction: t }
      );

      await this.destroy(
        {
          where: {
            id: user_id,
          },
        },
        { transaction: t }
      );
    });
  } catch (err) {
    throw err;
  }
};

module.exports = User;
