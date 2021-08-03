//Authoriazation Middleware
function isLoggedIn(req, res, next){
  //Is the user logged in? If yes then continue, otherwise redirect to /Login
  if (req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You must log in to do that!");
  res.redirect("/login");
}

module.exports = isLoggedIn;
