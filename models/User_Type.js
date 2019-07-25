const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const PERSON = require('./Person');

const User_type = sequelize.define('user_type',{
    USER_TYPE_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    USER_TYPE :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    USER_RIGHTS: {
        type: Sequelize.TEXT,
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

module.exports = User_type;