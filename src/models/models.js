const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
  name: {type: DataTypes.STRING, allowNull: false,},
  email: {type: DataTypes.STRING, unique: true, allowNull: false,},
  password: {type: DataTypes.STRING, allowNull: false,},
  roel: {type: DataTypes.STRING, defaultValue: "USER",}
})

const Basket = sequelize.define('Basket', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
})

User.hasOne(Basket,{ foreignKey: 'userId' });
Basket.belongsTo(User, { foreignKey: 'userId' });



module.exports = {
  User,
  Basket
}