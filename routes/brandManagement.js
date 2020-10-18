var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var crypto = require("crypto-js");
var Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
var credentials = require("../credentials");
const { response } = require("express");
//to capture the json body
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());
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
//defining the model
var Brand = databaseConnection.define(
  "Brand",
  {
    brandId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    brandName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    isDeleted: Sequelize.BOOLEAN,
  },
  {
    timestamps: false,
    freezeTableName: true, //so Sequelize doesnt pluralize the table name
  }
);

//create new brand
router.post("/create_new_brand", (request, response) => {
  //set headers
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log(request.body);
  Brand.create(request.body).then((brand) => {
    response.json(brand);
  });
});

//fetch all the brands
router.get("/fetch_all_brands", function (request, response) {
  //set headers
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    Brand.findAll({ where: { isDeleted: false } }).then(function (brands) {
      response.json(brands);
    });
  } catch (ex) {
    response.json(ex);
  }
});

//fetch specific brand by id
router.get("/fetch_brand_by_id/:brandId", async function (request, response) {
  //set headers
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const brandId = request.params.brandId;
    console.log(brandId);
    const brandResult = await Brand.findOne({
      where: { brandId: brandId, isDeleted: false },
    });
    console.log(brandResult);
    //check if result found
    if (brandResult === null) {
      response.json("No Brand Found");
    } else {
      response.json(brandResult);
    }
  } catch (ex) {
    response.json(ex);
  }
});
//update
router.put("/update_target_brand", function (request, response) {
  //set headers
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const brandId = request.body.brandId;

    Brand.update(
      {
        //fields to update
        brandName: request.body.brandName,
      },
      {
        //where clause
        where: {
          brandId: brandId,
        },
      }
    ).then(function (count) {
      response.json("Rows updated " + count);
    });
  } catch (ex) {
    response.json(ex);
  }
});

//TODO delete: can use the paranoid method but we dont have a deletion timestamp column
//so we will just set the isDeleted to false

//test connection
router.get("/testconnection", function (request, response) {
  //set headers
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.send("Brand Management Test");
});

//to export the class
module.exports = router;
