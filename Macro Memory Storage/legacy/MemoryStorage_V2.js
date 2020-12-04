const xapi = require('xapi');

var stored_Information;
var lastStore;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var memBlock = [{
        "id": "wallStatus",
        "value": "",
        "index" : 0
    },
    {
        "id": "slot_2",
        "value": "",
        "index" : 1
    },
    {
        "id": "slot_3",
        "value": "",
        "index" : 2
    },
    {
        "id": "slot_4",
        "value": "",
        "index" : 3
    },
    {
        "id": "slot_5",
        "value": "",
        "index" : 4
    },
    {
        "id": "slot_6",
        "value": "",
        "index" : 5
    },
    {
        "id": "slot_7",
        "value": "",
        "index" : 6
    },
    {
        "id": "slot_8",
        "value": "",
        "index" : 7
    },
    {
        "id": "slot_9",
        "value": "",
        "index" : 8
    },
    {
        "id": "slot_10",
        "value": "",
        "index" : 9
    },
    {
        "id": "slot_11",
        "value": "",
        "index" : 10
    },
    {
        "id": "slot_12",
        "value": "",
        "index" : 11
    },
    {
        "id": "slot_13",
        "value": "",
        "index" : 12
    },
    {
        "id": "slot_14",
        "value": "",
        "index" : 13
    },
    {
        "id": "slot_15",
        "value": "",
        "index" : 14
    },
    {
        "id": "slot_16",
        "value": "",
        "index" : 15
    },
    {
        "id": "slot_17",
        "value": "",
        "index" : 16
    },
    {
        "id": "slot_18",
        "value": "",
        "index" : 17
    },
    {
        "id": "slot_19",
        "value": "",
        "index" : 18
    },
    {
        "id": "slot_20",
        "value": "",
        "index" : 19
    }
];

function getMemInformation(){
  xapi.config.get('FacilityService Service 5 Name').then((config) => {
    stored_Information = config.split("~");
    for (let i = 0; i < memBlock.length; i++) {
      memBlock[i].value = stored_Information[i];
    }
   return;
  });
}

getMemInformation();

function memChain(){
  let memChain = '';
  for (let i = 0; i < memBlock.length; i++) {
    if (i < (memBlock.length - 1)){
    memChain = memChain + memBlock[i].value + "~";
      } else {
        memChain = memChain + memBlock[i].value;
      }
  }
  return memChain;
}

function memoryCapacity() {
    let percentage;
    let X;
    let Y;
    xapi.config.get('FacilityService Service 5 Name').then((config) => {
        X = [(config.length)/1024]*100;
        Y = [Math.round(X*100)/100];
        percentage = Y;
          console.log('Memory Capacity used: '+ percentage + '%');
    }).catch(e => console.error('Error'));
}

function updateMemBlock(newInfo, blockIndex) {
    getMemInformation();
    sleep(500).then(() => {
        switch (blockIndex) {
            case blockIndex:
                lastStore = memBlock[blockIndex].value;
                memBlock[blockIndex].value = newInfo;
                xapi.config.set('FacilityService Service 5 Name', memChain());
                if (lastStore !== newInfo) {
                    console.log('Memory Update ==> Block_Id: "' + memBlock[blockIndex].id + '" changed from: "' + lastStore + '" to: "' + newInfo +'.');
                    memoryCapacity();
                }
                break;
        }
    });
}

var testBlock = true;

if (testBlock === true) {
    updateMemBlock('100', 0);
    updateMemBlock('200', 1);
    updateMemBlock('300', 2);
    updateMemBlock('400', 3);
    updateMemBlock('005', 4);
    updateMemBlock('600', 5);
    updateMemBlock('700', 6);
    updateMemBlock('800', 7);
    updateMemBlock('900', 8);
    updateMemBlock('100', 9);
    updateMemBlock('200', 10);
    updateMemBlock('300', 11);
    updateMemBlock('400', 12);
    updateMemBlock('500', 13);
    updateMemBlock('600', 14);
    updateMemBlock('700', 15);
    updateMemBlock('800', 16);
    updateMemBlock('900', 17);
    updateMemBlock('100', 18);
    updateMemBlock('200', 19);
} else {
    updateMemBlock('a', 0);
    updateMemBlock('b', 1);
    updateMemBlock('c', 2);
    updateMemBlock('d', 3);
    updateMemBlock('e', 4);
    updateMemBlock('f', 5);
    updateMemBlock('g', 6);
    updateMemBlock('h', 7);
    updateMemBlock('i', 8);
    updateMemBlock('j', 9);
    updateMemBlock('k', 10);
    updateMemBlock('l', 11);
    updateMemBlock('m', 12);
    updateMemBlock('n', 13);
    updateMemBlock('o', 14);
    updateMemBlock('p', 15);
    updateMemBlock('q', 16);
    updateMemBlock('r', 17);
    updateMemBlock('s', 18);
    updateMemBlock('t', 19);
}
