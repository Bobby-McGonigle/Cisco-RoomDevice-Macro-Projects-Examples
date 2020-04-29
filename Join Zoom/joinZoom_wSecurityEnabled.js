const xapi = require('xapi');

//Special Thanks to Dmitriy Bakhter for discovering a dial string oversight :)

//Properties of the 'JoinZoom' Custom Button
var JZ_Button = {
    color: '#000000', //#2d8bff is the offical Zoom Color
    icon: 'Briefing', //Briefing; Camera
    text: 'Join Zoom'
};

//Call information needed to automate the JoinZoom functionanlity.
////Update the 'domain' to match your instnace.
var JZ_callInformation = {
    domain: 'Domain',
    sipPattern: '@zoomcrc.com',
    meetingNumber: null,
    hostKey: null,
    meetingPassphrase: null,
    role: null,
    jzButton_Status: false
};

//Spawns in the JoinZoom Button
xapi.command('UserInterface Extensions Panel Save', {
        PanelId: 'pure_Zoom'
    },
    `
<Extensions>
  <Version>1.6</Version>
  <Panel>
    <Type>Home</Type>
    <Icon>${JZ_Button.icon}</Icon>
    <Order>1</Order>
    <Color>${JZ_Button.color}</Color>
    <Name>${JZ_Button.text}</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
);

//Generic Sleep timer, used to slow down specific tasks as needed.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Used to dynamically update the SIP URI and Host Key information when dialing from the 'JoinZoom' button
function passphraseModifier() {
    if (JZ_callInformation.meetingPassphrase !== null) {
        if (JZ_callInformation.meetingPassphrase !== '') {
            return '.' + JZ_callInformation.meetingPassphrase;
        } else {
            return '.';
        }
    } else {
        return '.';
    }
}

function hostkeyModifier() {
    if (JZ_callInformation.hostKey !== null) {
        if (JZ_callInformation.hostKey !== '') {
            return '..' + JZ_callInformation.hostKey;
        } else {
            return '..';
        }
    } else {
        return '..';
    }
}

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Used as a switch to verify if the 'JoinZoom' button was used, as opposed to the native 'call' interface
xapi.status.on('Call RemoteNumber', (remoteNumber) => {
    if (remoteNumber.includes(JZ_callInformation.meetingNumber)) {
        JZ_callInformation.jzButton_Status = true;
        xapi.command("UserInterface Message Prompt Display", {
            Title: 'Please Wait',
            Text: 'Entering Meeting ID: ' + JZ_callInformation.meetingNumber,
            Duration: 0,
            'Option.1': "Dismiss",
        });
        console.log('Joining Meeting Id: "' + JZ_callInformation.meetingNumber + '" as "' + JZ_callInformation.role);
    }
});

//Used to reset the Call information Variable after each call.
xapi.event.on('CallDisconnect', (event) => {
    JZ_callInformation = {
        domain: 'Domain',
        sipPattern: '@zoomcrc.com',
        meetingNumber: null,
        hostKey: null,
        meetingPassphrase: null,
        role: null,
        jzButton_Status: false
    };
});

//Checks checks if the Join Zoom button was used, and appends the appropriate SIP/DTMF information as needed.
xapi.event.on('CallSuccessful', (event) => {
    if (JZ_callInformation.jzButton_Status === true) {
        console.log('Connected to Meeting Id: "' + JZ_callInformation.meetingNumber + '" as "' + JZ_callInformation.role);
        if (JZ_callInformation.role == 'Host') {
            sleep(5000).then(() => {
                xapi.command('UserInterface Message Prompt Clear');
            });
        }
        if (JZ_callInformation.role == 'Participant') {
            sleep(5000).then(() => {
                xapi.command('UserInterface Message Prompt Clear');
            });
        }
    } else if (JZ_callInformation.jzButton_Status === false) {}
});


//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Listens for the joinZoom button to be pressed, then prompts a text field for the Meeting ID
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch (event.PanelId) {
        case 'pure_Zoom':
            xapi.command('UserInterface Message TextInput Display', {
                Title: 'Join Zoom Meeting',
                Text: 'Enter the Meeting ID, tap Next and follow the prompts.<p> Want your own Zoom account? Go to '+JZ_callInformation.domain.toLowerCase()+'.zoom.us',
                FeedbackId: 'zoom4.0',
                Placeholder: 'Meeting ID',
                InputType: 'Numeric',
                KeyboardState: 'Open',
                SubmitText: 'Next'
            });
            console.log('Zoom Panel Opened');
            break;
    }
});

//Series of prompts to collect call information and guide users into their respective Roles.
xapi.event.on('UserInterface Message TextInput Response', (event) => {
    if (event.Text != "?") {
        switch (event.FeedbackId) {
            case 'zoom4.0':
                JZ_callInformation.meetingNumber = event.Text;
                xapi.command('UserInterface Message Prompt Display', {
                    Title: 'Select your Zoom Meeting Role',
                    Text: 'Please select your Role for Meeting ID: ' + JZ_callInformation.meetingNumber + ' <p> Then follow the remaining prompts.',
                    FeedbackId: 'zoom4.1',
                    'Option.1': 'Join As the Host',
                    'Option.2': 'Join As a Participant',
                    'Option.3': 'Dismiss'
                });
                console.log('Meeting Id: "' + JZ_callInformation.meetingNumber + '" entered. Selecting Role...');
                break;
            case 'zoom4.25':
                JZ_callInformation.hostKey = event.Text;
                xapi.command('UserInterface Message TextInput Display', {
                    Title: 'Joining ' + JZ_callInformation.meetingNumber + ' as Host',
                    Text: 'Please enter the Meeting Password if available, then tap Join.<p>If not the Host, type "?" to head back to the Role Menu',
                    FeedbackId: 'zoom4.2',
                    Placeholder: 'Meeting Password or Leave Blank',
                    InputType: 'Numeric',
                    KeyboardState: 'Open',
                    SubmitText: 'Join'
                });
                break;
            case 'zoom4.2':
                JZ_callInformation.meetingPassphrase = event.Text;
                sleep(250).then(() => {
                    xapi.command("dial", {
                        Number: JZ_callInformation.meetingNumber + passphraseModifier()+ hostkeyModifier()+ JZ_callInformation.sipPattern
                    });
                });
                break;
            case 'zoom4.3':
                JZ_callInformation.hostKey = null;
                JZ_callInformation.meetingPassphrase = event.Text;
                sleep(250).then(() => {
                    xapi.command("dial", {
                        Number: JZ_callInformation.meetingNumber + passphraseModifier() + JZ_callInformation.sipPattern
                    });
                });
                break;
        }
    }
    switch (event.FeedbackId + event.Text) {
        case event.FeedbackId + '?':
            xapi.command('UserInterface Message Prompt Display', {
                Title: 'Select your Zoom Meeting Role',
                Text: 'Please select your Role for Meeting ID: ' + JZ_callInformation.meetingNumber + ' <p> Then follow the remaining prompts.',
                FeedbackId: 'zoom4.1',
                'Option.1': 'Join As the Host',
                'Option.2': 'Join As a Participant',
                'Option.3': 'Dismiss'
            });
            console.log('Re-selecting Role; Was "' + JZ_callInformation.role + '"');
            break;
    }
});

xapi.event.on('UserInterface Message Prompt Response', (event) => {
    switch (event.FeedbackId + event.OptionId) {
        case 'zoom4.1' + '1':
            JZ_callInformation.role = 'Host';
            xapi.command('UserInterface Message TextInput Display', {
                Title: 'Joining ' + JZ_callInformation.meetingNumber + ' as Host',
                Text: 'Please enter your Host Key, then tap Join.<p>If not the Host, type "?" to head back to the Role Menu',
                FeedbackId: 'zoom4.25',
                Placeholder: 'Host Key or Leave Blank',
                InputType: 'Numeric',
                KeyboardState: 'Open',
                SubmitText: 'Next'
            });
            console.log('Role: "' + JZ_callInformation.role + '" selected. Waiting for user to enter "' + JZ_callInformation.role + '" credentials...');
            break;
        case 'zoom4.1' + '2':
            JZ_callInformation.role = 'Participant';
            xapi.command('UserInterface Message TextInput Display', {
                Title: 'Joining ' + JZ_callInformation.meetingNumber + ' as a Participant',
                Text: 'Please enter the Meeting Password if available, then tap Join.<p>If you\'re the Host, type "?" to head back to the Role Menu',
                FeedbackId: 'zoom4.3',
                Placeholder: 'Meeting Password or Leave Blank',
                InputType: 'Numeric',
                KeyboardState: 'Open',
                SubmitText: 'Join'
            });
            console.log('Role: "' + JZ_callInformation.role + '" selected. Waiting for user to enter "' + JZ_callInformation.role + '" credentials...');
            break;
    }
});
