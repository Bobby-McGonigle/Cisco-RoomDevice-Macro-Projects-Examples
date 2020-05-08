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

### Disclaimer
 * This script stores the passphrase in "FacilityService 5 Name"
   * It's an unused asset in my environment
   * This script **stores this passphrase in plain text** in the above configuration location, which is visible in the GUI
     * Be sure that the scenario you build doesn't conflict with any security guidelines your Org may require
 * This particular example works well in my environment, but not necessarily everyones
   * Hiding the call menu, does **NOT** hide things "Meetings" (which can have OBTP enables) or "VoiceMail" if Room Devices are paired to infrastructure that supports these options
   * Do you best to make changes to best match your environment

## Step One
Using the script "As Is"

* Download [lockFeatures.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/lockFeatures.js)

* Load the script into the Room Devices Macro Editor
  * Run the script

* If the system is awake, place it into standby
  * This should initiate the first lockdown, and generate the UI for you
* If the endpoint was in standby from the start
  * Wake the system, the put it in standby to kick-start the process
* A restart can also enable this UI to appear

* The default value for "FacilityService 5 Name" is = _{blank}_
  * You can manually set this in the configuration menu at any time as a system admin

## Step 2
Editing for your use case

I will only be showing you where you can change the command for locking and unlocking the system in this section
* But there is a lot to this script, and encourage you look over it.

  * There are 6 functions to this script you may want to focus your attention on
    * bootStatus();
      * Found between Lines 10 through 31
      * This function helps keep a steady operation and is broken down in more depth in [Macro Snippets](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Macro%20Snippets)
    * lockUI()
      * found between lines 35 through 56
      * This is the user where the locked UI for the custom panels are generated
        * If you need to change the look and feel, you can adjust this here
    * unlockUI()
      * Found between Lines 58 through 75
        * Similar to lockUI(), but it's inverse counterpart
        * Once again, only generates custom panels
    * lockDown(consoleLog)
      * Found between Lines 117 through 125
        * This is the locking behavior of the system
        * The parameter is mainly to allow me to change the log in different ways, to account for the different locations it's called in
    * unlock()
      * Found between Lines 127 through 138
        * The inverse counterpart to lockDown()
    * tooManyFailedAttempts()
      * Found between Lines 140 through 174
        * The script responsible for the lockout of the UI when too many

The remainder of the script are the message prompts for this system.

## Things to Consider
* This tool is better served by a 3rd party autentication system, but for those who have limited tool sets, this is a great workaround.
* Definatley needs a full review, one of my earlier scripts, where I see a lot of potential to improve :smiley:
* Merging [Macro Memory Storage](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Lock%20Features/images/03_Home(Unlocked).png)
  * Macro Memory Storage was born here, and running in at a reduced capacity in this script
* Finding a way to encrypt the value stored in your unused Asset, used to store the passphrase
* This particular example is not useful in all environment, and some work will be needed to be done to some degree

## Use Cases
* Limiting access to devices (such as the example above)
* Creating Service team tools
  * Create admin tools, for quick changes on the fly for field service techs
  * Create room health surveys for field service techs to fill out on a visit
* Hiding away team tools in public spaces
* Overflow Spaces

## FunFact 
I did design a room scenario for a modular Conference/Court space, which completely changed how to room operates in each scenario. 
 * Allowed for video conferencing when needed
 * Allowed for a hearing with remote witnesses to view a case when needed
   * Allowing local peripherals to be sent to another space
   * That design will make it's way onto this repo eventually, because I am so fond of it.
 * Though, this was never implemented :unamused:, but still a fantastic thought experiment :smiley:

## Deployment

There are many flavors of deployment, but I recommend using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* My End Users
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*
