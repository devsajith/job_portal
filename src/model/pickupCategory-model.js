const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const SubCategory = require("./subCategory-model");
const  pickupCategory = sequelize.define('pickup_category', {
    pickup_category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,

    },
    sub_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'category_id'
        }
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
    tableName: 'pickup_category',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});
SubCategory.hasMany(pickupCategory,{foreignKey : 'sub_category_id'});
pickupCategory.belongsTo(SubCategory,{as:"subCategory",foreignKey : 'sub_category_id'});

module.exports = pickupCategory;