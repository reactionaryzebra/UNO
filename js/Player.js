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
  constructor() {
    super('computer player')
    this.type = 'computer'
  }
  play() {
    let cardToPlay

    if (!legalPlay) {
      //force draw if no available play
      deal(this, 1)
    } else {
      //define available legal plays
      const legalCards = []
      this.hand.forEach(card => {
        if (card.isLegal){
          legalCards.push(card)
        }
      })

      //sort legalCards to put wild at the end
      legalCards.sort((a, b) => {
        if (a.value < b.value) {
          return -1
        } else if (b.value < a.value) {
          return 1
        }
        return 0
      })

      //put skip and reverse cards at the beginning of the array in order to
      //prioritize playing them
      legalCards.forEach((card, index) => {
        if ((card.value === 'skip') || (card.value === 'reverse')) {
          let tempCard = legalCards[index]
          legalCards.splice(index, 1)
          legalCards.unshift(tempCard)
        }
      })

      //Assign card to play
      cardToPlay = legalCards[0]

      //adjust game variables
      lastTurnDraw = false;
      this.hand.splice(cardToPlay.handPosition, 1)
      cardToPlay.handPosition = null
      cardToPlay.isLegal = false
      game.cardsInPlay.unshift(cardToPlay)
      game.activeCard = game.cardsInPlay[0]
      for (let i = 0; i < this.hand.length; i++) {
        this.hand[i].handPosition = i
      };

      //Determine most frequent color in hand for determining wild color selection
      const colors = ['red','blue','green','yellow']
      let mostFrequentColorCount = 0
      let mostFrequentColor
      let tempColorArr
      for (let i = 0; i < colors.length; i++) {
        tempColorArr = this.hand.filter(card => card.color === colors[i])
        if (tempColorArr.length > mostFrequentColorCount) {
          mostFrequentColorCount = tempColorArr.length
          mostFrequentColor = colors[i]
        }
      }

      //Assign game variables when playing a wild
      if (cardToPlay.value.includes('wild')){
        const colorChoice = mostFrequentColor
        game.activeCard.color = mostFrequentColor
      }
    }
    endTurn()
  }
}
