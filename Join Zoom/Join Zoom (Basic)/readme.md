# Join Zoom Meetings with [joinZoom.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/joinZoom.js)
A simple, user approachable way to enter a meeting.

## Inspiration
* I found that users in my org more closely identified the Native Call button on the Touch 10 to an Audio Only entry point
  * Though hosting several trainings on how to enter a Video Meeting with a SIP address, the concept still bewildered people
  * Why not make an interface that helps them, get themselves connected?
* To be honest, this original thought stemmed from my Launch Meeting button, when we had 2 video platforms existing at the same time, but the results were great. So when we eliminated one in our transition, we updated our userInterface to match.

## Goal
* Create a userinterface that people can approach
* Make sure the experience is consistent across All video endpoints in our environment (Including the Sx10)
* Make sure the context provided, matches other sources users receive this informations
  * Basically, whatever the Zoom invitation has, we keep the same information present on the new button.

## What You'll Need
**Base Needs**
* Cisco Room device on ce 9.8.X or greater (Works on Cloud registered endpoints too)
* Admin Access
* Some Knowledge on the Macro Editor
* Some Knowledge on Editing Scripts

**Additional Needs for the Sx10**
* Dedicated computer (server preferably)
  * Needs to be able to connect to each Sx10 endpoint over SSH or HTTP
    * Our example will make use of SSH, not the Websocket, though both are applicable
  * about 50Mb of ram per endpoint
* additional software (Node.Js, pm2)
* Adding JoinZoom to Sx10s will be talked about briefly here, but you can find more in-depth information here [Join Zoom with Sx10's](https://github.com/Bobby-McGonigle/Macro-Samples/tree/master/Join%20Zoom/Join%20Zoom%20(Basic)/Connect%20Sx10s%20Too)

## How does the script work?

* The system is listening for a user to select the JoinZoom button
  * ![Home Page](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/01_homePage.png)
* If the JoinZoom button is pressed, a Text input prompt will show asking for the Meeting ID
  * ![JoinZoom Menu](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/01_JoinZoom.png)
* The User enters the Meeting ID, then Selects Join
* The system will capture this meeting ID, append ```@zoomcrc.com```, and dial this new string
* If the user enters the '@' or '.' in the meeting ID, we're assuming they are entering an H323 or full sip address, and prevent our system from adding on @zoomcrc.com
  * I'm sure a better evaluation method strong could be added on, might be a good project for you :smiley: I'd love to see it too.
* The expected Log Output when using this script
  ```log
  14:53:21 [JoinZoom] => 'Zoom Panel Opened'
  14:53:36 [JoinZoom] => 'No SIP pattern entered. Appending "@zoomcrc.com" to => xxxxxxxxx'
  ```

## Gettings Started

### Step 1
#### Editing the script

* Download the [joinZoom.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20(Basic)/joinZoom.js) script
* Go to line 7 and edit
  * ```var zoomDomain = 'Domain';```
  * Change the zoomDomain variable to match your Zoom Instance
* Save the script

### Step 2
#### Loading in the script

* Log into the Video Endpoint
* Go to the Macro Editor
* Load in the script, save and run
  * After enabling the script, the JoinZoom button should generate on the Touch 10 for you

### Step 3
Testing

* Tap the Join Zoom 
* Enter in your Zoom Meeting ID
* Select join
  * The system should enter a call, with the meetingID@zoomcrc.com

## Things to consider
* Consistency is KEY
  * Do your best to make tools as Universal as possible
    * I may have gotten a complaint or 2 when this button did not exist for a user for this exact button
     * "Oh Live trials, how they interfere with full deployments" :smiley:
     * Check out how to add [Join Zoom with Sx10's](https://github.com/Bobby-McGonigle/Macro-Samples/tree/master/Join%20Zoom/Join%20Zoom%20(Basic)/Connect%20Sx10s%20Too) too!
* This is a very basic, but successful user experience
* The UI Button is created in the Macro Script itself on lines 10-24
  * ```javascript
    xapi.command('UserInterface Extensions Panel Save', {PanelId: 'pure_Zoom'},
      `
      <Extensions>
        <Version>1.4</Version>
        <Panel>
          <Type>Home</Type>
          <Icon>${zoom_Button_Icon}</Icon>
          <Order>1</Order>
          <Color>${zoom_Button_Color}</Color>
          <Name>${zoom_Button_Text}</Name>
          <ActivityType>Custom</ActivityType>
        </Panel>
      </Extensions>
      `
      );```
  * If you want to change the Look and feel of this UI, go for it, just know this will need to be deleted/modified
  * Notice we can make changes to the UI in this command, which allows for more than what the UI extensions editor has now (5-1-2020)
    * You can change the Panel to be the Official Zoom Color from here :smiley:
      ```javascript
      var zoom_Button_Color = '#2d8bff'; //#2d8bff is the official Zoom Color
      var zoom_Button_Icon = 'Briefing'; //Briefing; Camera
      var zoom_Button_Text = 'Join Zoom';
      ```
    * Keeping the UI apart of the macro makes deployment a tad bit quicker, especially when we tackle the Sx10 Next :smiley:
## Deployment

There are many flavors of deployment, but I recommend using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* Special Thanks to Catherine Conway on communication Choices
* My End Users
* Antoine Eduoard - *Mentor*
