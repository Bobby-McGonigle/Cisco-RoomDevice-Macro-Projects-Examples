# Silenced Standby Mode

Something to add a bit more control to spaces with a Room Device for your users

## Inspiration

**A surprising amount of demand!**

We have Cisco Room devices in all sorts of different settings. Education, Conference rooms, Theaters, offices, etc. 

For the most part, we try to keep space behavior identical, simple and intuitive, but for some users, these features can be annoying.

It's been a ask for some users with systems in their office, or spaces with integrated screens/projectors to not be disturbed by the room technology, because they are simply not using it.

So rather than change the configuration permanently for each space, we made a button for those select users

"Why a button?"
* So we let those who want this feature enable it, but not confuse others who expect the room to behave in a standard fashion

## Goal
* Create a simple button interface
* Warn the users of the change
* Implement a few configuration changes after they agree

## How the script works

* The user presses the Silenced Standby button

![SilenceHome](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Silenced%20Standby%20Mode/images/01_Silence%20Home.png)

* The user will then be greeted by a prompt letting them know if the changes they are going to make.

![SilencePrompt](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Silenced%20Standby%20Mode/images/02_Silence%20Warning.png)

* If the user enables Silence Standby,  then the system will do the following
  * Set Ultrasound levels to '0'
    * Stops devices from picking up the signal
  * Set Proximity Mode to 'Off'
    * Clears the warning on the device
  * Set WakeOnMotion to 'Off'
    * Clears the warning on the device
  * Place the system into Standby

* In order to re-enable these features,  the user only needs to touch the Touch Panel
  * This will set this back to predefined defaults in your script (which can vary from system to system)
  
## Getting Started

* Download [silenceStandby.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Silenced%20Standby%20Mode/silenceStandby.js)
* Open ths script in the editor and make the following changes
  * In lines 4 through 8 update the following variable to match your standard config
    ```javascript
    var systemDefaults = {
        "maxUltrasound": 70,
        "proximityMode": "off",
        "wakeOnMotion": "on"
    };
    ```

* Save the script and load it into your endpoint
* Turn on the script

The Script will generate the button on the Touch 10 for you

## Things to Consider
* You only need to change the ultrasound settings to get this to work
  * We only shut off Proximity and WakeOnMotion to clear errors caused by ultrasound being set to 0
* Not ideal for all spaces, just where there is a lot of demand
  * I usually add to offices, as it can get distracting with a display turning on intermittently

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
