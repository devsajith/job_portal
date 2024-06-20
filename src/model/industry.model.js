const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

//create a sequelize model for 'Industry'
const Industry = sequelize.define(
    "Industry", {
    industry_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
},
    {
        tableName: "industry",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
module.exports =Industry ;
