const xapi = require('xapi');

var passPhrase;
var confirmPhrase;
var dndState = false;
var failCount = 0;
var failTimer = 0;
var secondsAlive;

function bootStatus() {
    var c = 1;
    xapi.status.get('SystemUnit Uptime').then((UpTime) => {
        secondsAlive = UpTime;
        if (secondsAlive >= 65) {
            console.log("Macro Script interrupted. Either script update or crash.");
            return;
        }
        do {
            failTimer = -1;
            xapi.command('UserInterface Message Textline Clear');
            xapi.config.set('UserInterface Features HideAll', false);
            xapi.config.set('Standby Control', 'On');
            lockDown('System Boot detected, locking the system.');
            failCount = 0;
            //setTimeout(bootStatus, c*2000);
            return;
        }
        while (secondsAlive <= 64);
        console.log('Check UpTime = ' + UpTime);
    });
}

bootStatus();

function lockUI() {
    xapi.config.set('UserInterface CustomMessage', 'Content Sharing Only. System locked.');
    xapi.command('UserInterface Extensions Panel Remove', {
        PanelID: 'lock_VC_system'
    }); //  can i run these in an array format???
    xapi.command('UserInterface Extensions Panel Remove', {
        PanelID: 'chgPassphrase'
    });
    xapi.command('UserInterface Extensions Panel Save', {
            PanelId: 'unlock_VC_system'
        },
        `<Extensions>
              <Version>1.5</Version>
              <Panel>
                <Type>Home</Type>
                <Icon>Power</Icon>
                <Order>2</Order>
                <Color>#0b45f9</Color>
                <Name>Unlock System</Name>
              </Panel>
            </Extensions>`
    );
}

function unlockUI() {
    xapi.config.set('UserInterface CustomMessage', 'e911 Not Available');
    xapi.command('UserInterface Extensions Panel Remove', {
        PanelID: 'unlock_VC_system'
    });
    xapi.command('UserInterface Extensions Panel Save', {
            PanelId: 'lock_VC_system'
        },
        `<Extensions>
              <Version>1.5</Version>
              <Panel>
                <Type>Home</Type>
                <Icon>Power</Icon>
                <Order>2</Order>
                <Color>#000000</Color>
                <Name>Lock System</Name>
              </Panel>
            </Extensions>`
    );
    xapi.command('UserInterface Extensions Panel Save', {
            PanelId: 'chgPassphrase'
        },
        `<Extensions>
              <Version>1.5</Version>
              <Panel>
                <Type>Home</Type>
                <Icon>Sliders</Icon>
                <Order>2</Order>
                <Color>#d3deff</Color>
                <Name>Change Sys. Lock</Name>
              </Panel>
            </Extensions>`
    );
}

function getPasshrase() {
    xapi.config.get('FacilityService Service 5 Name').then((value) => {
        passPhrase = value;
        console.log('Current Passphrase: ' + passPhrase);
    });
}

getPasshrase();

function setNewPassphrase(newPassPhrase) {
    passPhrase = newPassPhrase;
    xapi.config.set('FacilityService Service 5 Name', newPassPhrase);
}

function infiniteDoNotDisturb() {
    if (dndState === true) {
        xapi.command('Conference DoNotDisturb Activate', {
            Timeout: 1440
        }).catch(e => console.error('Command error'));
        setTimeout(infiniteDoNotDisturb, 1440 * 1000 * 60);
    } else {
        xapi.command('Conference DoNotDisturb Deactivate').catch(e => console.error('Command error'));
    }
}

function lockDown(consoleLog) {
    lockUI();
    dndState = true;
    xapi.config.set('UserInterface Features Call Start', 'Hidden');
    xapi.config.set('UserInterface SettingsMenu Visibility', "Hidden");
    infiniteDoNotDisturb();
    console.log(consoleLog);
}

function unlock() {
    unlockUI();
    dndState === false;
    failCount = 0;
    xapi.command('UserInterface Message Textline Clear');
    xapi.command('Conference DoNotDisturb Deactivate');
    xapi.config.set('UserInterface Features HideAll', false);
    xapi.config.set('UserInterface Features Call Start', 'Auto');
    xapi.config.set('UserInterface SettingsMenu Visibility', "Auto");
    console.log("Unlocking System...");
}

function tooManyFailedAttempts() {
    if (failTimer == 2) {
        console.log('Too many failed logins, system is now locked out. Access will restore shortly');
    }
    if (failTimer <= 120) {
        failTimer++;
        xapi.config.set('UserInterface Features HideAll', true);
        xapi.command('UserInterface Extensions Panel Remove', {
            PanelID: 'unlock_VC_system'
        }); // can i run this command as an array, rather than 3 separate commands?
        xapi.command('UserInterface Extensions Panel Remove', {
            PanelID: 'lock_VC_system'
        });
        xapi.command('UserInterface Extensions Panel Remove', {
            PanelID: 'chgPassphrase'
        });
        xapi.command('UserInterface Message TextLine Display', {
            Text: 'You\'ve entered in the incorrect passphrase too many times. Locking Down. Remaining Time: ' + (121 - failTimer),
            X: 5000,
            Y: 5000,
            Duration: 0
        });
        xapi.config.set('Standby Control', 'Off');
        setTimeout(tooManyFailedAttempts, 1000);
    } else {
        failTimer = -1;
        xapi.command('UserInterface Message Textline Clear');
        xapi.config.set('UserInterface Features HideAll', false);
        xapi.config.set('Standby Control', 'On');
        xapi.command('Standby Activate');
        lockDown();
        failCount = 0;
        return;
    }
}

xapi.status.on('Standby State', status => {
    if (status == 'Standby') {
        lockDown('Detecting "' + status + '", Locking down system');
    }
});

xapi.status.on('Standby State', status => {
    if (dndState !== true) {
        if (status == 'Enteringstandby') {
            lockDown('Detecting "' + status + '", Locking down system');
        }
    }
});

/*Panel Click Events*/
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch (event.PanelId) {
        case 'unlock_VC_system':
            getPasshrase();
            xapi.command('UserInterface Message TextInput Display', {
                Title: 'Unlock Full System Features',
                Text: 'Please enter your System Passphrase',
                FeedbackId: 'disengageSystemLock',
                Placeholder: 'Passphrase',
                InputType: 'SingleLine',
                KeyboardState: 'Open',
                SubmitText: 'Unlock',
                Duration: 30
            });
            console.log('Unlock Panel Opened');
            break;
        case 'lock_VC_system':
            lockDown('Manual Lock clicked, locking down');
            break;
        case 'chgPassphrase':
            xapi.command('UserInterface Message TextInput Display', {
                Title: 'Change Passphrase',
                Text: 'Please enter your original Passphrase',
                FeedbackId: 'password_confirmation',
                Placeholder: 'Original Passphrase',
                InputType: 'SingleLine',
                KeyboardState: 'Open',
                SubmitText: 'Verify',
                Duration: 30
            });
            console.log('Change Passphrase Panel Opened');
            break;
    }
});

/*User input response events*/
xapi.event.on('UserInterface Message TextInput Response', (event) => {
    switch (event.FeedbackId) {
        case 'disengageSystemLock':
            if (event.Text === passPhrase) {
                unlock();
            } else {
                if (failCount >= 5) {
                    failCount = 4;
                }
                if (failCount < 4) {
                    xapi.command('UserInterface Message Alert Display', {
                        Title: 'Uh-Oh',
                        Text: 'Incorrect Passphrase. Please Try again. Attempts Left: ' + (4 - failCount),
                        Duration: 10
                    });
                    console.log('User input the incorrect passphrase. FailCount: ' + failCount + 1);
                }
                if (failCount == 3) {
                    xapi.command('UserInterface Message TextLine Display', {
                        Text: 'You\'re about to be temporarily locked out of the system. Attempts Left: ' + (4 - failCount),
                        X: 5000,
                        Y: 1,
                        Duration: 0
                    });
                    xapi.command('UserInterface Message Alert Display', {
                        Title: '!!-Warning-!!',
                        Text: 'You\'re about to be temporarily locked out of the system. Attempts Left: ' + (4 - failCount),
                        Duration: 10
                    });
                }
                failCount++;
                if (failCount === 5) {
                    tooManyFailedAttempts();
                }
            }
            break;
        case 'password_confirmation':
            if (event.Text === passPhrase) {
                xapi.command('UserInterface Message TextInput Display', {
                    Title: 'Enter in New Passphrase',
                    Text: 'Please enter your new Passphrase. Case Sensitive; 1024 Character Limit',
                    FeedbackId: 'new_password',
                    Placeholder: 'New Passphrase',
                    InputType: 'SingleLine',
                    KeyboardState: 'Open',
                    SubmitText: 'Enter',
                    Duration: 30
                });
                console.log("Old Passphrase Verified");
            } else {
                xapi.command('UserInterface Message Alert Display', {
                    Title: 'Uh-Oh',
                    Text: 'You\'re passphrase did not match.<p>Please verify your original passphrase in order to make a change.',
                    Duration: 10
                });
                console.log("Unable to verify previous passphrase :/");
            }
            break;
        case 'new_password':
            if (event.Text !== passPhrase) {
                confirmPhrase = event.Text;
                xapi.command('UserInterface Message TextInput Display', {
                    Title: 'Verify New Passphrase',
                    Text: 'Please re-enter your new Passphrase',
                    FeedbackId: 'new_password_confirm',
                    Placeholder: 'Re-enter New Passphrase.',
                    InputType: 'SingleLine',
                    KeyboardState: 'Open',
                    SubmitText: 'Enter',
                    Duration: 30
                });
                console.log("New Password Entered, Verifying......");
            } else {
                xapi.command('UserInterface Message Alert Display', {
                    Title: 'Woops! Try Again',
                    Text: 'You can not re-use your existing passphrase as your new passphrase. <p>Please enter a new passphrase.',
                    Duration: 10
                });
            }
            break;
        case 'new_password_confirm':
            if (event.Text === confirmPhrase) {
                xapi.command('UserInterface Message Alert Display', {
                    Title: 'Success',
                    Text: 'Your passphrase was updated.',
                    Duration: 10
                });
                setNewPassphrase(confirmPhrase);
                confirmPhrase = null;
                passPhrase = event.Text;
                console.log('New Passphrase Varified. Passphrase Updated.');
            } else {
                xapi.command('UserInterface Message Alert Display', {
                    Title: 'Uh-Oh',
                    Text: 'The new phrase you entered did not match the previous entry. Please Try again.',
                    Duration: 10
                });
                confirmPhrase = null;
                console.log("New Passphrase verification failed. No changes made...");
            }
    }
});
