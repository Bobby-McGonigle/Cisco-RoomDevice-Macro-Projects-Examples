# So you have a bunch of Sx10s too?
That's ok, there are a lot of options to handle this thanks to the [Awesome-Xapi](https://github.com/CiscoDevNet/awesome-xapi) Repository
  * We're going to make use of the [JSXAPI](https://github.com/cisco-ce/jsxapi) to get our Sx10's up to par with the rest of our Sx, Mx, Dx, Room and Board series devices

Fortunatley enough, the Sx10 can handle a Touch 10 paired to it and can support the UI Extensions editor.
* With the help of the [JSXAPI library](https://github.com/cisco-ce/jsxapi), [Node.Js](https://nodejs.org/en/) and a module named [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/), we can create an environment to give us that JoinZoom experience on the Sx10 too.

## Goal
* We need to create the JoinZoom button for the Sx10 video endpoints so that our user base has a consistent experience across all video devices in our org
  * Distant Voices "Hey, why not buy the new Room Kit Mini?"
    * I know, the Room Kit Mini in all my spaces would be great, but politics and well "We Gotta Allotta" Sx10s to handle
    * So, yeah I want a mini, but I need make the best situation with what I got, and i have some room on a server :smiley:

## Keep an Open Mind
* Though we will be covering how to add in the JoinZoom button to Sx10, this method is pretty much an External Macro Environment for your endpoints.
* So long as the API is supported on the Sx10, you can do it here! :smiley:
* Your only limits are your imagination and End-of-Support notices lol

## What You'll Need

* Cisco Room device on ce 9.8.X or greater (Works on Cloud registered endpoints too)
* Admin Access
* Some Knowledge on Editing Scripts
* Some experience using the CLI (Command Line Interface)
* Dedicated computer (server preferably)
  * Needs to be able to connect to each Sx10 endpoint over SSH or HTTP
    * Our example will make use of SSH, not the WebSocket, though both are applicable
    * I've have my environment running across multiple video networks, be sure to work with your network team to open up the right access
  * about 50Mb of ram per endpoint
* additional software (Node.Js, pm2)

**NOTE**: For what it's worth, I ran 30 sx10's off of a Mac Mini 2014 when trialling this method, after the proof of concept was tested, we placed this on a windows server.

I think this will work on linux too, so you should be able to get this up and running just fine on most platforms

## How does the script work?

* The system is listening for a user to select the JoinZoom button
  * ![Home Page](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/01_homePage.png)
* If the JoinZoom button is pressed, a Text input prompt will show asking for the Meeting ID
  * ![JoinZoom Menu](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/01_JoinZoom.png)
* The User enters the Meeting ID, then Selects Join
* The system will capture this meeting ID, append ```@zoomcrc.com```, and dial this new string
* If the user enters the '@' or '.' in the meeting ID, we're assuming they are entering an H323 or full sip address, and prevent our system from adding on @zoomcrc.com
  * I'm sure a better evaluation method strong could be added on, might be a good project for you :smiley: I'd love to see it too.

* Unlike the Basic joinZoom.js script, this UI has additional UI elements
  * In the event that the Sx10 loses connectivity to the environment, that we're about to build, this default splash screen should appear
    * ![Sx10_Error](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/Connect%20Sx10s%20Too/02_JoinZoom_Error.png)
  * If the environment is deployed successfully, then it should hide away this default message, and open the Join Zoom button that we expect
    * The benefit of this screen, is that is would hopefully guide users in contacting you and making use of the native call button if there is an issue.

## Getting Started

### Step 1
Prepping the Sx10s

* I highly recommend you open up a new User account on each Sx10 you plan to sync this application with
  * The user account should have ```integrator & user``` roles for access
    * Be sure to set a username an password that makes sense to your build
      * We will be using ```admin``` and ```password``` throughout this example
      * A good user name could be ```IntegrationsManager```
        * please do not re-use the username and password in this example
    * Be sure to **UNCHECK** the ```Require passphrase change on next user sign in``` checkbox when creating this user
    * Be sure to try logging into this user after creating it, to be sure you set the credentials appropriately
* [CE-Deploy](https://github.com/voipnorm/CE-Deploy) Is a great tool for doing a mass deployment of creating user accounts on all Sx10s

**NOTE**: You can use the admin account, but it's best to keep this separated. This won't need admin access

### Step 2
Prepping your environment

* Log into your server/dedicated computer and create a directory folder for this project
  * Create a folder, name it to your liking and remember where you put it
    * Don't have the best advice on folder management, so I defer to the skill you come with on that subject :sweat_smile:
    * I use 2, but you really just need 1
* Install [Node.Js](https://nodejs.org/en/)
  * Go with the recommended version, no need to be fancy, especially if your unfamiliar with the tool
  * Installing Node.Js will also install NPM, which will be needed for installing the next 2 modules
* After Node.Js is installed, open the new directory you made in the CLI
  * Install [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)
    * Follow pm2's recommended installation method as a module
  * Install the [JSXAPI library](https://github.com/cisco-ce/jsxapi)

### Step 2.Why?
* Why are we downloading these 3 tools?
  * [Node.Js](https://nodejs.org/en/) is a javascript run-time environment. It's what's going to allow us to run our scripts
  * [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) is a great management module for Node.Js. pm2 will allow us to run multiple scripts in a forked mode, quickly and easily.
    * pm2's most important role is to restart your scripts if they crash.
        * Crashes could be caused if the endpoint restarts, loses network, etc.
    * pm2 has a lot to offer, so you can take it to the next level, and improve upon the environment we're building now
  * The [JSXAPI library](https://github.com/cisco-ce/jsxapi) will allow us to connect to the video endpoints easily over SSH or a WebSocket, and allow us to write our code in a fashion that's nearly identical to the Macro editor.

### Step 3
Creating your Endpoint Script(s)

* Download [[IP_Address].js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/Connect%20Sx10s%20Too/%5BIP_Address%5D.js)

**BIG NOTE Start**: 
  * Notice how the name of the script is named "IP_Address"
    * There is a snippet of code in this script that locates the file name and slices out the IP
      * Lines 6-9
      * ```javascript
        //locate and use this file name as the IP address for the system
        const path = require('path');
        var scriptName = path.basename(__filename);
        var ip = scriptName.slice(0, -3);
        ```
  * This script was made for use on a windows 2012 server.
    * I mention this because not all environments use the same method for acquiring the file name
    * definitely test this before making all of your scripts
    * For example, on my Mac Mini, this above code was different, see below
      * ```javascript
        var path = module.filename;
        var fileName = path.substring(path.lastIndexOf('/')+1);
        var ip = fileName.slice(0, -3)
        ```
    * Wish I had a method for Linux users, but I'm confident you'll figure this out :smiley:
    * Please be Mindful
  * **What's great about using this method, is that all scripts can be Identical, rather than inserting an IP into each script**
  
**:BIG NOTE END** 

* After you download [[IP_Address].js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/Connect%20Sx10s%20Too/%5BIP_Address%5D.js) you will want to make a few changes
  * On Lines 13 & 14
    * Update the username and password to reflect your new User account for the Sx10 (Refer to Step 1)
    * ```javascript
      username: 'integrator',
      password: 'password',
      ```
  * On Line 31
    * Change ```var zoomDomain = 'Domain';``` to match your Orgs Domain
* Save this as ```template.js``` in your file directory
  * Make a copy of this template for each Sx10 you intend to connect to in your environment
    * For example, if have the 3 systems
      * 10.0.0.X
      * 10.0.0.Y
      * 10.0.0.Z
    * I would have the following files
      * 10.0.0.X.js
      * 10.0.0.Y.js
      * 10.0.0.Z.js
        * We will be using these temp IPs in step 4

        
### Step 4
Creating your ```ecosystem``` file
* [pm2's Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/) is something we're going to either generate of build as our first file.
* The Link above has the full details explaining how to generate one, and other options you can make use of, but for our purposes the file would be formatted like so:
  * ```javascript
    module.exports = {
        apps: [
        //I like to comment which network region my endpoint are located in, for quick reference purposes
        // VLAN: XX1
        {
            name: 'Enter the Device Name of your choosing here',
            script: '[IP_Address].js',//Your Endpoint Script
            restart_delay: 2000 //This delay was added to reduce how many times the script crashes while an endpoint restarts
        }
      ],
    };
    ```
* Adding in multiple systems would look like
  * Those familiar with Object Notation should do fine here, for those who aren't, be mindful of punctuation and case :smiley:
  * ```javascript
    module.exports = {
        apps: [
        //I like to comment which network region my endpoint are located in, for quick reference purposes
        // VLAN: XX1
        {
            name: 'Enter the Device Name of your choosing here',
            script: '10.0.0.X.js',//Your Endpoint Script
            restart_delay: 2000 //This delay was added to reduce how many times the script crashes while an endpoint restarts
        },
        {
            name: 'Enter the Device Name 2',
            script: '10.0.0.Y.js',
            restart_delay: 2000 
        },
        //VLAN: XX2
        {
            name: 'Enter the Device Name 3',
            script: '10.0.0.Z.js',
            restart_delay: 2000 
        }
      ],
    };
    ```
* If you chose to build your ecosystem file:
    save the file as _[name of your choosing]_**.config.js**
* If you generated a file, make an necessary edits and feel free to change the name, but keep **.config.js** at the end.
* Please fill in this ecosystem file with each Sx10 you intend on connecting to this tool
* Save this ecosystem file in your file directory

### Step 5
Time to ~~break~~.... Deploy your new environment! :smiley:

Before we move onto the deployment
  * Review Steps 1 through 4
  * Consider making a Test ```ecosystem``` file, one with 1 or 2 endpoints on it, rather than all systems on the first Go

* Open a CLI in the directory we made
  * run ```pm2 start [ecosystem].config.js
    * You should see a daemon spawn
    * A print out of all endpoints running in a forked mode
  * Now run ```pm2 log```
    You should see a historical log of all endpoints print out up to 15 lines each
      * After this prints, all remaining logs that come in are LIVE
        * Keep an eye on this for any errors that may or may not come it
        * Endpoint console.logs will print here too
      * Try out the Join Zoom Button

## Adding/Removing Systems
* Adding/ removing systems is very simple
  * Make a back-up of the ecosystem file and store it some place safe
  * Edit the Ecosystem file to reflect the systems you want to be live in your environment (Refer to step 4)
  * Save this file
  * Create new endpoint scripts as needed (refer to step 3)
    * No need to delete scripts if you want to save them
    * The Ecosystem file determines if they are running or not
* Once all files have been edited/added/deleted
  * Open the CLI for your directory
  * Run ```pm2 kill```
    * Once complete run ```pm2 start [ecosystem].config.js```
* You should see you new systems come in

**NOTE**: I have 85 systems in my environment, it's about 5 minutes of downtime, so plan accordingly
* Reviewing the [PM2's SITE](https://pm2.keymetrics.io/docs/usage/quick-start/) will also show you other methods of updating, this is just one way.

## How would I know if the Endpoint is Successful?
* The JoinZoom button should show up on the Touch 10 for each Sx10
  * This script creates the UI, so it's a pretty strong indicator if something is working or not
* You will also see an "App Started" message print out in the log for each system when the script starts

## Things to consider
* This is not a perfect tool, but good enough for us to go live with
* Try turning this into a service on your machine
* Computer updates/restarts can bring down your environment, be sure to build up some tools to kick it back on
* Not just a tool fro Sx10's, You can place your whole environment on this, it should work with Sx, Mx, Dx, Room and Board series endpoints
* There is so much that could be added to improve this
* **REVIEW [PM2's SITE](https://pm2.keymetrics.io/docs/usage/quick-start/), It's going to teach you a lot**

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* Special Thanks to the Node.Js, pm2, and the JSXAPI
* My End Users
* Antoine Eduoard - *Mentor*
