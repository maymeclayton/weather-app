var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "INSERT into users (name, password) VALUES ('Henry', 'Daniel')";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//   });
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });


app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('views', path.join(__dirname, 'views'));

// Path to our public directory

app.use(express.static(path.join(__dirname, 'public')));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('index.html');
    const request = require('request');

    request('https://api.openweathermap.org/data/2.5/weather?q=Lexington&APPID=896a6875185f6799d82c2f0bda98e165', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    });
})

app.post('/', function(req, res){
    res.send("Post Successful");
})

app.get('/myweather', function(req, res){
    res.render('dashboard');
    const request= require('request');

    var sql = "SELECT * FROM locations";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("displaying location");
      });

})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){
    
    // const name = req.body.name;
    // const password = req.body.password;
    const values = [
        [req.body.name, req.body.password]
    ]

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT into users (name, password) VALUES ?";
        con.query(sql, [values], function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
      res.redirect("/login");

    
})


app.listen(process.env.PORT);