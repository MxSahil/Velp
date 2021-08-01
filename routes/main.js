const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');


//Landing Page
router.get("/", (req, res) => {
  res.render("landing");
});

//Account page
router.get("/account", isLoggedIn, (req, res) => {
  res.render("account");
});

module.exports = router;
