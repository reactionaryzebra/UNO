let deck;
let game;
let legalPlay;
let lastTurnDraw;
let gameOver;
let allHuman;
const modal = document.querySelector(".modal");
const rulesButton = document.querySelector(".rules-btn");
const rulesScreen = document.querySelector("#rules-screen");
const rulesClose = document.querySelector("#rules-screen .btn");
const selectPlayers = document.querySelector(".select-players");
const playerTypeSelect = document.querySelector(".human-or-computer");
const secondPlayerNameInput = document.querySelector(
  ".second-player-name-input"
);
const turnScreen = document.querySelector("#turn-screen");
const turnMessage = document.querySelector("#turn-message");
const turnReadyButton = document.querySelector(".ready");
const activePlayerHand = document.querySelector(".active-player");
const opponentHand = document.querySelector(".opponent-hand");
const deckDiv = document.querySelector(".deck");
const cardsInPlayDiv = document.querySelector(".cards-in-play");
const wildSelection = document.querySelector("#wild-selection");
const winnerScreen = document.querySelector("#winner-screen");
const winnerMessage = document.querySelector("#winner-message");
const thankYouScreen = document.querySelector("#thank-you-screen");
const turnIndicatorLabel = document.querySelector(".turn-indicator-label");
const opponentTurnIndicator = document.querySelector(
  ".opponent-turn-indicator"
);
const playerTurnIndicator = document.querySelector(".player-turn-indicator");

//Game Operation Functions

const shuffle = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

const deal = (player, numCards) => {
  for (let i = 0; i < numCards; i++) {
    let cardToAdd = deck.cards.pop();
    player.hand.push(cardToAdd);
  }
};

const sortHand = player => {
  player.hand.sort((card1, card2) => {
    if (card1.sortValue < card2.sortValue) {
      return -1
    }
    if (card1.sortValue > card2.sortValue) {
      return 1
    }
    return 0
  })
  for (let i = 0; i < player.hand.length; i++) {
    player.hand[i].handPosition = i
  }
}

//Game Flow Functions

const startGame = namesArr => {
  //initialize variables
  gameOver = false;
  legalPlay = false;
  lastTurnDraw = false;
  allHuman = true;
  //Create new game object
  game = new Game();
  //Create the requisite number of players
  namesArr.forEach(name => {
    if (name === "HAL9000") {
      const newComputerPlayer = new ComputerPlayer();
      game.players.push(newComputerPlayer);
      allHuman = false;
    } else {
      const newHumanPlayer = new Player(name);
      game.players.push(newHumanPlayer);
    }
  });
  //Set random play order and assign seats
  shuffle(game.players);
  for (let i = 0; i < game.players.length; i++) {
    game.players[i].seat = i;
  }
  //Set active Player
  game.activePlayer = game.players[0];
  //Create a new deck
  deck = new Library();
  //Shuffle the deck
  shuffle(deck.cards);
  //Deal 7 to each player
  game.players.forEach(player => {
    deal(player, 7);
    sortHand(player)
  });
  //Flip a card
  game.cardsInPlay.unshift(deck.cards.pop());
  game.activeCard = game.cardsInPlay[0];
  //Show turn screen
  if (!game.players.find(player => player.type === "computer")) {
    renderTurnScreen();
  } else {
    startTurn();
  }
};

const startTurn = () => {
  if (game.activeCard.value === "draw2") {
    deal(game.activePlayer, 2);
  } else if (game.activeCard.value === "wild4") {
    deal(game.activePlayer, 4);
  }
  sortHand(game.activePlayer)
  checkLegal(game.activePlayer.hand);
  renderTable();
  renderHand();
  if (!allHuman) {
    renderTurnIndicator();
  }
  if (game.activePlayer.type === "computer") {
    game.activePlayer.play();
  }
};

const endTurn = () => {
  legalPlay = false;
  checkForWinner();
  if (!gameOver) {
    switchPlayer();
    if (allHuman) {
      renderTurnScreen();
    } else {
      startTurn();
    }
  }
};

const switchPlayer = () => {
  let nextPlayerIndex;
  if (!lastTurnDraw && game.activeCard.value === "skip") {
    nextPlayerIndex = game.activePlayer.seat + 2;
    //Handle the case if play needs to wrap around the array
    if (nextPlayerIndex >= game.players.length) {
      nextPlayerIndex = nextPlayerIndex - game.players.length;
    }
    game.activePlayer = game.players[nextPlayerIndex];
  } else if (!lastTurnDraw && game.activeCard.value === "reverse") {
    if (game.players.length !== 2) {
      nextPlayerIndex = game.activePlayer.seat - 1;
      if (nextPlayerIndex < 0) {
        game.activePlayer = game.players[game.players.length - 1];
      } else {
        game.activePlayer = game.players[nextPlayerIndex];
      }
    }
  } else {
    nextPlayerIndex = game.activePlayer.seat + 1;
    game.activePlayer = game.players[nextPlayerIndex] || game.players[0];
  }
};

//Check Functions

const checkForWinner = () => {
  if (game.activePlayer.hand.length === 0) {
    renderWinnerScreen();
    gameOver = true;
  }
};

const checkLegal = cardsInHand => {
  cardsInHand.forEach(card => {
    if (
      card.color === game.activeCard.color ||
      card.value === game.activeCard.value ||
      card.color === "black"
    ) {
      card.isLegal = true;
      legalPlay = true;
    } else {
      card.isLegal = false;
    }
  });
};

const checkForUno = players => {
  players.forEach(player => {
    if (player.hand.length === 1) {
      player.hasUno = true;
    }
  });
};

//Render Functions

const renderWinnerScreen = () => {
  modal.classList.toggle("visible");
  winnerScreen.classList.toggle("visible");
  if (game.activePlayer instanceof ComputerPlayer) {
    winnerMessage.innerText = `The computer has bested you this time`;
  } else {
    winnerMessage.innerText = `Congratulations to ${
      game.activePlayer.name
    }! You're the winner`;
  }
};

const renderWildSelection = () => {
  modal.classList.toggle("visible");
  wildSelection.classList.toggle("visible");
};

const renderTurnScreen = () => {
  modal.classList.toggle("visible");
  turnScreen.classList.toggle("visible");
  turnMessage.innerText = `It's ${
    game.activePlayer.name
  }'s turn.  Everyone else avert your eyes'`;
};

const renderTable = () => {
  //Display computer's hand if playing vs comp and inactive players' hands if playing
  //another human
  if (!allHuman) {
    opponentHand.innerHTML = "";
    game.players.forEach(player => {
      if (player.type === "computer") {
        player.hand.forEach(card => {
          const opponentCardDiv = document.createElement("div");
          opponentCardDiv.style.backgroundImage = `url(images/back.png)`;
          opponentCardDiv.classList.add("card");
          opponentHand.appendChild(opponentCardDiv);
        });
      }
    });
  } else {
    opponentHand.innerHTML = "";
    game.players.forEach(player => {
      if (player.name != game.activePlayer.name) {
        player.hand.forEach(card => {
          const opponentCardDiv = document.createElement("div");
          opponentCardDiv.style.backgroundImage = `url(images/back.png)`;
          opponentCardDiv.classList.add("card");
          opponentHand.appendChild(opponentCardDiv);
        });
      }
    });
  }

  //Display deck and active cards
  deckDiv.style.backgroundImage = `url(images/back.png)`;
  if (!legalPlay && game.activePlayer.type === "human") {
    deckDiv.classList.add("legal");
  } else {
    deckDiv.classList.remove("legal");
  }
  cardsInPlayDiv.style.backgroundImage = `url(images/${
    game.activeCard.color
  }_${game.activeCard.value}.png)`;
};

const renderHand = () => {
  //Display active Player's hand
  if (!allHuman) {
    activePlayerHand.innerHTML = "";
    game.players
      .find(player => player.type === "human")
      .hand.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.style.backgroundImage = `url(images/${card.color}_${
          card.value
        }.png)`;
        cardDiv.classList.add("card");
        if (card.isLegal && game.activePlayer.type === "human") {
          cardDiv.classList.toggle("legal");
        }
        cardDiv.setAttribute("data-handposition", card.handPosition);
        activePlayerHand.appendChild(cardDiv);
      });
  } else {
    activePlayerHand.innerHTML = "";
    game.activePlayer.hand.forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.style.backgroundImage = `url(images/${card.color}_${
        card.value
      }.png)`;
      cardDiv.classList.add("card");
      if (card.isLegal) {
        cardDiv.classList.toggle("legal");
      }
      cardDiv.setAttribute("data-handposition", card.handPosition);
      activePlayerHand.appendChild(cardDiv);
    });
  }
};

const renderTurnIndicator = () => {
  if (!turnIndicatorLabel.classList.contains("visible")) {
    turnIndicatorLabel.classList.toggle("visible");
  }
  if (game.activePlayer.type === "computer") {
    playerTurnIndicator.style.display = "none";
    opponentTurnIndicator.style.display = "flex";
  } else {
    playerTurnIndicator.style.display = "flex";
    opponentTurnIndicator.style.display = "none";
  }
};

//Event listeners

rulesButton.addEventListener("click", e => {
  modal.classList.toggle("visible");
  rulesScreen.classList.toggle("visible");
});

rulesClose.addEventListener("click", e => {
  modal.classList.toggle("visible");
  rulesScreen.classList.toggle("visible");
});

playerTypeSelect.addEventListener("change", e => {
  if (playerTypeSelect.value === "human") {
    secondPlayerNameInput.classList.toggle("visible");
  } else if (playerTypeSelect.value === "computer") {
    secondPlayerNameInput.value = "HAL9000";
  }
});

selectPlayers.addEventListener("submit", e => {
  e.preventDefault();
  let inputNames = [];
  for (let i = 0; i < e.target.elements.length; i++) {
    if (e.target.elements[i].tagName === "INPUT") {
      inputNames.push(e.target.elements[i].value);
    }
  }
  selectPlayers.classList.toggle("visible");
  modal.classList.toggle("visible");
  startGame(inputNames);
});

turnReadyButton.addEventListener("click", e => {
  turnScreen.classList.toggle("visible");
  modal.classList.toggle("visible");
  startTurn();
});

activePlayerHand.addEventListener("click", e => {
  if (game.activePlayer.hand[e.target.dataset.handposition].isLegal === true) {
    game.activePlayer.play(
      game.activePlayer.hand[e.target.dataset.handposition]
    );
  }
});

deckDiv.addEventListener("click", e => {
  if (!legalPlay) {
    deal(game.activePlayer, 1);
    lastTurnDraw = true;
    checkLegal(game.activePlayer.hand);
    renderHand();
    deckDiv.classList.remove("legal");
    if (!legalPlay) {
      endTurn();
    }
  }
});

wildSelection.addEventListener("click", e => {
  game.activeCard.color = e.target.innerHTML.toLowerCase();
  modal.classList.toggle("visible");
  wildSelection.classList.toggle("visible");
  endTurn();
});

winnerScreen.addEventListener("click", e => {
  if (e.target.innerHTML === "Yes") {
    winnerScreen.classList.toggle("visible");
    selectPlayers.classList.toggle("visible");
  } else {
    winnerScreen.classList.toggle("visible");
    thankYouScreen.classList.toggle("visible");
  }
});