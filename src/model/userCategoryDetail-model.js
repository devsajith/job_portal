const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');


//create a sequelize model for 'Industry'
const UserCategoryDetail= sequelize.define(
    "user_category_detail", {
        user_category_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    category_id: {
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
        tableName: "user_category_detail",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
module.exports =UserCategoryDetail ;
