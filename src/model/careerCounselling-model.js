const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

const careerCounselling = sequelize.define('career_counselling', {
    career_counselling_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true
    },
    job_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    job_description: {
        type: DataTypes.STRING
    },
    company_name: {
        type: DataTypes.STRING
    },
    company_description: {
        type: DataTypes.STRING
    },
    company_bullhorn_id: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.TINYINT
    },
    job_bullhorn_id: {
        type: DataTypes.STRING
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'career_counselling',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});

module.exports = careerCounselling;