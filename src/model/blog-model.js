const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-config');


//create a sequelize model for Category
const Blog = sequelize.define('blog', {
    blog_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    blog_name: {
        type: DataTypes.STRING
    },
    thumbnail: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    date_of_blog:{
        type: DataTypes.DATE
    },
    URL:{
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
    tableName: 'blog',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
});


module.exports = Blog;