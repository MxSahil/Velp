const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//Signup - form for new user
router.get("/signup", (req, res) => {
  res.render("signup");
})

//Sign up - Create new User
router.post("/signup", async (req, res) => {
  try {
    const newUser = await User.register(new User({
        email: req.body.email,
        username: req.body.username,
        }),
        req.body.password);

    console.log(newUser);

    passport.authenticate('local')(req, res, () => {
      res.redirect('/games');
    });

  } catch(err){
    console.log(err);
    res.send("Error in signing up", err);
  }
})

//Log in - form for logging in
router.get("/login", (req, res) => {
  res.render('login');
});

//Login the user
router.post("/login", passport.authenticate('local', {
  successRedirect: '/games',
  failureRedirect: '/login'
}));


//Logout the user
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/games")
})


module.exports = router;
