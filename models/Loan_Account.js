const Sequelize = require("sequelize");
const moment = require('moment');
const sequelize = require('../config/db');
const PERSON = require('./Person');
const CUSTOMER = require('./Customer');
const Delivery = require('./Delivery_Notification');

const Loan_Account = sequelize.define('loan_account',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    loan_product_id :  {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    customer_account_id :  {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    delivery_id :  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    principal_amount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    trn_charge: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    interest_charged: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    loan_amount: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    loan_balance: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    loan_penalty: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    loan_status: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    twiga_response: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    deleted: {
        type: Sequelize.INTEGER,
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
        allowNull: true
    },
    date_deleted: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    createdAt: { 
        type: Sequelize.DATE, 
        field: 'created_at',
        get() {
            return moment(this.getDataValue('createdAt')).format('Do MMM YYYY hh:mm A');
        }
    },
    updatedAt: { 
        type: Sequelize.DATE, 
        field: 'updated_at',
        get() {
            return moment(this.getDataValue('updatedAt')).format('Do MMM YYYY hh:mm A');
        }
    }
  },{
    timestamps: true, // timestamps will now be true
    underscored: true,
    freezeTableName: true
  }
);

Loan_Account.belongsTo(CUSTOMER, {foreignKey: 'customer_account_id'});
Loan_Account.belongsTo(Delivery, {foreignKey: 'delivery_id'});

module.exports = Loan_Account;