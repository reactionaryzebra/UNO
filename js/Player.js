class Player {
  constructor(name){
    this.name = name;
    this.type = 'human';
    this.seat = 0;
    this.hand = [];
    this.hasUno = false;
  }
  play(card){
    this.hand.splice(card.handPosition, 1)
    card.handPosition = null
    card.isLegal = false
    game.activeCard = card
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
