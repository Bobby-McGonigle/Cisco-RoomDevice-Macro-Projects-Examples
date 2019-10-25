const xapi = require('xapi');

var WebexDomain = 'Domain';//Enter your site domain name. Example 'Test', from https://test.webex.com
var WebexSip = '@'+WebexDomain+'.webex.com';

var ZoomDomain = 'Domain';//Enter your site domain name. Example 'Test', from https://test.zoom.us

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch(event.PanelId){
      case 'launch':
        console.log('Launch Meeting Opened...');
        xapi.command('UserInterface Message Prompt Display',{
                  Title: 'Launch Video Meeting',
                  Text: 'Please choose the prefered Web Conferencing Platform',
                  FeedbackID: 'home_page',
                  Duration: 120,
                  'Option.1': 'Zoom',
                  'Option.2': 'Webex',
                  'Option.3': 'Close Page',
        });
    }});

xapi.event.on('Userinterface Message Prompt Response', (event) =>{
  switch(event.FeedbackId + event.OptionId) {
    case 'home_pageX' + '2':
      console.log('Webex Selected...');
      xapi.command('UserInterface Message TextInput Display',{
                  Title: WebexDomain+'.Webex.Com',
                  Text: 'Please enter in the Meeting # in your Webex invitation.        If dialing externally please include the whole Video Address.',
                  FeedbackId: 'webex_meetingX',
                  Placeholder: 'Meeting#/Username',
                  InputType: 'SingleLine',
                  KeyboardState: 'Open',
                  SubmitText: 'Call'
        });
      break;
    case 'home_pageX' + '1':
      console.log('Zoom Selected...');
      xapi.command('UserInterface Message TextInput Display',{
                  Title: ZoomDomain+'.Zoom.Us',
                  Text: 'Please enter in the Meeting ID in your Zoom invitation.      External Zoom sites may not support this device.',
                  FeedbackId: 'zoom_meetingX',
                  Placeholder: 'Meeting ID',
                  InputType: 'Numeric',
                  KeyboardState: 'Open',
                  SubmitText: 'Call'
        });
    }
});

xapi.event.on('UserInterface Message TextInput Response', (event) => {
	switch(event.FeedbackId){
        case 'webex_meetingX':
          if (event.Text.includes((".")||('@'))) {
              xapi.command('Dial', {Number: event.Text});
              console.log('Dialed Number: '+event.Text);
	          }
	        else {
	          xapi.command('Dial', {Number: event.Text + WebexSip});
	          console.log('Dialed Number: '+event.Text+ '  ---> "@'+WebexDomain+'.webex.com" appended to string.');
	        }
	       break;
	     case 'zoom_meetingX':
	       if (event.Text.includes((".")||('@'))) {
              xapi.command('Dial', {Number: event.Text});
              console.log('Dialed Number: '+event.Text);
	          }
	       else {
	         xapi.command('Dial', {Number: event.Text + '@zoomcrc.com'});
	         console.log('Dialed Number: '+event.Text+ '  ---> "@zoomcrc.com" appended to string.');
	       }
    }});
