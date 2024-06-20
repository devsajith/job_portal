const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

//create a sequelize model for 'tag'
const tag = sequelize.define(
    "tag", {
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    tag_name: {
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
        tableName: "tag",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
module.exports = tag ;