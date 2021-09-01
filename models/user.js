const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
userSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  username: {type: String, unique: true, required: true},
  want: Array,
  playing: Array,
  completed: Array,
  avatar: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);
