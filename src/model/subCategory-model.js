const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const category=require('./category-model');
const subCategory = sequelize.define('job_sub_category', {
    job_sub_category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    category_id: {
        type: DataTypes.TINYINT
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
    tableName: 'job_sub_category',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});
category.hasMany(subCategory,{foreignKey : 'category_id'});
subCategory.belongsTo(category,{foreignKey : 'category_id'});
module.exports = subCategory;