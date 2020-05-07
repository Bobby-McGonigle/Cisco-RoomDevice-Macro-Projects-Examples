const xapi = require('xapi');

let secondsAlive;

function bootStatus() {
    xapi.status.get('SystemUnit Uptime').then((UpTime) => {
        secondsAlive = UpTime;
        if (secondsAlive >= 65) {
            /*
            Run xApi you need HERE after the macro environment crashes
            */
            console.log("Macro Script interrupted. Either script update or crash.");
            return;
        }
        do {
            /*
            Run xApi you need HERE after your system restarts
            */
            return;
        }
        while (secondsAlive <= 64);
        console.log('Check UpTime = ' + UpTime);
    });
}
