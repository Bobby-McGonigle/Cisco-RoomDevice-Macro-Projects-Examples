const xapi = require('xapi');

var dhcpReservation = ‘xx.xxx.xxx.xxx’; // Enter Expected IPv4 address here. DHCP Reservation recommended
var netHealth;
var counter;

function checkNetStatus() { // Pulls the IPv4 address from the system every 10 seconds then updates ‘netHealth’ variable
    var x = 10;
    xapi.status.get('Network 1 IPv4 Address').then((IPv4) => {
        netHealth = IPv4;
    });
    setTimeout(checkNetStatus, x * 1000);
}

function checkNetHealth() { // Check to see if the netHealth matches the target IPv4 address above ever 3 minutes.
    var y = 3;
    if (netHealth == dhcpReservation) { // If the system is online, then it will print this status and resets the counter.
        console.log('System is online');
        counter = 0;
    }
    if (netHealth != dhcpReservation) { // if the system is offline, then the system will log the first incident and raise the counter by 1
        console.log('System fell offline');
        counter++;
    }
    if (counter >= 2) { // if the system reports that it is offline 2 times in a row, then it logs the incident. Add in additional configs and commands here.
        console.log('System has failed to re-connect "' + counter + '" times');
        xapi.command('UserInterface Message Alert Display', {
            Title: 'System Offline',
            Text: "Uh-Oh, something happened... Fail count = " + counter,
            Duration: 60
        }); // example command
    }
    setTimeout(checkNetHealth, y * 1000 * 60);
}

checkNetStatus();
checkNetHealth();
