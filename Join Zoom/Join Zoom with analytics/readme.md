# Let's Pull Analytical data from our Join Zoom button
### With the power of Macros and Microsoft Power Automate

## Inspiration
* I developed the Join Zoom button many months back, and I can see people use and talk about it, but I'm not getting some real valuable information.
* I wanted to get a finite impression of whether or not my users are making use of this new Button for calling into Zoom Meetings, or if they are calling in using the Native call button on the video endpoint.
* This not only will help guide my next suite of integrations or UI enhancements, but it produces a neat little pie chart in excel and you can say to your boss "Hey it works, you can sign me on for another year right?!?!" :smirk:)

## What You'll Need
* Cisco Room device on ce 9.8.X or greater (Works on Cloud registered endpoints too)
* Admin Access
* Some Knowledge on the Macro Editor
* Some Knowledge on Editing Scripts
* Access to an O365 account with Excel and Power Automate available
  * Or another service that can collect data
* Some Knowledge on Excel and Power Automate (Not much, but some :smiley:)

## Gettings Started

We will be collecting the following information in this example
* Date and time (reported by the endpoint)
* Endpoint IP
* Endpoint MAC
* Endpoint Name
* Call Method
  * Call Method will be generic, except for when we use our Custom Button on the Touch 10
   **NOTE**: Not all of this information is needed, but is good for Troubleshooting and other data manipulation for future projects
   Feel free to make changes as needed.

### Step 1
Creating our Excel Table
* Create a new Excel sheet online
* Name it something that makes Sense to you, and your data collection mission
* Create a table with the following collums
  ![Example Table](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/08_Excel%20Table.png)
* Save your document, and move over to MicroSoft Power Automate

### Step 2
Building your Flow using [Power Automate](https://docs.microsoft.com/en-us/power-automate/)
* Create a new Flow
* Name this flow in a way that makes sense to you

Here is an example image of the Flow we're going to build from the Top Down

![Full Flow](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/01_FullFlow.png)

#### From Top down, we will use the following flow tools
  * When an HTTP Request is received
    * This is the Trigger to your flow
    * This is where our Room Device will make an HTTP Post with a full payload of information
    * Once this tool is built out and the flow is saved, it will create a URL which you'll need to copy and use later in the Macro Script.
      * This URL is what your Room Device will post too.
      ![When an HTTP Request is received](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/03_HTTP%20Request%20Received.png)
  * Next in the flow is the Control Condition
    * This control condition can be used for all sorts or processes, but we're going to uuse it to set up some base authentication
    * Were goint to evaluate if our auth object is equal to the correct authentication in the flow.
      * If it passes, them we'll execute an update to our table
      * If it failes, we'll send an Email to ourselves
      ![Control Condition](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/04_Check%20Credentials.png)
        * #### The control Passes
          * We first send back a 200 repsonse to let the Room Device know everthing is A-Ok!
            ![Pass Authentication](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/05_HTTP%20Response.png)
          * Then we will insert a row into our Table with all the information we gathered from the payload
            ![Add a Row tp a Table](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/06_Add%20Row%20to%20Table.png)
        * #### The control Failes
           * We First send back a 401 response, to let the endpoint know we failed the Authentication Check
           * We then send a notification to ourselves to let us know the X endpoint had an issue
            ![Email Notification](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/07_Email%20Notification.png)

* Now that we have our Flow Built, we can move onto the Endpoint
* Be sure to save your Flow, and before we can start using, we need to perform a test first

### Step 3
Adding in, and Modyifing the JoinZoom with Analytics Script

* First download the script [joinZoom_wAnalytics.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/joinZoom_wAnalytics.js)
  * Go to Line 52 and edit
    * ```var p_Automate_url = "";```
    * This is where you'll add in the URL generated by PowerAutomate's Request is received.
  * Go to line 56 and edit
    * ```var auth = "YWRtaW4K";```
    * This is the Authentication we added to our flow. Make sure the text here matches your Flow's text.
      * I used Base64 in my example, but there is not strict requirement other than being a string
 
 * Save your script
 * Load this into the Endpoint's Macro Editor
 * Save and enable the script
 
 **NOTE**: Like my the original [joinZoom.js](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/joinZoom.js) file, this script will generate the Button onto the T10 for you, if you had used other versions of this script, be sure to disable that macro and delete that the Panel button from thenUI Extensions editor.
 
 ### Step 4
 Testing
 
 Now that you have a Video endpoint with the proper script, and you have a Flow created, its time to test it
 
 * Go back to your flow page, in the top right select Test
  * Perform the test yourself and select Test
      * ![Testing](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/flowTest.PNG)
 * On your Video Endpoint, place a call from either the Call Menu or the Join Zoom button
  * Once the call connects, it will send a post out to Power automate and your flow will run.
   * The flow will tell you if it succeeded or failed
    * Be sure to review to make sure there were no errors.

After a successful run, and the table starts to fill, try other call destinations like Webex, BlueJeans, Selfie.VC, Etc to be sure you're seeing the Different Methods being called

**NOTE**: The ```JoinZoom_Button``` method will only trigger if using the Join Zoom button. If you call into a Zoom meeting with the Native Call Button, then the method will show ```zoomcrc.com```. This is important to note, because the goal of this analysis was to determine which interface was being used for calling.

## What to do from here?
Well I didn't tell you how to organize your data in the spreadsheet, or make any nice looking graphs like these
![Nice Looking Graphs](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Join%20Zoom/Join%20Zoom%20with%20analytics/images/09_Tables%20Made.png)
But I hope this example serves as a good starting point for collecting Data for your Custom elements that don't show in TMS, CUCM, or Webex Control Hub

## Things to consider

* This example is not limited to Power Automate as a tool
* This concept could easily work for any other platform that can receive information over HTTP
* I used power automate, because it's simple to use and was available to me

## Use Case examples

* Collecting information for usage as we had done above
* User Satifaction Surveys
* Resevoir to store information to GET, rather than POST
* Probably more too, Power Automate has A LOT of integrations, I suggest you explore.

## Deployment

There are many flavors of deployment, but I recommned using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* My End Users
* Antoine Eduoard - *Mentor*

