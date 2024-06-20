const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const Job = require("./jobs-model");

const JobApplication = sequelize.define('job_application', {
    job_application_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job,
            key: 'job_id'
        },
    },
    status: {
        type: DataTypes.TINYINT
    },
    bullhorn_id: {
        type: DataTypes.STRING
    },
    bullhorn_updated_date: {
        type: DataTypes.DATE
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'job_application',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});

Job.hasMany(JobApplication, {
    as: 'job',
    foreignKey: 'job_id',
});


module.exports = JobApplication;