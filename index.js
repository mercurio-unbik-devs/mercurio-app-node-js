var express = require('express');
var cookieParser = require('cookie-parser');
var escape = require('escape-html');
var serialize = require('node-serialize');
var bodyParser = require("body-parser");
var app = express();

app.use(cookieParser())
app.get('/', function(req, res) {
 if (req.cookies.profile && req.cookies.admin == 'True') {
     var str = new Buffer(req.cookies.profile, 'base64').toString();
     var obj = serialize.unserialize(str);
     if (obj.username) {
       res.send("Hello " + escape(obj.username) + " <a href='/logout'>Logout</a>");
     }else{
       res.redirect('/logout');
     }
 } else {
    res.sendFile(__dirname + "/" + "index.html");
 }
});

app.get('/logout', function (req, res) {
    res.clearCookie('profile');
    res.redirect('/');
})

var urlencodedParser = bodyParser.urlencoded({extended: false})

app.post('/setprofile', urlencodedParser, function (req, res) {
    profile = {
        username: req.body.username,
        password: req.body.password
    };
    res.cookie('profile', new Buffer(JSON.stringify(profile)).toString('base64'), {
       maxAge: 900000,
       httpOnly: true
    });
    
    if (req.cookies.admin == 'True'){
       res.cookie('admin', new Buffer('True'), {maxAge: 900000, httpOnly: false});
    }
    
    res.redirect('/');
});

var server = app.listen(8080, function() {
    var host = 'mercurio-website.net'
    var port = server.address().port;
    console.log("Server Started, URL: http://%s:%s/", host, port);
});
