const xapi = require('xapi');

/********************************************************
 * Author: Robert McGonigle Jr, Video Services Engineer
 * robert_mcgonigle@havard.edu
 * Release: 7/16/2020
 * Last Update: 7/16/2020
 * 
 * Version: 1.0.0
 * 
 * Harvard University Information Technology
 * 
 * Description:
      * The USB Headset mod was built to lock a system into using the USB Headset at all times
      * This was developed with the propose that a 3rd party USB device could serve as a Audio DSP for a Room Kit Mini
         The Room Kit mini was not built with and Audio Input, and the Headset is toggle-able. 
         If you find a set of USB hardware that can act as a headset and function as an audio processor, 
         then this Script will prevent users from de-selecting Headset Mode
********************************************************/

var testMode = {
  active: false, //<true/false>
  state: 'On' //do not modify this value
}

var usbConnection;

var usbType = 'HeadsetUSB'//HandsetUSB

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

xapi.status.on('Audio Devices HeadsetUSB ConnectionStatus', (event) => {
  console.log(event);
  if (event === 'Connected') {
    usbConnection = true;
    usbType = 'HeadsetUSB';
    //console.log(usbConnection);
    sleep(500).then(() => {
      xapi.command('Audio Select', {
        Device: usbType
      });
    })
    xapi.status.get('Audio Devices HeadsetUSB Description').then((event) => {
      console.log(event);
      if (testMode.active === true) {
        xapi.command('UserInterface Extensions Widget SetValue', {
          WidgetId: 'dev_Device',
          Value: event
        });
        xapi.command('UserInterface Extensions Widget SetValue', {
          WidgetId: 'dev_DeviceType',
          Value: usbType
        });
        xapi.command('UserInterface Extensions Widget SetValue', {
          WidgetId: 'dev_ConnectionStatus',
          Value: usbConnection
        });
      }
    })
  } else {
    usbConnection = false;
    if (testMode.active === true) {
      xapi.command('UserInterface Extensions Widget SetValue', {
        WidgetId: 'dev_ConnectionStatus',
        Value: usbConnection
      });
      xapi.command('UserInterface Extensions Widget SetValue', {
        WidgetId: 'dev_Device',
        Value: 'Device Description'
      });
      xapi.command('UserInterface Extensions Widget SetValue', {
        WidgetId: 'dev_DeviceType',
        Value: 'Device Type'
      });
    }
  }
})

xapi.status.get('Audio Devices HeadsetUSB ConnectionStatus').then((event) => {
  console.log(event);
  if (event === 'Connected') {
    usbConnection = true;
    usbType = 'HeadsetUSB';
    //console.log(usbConnection);
    sleep(500).then(() => {
      xapi.command('Audio Select', {
        Device: usbType
      });
    })
    xapi.status.get('Audio Devices HeadsetUSB Description').then((event) => {
      console.log(event);
      if (testMode.active === true) {
        xapi.command('UserInterface Extensions Widget SetValue', {
          WidgetId: 'dev_Device',
          Value: event
        });
        xapi.command('UserInterface Extensions Widget SetValue', {
          WidgetId: 'dev_DeviceType',
          Value: usbType
        });
        xapi.command('UserInterface Extensions Widget SetValue', {
          WidgetId: 'dev_ConnectionStatus',
          Value: usbConnection
        });
      }
    })
  } else {
    usbConnection = false;
    if (testMode.active === true) {
      xapi.command('UserInterface Extensions Widget SetValue', {
        WidgetId: 'dev_ConnectionStatus',
        Value: usbConnection
      });
      xapi.command('UserInterface Extensions Widget SetValue', {
        WidgetId: 'dev_Device',
        Value: 'Device Description'
      });
      xapi.command('UserInterface Extensions Widget SetValue', {
        WidgetId: 'dev_DeviceType',
        Value: 'Device Type'
      });
    }
  }
})

xapi.status.on('Audio SelectedDevice', (event) => {
  console.log(event);
  if (testMode.state === 'On') {
    if (usbConnection === true) {
      if (event === 'Internal') {
        xapi.command('Audio Select', {
          Device: usbType
        });
        xapi.command('Userinterface Message Alert Display', {
          Title: 'Action Blocked',
          Text: 'Please do not attempt to change this option. A system administrator has blocked this action.<p> For more information, contact your local IT department.',
          Duration: 5
        })
      }
    } else {

    }
  }
})

xapi.status.get('Audio SelectedDevice').then((event) => {
  console.log(event);
    if (testMode.state === 'On') {
    if (usbConnection === true) {
      if (event === 'Internal') {
        xapi.command('Audio Select', {
          Device: usbType
        });
        xapi.command('Userinterface Message Alert Display', {
          Title: 'Action Blocked',
          Text: 'Please do not attempt to change this option. A system administrator has blocked this action.<p> For more information, contact your local IT department.',
          Duration: 5
        })
      }
    } else {

    }
  }
})

xapi.event.on('UserInterface Extensions Widget Action', (event) => {
  if (event.Type === 'released' ){
    switch(event.Value){
      case 'dev_On':
        testMode.state = 'On';
        console.log(event);
        break;
      case 'dev_Off':
        testMode.state = 'Off';
        console.log(event);
        break;
    }
  }
})

userInterface();

function userInterface() {
  if (testMode.active === true) {
    xapi.command('UserInterface Extensions Panel Save', {
      PanelId: 'usb_Headset_Testing'
    }, `<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>1</Order>
    <PanelId>usb_Headset_Testing</PanelId>
    <Type>Home</Type>
    <Icon>Microphone</Icon>
    <Color>#00D6A2</Color>
    <Name>USB HeadSet TestMode</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>Headset TestMode</Name>
      <Row>
        <Name>Mode</Name>
        <Widget>
          <WidgetId>usbDevMode</WidgetId>
          <Type>GroupButton</Type>
          <Options>size=4;columns=2</Options>
          <ValueSpace>
            <Value>
              <Key>dev_Off</Key>
              <Name>OFF</Name>
            </Value>
            <Value>
              <Key>dev_On</Key>
              <Name>ON</Name>
            </Value>
          </ValueSpace>
        </Widget>
      </Row>
      <Row>
        <Name>Connection Status</Name>
        <Widget>
          <WidgetId>dev_ConnectionStatus</WidgetId>
          <Name>Connection Status</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Device Type</Name>
        <Widget>
          <WidgetId>dev_DeviceType</WidgetId>
          <Name>Device Type</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=left</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Device Description</Name>
        <Widget>
          <WidgetId>dev_Device</WidgetId>
          <Name>Device Description</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=left</Options>
        </Widget>
      </Row>
      <Options>hideRowNames=0</Options>
    </Page>
  </Panel>
</Extensions>`);
    xapi.command('UserInterface Extensions Widget SetValue', {
      WidgetId: 'usbDevMode',
      Value: 'dev_' + testMode.state
    })
  } else {
    xapi.command('UserInterface Extensions Panel Remove', {
      PanelId: 'usb_Headset_Testing'
    });
    testMode.state = 'On';
  }
}
