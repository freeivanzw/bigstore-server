const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
  name: {type: DataTypes.STRING, allowNull: false,},
  email: {type: DataTypes.STRING, allowNull: false,},
  password: {type: DataTypes.STRING, allowNull: false,},
  roel: {type: DataTypes.STRING, defaultValue: "USER",}
})

module.exports = {
  User,
}