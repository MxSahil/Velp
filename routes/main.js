const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');


//Landing Page
router.get("/", (req, res) => {
  res.render("landing");
});

//Account page
router.get("/my-account", isLoggedIn, (req, res) => {
  res.render("account");
});

router.post("/my-account/collection", isLoggedIn, (req, res) => {
  res.json({message: "test"})
})

module.exports = router;
