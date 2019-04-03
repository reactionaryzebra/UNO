class Library {
  constructor(){
    this.cards = buildLibrary();
    this.cardsRemaining = 108;
    this.cardsUsed = 0;
  }
  shuffle(){

  }
  deal(players){

  }
  flipCard(){

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
        value: values[j]
      }
      library.push(card)
      if (j > 0){
        library.push(card)
      }
    }
  }
  //Make special cards
  for (let i = 0; i < specialValues.length; i++) {
    const card = {
      color: 'black',
      value: specialValues[i]
    }
    library.push(card, card, card, card)
  }
  return library
}
