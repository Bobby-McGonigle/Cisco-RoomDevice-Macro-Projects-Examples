const xapi = require('xapi');

/*
Author: Robert McGonigle Jr
        Video Conferencing Services Technician
        Communication and Collaboration Services
        Harvard University Information Technology
        
Date: 04/23/2020
*/


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Store any media here that can be accessed via the Web Engine
//Be sure to test your source prior to deployment for quality, load times, etc.

//This example has multiple iterations of common search engines.

var mediaList = [
    {
        "Title": "Google 1",
        "Duration": "10",
        "URL": "https://www.google.com/",
        "WidgetId": "media_1",
        "Category": "Google"
                },
    {
        "Title": "Google 2",
        "Duration": "10",
        "URL": "https://www.google.com/",
        "WidgetId": "media_2",
        "Category": "Google"
              },
    {
        "Title": "Bing 1",
        "Duration": "10",
        "URL": "https://www.bing.com/",
        "WidgetId": "media_3",
        "Category": "Bing"
              },
    {
        "Title": "Bing 2",
        "Duration": "10",
        "URL": "https://www.bing.com/",
        "WidgetId": "media_4",
        "Category": "Bing"
              },
    {
        "Title": "Google 3",
        "Duration": "10",
        "URL": "https://www.google.com/",
        "WidgetId": "media_5",
        "Category": "Google"
              },
    {
        "Title": "Yahoo 1",
        "Duration": "10",
        "URL": "https://www.yahoo.com/",
        "WidgetId": "media_6",
        "Category": "Yahoo"
              },
    {
        "Title": "Google 4",
        "Duration": "10",
        "URL": "https://www.google.com/",
        "WidgetId": "media_7",
        "Category": "Google"
              },
    {
        "Title": "Bing 3",
        "Duration": "10",
        "URL": "https://www.bing.com/",
        "WidgetId": "media_8",
        "Category": "Bing"
              },
    {
        "Title": "Yahoo 2",
        "Duration": "10",
        "URL": "https://www.yahoo.com/",
        "WidgetId": "media_9",
        "Category": "Yahoo"
              },
    {
        "Title": "Yahoo 3",
        "Duration": "10",
        "URL": "https://www.yahoo.com/",
        "WidgetId": "media_10",
        "Category": "Yahoo"
              },
    {
        "Title": "Google 5",
        "Duration": "10",
        "URL": "https://www.google.com/",
        "WidgetId": "media_11",
        "Category": "Google"
              }
            ];

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

/*
This is the User Interface Constructor.

- This interface builder is simple, and is meant to help guide you in constructing your UI constructor

- I recommend, when automating in the future, to build your UI in the UI extensions editor, export it, and determine which areas should be automated in your design

*/

//This variable will be populated later in the code, please do not edit.
var pageLibrary_Categories = [];

//The 'pageLibrary_Constructor()' will review each category in your Media List above, and build a proper list pages
//Its purpose is to prevent duplicate pages from forming
function pageLibrary_Constructor() {
    for (let i = 0; i < mediaList.length; i++) {
        if (pageLibrary_Categories.includes(mediaList[i].Category)) {

        } else {
            pageLibrary_Categories.push(mediaList[i].Category);
        }
    }
    console.log("Library assembled; Categories Found => " + pageLibrary_Categories);
    console.log("Constructing UI...");
}

pageLibrary_Constructor();

//The 'page_Constructor()' function will make use of both the 'pageLibrary_Categories' array and the 'media' abject above to build your pages
//based on each 'media[n].Category' name
//This example, and all others in this script, ARE case sensitive

function page_Constructor() {
    let insertPage;
    for (let i = 0; i < pageLibrary_Categories.length; i++) {
        insertPage = insertPage + `<Page>
      <Name>${pageLibrary_Categories[i]}</Name>
      <Row>
        <Name>Media Title</Name>
        <Widget>
          <WidgetId>min-sec</WidgetId>
          <Name>Seconds (s)</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>
      ${row_Constructor(pageLibrary_Categories[i])}<!--COMMENT: Notice we call another Constructor here, and pass along the 'pageLibrary_Categories' data as a parameter-->
</Page>`;
    }
    console.log("UI construction Complete! " + mediaList.length + " pieces of media were acquired, please review your array if this number does not reflect the expected output.");
    return insertPage;
}

//The 'row_Constructor()' has a similar role to 'page_Constructor()', but has an added step of evaluating if the 'media' belongs to this page or not
//This will be 1 row per piece of media, and format the row to include the proper widget information and text

function row_Constructor(category) {
    let insertRow;
    for (let i = 0; i < mediaList.length; i++) {
        if (category === mediaList[i].Category) {
            console.log('Adding Media => Title: "' + mediaList[i].Title + '"');
            insertRow = insertRow + `<Row>
        <Name>${mediaList[i].Title}</Name>
        <Widget>
          <WidgetId>${mediaList[i].WidgetId}</WidgetId>
          <Name>Play</Name>
          <Type>Button</Type>
          <Options>size=2</Options>
        </Widget>
        <Widget>
          <WidgetId>timeslot</WidgetId>
          <Name>${mediaList[i].Duration}s</Name>
          <Type>Text</Type>
          <Options>size=2;fontSize=normal;align=center</Options>
        </Widget>
      </Row>`;
        } else {}
    }
    return insertRow;
}

//Here is where the panel button is first made, and triggers the subsequent pages and rows to be built
//We have it set to run about 5 seconds after the script initializes, to allow enough time for the library to be built (a more than generous length of time)

//This is where the 'page_Constructor()' will first be called, and return all of it's information

sleep(5000).then(() => {
    xapi.command('UserInterface Extensions Panel Save', {
        PanelId: 'media_Tutorials_v4'
    }, `<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>2</Order>
    <PanelId>tutorial</PanelId>
    <Origin>local</Origin>
    <Type>Home</Type>
    <Icon>Info</Icon>
    <Color>#000000</Color>
    <Name>Media Player</Name>
    <ActivityType>Custom</ActivityType>
    ${page_Constructor()}
  </Panel>
</Extensions>`);
});

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

/*
This is the Media Player itself

- It can handle anything the Room Device's Web Engine can handle, but is limited as there is no user navigation available
-- Youtube videos, Team Docs, Room Directions, anything you can think of that's accessible on the net, or your org

- This player will take in account for all the information preset in the 'media' object, and play the content appropriately

To break down a media object

"Title": The Title of your content, restricted character limit based on Row Name,
"Duration": How long you want your media to run for,
"URL": Location of your content, BE sure your Network permissions are open to access this content,
"WidgetId": Set the Widget ID to your button on the Touch 10,
"Category": Use in the UI construction above

*/

//Used to lengthen media duration, based on observing your media load speeds
var mediaTimeBuffer = 5; //seconds

//System Configuratoin Defaults
////Fill this section out to match your normal system build
var ultraSound_Default = 45;
var proximity_Default = 'On';
var halfwakeMessage_Default = "";

//used in logs
var exitMedia_log = 'x';
var count_Interupt = 0;

//counter
let count = 0;

//Sets system into a state to make use of the digital signage platform
function startMedia() {
    xapi.config.set('Proximity Mode', 'OFF');
    xapi.config.set('Audio Ultrasound MaxVolume', 0);
    xapi.config.set('Standby Signage Mode', 'ON');
    xapi.config.set('WebEngine Mode', 'ON');
    xapi.command('Standby Halfwake');
    sleep(100).then(() => {
        mediaTimer();
    });
}

//Reverts system back to the original state of your system.
function exitMedia() {
    xapi.config.set('UserInterface OSD HalfwakeMessage', halfwakeMessage_Default);
    xapi.config.set('Proximity Mode', 'On');
    xapi.config.set('Audio Ultrasound MaxVolume', ultraSound_Default);
    xapi.config.set('WebEngine Mode', 'OFF');
    xapi.command('Standby Deactivate');
    xapi.config.set('Standby Signage Mode', 'OFF');
    count_Interupt = count;
    count = -1;
}

//Timer for media playback. Used for logging and exiting the media
function mediaTimer() {
    count--;
    if (count === 0) {
        exitMedia();
        console.log('media: "' + exitMedia_log + '" finished.');
    }
    if (count <= -2) {
        if (count_Interupt > 0) {
            console.log('Media: "' + exitMedia_log + '" stopped by user. Time remaining: ' + (count_Interupt - mediaTimeBuffer) + 's.');
        }
        return;
    }
    setTimeout(mediaTimer, 1000);
}

//Detects if the standby state is interrupted, then runs exits the media if running
xapi.status.on('Standby State', (state) => {
    if (state == 'Off') {
        exitMedia();
    }
});

//UI actions, this will search through the array, and grab the proper content when the button is pressed.
xapi.event.on('UserInterface Extensions Widget Action', (event) => {
    if (event.Type === 'released') {
        mediaList.find(function (item, i) {
            if (item.WidgetId === event.WidgetId) {
                let index = i;
                exitMedia_log = mediaList[index].Title;
                console.log('media: "' + mediaList[index].Title + '" started.');
                xapi.config.set('UserInterface OSD HalfwakeMessage', "Now Playing: " + mediaList[index].Title + ". Tap the touch panel to exit.");
                sleep(100).then(() => {
                    xapi.config.set('Standby Signage Url', mediaList[index].URL);
                    count = parseInt(mediaList[index].Duration) + mediaTimeBuffer;
                    startMedia();
                });
                return;
            } else {
                return;
            }
        });
    }
});
