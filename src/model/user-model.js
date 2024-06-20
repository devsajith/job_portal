const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    middle_name: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    last_name: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tel_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING
    },
    prefecture: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    apartment_name: {
        type: DataTypes.STRING
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true
    },
    desired_occupation: {
        type: DataTypes.STRING
    },
    resume: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT
    },
    bullhorn_id: {
        type: DataTypes.STRING
    },
    source_type: {
        type: DataTypes.TINYINT
    },
    bullhorn_updated_date: {
        type: DataTypes.DATE
    },
    password: {
        type: DataTypes.STRING
    },
    last_login_date: {
        type: DataTypes.DATE
    },
    password_change_date: {
        type: DataTypes.DATE
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
},
    {
        tableName: 'user',
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    });
module.exports = User;