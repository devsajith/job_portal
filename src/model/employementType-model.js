const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const employementType = sequelize.define('employement_type', {
    employement_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    employement_type: {
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
}, {
    tableName: 'employement_type',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});


module.exports = employementType;