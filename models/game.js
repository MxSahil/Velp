const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  genres: Array,
  releaseDate: Date,
  developer: Array,
  publisher: Array,
  platforms: Array,
  metacritic: Number,
  esrb: String,
  owner: {
          id: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
              },
          username: String}
});

gameSchema.index({
  '$**': 'text'
});
const Game = mongoose.model("game", gameSchema);
module.exports = Game;
