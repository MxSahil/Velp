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
      user: {id: req.user._id, username: req.user.username},
      text: req.body.text,
      gameID: req.body.gameID,
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

module.exports = router;
