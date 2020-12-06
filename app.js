// import express to start sever from node.js 
const express = require("express");
const path = require('path')
const bodyParser = require('body-parser');
const mysql = require("mysql");
const port = process.env.PORT || 3020;
var router = express.Router();
require('dotenv').config();

// start server 
const app = express();
app.set('port', 3020);
app.use(express.json());

// Rest API requirements
app.use(bodyParser.urlencoded({
	extended: true
  }));
  app.use(bodyParser.json());

//database is being pulled from phpmyAdmin
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
})

//check if we connected 
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("conncted...")
    }
})

/*
// obtain public html files to render
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
*/

/*
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, './public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});
*/

/*
if (process.env.NODE_ENV === 'production')
{
    app.use(express.static(__dirname));
    app.use(express.static(path.join(__dirname, './public')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './public', 'index.html'));
    });
}
*/

// Serves the pages
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// Just a test endpoint
app.get('/user', (req, res) => {
	res.send("Helloo")
})

//app.get('/', require('./routes/pages'));

// Serves the api
app.use('/api', require('./routes/api'));


//express listen for port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});