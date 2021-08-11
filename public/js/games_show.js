//Select elements
const upvote_button = document.getElementById("upvote_button");
const downvote_button = document.getElementById("downvote_button");
const score = document.getElementById("vote_score");

//Add event listeners
const send_vote = async(vote_type) => {
  //build fetch options
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (vote_type === 'up') {
    options.body = JSON.stringify({vote: "up", gameId})
  } else if (vote_type === 'down'){
    options.body = JSON.stringify({vote: "down", gameId})
  } else {
    throw "vote_type must be either 'up' or 'down'."
  }

  //send fetch request
  await fetch("/games/vote", options)
  .then(data => {
    return data.json()
  })
  .then(res => {
    console.log(res);
    handle_vote(res.score, res.code);
  })
  .catch(err => {
    console.log(err);
  });
}

const handle_vote = (newScore, code) => {
  score.innerText = newScore;
  if (code === 0){
    upvote_button.classList.remove("btn-success");
    upvote_button.classList.add("btn-outline-success");
    downvote_button.classList.remove("btn-danger");
    downvote_button.classList.add("btn-outline-danger");

  } else if (code === -1) {
    upvote_button.classList.remove("btn-success");
    upvote_button.classList.add("btn-outline-success");
    downvote_button.classList.remove("btn-outline-danger");
    downvote_button.classList.add("btn-danger");

  } else if (code === 1) {
    upvote_button.classList.remove("btn-outline-success");
    upvote_button.classList.add("btn-success");
    downvote_button.classList.remove("btn-danger");
    downvote_button.classList.add("btn-outline-danger");

  } else {
    console.log("Error inside handle_vote")
  }
}

upvote_button.addEventListener("click", async function() {
  send_vote('up');
});

downvote_button.addEventListener("click", async function() {
  send_vote('down');
});
