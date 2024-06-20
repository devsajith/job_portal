const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const Job=require('./jobs-model')
const hotJob = sequelize.define('hot_job', {
    hot_job_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'job',
            key: 'job_id'
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
    tableName: 'hot_job',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});

Job.hasMany(hotJob,{foreignKey : 'job_id'});
hotJob.belongsTo(Job,{foreignKey : 'job_id'});

module.exports = hotJob;