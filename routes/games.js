const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');
const checkGameOwner = require('../utils/checkGameOwner');

const Game = require('../models/game');
const Comment = require('../models/comment');

//INDEX the games
router.get("/games", async (req, res) => {
  console.log(req.user);
  try {
    let games = await Game.find().exec();
    res.render("games", {games: games});
  } catch(err) {
    console.log(err);
    res.send("Error");
  }
});

//Form to add NEW game
router.get("/games/new", isLoggedIn, (req, res) => {
  res.render("games_new");
});

//CREATE a new game in the database
router.post("/games", isLoggedIn, async (req, res) => {
  const newGame = {
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    genres: req.body.genres,
    releaseDate: req.body.releaseDate,
    developer: req.body.developers,
    publisher: req.body.publishers,
    platforms: req.body.platforms,
    metacritic: req.body.metacritic,
    esrb: req.body.esrb,
    owner: {
      id: req.user._id,
      username: req.user.username
    }
  }
  try {
    let game = await Game.create(newGame);
    console.log(game);
    res.redirect("/games/" + game._id);
  } catch(err){
    console.log("Error");
    res.send("Error");
  }
});

//Search
router.get("/games/search", async (req, res) => {
  try {
    let games = await Game.find({
      $text: {$search: req.query.term}
    })
    res.render("games", {games});

  } catch(err){
    console.log(err);
    res.send("Error - Search")
  }
})

//SHOW a game given the id
router.get("/games/:id" , async (req, res) =>{
  try {
    let game = await Game.findById(req.params.id).exec();
    let comments = await Comment.find({gameID: req.params.id});
    res.render("games_show", {game: game, comments: comments});
  } catch(err){
    console.log("Error");
    res.send("Error");
  }
});

//form to EDIT a game
router.get("/games/:id/edit", checkGameOwner, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id).exec();
    res.render("games_edit", {game});
  } catch(err) {
    console.log(err);
    res.send(err);
  }
});

//UPDATE a game in the database
router.put("/games/:id", checkGameOwner, async (req, res) => {
  const updatedGame = {
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    genres: req.body.genres,
    releaseDate: req.body.releaseDate,
    developer: req.body.developers,
    publisher: req.body.publishers,
    platforms: req.body.platforms,
    metacritic: req.body.metacritic,
    esrb: req.body.esrb
  }
  try {
    let game = await Game.findByIdAndUpdate(req.params.id, updatedGame, {new: true}).exec();
    res.redirect(`/games/${req.params.id}`);
  } catch(err) {
    console.log("Error");
    res.send("Error");
  }
});

//DELETE a game from the database
router.delete("/games/:id", checkGameOwner, async (req, res) => {
  try {
    let game = await Game.findByIdAndDelete(req.params.id).exec();
    console.log("Deleted Game:", game);
    res.redirect("/games");
  } catch(err) {
    console.log("Error");
    res.send("Error");
  }
});

module.exports = router;
