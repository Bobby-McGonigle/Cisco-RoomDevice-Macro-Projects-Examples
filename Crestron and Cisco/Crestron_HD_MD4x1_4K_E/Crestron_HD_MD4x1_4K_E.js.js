const xapi = require('xapi');

var Crestron_HD_MD4x1_4K_E_ip = 'Enter Switcher IP here';

//Source Type information
// Choose one of the following to to use [Note: Case Sensative]
// pc/camera/desktop/document_camera/mediaplayer/other/whiteboard

var inputType_SourceIn_1 = 'pc';
var inputType_SourceIn_2 = 'desktop';
var inputType_SourceIn_3 = 'mediaplayer';
var inputType_SourceIn_4 = 'whiteboard';


//---Do Not Change the Following ---\\
// Unles you're super confident on those changes ;)

var allInputs;
var InStat_1;
var InStat_2;
var InStat_3;
var InStat_4;

function clearRoute() {
  var url = 'http://'+Crestron_HD_MD4x1_4K_E_ip+'/aj.html?a=command&cmd=A&p1=0&_=';
  xapi.command('HttpClient Get', {Url: url});
  console.log('HTTP GET: '+url);
}

function setActiveInput(source) {
  var url = 'http://'+Crestron_HD_MD4x1_4K_E_ip+'/aj.html?a=command&cmd=A&p1='+source+'&_=';
  xapi.command('HttpClient Get', {Url: url});
  console.log('HTTP GET: '+url);
}

function inputStateMonitor() {
  var url = 'http://'+Crestron_HD_MD4x1_4K_E_ip+'/aj.html?a=input&_';
  xapi.command('HttpClient Get', {Url: url, ResultBody: 'PlainText'}).then((status) => {
    allInputs = status.Body.slice(25,32);
    InStat_1 = allInputs.slice(0,1);
    InStat_2 = allInputs.slice(2,3);
    InStat_3 = allInputs.slice(4,5);
    InStat_4 = allInputs.slice(6,7);
    if (InStat_1 === "1"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 1,
              State: "Ready"
      });
    }
    
    if (InStat_1 === "0"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 1,
              State: "NotReady"
        });
      }
    if (InStat_2 === "1"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 2,
              State: "Ready"
      });
    }
    if (InStat_2 === "0"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 2,
              State: "NotReady"
      });
      }
    if (InStat_3 === "1"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 3,
              State: "Ready"
      });
    }
    if (InStat_3 === "0"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 3,
              State: "NotReady"
      });
      }
    if (InStat_4 === "1"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 4,
              State: "Ready"
      });
    }
    if (InStat_4 === "0"){
      xapi.command('UserInterface Presentation ExternalSource State Set', {
              SourceIdentifier: 4,
              State: "NotReady"
      });
      }
    console.log("IN 1: "+InStat_1+" IN 2: "+InStat_2+" IN 3: "+InStat_3+" IN 4: "+InStat_4);
  });
  setTimeout(inputStateMonitor, 1500);
}

xapi.command('UserInterface Presentation ExternalSource RemoveAll');
xapi.command('UserInterface Presentation ExternalSource Add ', {
              ConnectorId: 2,
              Name: 'Laptop',
              SourceIdentifier: 1,
              Type: inputType_SourceIn_1
              });
xapi.command('UserInterface Presentation ExternalSource Add ', {
              ConnectorId: 2,
              Name: 'Room PC',
              SourceIdentifier: 2,
              Type: inputType_SourceIn_2
              });
xapi.command('UserInterface Presentation ExternalSource Add ', {
              ConnectorId: 2,
              Name: 'Solstice Wireless',
              SourceIdentifier: 3,
              Type: inputType_SourceIn_3
              });
xapi.command('UserInterface Presentation ExternalSource Add ', {
              ConnectorId: 2,
              Name: 'Crestron AirCam',
              SourceIdentifier: 4,
              Type: inputType_SourceIn_4
              });


xapi.event.on('UserInterface Presentation ExternalSource Selected', (event) => 
{
  clearRoute();
  setActiveInput(event.SourceIdentifier);
});

xapi.event.on('PresentationStopped Mode', (event) =>
{
  console.log(event);
});

inputStateMonitor();
