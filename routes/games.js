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
    res.send("Error - SHOW Games");
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
    },
    upvotes: [],
    downvotes: []
  }
  try {
    let game = await Game.create(newGame);
    console.log(game);
    req.flash("success", "Game created!");
    res.redirect("/games/" + game._id);
  } catch(err){
    console.log("Error");
    req.flash("error", "Failed to create game.");
    res.redirect("/games");
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
});

//Genre
router.get("/games/genre/:name", async (req, res) => {
  const validGenres = [
    "action",
    "shooter",
    "rpg",
    "sport",
    "adventure",
    "fighting",
    "racing",
    "strategy",
    "casual",
    "simulation",
    "arcade"
    ]
    if (validGenres.includes(req.params.name.toLowerCase())){
      let given = req.params.name.toLowerCase();
      given = given[0].toUpperCase() + given.slice(1);
      const games = await Game.find({genres: given}).exec();
      res.render("games", {games});
    } else{
      res.send("Invalid Genre");
    }
});

// Voting
router.post("/games/vote", isLoggedIn, async (req, res) => {
  console.log("Request Body:", req.body);
  const game = await Game.findById(req.body.gameId);
  const checkUpvote = game.upvotes.indexOf(req.user.username);
  const checkDownvote = game.downvotes.indexOf(req.user.username);

  let response = {};
  if (checkUpvote === -1 && checkDownvote === -1) { //Not voted yet
    if (req.body.vote === "up"){
      game.upvotes.push(req.user.username);
      game.save();
      response.message = "Upvote recorded";

    } else if (req.body.vote === "down"){
      game.downvotes.push(req.user.username);
      game.save();
      response.message = "Downvote recorded";

    } else {
      response.message = "Error 1: Not voted yet"
    }

  } else if (checkUpvote >= 0) { // already upvoted
    if (req.body.vote === "up"){
      game.upvotes.splice(checkUpvote, 1);
      game.save();
      response.message = "Upvote removed";
    } else if (req.body.vote === "down"){
      game.upvotes.splice(checkUpvote, 1);
      game.downvotes.push(req.user.username)
      game.save();
      response.message = "Upvote changed to Downvote";
    } else {
      response.message = "Error 2: already upvoted"
    }

  } else if (checkDownvote >= 0) { // already downvoted
    if (req.body.vote === "up"){
      game.downvotes.splice(checkDownvote, 1);
      game.upvotes.push(req.user.username)
      game.save();
      response.message = "Downvote changed to Upvote";
    } else if (req.body.vote === "down"){
      game.downvotes.splice(checkDownvote, 1);
      game.save();
      response.message = "Downvote removed";
    } else {
      response.message = "Error 3: already downvoted"
    }

  } else { //error
    response.message = "Error 4"
  }
  res.json(response);

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
    esrb: req.body.esrb,
    upvotes: req.body.upvotes,
    downvotes: req.body.downvotes
  }
  try {
    let game = await Game.findByIdAndUpdate(req.params.id, updatedGame, {new: true}).exec();
    req.flash("success", "Game updated!");
    res.redirect(`/games/${req.params.id}`);
  } catch(err) {
    console.log(err);
    req.flash("error", "Failed to update this game.");
    res.redirect("/games/" + req.params._id);
  }
});

//DELETE a game from the database
router.delete("/games/:id", checkGameOwner, async (req, res) => {
  try {
    let game = await Game.findByIdAndDelete(req.params.id).exec();
    console.log("Deleted Game:", game);
    req.flash("success", "Game deleted");
    res.redirect("/games");
  } catch(err) {
    console.log(err);
    req.flash("error", "Failed to delete this game.");
    res.redirect("/games/" + req.params._id);
  }
});

module.exports = router;
