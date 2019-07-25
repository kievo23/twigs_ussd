const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const Ussd = sequelize.define('ussd_sessions',{
    PIN_DATA: {
        type: Sequelize.STRING,
        primaryKey: true,
        autoIncrement: true,
    },
    SALES_TEAM :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    USSD_SESSIONS: {
        type: Sequelize.TEXT,
        allowNull: true,
    }
  },{
    timestamps: true // timestamps will now be true
  }
);

module.exports = Ussd;