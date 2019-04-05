let deck;
let game;
let numPlayers;
let legalPlay = false;
const modal = document.querySelector('.modal')
const selectNumPlayers = document.getElementById('select-number-players')
const selectHumanPlayers = document.getElementById('select-human-players')
const turnScreen = document.getElementById('turn-screen')
const turnMessage = document.getElementById('turn-message')
const readyButton = document.querySelector('.ready')
const activePlayerHand = document.querySelector('.active-player')
const deckDiv = document.querySelector('.deck')
const cardsInPlayDiv = document.querySelector('.cards-in-play')

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
  //Show turn screen
  renderTurnScreen()
}

const startTurn = () => {
  checkLegal(game.activePlayer.hand)
  renderTable();
}

const endTurn = () => {
  legalPlay = false
  renderTable()
  checkForWinner()
  switchPlayer()
  modal.classList.toggle('visible')
  renderTurnScreen()
}

const checkForWinner = () => {
  if (game.activePlayer.hand.length === 0){
    renderWinnerScreen()
  }
}

const switchPlayer = () => {
  let nextPlayerIndex;
  if (game.activeCard.value === 'skip') {
    nextPlayerIndex = game.activePlayer.seat + 2
    //Handle the case if play needs to wrap around the array
    if (nextPlayerIndex  >= game.players.length){
      nextPlayerIndex = nextPlayerIndex - game.players.length
    }
    game.activePlayer = game.players[nextPlayerIndex]
  } else if (game.activeCard.value === 'reverse'){
    nextPlayerIndex = game.activePlayer.seat - 1
    game.activePlayer = ((game.players[nextPlayerIndex]) || (game.players[game.players.length -1]))
  } else {
    nextPlayerIndex = game.activePlayer.seat + 1
    game.activePlayer = (game.players[nextPlayerIndex] || game.players[0])
  }
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
    } else {
      card.isLegal = false;
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

const renderTurnScreen = () => {
  turnScreen.classList.toggle('visible')
  turnMessage.innerText = `It's ${game.activePlayer.name}'s turn.  Everyone else avert your eyes'`
}

const renderTable = () => {
  activePlayerHand.innerHTML = ''
  game.activePlayer.hand.forEach(card => {
    const cardDiv = document.createElement('div')
    cardDiv.style.backgroundImage = `url(images/${card.color}_${card.value}.png)`
    cardDiv.classList.add('card')
    cardDiv.setAttribute('data-handposition', card.handPosition)
    activePlayerHand.appendChild(cardDiv)
  })
  deckDiv.style.backgroundImage = `url(images/large/back.png)`
  cardsInPlayDiv.style.backgroundImage = `url(images/large/${game.activeCard.color}_${game.activeCard.value}.png)`
}

selectNumPlayers.addEventListener('click', e => {
  numPlayers = e.target.innerText
  selectNumPlayers.classList.toggle('visible')
  selectHumanPlayers.classList.toggle('visible')
})

selectHumanPlayers.addEventListener('submit', e => {
  e.preventDefault()
  let inputNames = []
  for (let i = 0; i < numPlayers; i++) {
    inputNames.push(e.target.elements[i].value)
  }
  selectHumanPlayers.classList.toggle('visible')
  startGame(inputNames)
})

readyButton.addEventListener('click', e => {
  turnScreen.classList.toggle('visible')
  modal.classList.toggle('visible')
  startTurn()
})

activePlayerHand.addEventListener('click', e => {
  if (game.activePlayer.hand[e.target.dataset.handposition].isLegal === true){
    game.activePlayer.play(game.activePlayer.hand[e.target.dataset.handposition])
  }
})

deckDiv.addEventListener('click', e => {
  if (!legalPlay) {
    deal(game.activePlayer, 1)
    checkLegal(game.activePlayer.hand)
    if (!legalPlay) {
      endTurn()
    }
  }
})
