# Tic Tac Toe!

![PartiallyFilledBoard](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/TicTacToe/images/05_BoardFilling.png)

## Inspiration

Since creating the Dice Roller script, I thought "How could we not only engage users to collaborate, but also engage users to build bonds".

If your team can play together, they can build together.

I also wanted to illustrate how the Cisco Room Series can be adapted in a way to create new experiences, solve new and unique tasks, and open up the realm of possibilities available to us through the xApi and the Macro Editor.

## What you'll need

* Cisco Room Device on Software Version ce9.13.X or higher
  * Sx, Dx, MxG2, Room, Desk or board series (excluding Sx10)
* Admin Access to the endpoint
* Some knowledge of the Macro Editor
* Some knowledge of the UI Extensions Editor
* A couple of players

## How this Script works

This is a local multiplayer game, there is no single player mode or online option to this version (At least for now :wink:)

When the Macro is loaded in and active, the User Interface for TicTacToe will load in for you on the Touch Device's home screen.

![HomeScreen](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/TicTacToe/images/01_Home.png)

If you select the Tic Tac Toe button you could be greeted with one of 2 options.

If the game board is empty, you'll go right into a new game

![New Game](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/TicTacToe/images/02_NewGame.png)

If the game board has had some play to it already, then you'll be given a choice on whether or not you'd like to continue that game or start a new game.

![Continue from last game](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/TicTacToe/images/08_ContinueFromLast.png)

The active turn of either player [X] or player [O] will show on the top most row of the game board.

To make your move, simply select one of the empty squares and it will then update the board with your teams symbol and pass turns to the next player.

You'll notice a bit of lag time between each move. At this time, in order to make any visual changes to buttons, a new XML file will need to be loaded into the board. This new UI will be built, based on the current input of the game, and be loaded into the UserInterface. 

Once a player has achieved a "3 in a row" sequence, a prompt will display indicating the winner and the game board will be reset.

![](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/TicTacToe/images/06_XWon.png)

From here, you can either choose to play again, or end your session.

One last note, for those admins working remote. If you need to settle a dispute of who won, a full log will show on the endpoint's macro console :nerd_face:

```
  10:32:40 TicTacToe2	'Panel Clicked; No active board present; prompting user for new game. Choosing First Player...'
  10:32:41 TicTacToe2	'Random selection made; Team [X] will go first; Opening Board...'
  10:33:11 TicTacToe2	'X placed a piece at board index: 0'
  10:33:11 TicTacToe2	'X~#~#'
  10:33:11 TicTacToe2	'#~#~#'
  10:33:11 TicTacToe2	'#~#~#'
  10:33:12 TicTacToe2	'[O]s turn...'
  10:33:12 TicTacToe2	'O placed a piece at board index: 1'
  10:33:12 TicTacToe2	'X~O~#'
  10:33:12 TicTacToe2	'#~#~#'
  10:33:12 TicTacToe2	'#~#~#'
  10:33:12 TicTacToe2	'[X]s turn...'
  10:33:13 TicTacToe2	'X placed a piece at board index: 3'
  10:33:13 TicTacToe2	'X~O~#'
  10:33:13 TicTacToe2	'X~#~#'
  10:33:13 TicTacToe2	'#~#~#'
  10:33:14 TicTacToe2	'[O]s turn...'
  10:33:14 TicTacToe2	'O placed a piece at board index: 4'
  10:33:14 TicTacToe2	'X~O~#'
  10:33:14 TicTacToe2	'X~O~#'
  10:33:14 TicTacToe2	'#~#~#'
  10:33:15 TicTacToe2	'[X]s turn...'
  10:33:20 TicTacToe2	'X placed a piece at board index: 6'
  10:33:20 TicTacToe2	'X~O~#'
  10:33:20 TicTacToe2	'X~O~#'
  10:33:20 TicTacToe2	'X~#~#'
  10:33:20 TicTacToe2	'Woohoo! Congratulations are in order for team: [X]; New game prompted; awaiting user response..'
```

Have Fun!

## Installing The Script
* Open this script in a new tab [ticTacToe.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/TicTacToe/ticTacToe.js)
  * Copy the contents into a text editor and save them as ```D&D_DiceRoller.js```
  * Log into your video endpoint as an admin
  * Go to the macro editor
  * Load in this script, save and activate

As mentioned before, the UI will load in for you, the game should be ready to play :smiley:

## Things to Consider

* Though this is a simple game, it makes good use of editing the UserInterface. This could serve as an example to make the UI of the Room series more dynamic and adaptive based on user input, or the system's state.

* Try to make this a multiplayer game. A good place to start would be exploring BOTs and the HTTPClient xCommands

* Getting people to collaborate can be a challenge at times, so why not build some fun into the office

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* Special thanks to ```Robert I``` [StackOverflow](https://stackoverflow.com/questions/45703381/javascript-tic-tac-toe-how-to-loop-through-win-condition). This answer to a users question served as a basis for this scripts win condition
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*
