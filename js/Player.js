class Player {
  constructor(name){
    this.name = name;
    this.type = 'human';
    this.seat = 0;
    this.hand = [];
    this.hasUno = false;
  }
  play(card){
    lastTurnDraw = false;
    this.hand.splice(card.handPosition, 1)
    card.handPosition = null
    card.isLegal = false
    game.cardsInPlay.unshift(card)
    game.activeCard = game.cardsInPlay[0]
    for (let i = 0; i < this.hand.length; i++) {
      this.hand[i].handPosition = i
    };
    if (card.value.includes('wild')){
      renderWildSelection()
    } else {
      endTurn()
    }
  }
}

class ComputerPlayer extends Player {
  constructor(name) {
    super(name)
    this.type = 'computer'
  }
  play() {
    const legalCards = []
    this.hand.forEach(card => {
      if (card.isLegal){
        legalCards.push(card)
      }
    })
    const randomCardIndex = Math.floor(Math.random() * legalCards.length)
    const cardToPlay = legalCards[randomCardIndex]
    lastTurnDraw = false;
    this.hand.splice(cardToPlay.handPosition, 1)
    cardToPlay.handPosition = null
    cardToPlay.isLegal = false
    game.cardsInPlay.unshift(cardToPlay)
    game.activeCard = game.cardsInPlay[0]
    for (let i = 0; i < this.hand.length; i++) {
      this.hand[i].handPosition = i
    };
    if (cardToPlay.value.includes('wild')){
      //Handle Wilds
    }
  }
}
