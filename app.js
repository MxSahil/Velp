// ===========================
// IMPORTS
// ===========================
//NPM Imports
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

//Config Imports
let config
try {
  config = require("./config");

} catch(err){
  console.log("Could not import config file.");
  console.log(err);

}

//Route Imports
const gameRoutes = require('./routes/games');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');

//Model Imports
const Game = require('./models/game');
const Comment = require('./models/comment');
const User = require('./models/user');


// ===========================
// DEVELOPEMENT
// ===========================
// Morgan
app.use(morgan('tiny'));

// Seed the DB
// const seed = require('./utils/seed');
// seed();

// ===========================
// DEVELOPEMENT
// ===========================
// MongoDB connection
try {
  mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} catch(err){
  console.log("Could not connect using config");
  mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
}
mongoose.Promise = global.Promise;

//Express Session Config
app.use(expressSession({
  secret: process.env.ES_SECRET || config.expressSession.secret,
  resave: false,
  saveUninitialized: false
}));

//PASSPORT Config
app.use(passport.initialize())
app.use(passport.session()) //Allows persistent sessions
passport.serializeUser(User.serializeUser()); //Encodes data into the session (passport-local-mongoose)
passport.deserializeUser(User.deserializeUser()); //decodes data from the session (passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));

// Express Config
app.set("view engine", "ejs");
app.use(express.static("public"));

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

// Method Override Config
app.use(methodOverride("_method"));

//Current User Middleware config
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Route Config
app.use(gameRoutes);
app.use(commentRoutes);
app.use(mainRoutes);
app.use(authRoutes);

// ===========================
// LISTEN
// ===========================
app.listen(process.env.PORT || 3000, () => {
  console.log("yelp_clone is running...");
});
