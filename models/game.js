const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  genres: Array,
  releaseDate: Date,
  developer: Array,
  publisher: Array,
  // sameSeries: Array, IDEA: determine this list on the backend
  platforms: Array,
  metacritic: Number,
  esrb: String
});
const Game = mongoose.model("game", gameSchema);
module.exports = Game;
