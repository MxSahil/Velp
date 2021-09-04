const express = require('express');
const router = express.Router()
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');


const Comment = require('../models/comment');
const Game = require('../models/game');

//Form for a new comment
router.get("/games/:id/comments/new", isLoggedIn, (req, res) =>{
  res.render("comments_new", {gameID: req.params.id})
});

//CREATE the comment
router.post("/games/:id/comments", isLoggedIn, async (req, res) =>{
  try {

    let comment = await Comment.create({
      user: {id: req.user._id, username: req.user.username, avatar: req.user.avatar},
      text: req.body.text,
      gameID: req.body.gameID,
      date: new Date()
    });
    req.flash("success", "Comment posted!");
    res.redirect(`/games/${req.body.gameID}`);
  } catch(err) {
    console.log(err);
    req.flash("error", "Failed to post comment");
    res.redirect(`/games/${req.body.gameID}`);
  }
});

//form to EDIT a comment
router.get("/games/:id/comments/:commentid/edit", checkCommentOwner, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id).exec();
    let comment = await Comment.findById(req.params.commentid).exec();
    res.render("comments_edit", {game, comment});
  } catch(err){
    console.log(err);
    res.send("Error");
  }
});

//UPDATE the comment in the database
router.put("/games/:id/comments/:commentid", checkCommentOwner, async (req, res) => {

    try {
      let comment = await Comment.findByIdAndUpdate(req.params.commentid, {text: req.body.text}, {new: true});
      req.flash("success", "Comment updated!");
      res.redirect(`/games/${req.params.id}`);
    } catch(err){
      console.log(err);
      req.flash("error", "Failed to update comment");
      res.redirect(`/games/${req.params.id}`);
    }
});

//DELETE a comment from the database
router.delete("/games/:id/comments/:commentid", checkCommentOwner, async (req, res) => {
  try {
    let comment = await Comment.findByIdAndDelete(req.params.commentid);
    req.flash("success", "Comment deleted!");
    res.redirect(`/games/${req.params.id}`);
  } catch(err){
    console.log(err);
    req.flash("error", "Failed to delete comment");
    res.redirect(`/games/${req.params.id}`);
  }
});

router.post("/games/:id/comments/:commentid/vote", isLoggedIn, async(req, res) => {
  const comment = await Comment.findById(req.body.commentID);
  const checkLike = comment.likes.indexOf(req.user.username);
  const checkDislike = comment.dislikes.indexOf(req.user.username);

  let response = {};
  if (checkLike === -1 && checkDislike === -1) { //Not vote yet
    if (req.body.vote === "like"){
      comment.likes.push(req.user.username);
      comment.save();
      response.message = "Like recorded";
      response.code = 1;

    } else if (req.body.vote === "dislike"){
      comment.dislikes.push(req.user.username);
      comment.save();
      response.message = "Dislike recorded";
      response.code = -1;

    } else {
      response.message = "Error 1: Not voted yet";
      response.code = "err";
    }

  } else if (checkLike >= 0) { // already Liked
    if (req.body.vote === "like"){
      comment.likes.splice(checkLike, 1);
      comment.save();
      response.message = "Like removed";
      response.code = 0;
    } else if (req.body.vote === "dislike"){
      comment.likes.splice(checkLike, 1);
      comment.dislikes.push(req.user.username)
      comment.save();
      response.message = "Like changed to Dislike";
      response.code = -1;
    } else {
      response.message = "Error 2: already Liked";
      response.code = "err";
    }

  } else if (checkDislike >= 0) { // already Disliked
    if (req.body.vote === "like"){
      comment.dislikes.splice(checkDislike, 1);
      comment.likes.push(req.user.username)
      comment.save();
      response.message = "Dislike changed to Like";
      response.code = 1;
    } else if (req.body.vote === "dislike"){
      comment.dislikes.splice(checkDislike, 1);
      comment.save();
      response.message = "Dislike removed";
      response.code = 0;
    } else {
      response.message = "Error 3: already Disliked"
      response.code = "err";
    }

  } else { //error
    response.message = "Error 4";
    response.code = "err";
  }

  response.likes = comment.likes.length - comment.dislikes.length;
  console.log(response);
  res.json(response);

})

module.exports = router;
