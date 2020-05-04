const xapi = require('xapi');

xapi.config.set('Peripherals InputDevice Mode', 'On');

xapi.event.on('UserInterface InputDevice Key Action', (event) => {
    //console.log('KEY = '+ event.Key + ' || Code = ' + event.Code + ' || Type = ' + event.Type);
    if(event.Type == 'Pressed'){
    switch(event.Key){
      case 'KEY_SPACE' : //Combine Key
        xapi.command("UserInterface Message Prompt Display", {
            Title: 'Combined',
            Text: 'Your space has Combined',
            Duration: 0,
            'Option.1': "Dismiss",
        });
        console.log("Beam Formed, running COMBINE instructions");
        break;
      case 'KEY_BACKSPACE': //Divide Key
        xapi.command("UserInterface Message Prompt Display", {
            Title: 'Divided',
            Text: 'Your space has Divided',
            Duration: 0,
            'Option.1': "Dismiss",
        });
        console.log("Beam Formed, running DIVIDE instructions");
        break;
      }
    }
  }
);
