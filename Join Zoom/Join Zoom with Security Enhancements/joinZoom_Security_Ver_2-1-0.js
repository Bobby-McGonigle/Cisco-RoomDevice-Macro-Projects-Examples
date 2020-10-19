const xapi = require('xapi');

/********************************************************
 * Author: Robert McGonigle Jr, Video Services Engineer
 * robert_mcgonigle@havard.edu
 * Release: 10/9/2020
 * Last Update: 10/9/2020
 * 
 * Version: SEC2.1.0
 * 
 * Harvard University Information Technology
 * 
 * Description:
 *    This variation of the Join Zoom button adds in entry for
      * Role
      * Passcode
      * Host Key
      It also adds in a confirmation page for others to review before connecting to the meeting
         This confirmation page adds in the ability to edit the
         * Meeting ID
         * Passcode
         * Host Key
         Role selection is not an option do to limits on the UI
      Zoom standard Meeting ID and host key limits are enforced, and will notify the user when leaving those boundaries
      No passcode boundaries set, none set at org level as of 10/9/2020
********************************************************/

const JZ_SVN = 'SEC2.1.0'; //Script Version Number

const JZ_SVN_FB = [ //Feedback Numbers
   JZ_SVN + '.0',
   JZ_SVN + '.1',
   JZ_SVN + '.2',
   JZ_SVN + '.3',
   JZ_SVN + '.4',
   JZ_SVN + '.5',
   JZ_SVN + '.6',
   JZ_SVN + '.7',
   JZ_SVN + '.8',
   JZ_SVN + '.9',
];

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Properties of the 'JoinZoom' Custom Button
var JZ_Button = {
   color: '#3d83fb',
   icon: 'Briefing', //Briefing; Camera
   text: 'Join Zoom',
   iconURL: 'https://zoom.us/docs/ent/media-assets/img/desktop-logo-zoombrand.png'
};

//Join Zoom Org information and other variables
var JZ_callInformation = {
   domain: 'Domain',
   sipPattern: '@zoomcrc.com',
   meetingNumber: null,
   hostKey: null,
   meetingPasscode: null,
   role: null,
   jzButton_Status: false
};

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

var jz_FlavorText;

function updateFlavorText() {

   jz_FlavorText = {
      meetingID: {
         Title: 'Join Zoom Meeting',
         Text: 'Enter the Zoom MEETING ID then tap NEXT.<p> Want your own Zoom account? Go to ' + JZ_callInformation.domain.toLowerCase() + '.zoom.us',
         PlaceHolder: 'Meeting ID <5-40 numeric digits>',
         Submit: 'NEXT',
         Error: 'The ID you entered was not between 5 and 40 numeric digits. Try again or contact your local AV/IT department for assistance.'
      },
      roleSelection: {
         Title: 'Select your Zoom Meeting ROLE',
         Text: 'Please select your ROLE for Meeting ID: ' + JZ_callInformation.meetingNumber + ' <p> Then follow the remaining prompts.',
         option1: 'Join as the HOST',
         option2: 'Join as a PARTICIPANT',
         option3: 'Dismiss',
         option4: null,
         option5: null,
      },
      selectedRole: {
         Host: {
            hostKey: {
               Title: 'Enter your Zoom HOST KEY',
               Text: 'Please enter your 6 digit HOST KEY for Meeting ID: ' + JZ_callInformation.meetingNumber + '.<p>Tap NEXT to continue.',
               PlaceHolder: '6 Digit Numeric Host Key',
               Submit: 'NEXT',
               Error: 'The HOST KEY you entered was not 6 numeric digits. Try again or contact your local AV/IT department for assistance.'
            },
            passcode: {
               Title: 'Enter the Zoom Meeting PASSCODE',
               Text: 'Please enter your PASSCODE for Meeting ID: ' + JZ_callInformation.meetingNumber + '.<p>Tap NEXT to continue.',
               PlaceHolder: 'Meeting Passcode [numeric/alphanumeric]',
               Submit: 'NEXT'
            }
         },
         Participant: {
            passcode: {
               Title: 'Enter the Zoom Meeting Passcode',
               Text: 'Please enter your Passcode for Meeting ID: ' + JZ_callInformation.meetingNumber + '.<p>Tap NEXT to continue.',
               PlaceHolder: 'Meeting Passcode',
               Submit: 'NEXT'
            }
         }
      },
      confirmation: {
         Host: {
            Title: 'Confirm Zoom Meeting Information',
            Text: 'MeetingID: ' + JZ_callInformation.meetingNumber + ' || Role: ' + JZ_callInformation.role + '<p>Passcode: ' + passcodeFiller() + ' || HostKey: ' + JZ_callInformation.hostKey,
            option1: 'CORRECT! CONNECT TO ZOOM!',
            option2: 'Set: Meeting ID',
            option3: 'Set: Passcode',
            option4: 'Set: Host Key',
            option5: 'Dismiss'
         },
         Participant: {
            Title: 'Confirm Zoom Meeting Information',
            Text: 'MeetingID: ' + JZ_callInformation.meetingNumber + ' || Role: ' + JZ_callInformation.role + '<p>Passcode: ' + passcodeFiller(),
            option1: 'CORRECT! CONNECT TO ZOOM!',
            option2: 'Set: Meeting ID',
            option3: 'Set: Passcode',
            option4: 'Dismiss',
            option5: null
         },
      },
      update: {
         ID: {
            Title: 'Set New MEETING ID: ' + JZ_callInformation.meetingNumber,
            Text: 'Enter the new MEETING ID below or leave this field blank if the above MEETING ID is correct.<p>Then tap UPDATE',
            PlaceHolder: 'New Meeting ID',
            Submit: 'UPDATE',
            Error: 'The ID you entered was not between 5 and 40 numeric digits. Try again or contact your local AV/IT department for assistance.'
         },
         KEY: {
            Title: 'Set New HOST KEY: ' + JZ_callInformation.hostKey,
            Text: 'Enter the new HOST KEY below or leave this field blank if the HOST KEY above is correct.<p>Then tap UPDATE',
            PlaceHolder: 'New HOST KEY',
            Submit: 'UPDATE',
            Error: 'The HOST KEY you entered was not 6 numeric digits. Try again or contact your local AV/IT department for assistance.'
         },
         PASS: {
            Title: 'Set New PASSCODE: ' + JZ_callInformation.meetingPasscode,
            Text: 'Enter the new PASSCODE below. Leave blank if the PASSCODE above is correct or enter ? to clear.<p>Then tap UPDATE',
            PlaceHolder: 'New PASSCODE',
            Submit: 'UPDATE'
         }
      }

   };
}

function passcodeFiller() {
   if (JZ_callInformation.meetingPasscode !== '') {
      return JZ_callInformation.meetingPasscode;
   } else {
      return '______';
   }
}

//Spawns in the JoinZoom Button
xapi.command('UserInterface Extensions Panel Save', {
   PanelId: 'JoinZoom_' + JZ_SVN
},
   `
<Extensions>
  <Version>1.6</Version>
  <Panel>
    <Type>Home</Type>
    <Icon>${JZ_Button.icon}</Icon>
    <Order>1</Order>
    <Color>${JZ_Button.color}</Color>
    <Name>${JZ_Button.text}</Name>
    <IconUrl>${JZ_Button.iconURL}</IconUrl>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
);

//Generic Sleep timer, used to slow down specific tasks as needed.
function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function alertAudio() {
   xapi.command('Audio Sound Play', {
      Loop: 'Off',
      Sound: 'Notification'
   });
}

//Used to dynamically update the SIP URI and Host Key information when dialing from the 'JoinZoom' button
function passCodeModifier() {
   if (JZ_callInformation.meetingPasscode !== null) {
      if (JZ_callInformation.meetingPasscode !== '') {
         return '.' + JZ_callInformation.meetingPasscode;
      } else {
         return '.';
      }
   } else {
      return '.';
   }
}

function hostkeyModifier() {
   if (JZ_callInformation.hostKey !== null) {
      if (JZ_callInformation.hostKey !== '') {
         return '..' + JZ_callInformation.hostKey;
      } else {
         return '..';
      }
   } else {
      return '..';
   }
}

function numRegex_HKey(input) {
   let num = input.length;
   if (/^[0-9]*$/.test(input)) {
      if (parseFloat(num) === 6 /*|| parseFloat(num) === 0*/) {
         JZ_callInformation.hostKey = input;
         updateFlavorText();
         hostConfirmationPage();
         console.log('Host Key: "' + input + '" entered. Opening Confirmation Page');
      } else {
         alertAudio();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.selectedRole.Host.hostKey.Title,
            Text: jz_FlavorText.selectedRole.Host.hostKey.Error,
            FeedbackId: JZ_SVN_FB[3],
            Placeholder: jz_FlavorText.selectedRole.Host.hostKey.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.selectedRole.Host.hostKey.Submit
         });
         console.warn('Host Key: "' + input + '" does not contain 6 digits. Prompting user to re-enter the Host Key...');
      }
   } else {
      alertAudio();
      xapi.command('UserInterface Message TextInput Display', {
         Title: jz_FlavorText.selectedRole.Host.hostKey.Title,
         Text: jz_FlavorText.selectedRole.Host.hostKey.Error,
         FeedbackId: JZ_SVN_FB[3],
         Placeholder: jz_FlavorText.selectedRole.Host.hostKey.PlaceHolder,
         InputType: 'Numeric',
         KeyboardState: 'Open',
         SubmitText: jz_FlavorText.selectedRole.Host.hostKey.Submit
      });
      console.warn('Host Key: "' + input + '" contains non-numeric characters. Prompting user to re-enter the Host Key...');
   }
}

function numRegex_ID(input) {
   let num = input.length;
   if (/^[0-9]*$/.test(input)) {
      if (parseFloat(num) >= 5 && parseFloat(num) <= 40) {
         JZ_callInformation.meetingNumber = input;
         updateFlavorText();
         xapi.command('UserInterface Message Prompt Display', {
            Title: jz_FlavorText.roleSelection.Title,
            Text: jz_FlavorText.roleSelection.Text,
            FeedbackId: JZ_SVN_FB[1],
            'Option.1': jz_FlavorText.roleSelection.option1,
            'Option.2': jz_FlavorText.roleSelection.option2,
            'Option.3': jz_FlavorText.roleSelection.option3
         });
         console.log('Meeting ID: "' + input + '" entered. Selecting Role...');
      } else {
         alertAudio();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.meetingID.Title,
            Text: jz_FlavorText.meetingID.Error,
            FeedbackId: JZ_SVN_FB[0],
            Placeholder: jz_FlavorText.meetingID.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.meetingID.Submit
         });
         console.warn('Meeting ID: "' + input + '" is outside the 5-40 character boundary. Prompting user to re-enter the Meeting ID.');
      }
   } else {
      alertAudio();
      xapi.command('UserInterface Message TextInput Display', {
         Title: jz_FlavorText.meetingID.Title,
         Text: jz_FlavorText.meetingID.Error,
         FeedbackId: JZ_SVN_FB[0],
         Placeholder: jz_FlavorText.meetingID.PlaceHolder,
         InputType: 'Numeric',
         KeyboardState: 'Open',
         SubmitText: jz_FlavorText.meetingID.Submit
      });
      console.warn('Meeting ID: "' + input + '" contains non numeric characters. Prompting user to re-enter the Meeting ID.');
   }
}

function numRegex_HKey_Update(input) {
   let num = input.length;
   if (/^[0-9]*$/.test(input)) {
      if (parseFloat(num) === 6 || parseFloat(num) === 0) {
         if (input === '') {
            console.log('Host Key left unchanged by user. Host Key remains as: "' + JZ_callInformation.hostKey + '" entered. Re-opening Confirmation Page.');
         } else {
            JZ_callInformation.hostKey = input;
            updateFlavorText();
            console.log('Host Key updated by user. New Host Key: "' + input + '" entered. Re-opening Confirmation Page.');
         }
         hostConfirmationPage();
      } else {
         updateFlavorText();
         alertAudio();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.update.KEY.Title,
            Text: jz_FlavorText.update.KEY.Error,
            FeedbackId: JZ_SVN_FB[6] + 'KEY',
            Placeholder: jz_FlavorText.update.KEY.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.update.KEY.Submit
         });
         console.warn('This new Host Key: "' + input + '" entered does not contain 6 digits. Prompting user to re-enter the Host Key...');
      }
   } else {
      updateFlavorText();
      alertAudio();
      xapi.command('UserInterface Message TextInput Display', {
         Title: jz_FlavorText.update.KEY.Title,
         Text: jz_FlavorText.update.KEY.Error,
         FeedbackId: JZ_SVN_FB[6] + 'KEY',
         Placeholder: jz_FlavorText.update.KEY.PlaceHolder,
         InputType: 'Numeric',
         KeyboardState: 'Open',
         SubmitText: jz_FlavorText.update.KEY.Submit
      });
      console.warn('This new Host Key: "' + input + '" contains non numeric characters. Prompting user to re-enter the Host Key...');
   }
}

function numRegex_ID_Update(input, role) {
   let num = input.length;
   if (/^[0-9]*$/.test(input)) {
      if (parseFloat(num) === 0) {
         if (input === '') {
            console.log('Meeting ID left unchanged by user. Meeting ID remains as: "' + JZ_callInformation.meetingNumber + '" entered. Re-opening Confirmation Page.');
         } else {
            JZ_callInformation.meetingNumber = input;
            updateFlavorText();
            console.log('Meeting ID updated by user. New Meeting ID: "' + input + '" entered. Re-opening Confirmation Page.');
         }
         if (role === 'Host') {
            hostConfirmationPage();
            return;
         } else {
            partConfirmationPage();
            return;
         }
      }
      if (parseFloat(num) >= 5 && parseFloat(num) <= 40) {
         if (input === '') {
            console.log('Meeting ID left unchanged by user. Meeting ID remains as: "' + input + '" entered. Re-opening Confirmation Page.');
         } else {
            JZ_callInformation.meetingNumber = input;
            updateFlavorText();
            console.log('Meeting ID updated by user. New Meeting ID: "' + input + '" entered. Re-opening Confirmation Page.');
         }
         if (role === 'Host') {
            hostConfirmationPage();
         } else {
            partConfirmationPage();
         }
      } else {
         updateFlavorText();
         alertAudio();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.update.ID.Title,
            Text: jz_FlavorText.update.ID.Error,
            FeedbackId: JZ_SVN_FB[6] + 'ID',
            Placeholder: jz_FlavorText.update.ID.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.update.ID.Submit
         });
         console.warn('This new Meeting ID: "' + input + '" is outside the 5-40 character boundary. Prompting user to re-enter the Host Key...');
      }
   } else {
      updateFlavorText();
      alertAudio();
      xapi.command('UserInterface Message TextInput Display', {
         Title: jz_FlavorText.update.ID.Title,
         Text: jz_FlavorText.update.ID.Error,
         FeedbackId: JZ_SVN_FB[6] + 'ID',
         Placeholder: jz_FlavorText.update.ID.PlaceHolder,
         InputType: 'Numeric',
         KeyboardState: 'Open',
         SubmitText: jz_FlavorText.update.ID.Submit
      });
      console.warn('This new Meeting ID: "' + input + '" contains non-numeric characters. Prompting user to re-enter the Host Key...');
   }
}

function partConfirmationPage() {
   xapi.command('UserInterface Message Prompt Display', {
      Title: jz_FlavorText.confirmation[JZ_callInformation.role].Title,
      Text: jz_FlavorText.confirmation[JZ_callInformation.role].Text,
      FeedbackId: JZ_SVN_FB[4],
      'Option.1': jz_FlavorText.confirmation[JZ_callInformation.role].option1,
      'Option.2': jz_FlavorText.confirmation[JZ_callInformation.role].option2,
      'Option.3': jz_FlavorText.confirmation[JZ_callInformation.role].option3,
      'Option.4': jz_FlavorText.confirmation[JZ_callInformation.role].option4
   });
}

function hostConfirmationPage() {
   xapi.command('UserInterface Message Prompt Display', {
      Title: jz_FlavorText.confirmation[JZ_callInformation.role].Title,
      Text: jz_FlavorText.confirmation[JZ_callInformation.role].Text,
      FeedbackId: JZ_SVN_FB[5],
      'Option.1': jz_FlavorText.confirmation[JZ_callInformation.role].option1,
      'Option.2': jz_FlavorText.confirmation[JZ_callInformation.role].option2,
      'Option.3': jz_FlavorText.confirmation[JZ_callInformation.role].option3,
      'Option.4': jz_FlavorText.confirmation[JZ_callInformation.role].option4,
      'Option.5': jz_FlavorText.confirmation[JZ_callInformation.role].option5
   });
}

//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Used as a switch to verify if the 'JoinZoom' button was used, as opposed to the native 'call' interface
xapi.status.on('Call RemoteNumber', (remoteNumber) => {
   if (remoteNumber.includes(JZ_callInformation.meetingNumber)) {
      JZ_callInformation.jzButton_Status = true;
      xapi.command("UserInterface Message Prompt Display", {
         Title: 'Please Wait',
         Text: 'Entering Meeting ID: ' + JZ_callInformation.meetingNumber,
         Duration: 0,
         'Option.1': "Dismiss",
      });
      console.log('Joining Meeting Id: "' + JZ_callInformation.meetingNumber + '" as "' + JZ_callInformation.role);
   }
});

//Used to reset the Call information Variable after each call.
xapi.event.on('CallDisconnect', (event) => {
   JZ_callInformation.meetingNumber = null;
   JZ_callInformation.meetingPasscode = null;
   JZ_callInformation.hostKey = null;
   JZ_callInformation.role = null;
   JZ_callInformation.jzButton_Status = false;
});

//Checks checks if the Join Zoom button was used, and appends the appropriate SIP/DTMF information as needed.
xapi.event.on('CallSuccessful', (event) => {
   if (JZ_callInformation.jzButton_Status === true) {
      console.log('Connected to Meeting Id: "' + JZ_callInformation.meetingNumber + '" as "' + JZ_callInformation.role);
      if (JZ_callInformation.role == 'Host') {
         sleep(5000).then(() => {
            xapi.command('UserInterface Message Prompt Clear');
         });
      }
      if (JZ_callInformation.role == 'Participant') {
         sleep(5000).then(() => {
            xapi.command('UserInterface Message Prompt Clear');
         });
      }
   } else if (JZ_callInformation.jzButton_Status === false) { }
});


//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Listens for the joinZoom button to be pressed, then prompts a text field for the Meeting ID
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
   updateFlavorText();
   switch (event.PanelId) {
      case 'JoinZoom_' + JZ_SVN:
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.meetingID.Title,
            Text: jz_FlavorText.meetingID.Text,
            FeedbackId: JZ_SVN_FB[0],
            Placeholder: jz_FlavorText.meetingID.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.meetingID.Submit
         });
         console.log('Zoom Panel Opened, waiting for Meeting ID...');
         break;
   }
});

//Series of prompts to collect call information and guide users into their respective Roles.
xapi.event.on('UserInterface Message TextInput Response', (event) => {
   switch (event.FeedbackId) {
      case JZ_SVN_FB[0]:
         numRegex_ID(event.Text);
         break;
      case JZ_SVN_FB[2]:
         JZ_callInformation.meetingPasscode = event.Text;
         updateFlavorText();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.selectedRole.Host.hostKey.Title,
            Text: jz_FlavorText.selectedRole.Host.hostKey.Text,
            FeedbackId: JZ_SVN_FB[3],
            Placeholder: jz_FlavorText.selectedRole.Host.hostKey.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.selectedRole.Host.hostKey.Submit
         });
         console.log('Meeting Passcode: "' + event.Text + ' entered. Entering Host Key...');
         break;
      case JZ_SVN_FB[3]:
         switch (JZ_callInformation.role) {
            case 'Participant':
               JZ_callInformation.meetingPasscode = event.Text;
               updateFlavorText();
               partConfirmationPage();
               console.log('Meeting Passcode: "' + event.Text + ' entered. Opening Confirmation Page.');
               break;
            case 'Host':
               numRegex_HKey(event.Text);
         }
         break;
      case JZ_SVN_FB[6] + 'ID':
         numRegex_ID_Update(event.Text, JZ_callInformation.role);
         break;
      case JZ_SVN_FB[6] + 'PASS':
         if (event.Text === '?') {
            JZ_callInformation.meetingPasscode = '';
            console.log('Passcode cleared by user. Re-opening Confirmation Page.');
         } else if (event.Text !== '') {
            JZ_callInformation.meetingPasscode = event.Text;
            console.log('Passcode updated by user. Passcode: "' + event.Text + '" entered. Re-opening Confirmation Page.');
         } else {
            console.log('Passcode left unchanged by user. Passcode ramains as: "' + JZ_callInformation.meetingPasscode + '". Re-opening Confirmation Page.');
         }
         switch (JZ_callInformation.role) {
            case 'Participant':
               updateFlavorText();
               partConfirmationPage();
               break;
            case 'Host':
               updateFlavorText();
               hostConfirmationPage();
               break
         }
         break
      case JZ_SVN_FB[6] + 'KEY':
         numRegex_HKey_Update(event.Text);
         break;
   }
});

xapi.event.on('UserInterface Message Prompt Response', (event) => {
   updateFlavorText();
   switch (event.FeedbackId + event.OptionId) {
      case JZ_SVN_FB[1] + '1':
         JZ_callInformation.role = 'Host';
         updateFlavorText();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.selectedRole.Host.passcode.Title,
            Text: jz_FlavorText.selectedRole.Host.passcode.Text,
            FeedbackId: JZ_SVN_FB[2],
            Placeholder: jz_FlavorText.selectedRole.Host.passcode.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.selectedRole.Host.passcode.Submit
         });
         console.log(JZ_callInformation.role + ' role selected. Entering Passcode...');
         break;
      case JZ_SVN_FB[1] + '2':
         JZ_callInformation.role = 'Participant';
         updateFlavorText();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.selectedRole.Participant.passcode.Title,
            Text: jz_FlavorText.selectedRole.Participant.passcode.Text,
            FeedbackId: JZ_SVN_FB[3],
            Placeholder: jz_FlavorText.selectedRole.Participant.passcode.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.selectedRole.Participant.passcode.Submit
         });
         console.log(JZ_callInformation.role + ' role selected. Entering Passcode...');
         break;
      case JZ_SVN_FB[4] + '1':
         sleep(250).then(() => {
            xapi.command("dial", {
               Number: JZ_callInformation.meetingNumber + passCodeModifier() + JZ_callInformation.sipPattern
            });
         });
         break;
      case JZ_SVN_FB[4] + '2':
      case JZ_SVN_FB[5] + '2':
         updateFlavorText();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.update.ID.Title,
            Text: jz_FlavorText.update.ID.Text,
            FeedbackId: JZ_SVN_FB[6] + 'ID', //Change Me
            Placeholder: jz_FlavorText.update.ID.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.update.ID.Submit
         });
         console.log('User opted to update the Meeting ID. Current ID: "' + JZ_callInformation.meetingNumber + '". Waiting for new ID...');
         break;
      case JZ_SVN_FB[4] + '3':
      case JZ_SVN_FB[5] + '3':
         updateFlavorText();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.update.PASS.Title,
            Text: jz_FlavorText.update.PASS.Text,
            FeedbackId: JZ_SVN_FB[6] + 'PASS', //Change Me
            Placeholder: jz_FlavorText.update.PASS.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.update.PASS.Submit
         });
         console.log('User opted to update the Passcode. Current ID: "' + JZ_callInformation.meetingPasscode + '". Waiting for new Passcode...');
         break;
      case JZ_SVN_FB[5] + '1':
         sleep(250).then(() => {
            xapi.command("dial", {
               Number: JZ_callInformation.meetingNumber + passCodeModifier() + hostkeyModifier() + JZ_callInformation.sipPattern
            });
         });
         break;
      case JZ_SVN_FB[5] + '4':
         updateFlavorText();
         xapi.command('UserInterface Message TextInput Display', {
            Title: jz_FlavorText.update.KEY.Title,
            Text: jz_FlavorText.update.KEY.Text,
            FeedbackId: JZ_SVN_FB[6] + 'KEY', //Change Me
            Placeholder: jz_FlavorText.update.KEY.PlaceHolder,
            InputType: 'Numeric',
            KeyboardState: 'Open',
            SubmitText: jz_FlavorText.update.KEY.Submit
         });
         console.log('User opted to update the Host Key. Current ID: "' + JZ_callInformation.hostKey + '". Waiting for new Host Key...');
         break;
   }
});
