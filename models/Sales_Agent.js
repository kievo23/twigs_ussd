const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const Sales_Agent = sequelize.define('sales_agents',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    agent_msisdn: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pin :  {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    salt_key: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    password :  {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    pin_reset: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    last_pin_change: {
        type: Sequelize.DATE,
        allowNull: true, 
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    deleted_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' }
  },{
    timestamps: true, // timestamps will now be true
    underscored: true
  }
);

Sales_Agent.belongsTo(PERSON, {foreignKey: 'person_id'});

module.exports = Sales_Agent;