var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
require('dotenv').config();
var session = require('express-session');
var flash = require('connect-flash');
var MemoryStore = require('memorystore')(session)

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

app.engine('.html', require('ejs').__express);

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
secret: "clayton!",
resave: true,
saveUninitialized: true,
store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
cookie: { maxAge: 60000 }
}));

app.use(flash());

app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('index',
    {
        city: null,
        location: null,
        temp: null,
        desc: null
      });

})

app.post('/', function(req, res){

    const request = require('request');

    var location = req.body.city;
    var key = process.env.API_KEY;
    var baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

    var apiUrl = baseUrl + location + key;

    request(apiUrl, { json: true }, function (error, response, body) {
        if (body.message === 'city not found') {
            res.render('index', {
              city: body.message,
              location: null,
              temp: null,
              desc: null,
            })
          } else {
            var location = body.name;
            var temp = body.main.temp;
            var desc = body.weather[0].description;
  
            res.render('index', {
              location, temp, desc
            });
          }

    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

})
    
});

app.post('/login', function(req, res){

    const name = req.body.name;
    const password = req.body.password;
    const idusers = " ";

    if (name && password) {
        con.query('SELECT * FROM users WHERE name=? AND password=?',[name, password], function(error, results, fields) {
            console.log(results);
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.name = name;
                req.session.id = idusers;
                console.log(idusers);
                return res.redirect('/dashboard');

            } else {
                res.send('Incorrect Username and/or Password!');
        }

        })
        }
    
    else {
        res.send('Please enter Username and Password!');
        res.end();
    }
})


app.get('/login', function(req, res){
    res.render('login');
})

app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){
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
        res.redirect("/login");
      });
      

    
})

app.get('/dashboard', function(req, res){
console.log("you've hit dashboard");

    if (req.session.loggedin){
        res.render("dashboard");
        con.query('SELECT idusers FROM users WHERE name=${req.session.name} AND password=${req.session.password}', function(error, result, fields){
            req.session.id = result;
            console.log(req.session.id);
        })
        console.log('working');
    }
    else {
        console.log("not logged in");
        res.redirect('/login');
    }
    
});


app.listen(process.env.PORT);