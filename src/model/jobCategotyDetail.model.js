const { DataTypes } = require('sequelize');
const sequelize = require('../db/db.config');

//create a sequelize model for 'Industry'
const JobCategoryDetail = sequelize.define(
    "job_category_detail", {
        job_category_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    job_id: {
        type: DataTypes.INTEGER
    },
    job_sub_category_id: {
        type: DataTypes.INTEGER
    },
    created_date: {
        type: DataTypes.DATE
    }
},
    {
        tableName: "job_category_detail",
        createdAt: "created_date",
        updatedAt: false,
    }
);
module.exports =JobCategoryDetail ;
