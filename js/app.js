let deck;

const game = {
  players: [],
  seats: [],
  cardsInPlay: [],
  activeCard: {},
  activePlayer: {},
  init(){
    //Display graphic to allow User to select # players
    //Display graphic to allow User to slect # computer players
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
    player.hand.push(deck.cards.pop())
  }
}
