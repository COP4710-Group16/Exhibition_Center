const express = require('express');
const router = express.Router();

// Just a temp endpoint to testing routing
router.get('/createAccount', (req, res) => {
    res.send("createContact Endpoint")
})

module.exports = router;