const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const Customer = sequelize.define('customers',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    person_id :  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    customer_type_id :  {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    agent_id :  {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    customer_account_msisdn :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pin: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    salt_key: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    account_limit: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    previous_account_balance: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    actual_account_balance: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    available_account_balance: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    minimum_account_balance: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    twiga_response: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    account_limit: {
        type: Sequelize.DOUBLE,
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
    deleted: {
        type: Sequelize.BOOLEAN,
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

Customer.belongsTo(PERSON, {foreignKey: 'person_id'});

module.exports = Customer;