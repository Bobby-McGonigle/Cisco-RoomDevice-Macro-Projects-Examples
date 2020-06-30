# D&D Dice Roller

Social distancing has been in effect for a while, like you, I have taken solace in the world of video.

Every Saturday, me and 6 other friend take part in a [Webex Teams](https://www.webex.com/team-collaboration.html) call and played Dungeons and Dragons.

Judging by this repository, you can probably tell I work with Cisco Room devices, and before the lockdown, I brought one home to continue my work and well, enjoy the quality of a hardware driven experience.

![D&D Session](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/Images/example.jpg)

I get to kick up my feet, use the Webex Teams Whiteboard tool on my laptop to see where are characters may lie on the field and relax with my friends.

But I was losing some screen real estate on my computer using a browser based dice roller, so I thought to myself "I bet I could get one on the Cisco Touch 10"

So before our last session I threw together what you see below:

![HomeScreen](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/Images/01_Home.png)

![Dice Roller Menu](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/Images/02_StandardMenu.png)

So for those who are avid players or have a need to showcase random numbers in meeting spaces, I present to you [D&D_DiceRoller.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/D%26D_DiceRoller.js)

## What you'll need

* A Cisco Room Device
  * Any system that supports the Macro editor
  * I recommend ce 9.10 or greater
* Some knowledge on the Macro Editor
* Some knowledge on the UI Extensions Editor
* Admin access to you endpoint
* A Dedicated group of role players :smiley:

## How this script works

A user will select a die to roll, then you'll get a pop up of the result, and it will take that result and store it to refer to later if needed.

Those lucky players will even get a congrats when rolling a natural 20

![Nat20](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/Images/05_Nat20.png)

Those who aren't as lucky, will also be reminded of this.

![Nat1](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/Images/04_Botch.png)

It's a simple script that makes use of Javascript's Math functions.

I use a single case to handle all widget IDs used and pull the number I need from them.

For example, the D20 button has a WidgetID of ```d20```. It's corresponding text field WidgetID is ```d20_txt```

So if you want to modify the script to add more variety, go for it, just follow the Widget naming scheme below in the UI extensions editor, and you'd be all set.

| Button WidgetID | Text WidgetID |
| :--- | :--- |
| d**N** | d**N**_txt | 
**N** = Number

## Installing the script
* Download [D&D_DiceRoller.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/D%26D_DiceRoller.js)
  * Log into your video endpoint as an admin
  * Go to the macro editor
  * Load in the script, save and enable
* Download the [UserInterface](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Games/Dice%20Roller/DiceRollerUI.xml)
  * Go the UI Extensions Editor
  * Drag and drop this file into this screen
  * Push the interface to your endpoint

The script should start working, and just in time for your next video call :smiley:

## Things to consider
* "All work and no play makes Jack a dull boy" - The Shining
  * Collaboration does not come without companionship, though this may be an obscure use case, having after work D&D Sessions can be a great team building exercise or just a lot of fun.
  * D&D is not the only game either, your monopoly board that's missing a die could make use of this too :smiley:
  * If you prefer Yahtzee, well then you got some work to do, but this script can be changed to roll multiple dice
* Challenge yourself, what kind of collaboration tools could you make?
* This tool had D&D on the brain, if you don't like the funny pop-ups it's not to hard to make changes, and would be a great exercise for those new to the macro editor or coding javascript.

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* My D&D Party - Dan, Peter, Farrin, Tori and Broderic
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*
