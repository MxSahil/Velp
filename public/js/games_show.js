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
  })
  .catch(err => {
    console.log(err);
  });

}

upvote_button.addEventListener("click", async function() {
  send_vote('up');
});

downvote_button.addEventListener("click", async function() {
  send_vote('down');
});
