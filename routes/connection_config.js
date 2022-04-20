var mysql = require("mysql2");
var con = {
  host: "containers-us-west-37.railway.app",
  user: "root",
  password: "llKPIeYX6DIwVPTwDf66",
  port: "7079",
  database: "cnpm",
  // insecureAuth: "true",
};
var dbcon = mysql.createConnection(con);

module.exports = dbcon;
