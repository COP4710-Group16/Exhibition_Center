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

    let sql = 'CREATE TABLE events(id int AUTO_INCREMENT, title VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL, startdate VARCHAR(10) NOT NULL, enddate VARCHAR(10) NOT NULL, address VARCHAR(255) NOT NULL, PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
    });

    sql = 'CREATE TABLE users(id int AUTO_INCREMENT, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
    });

    
    res.send('Users & Events table created...');
})

//Creates a test event
app.get('/addevent', (req, res)=>
{
    let sql = 'INSERT INTO events(title, description, url, startdate, enddate, address) VALUES ("Test Event", "This is not a real event", "notrealevent.com", "10-10-2020", "10-11-2020", "Orlando" )';
    db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.send('Test event created...');
    });
})

//Creates a test user
app.get('/adduser', (req, res)=>
{
    let sql = 'INSERT INTO users(username, password) VALUES ("testuser", "testpassword")';
    db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.send('Test user created...');
    });
})


// obtain public html files to render
// const publicDirectory = path.join(__dirname, './public');
// app.use(express.static(publicDirectory));

// app.use('/', require('./routes/pages'));
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