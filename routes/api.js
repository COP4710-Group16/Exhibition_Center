const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    //Database must be created in phpmyadmin with name exhibition_center or whatever the .env file has specified  
    database: process.env.DATABASE
})

db.connect((error) => {

    if (error) {
        console.log(error);
    }
})

//Initializes events and users tables
router.get('/createtables', (req, res)=>
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

    sql = `CREATE TABLE IF NOT EXISTS participation (user INT REFERENCES users(userID) NOT NULL, attended INT REFERENCES events(eventID));`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
    });
    
    res.send('Tables created...');
})

//Creates a test event
router.get('/addevent', (req, res)=>
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
router.get('/adduser', (req, res)=>
{
    let sql = 'INSERT INTO users(username, password) VALUES ("testuser", "testpassword");';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Test user created...');
    });
})

router.get('/getEventsByAdmin', (req, res) => 
{
    let sql = `SELECT users.username, events.eventTitle, events.eventURL, events.eventStartDate, events.eventEndDate, events.city FROM events, users 
                WHERE events.adminID = users.userID AND users.username 
                LIKE "%` + req.query.adminName + '%"';

    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
        console.log(rows);
        console.log(fields);
        res.send(rows);
    });
})

router.get('/getEventsByUser', (req, res) => 
{
    let userID = 1;
    let sql = `SELECT events.eventID, events.eventTitle, events.eventDesc, events.eventURL, events.eventStartDate, events.eventEndDate, events.eventAddr, events.city FROM events, participation 
    WHERE participation.userID = \"${req.userID}\" AND participation.eventID = events.eventID`;
    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
        return res.status(200).send(rows);
    });

    return res.status(200).send(JSON.stringify({response: "Unspecified error"}));
})

router.post('/register', (req, res) => 
{
    let sql = `INSERT INTO users(username, password) VALUES (\"${req.username}\", \"${bcrypt.hashSync(req.password, 6)}\");`;

    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
    });

    return res.status(200).send(JSON.stringify({response: "Account created"}));
    
})

router.post('/login', (req, res) => 
{
    let sql = `SELECT userID, password FROM user WHERE username=${req.username}`;

    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
        rows.array.forEach(element => {
            if(bcrypt.compareSync(req.password, element.password))
            {
                return res.status(200).send(JSON.stringify({userID: element.userID}));
            }
        });
    });

    return res.status(200).send(JSON.stringify({response: "Account not found"}));
})

router.post('/getAttendance', (req, res) => 
{
    let sql = `SELECT events, password FROM user WHERE username=${req.username}`;

    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
        rows.array.forEach(element => {
            if(bcrypt.compareSync(req.password, element.password))
            {
                return res.status(200).send(JSON.stringify({userID: element.userID}));
            }
        });
    });

    return res.status(200).send(JSON.stringify({response: "Account not found"}));
})

router.post('/addParticipation', (req, res) => 
{
    let sql = `INSERT INTO participation(userID, eventID) VALUES (\"${req.userID}\", \"${req.eventID}\");`;

    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
    });

    return res.status(200).send(JSON.stringify({response: "Now Participating"}));
    
})

router.post('/removeParticipation', (req, res) => 
{
    let sql = `DELETE FROM participation WHERE userID=\"${req.userID}\" AND eventID=\"${req.eventID}\"`

    db.query(sql, (err, rows, fields) => {
        if(err) throw err;
    });

    return res.status(200).send(JSON.stringify({response: "Now Not Participating"}));
    
})


module.exports = router;