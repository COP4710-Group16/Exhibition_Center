// import express to start sever from node.js 
const express = require("express");

// start server 
const app = express();

//request and responds 
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>");
});

//express listen for port 3020
app.listen(3020, () => {
    console.log("Server started correctly");
})