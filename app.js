// import express to start sever from node.js 
const express = require("express");
const mysql = require("mysql");

// start server 
const app = express();

//database needed from localhost/phpmyadmin 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
})

//request and responds 
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>");
});

//express listen for port 3020
app.listen(3020, () => {
    console.log("Server started correctly");
})

