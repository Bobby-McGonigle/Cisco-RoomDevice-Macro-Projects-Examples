# Boot Status Checker

## Inspiration

I wanted to be able to run scripts in a more controlled manner.

In some of my earlier Macro attempts, and on some earlier software, some of my ideas would crash without cause.

I also noticed, when making changes to a script, the macro environment would restart as well.

I wanted to limit the impact as much as possible to maintain a smooth operation on the endpoint.

## Goal

* Only run startup scripts when the Room Device restarts
* Only run specific scripts or none at all when the Macro Environment crashes or restarts

## What You'll need
* Cisco Room Device on ce9.2.X or greater
* Admin access to the video endpoint
* Some knowledge on the Macro Editor
* Some knowledge on editing scripts

## How the Script Works

The script relies on checking the Uptime of the endpoint

Based on how much uptime there is, we will choose to run certain xApi or functions

**Warning**: This example does vary from model to model. 
* You may need to increase the boundaries of the uptime check.
* I find just over 60 seconds to be a good round number, but it could be lower or higher based on the endpoint

## Getting Started

* Download [bootStatus.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Macro%20Snippets/Boot%20Status%20Checker/bootStatus.js)
* Make changes to the following lines
  * Lines 8 and 21
    * The time for the uptime is checked here, adjust as needed
  * Between lines 9 through 11
    * Add in xApi as need for when the **Macro Environment** crashes or restarts
  * Between Lines 16 through 18
    * Add in xApi as need for when the **Room Device** restarts

## Things to consider
* To be honest, I can't think of anything but the **Warning** written above
* Open to suggestion though :smiley:

## Deployment

There are many flavors of deployment, but I recommend using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* My End Users
* Antoine Eduoard - *Mentor*
