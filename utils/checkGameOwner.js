const Game = require('../models/game');
const checkGameOwner = async (req, res, next) => {
  if (req.isAuthenticated()){
    let game = await Game.findById(req.params.id).exec();
    if (game.owner.id.equals(req.user._id)){
      next();
    } else {
      req.flash("error", "You don't have permission to do that!");
      res.redirect("back");
    }
  } else {
    req.flash("error", "You must be logged in to do that!");
    res.redirect("/login");
  }
}
module.exports = checkGameOwner
