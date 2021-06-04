# Join Zoom and Zoom Tools

Version: 4-1-0 

## Inspiration
* The continued need to improve up my previous Join Zoom iterations.
* Provide more features for my user community
* Re-think my strategy for others to integrate this into their own user Ecosystem 😃

## Goal
* Ditch version 3
  * _Version 3? We haven't seen a version 3?!?!?_ Yeah the one I never posted... It did OK, but there was obvious flaws and you all deserve better 😉
* Create a UI for Zoom DTMF sequence
* Allow the scripts to be more customizable
* Make use of Newer API present in today's landscape!


## What You'll Need
* Cisco Room device on ce9.15.X or greater, or Stable Channel of RoomOS
* Admin Access
* Some Knowledge on the Macro Editor
* Some Knowledge on Editing Scripts

## The roles and function for each scrip?

Join Zoom version 4-1-0 is split into 5 scripts
* JoinZoom_Main_4-1-0.js
  * The active script on the endpoint. Contains most of the code needed for successful operation 
* JoinZoom_Config_4-1-0.js
  * Version 4-X-X was made to be more customizable
  * This configuration menu has several options for you to quickly edit key areas of the Macro, without needed to dig through all the code
* JoinZoom_JoinText_4-1-0.js
  * Most Prompt-Based Text content is here, so you can edit to your language of choice or enter information that is more meaningful to your users.
* JoinZoom_UI_4-1-0.xml
  * The UI for all of join Zoom version 4-0-0
  * This includes all peices your users need to interact with
  * It includes 6 panels with various use cases, so don't be alarmed if you see a bunch in your User Interface Extensions Editor
* Memory_Functions.js
  * Set of function for storing and retrieving information.
  * It's role in Join Zoom is for the new Personal Mode
* Memory_Storage.js
  * Storage repository for Memory Functions

[Learn more about Memory Functions](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Macro%20Memory%20Storage) and how to include it in your scripts!

The scripts have been split for readability and to leverage a configuration scheme inside the endpoint.

## Getting Started

## Configuration Option

## Add/Remove Zoom Tools

### Things to consider

## Deployment

There are many flavors of deployment, but I recommend using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* The Cisco Room Devices Team
  * Special thanks to Dustin Baker for creating an intorductory video of the scripts
* My End Users
* The Cisco Community
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*
