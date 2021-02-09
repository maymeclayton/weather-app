var express = require('express');
var app = express();
var path = require('path');

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('views', path.join(__dirname, 'views'));

// Path to our public directory

app.use(express.static(path.join(__dirname, 'public')));

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('index');
});

app.get('/myweather', function(req, res){
    res.send("My weather");
})

app.listen(3000);