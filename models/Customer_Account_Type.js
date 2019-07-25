const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const Customer_type = sequelize.define('customer_account_type',{
    CUSTOMER_ACCOUNT_TYPE_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CUSTOMER_ACCOUNT_TYPE :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DESCRIPTION: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    MINIMUM_ACCOUNT_BALANCE: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    ACTIVE: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    DELETED: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    CREATED_BY: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    EDITED_BY: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    DELETED: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    DELETED_BY: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
  },{
    timestamps: true // timestamps will now be true
  }
);

module.exports = Customer_type;