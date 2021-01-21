const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config");
const mongoose = require('mongoose');
const Game = require('./models/game')
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true});

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/games", (req, res) => {
  Game.find()
  .exec()
  .then((games) => {
    res.render("games", {games: games});
  })
  .catch((err) => {
    console.log(err);
    res.send(err)
  })
});

app.post("/games", (req, res) => {
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
    esrb: req.body.esrb
  }
  Game.create(newGame)
  .then((game) => {
    console.log(game);
    res.redirect("/games");
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/games");
  })
});

app.get("/games/new", (req, res) => {
  res.render("games_new");
});


app.get("/games/:id" , (req, res) =>{
  Game.findById(req.params.id)
  .exec()
  .then((game) => {
      res.render("comics_show", {game: game});
  })
  .catch((err) => {
    res.send(err);
  })
});


app.listen(3000, () => {
  console.log("yelp_clone is running...");
});
