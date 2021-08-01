const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  user: {id: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User"
              },
        username: String},
  text: String,
  gameID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "game"
  }
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
