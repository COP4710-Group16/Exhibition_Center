const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/index.html', (req, res) => {
    res.render('index');
});

router.get('/sign_up.html', (req, res) => {
    res.render("sign_up");
});

router.get('/admin_home.html', (req, res) => {
    res.render("admin_home");
});

router.get('/superadmin_page.html', (req, res) => {
    res.render("superadmin_page");
});

router.get('/user_home.html', (req, res) => {
    res.render("user_home");
});


module.exports = router;