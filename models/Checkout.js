const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');
const CUSTOMER = require('./Customer');

const Checkout = sequelize.define('online_checkout',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    transaction_identifier :  {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    msisdn :  {
        type: Sequelize.STRING,
        allowNull: true,
    },
    paybill :  {
        type: Sequelize.STRING,
        allowNull: true,
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    payer_number: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    transaction_time: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    merchant_request_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    checkout_request_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    response_description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    response_code: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    customer_message: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    result_body: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    stk_callback: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    result_code: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    result_description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    callback_metadata: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    item: {
        type: Sequelize.TEXT,
        allowNull: true,
    },


    mpesa_receipt_number: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    pay_bill_balance: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    mpesa_transaction_date: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    error_code: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    error_message: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    processing_code: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    core_response_code: {
        type: Sequelize.STRING,
        allowNull: true
    },
    core_response_message: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' }
  },{
    timestamps: true, // timestamps will now be true
    underscored: true,
    freezeTableName: true
  }
);

//Delivery.belongsTo(CUSTOMER, {foreignKey: 'person_id'});

module.exports = Checkout;