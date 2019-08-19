const Sequelize = require("sequelize");
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
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    receipt_number :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    delivery_id: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    delivery_date: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    route_team_id: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    customer_id: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    till_number: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    phone: {
        type: Sequelize.DOUBLE,
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

module.exports = Delivery;