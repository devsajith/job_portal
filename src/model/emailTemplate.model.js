const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');
const EmailTemplate = sequelize.define('email_template', {
    email_template_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    email_template_type: {
        type: DataTypes.TINYINT
    },

    header: {
        type: DataTypes.STRING
    },
    body: {
        type: DataTypes.STRING
    },
    created_date: {
        type: DataTypes.DATE
    },
    updated_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'email_template',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});


module.exports = EmailTemplate;