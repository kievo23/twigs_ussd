const Sequelize = require("sequelize");
const moment = require('moment');
const sequelize = require('../config/db');
const PERSON = require('./Person');
const CUSTOMER = require('./Customer');

const Delivery = sequelize.define('delivery_notification',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customer_stall_id :  {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    notification_identifier :  {
        type: Sequelize.STRING,
        allowNull: true,
    },
    receipt_number :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    delivery_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    route_team_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    customer_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    till_number: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.BOOLEAN,
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

Delivery.belongsTo(CUSTOMER, {foreignKey: 'customer_id'});

module.exports = Delivery;