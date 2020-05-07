const xapi = require('xapi');

let secondsAlive;

function bootStatus() {
    var c = 1;
    xapi.status.get('SystemUnit Uptime').then((UpTime) => {
        secondsAlive = UpTime;
        if (secondsAlive >= 65) {
            //run scripts you need after the macro environment crashes
            console.log("Macro Script interrupted. Either script update or crash.");
            return;
        }
        do {
            // Run scripts you need after a reboot
            return;
        }
        while (secondsAlive <= 64);
        console.log('Check UpTime = ' + UpTime);
    });
}
