const xapi = require('xapi');

//_-_-Functions_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNewDateTime() {
    xapi.command('Time DateTime Get').then((date) => {
        payload.endpoint_Date = date.Month + "/" + date.Day + "/" + date.Year;
        payload.endpoint_Time = date.Hour + ":" + date.Minute + ":" + date.Second;
    });
}

//Used to pull system information and apply it to the Payload
function init() {
    xapi.status.get('UserInterface ContactInfo Name').then((info) => {
        payload.endpoint_Name = info;
    });

    xapi.status.get('Network 1 IPv4 Address').then((info) => {
        payload.endpoint_IP = info;
    });

    xapi.status.get('Network 1 Ethernet MacAddress').then((info) => {
        payload.endpoint_Mac = info;
    });
    getNewDateTime();
    sleep(250).then(() => {
        console.log(payload);
    });
}

//Used to post information to Flows
function postMessage() {
    xapi.command('HttpClient Post', {
        'AllowInsecureHTTPS': 'True',
        'Header': [contentType],
        'ResultBody': 'PlainText',
        'Url': p_Automate_url,
    }, JSON.stringify(payload)).then((result) => {
        console.log("Message Posted: " + payload.call_Method + " StatusCode: " + result.StatusCode);
    }).catch(e => {
        console.error("Error => Status Code: " + e.data.StatusCode);
    });
}

//_-_-DATA Collection_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Flow Target URL
var p_Automate_url = ""; //Insert URL Here

//HTTP
var contentType = "Content-Type: application/json";
var auth = "YWRtaW4K";

let jzDetection = false;
let URI_Pattern;

var payload = {
    "auth": auth,
    "endpoint_Date": "",
    "endpoint_Time": "",
    "endpoint_Name": "",
    "endpoint_IP": "",
    "endpoint_Mac": "",
    "call_Method": ""
};

init();

xapi.event.on('CallDisconnect', (event) => {
    jzDetection = false;
});

xapi.event.on('CallSuccessful', (event) => {
    if (jzDetection === true) {
        payload.call_Method = 'JoinZoom_Button' + URI_Pattern[1];
        getNewDateTime();
        sleep(250).then(() => {
            postMessage();
        });
    } else {
        payload.call_Method = URI_Pattern[1];
        getNewDateTime();
        sleep(250).then(() => {
            postMessage();
        });
    }
});

xapi.status.on('Call RemoteNumber', (remoteNumber) => {
    if (remoteNumber.includes('@')) {
        URI_Pattern = remoteNumber.split('@');
        payload.call_Method = URI_Pattern[1];
    }
});

//_-_-JoinZoom UI and Function-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

// Join Zoom button elements on the touch panel
var zoom_Button_Color = '#2d8bff'; //#2d8bff is the official Zoom Color
var zoom_Button_Icon = 'Briefing'; //Briefing; Camera
var zoom_Button_Text = 'Join Zoom';

//Zoom information used later in code
var zoomDomain = 'Domain';
var zoomSipPattern = '@zoomcrc.com';


//Removes Launch Meeting, in case this button still exists, then adds in the Join Zoom interface
xapi.command('UserInterface Extensions Panel Remove', {
    PanelID: 'launch_meeting'
});
xapi.command('UserInterface Extensions Panel Save', {
        PanelId: 'pure_Zoom_wAnalytics'
    },
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
);

//Listens for the joinZoom button to be pressed, then prompts a text field for the Meeting ID
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch (event.PanelId) {
        case 'pure_Zoom':
            xapi.command('UserInterface Message TextInput Display', {
                Title: 'Join Zoom Meeting',
                Text: 'Enter the Meeting ID and tap Join.<p> Want your own Zoom account? Go to ' + zoomDomain.toLowerCase() + '.zoom.us',
                FeedbackId: 'zoom2.0',
                Placeholder: 'Meeting ID',
                InputType: 'Numeric',
                KeyboardState: 'Open',
                SubmitText: 'Join'
            });
            console.log('Zoom Panel Opened');
            break;
    }
});

// Listens to the Users entry from the text field above, and either appends '@zoomcrc.com' or does nothing depending on the dial method
xapi.event.on('UserInterface Message TextInput Response', (event) => {
    switch (event.FeedbackId) {
        case 'zoom2.0':
            if (event.Text.includes((".") || ('@'))) {
                jzDetection = true;
                xapi.command('Dial', {
                    Number: event.Text
                });
                console.log('Full URI entered, no changes applied. String entered: ' + event.Text);
            } else {
                jzDetection = true;
                xapi.command('Dial', {
                    Number: event.Text + zoomSipPattern
                });
                console.log('No SIP pattern entered. Appending "' + zoomSipPattern + '" to => ' + event.Text);
            }
    }
});
