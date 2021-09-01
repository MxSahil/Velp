const myGamesButton = document.getElementById("myGamesButton");
const wantButton = document.getElementById("wantButton");
const playingButton = document.getElementById("playingButton");
const completedButton = document.getElementById("completedButton");
const myGamesSection = document.getElementById("myGamesSection");
const wantSection = document.getElementById("wantSection");
const playingSection = document.getElementById("playingSection");
const completedSection = document.getElementById("completedSection");


const send_collection = async (collection_type) => {
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (collection_type === 'my_games') {
    options.body = JSON.stringify({collectionType: "myGames"})
  } else if (collection_type === 'want'){
    options.body = JSON.stringify({collectionType: "want"})
  } else if (collection_type === 'playing'){
    options.body = JSON.stringify({collectionType: "playing"})
  } else if (collection_type === 'completed'){
    options.body = JSON.stringify({collectionType: "completed"})
  } else {
    throw "Collection must be either 'want', 'playing' or 'completed' or 'myGames'."
  }

  await fetch("/my-account/collection", options)
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
  if (code == 1){
    myGamesSection.style.removeProperty('display');
    wantSection.style.display = 'none';
    playingSection.style.display = 'none';
    completedSection.style.display = 'none';
  } else if (code == 2){
    myGamesSection.style.display = 'none';
    wantSection.style.removeProperty('display');
    playingSection.style.display = 'none';
    completedSection.style.display = 'none';

  } else if (code == 3) {
    myGamesSection.style.display = 'none';
    wantSection.style.display = 'none';
    playingSection.style.removeProperty('display');
    completedSection.style.display = 'none';

  } else if (code == 4) {
    myGamesSection.style.display = 'none';
    wantSection.style.display = 'none';
    playingSection.style.display = 'none';
    completedSection.style.removeProperty('display');

  } else {
    console.log("Error inside account.js/handle_collection")
  }
}

myGamesButton.addEventListener("click", async function() {
  send_collection("my_games")
});

wantButton.addEventListener("click", async function() {
  send_collection("want")
});

playingButton.addEventListener("click", async function() {
  send_collection("playing")
});

completedButton.addEventListener("click", async function() {
  send_collection("completed")
});
