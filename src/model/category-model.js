const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const Category = sequelize.define('category', {
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
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
}, {
    tableName: 'job_category',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});


module.exports = Category;