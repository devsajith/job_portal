const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const highLevelLocation=require('./highLevelLocation-model')
//create a sequelize model for 'prefecture'
const prefecture = sequelize.define(
    "prefecture", {
    prefecture_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    prefecture_name: {
        type: DataTypes.STRING
    },
    high_level_location_id:{
        type: DataTypes.INTEGER,
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
        tableName: "prefecture",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
highLevelLocation.hasMany(prefecture,{foreignKey : 'high_level_location_id'});
prefecture.belongsTo(highLevelLocation,{foreignKey : 'high_level_location_id'});
module.exports = prefecture ;
