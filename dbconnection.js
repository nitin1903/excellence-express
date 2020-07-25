const { Sequelize } = require("sequelize");
const { dbConfig } = require("./config");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mariadb",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("connected successfully");
  } catch (error) {
    console.error("unable to connect");
  }
})();

module.exports = sequelize;
