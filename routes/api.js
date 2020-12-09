const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
	extended: true
  }));
  router.use(bodyParser.json());

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
router.get('/createtables', (req, res) => {
    let sql =
        `CREATE TABLE IF NOT EXISTS users (
        userID int AUTO_INCREMENT NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (userID)
    );`;

    db.query(sql, (err, result) => {
        if (err) throw err;
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
        if (err) throw err;
        console.log(result);
    });

    sql = `CREATE TABLE IF NOT EXISTS participation (user INT REFERENCES users(userID), attended INT REFERENCES events(eventID), PRIMARY KEY(user, attended));`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
    });

    res.send('Tables created...');
})

router.post('/createEvent', (req, res) => {
    let sql = `INSERT INTO events(eventTitle, eventDesc, eventURL, eventStartDate, eventEndDate, city, adminID) VALUES (\"${req.body.title}\", \"${req.body.description}\", \"${req.body.url}\", \"${req.body.begins}\", \"${req.body.ends}\", \"${req.body.city}\", \"${req.body.adminID}\");`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
    });

    sql = `INSERT INTO participation(user, attended) 
    SELECT users.userID, events.eventID
    FROM users, events
    WHERE users.userID = \"${req.body.adminID}\" AND events.eventTitle = \"${req.body.title}\" ;`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Event Created");
    });
})

router.get('/getEventsByAdmin', (req, res) => {
    let sql = `SELECT users.username, events.eventTitle, events.eventURL, events.eventStartDate, events.eventEndDate, events.city FROM events, users 
                WHERE events.adminID = users.userID AND users.username 
                LIKE "%` + req.query.adminName + '%"';

    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        console.log(fields);
        res.send(rows);
    });
})

router.get('/getEventsByUser', (req, res) => {
    let userID = 1;

    let sql = `SELECT users.username, events.eventTitle
    FROM events, users, participation 
    WHERE events.eventID = participation.attended AND users.userID = participation.user AND users.username 
    LIKE "%` + req.query.userName + '%"';

    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        console.log(fields);
        res.send(rows);
    });
})

router.get('/getEventsByLocation', (req, res) => {
    let sql = `SELECT events.eventTitle, events.eventURL, events.eventStartDate, events.eventEndDate, events.city, events.eventID
    FROM events 
    WHERE events.city LIKE "%` + req.query.city + '%"'

    db.query(sql, (err, rows, fields)=>
    {
        if(err) throw (err);
        console.log(rows);
        console.log(fields);
        res.send(rows);
    });
})

// gets events that take place between two given dates
router.get('/getEventsByDate',(req, res) =>
{
  let sql = `SELECT events.eventTitle, events.eventURL, events.eventStartDate, events.eventEndDate, events.city, events.eventID
             FROM events WHERE events.eventStartDate >= \"${req.query.startDate}\" AND
             events.eventEndDate <= \"${req.query.endDate}\" `;

  db.query(sql, (err, rows, fields)=>
  {
    if(err) throw (err);
    console.log(rows);
    console.log(fields);
    res.send(rows);
  });
})

router.post('/getEventsByParticipation',(req, res) =>
{
  let sql = `SELECT events.eventTitle, events.eventURL, events.eventStartDate, events.eventEndDate, events.city, events.eventID
            FROM events, participation
            WHERE participation.user = \"${req.body.userID}\" OR events.adminID = \"${req.body.userID}\"`;

  db.query(sql, (err, rows, fields)=>
  {
    if(err) throw (err);
    console.log(rows);
    res.send(rows);
  });
})

router.post('/register', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO users(username, password) VALUES (\"${req.body.username}\", \"${bcrypt.hashSync(req.body.password, 6)}\");`;

    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
    });

    return res.status(200).send(JSON.stringify({ response: "Account created" }));

})

router.post('/login', (req, res) => {
    console.log("login: " + req.body.username);
    let sql = `SELECT userID, password FROM users WHERE users.username = "${req.body.username}"`;

    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        rows.forEach(element => {
            if (bcrypt.compareSync(req.body.password, element.password)) {
                return res.status(200).send(JSON.stringify({ userID: element.userID }));
            }
        });
    });

    //return res.status(200).send(JSON.stringify({ userID: "-1" }));
})

router.post('/getAttendance', (req, res) => {
    let sql = `SELECT events, password FROM users WHERE username=${req.body.username}`;

    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        rows.array.forEach(element => {
            if (bcrypt.compareSync(req.body.password, element.password)) {
                return res.status(200).send(JSON.stringify({ userID: element.userID }));
            }
        });
    });

    return res.status(200).send(JSON.stringify({ response: "Account not found" }));
})

router.post('/addParticipation', (req, res) => {
    let sql = `INSERT INTO participation(user, attended) VALUES (\"${req.body.userID}\", \"${req.body.eventID}\");`;

    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
    });

    return res.status(200).send(JSON.stringify({ response: "Now Participating" }));

})

router.post('/removeParticipation', (req, res) => {
    let sql = `DELETE FROM participation WHERE userID=\"${req.body.userID}\" AND eventID=\"${req.body.eventID}\"`

    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
    });

    return res.status(200).send(JSON.stringify({ response: "Now Not Participating" }));

})


router.post('/getParticipationByUserAndEvent', (req, res) =>
{
  let sql = `SELECT participation.user, participation.attended FROM participation WHERE \"${req.body.userID}\" = participation.user AND \"${req.body.eventID}\" = participation.attended`;

  db.query(sql, (err, rows, fields)=>
  {
    if(err) throw (err);
    console.log(rows);
    console.log(fields);

    return res.send(JSON.stringify({ response : !(rows === undefined || rows.length == 0) }));
  });
})



module.exports = router;
