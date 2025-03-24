const express = require("express");

const path = require("path");

const app = express();

const bodyParser = require("body-parser")

// The full file path to the database connection script must be used
const connection = require("C:/Full_Path/Web_Vulnerabilities_Lab/db.js")

const PORT = 9001;

// ensures use of express.js
app.use(express.urlencoded({extended: false}))

app.unsubscribe(express.static(path.join(__dirname,'static')));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
});

app.get("/views/xss.html", (req, res) => {
    res.sendFile(__dirname + "/views/xss.html")
});

app.get("/views/access_denied.html", (req, res) => {
    res.sendFile(__dirname + "/views/access_denied.html")
});

// POST request for Create User
app.post('/api', function(req, res){
    console.log(req.body)
    const username = req.body.user
    const password = req.body.password

    // SECURE SQL Query
    connection.query("INSERT INTO sql_injection (user, password) VALUES (?,?)",
    [username, password],
    (err, result) => {
        console.log(err);
    })
})

// POST request for Login
app.post('/login', function(req, res){
    const login_username = req.body.login_user
    const login_password = req.body.login_password

    // UNSECURE SQL Query, SQLi input: ' OR 1=1;#
    connection.query("SELECT * FROM sql_injection WHERE user = '" + req.body.login_user + "' AND password = '" + req.body.login_password + "'",
    [login_username, login_password],
    (err, result) => {
        if (err){
            res.send({err: err})
        }
        if (result.length > 0) {
            res.cookie('Username', req.body.login_user, {maxAge: 60000 * 10})
            res.cookie('SessionID', 'ABC123', {maxAge: 60000 * 10})
            res.redirect(301, '/views/xss.html')
            
        } else {
            res.redirect(301, '/views/access_denied.html')
        }
    });
})

// Starts the server on the specified PORT
app.listen(PORT, function(){
    console.log("server is working")
    connection.connect(function(err){
        if(err) throw err;
        console.log("database is working")
    })
})