//Select elements
const upvote_button = document.getElementById("upvote_button");
const downvote_button = document.getElementById("downvote_button");
const score = document.getElementById("vote_score");
const want_button = document.getElementById("want-icon");
const playing_button = document.getElementById("playing-icon");
const completed_button = document.getElementById("completed-icon");
const want_text = document.getElementById("want-text");
const playing_text = document.getElementById("playing-text");
const completed_text = document.getElementById("completed-text");


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


const send_collection = async (collection_type) => {
  //build fetch options
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (collection_type === 'want') {
    options.body = JSON.stringify({collection: "want", gameId})
  } else if (collection_type === 'playing'){
    options.body = JSON.stringify({collection: "playing", gameId})
  } else if (collection_type === 'completed'){
    options.body = JSON.stringify({collection: "completed", gameId})
  } else {
    throw "Collection must be either 'want', 'playing' or 'completed'."
  }

  //send fetch request
  await fetch("/games/collection", options)
  .then(data => {
    return data.json()
  })
  .then(res => {
    console.log(res);
    handle_collection(res.code)
  })
  .catch(err => {
    console.log(err);
  });
}

const handle_collection = (code) => {
  console.log(code);
  if (code === 1){
    want_button.classList.remove("game-experience-icons")
    want_text.classList.remove("game-experience-text")
    want_button.classList.add("game-experience-icons-clicked")
    want_text.classList.add("game-experience-text-clicked")

    playing_button.classList.remove("game-experience-icons-clicked")
    playing_text.classList.remove("game-experience-text-clicked")
    playing_button.classList.add("game-experience-icons")
    playing_text.classList.add("game-experience-text")

    completed_button.classList.remove("game-experience-icons-clicked")
    completed_text.classList.remove("game-experience-text-clicked")
    completed_button.classList.add("game-experience-icons")
    completed_text.classList.add("game-experience-text")

  } else if (code === 2) {
    want_button.classList.remove("game-experience-icons-clicked")
    want_text.classList.remove("game-experience-text-clicked")
    want_button.classList.add("game-experience-icons")
    want_text.classList.add("game-experience-text")

    playing_button.classList.remove("game-experience-icons")
    playing_text.classList.remove("game-experience-text")
    playing_button.classList.add("game-experience-icons-clicked")
    playing_text.classList.add("game-experience-text-clicked")

    completed_button.classList.remove("game-experience-icons-clicked")
    completed_text.classList.remove("game-experience-text-clicked")
    completed_button.classList.add("game-experience-icons")
    completed_text.classList.add("game-experience-text")

  } else if (code === 3) {
    want_button.classList.remove("game-experience-icons-clicked")
    want_text.classList.remove("game-experience-text-clicked")
    want_button.classList.add("game-experience-icons")
    want_text.classList.add("game-experience-text")

    playing_button.classList.remove("game-experience-icons-clicked")
    playing_text.classList.remove("game-experience-text-clicked")
    playing_button.classList.add("game-experience-icons")
    playing_text.classList.add("game-experience-text")

    completed_button.classList.remove("game-experience-icons")
    completed_text.classList.remove("game-experience-text")
    completed_button.classList.add("game-experience-icons-clicked")
    completed_text.classList.add("game-experience-text-clicked")

  } else if (code === 0) {
    want_button.classList.remove("game-experience-icons-clicked")
    want_text.classList.remove("game-experience-text-clicked")
    want_button.classList.add("game-experience-icons")
    want_text.classList.add("game-experience-text")

    playing_button.classList.remove("game-experience-icons-clicked")
    playing_text.classList.remove("game-experience-text-clicked")
    playing_button.classList.add("game-experience-icons")
    playing_text.classList.add("game-experience-text")

    completed_button.classList.remove("game-experience-icons-clicked")
    completed_text.classList.remove("game-experience-text-clicked")
    completed_button.classList.add("game-experience-icons")
    completed_text.classList.add("game-experience-text")
  } else {
    console.log("Error inside handle_collection")

  }

}

upvote_button.addEventListener("click", async function() {
  send_vote('up');
});

downvote_button.addEventListener("click", async function() {
  send_vote('down');
});

want_button.addEventListener("click", async function() {
  send_collection("want")
})

want_text.addEventListener("click", async function() {
  send_collection("want")
})

playing_button.addEventListener("click", async function() {
  send_collection("playing")
})

playing_text.addEventListener("click", async function() {
  send_collection("playing")
})

completed_button.addEventListener("click", async function() {
  send_collection("completed")
})

completed_text.addEventListener("click", async function() {
  send_collection("completed")
})
