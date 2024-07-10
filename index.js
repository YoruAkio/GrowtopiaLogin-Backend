const express = require('express');
const app = express();
const fs = require('fs');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});
app.use(express.static(__dirname + '/public'));

app.post('/player/login/dashboard', function (req, res) {
    res.sendFile(__dirname + '/public/html/dashboard.html');
    res.end();
});

app.get('/player/login/dashboard', function (req, res) {
    res.sendFile(__dirname + '/public/html/dashboard.html');
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(5000, function () {
    console.log('Listening on port 5000');
});
