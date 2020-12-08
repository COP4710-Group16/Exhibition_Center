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

//Initializes events and users tables
app.get('/createtables', (req, res)=>
{
    let sql = 
    `CREATE TABLE IF NOT EXISTS users (
        userID int AUTO_INCREMENT NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (userID)
    );`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
    });

    sql = 
    `CREATE TABLE IF NOT EXISTS events (
        eventID int AUTO_INCREMENT,
        eventTitle VARCHAR(255),
        eventDesc VARCHAR(255),
        eventURL VARCHAR(255),
        eventStartDate VARCHAR(10),
        eventEndDate VARCHAR(10),
        city VARCHAR(255),
        PRIMARY KEY (eventID),
        adminID INT REFERENCES users(userID )
    );`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
    });

    sql = 
    `CREATE TABLE IF NOT EXISTS participation (user INT REFERENCES users(userID), attended INT REFERENCES events(eventID));`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
    });
    
    res.send('Users & Events table created...');
})

//Creates a test event
app.get('/addevent', (req, res)=>
{
    let sql = `INSERT INTO events(eventTitle, eventDesc, eventURL, eventStartDate, eventEndDate, city, adminID) 
    VALUES ("Test Event", "This is not a real event", "notrealevent.com", "10-10-2020", "10-11-2020", "Orlando", "1");`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Test event created...');
    });
})

//Creates a test user
app.get('/adduser', (req, res)=>
{
    let sql = 'INSERT INTO users(username, password) VALUES ("testuser", "testpassword");';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Test user created...');
    });
})

app.get('/queryEvents', (req, res) =>
{
    let sql = 'SELECT * FROM events;';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('/public/admin_home.html');
    });
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
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});