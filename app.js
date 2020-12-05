// import express to start sever from node.js 
const express = require("express");
const mysql = require("mysql");
const path = require('path')
const dotenv = require('dotenv')
const router = express.Router();


// obtain .env with sensitive data  
dotenv.config({ path: './.env' })

// start server 
const app = express();

//database is being pulled from phpmyAdmin
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
})

// app.set('view engine', 'html');

//check if we connected 
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("conncted...")
    }
})


// obtain public html files to render
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use('/', require('./routes/pages'));


//express listen for port 3020
app.listen(3020, () => {
    console.log("Server started correctly");
})

