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
app.set('view engine', 'html');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    //Database must be created in phpmyadmin with name exhibition_center or whatever the .env file has specified  
    database: process.env.DATABASE
})

//Attempt to connect to database
db.connect((error) => {

    if (error) {
        console.log(error);
    } else {
        console.log("Connected to database...")
    }
})

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

// Serves the api
app.use('/api', require('./routes/api'));

//express listen for port
app.listen(port, (error) => {

    console.log(`Server is running on port: ${port}`);
});