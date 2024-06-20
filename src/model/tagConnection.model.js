const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

//create a sequelize model for 'Industry'
const TagConnection = sequelize.define(
    "tag_connection", {
        tag_connection_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    job_id: {
        type: DataTypes.INTEGER
    },
    tag_id: {
        type: DataTypes.INTEGER
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
},
    {
        tableName: "tag_connection",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
module.exports =TagConnection ;
