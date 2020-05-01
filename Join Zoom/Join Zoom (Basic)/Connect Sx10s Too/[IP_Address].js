//The code below, allows our JS runtime environment pair to the Cisco Sx10 via ssh.

const jsxapi = require('jsxapi');
const start = console.log("App Started");

//locate and use this file name as the IP address for the system
const path = require('path');
var scriptName = path.basename(__filename);
var ip = scriptName.slice(0, -3);

//takes new 'ip' variable and inserts it here and connects to the endpoint over SSH
const xapi = jsxapi.connect('ssh://' + ip, {
    username: 'integrator',
    password: 'password',
});

//error handler....
xapi.on('error', (err) => {
    // !! Note of caution: This event might fire more than once !!
    console.error(codecName + `: xapi error: ${err}`);
    throw err;
});

//The code makes use of the Sx10 xAPI. Similar to the Macro runtime environment.
//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\\

var zoom_Button_Color = '#2d8bff'; //#2d8bff is the official Zoom Color
var zoom_Button_Icon = 'Briefing'; //Briefing or Camera
var zoom_Button_Text = 'Join Zoom';

var zoomDomain = 'Domain';
var zoomSipPattern = '@zoomcrc.com';

var codecName;

var warningTitle = 'Uh-Oh!';
var warningBox_1 = 'This functionality is unavailable at the moment. Please use the green "Call" button instead.';
var warningBox_2 = 'Zoom Calling: Enter in the "MeetingID" + "@zoomcrc.com". Then press call.';
var warningBox_3 = 'Please submit a ticket to your IT Help Desk and indicate that the "Join Zoom" button is not functioning in your telepresence space.';

//Pulls the CODEC name, used for logging in fork mode of pm2
xapi.status.get('UserInterface ContactInfo Name').then((info) => {
    codecName = info;
});

// monitor
xapi.event.on('CallSuccessful', (event) => {
    console.log(codecName + ": Call Connected");
});

xapi.event.on('CallDisconnect', (event) => {
    console.log(codecName + ": Call Disconnected");
});

xapi.command('UserInterface Extensions Panel Remove', {
    PanelID: 'launch_meeting'
});
xapi.command('UserInterface Extensions Panel Save', {
        PanelId: 'pure_Zoom_Sx10'
    },
    `
<Extensions>
  <Version>1.6</Version>
  <Panel>
    <Type>Home</Type>
    <Icon>${zoom_Button_Icon}</Icon>
    <Order>1</Order>
    <Color>${zoom_Button_Color}</Color>
    <Name>${zoom_Button_Text}</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>${warningTitle}</Name>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>widget_6</WidgetId>
          <Name>${warningBox_1}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>widget_7</WidgetId>
          <Name>${warningBox_2}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>widget_8</WidgetId>
          <Name>${warningBox_3}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
</Extensions>
`
);

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch (event.PanelId) {
        case 'pure_Zoom_Sx10':
            xapi.command('UserInterface Extensions Panel Close');
            xapi.command('UserInterface Message TextInput Display', {
                Title: 'Join Zoom Meeting',
                Text: 'Enter the Meeting ID and tap Join.<p> Want your own Zoom account? Go to ' + zoomDomain.toLocaleLowerCase() + '.zoom.us',
                FeedbackId: 'zoom2.0',
                Placeholder: 'Meeting ID',
                InputType: 'Numeric',
                KeyboardState: 'Open',
                SubmitText: 'Join'
            });
            console.log(codecName + ': Zoom Panel Opened');
            break;
    }
});

xapi.event.on('UserInterface Message TextInput Response', (event) => {
    switch (event.FeedbackId) {
        case 'zoom2.0':
            if (event.Text.includes((".") || ('@'))) {
                xapi.command('Dial', {
                    Number: event.Text
                });
                console.log(codecName + ': Full URI entered, no changes applied. String entered: ' + event.Text);
            } else {
                xapi.command('Dial', {
                    Number: event.Text + zoomSipPattern
                });
                console.log(codecName + ': No SIP pattern entered. Appending "' + zoomSipPattern + '" to => ' + event.Text);
            }
    }
});
