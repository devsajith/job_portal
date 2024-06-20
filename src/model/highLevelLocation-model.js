const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

//create a sequelize model for 'high_level_location'
const highLevelLocation = sequelize.define(
    "high_level_location", {
    high_level_location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    high_level_location_name: {
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
        tableName: "high_level_location",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
module.exports = highLevelLocation ;