const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const Salary = sequelize.define('salary_range', {
    salary_range_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    min_salary: {
        type: DataTypes.INTEGER
    },
    max_salary: {
        type: DataTypes.INTEGER
    },

    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'salary_range',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});


module.exports = Salary