const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const Company = require("./company-model");
const popularCompany = sequelize.define('popular_company', {
    popular_company_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'company',
            key: 'company_id'
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
    tableName: 'popular_company',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});

Company.hasMany(popularCompany,{foreignKey : 'company_id'});
popularCompany.belongsTo(Company,{foreignKey : 'company_id'});

module.exports = popularCompany;