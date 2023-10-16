var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "Fullstack-login";

app.use(cors());

const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "194.233.80.188",
  user: "poll",
  password:"poll1234",
  database: "poll",
});
app.get("/getmap", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(De.Column1) AS sum, CHANGWAT_T AS province_name,AMPHOE_T AS amphur_name ,Ta.LAT AS lat , Ta.LONG AS lng FROM Dashboard_Employee De LEFT JOIN (select * from TAMBON group by AM_ID) Ta ON Ta.AM_ID = De.`16/10/2566 04:00` WHERE De.`16/10/2566 04:00` IS NOT NULL GROUP BY De.`16/10/2566 04:00`;",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getallemployee", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) AS sum,DATE_FORMAT(Dashboard_Employee._1,'%d' '%m' '%y') AS date  FROM	Dashboard_Employee GROUP BY CAST(_1 AS DATE);",

    function (err, results) {
      res.json(results);
    }
  );
});
//นับจำนวนเคสทั้งหมด
app.get("/getallemployer", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) AS sum,DATE_FORMAT(Dashboard_Employer.f3,'%d' '%m' '%y') AS date  FROM	Dashboard_Employer GROUP BY CAST(f3 AS DATE);",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getsumemployee", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) AS sum  FROM	Dashboard_Employee ",

    function (err, results) {
      res.json(results);
    }
  );
});
//นับจำนวนเคสทั้งหมด
app.get("/getsumemployer", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) AS sum FROM	Dashboard_Employer ",

    function (err, results) {
      res.json(results);
    }
  );
});


app.listen(3030, function () {
  console.log("CORS-enabled web server listening on port 3030");
});
