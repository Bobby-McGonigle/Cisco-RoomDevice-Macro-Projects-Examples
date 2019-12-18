const xapi = require('xapi');

function parse(event) {  //returns the content of the parent system when sent
  return JSON.parse(event);
}

//Event Catcher
xapi.event.on('Message Send Text', event => {
  var captureCommand = event.replace(/'/g,'"');
  var decodeCommand = captureCommand.split(':');
  var payloadMessage = 'Command Received = '+decodeCommand[0]+'. ';
    try {
        switch(decodeCommand[0]){
          case '001':
            console.log(payloadMessage+'Dialing -> '+decodeCommand[1]);
            xapi.command('Dial', {Number: decodeCommand[1]});
            break;
          case '002':
            console.log(payloadMessage+'Command Received. Call Disconnect.');
            xapi.command('Call Disconnect');
            break;
          case '003':
            //unused
            break;
          case '004':
            console.log(payloadMessage+'Volume Set -> '+decodeCommand[1]);
            xapi.command('UserInterface Message Alert Display', {
                    Title: 'Vuolume Updated',
                    Text: 'Set to :'+ decodeCommand[1],
                    Duration: 3});
            xapi.command('Audio Volume Set', {Level: decodeCommand[1]});
            break;
          case '005':
            console.log(payloadMessage+'Mics Muted');
            xapi.command('Audio Microphones Mute');
            break;
          case '006':
            console.log(payloadMessage+'Mics Unmuted');
            xapi.command('Audio Microphones Unmute');
            break;
          case '007':
            console.log(payloadMessage+'Presentation Started -> SourceID ->'+decodeCommand[1]);
            xapi.command('Presentation Start', {
                        ConnectorId: decodeCommand[1],
                        Layout: 'Equal',
                        SendingMode: 'LocalRemote'});
            break;
          case '008':
            console.log(payloadMessage+'Presentation Stopped');
            xapi.command('Presentation Stop');
            break;
          case '009':
            console.log(payloadMessage+'DTMF Send -> Sequence ->'+decodeCommand[1]);
            xapi.command("Call DTMFSend", {DTMFString: decodeCommand[1]});
            break;
          case 'null':
            console.log(payloadMessage+ 'User Input = '+decodeCommand[1]+'. Command and Userinput has been cleared do to improper entry on the Parent system.');
            break;
        }
    }catch(e) { console.log(e);
    }
});
