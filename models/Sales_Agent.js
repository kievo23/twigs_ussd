const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const Sales_Agent = sequelize.define('sales_agent',{
    AGENT_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    AGENT_MSISDN: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    PIN :  {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    SALT_KEY: {
        type: Sequelize.TEXT,
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
    ACTIVE: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    DELETED: {
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
    DELETED_BY: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
  },{
    timestamps: true // timestamps will now be true
  }
);

Sales_Agent.belongsTo(PERSON, {foreignKey: 'person_id'});

module.exports = Sales_Agent;