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
    avatar = req.body.avatar
    if (avatar === '') {
      avatar = "/images/abstract-user-flat-4.svg"
    }
    const newUser = await User.register(new User({
        email: req.body.email,
        username: req.body.username,
        want: [],
        playing: [],
        completed: [],
        avatar: avatar
        }),
        req.body.password);

    console.log(newUser);

    passport.authenticate('local')(req, res, () => {
      req.flash("success", "Signed up as " + newUser.username);
      res.redirect('/games');
    });

  } catch(err){
    console.log(err);
    req.flash("error", "Could not sign you up.");
    res.redirect("/games");
  }
})

//Log in - form for logging in
router.get("/login", (req, res) => {
  res.render('login');
});

//Login the user
router.post("/login", passport.authenticate('local', {
  successRedirect: '/games',
  failureRedirect: '/login',
  successFlash: "Successfully logged in",
  failureFlash: "Failed to log in. Please ensure your username and password are correct"
}));


//Logout the user
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/games")
})


module.exports = router;
