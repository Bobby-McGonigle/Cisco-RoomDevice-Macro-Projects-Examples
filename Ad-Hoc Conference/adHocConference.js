const xapi = require('xapi');

var callService = {
    "service" : "Webex",
    "domain": "domain.webex.com",
    "userName": "John_Smith",
    "hostPin": "1234",
    "globalCallIn": "1-555-555-5555",
    "accessCode": "555 555",
};

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

var callService_CallInfo = {
    "sipAddress": callService.userName + "@" + callService.domain,
    "hostUrl": "https://" + callService.domain + "/meet/" + callService.userName
};

var callService_Details = {
    "homeTitle": "Host a "+callService.service+" from this space",
    "onCallTitle": "Guest Information",
    "row_1": "Invite Guests to call in by sharing the information below: ",
    "row_2": "Join Via Computer: " + callService_CallInfo.hostUrl,
    "row_3": "Join Via Video System: " + callService_CallInfo.sipAddress,
    "row_4": "Join Via Phone: " + callService.globalCallIn,
    "placeCall_Button": "Start your Meeting"
};

var callPrompt = {
    "title": "Please Wait",
    "text": "Connecting you as host of " + callService.userName + "."
};

let room_PMR_State = false;

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Listens to call disconnect and updates variables
xapi.event.on('CallDisconnect', (event) => {
    room_PMR_State = false;
    xapi.command('UserInterface Extensions Panel Remove', {PanelId: 'guest_info'});
    console.log('In Room PMR Status => ' + room_PMR_State);
});

//Listens to call connect and updates variables and execute the PIN if the proper conditions are met.
xapi.event.on('CallSuccessful', (event) => {
    if (room_PMR_State === true) {
        xapi.command("Call DTMFSend", {
            DTMFString: callService.hostPin + '#'
        });
        console.log('PMR connected hostpin: ' + callService.hostPin + ' entered');
        sleep(5000).then(() => {
            xapi.command('UserInterface Message Prompt Clear');
        });
    } else if (room_PMR_State === false) {}
});

//Listens to User Interaction of the new panel, and executes the call to the PMR
xapi.event.on('UserInterface Extensions Widget Action', (event) => {
    if (event.Type === 'clicked') {
        switch (event.WidgetId) {
            case 'room_PMR':
                console.log('PMR Button Pressed');
                xapi.command("dial", {
                    Number: callService_CallInfo.sipAddress
                });
                console.log('Dialing: ' + callService_CallInfo.sipAddress);
                break;
            default:
                break;
        }
    }
});

//Checks to see if the number dialed matched the PMR in this script
xapi.status.on('Call RemoteNumber', (remoteNumber) => {
    if (remoteNumber.includes(callService_CallInfo.sipAddress)) {
        room_PMR_State = true;
        xapi.command("UserInterface Message Prompt Display", {
            Title: callPrompt.title,
            Text: callPrompt.text,
            Duration: 0,
            'Option.1': "Dismiss",
        });
        guestInfo();
        console.log('In Room PMR Status => ' + room_PMR_State);
    }
});

//Logs non PMR numbers
xapi.status.on('Call RemoteNumber', (remoteNumber) => {
    if (remoteNumber.includes(('@') || ('.')) && !remoteNumber.includes(callService_CallInfo.sipAddress)) {
        console.log('Number Used ' + remoteNumber);
    }
});

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

var adhocUI_Details = {
    "buttonColor": "#A866FF",
    "buttonIcon": "Webex",
    "buttonText": {
        "home": "Ad-Hoc Meeting",
        "call": "Guest Information"
    }
};

//Creates the button panel for the T10 home screen
xapi.command('UserInterface Extensions Panel Save', {
        PanelId: 'host_'+callService.service
    },
    `<Extensions>
  <Version>1.5</Version>
  <Panel>
    <Type>Home</Type>
    <Icon>${adhocUI_Details.buttonIcon}</Icon>
    <Order>1</Order>
    <Color>${adhocUI_Details.buttonColor}</Color>
    <Name>${adhocUI_Details.buttonText.home}</Name>
    <Page>
      <Name>${callService_Details.homeTitle}</Name>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>info_pane_text_1</WidgetId>
          <Name>${callService_Details.row_1}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>join_comp_text_1</WidgetId>
          <Name>${callService_Details.row_2}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>join_vid_text_1</WidgetId>
          <Name>${callService_Details.row_3}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>join_phone_text_1</WidgetId>
          <Name>${callService_Details.row_4}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>room_PMR</WidgetId>
          <Name>${callService_Details.placeCall_Button}</Name>
          <Type>Button</Type>
          <Options>size=4</Options>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
</Extensions>`
);

//Creates the guest information panel for incall only

function guestInfo(){
xapi.command('UserInterface Extensions Panel Save', {
        PanelId: 'guest_info'
    },
    `<Extensions>
  <Version>1.5</Version>
  <Panel>
    <Type>InCall</Type>
    <Icon>${adhocUI_Details.buttonIcon}</Icon>
    <Order>2</Order>
    <Color>${adhocUI_Details.buttonColor}</Color>
    <Name>${adhocUI_Details.buttonText.call}</Name>
    <Page>
      <Name>${callService_Details.onCallTitle}</Name>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>info_pane_text_2</WidgetId>
          <Name>${callService_Details.row_1}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>join_comp_text_2</WidgetId>
          <Name>${callService_Details.row_2}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>join_vid_text_2</WidgetId>
          <Name>${callService_Details.row_3}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>join_phone_text_2</WidgetId>
          <Name>${callService_Details.row_4}</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=small;align=left</Options>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
  </Extensions>`
);
}
