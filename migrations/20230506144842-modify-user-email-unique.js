'use strict';
const {DataTypes} = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'email', {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'email', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  }
};
