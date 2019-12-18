const xapi = require('xapi');

var captureResponse;

//Event Pitcher
function postRequest(payload) {
  xapi.command('HttpClient Post', devices[device], payload).then((response) => {
    captureResponse = JSON.stringify(response);
    var filterResponse = captureResponse.split(',');
    console.log('Payload sent to '+'"'+devices[device].Url.replace('/putxml', '/')+'"'+' > Command = '+command+' > UserInput Sent = '+userInput+'. Report = '+filterResponse[36].replace('}',''));
  });
}

//creates the paylooad for the postRequest - Author: Magnus Ohm
function sendEvent(message) {
  var payload = "<Command><Message><Send><Text>"+ message +"</Text></Send></Message></Command>";
  postRequest(payload);
}

//default infromation needed for HTTPsPost
const defaults = {'xml': 'Content-Type: text/xml',
                 'auth': 'Authorization: Basic ',
                 'https': 'true'
};

//sets classes for individual room devices, for device selction and control.
const devices = {
                  'default':   {'Url': 'https://x.x.x.x/putxml',
                                'Header': [defaults.xml, defaults.auth + 'YWRtaW46'],
                                'AllowInsecureHTTPS': defaults.https},

                  'room_001':   {'Url': 'https://'+{/*Enter Device IP Here*/}+'/putxml',
                                'Header': [defaults.xml, defaults.auth + {/*Enter Device base64 Authentication Credentials Here*/}],
                                'AllowInsecureHTTPS': defaults.https},

                  'room_002':   {'Url': 'https://'+{/*Enter Device IP Here*/}+'/putxml',
                                'Header': [defaults.xml, defaults.auth + {/*Enter Device base64 Authentication Credentials Here*/}],
                                'AllowInsecureHTTPS': defaults.https},
 };

let device = 'default';

var zoomSipPattern = '@zoomcrc.com';

let command = '000';

let userInput;
let index;

var EVENTURL = 'https://x.x.x.x/putxml';
var HEADERS = ['Content-Type: text/xml', 'Authorization: Basic YWRtaW46MW5maW5pdHlXQHIk'];

xapi.event.on('UserInterface Extensions Widget Action', (event) => {
  if (event.Type == 'released'){
    let message = command+":"+userInput;
        switch(event.Value||event.WidgetId){
          case 'event1':
            device = 'room_001';
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event2':
            device = 'room_002';
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event3':
            //Additional Devices
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event4':
            //Additional Devices
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event6':
            //Additional Devices
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'x001':
            command = '001';
            console.log('Command Selected = '+command);
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Place Call',
                     Text: 'Enter your SIP/H323 video address<p> If dialling outbound audio, please enter "91" + your 10 digit number.',
                     FeedbackId: 'dial1.0',
                     Placeholder: 'Enter call information here',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            break;
          case 'x002':
            command = '002';
            console.log('Command Selected = '+command);
            break;
          case 'x003':
            command = '001';
            console.log('Command Selected = '+command);
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Join Zoom Meeting',
                     Text: 'Enter the Meeting ID and tap Join.<p> Want your own Zoom account? Go to harvard.zoom.us',
                     FeedbackId: 'zoom3.0',
                     Placeholder: 'Meeting ID',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            break;
          case 'x004':
            command = '004';
            console.log('Command Selected = '+command);
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Set System Volume',
                     Text: 'Set the volume on the video conferencing device to a specified level.',
                     FeedbackId: 'volume1.0',
                     Placeholder: 'Range (0-100)',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            break;
          case 'x005':
            console.log('Command Selected = '+command);
            command = '005';
            break;
          case 'x006':
            console.log('Command Selected = '+command);
            command = '006';
            break;
          case 'x007':
            console.log('Command Selected = '+command);
            command = '007';
            xapi.command('UserInterface Message Prompt Display', {
                     Title: 'Select Source to Share',
                     Text: 'Select the Coonector ID of the input you\'d like to share<p> Please only choose 1',
                     FeedbackId: 'share1.0',
                     'Option.1': 'Input 1',
                     'Option.2': 'Input 2',
                     'Option.3': 'Input 3',
                     'Option.4': 'Input 4',
                     'Option.5': 'Cancel'
                     });
            break;
          case 'x008':
            console.log('Command Selected = '+command);
            command = '008';
            break;
          case 'x009':
            command = '009';
            console.log('Command Selected = '+command);
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Enter DTMF',
                     Text: 'Send DTMF tones to the far end. <p> Please unclude a "#" at the end of your string.',
                     FeedbackId: 'DTMF1.0',
                     Placeholder: 'Enter Full DTMF String',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            break;
          case 'execute':
            sendEvent(message);
      }
  }
});

// Listens to the Users entry from the text feild above, and either appends '@zoomcrc.com' or does nothing depeding on the dial method
xapi.event.on('UserInterface Message TextInput Response', (event) => {
  if (!event.Text.includes(':')){
	switch(event.FeedbackId){
	     case 'zoom3.0':
	       if (event.Text.includes((".")||('@'))) {
            userInput = event.Text;
	          }
	       else {
	         userInput = event.Text+zoomSipPattern;
	       xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Dial: '+ event.Text + zoomSipPattern,
	         WidgetId: 'commandText_Field'
	       });
	       }
	      break;
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
	     case 'dial1.0':
	       userInput = event.Text;
	       xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Dial: '+ event.Text,
	         WidgetId: 'commandText_Field'
	       });
	       break;
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
	     case 'volume1.0':
	       	if(/^[0-9]*$/.test(event.Text)){
	             if (parseFloat(event.Text) <= 100 && parseFloat(event.Text) >= 0){
    	             userInput = event.Text;
    	             xapi.command('UserInterface Extensions Widget SetValue', {
    	               Value: 'Level: '+ event.Text,
    	               WidgetId: 'commandText_Field'
    	               });
	             }
	             else {
	              userInput = null;
	              command = 'null';
	              xapi.command('UserInterface Message Alert Display', {
                    Title: 'Not Supported',
                    Text: 'Please use whole integers between 0-100',
                    Duration: 5});
                xapi.command('UserInterface Extensions Widget SetValue', {
	                  Value: 'Error: Unsupported character entered. Input Cleared.',
	                  WidgetId: 'commandText_Field'});
	       	      }
	       	}
	       	else {
	       	 userInput = null;
	       	 command = 'null';
	         xapi.command('UserInterface Message Alert Display', {
                    Title: 'Not Supported',
                    Text: 'Please use whole integers between 0-100',
                    Duration: 5});
           xapi.command('UserInterface Extensions Widget SetValue', {
	                  Value: 'Error: Unsupported character entered. Input Cleared.',
	                  WidgetId: 'commandText_Field'});
	       	}
	       break;
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
	     case 'DTMF1.0':
	       if(/^[0-9*#]*$/.test(event.Text)){
	       userInput = event.Text;
	       xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'DTMF Sequence: '+ event.Text,
	         WidgetId: 'commandText_Field'
	       });
	       }
	       else {
	         userInput = null;
	         command = 'null';
	         xapi.command('UserInterface Message Alert Display', {
                    Title: 'Not Supported',
                    Text: 'Please use "#", "*" and whole integers ',
                    Duration: 5});
           xapi.command('UserInterface Extensions Widget SetValue', {
	                      Value: 'Error: Unsupported character entered. Input Cleared.',
	                      WidgetId: 'commandText_Field'
	       });
	       }
	       break;
    }
}
else {
  userInput = null;
  command = 'null';
  xapi.command('UserInterface Message Alert Display', {
                    Title: 'Error',
                    Text: '":" is not a supported character',
                    Duration: 5});
  xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Error: Unsupported character entered. Input Cleared.',
	         WidgetId: 'commandText_Field'
	       });
	}

});

xapi.event.on('UserInterface Message Prompt Response', (event) => {
  if (event.OptionId != '5'){
    switch (event.FeedbackId + event.OptionId){
      case 'share1.0'+ event.OptionId:
        userInput = event.OptionId;
        xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Share Source Input: '+ event.OptionId,
	         WidgetId: 'commandText_Field'
	       });
        break;
      default:
        break;
    }
}});
