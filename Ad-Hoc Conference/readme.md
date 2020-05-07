# Ad-Hoc Conference

Assign your video endpoints an account to host web conference without having to give one to a user.

## Inspiration
One of our schools was outfitting several spaces with Cisco Room devices and wanted a way to allow students to use Webex, without handing out accounts

At the time, the macro editor had not been released, so their solution was to:
  * Create a Webex account for each space
  * Save the Personal Meeting Room as a favorite
    * Add the Host pin to the favorites name
      * Which gave users the ability to move the number around from device to device (not ideal)
  * Leave in room Documents for students to pass out the bare minimum Webex information to guests

When the Macro editor was finally release, I thought to myself "This can be automated with macros"!

## Disclaimer
* This was developed before the new Join Webex button
  * Therefore this too would need some alterations for this to work for Webex today, but totally do-able :smiley:
* Should definitely work with any other SIP based call services such as Zoom or BlueJeans
* This script does not account for password protected meetings, which can change from service to service.
  * Still do-able, if using Zoom, a good example of modifying the dial string can be found under [Join Zoom with Security Enhancements](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements)

## How the script works

* The user would select the Ad-Hoc Meeting button on the touch 10

![Home](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Ad-Hoc%20Conference/images/01_home.png)

* They would be greated with a menu containing all the information they could send to their guests

![AdHoc](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Ad-Hoc%20Conference/images/02_AdHoc%20Menu.png)

  * **NOTE**: Many way's to handle this. 
    * Take a picture, add image to email
    * Use branding logo to have a QR code, which point to meeting space info 
    * Create an email section, have this message post to X server, X server emails you info which you could forward

* Then the user selects "Start your Meeting
  * This will dial the target SIP address you set and bring up a please wait message
  
  ![PleaseWait](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Ad-Hoc%20Conference/images/04_Please%20Wait.png)
  
  * Once the call connects, DTMF Tones will add in the host pin for the user
  * And the user is all set, and good to go
* While connected to this meeting, the AdHoc meeting button is replaced with "Guest information"
  * That way the user can always refer to it if needed
  
  ![GuestInfo](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Ad-Hoc%20Conference/images/03_In%20call.png)

No login info is shown to the user, and the host pin remains to be hidden
  * The in room documents can be shortened as well

## What You'll Need
* Cisco Room Device on ce9.4.X or greater
* Admin access to the video endpoint
* An account from your Call Service (Webex, Zoom, Etc) available for you to assign to this script
* Some knowledge on the Macro Editor
* Some knowledge on editing scripts
  
## Getting Started

* Download [adHocConference.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Ad-Hoc%20Conference/adHocConference.js)

* Open the script and make the following change(s)
  * On lines 3 through 10 edit this information to match your account
    ```javascript
    var callService = {
        "service" : "Webex",
        "domain": "domain.webex.com",
        "userName": "John_Smith",
        "hostPin": "1234",
        "globalCallIn": "1-555-555-5555",
        "accessCode": "555 555",
    };
    ```
  * On line 16
    Edit ```"hostUrl": "https://" + callService.domain + "/meet/" + callService.userName``` to match the URL pattern of your service
* Optional Changes

These changes are not required to get started, but may be useful to your Org's word choice
    * On lines 19 through 27 the information is created here
      * Feel free to edit this text to match your use case as needed
      ```javascript
      var callService_Details = {
          "homeTitle": "Host a "+callService.service+" from this space",
          "onCallTitle": "Guest Information",
          "row_1": "Invite Guests to call in by sharing the information below: ",
          "row_2": "Join Via Computer: " + callService_CallInfo.hostUrl,
          "row_3": "Join Via Video System: " + callService_CallInfo.sipAddress,
          "row_4": "Join Via Phone: " + callService.globalCallIn,
          "placeCall_Button": "Start your Meeting"
      };
      ```
    * On lines 29 through 32
      * This is the Please Wait text prompt
      ```javascript
      var callPrompt = {
          "title": "Please Wait",
          "text": "Connecting you as host of " + callService.userName + "."
      };
      ```
    * On lines 103 through 110
      * This is the style of the Ad-hoc button
      ```javascript
      var adhocUI_Details = {
          "buttonColor": "#A866FF",
          "buttonIcon": "Webex",
          "buttonText": {
              "home": "Ad-Hoc Meeting",
              "call": "Guest Information"
          }
      };
      ```
* Save this script and load it into the Room Device's macro editor
* Run the macro

Once the Macro is enabled and running, it will generate the user interface for you.

## Things to Consider

* You may have a lot of endpoints and editing each script could be a bit of a sore spot for deployment
  * Try integrating to a 3rd party system to store the endpoint info on a spreadsheet, and make this script more uniform
* This script may need to be altered from call service to call service
  * Especially with all the new enhancements being made to the room series

## Deployment

There are many flavors of deployment, but I recommend using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* My End Users
* Antoine Eduoard - *Mentor*
