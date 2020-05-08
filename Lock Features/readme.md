# Lock Down

Lock and Unlock certain elements on your Room device

## Inspiration

I had a user group who asked the question

"Now that we have this new room system, how so we prevent users from placing a call? We'd want to allow administrative staff full access to the device, but not everyone should be able to place a call. This is a public space, and have no local support for those users needs"

Well I knew we could hide native UI elements on screen, so in theory Yes

Though never implemented in a live scenario under my wing, this Lock Features Script was born our if curiosity.

It also helped influence other scripts I have in this repo as well.

## Goal
* Create a password lock fo user to interact with on the Touch 10
  * Sub-Goal - Find a way to let the local device owners set their own password
* When the system is locked the device should
  * Not be able to place calls
  * Not be able to receive calls
  * Only allow for sharing screens locally
* The system should lock after the system enters standyby
* The system should have some Warning to users who incorrectly enter the wrong password
  * Let's add a mild penalty too

## How the script works

* Users of the space will only have 2 options available
  * Share (Native Share Menu)
  * Unlock System
  
  ![Home](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/01_Home(Locked).png)
  
  * Notice that Call and the Setting Menu are hidden away in this locked state

