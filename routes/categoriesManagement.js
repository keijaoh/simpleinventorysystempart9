var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var crypto = require("crypto-js");
var Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
var credentials = require("../credentials");

//initialize sequelize to connect to the database

var databaseConnection = new Sequelize(
  credentials.databaseName,
  credentials.userName,
  credentials.password,
  {
    dialect: "mssql",
    host: credentials.hostName,
    port: 1433, // DB default Port
    logging: false,
    dialectOptions: {
      requestTimeout: 30000, // time out is 30 seconds
    },
  }
);

//to export the class
module.exports = router;
