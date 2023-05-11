const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  name: {type: DataTypes.STRING, allowNull: false},
  email: {type: DataTypes.STRING, unique: true, allowNull: false},
  password: {type: DataTypes.STRING, allowNull: false},
  roel: {type: DataTypes.STRING, defaultValue: "USER"}
})

const Basket = sequelize.define('Basket', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
})

const Device = sequelize.define('Device', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  name: {type: DataTypes.STRING, allowNull: false, unique: true},
  price: {type: DataTypes.INTEGER, allowNull: false},
  rating: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
  image: {type: DataTypes.STRING, allowNull: true},
})

const Type = sequelize.define('Type', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  name: {type: DataTypes.STRING, allowNull: false, unique: true},
})

const Brand = sequelize.define('Brand', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  name: {type: DataTypes.STRING, allowNull: false, unique: true},
})



User.hasOne(Basket);
Basket.belongsTo(User);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);





module.exports = {
  User,
  Basket,
  Device,
  Type,
  Brand
}