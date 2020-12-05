// import express to start sever from node.js 
const express = require("express");
const mysql = require("mysql");
const path = require('path')

const router = express.Router();

// start server 
const app = express();

//database is being pulled from phpmyAdmin
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'exhibitionCenter',
})

//check if we connected 
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("conncted...")
    }
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    //homepage login
});

//request and responds the html links 
app.get('/index.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    //homepage login
});

app.get('/sign_up.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/sign_up.html'));
    //signup page
})

app.get('/admin_home.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/admin_home.html'));
    //admin home page
})

app.get('/superadmin_page.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/superadmin_page.html'));
    //superadmin home page
})

app.get('/user_home.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/user_home.html'));
    //user home page
})


//express listen for port 3020
app.listen(3020, () => {
    console.log("Server started correctly");
})

