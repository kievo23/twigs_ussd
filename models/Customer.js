const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const Customer = sequelize.define('customer',{
    CUSTOMER_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CUSTOMER_MSISDN :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    PIN: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    SALT_KEY: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    BLOCKED: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    PIN_RESET: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    LAST_PIN_CHANGE: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    ACCOUNT_LIMIT: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    PREVIOUS_ACCOUNT_BALANCE: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    AVAILABLE_ACCOUNT_BALANCE: {
        type: Sequelize.DOUBLE,
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

Customer.belongsTo(PERSON, {foreignKey: 'PERSON_ID'});

module.exports = Customer;