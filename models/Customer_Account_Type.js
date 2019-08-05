const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const Customer_type = sequelize.define('customer_account_types',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customer_account_type:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    minimum_account_balance: {
        type: Sequelize.DOUBLE,
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
    edited_by: {
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

module.exports = Customer_type;