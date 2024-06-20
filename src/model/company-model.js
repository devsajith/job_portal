const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");
const Industry = require("./industry.model");
const Prefecture = require("./prefecture-model");
const Company = sequelize.define(
  "Company",
  {
    company_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    industry_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    capital: {
      type: DataTypes.INTEGER,
    },
    prefecture_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    headquarters_location: {
      type: DataTypes.STRING,
    },
    business_content: {
      type: DataTypes.STRING,
    },
    company_url: {
      type: DataTypes.STRING,
    },
    company_logo: {
      type: DataTypes.STRING,
    },
    working_environment: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
    },
    bullhorn_id: {
      type: DataTypes.STRING,
    },
    catch_phrase: {
      type: DataTypes.STRING,
    },
    created_date: {
      type: DataTypes.DATE,
    },
    updated_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "company",
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

Company.belongsTo(Industry, { as: 'industry', foreignKey: 'industry_id' });
Industry.hasMany(Company, { as: 'industry', foreignKey: 'industry_id' });

Company.belongsToMany(Prefecture, { through: 'company_prefecture_details', foreignKey: 'company_id' });
Prefecture.belongsToMany(Company, { through: 'company_prefecture_details', foreignKey: 'prefecture_id' });
module.exports = Company;
