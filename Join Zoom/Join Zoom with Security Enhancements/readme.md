# Join Zoom ~~With More Prompts!~~ Securely!

## Inspiration
* My org implemented more security features on our domain
* This kind of broke the nice experience I had with [joinZoom.js](https://github.com/Bobby-McGonigle/Macro-Samples/tree/master/Join%20Zoom/Join%20Zoom%20(Basic))
  * Not that the button didn't work, it's just that the Experience when Joining a Zoom call was a bit confusing upon entry.
  * So I think we should take the joinZoom.js file and place in our own experience for the user.

## Goal
* Retain a simple, context rich experience
* Gather the Meeting password and Host key from the user when available
* Build the SIP string for the user, rather than have them build it

## What You'll Need
* Cisco Room device on ce9.8.X or greater (Works on Cloud registered endpoints too)
* Admin Access
* Some Knowledge on the Macro Editor
* Some Knowledge on Editing Scripts

## How does the script work?

![T10 Home](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/images/00_Home.png)

* So the initial prompt remains the same, albeit 1 slight change from the original joinZoom.js
  * Instead of selecting "join" after entering the meeting id, you select "Next"
    * ![JoinZoomMID](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/images/01_JZS%20Home.png)
  * After entering in the meeting ID, the user will be prompted with a Role Selection
    * ![RoleSelect](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/images/02_Role%20Select.png)
  * If the user Selects Host, they will have 2 additional prompts
    * They will be asked for their host Key and the Meeting Password
    * If the meeting is **NOT** password protected, it's quite alright to leave blank. This will be handled in code
      * ![HostKey](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/images/03_HostKey.png)
      * ![Passphrase](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/images/04_HostPass.png)
  * If the user Selects Participant, they will only have 1 additional prompt for the meeting password
    * ![ParticipantPass](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/images/05_PartPass.png)
  * Once either user enters the call, they will receive a courtesy "Please Wait" Message, that way they enter the meeting, and not feel the need to interact with the T10
    * ![PleaseWait](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/images/06_PleaseWait.png)

As an admin, the system will print the following logs
```logs
18:39:56 [JoinZoom_wSecurity] => 'Meeting Id: "123456789" entered. Selecting Role...'
18:39:58 [JoinZoom_wSecurity] => 'Role: "Host" selected. Waiting for user to enter "Host" credentials...'
18:40:09 [JoinZoom_wSecurity] => 'Joining Meeting Id: "123456789" as "Host'
18:40:13 [JoinZoom_wSecurity] => 'Connected to Meeting Id: "123456789" as "Host'
```

## Getting Started

* Download [joinZoom_wSecurityEnabled.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements/joinZoom_wSecurityEnabled.js)
* Open in an editor and make the following change(s)
  * On line 12 change ```var zoomDomain = "Domain"``` to match your Zoom Domain
* Save and load this into the Room device's macro editor
* Run the script

Once this is loaded in and enabled, it should generate the UI for you and start to work

### Things to consider
* You could shorten how many steps to enter the call by combining steps
 * I had done so the way I had, in the hope more Zoom API opens up, and allows me to authenticate the host for a specific meeting
  * If I can do that, I can add in a "Zoom Tools" button for the host Room Device, which are a bunch of automated DTMF patterns
* You could merge this with the [Join Zoom with Analytics Example](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Join%20Zoom/Join%20Zoom%20with%20analytics) to collect information on whether or not people are using this button

## Deployment

There are many flavors of deployment, but I recommend using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* Special Thanks to Dmitriy Bakhter for discovering a dial string oversight :smiley:
* My End Users
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*
