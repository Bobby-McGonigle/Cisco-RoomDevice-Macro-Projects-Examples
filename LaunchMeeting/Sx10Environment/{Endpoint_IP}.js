const jsxapi = require('jsxapi');
const start = console.log("App Started");
var codecName;

//locate and use this file name as the IP address for the system
var path = module.filename;
var fileName = path.substring(path.lastIndexOf('/')+1);
var ip = fileName.slice(0, -3)

//takes new 'ip' variable and inserts it here and connects to the endpoint over SSH
const xapi = jsxapi.connect('ssh://'+ip, {
  username: 'admin',
  password: '1nfinityW@r$',
});

//time stamp every 10 minutes for logging
function tenMinInterval(){
  let minutes = 10;
  let now = new Date();
  now = now.getHours()+ ":" + now.getMinutes() + ":" + now.getSeconds();
  console.log(codecName+": 10 Minute Interval Passed: "+ now);
  setTimeout(tenMinInterval, minutes*1000*60);
}
tenMinInterval();

//error handler....
xapi.on('error', (err) => {
  // !! Note of caution: This event might fire more than once !!
  console.error(codecName+`: xapi error: ${err}`);
  throw err;
});
//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\\

// monitor
xapi.event.on('CallSuccessful', (event) => {
  console.log(codecName+": Call Connected")
});

xapi.event.on('CallDisconnect', (event) => {
  console.log(codecName+": Call Disconnected")
});

xapi.status.get('UserInterface ContactInfo Name').then((info) => {
  codecName=info;
  console.log(codecName);
  });

//Listens to the panel ID 'launch_meeting'
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch(event.PanelId){
      case 'launch_meeting':
        xapi.command('UserInterface Extensions Panel Close');
        xapi.command('UserInterface Message Prompt Display', {Title: 'Launch Video Meeting',
                                                               Text: 'Please choose the prefered Web Conferencing Platform',
                                                               FeedbackID: 'home_page',
                                                               Duration: 120,
                                                               'Option.1': 'Webex',
                                                               'Option.2': 'Zoom [beta]',
                                                               'Option.3': 'Close Page',
        });
        console.log(codecName+": Lauch meeting opened");
    }});

//listens to events from the 'home_page' prompt, and will switch between a Webex format and a Zoom format
xapi.event.on('Userinterface Message Prompt Response', (event) =>{
  switch(event.FeedbackId + event.OptionId) {
    case 'home_page' + '1':
      xapi.command('UserInterface Message TextInput Display', {
                                  Title: 'Harvard.Webex.Com',
                                  Text: 'Please enter in the Meeting # in your Webex invitation.        If dialing externally please include the whole Video Address.',
                                  FeedbackId: 'webex_meeting',
                                  Placeholder: 'Meeting#/Username',
                                  InputType: 'SingleLine',
                                  KeyboardState: 'Open',
                                  SubmitText: 'Call'
        });
        console.log(codecName+": Webex Selected");
      break;
    case 'home_page' + '2':
      xapi.command('UserInterface Message TextInput Display', {
                                  Title: 'Harvard.Zoom.Us',
                                  Text: 'Please enter in the Meeting ID in your Zoom invitation.      External Zoom sites may not support this device.',
                                  FeedbackId: 'zoom_meeting',
                                  Placeholder: 'Meeting ID',
                                  InputType: 'Numeric',
                                  KeyboardState: 'Open',
                                  SubmitText: 'Call'
        });
      console.log(codecName+": Zoom Selected");
    case 'home_page' + '3':
      console.log("Launch Meeting Closed");
    default:
      break;
    }
});

//listens to events from feedbackID 'webex_meeting' and 'zoom_meeting' and will take the user input initialt a call to the prper URI.
xapi.event.on('UserInterface Message TextInput Response', (event) => {
	switch(event.FeedbackId){
        case 'webex_meeting':
          if (event.Text.includes((".")||('@'))) {
              xapi.command('Dial', {Number: event.Text});
              console.log(codecName+": Number Entered: "+event.Text);
	          }
	        else {
	          xapi.command('Dial', {Number: event.Text + '@harvard.webex.com'});
	          console.log(codecName+": Number Entered: "+event.Text+ "// '@harvard.webex.com' appended to user's string");
	        }
	       break;
	     case 'zoom_meeting':
	       if (event.Text.includes((".")||('@'))) {
              xapi.command('Dial', {Number: event.Text});
              console.log(codecName+": Number Entered: "+event.Text);
	          }
	       else {
	         xapi.command('Dial', {Number: event.Text + '@zoomcrc.com'});
	         console.log(codecName+": Number Entered: "+event.Text+ "// '@zoomcrc.com' appended to user's string");
	       }
         break;
        default:
         break;
    }});
