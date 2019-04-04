let deck;
let game;
let numPlayers;
let legalPlay = false;
let needToDraw = false;
const selectNumPlayers = document.getElementById('select-number-players')
const selectHumanPlayers = document.getElementById('select-human-players')

const startGame = (namesArr) => {
  //Create new game object
  game = new Game
  //Create the requisite number of players
  namesArr.forEach(name => {
    if (name === 'HAL9000'){
      const newComputerPlayer = new ComputerPlayer
      game.players.push(newComputerPlayer)
    } else {
      const newHumanPlayer = new Player(name)
      game.players.push(newHumanPlayer)
    }
  })
  //Set random play order and assign seats
  shuffle(game.players)
  for (let i = 0; i < game.players.length; i++) {
    game.players[i].seat = i;
  }
  //Set active Player
  game.activePlayer = game.players[0]
  //Create a new deck
  deck = new Library
  //Shuffle the deck
  shuffle(deck.cards)
  //Deal 7 to each player
  game.players.forEach(player => {
    deal(player, 7)
  })
  //Flip a card
  game.cardsInPlay.unshift(deck.cards.pop())
  game.activeCard = game.cardsInPlay[0]
  //Start first player's turn
  startTurn()
}



const startTurn = () => {
  checkLegal(game.activePlayer.hand)
  if (!legalPlay) {
    needToDraw = true;
  }
  renderTable();
}

const endTurn = () => {
  checkForWinner()
  switchPlayer()
}

const checkForWinner = () => {
  if (game.activePlayer.hand.length === 0){
    showWinnerScreen()
  }
}

const switchPlayer = () => {
  game.activePlayer = (game.players[game.activePlayer.seat + 1] || game.players[0])
}

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

const deal = (player, numCards) => {
  for (let i = 0; i < numCards; i++) {
    let cardToAdd = deck.cards.pop()
    cardToAdd.handPosition = player.hand.length
    player.hand.push(cardToAdd)
  }
}

const checkLegal = (cardsInHand) => {
  cardsInHand.forEach(card => {
    if ((card.color === game.activeCard.color) || (card.value === game.activeCard.value) || (card.color === 'black')){
      card.isLegal = true;
      legalPlay = true;
    }
  })
}

const checkForUno = (players) => {
  players.forEach(player => {
    if (player.hand.length === 1) {
      player.hasUno = true;
    }
  })
}
