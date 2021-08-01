const Game = require("../models/game");
const Comment = require("../models/comment")

const game_seeds = [
  {
    title: "Call of Duty: Modern Warfare",
    description: "Call of Duty: Modern Warfare is a 2019 first-person shooter video game developed by Infinity Ward and published by Activision.",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/CallofDutyModernWarfare%282019%29.jpg/220px-CallofDutyModernWarfare%282019%29.jpg",
    genres: ["Action", "Shooter"],
    releaseDate: "2019-10-25T00:00:00.000+00:00",
    developer: ["Infinity Ward"],
    publisher: ["Activision Blizzard"],
    platforms: ["PC", "Playstation 4", "Xbox One"],
    metacritic: 87,
    esrb: "Mature 17+"
  },

  {
    title: "Call of Duty: Black Ops III",
    description: "Call of Duty: Black Ops III takes place in 2065, 40 years after the events of Black Ops II, in a world facing upheaval from conflicts, climate change and new technologies. A Third Cold War is ongoing between two global alliances, known as Winslow Accord and Common Defense Pact.",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Black_Ops_3.jpg/220px-Black_Ops_3.jpg",
    genres: ["Shooter"],
    releaseDate: "2015-11-06T00:00:00.000+00:00",
    developer: ["Treyarch"],
    publisher: ["Activision Blizzard"],
    platforms: ["PC", "Playstation 4", "Xbox One", "Playstation 3", "Xbox 360"],
    metacritic: 83,
    esrb: "Mature 17+"
  },

  {
    title: "NHL 21",
    description: "NHL 21 is an ice hockey simulation video game developed by EA Vancouver and published by EA Sports. It is the 30th installment in the NHL game series and was released for the PlayStation 4 and Xbox One consoles in October 2020.",
    image: "https://upload.wikimedia.org/wikipedia/en/1/19/NHL_21_cover_art.jpg",
    genres: ["Simulator", "Sport"],
    releaseDate: "2020-10-16T00:00:00.000+00:00",
    developer: ["EA Vancouver"],
    publisher: ["Electronic Arts"],
    platforms: ["Playstation 4", "Xbox One"],
    metacritic: 72,
    esrb: "Everyone"
  }
];

const seed = async () => {
  // Delete all current games and comments
  await Game.deleteMany();
  console.log("Deleted all the games");
  await Comment.deleteMany();
  console.log("Deleted all the comments");

  // Create three new games
  // for (const game_seed of game_seeds) {
  //   let game = await Game.create(game_seed);
  //   console.log("Created a new Game: ", game.title);
  // Create a new comment for each game
  //   await Comment.create({
  //     text: "I love this game",
  //     user: "Michael Jordan",
  //     gameID: game._id
  //   })
  //   console.log("Created a new Comment");
  // }

  console.log("Seed DB");
}

module.exports = seed;
