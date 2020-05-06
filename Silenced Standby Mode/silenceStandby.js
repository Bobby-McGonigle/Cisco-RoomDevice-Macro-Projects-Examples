const xapi = require('xapi');

//Set the defaults to your room system's config
var systemDefaults = {
    "maxUltrasound": 70,
    "proximityMode": "off",
    "wakeOnMotion": "on"
};

//The features we update to prevent waking the system via ultrasound, then place into standby
function silenceMode() {
    xapi.config.set('Audio Ultrasound MaxVolume', 0);
    xapi.config.set('Proximity Mode', 'off');
    xapi.config.set('Standby WakeupOnMotionDetection', 'off');
    xapi.command('Standby Activate');
}

function unSilenceMode() {
    xapi.config.set('Audio Ultrasound MaxVolume', systemDefaults.maxUltrasound);
    xapi.config.set('Proximity Mode', systemDefaults.proximityMode);
    xapi.config.set('Standby WakeupOnMotionDetection', systemDefaults.wakeOnMotion);
}

//When a user taps the touch panel, undo all the changes made by the Silence Button
xapi.status.on('Standby State', state => {
    if (state === 'Off') {
        console.log('Exiting Standby, setting ultrasound to default: ' + systemDefaults.maxUltrasound);
        unSilenceMode();
    }
});

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch (event.PanelId) {
        case 'silenced_standby':
            console.log('Silence Standby Clicked - Waiting for user input...');
            xapi.command('UserInterface Message Prompt Display', {
                Title: 'Silenced Standby Mode',
                Text: 'Enabling Silenced Standby will do the following: Disable Proximity Pairing and Place the system into Standby. In order to wake the system and re-enable Proximity, you will need to tap the Touch Panel. Do you wish to continue?',
                Duration: 30,
                FeedbackId: 'silence_Prompt',
                'Option.1': 'Enable Silenced Standby',
                'Option.2': 'Cancel',
            });
            break;
    }
});

xapi.event.on('Userinterface Message Prompt Response', (event) => {
    switch (event.FeedbackId + event.OptionId) {
        case 'silence_Prompt' + '1':
            console.log('Silenced Standby Activated - Ultrasound set to 0');
            silenceMode();
            break;
        case 'silence_Prompt' + '2':
            console.log('Silenced Standby dismissed');
    }
});


//Generate the Silenced Standby button on the Touch 10
xapi.command('UserInterface Extensions Panel Save', {
        PanelId: 'silenced_standby'
    },
    `
<Extensions>
  <Version>1.6</Version>
  <Panel>
    <Type>Home</Type>
    <Icon>Power</Icon>
    <Order>2</Order>
    <Color>#A51C30</Color>
    <Name>Silenced Standby</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
);
