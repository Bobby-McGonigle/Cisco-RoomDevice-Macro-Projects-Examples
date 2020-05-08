# Network Health Check

Have your system check if it has the right IP

## Inspiration

When working on my first Cisco based combine/divide room scenario, the commands relied on HTTP requests

Being being a catastrophe planner, I wanted to include some way to see if my endpoints were still alive locally

So I crafted this script to help ease my concerns :smiley:

## Goal

* Have the system check it's own IPv4 address
* Compare this IP to a variable
* If the system passes, do nothing
* If the system fails, check again, then run commands

## What You'll need
* Cisco Room Device on ce9.2.X or greater
* Admin access to the video endpoint
* Your endpoint should have a reserved IP
* Some knowledge on the Macro Editor
* Some knowledge on editing scripts

## How the Script Works

There are 2 functions in this script
* ```checkNetStatus()```
* ```checkNetHealth()```

### checkNetStatus()

* This script (written on lines 7 through 14) will check the IPv4 value of your endpoint every 10 seconds and append it to a variable

### checkNetHealth()

* This script (written on lines 15 through 34) will compare the variable formed from ```checkNetStatus()`` to a global variable ```dhcpReservation``` to see if they match every 3 minutes
  * If they match, nothing happens
  * If they don't, this will register a single fail and do nothing
  * If it fails a second time, we will run the commands we need

## Getting Started

* Download [netHealth.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Network%20Health%20Check/netHealth.js)
* Open in an editor and make the following changes
  * On line 3
    * Change ```var dhcpReservation = ‘xx.xxx.xxx.xxx’;``` to be the expected IP for your endpoint
  * Between lines 25 through 32
    * Add in the commands you need to run if the network check fails twice
    ```javascript
     if (counter >= 2) { 
        console.log('System has failed to re-connect "' + counter + '" times');
        xapi.command('UserInterface Message Alert Display', {
            Title: 'System Offline',
            Text: "Uh-Oh, something happened... Fail count = " + counter,
            Duration: 60
        });
    }
    ```
      * **NOTE**: You can run commands when the script is successful, if it fails the first time, or Nth time. This is not restricted by the boundaries I set.
  
## Things to consider
* Management Service are always a great have, this should only supplement those services
* This should be used in a design that needs immediate alterations if the network goes down (Such as the combine and divide scenario I worked on)

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
