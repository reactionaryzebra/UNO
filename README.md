# UNO by Justin


## Intro
UNO is a tabletop card game developed by Merle Robbins in 1971.  It is currently produced by Mattel.  I chose it for my project for sentimental reasons.  In my previous work with adults with Autism, UNO was a favorite game of many participants of the program.  I would love to go on and develop this app further to be more intuitive and accessible for people with fine-motor deficits and sensory sensitivities.

## Intended user flow
 1. User selects the number of players and the number of computer players
 2. App randomly selects a player to go first and deals all players their hands
 3. On their turn, the user will select from their hand a legal card to play (one that matches either the color or value of the card in play, or a wild), or draw from the deck if their hand contains NO legal plays
  - Special Cards:
   - SKIP - this card skips the next player's turn
   - REVERSE - this card reverses the order of play
   - DRAW2 - this card forces the next player to draw 2 cards
   - WILD - when a player plays a wild card, they may select the color of that wild to set the active color in play
   - WILD DRAW4 - same as above and also forces the next player to draw 4 cards
  4. Play continues in this fashion until one player runs out of cards in their hand, at which point the winner is declared and the user is asked whether they would like to play again.

## Initial wireframes and sketches
 - ![welcome](https://github.com/reactionaryzebra/UNO/blob/master/Wireframes/Welcome.png)
 - ![die roll for first player](https://github.com/reactionaryzebra/UNO/blob/master/Wireframes/Die%20Roll%20who%20goes%20first.png)
 - ![die roll winner announced](https://github.com/reactionaryzebra/UNO/blob/master/Wireframes/Die%20roll%20winner%20annouce.png)
 - ![general game state](https://github.com/reactionaryzebra/UNO/blob/master/Wireframes/In%20Game.png)
 - ![uno button expanded](https://github.com/reactionaryzebra/UNO/blob/master/Wireframes/Uno%20button%20expanded.png)
 - ![called UNO](https://github.com/reactionaryzebra/UNO/blob/master/Wireframes/Called%20Uno.png)
 - ![winner declared](https://github.com/reactionaryzebra/UNO/blob/master/Wireframes/Winner.png)
 

## Technologies used
  - HTML5
  - CSS3
  - JavaScript ES6
  - Git
  - GitHub

## Getting started
Visit the project page [here](https://reactionaryzebra.github.io/UNO/) and play!

## Next steps
  - Implement UNO button, allowing users to call UNO on themselves and others (if UNO is not called when a player has one card, they are forced to draw 3)
  - Support for playing another person non-locally
  - Support for up to four players
  - Improve UI for users with sensory sensitivities and fine motor deficits
  
