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
