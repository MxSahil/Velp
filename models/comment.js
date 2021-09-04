const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  user: {id: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
              },
        username: String,
        avatar: String},
  text: String,
  gameID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "game"
  },
  date: Date,
  likes: Array,
  dislikes: Array
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
