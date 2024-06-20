const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');


//create a sequelize model for 'Industry'
const SkillDetail = sequelize.define(
    "skill_details", {
        skill_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    job_id: {
        type: DataTypes.INTEGER
    },
    skill_id: {
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
        tableName: "skill_details",
        createdAt: "created_date",
        updatedAt: "updated_date",
    }
);
module.exports =SkillDetail ;
