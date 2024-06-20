const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const SalaryCondition = sequelize.define('salary_condition', {
    salary_condition_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    salary: {
        type: DataTypes.INTEGER
    },
    salary_string: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.TINYINT
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'salary_condition',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});


module.exports = SalaryCondition;