const xapi = require('xapi');

xapi.event.on('UserInterface Extensions Widget Action', (event) => {
    if (event.Type === 'released') {
        let split = event.WidgetId.split('d');
        let die = parseInt(split[1], 10);
        switch (event.WidgetId) {
            case event.WidgetId:
                let alert = Math.floor(Math.random() * die) + 1;
                xapi.command('UserInterface Extensions Widget SetValue', {
                    Value: alert,
                    WidgetId: 'd' + split[1] + '_txt'
                }).catch(e => console.error('Command error'));
                if (event.WidgetId === 'd20') {
                    if (alert === 20) {
                        xapi.command('UserInterface Message Alert Display', {
                            Title: '!!! NAT 20 !!!',
                            Text: 'Woohoo!!! p> Your result will be stored in dice roller menu',
                            Duration: 5
                        }).catch(e => console.error('Command error'));
                    } else if (alert === 1) {
                        xapi.command('UserInterface Message Alert Display', {
                            Title: 'Uh-Oh... You Botched',
                            Text: '.....<p>Your result will be stored in dice roller menu',
                            Duration: 5
                        }).catch(e => console.error('Command error'));
                    } else {
                        xapi.command('UserInterface Message Alert Display', {
                            Title: 'Role => ' + alert,
                            Text: 'Your result will be stored in dice roller menu.',
                            Duration: 5
                        }).catch(e => console.error('Command error'));
                    }
                } else {
                    xapi.command('UserInterface Message Alert Display', {
                        Title: 'Role => ' + alert,
                        Text: 'Your result will be stored in dice roller menu.',
                        Duration: 5
                    }).catch(e => console.error('Command error'));
                }
                console.log('User rolled a "' + event.WidgetId + '". Result => ' + alert);
                break;
        }
    }
});
