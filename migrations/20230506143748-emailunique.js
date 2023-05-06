'use strict';

const {DataTypes} = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('User', 'email', {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('User', 'email', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  }
};
