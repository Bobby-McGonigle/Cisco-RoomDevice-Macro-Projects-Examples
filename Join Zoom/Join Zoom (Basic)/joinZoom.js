const xapi = require('xapi');

var zoom_Button_Color = '#2d8bff'; //#2d8bff is the offical Zoom Color
var zoom_Button_Icon = 'Briefing'; //Briefing; Camera
var zoom_Button_Text = 'Join Zoom';

var zoomDomain = 'Domain';
var zoomSipPattern = '@zoomcrc.com';

xapi.command('UserInterface Extensions Panel Save', {PanelId: 'pure_Zoom'},
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

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch(event.PanelId){
      case 'pure_Zoom':
        xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Join Zoom Meeting',
                     Text: 'Enter the Meeting ID and tap Join.<p> Want your own Zoom account? Go to '+zoomDomain.toLowerCase()+'.zoom.us',
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

xapi.event.on('UserInterface Message TextInput Response', (event) => {
	switch(event.FeedbackId){
	     case 'zoom2.0':
	       if (event.Text.includes((".")||('@'))) {
              xapi.command('Dial', {Number: event.Text});
              console.log('Full URI entered, no changes applied. String entered: '+ event.Text);
	          }
	       else {
	         xapi.command('Dial', {Number: event.Text + zoomSipPattern});
	         console.log('No SIP pattern entered. Appending "'+zoomSipPattern+'" to => '+event.Text);
	       }
    }});
