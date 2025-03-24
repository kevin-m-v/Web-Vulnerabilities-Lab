const mysql = require("mysql2")

// Connects to the active MySQL Server
var db = mysql.createConnection({
    host: 'localhost',
    database: "sqli_lab",
    user: "root",
    password: 'password'
})

module.exports = db;