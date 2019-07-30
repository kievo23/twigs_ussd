const Sequelize = require("sequelize");
const sequelize = require('../config/db');

const Person = sequelize.define('persons',{
    PERSON_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    SURNAME : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    FIRST_NAME :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    OTHER_NAMES: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    GENDER: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    DATE_OF_BIRTH: {
        type: Sequelize.DATE,
        allowNull: true,
    },

    ID_NUMBER : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    PRIMARY_MSISDN :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ALTERNATE_MSISDN: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    POSTAL_ADDRESS: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    PHYSICAL_LOCATION: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    GEO_COORDINATES: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ID_FRONT_IMAGE_URL: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ID_REAR_IMAGE_URL: {
        type: Sequelize.STRING,
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

//User.belongsTo(Company, {foreignKey: 'fk_company'});


module.exports = Person;