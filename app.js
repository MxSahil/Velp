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
const flash = require('connect-flash');


//Config Imports
try {
  var config = require("./config");
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
console.log("Connecting to MongoDB")
try {
  mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  console.log( 'Database Connected via config' );
} catch(e){
  mongoose.connect(process.env.DB_CONNECTION_STRING || config.db.connection, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
          .then(connect => console.log('connected to mongodb..'))
          .catch(e => console.log('could not connect to mongodb', e));
}
mongoose.Promise = global.Promise;

//Express Session Config
app.use(expressSession({
  secret: process.env.EXPRESS_SESSION_SECRET || config.expressSession.secret,
  resave: false,
  saveUninitialized: false
}));

// Method Override Config
app.use(methodOverride("_method"));

//Connect-Flash Config
app.use(flash());

//PASSPORT Config
app.use(passport.initialize());
app.use(passport.session()); //Allows persistent sessions
passport.serializeUser(User.serializeUser()); //Encodes data into the session (passport-local-mongoose)
passport.deserializeUser(User.deserializeUser()); //decodes data from the session (passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));

// Express Config
app.set("view engine", "ejs");
app.use(express.static("public"));

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

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
