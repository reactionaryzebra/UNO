let deck;
let numPlayers;
let legalPlay = false;
const selectNumPlayers = document.getElementById('select-number-players')
const selectHumanPlayers = document.getElementById('select-human-players')


const startGame(playersArr) {
  //Create new game object
  game = new Game
  //Create the requisite number of players
  playersArr.forEach(player => {
    if (player.type === 'human'){
      const newHumanPlayer = new player
      game.players.push(newHuanPlayer)
    } else {
      const newComputerPlayer = new ComputerPlayer
      game.players.push(newComputerPlayer)
    }
  })
  //Roll die to see who goes first
  shuffle(players)
  //Make ^^ person active player
  game.activePlayer = game.players[0]
  //Create a new deck
  deck = new Library
  //Shuffle the deck
  shuffle(deck)
  //Deal 7 to each player
  game.players.forEach(player => {
    deal(player, 7)
  })
  //Flip a card
  game.cardsInPlay.unshift(deck.cards.pop())
  game.activeCard = game.cardsInPlay[0]
}

const shuffle(array){
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

selectNumPlayers.addEventListener('click', (e) => {
  numPlayers = e.target.innerText;
  game.init();
})

// //Hide graphic to select # players
// selectNumPlayers.classList.toggle('visible')
// //Display graphic to allow User to slect # computer players
// selectHumanPlayers.classList.toggle('visible')
// if (numPlayers === '4'){
//   document.querySelectorAll('.player-3-selector').forEach(node => node.classList.toggle('visible'))
//   document.querySelectorAll('.player-4-selector').forEach(node => node.classList.toggle('visible'))
// } else if (numPlayers === '3'){
//   document.querySelectorAll('.player-3-selector').forEach(node => node.classList.toggle('visible'))
// }
