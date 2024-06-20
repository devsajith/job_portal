const { DataTypes } = require('sequelize');
const sequelize = require('../db/db.config');

//create a sequelize model for 'CompanyPrefectureDetail'
const CompanyPrefectureDetail = sequelize.define(
    "company_prefecture_details", {
    company_prefecture_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    company_id: {
        type: DataTypes.INTEGER
    },
    prefecture_id: {
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
        tableName: "company_prefecture_details",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);

module.exports = CompanyPrefectureDetail;
