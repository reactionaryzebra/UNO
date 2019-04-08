let deck
let game
let legalPlay = false
let lastTurnDraw = false
let allHuman = true
const modal = document.querySelector('.modal')
const selectHumanPlayers = document.querySelector('.select-players')
const turnScreen = document.querySelector('#turn-screen')
const turnMessage = document.querySelector('#turn-message')
const readyButton = document.querySelector('.ready')
const activePlayerHand = document.querySelector('.active-player')
const deckDiv = document.querySelector('.deck')
const cardsInPlayDiv = document.querySelector('.cards-in-play')
const wildSelection = document.querySelector('#wild-selection')
const winnerScreen = document.querySelector('#winner-screen')
const winnerMessage = document.querySelector('#winner-message')
const opponentHandDiv = document.querySelector('.opponent-hand')
const playerTypeSelect = document.querySelector('.human-or-computer')
const secondPlayerNameInput = document.querySelector('.second-player-name-input')

//Game Operation Functions

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

const deal = (player, numCards) => {
  for (let i = 0; i < numCards; i++) {
    let cardToAdd = deck.cards.pop()
    cardToAdd.handPosition = player.hand.length
    player.hand.push(cardToAdd)
  }
}

//Game Flow Functions

const startGame = (namesArr) => {
  //Create new game object
  game = new Game
  //Create the requisite number of players
  namesArr.forEach(name => {
    if (name === 'HAL9000'){
      const newComputerPlayer = new ComputerPlayer
      game.players.push(newComputerPlayer)
      allHuman = false;
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
  if (!game.players.find(player => player.type === 'computer')){
    renderTurnScreen()
  } else {
    startTurn()
  }
}

const startTurn = () => {
  if (game.activeCard.value === 'draw2'){
    deal(game.activePlayer, 2)
  } else if (game.activeCard.value === 'wild4') {
    deal(game.activePlayer, 4)
  }
  checkLegal(game.activePlayer.hand)
  renderTable()
  if (game.activePlayer.type === 'computer'){
    game.activePlayer.play();
  }
}

const endTurn = () => {
  legalPlay = false
  checkForWinner()
  switchPlayer()
  if (allHuman){
    renderTurnScreen()
  } else {
    startTurn()
  }
}

const switchPlayer = () => {
  let nextPlayerIndex
  if ((!lastTurnDraw) && (game.activeCard.value === 'skip')) {
    nextPlayerIndex = game.activePlayer.seat + 2
    //Handle the case if play needs to wrap around the array
    if (nextPlayerIndex >= game.players.length) {
      nextPlayerIndex = nextPlayerIndex - game.players.length
    }
    game.activePlayer = game.players[nextPlayerIndex]
  } else if ((!lastTurnDraw) && (game.activeCard.value === 'reverse')) {
    if (game.players.length !== 2) {
      nextPlayerIndex = game.activePlayer.seat - 1
      if (nextPlayerIndex < 0) {
        game.activePlayer = game.players[game.players.length - 1]
      } else {
        game.activePlayer = game.players[nextPlayerIndex]
      }
    }
  } else {
    nextPlayerIndex = game.activePlayer.seat + 1
    game.activePlayer = (game.players[nextPlayerIndex] || game.players[0])
  }
}

//Check Functions

const checkForWinner = () => {
  if (game.activePlayer.hand.length === 0) {
    renderWinnerScreen()
  }
}

const checkLegal = (cardsInHand) => {
  cardsInHand.forEach(card => {
    if ((card.color === game.activeCard.color) || (card.value === game.activeCard.value) || (card.color === 'black')) {
      card.isLegal = true
      legalPlay = true
    } else {
      card.isLegal = false
    }
  })
}

const checkForUno = (players) => {
  players.forEach(player => {
    if (player.hand.length === 1) {
      player.hasUno = true
    }
  })
}

//Render Functions

const renderWinnerScreen = () => {
  modal.classList.toggle('visible')
  winnerScreen.classList.toggle('visible')
  winnerMessage.innerText = `Congratulations to ${game.activePlayer.name}! You're the winner`
}

const renderWildSelection = () => {
  modal.classList.toggle('visible')
  wildSelection.classList.toggle('visible')
}

const renderTurnScreen = () => {
  modal.classList.toggle('visible')
  turnScreen.classList.toggle('visible')
  turnMessage.innerText = `It's ${game.activePlayer.name}'s turn.  Everyone else avert your eyes'`
}

const renderTable = () => {
  //Display inactive players' hands
  opponentHandDiv.innerHTML = ''
  game.players.forEach(player => {
    if (player.name != game.activePlayer.name) {
      player.hand.forEach(card => {
        const opponentCardDiv = document.createElement('div')
        opponentCardDiv.style.backgroundImage = `url(images/back.png)`
        opponentCardDiv.classList.add('card')
        opponentHandDiv.appendChild(opponentCardDiv)
      })
    }
  })

  //Display active Player's hand
  if (!allHuman) {
    activePlayerHand.innerHTML = ''
    game.players.find(player => player.type === 'human').hand.forEach(card => {
      const cardDiv = document.createElement('div')
      cardDiv.style.backgroundImage = `url(images/${card.color}_${card.value}.png)`
      cardDiv.classList.add('card')
      if (card.isLegal) {
        cardDiv.classList.toggle('legal')
      }
      cardDiv.setAttribute('data-handposition', card.handPosition)
      activePlayerHand.appendChild(cardDiv)
    })
  } else {
    activePlayerHand.innerHTML = ''
    game.activePlayer.hand.forEach(card => {
      const cardDiv = document.createElement('div')
      cardDiv.style.backgroundImage = `url(images/${card.color}_${card.value}.png)`
      cardDiv.classList.add('card')
      if (card.isLegal) {
        cardDiv.classList.toggle('legal')
      }
      cardDiv.setAttribute('data-handposition', card.handPosition)
      activePlayerHand.appendChild(cardDiv)
    })
  }

  //Display deck and active cards
  deckDiv.style.backgroundImage = `url(images/large/back.png)`
  if (!legalPlay) {
    deckDiv.classList.toggle('legal')
  }
  cardsInPlayDiv.style.backgroundImage = `url(images/large/${game.activeCard.color}_${game.activeCard.value}.png)`
}

//Event listeners

playerTypeSelect.addEventListener('change', e => {
  if (playerTypeSelect.value === 'human') {
    secondPlayerNameInput.classList.toggle('visible')
  } else if (playerTypeSelect.value === 'computer') {
    secondPlayerNameInput.value = 'HAL9000'
  }
})

selectHumanPlayers.addEventListener('submit', e => {
  e.preventDefault()
  let inputNames = []
  for (let i = 0; i < e.target.elements.length; i++) {
    if (e.target.elements[i].tagName === 'INPUT') {
      inputNames.push(e.target.elements[i].value)
    }
  }
  selectHumanPlayers.classList.toggle('visible')
  modal.classList.toggle('visible')
  startGame(inputNames)
})

readyButton.addEventListener('click', e => {
  turnScreen.classList.toggle('visible')
  modal.classList.toggle('visible')
  startTurn()
})

activePlayerHand.addEventListener('click', e => {
  if (game.activePlayer.hand[e.target.dataset.handposition].isLegal === true) {
    game.activePlayer.play(game.activePlayer.hand[e.target.dataset.handposition])
  }
})

deckDiv.addEventListener('click', e => {
  if (!legalPlay) {
    deal(game.activePlayer, 1)
    lastTurnDraw = true;
    checkLegal(game.activePlayer.hand)
    deckDiv.classList.toggle('legal')
    renderTable()
    if (!legalPlay) {
      endTurn()
    }
  }
})

wildSelection.addEventListener('click', e => {
  game.activeCard.color = e.target.innerHTML.toLowerCase()
  modal.classList.toggle('visible')
  wildSelection.classList.toggle('visible')
  endTurn()
})
