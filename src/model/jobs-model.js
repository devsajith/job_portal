const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const tag = require("./tag-model");
const Company = require("./company-model");
const Salary=require("./salary-model");
const prefecture=require('./prefecture-model');
const employeeType=require('./employementType-model');
const subCategory=require('./subCategory-model');
const skill=require('./skill-model');
const Job = sequelize.define('job', {
    job_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'company_id',
        }
    },

    job_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary_id: {
        type: DataTypes.INTEGER
    },
    // prefecture_id: {
    //     type: DataTypes.INTEGER
    // },

    description: {
        type: DataTypes.STRING
    },
    employee_type_id: {
        type: DataTypes.INTEGER
    },

    holiday: {
        type: DataTypes.STRING
    },
    working_hours :{
        type: DataTypes.STRING
    },
    conditions: {
        type: DataTypes.STRING
    },
    benefits: {
        type: DataTypes.STRING
    },
    comments: {
        type: DataTypes.STRING
    },
    bullhorn_id: {
        type: DataTypes.STRING
    },
    bullhorn_updated_date: {
        type: DataTypes.DATE
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
    tableName: 'job',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});
Job.belongsToMany(tag, { through: 'tag_connection', foreignKey: 'job_id' });
tag.belongsToMany(Job, { through: 'tag_connection', foreignKey: 'tag_id' });
Job.belongsToMany(skill, { through: 'skill_details', foreignKey: 'job_id' })
skill.belongsToMany(Job, { through: 'skill_details', foreignKey: 'skill_id' })
Company.hasMany(Job,{foreignKey : 'company_id'});
Job.belongsTo(Company,{foreignKey : 'company_id'});
Salary.hasMany(Job,{foreignKey : 'salary_id'});
Job.belongsTo(Salary,{as:"salaryRange",foreignKey : 'salary_id'});
// prefecture.hasMany(Job,{foreignKey : 'prefecture_id'});
Job.belongsTo(employeeType,{foreignKey : 'employee_type_id'});
employeeType.hasMany(Job,{foreignKey : 'employee_type_id'});
// Job.belongsTo(prefecture,{foreignKey : 'prefecture_id'});
Job.belongsToMany(subCategory, { as:"jobSubCategory",through: 'job_category_detail', foreignKey: 'job_id',timestamps: false })
subCategory.belongsToMany(Job, { through: 'job_category_detail', foreignKey: 'job_sub_category_id' })
Job.belongsToMany(prefecture, { through: 'job_prefecture_details', foreignKey: 'job_id' });
prefecture.belongsToMany(Job, { through: 'job_prefecture_details', foreignKey: 'prefecture_id' });
module.exports = Job;