# Lock Down

Lock and Unlock certain elements on your Room device

## Inspiration

I had a user group who asked the question

"Now that we have this new room system, how so we prevent users from placing a call? We'd want to allow administrative staff full access to the device, but not everyone should be able to place a call. This is a public space, and have no local support for those users needs"

Well I knew we could hide native UI elements on screen, so in theory Yes

Though never implemented in a live scenario under my wing, this Lock Features Script was born our if curiosity.

It also helped influence other scripts I have in this repo as well.

## Goal
* Create a passphrase lock for user to interact with on the Touch 10
  * Sub-Goal - Find a way to let the local device owners set their own passphrase
* When the system is locked the device should
  * Not be able to place calls
  * Not be able to receive calls
  * Only allow for sharing screens locally
* The system should lock after the system enters standby
* The system should have some Warning to users who incorrectly enter the wrong passphrase
  * Let's add a mild penalty too

## How the script works

* Users of the space will only have 2 options available
  * Share (Native Share Menu)
  * Unlock System
  
  ![Home](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/01_Home(Locked).png)
  
  * Notice that Call and the Setting Menus are hidden away in this locked state

* In order to unlock to system and allow for the missing features, the user would select "Unlock System"
  * They will be prompted with a passphrase entry when selected
  * enter the proper passphrase here to unlock the system
  
  ![Unlock menu](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/02_UnlockMenu.png)

* The user has 5 opportunities to enter this information correctly
  * On each failure, the system will notify the user with how many tries they have left
  * On the final failure, the system would enter a lockdown state
    * This clears the UI of the touch panel
    * This places a counter on the OSD
    * This will last for a total of 2 minutes then the UI reloads back in as a locked state
    
  ![LockDown](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/ac_Home(Locked)_Fails.png)

* On a successful passphrase entry, the UI will update to match our unlocked requirements
  * The settings Menu appears
  * The Call menu appears
  * Incoming calls can now come into the endpoint
    * We also load in a manual "Lock System" button
    * And a "Change Sys. Lock" button
    
  ![HomeUnlocked](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/03_Home(Unlocked).png)
    
* The "Lock System" button place the system back into its locked state
  * This will also happen if the system enters Standby
    * This will not lockdown in Half-Wake mode
* The "Change Sys. Lock" button gives the user the option to change the passphrase
  * This allows the primary users of the space to set a passphrase of their own on the system, which is independent of the system's log in credentials
    * That way you can deploy the script, and allow the users to manage their own passphrase, with limited involvement of a system admin
  * This feature assumes you have an unused asset on the Room Device and had inspired the creation of the [Macro Memory Storage](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/03_Home(Unlocked).png)
  * _We are using **"FacilityService 5 Name"** as the location to store our passphrase in this example._
    * I recommend you review this script, as it has more robust Memory usage examples which would help improve upon this design.

* The "Change Sys. Lock" button has several steps a user will need to follow to successfully change the passphrase

  ![ResetPassphrase](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/aa_ChangePw_Chain.png)

  * The user will need to 
    * Confirm the original passphrase
    * Enter in a new passphrase, that does not match the original
    * Then confirm the new phrase
  * If done correctly the user will receive a Success notification

  ![PassphraseSuccess](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/07_ChangePw_Success.png)

  * However,there are notification at each step if the user does not input the proper information in order to update the passphrase.

  ![PassphraseFails](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/ab_ChangePw_Fails.png)

  * There was no penalty put in place in this section, as access to the room is already available
    * I did not think it was necessary to add one here, as I did not want to disrupt the users work-flow too much

For those who are interested, there are unedited images available in the [images folder](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Lock%20Features/images)

## Getting Started


