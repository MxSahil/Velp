//Authoriazation Middleware
function isLoggedIn(req, res, next){
  //Is the user logged in? If yes then continue, otherwise redirect to /Login
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = isLoggedIn;
