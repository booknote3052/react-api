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
  host: "localhost",
  user: "root",
 
  database: "mydb",
});

app.post("/admin", jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    connection.execute(
      "INSERT INTO admin(users,password,password_hash,fname,lname)VALUE(?,?,?,?,?)",
      [req.body.users, req.body.password, hash, req.body.fname, req.body.lname],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", massage: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  });
});
app.post("/updatepassword", jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    connection.execute(
      "UPDATE admin SET  password = ? , password_hash = ? WHERE id = ?",
      [req.body.password, hash,req.body.id],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", massage: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  });
});

app.post("/register", jsonParser, function (req, res, next) {
  if (req.body.postcode) {
    connection.execute(
      "INSERT INTO contactuser(IDnumber,postcode) VALUE(?,?)",
      [
        req.body.IDnumber,
        // req.body.fname,
        // req.body.lname,
        // req.body.nation,
        // req.body.status,
        // req.body.tel,
        // req.body.Province,
        // req.body.amphures,
        req.body.postcode,
      ],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", massage: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  } else {
    connection.execute(
      "INSERT INTO contactuser(IDnumber,fname,lname,nation,status,tel,Province,amphures) VALUE(?,?,?,?,?,?,?,?)",
      [
        req.body.IDnumber,
        req.body.fname,
        req.body.lname,
        req.body.nation,
        req.body.status,
        req.body.tel,
        req.body.Province,
        req.body.amphures,
      ],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", massage: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  }
});

app.post("/login", jsonParser, function (req, res, next) {
  console.log(req);
  connection.query(
    "SELECT * FROM admin WHERE users=?",
    [req.body.users],
    function (err, admin, fields) {
      if (err) {
        res.json({ status: "error", massage: err });
        return;
      }
      if (admin.length == 0) {
        res.json({ status: "error", massage: "no user found", admin: admin });
        return;
      }
      bcrypt.compare(
        req.body.password,
        admin[0].password_hash,
        function (err, result) {
          if (result) {
            var token = jwt.sign({ users: admin[0].users }, secret, {
              expiresIn: "1h",
            });
            res.json({ status: "ok", token, admin: admin[0].id,fname:admin[0].fname,lname:admin[0].lname });
          } else {
            res.json({ status: "error" });
          }
        }
      );
    }
  );
});

app.post("/authen", jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error" });
  }
});

app.post("/getlayer1", function (req, res, next) {
  connection.query(
    "SELECT * FROM layer1",

    function (err, results) {
      res.json(results);
    }
  );
});

app.post("/timestamp", jsonParser, function (req, res, next) {
  const options = {  year: 'numeric', month: 'long', day: 'numeric' };
  const options1 = {  hour: 'numeric',minute: 'numeric' };
  const today = new Date();
     const date =today.toLocaleDateString('th-TH',options );
     const time =  today.toLocaleTimeString('th-TH',options1);

  connection.query(
    "INSERT INTO timestamp(admin_id,status,date,time) VALUE(?,?,?,?)",
    [req.body.id,req.body.status,date,time],

    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", massage: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});
app.post("/gettimestamp", jsonParser, function (req, res, next) {
  

  connection.query(
    "SELECT * FROM timestamp WHERE admin_id = ?",
    [req.body.id],

    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", massage: err });
        return;
      }
      res.json(results);
    }
  );
});

app.post("/getlayer2/", jsonParser, function (req, res, next) {
  const id_header = req.body.id_header;

  connection.query(
    "SELECT * FROM layer2 WHERE `id_header`=?",
    [id_header],

    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/getlayer3/", jsonParser, function (req, res, next) {
  const id_header = req.body.id_header;

  connection.query(
    "SELECT * FROM layer3 WHERE `id_header`=?",
    [id_header],

    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/getlayer4/", jsonParser, function (req, res, next) {
  const id_header = req.body.id_header;

  connection.query(
    "SELECT * FROM layer4 WHERE `id_subheader`=?",
    [id_header],

    function (err, results) {
      res.json(results);
    }
  );
});
app.post("/getlayer5/", jsonParser, function (req, res, next) {
  const id_header = req.body.id_header;

  connection.query(
    "SELECT * FROM layer4 WHERE `id_header`=?",
    [id_header],

    function (err, results) {
      res.json(results);
    }
  );
});

app.get("/getprovice", function (req, res, next) {
  connection.query(
    "SELECT * FROM provinces",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getamphures/:province_name", function (req, res, next) {
  console.log(req);
  const { province_name } = req.params;
  connection.query(
    "SELECT * FROM amphures WHERE provice_name = (?)",
    [province_name],

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/gettambon/:postcode", function (req, res, next) {
  console.log(req);
  const { postcode } = req.params;
  connection.query(
    "SELECT * FROM tambon WHERE postcode = (?) LIMIT 1",
    [postcode],

    function (err, results) {
      if(err){
        res.json({ status: "error" });
      }else{
      res.json(results);
      }
    }
  );
});
app.get("/getstatus", function (req, res, next) {
  console.log(req);

  connection.query(
    "SELECT status FROM  statuscase",

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getinfoadmin/:id", function (req, res, next) {
  const { id } = req.params;
  connection.query(
    "SELECT fname ,lname FROM admin WHERE id =(?)",
    [id],

    function (err, results) {
      res.json(results);
    }
  );
});
app.get("/getinfocase/:id", function (req, res, next) {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM Case_Status WHERE admin_id =(?)",
    [id],

    function (err, results) {
      res.json(results);
    }
  );
});

app.post("/case_status", jsonParser, function (req, res, next) {
  const options = {  year: 'numeric', month: 'long', day: 'numeric' };
  const options1 = {  hour: 'numeric',minute: 'numeric' };
  const today = new Date();
     const date =today.toLocaleDateString('th-TH',options );
     const time =  today.toLocaleTimeString('th-TH',options1);
  if (req.body.other) {
    connection.execute(
      "INSERT INTO Case_Status(admin_id,status,question,other,IDnumber,tambon_id,date,time)VALUE(?,?,?,?,?,?,?,?)",
      [req.body.admin_id, req.body.status, req.body.question, req.body.other,req.body.IDnumber,req.body.tambon_id,date,time],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", massage: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  } else {
    connection.execute(
      "INSERT INTO Case_Status(admin_id,status,question,answer,IDnumber,tambon_id,date,time)VALUE(?,?,?,?,?,?,?,?)",
      [req.body.admin_id, req.body.status, req.body.question, req.body.answer,req.body.IDnumber,req.body.tambon_id,date,time],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", massage: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  }
});
app.listen(3333, function () {
  console.log("CORS-enabled web server listening on port 3333");
});
