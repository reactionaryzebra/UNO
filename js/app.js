let deck;
let numPlayers;
let legalPlay = false;
const selectNumPlayers = document.getElementById('select-number-players')
const selectHumanPlayers = document.getElementById('select-human-players')

const game = {
  players: [],
  seats: [],
  cardsInPlay: [],
  activeCard: {},
  activePlayer: {},
  init(){
    //Hide graphic to select # players
    selectNumPlayers.classList.toggle('visible')
    //Display graphic to allow User to slect # computer players
    selectHumanPlayers.classList.toggle('visible')
    if (numPlayers === '4'){
      document.querySelectorAll('.player-3-selector').forEach(node => node.classList.toggle('visible'))
      document.querySelectorAll('.player-4-selector').forEach(node => node.classList.toggle('visible'))
    } else if (numPlayers === '3'){
      document.querySelectorAll('.player-3-selector').forEach(node => node.classList.toggle('visible'))
    }
    //Display graphic to ask User their name
    //Set players array to players based on previous input
    //Display graphic to roll die to select seats
    //Set seats based on die roll
    //Assign deck to Library
    deck = new Library;
    //Shuffle deck
    deck.shuffle();
    //Deal cards
    for (let i = 0; i < players.length; i++) {
      deal(players[i], 7)
    }
    //Flip card
    cardsInPlay.push(deck.cards.pop());
    activeCard = (cardsInPlay.length -1)
    //Assign active player
    //Render
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
