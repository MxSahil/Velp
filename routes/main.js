const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');

const Game = require('../models/game');


//Landing Page
router.get("/", (req, res) => {
  res.render("landing");
});

//Account page
router.get("/my-account", isLoggedIn, async (req, res) => {
  gameOwner = {id: req.user._id, username: req.user.username}
  const myGames = await Game.find({owner:gameOwner}).exec();
  const wantGames = await Game.find({_id: {$in: req.user.want}});
  const playingGames = await Game.find({_id: {$in: req.user.playing}});
  const completedGames = await Game.find({_id: {$in: req.user.completed}});
  res.render("account", {myGames, wantGames, playingGames, completedGames});
});

router.post("/my-account/collection", isLoggedIn, async (req, res) => {
  // console.log(req.body);
  let response = {};
  if (req.body.collectionType === 'myGames') {
    response.message = "Show my games";
    response.code = 1;

  } else if (req.body.collectionType === 'want') {
    response.message = "Show want";
    response.code = 2;

  } else if (req.body.collectionType === 'playing') {
    response.message = "Show playing";
    response.code = 3;

  } else if (req.body.collectionType === 'completed') {
    response.message = "Show completed";
    response.code = 4;

  } else {
    response.message = "Error";
    response.code = "err";
  }
  res.json(response)
})

module.exports = router;
