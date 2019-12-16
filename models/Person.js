const Sequelize = require("sequelize");
const sequelize = require('../config/db');

const Person = sequelize.define('people',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    first_name :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    other_names: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    id_number : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    primary_msisdn :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    alternate_msisdn: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    postal_address: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    business_name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    route: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    geo_coordinates: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    id_front_image_url: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    id_rear_image_url: {
        type: Sequelize.STRING,
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

//User.belongsTo(Company, {foreignKey: 'fk_company'});


module.exports = Person;