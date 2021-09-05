const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');
const checkGameOwner = require('../utils/checkGameOwner');
const fetch = require('node-fetch');

const Game = require('../models/game');
const Comment = require('../models/comment');
const User = require("../models/user");

//INDEX the games
router.get("/games", async (req, res) => {
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
    console.log(err);
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

//Add game to your want, playing or completed collection
router.post("/games/collection", isLoggedIn, async (req, res) => {
  // console.log("Request Body:", req.body);
  const game = await Game.findById(req.body.gameId);
  const checkWant = req.user.want.indexOf(game._id)
  const checkPlaying = req.user.playing.indexOf(game._id)
  const checkCompleted = req.user.completed.indexOf(game._id)

  let response = {};
  if (checkWant === -1 && checkPlaying === -1 && checkCompleted === -1) {
    if (req.body.collection === "want") {
      req.user.want.push(game._id);
      req.user.save();
      response.message = "want";
      response.code = 1;
    } else if (req.body.collection === "playing") {
      req.user.playing.push(game._id);
      req.user.save();
      response.message = "playing";
      response.code = 2;
    } else if (req.body.collection === "completed") {
      req.user.completed.push(game._id);
      req.user.save();
      response.message = "completed";
      response.code = 3;
    } else {
      response.message = "Error 1";
      response.code = "err";
    }
  } else if (checkWant >= 0 && checkPlaying === -1 && checkCompleted === -1) {
    if (req.body.collection === "want") {
      req.user.want.splice(checkWant, 1);
      req.user.save();
      response.message = "want removed";
      response.code = 0;
    } else if (req.body.collection === "playing") {
      req.user.want.splice(checkWant, 1);
      req.user.playing.push(game._id);
      req.user.save();
      response.message = "want changed to playing";
      response.code = 2;
    } else if (req.body.collection === "completed") {
      req.user.want.splice(checkWant, 1);
      req.user.completed.push(game._id);
      req.user.save();
      response.message = "want changed to completed";
      response.code = 3;
    } else {
      response.message = "Error 2";
      response.code = "err";
    }
  } else if (checkWant === -1 && checkPlaying >= 0 && checkCompleted === -1) {
    if (req.body.collection === "want") {
      req.user.playing.splice(checkPlaying, 1);
      req.user.want.push(game._id);
      req.user.save();
      response.message = "playing changed to want";
      response.code = 1;
    } else if (req.body.collection === "playing") {
      req.user.playing.splice(checkPlaying, 1);
      req.user.save();
      response.message = "playing removed";
      response.code = 0;
    } else if (req.body.collection === "completed") {
      req.user.playing.splice(checkPlaying, 1);
      req.user.completed.push(game._id);
      req.user.save();
      response.message = "playing changed to completed";
      response.code = 3;
    } else {
      response.message = "Error 3";
      response.code = "err";
    }
  } else if (checkWant === -1 && checkPlaying === -1 && checkCompleted >= 0) {
    if (req.body.collection === "want") {
      req.user.completed.splice(checkCompleted, 1);
      req.user.want.push(game._id);
      req.user.save();
      response.message = "completed changed to want";
      response.code = 1;
    } else if (req.body.collection === "playing") {
      req.user.completed.splice(checkCompleted, 1);
      req.user.playing.push(game._id);
      req.user.save();
      response.message = "completed changed to playing";
      response.code = 2;
    } else if (req.body.collection === "completed") {
      req.user.completed.splice(checkCompleted, 1);
      req.user.save();
      response.message = "completed removed";
      response.code = 0;
    } else {
      response.message = "Error 4";
      response.code = "err";
    }
  } else {
    response.message = "Error 5";
    response.code = "err";
  }
  res.json(response);

});

// Voting
router.post("/games/vote", isLoggedIn, async (req, res) => {
  // console.log("Request Body:", req.body);
  const game = await Game.findById(req.body.gameId);
  const checkUpvote = game.upvotes.indexOf(req.user.username);
  const checkDownvote = game.downvotes.indexOf(req.user.username);

  let response = {};
  if (checkUpvote === -1 && checkDownvote === -1) { //Not voted yet
    if (req.body.vote === "up"){
      game.upvotes.push(req.user.username);
      game.save();
      response.message = "Upvote recorded";
      response.code = 1;

    } else if (req.body.vote === "down"){
      game.downvotes.push(req.user.username);
      game.save();
      response.message = "Downvote recorded";
      response.code = -1;

    } else {
      response.message = "Error 1: Not voted yet";
      response.code = "err";
    }

  } else if (checkUpvote >= 0) { // already upvoted
    if (req.body.vote === "up"){
      game.upvotes.splice(checkUpvote, 1);
      game.save();
      response.message = "Upvote removed";
      response.code = 0;
    } else if (req.body.vote === "down"){
      game.upvotes.splice(checkUpvote, 1);
      game.downvotes.push(req.user.username)
      game.save();
      response.message = "Upvote changed to Downvote";
      response.code = -1;
    } else {
      response.message = "Error 2: already upvoted";
      response.code = "err";
    }

  } else if (checkDownvote >= 0) { // already downvoted
    if (req.body.vote === "up"){
      game.downvotes.splice(checkDownvote, 1);
      game.upvotes.push(req.user.username)
      game.save();
      response.message = "Downvote changed to Upvote";
      response.code = 1;
    } else if (req.body.vote === "down"){
      game.downvotes.splice(checkDownvote, 1);
      game.save();
      response.message = "Downvote removed";
      response.code = 0;
    } else {
      response.message = "Error 3: already downvoted"
      response.code = "err";
    }

  } else { //error
    response.message = "Error 4";
    response.code = "err";
  }
  response.score = game.upvotes.length - game.downvotes.length;
  res.json(response);

})

//SHOW a game given the id
router.get("/games/:id" , async (req, res) =>{
  try {
    let game = await Game.findById(req.params.id).exec();
    let comments = await Comment.find({gameID: req.params.id});
    let title = game.title.replace(/ /g, "%20");
    // res.render("games_show", {game: game, comments: comments, response: {result: []}});
    await fetch("https://amazon23.p.rapidapi.com/product-search?query="+title+"&country=CA", {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-host": "amazon23.p.rapidapi.com",
    		"x-rapidapi-key": "916efda5f5msh9551f04d54f6e98p14ed4fjsn9e70d61567a2"
    	}
    })
    .then((response) => {
    	return response.json()
    })
    .then((response) => {
      res.render("games_show", {game: game, comments: comments, response: response});
    })
    .catch(err => {
    	console.error(err);
    });
  } catch(err){
    console.log(err);
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
  }
  try {
    console.log("Updated Game:", updatedGame)
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
