const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');

const bullhornToken = sequelize.define('bullhorn_token', {
    token_id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true
    },
    token:{
        type: DataTypes.STRING
    }
},{
    tableName: 'bullhorn_token',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});

module.exports = bullhornToken;