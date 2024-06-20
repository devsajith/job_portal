const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

//create a sequelize model for 'skill'
const skill = sequelize.define(
    "skill", {
    skill_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    skill_title: {
        type: DataTypes.STRING
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
},
    {
        tableName: "skill",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
module.exports = skill ;