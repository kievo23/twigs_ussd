const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');
const CUSTOMER = require('./Customer');

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
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' }
  },{
    timestamps: true, // timestamps will now be true
    underscored: true,
    freezeTableName: true
  }
);

//Delivery.belongsTo(CUSTOMER, {foreignKey: 'person_id'});

module.exports = Loan_Account;