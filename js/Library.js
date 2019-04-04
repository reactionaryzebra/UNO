class Library {
  constructor(){
    this.cards = buildLibrary();
    this.cardsRemaining = this.cards.length;
    this.cardsUsed = 108-this.cards.length;
  }
  shuffle(){
    for (var i = this.cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = temp;
    }
  }
  flipCard(){
    return this.cards.pop();
  }
}

const buildLibrary = () => {
  const library = [];
  const values = [0,1,2,3,4,5,6,7,8,9,'skip','reverse','draw2']
  const colors = ['red', 'blue', 'yellow', 'green']
  const specialValues = ['wild', 'wild4']
  //Make colored cards
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < values.length; j++) {
      const card = {
        color: colors[i],
        value: values[j],
        isLegal: false,
      }
      library.push(card)
      if (j > 0){
        library.push(card)
      }
    }
  }
  //Make special ('black') cards
  for (let i = 0; i < specialValues.length; i++) {
    const card = {
      color: 'black',
      value: specialValues[i]
    }
    library.push(card, card, card, card)
  }
  //Give all cards unique ID // BUG: identical IDs for duplicate cards
  for (let i = 0; i < library.length; i++) {
    library[i].id = i
  }
  return library
}
