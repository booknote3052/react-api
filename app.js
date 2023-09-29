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

app.get("/getjob", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT *  FROM  callcenter_job",

    function (err, results) {
      res.json(results);
    }
  );
});
//นับจำนวนเคสทั้งหมด
app.get("/getallcase", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) as sum FROM  callcenter_job",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getmap", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT  TAMBON.LAT AS lat , TAMBON.LONG AS lng FROM View_forDashboard JOIN TAMBON ON View_forDashboard.tambon_id =TAMBON.TA_ID GROUP BY View_forDashboard.tambon_name",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/gettableallcase", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT province_name AS Province,COUNT(*) AS allcase, SUM(IF(status = 'DONE',1,0)) AS casedone  ,SUM(IF(t1.status IS NULL,1,0)) AS casenull  , ((SUM(IF(status = 'DONE',1,0)) /COUNT(*))*100) AS percent FROM View_forDashboard AS t1 GROUP BY province_name",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getcaseclose", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) as sum FROM  callcenter_job WHERE status = 'DONE' ",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getcasenotclose", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) as sum FROM  callcenter_job WHERE status IS NULL ",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getallcaseinpast", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT  COUNT(*) AS sum , DATE_FORMAT(created_date,'%d') AS date FROM callcenter_job GROUP BY CAST(created_date AS DATE) ",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/gettodaycase", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) AS sum FROM callcenter_job WHERE CAST(created_date AS DATE) = CURDATE()",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getclosecaseinpast", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT COUNT(*) as sum ,  DATE_FORMAT(updated_date,'%d') AS date FROM  callcenter_job WHERE status = 'DONE' GROUP BY CAST(updated_date AS DATE)",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getquestionlevel2", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT callcenter_job_detail.level2_id AS id  ,callcenter_level2.level2 AS name,COUNT(callcenter_job_detail.level2_id) AS sum  FROM callcenter_job_detail  INNER JOIN callcenter_level2 ON callcenter_job_detail.level2_id = callcenter_level2.id GROUP BY callcenter_job_detail.level2_id;",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getviewdashboard", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT *  FROM  View_forDashboard",

    function (err, results) {
      res.json(results);
    }
  );
});

app.listen(3333, function () {
  console.log("CORS-enabled web server listening on port 3333");
});
