const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const CareerCounselling = require("./careerCounselling-model");
const User = require("./user-model");

const careerCounsellingApplication = sequelize.define('career_counselling_application', {
    career_counselling_application_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    career_counselling_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CareerCounselling,
            key: 'career_counselling_id',
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        }
    },
    status: {
        type: DataTypes.TINYINT
    },
    bullhorn_id: {
        type: DataTypes.STRING
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'career_counselling_application',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});

module.exports = careerCounsellingApplication;